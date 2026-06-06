import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import AILog from "@/models/AILog";
import { classifyIntent } from "@/lib/ai/classifier";
import { retrieveRelevantProcedures, retrieveActiveAlerts } from "@/lib/ai/retriever";
import { fetchOpenRouterCompletion, OpenRouterMessage } from "@/lib/ai/openrouter";

// In-memory rate limiting map (userId -> { count, resetTime })
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 20;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    // Allow any citizen or guest to use it, but track them. If no session, use IP or 'guest'
    const userId = session ? session.id : 'guest-' + (req.headers.get('x-forwarded-for') || 'unknown');
    const userRole = session ? session.role : 'guest';

    // 1. Rate Limiting Check
    const now = Date.now();
    const rlData = rateLimitMap.get(userId);
    if (rlData) {
      if (now < rlData.resetTime) {
        if (rlData.count >= MAX_REQUESTS_PER_MINUTE) {
          return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429 });
        }
        rlData.count++;
      } else {
        rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
      }
    } else {
      rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Get the latest user query
    const lastUserMessage = messages[messages.length - 1].content;
    
    await dbConnect();

    // 2. Classify Intent
    const intent = classifyIntent(lastUserMessage);
    
    // 3. Retrieval Augmented Context
    let contextString = "";
    
    if (intent === "Procedure") {
      const procedures = await retrieveRelevantProcedures(lastUserMessage);
      if (procedures.length > 0) {
        contextString += `\nRELEVANT PROCEDURES FOUND IN DATABASE:\n`;
        procedures.forEach((p: any) => {
          contextString += `Procedure ID: ${p.id}\nTitle: ${p.title}\nSummary: ${p.summary}\nSteps: ${p.steps.join(' -> ')}\nOfficial Portal: ${p.url}\n\n`;
        });
        contextString += `INSTRUCTION: Base your answer on the procedure above and cite the Procedure ID.\n`;
      }
    }
    
    // Inject alerts for general and emergency queries
    if (intent === "Emergency" || intent === "General Question") {
      const alerts = await retrieveActiveAlerts();
      if (alerts.length > 0) {
        contextString += `\nACTIVE EMERGENCY ALERTS IN SYSTEM:\n`;
        alerts.forEach((a: any) => {
          contextString += `[${a.severity}] ${a.title} - Target Area: ${a.area}\nDescription: ${a.description}\n\n`;
        });
      }
    }

    // 4. Build System Prompt
    let systemPrompt = `You are the National Emergency Authority AI Assistant.
You help citizens with emergencies, safety guidance, disaster response, government procedures, and platform navigation.

STRICT RULES:
1. Never claim emergency services were dispatched unless the system confirms it.
2. Never fabricate official information.
3. Keep responses concise and highly actionable.
4. If the user asks for nearby emergency services (e.g., nearest hospital, police station, blood bank, shelter), briefly explain that the Emergency Services Locator can help and provide this exact markdown link: [Find Nearby Services](/services). DO NOT just reply with the link.`;

    if (intent === "Emergency") {
      systemPrompt = `[CRITICAL EMERGENCY MODE ACTIVE]
You are the National Emergency Authority AI Assistant.
The user is reporting an EMERGENCY.
STRICT RULES:
1. Prioritize immediate safety and survival instructions in bullet points.
2. Advise the user to USE THE SOS BUTTON immediately.
3. Tell them what information to prepare for authorities.
4. Keep it brief. Every second counts.
` + systemPrompt;
    }

    if (contextString) {
      systemPrompt += `\nSYSTEM CONTEXT (DO NOT INVENT, USE THIS):\n${contextString}`;
    }

    // 5. Construct Final Message Payload
    const payload: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-5) // Keep last 5 messages for context
    ];

    // 6. Call OpenRouter
    let result;
    try {
      result = await fetchOpenRouterCompletion(payload);
    } catch (apiErr: any) {
      if (apiErr.message === "API_KEY_MISSING" || apiErr.message === "API_ERROR") {
        return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
      }
      throw apiErr;
    }

    // 7. Log Response
    try {
      await AILog.create({
        userId,
        userRole,
        sessionId: session?.sessionId || 'guest',
        question: lastUserMessage,
        modelUsed: result.modelUsed,
        intentClassification: intent
      });
    } catch (logErr) {
      console.error("Failed to write AI Log:", logErr); // Don't crash the request
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      intent,
      modelUsed: result.modelUsed
    }, { status: 200 });

  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

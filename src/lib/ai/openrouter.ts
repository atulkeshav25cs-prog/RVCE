export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function fetchOpenRouterCompletion(messages: OpenRouterMessage[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const primaryModel = process.env.OPENROUTER_PRIMARY_MODEL || "deepseek/deepseek-chat";
  const fallbackModel = process.env.OPENROUTER_FALLBACK_MODEL || "openai/gpt-4o-mini";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://nea-platform.gov.in", 
      "X-Title": "National Emergency Authority",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      // OpenRouter supports model fallbacks array
      models: [primaryModel, fallbackModel, "meta-llama/llama-3.3-70b-instruct"],
      route: "fallback",
      messages: messages,
      temperature: 0.3, // Low temperature for deterministic/safe responses
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API Error:", response.status, errorText);
    throw new Error("API_ERROR");
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    modelUsed: data.model || primaryModel
  };
}

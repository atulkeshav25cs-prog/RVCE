"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ShieldAlert, Loader2, Bot, User, Trash2 } from "lucide-react";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  isEmergency?: boolean;
}

export default function CitizenAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nea_ai_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {}
    } else {
      setMessages([{
        role: "assistant",
        content: "Hello. I am the National Emergency Authority AI Assistant. How can I help you today?"
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("nea_ai_history", JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleClear = () => {
    if (confirm("Clear conversation history?")) {
      const init = [{ role: "assistant", content: "Conversation cleared. How can I help you?" as string }];
      setMessages(init as Message[]);
      localStorage.setItem("nea_ai_history", JSON.stringify(init));
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMsg = "AI Assistant is temporarily unavailable.";
        if (res.status === 429) errorMsg = "You are sending messages too quickly. Please wait a moment.";
        throw new Error(errorMsg);
      }

      const isEmergency = data.intent === "Emergency";
      
      setMessages([...newMessages, { 
        role: "assistant", 
        content: data.content,
        isEmergency 
      }]);

    } catch (err: any) {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: err.message || "AI Assistant is temporarily unavailable." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#003366] hover:bg-[#002244] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 z-50 ring-4 ring-white"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90%] max-w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-200 font-sans">
          {/* Header */}
          <div className="bg-[#003366] p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center text-white">
              <Bot className="w-5 h-5 mr-2" />
              <div>
                <h3 className="font-bold text-sm">NEA AI Assistant</h3>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest">Official Support</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleClear} className="text-blue-200 hover:text-white p-1" title="Clear Chat">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F4F5F7] space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  m.role === "user" 
                    ? "bg-[#003366] text-white rounded-br-none" 
                    : m.isEmergency 
                      ? "bg-red-50 border border-red-200 text-slate-800 rounded-bl-none shadow-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                }`}>
                  {m.role === "assistant" && (
                    <div className={`flex items-center mb-1 text-[10px] font-bold uppercase tracking-wider ${m.isEmergency ? 'text-red-600' : 'text-slate-400'}`}>
                      {m.isEmergency ? <ShieldAlert className="w-3 h-3 mr-1" /> : <Bot className="w-3 h-3 mr-1" />}
                      {m.isEmergency ? "Emergency Guidance" : "AI Assistant"}
                    </div>
                  )}
                  
                  <div className="leading-relaxed whitespace-pre-wrap word-break">
                    {formatText(m.content)}
                  </div>

                  {m.isEmergency && (
                    <div className="mt-4 border-t border-red-200 pt-3">
                      <a 
                        href="/citizen/dashboard" 
                        className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg shadow-sm transition-colors text-xs uppercase tracking-widest"
                      >
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Open SOS Now
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-[#003366]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about procedures or emergencies..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] text-slate-800 placeholder-slate-400"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#003366] hover:bg-[#002244] disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400">AI responses may contain inaccuracies. In life-threatening situations, use SOS immediately.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

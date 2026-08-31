"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, RefreshCw, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! I am Omkar's Portfolio AI Assistant. Ask me anything about his projects, skills, education, experience, or recent changelog updates!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What projects has Omkar built?",
    "What technologies does Omkar use?",
    "What is Omkar's experience?",
    "What is Omkar's education?",
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError("");
    const userMessage: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send message along with chat history (excluding current user message to avoid duplication in history)
      const res = await api.chatWithAssistant(textToSend, messages);
      if (res && res.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: res.reply }]);
      } else {
        throw new Error("Invalid response format received from assistant.");
      }
    } catch (err: any) {
      console.error("AI Assistant error:", err);
      setError(err.message || "Failed to get reply from AI assistant. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I ran into an issue connecting to my knowledge base. The AI server might be offline or rate-limited.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      <AnimatePresence>
        {/* Chat Widget Panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[90vw] sm:w-[400px] h-[550px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 text-slate-900 dark:text-white"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-105 dark:border-zinc-850/80 bg-slate-50 dark:bg-zinc-900/60 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-lime-100 dark:bg-lime-950/40 text-lime-750 dark:text-lime-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider">Portfolio AI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online Context-Engine</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="px-5 py-2 bg-rose-500/10 border-b border-rose-500/20 text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center justify-between gap-2">
                <span>{error}</span>
                <button onClick={() => setError("")} className="underline hover:text-white cursor-pointer">Dismiss</button>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => {
                const isUser = msg.sender === "user";
                return (
                  <div key={i} className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-lime-100 dark:bg-lime-950/40 text-lime-750 dark:text-lime-400 flex items-center justify-center shrink-0">
                        <Sparkles size={13} />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                        isUser
                          ? "bg-lime-600 dark:bg-lime-500 text-white dark:text-black font-semibold rounded-tr-none"
                          : "bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-350 rounded-tl-none border border-slate-200/40 dark:border-zinc-800/40"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {loading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-lime-100 dark:bg-lime-950/40 text-lime-750 dark:text-lime-400 flex items-center justify-center shrink-0">
                    <Loader2 size={13} className="animate-spin" />
                  </div>
                  <div className="bg-slate-100 dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/40 px-4 py-3 rounded-2xl rounded-tl-none text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span>Analyzing Portfolio Context</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce delay-75" />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce delay-150" />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce delay-300" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips (Only visible when history has 1 message) */}
            {messages.length === 1 && (
              <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-950/50">
                <p className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle size={10} /> Suggested Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-[10px] font-bold bg-white dark:bg-zinc-900 hover:border-lime-500 dark:hover:border-lime-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors text-left cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-105 dark:border-zinc-850/80 bg-slate-55 dark:bg-zinc-900/40 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Omkar's projects, experience..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 focus:dark:border-lime-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-bold disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer shadow"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black shadow-2xl active:scale-95 transition-all cursor-pointer flex items-center justify-center group relative overflow-hidden"
        aria-label="Open AI Assistant"
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={22} /> : <MessageSquare size={22} className="animate-pulse" />}
      </button>
    </div>
  );
}

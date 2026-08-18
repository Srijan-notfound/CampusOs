import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
} from "lucide-react";
import api from "../services/api";

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! I'm your CampusOS AI assistant. Ask me anything about your tasks, priorities, or study plan.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessage("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: userMessage,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            response.data.response ||
            "I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("AI error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Something went wrong while contacting CampusOS AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-5 pb-10 pt-28 sm:px-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-sm text-indigo-400">
          <Sparkles size={16} />
          CampusOS AI
        </div>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          AI Assistant
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Get help planning your academic workload.
        </p>
      </motion.div>

      {/* Chat */}
      <div className="mt-8 flex min-h-[600px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Bot size={20} />
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              CampusOS AI
            </h2>

            <p className="text-xs text-emerald-400">
              Online
            </p>
          </div>

        </div>

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">

          {messages.map((item, index) => {
            const isUser = item.role === "user";

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={`flex gap-3 ${
                  isUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isUser
                      ? "bg-indigo-500 text-white"
                      : "border border-white/[0.06] bg-white/[0.03] text-white/70"
                  }`}
                >
                  {item.content}
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
                    <User size={18} />
                  </div>
                )}

              </motion.div>
            );
          })}

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Bot size={18} />
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                Thinking...
              </div>
            </motion.div>
          )}

        </div>

        {/* Input */}
        <div className="border-t border-white/[0.07] p-4">

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3"
          >

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask CampusOS AI..."
              disabled={loading}
              className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-indigo-500/40 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>

          </form>

          <p className="mt-2 px-1 text-[11px] text-white/20">
            CampusOS AI can analyze your current tasks to help
            prioritize your workload.
          </p>

        </div>   

      </div>
    </main>
  );
}
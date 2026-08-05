"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Plus, AlertTriangle, Sparkles, Bot } from "lucide-react";
import type { AIMessage, AIConversation } from "@/types";
import {
  getConversations,
  saveConversations,
  getActiveConversationId,
  setActiveConversationId,
  createConversation,
  titleFromMessage,
  makeUserMessage,
  makeAssistantMessage,
} from "@/lib/ai";
import Sidebar from "./Sidebar";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const SUGGESTIONS = [
  "Explain the Pythagorean theorem with an example",
  "Solve: 2x + 5 = 13 step by step",
  "What is photosynthesis? Explain simply",
  "How do I find the area of a circle?",
];

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
  image?: string | null;
}

export default function DoubtSolver() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load persisted state once on mount.
  useEffect(() => {
    setConversations(getConversations());
    setActiveId(getActiveConversationId());
  }, []);

  // Persist conversations whenever they change.
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  // Persist active id.
  useEffect(() => {
    setActiveConversationId(activeId);
  }, [activeId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  // Auto-scroll to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeConversation?.messages, isStreaming]);

  const appendMessages = useCallback((convId: string, newMessages: AIMessage[]) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, ...newMessages], updatedAt: Date.now() }
          : c
      )
    );
  }, []);

  const streamCompletion = useCallback(
    async (convId: string, apiMessages: ApiMessage[], assistantMsgId: string) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);
      setStreamingId(assistantMsgId);
      setError(null);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let msg = `Request failed (${res.status}).`;
          try {
            const data = (await res.json()) as { error?: string };
            if (data?.error) msg = data.error;
          } catch {
            /* ignore */
          }
          if (res.status === 429) {
            msg = "You're sending requests too quickly. Please wait a moment and try again.";
          }
          throw new Error(msg);
        }
        if (!res.body) throw new Error("No response stream received.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: acc } : m
                    ),
                  }
                : c
            )
          );
        }
      } catch (err) {
        if (controller.signal.aborted) return; // user stopped — keep partial content
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong. Please try again.";
        setError(message);
        // Remove the empty assistant placeholder so no blank bubble lingers.
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.filter(
                    (m) => !(m.id === assistantMsgId && m.content.length === 0)
                  ),
                }
              : c
          )
        );
      } finally {
        setIsStreaming(false);
        setStreamingId(null);
        abortRef.current = null;
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string, image?: string | null) => {
      if (isStreaming) return;
      setError(null);

      let conv = activeConversation;

      // Start a fresh conversation if none is active or the active one is used.
      if (!conv || conv.messages.length > 0) {
        const newConv = createConversation();
        newConv.title = titleFromMessage(text);
        setConversations((prev) => [newConv, ...prev]);
        setActiveId(newConv.id);
        conv = newConv;
      }

      // `conv` is guaranteed non-null here: either it was an existing
      // conversation, or it was just replaced with a fresh one above.
      const conversationId = conv.id;
      const userMsg = makeUserMessage(text, image);
      const assistantMsg = makeAssistantMessage("");
      appendMessages(conversationId, [userMsg, assistantMsg]);

      const apiMessages: ApiMessage[] = [...conv.messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
        image: m.role === "user" ? m.image : undefined,
      }));

      await streamCompletion(conversationId, apiMessages, assistantMsg.id);
    },
    [activeConversation, isStreaming, appendMessages, streamCompletion]
  );

  const regenerate = useCallback(async () => {
    if (!activeConversation || isStreaming) return;
    const msgs = activeConversation.messages;
    if (msgs.length < 2) return;
    const last = msgs[msgs.length - 1];
    if (last.role !== "assistant") return;

    const trimmed = msgs.slice(0, -1);
    const assistantMsg = makeAssistantMessage("");
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, messages: [...trimmed, assistantMsg], updatedAt: Date.now() }
          : c
      )
    );

    const apiMessages: ApiMessage[] = trimmed.map((m) => ({
      role: m.role,
      content: m.content,
      image: m.role === "user" ? m.image : undefined,
    }));

    await streamCompletion(activeConversation.id, apiMessages, assistantMsg.id);
  }, [activeConversation, isStreaming, streamCompletion]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    setActiveId(null);
    setError(null);
    setSidebarOpen(false);
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  const clearAll = useCallback(() => {
    abortRef.current?.abort();
    setConversations([]);
    setActiveId(null);
    setError(null);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setError(null);
    setSidebarOpen(false);
  }, []);

  const handleSuggestion = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage]
  );

  const showRegenerate =
    !!activeConversation &&
    activeConversation.messages.length >= 2 &&
    activeConversation.messages[activeConversation.messages.length - 1].role === "assistant" &&
    !isStreaming;

  return (
    <div className="ai-app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        open={sidebarOpen}
        onSelect={selectConversation}
        onNew={newChat}
        onDelete={deleteConversation}
        onClearAll={clearAll}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="ai-main">
        <header className="ai-header">
          <button
            type="button"
            className="ai-header-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open chat history"
            title="Chat history"
          >
            <Menu size={20} />
          </button>
          <div className="ai-header-title">
            <Bot size={18} className="ai-header-logo" />
            <span>AI Doubt Solver</span>
          </div>
          <button
            type="button"
            className="ai-header-btn"
            onClick={newChat}
            aria-label="New chat"
            title="New chat"
          >
            <Plus size={20} />
          </button>
        </header>

        {error && (
          <div className="ai-error" role="alert">
            <AlertTriangle size={16} />
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}

        <div className="ai-scroll" ref={scrollRef}>
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <Sparkles size={28} />
              </div>
              <h2>How can I help you today?</h2>
              <p>
                Ask any doubt from your NCERT syllabus. I'll explain it step-by-step with
                formulas, tables, and examples.
              </p>
              <div className="ai-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="ai-chip"
                    onClick={() => handleSuggestion(s)}
                    disabled={isStreaming}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-messages" aria-live="polite" aria-relevant="additions">
              {activeConversation.messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isStreaming={isStreaming && m.id === streamingId}
                  showRegenerate={showRegenerate && i === activeConversation.messages.length - 1}
                  onRegenerate={regenerate}
                />
              ))}
            </div>
          )}
        </div>

        <div className="ai-input-area">
          <ChatInput
            onSend={sendMessage}
            onStop={stop}
            isStreaming={isStreaming}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
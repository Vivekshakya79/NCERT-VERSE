"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Plus, AlertTriangle, Sparkles, Bot, RefreshCw, ChevronDown } from "lucide-react";
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
  toApiMessages,
  trimHistory,
  MAX_MESSAGE_LENGTH,
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

const CLASS_OPTIONS = [
  "General",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const CLASS_STORAGE_KEY = "sv-ai-class";

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
  const [draft, setDraft] = useState<{ text: string; key: number } | null>(null);
  const [studentClass, setStudentClass] = useState<string>("General");

  const abortRef = useRef<AbortController | null>(null);
  const streamingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const activeConvRef = useRef<AIConversation | null>(null);
  const classRef = useRef("General");
  const draftKeyRef = useRef(0);

  // Load persisted state once on mount. Runs only in the browser (after
  // hydration) so the server HTML always renders the empty welcome state —
  // lazy initializers would read localStorage on the client and cause a
  // hydration mismatch, so this deliberate effect is required here.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setConversations(getConversations());
    setActiveId(getActiveConversationId());
    const savedClass = localStorage.getItem(CLASS_STORAGE_KEY);
    if (savedClass && CLASS_OPTIONS.includes(savedClass)) {
      setStudentClass(savedClass);
      classRef.current = savedClass;
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist conversations whenever they change. Skip while streaming so we
  // don't write localStorage on every streamed token.
  useEffect(() => {
    if (!isStreaming) saveConversations(conversations);
  }, [conversations, isStreaming]);

  // Persist active id.
  useEffect(() => {
    setActiveConversationId(activeId);
  }, [activeId]);

  // Persist the selected class.
  useEffect(() => {
    localStorage.setItem(CLASS_STORAGE_KEY, studentClass);
    classRef.current = studentClass;
  }, [studentClass]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  // Keep a ref of the active conversation so callbacks stay stable during
  // streaming (avoids re-rendering the memoized input on every token).
  useEffect(() => {
    activeConvRef.current = activeConversation;
  }, [activeConversation]);

  // Track whether the user is scrolled near the bottom of the chat.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  // Auto-scroll to the latest message when the user is near the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
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
      streamingRef.current = true;
      setIsStreaming(true);
      setStreamingId(assistantMsgId);
      setError(null);
      stickToBottomRef.current = true;

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            context: { class: classRef.current === "General" ? undefined : classRef.current },
          }),
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
        let lastFlush = 0;
        // Throttle state updates so long responses don't re-render the whole
        // chat on every token (~25 updates/sec is smooth enough for display).
        const flush = () => {
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
        };
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const now = Date.now();
          if (now - lastFlush >= 40) {
            lastFlush = now;
            flush();
          }
        }
        flush(); // final flush with the complete response
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
        streamingRef.current = false;
        setIsStreaming(false);
        setStreamingId(null);
        abortRef.current = null;
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string, image?: string | null) => {
      if (streamingRef.current) return;
      const trimmed = text.trim();
      if (!trimmed && !image) return;
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`);
        return;
      }
      setError(null);
      stickToBottomRef.current = true;

      let conv = activeConvRef.current;

      // Multi-turn: append to the active conversation when one exists, and
      // only start a fresh conversation when there is none.
      if (!conv) {
        const newConv = createConversation();
        newConv.title = titleFromMessage(trimmed || "Image question");
        setConversations((prev) => [newConv, ...prev]);
        setActiveId(newConv.id);
        conv = newConv;
      }

      const conversationId = conv.id;
      const userMsg = makeUserMessage(trimmed, image);
      const assistantMsg = makeAssistantMessage("");
      appendMessages(conversationId, [userMsg, assistantMsg]);

      // Send the full history (bounded) so the AI keeps follow-up context.
      const apiMessages: ApiMessage[] = toApiMessages(trimHistory([...conv.messages, userMsg]));

      await streamCompletion(conversationId, apiMessages, assistantMsg.id);
    },
    [appendMessages, streamCompletion]
  );

  const regenerate = useCallback(async () => {
    const conv = activeConvRef.current;
    if (!conv || streamingRef.current) return;
    const msgs = conv.messages;
    if (msgs.length < 2) return;
    const last = msgs[msgs.length - 1];
    if (last.role !== "assistant") return;

    const trimmed = msgs.slice(0, -1);
    const assistantMsg = makeAssistantMessage("");
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? { ...c, messages: [...trimmed, assistantMsg], updatedAt: Date.now() }
          : c
      )
    );

    const apiMessages: ApiMessage[] = toApiMessages(trimHistory(trimmed));

    await streamCompletion(conv.id, apiMessages, assistantMsg.id);
  }, [streamCompletion]);

  const retry = useCallback(async () => {
    const conv = activeConvRef.current;
    if (!conv || streamingRef.current) return;
    const msgs = conv.messages;
    if (msgs.length === 0) return;
    const last = msgs[msgs.length - 1];

    let history: AIMessage[];
    if (last.role === "user") {
      history = msgs;
    } else if (last.role === "assistant") {
      // Partial/failed assistant response — drop it and regenerate.
      history = msgs.slice(0, -1);
    } else {
      return;
    }
    if (history.length === 0) return;

    const assistantMsg = makeAssistantMessage("");
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? { ...c, messages: [...history, assistantMsg], updatedAt: Date.now() }
          : c
      )
    );

    const apiMessages: ApiMessage[] = toApiMessages(trimHistory(history));

    await streamCompletion(conv.id, apiMessages, assistantMsg.id);
  }, [streamCompletion]);

  const editMessage = useCallback((messageId: string) => {
    const conv = activeConvRef.current;
    if (!conv || streamingRef.current) return;
    const idx = conv.messages.findIndex((m) => m.id === messageId);
    if (idx < 0) return;
    const target = conv.messages[idx];
    if (target.role !== "user") return;
    // Truncate the conversation at this message so the student can rephrase.
    const kept = conv.messages.slice(0, idx);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id ? { ...c, messages: kept, updatedAt: Date.now() } : c
      )
    );
    setDraft({ text: target.content, key: ++draftKeyRef.current });
    setError(null);
  }, []);

  const quickAction = useCallback(
    (prompt: string) => {
      void sendMessage(prompt);
    },
    [sendMessage]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    streamingRef.current = false;
    setActiveId(null);
    setError(null);
    setSidebarOpen(false);
    setDraft(null);
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
    streamingRef.current = false;
    setConversations([]);
    setActiveId(null);
    setError(null);
    setDraft(null);
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
          <div className="ai-class-select" title="Set your class for tailored answers">
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              aria-label="Select your class"
              disabled={isStreaming}
            >
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="ai-class-chevron" aria-hidden="true" />
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
            <div className="ai-error-actions">
              <button
                type="button"
                className="ai-error-retry"
                onClick={retry}
                disabled={isStreaming}
              >
                <RefreshCw size={14} />
                Retry
              </button>
              <button
                type="button"
                className="ai-error-close"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="ai-scroll" ref={scrollRef} onScroll={handleScroll}>
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <Sparkles size={28} />
              </div>
              <h2>How can I help you today?</h2>
              <p>
                Ask any doubt from your NCERT syllabus. I&apos;ll explain it step-by-step with
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
                  onEdit={editMessage}
                  onQuickAction={quickAction}
                  showQuickActions={
                    !isStreaming &&
                    i === activeConversation.messages.length - 1 &&
                    m.role === "assistant" &&
                    m.content.length > 0
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="ai-input-area">
          <ChatInput
            key={draft ? draft.key : "main"}
            onSend={sendMessage}
            onStop={stop}
            isStreaming={isStreaming}
            disabled={false}
            initialText={draft?.text ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
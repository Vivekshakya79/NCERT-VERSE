"use client";

import { memo, useState, useCallback } from "react";
import { Bot, User, Copy, Check, RefreshCw, Pencil } from "lucide-react";
import type { AIMessage } from "@/types";
import Markdown from "./Markdown";

const QUICK_ACTIONS = [
  { label: "Explain this", prompt: "Can you explain this in simpler terms?" },
  { label: "Give an example", prompt: "Give me a concrete example of this." },
  { label: "Make it simpler", prompt: "Please explain this more simply." },
  { label: "Practice question", prompt: "Give me a practice question on this topic." },
];

interface MessageBubbleProps {
  message: AIMessage;
  isStreaming?: boolean;
  showRegenerate?: boolean;
  onRegenerate?: () => void;
  onEdit?: (id: string) => void;
  onQuickAction?: (prompt: string) => void;
  showQuickActions?: boolean;
}

function MessageBubble({
  message,
  isStreaming,
  showRegenerate,
  onRegenerate,
  onEdit,
  onQuickAction,
  showQuickActions,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [message.content]);

  if (message.role === "user") {
    return (
      <div className="ai-msg ai-msg-user">
        <div className="ai-msg-avatar" aria-hidden="true">
          <User size={16} />
        </div>
        <div className="ai-msg-body">
          {message.image && (
            <div className="ai-msg-image">
              <img src={message.image} alt="Uploaded homework" />
            </div>
          )}
          <div className="ai-bubble ai-bubble-user">{message.content}</div>
          {!isStreaming && onEdit && (
            <div className="ai-msg-actions">
              <button
                type="button"
                className="ai-action"
                onClick={() => onEdit(message.id)}
                aria-label="Edit message"
                title="Edit message"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ai-msg ai-msg-assistant">
      <div className="ai-msg-avatar ai-msg-avatar-bot" aria-hidden="true">
        <Bot size={16} />
      </div>
      <div className="ai-msg-body">
        <div className="ai-bubble ai-bubble-assistant">
          {isStreaming && message.content.length === 0 ? (
            <div className="ai-thinking" role="status" aria-label="Thinking">
              <span />
              <span />
              <span />
            </div>
          ) : (
            <Markdown content={message.content} />
          )}
          {isStreaming && message.content.length > 0 && (
            <span className="ai-stream-cursor" aria-hidden="true" />
          )}
        </div>
        {!isStreaming && message.content.length > 0 && (
          <div className="ai-msg-actions">
            <button
              type="button"
              className="ai-action"
              onClick={copy}
              aria-label="Copy response"
              title="Copy response"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
            {showRegenerate && onRegenerate && (
              <button
                type="button"
                className="ai-action"
                onClick={onRegenerate}
                aria-label="Regenerate response"
                title="Regenerate response"
              >
                <RefreshCw size={14} />
                Regenerate
              </button>
            )}
          </div>
        )}
        {showQuickActions && onQuickAction && (
          <div className="ai-quick-actions">
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.label}
                type="button"
                className="ai-quick-action"
                onClick={() => onQuickAction(qa.prompt)}
              >
                {qa.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
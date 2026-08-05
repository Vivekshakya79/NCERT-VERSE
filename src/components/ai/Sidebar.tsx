"use client";

import { memo } from "react";
import { Plus, Trash2, MessageSquare, X, Sparkles } from "lucide-react";
import type { AIConversation } from "@/types";

interface SidebarProps {
  conversations: AIConversation[];
  activeId: string | null;
  open: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

function Sidebar({
  conversations,
  activeId,
  open,
  onSelect,
  onNew,
  onDelete,
  onClearAll,
  onClose,
}: SidebarProps) {
  return (
    <>
      {open && <div className="ai-sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`ai-sidebar${open ? " ai-sidebar-open" : ""}`} aria-label="Chat history">
        <div className="ai-sidebar-head">
          <button type="button" className="btn btn-p ai-new-chat" onClick={onNew}>
            <Plus size={16} />
            New Chat
          </button>
          <button
            type="button"
            className="ai-sidebar-close"
            onClick={onClose}
            aria-label="Close chat history"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ai-sidebar-label">Recent Chats</div>

        <div className="ai-sidebar-list">
          {conversations.length === 0 ? (
            <div className="ai-sidebar-empty">
              <Sparkles size={20} />
              <p>No chats yet. Start a new conversation!</p>
            </div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className={`ai-chat-item${c.id === activeId ? " ai-chat-item-active" : ""}`}
              >
                <button
                  type="button"
                  className="ai-chat-item-main"
                  onClick={() => onSelect(c.id)}
                  aria-current={c.id === activeId ? "true" : undefined}
                >
                  <MessageSquare size={15} />
                  <span className="ai-chat-item-title">{c.title}</span>
                </button>
                <button
                  type="button"
                  className="ai-chat-item-del"
                  onClick={() => onDelete(c.id)}
                  aria-label={`Delete chat: ${c.title}`}
                  title="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {conversations.length > 0 && (
          <button type="button" className="ai-clear-all" onClick={onClearAll}>
            <Trash2 size={14} />
            Clear all chats
          </button>
        )}
      </aside>
    </>
  );
}

export default memo(Sidebar);
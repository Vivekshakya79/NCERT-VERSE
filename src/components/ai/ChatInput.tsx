"use client";

import { memo, useRef, useState, useCallback, type KeyboardEvent, type ChangeEvent } from "react";
import { Send, Square, ImagePlus, X, Loader2 } from "lucide-react";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB

interface ChatInputProps {
  onSend: (text: string, image?: string | null) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [readingImage, setReadingImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSend = !disabled && !isStreaming && (text.trim().length > 0 || !!image);

  const handleFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload an image file (PNG, JPG, etc.).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image is too large. Please keep it under 4 MB.");
      return;
    }
    setImageError(null);
    setReadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(typeof reader.result === "string" ? reader.result : null);
      setReadingImage(false);
    };
    reader.onerror = () => {
      setImageError("Could not read that image. Please try another one.");
      setReadingImage(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const submit = useCallback(() => {
    if (!canSend) return;
    onSend(text.trim(), image);
    setText("");
    setImage(null);
    setImageError(null);
  }, [canSend, text, image, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit]
  );

  // Auto-grow the textarea up to a max height for a ChatGPT-like feel.
  const handleInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  return (
    <div className="ai-input-wrap">
      {imageError && <div className="ai-input-error">{imageError}</div>}
      {image && (
        <div className="ai-image-preview">
          <img src={image} alt="Attachment preview" />
          <button
            type="button"
            className="ai-image-remove"
            onClick={() => setImage(null)}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="ai-input">
        <button
          type="button"
          className="ai-input-btn"
          onClick={() => fileRef.current?.click()}
          aria-label="Attach an image"
          title="Attach an image"
          disabled={isStreaming}
        >
          {readingImage ? <Loader2 size={18} className="ai-spin" /> : <ImagePlus size={18} />}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="ai-file-input"
          onChange={handleFile}
          aria-hidden="true"
          tabIndex={-1}
        />
        <textarea
          className="ai-textarea"
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask your doubt… (Enter to send, Shift+Enter for a new line)"
          rows={1}
          aria-label="Message"
          disabled={disabled}
        />
        {isStreaming ? (
          <button
            type="button"
            className="ai-input-btn ai-input-send ai-stop"
            onClick={onStop}
            aria-label="Stop generating"
            title="Stop generating"
          >
            <Square size={16} fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            className="ai-input-btn ai-input-send"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send message"
            title="Send message"
          >
            <Send size={18} />
          </button>
        )}
      </div>
      <p className="ai-input-hint">
        NCERT VERSE AI can make mistakes. Verify important answers.
      </p>
    </div>
  );
}

export default memo(ChatInput);
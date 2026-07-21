"use client";

import { useToast } from "@/contexts/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const icons: Record<string, string> = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  };

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          {icons[toast.type]} {toast.message}
        </div>
      ))}
    </div>
  );
}

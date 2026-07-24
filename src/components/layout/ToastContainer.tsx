"use client";

import { CheckCircle, XCircle, Info } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle size={16} style={{ flexShrink: 0 }} />,
    error: <XCircle size={16} style={{ flexShrink: 0 }} />,
    info: <Info size={16} style={{ flexShrink: 0 }} />,
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

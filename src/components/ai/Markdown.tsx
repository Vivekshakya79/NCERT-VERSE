"use client";

import { memo, useState, useCallback, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";

interface CodeElementProps {
  className?: string;
  children?: ReactNode;
}

/** Fenced code block with a language label and a copy button. */
function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeEl = children as ReactElement<CodeElementProps> | undefined;
  const className = codeEl?.props?.className || "";
  const lang = /language-(\w+)/.exec(className)?.[1] || "text";
  const code = String(codeEl?.props?.children || "").replace(/\n$/, "");

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [code]);

  return (
    <div className="ai-code">
      <div className="ai-code-head">
        <span className="ai-code-lang">{lang}</span>
        <button type="button" className="ai-code-copy" onClick={copy} aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {children}
    </div>
  );
}

const components = {
  a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  pre: ({ children }: { children?: ReactNode }) => <CodeBlock>{children}</CodeBlock>,
  table: ({ children }: { children?: ReactNode }) => (
    <div className="ai-table-wrap">
      <table>{children}</table>
    </div>
  ),
};

interface MarkdownProps {
  content: string;
}

/** Renders assistant markdown with GFM tables, KaTeX math, and code highlighting. */
function Markdown({ content }: MarkdownProps) {
  return (
    <div className="ai-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default memo(Markdown);
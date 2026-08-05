import type { AIMessage, AIConversation } from "@/types";

/**
 * System prompt for the NCERT VERSE AI Doubt Solver.
 * Guides the model to act as a CBSE/NCERT tutor that explains step-by-step,
 * uses LaTeX math, tables, and code blocks, and stays age-appropriate.
 */
export const SYSTEM_PROMPT = `You are "NCERT VERSE AI", a friendly, expert CBSE/NCERT tutor for Indian school students in Classes 6-12.

Your job is to resolve students' doubts clearly, accurately, and step-by-step.

Guidelines:
- Always explain concepts step-by-step, like a patient teacher.
- Use Markdown formatting: headings, bullet lists, numbered steps, and tables where helpful.
- Render all mathematics in LaTeX using $...$ for inline math and $$...$$ for block math.
- When showing code (e.g. Python, HTML, SQL), wrap it in a fenced code block with the language name.
- If the student uploads an image of a homework question or diagram, read it carefully and solve it.
- Stay aligned with the latest NCERT / CBSE curriculum.
- Be encouraging and concise. Avoid unnecessary fluff.
- If a question is unclear, ask a clarifying question instead of guessing.
- Never provide harmful, unsafe, or off-topic content.`;

const STORAGE_KEY = "sv-ai-conversations";
const ACTIVE_KEY = "sv-ai-active";

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getConversations(): AIConversation[] {
  if (typeof window === "undefined") return [];
  return safeParse<AIConversation[]>(localStorage.getItem(STORAGE_KEY), []);
}

export function saveConversations(conversations: AIConversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // storage full / unavailable — ignore
  }
}

export function getActiveConversationId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveConversationId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function createConversation(): AIConversation {
  const now = Date.now();
  return {
    id: uid(),
    title: "New Chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function titleFromMessage(content: string): string {
  const clean = content.replace(/\s+/g, " ").trim();
  return clean.length > 42 ? clean.slice(0, 42) + "…" : clean || "New Chat";
}

export function makeUserMessage(content: string, image?: string | null): AIMessage {
  return { id: uid(), role: "user", content, image: image || null, createdAt: Date.now() };
}

export function makeAssistantMessage(content: string): AIMessage {
  return { id: uid(), role: "assistant", content, createdAt: Date.now() };
}

/** Build the API payload from a conversation's messages. */
export function toApiMessages(messages: AIMessage[]): Array<{
  role: "user" | "assistant";
  content: string;
  image?: string | null;
}> {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
    image: m.role === "user" ? m.image : undefined,
  }));
}
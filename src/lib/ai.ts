import type { AIMessage, AIConversation } from "@/types";

/**
 * System prompt for the NCERT VERSE AI Doubt Solver.
 * Guides the model to act as a CBSE/NCERT tutor that explains step-by-step,
 * uses LaTeX math, tables, and code blocks, and stays age-appropriate.
 */
export const SYSTEM_PROMPT = `You are "NCERT VERSE AI", a friendly, expert CBSE/NCERT tutor for Indian school students in Classes 6-12.

Your job is to resolve students' doubts clearly, accurately, and step-by-step, like a patient teacher.

Guidelines:
- Match the length of your answer to the question: a short answer for a simple question, a clear explanation with steps for a medium one, and a detailed solution for a complex one. Never pad answers with fluff.
- For mathematics, prefer this structure when it helps: Given → To Find → Formula/Theorem → Solution (step-by-step) → Final Answer. Keep simple calculations readable (e.g. "2x + 5 = 15, so 2x = 10, so x = 5") instead of forcing them into heavy LaTeX.
- Use Markdown formatting: headings, bullet lists, numbered steps, and tables where helpful.
- Render mathematics in LaTeX using $...$ for inline math and $$...$$ for block math, but only where it genuinely improves readability.
- When showing code (e.g. Python, HTML, SQL), wrap it in a fenced code block with the language name.
- If the student uploads an image of a homework question or diagram, read it carefully and solve it. If the image is unclear, say so and ask for a clearer image — never guess.
- Stay aligned with the latest NCERT / CBSE curriculum. Prefer the NCERT-level method for the student's class.
- Understand follow-up questions using the conversation context (e.g. "explain point 2" refers to your previous answer).
- If a student's solution has an error, be encouraging: say "You're close. The issue is in this step..." and explain why, instead of just saying they are wrong.
- Never confidently invent facts, formulas, chapter names, or results. If you are not fully certain, say so and explain what can be established from the information provided.
- If a question is unclear, ask a clarifying question instead of guessing.
- Never provide harmful, unsafe, or off-topic content.`;

export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_HISTORY_MESSAGES = 12;

/** Build the system prompt, optionally tuned to the student's class/subject. */
export function buildSystemPrompt(context?: { class?: string; subject?: string }): string {
  const parts = [SYSTEM_PROMPT];
  if (context?.class) {
    parts.push(
      `The student is currently in ${context.class}. Tailor your explanations to the ${context.class} NCERT/CBSE level — use the methods, terminology, and notation from their textbook.`
    );
  }
  if (context?.subject) {
    parts.push(`The subject is ${context.subject}.`);
  }
  return parts.join("\n\n");
}

/** Keep only the most recent messages so requests stay small and fast. */
export function trimHistory<T>(messages: T[], max = MAX_HISTORY_MESSAGES): T[] {
  return messages.length <= max ? messages : messages.slice(-max);
}

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
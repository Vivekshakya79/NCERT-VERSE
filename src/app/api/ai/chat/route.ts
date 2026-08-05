import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEEPSEEK_URL = "https://openrouter.ai/api/v1/chat/completions";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
  image?: string | null;
}

interface RequestBody {
  messages: IncomingMessage[];
}

/**
 * POST /api/ai/chat
 * Streams a response from the DeepSeek (OpenAI-compatible) API token-by-token.
 * Accepts conversation history plus an optional base64 image (data URL) on the
 * last user message for vision-capable models.
 */
export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();

  if (!apiKey || apiKey.length < 20) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set DEEPSEEK_API_KEY." },
      { status: 503 }
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  // Build the OpenAI-compatible payload. The last user message may carry an
  // image (data URL) for vision-capable models.
  const payloadMessages: Array<Record<string, unknown>> = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  for (const msg of messages) {
    if (msg.role === "user" && msg.image) {
      payloadMessages.push({
        role: "user",
        content: [
          { type: "text", text: msg.content || "Please solve the problem in the image." },
          { type: "image_url", image_url: { url: msg.image } },
        ],
      });
    } else {
      payloadMessages.push({ role: msg.role, content: msg.content });
    }
  }

  // Model fallback chain: try the configured/first model, then known-good
  // free models. Free-tier OpenRouter models are rate-limited and sometimes
  // unavailable, so we keep trying until one answers.
  const MODELS = [
    process.env.DEEPSEEK_MODEL?.trim() || "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "openai/gpt-oss-20b:free",
  ];

  const encoder = new TextEncoder();
  let lastError: { status: number; text: string } | null = null;

  for (const model of MODELS) {
    let upstream: Response;
    try {
      upstream = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "NCERT VERSE",
        },
        body: JSON.stringify({
          model,
          messages: payloadMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4096,
        }),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      lastError = { status: 0, text: message };
      // Network failure — try the next model.
      continue;
    }

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      lastError = { status: upstream.status, text };
      // Auth/request errors won't fix themselves on another model, but
      // 429 (rate limit) and 404 (model unavailable) are worth retrying.
      if (upstream.status === 400 || upstream.status === 401 || upstream.status === 403) {
        return NextResponse.json(
          { error: `AI service returned ${upstream.status}: ${text.slice(0, 500)}` },
          { status: upstream.status }
        );
      }
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }

    if (!upstream.body) {
      lastError = { status: 502, text: "empty stream" };
      continue;
    }

    // Relay the SSE stream, extracting only the text deltas so the client
    // gets plain text it can render incrementally.
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                if (json.error) {
                  controller.error(
                    new Error(String(json.error.message ?? "AI stream error"))
                  );
                  return;
                }
                const delta = json.choices?.[0]?.delta?.content;
                if (typeof delta === "string" && delta.length > 0) {
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                // Ignore malformed keep-alive / partial lines.
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        }
      },
      cancel() {
        reader.cancel().catch(() => {});
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  }

  // Every model failed — surface the most useful error to the client.
  const status = lastError?.status || 502;
  const detail = lastError?.text?.slice(0, 500) || "Unknown error";
  return NextResponse.json(
    {
      error:
        status === 429
          ? "All AI models are temporarily rate-limited. Please wait a moment and try again."
          : `AI service is unavailable right now (${detail}). Please try again.`,
    },
    { status: status === 429 ? 429 : 502 }
  );
}
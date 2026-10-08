import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { SCHEDULE, formatTime } from "@/lib/hours";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

function isValid(messages: unknown): messages is ChatMessage[] {
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= 20 &&
    messages.every(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= 1000
    ) &&
    messages[messages.length - 1].role === "user"
  );
}

async function buildSystemPrompt() {
  const items = await prisma.menuItem.findMany({ orderBy: { id: "asc" } });

  const menu = items
    .map(
      (i) =>
        `- ${i.name} (${i.category}): KSh ${i.price}. ${i.description}${
          i.available ? "" : " [SOLD OUT today]"
        }`
    )
    .join("\n");

  const hours = SCHEDULE.map(
    (s) => `- ${s.label}: ${formatTime(s.open)} to ${formatTime(s.close)}`
  ).join("\n");

  return `You are the Kijani Café assistant, chatting with customers on the café's website.

ABOUT THE CAFÉ
Kijani Café is in Kitisuru, Nairobi. Kijani means "green" in Swahili. We serve fresh coffee, food and desserts made with local ingredients.

OPENING HOURS
${hours}

MENU (prices in Kenyan shillings)
${menu}

RULES
- Answer only from the information above. If you don't know something, say so and suggest the customer contact the café. Never invent menu items, prices, hours or policies.
- Be warm, friendly and brief: usually 1 to 3 short sentences.
- You cannot book tables yet. If someone wants to reserve, tell them to use the "Book a table" form on this page.
- Politely decline questions that have nothing to do with the café.`;
}

type GeminiContent = { role: string; parts: { text: string }[] };

function isBusy(err: unknown) {
  const status = (err as { status?: number })?.status;
  return status === 503 || status === 429;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateReply(
  models: string[],
  contents: GeminiContent[],
  systemInstruction: string
) {
  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await ai.models.generateContent({
          model,
          contents,
          config: { systemInstruction, maxOutputTokens: 1000 },
        });
      } catch (err) {
        lastError = err;
        if (!isBusy(err)) throw err; // real errors (bad key, bad model): stop now
        await sleep(800 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isValid(body.messages)) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }

  const models = [
    process.env.GEMINI_MODEL,
    process.env.GEMINI_FALLBACK_MODEL,
  ].filter((m): m is string => Boolean(m));

  if (models.length === 0) {
    console.error("GEMINI_MODEL is not set in .env");
    return Response.json({ error: "Assistant is not configured." }, { status: 500 });
  }

  try {
    const response = await generateReply(
      models,
      body.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      await buildSystemPrompt()
    );

    const reply =
      response.text?.trim() ||
      "Sorry, I couldn't come up with an answer. Please try asking another way.";

    return Response.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);

    if (isBusy(err)) {
      return Response.json(
        { error: "The assistant is very busy right now. Please try again in a moment." },
        { status: 503 }
      );
    }

    return Response.json(
      { error: "Sorry, the assistant is unavailable right now." },
      { status: 500 }
    );
  }
}
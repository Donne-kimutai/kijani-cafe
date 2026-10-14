import { GoogleGenAI, Type, type Content } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { SCHEDULE, formatTime } from "@/lib/hours";
import { checkSlot, createBooking } from "@/lib/reservations";
import { rateLimit } from "@/lib/rate-limit";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const tools :any[] = [
  {
    functionDeclarations: [
      {
        name: "check_availability",
        description:
          "Check whether the café can seat a party at a given date and time. Always call this before agreeing to a booking.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "Date as YYYY-MM-DD" },
            time: { type: Type.STRING, description: "24-hour time as HH:MM, for example 14:30" },
            guests: { type: Type.INTEGER, description: "Number of guests" },
          },
          required: ["date", "time", "guests"],
        },
      },
      {
        name: "create_reservation",
        description:
          "Create a table reservation. Only call this after the customer has confirmed all the details.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Customer's name" },
            phone: { type: Type.STRING, description: "Customer's Kenyan mobile number" },
            date: { type: Type.STRING, description: "Date as YYYY-MM-DD" },
            time: { type: Type.STRING, description: "24-hour time as HH:MM" },
            guests: { type: Type.INTEGER, description: "Number of guests" },
          },
          required: ["name", "phone", "date", "time", "guests"],
        },
      },
    ],
  },
] as const;

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

  const now = new Date();
  const today = now.toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
  const weekday = now.toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: "Africa/Nairobi",
  });

  return `You are the Kijani Café assistant, chatting with customers on the café's website.

ABOUT THE CAFÉ
Kijani Café is in Kitisuru, Nairobi. Kijani means "green" in Swahili. We serve fresh coffee, food and desserts made with local ingredients.

OPENING HOURS
${hours}

MENU (prices in Kenyan shillings)
${menu}

TODAY
Today is ${weekday}, ${today} (Nairobi time). Turn words like "tomorrow" or "Saturday" into YYYY-MM-DD dates yourself.

BOOKING TABLES
- To book you need: the customer's name, a Kenyan mobile number, the date, the time and the number of guests. Ask for whatever is missing, one or two things at a time.
- Call check_availability before agreeing to any booking. If the slot is unavailable, explain why and offer to try another time.
- Before calling create_reservation, repeat the details and ask the customer to confirm. Only call it after they clearly say yes.
- After it succeeds, say the request has been received and the café will confirm it shortly. Never say it is already confirmed.
- You cannot change or cancel bookings. Suggest the customer contact the café.
- Never mention tools or technical details. If a tool fails unexpectedly, apologise and suggest the "Book a table" form on this page.

RULES
- Answer only from the information above. If you don't know something, say so and suggest the customer contact the café. Never invent menu items, prices, hours or policies.
- Be warm, friendly and brief: usually 1 to 3 short sentences.
- Politely decline questions that have nothing to do with the café.`;
}

async function runTool(name: string, args: Record<string, unknown> | undefined) {
  const a = args ?? {};
  const slot = {
    date: String(a.date ?? ""),
    time: String(a.time ?? ""),
    guests: Number(a.guests),
  };

  if (name === "check_availability") {
    const r = await checkSlot(slot);
    return r.ok ? { available: true } : { available: false, reason: r.error };
  }

  if (name === "create_reservation") {
    const r = await createBooking({
      ...slot,
      name: String(a.name ?? ""),
      phone: String(a.phone ?? ""),
    });
    return r.ok
      ? { success: true, reservation_id: r.id }
      : { success: false, reason: r.error };
  }

  return { error: "Unknown tool" };
}

function isBusy(err: unknown) {
  const status = (err as { status?: number })?.status;
  return status === 503 || status === 429;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateReply(
  models: string[],
  contents: Content[],
  systemInstruction: string
) {
  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await ai.models.generateContent({
          model,
          contents,
          config: { systemInstruction, maxOutputTokens: 1000, tools },
        });
      } catch (err) {
        lastError = err;
        if (!isBusy(err)) throw err;
        await sleep(800 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

async function chat(models: string[], contents: Content[], systemInstruction: string) {
  for (let round = 0; round < 5; round++) {
    const response = await generateReply(models, contents, systemInstruction);
    const calls = response.functionCalls ?? [];

    if (calls.length === 0) {
      return (
        response.text?.trim() ||
        "Sorry, I couldn't come up with an answer. Please try asking another way."
      );
    }

    // Keep the model's own turn exactly as returned, then answer each tool call
    const modelTurn = response.candidates?.[0]?.content;
    if (modelTurn) contents.push(modelTurn);

    const parts = [];
    for (const call of calls) {
      const result = await runTool(call.name ?? "", call.args);
      parts.push({
        functionResponse: { id: call.id, name: call.name, response: { result } },
      });
    }
    contents.push({ role: "user", parts });
  }

  return "Sorry, I'm having trouble completing that. Please use the booking form on this page.";
}

export async function POST(req: Request) {const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const limited = rateLimit(`chat:${ip}`, 20, 10 * 60 * 1000);
  if (!limited.ok) {
    return Response.json(
      { error: "You're sending messages too quickly. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }
  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isValid(body.messages)) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }

  const models = [process.env.GEMINI_MODEL, process.env.GEMINI_FALLBACK_MODEL].filter(
    (m): m is string => Boolean(m)
  );

  if (models.length === 0) {
    console.error("GEMINI_MODEL is not set in .env");
    return Response.json({ error: "Assistant is not configured." }, { status: 500 });
  }

  const contents: Content[] = body.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const reply = await chat(models, contents, await buildSystemPrompt());
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
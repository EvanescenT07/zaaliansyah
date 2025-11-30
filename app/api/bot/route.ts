import {
  ChatMessage,
  ChatRequest,
  ChatRole,
  ErrorResponse,
  SuccessResponse,
} from "@/types/chatbot-types";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Configuration & Constants
const CONFIG = {
  API_KEY: process.env.CHATBOT_API_KEY,
  BASE_URL: process.env.OPENAI_API_BASE_URL,
  MODEL: process.env.CHATBOT_MODEL,
  SITE_URL: process.env.SITE_URL || "http://localhost:3000/",
  MAX_CONTENT_LENGTH: 16000,
  RATE_LIMIT: {
    WINDOW_MS: 6000,
    MAX_REQUESTS: 60,
  },
} as const;

const SYSTEM_PROMPT =
  `You are CaffBot, a helpful AI assistant for Fikar's portfolio website.

Your role:
- Help visitors learn about Fikar's experience, projects, and skills
- Answer questions concisely and professionally
- Keep responses brief (2-3 sentences max unless more detail is requested)
- If questions are unrelated to the portfolio, provide brief, helpful responses

Guidelines:
- Be friendly, professional, and conversational
- Use markdown formatting for better readability
- Avoid toxic, hateful, violent, discriminatory, political, religious, adult, sexual, drug-related, illegal, or self-harm content
- If you don't know something about Fikar, admit it honestly

Remember: You're representing Fikar's professional brand.` as const;

// OpenAI Client Initialization
const openrouter = new OpenAI({
  apiKey: CONFIG.API_KEY,
  baseURL: CONFIG.BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": CONFIG.SITE_URL,
    "X-Title": "CaffBot Portfolio Assistant",
  },
});

/**
 * Validates and normalizes incoming messages
 */
function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((msg): msg is Record<string, unknown> => {
      return typeof msg === "object" && msg !== null;
    })
    .map((msg) => {
      const role = String(msg.role || "user").toLowerCase();
      const content = String(msg.content || "").slice(
        0,
        CONFIG.MAX_CONTENT_LENGTH
      );

      return {
        role: (role === "assistant" ? "assistant" : "user") as Exclude<
          ChatRole,
          "system"
        >,
        content: content.trim(),
      };
    })
    .filter((msg) => msg.content.length > 0);
}

/**
 * Extracts IP address from request headers
 */
function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";
  return ip;
}

/**
 * Extracts error details for logging and response
 */
function extractErrorDetails(err: unknown): {
  status: number;
  message: string;
  code?: string;
} {
  // Handle OpenAI/OpenRouter specific errors
  if (err && typeof err === "object") {
    const error = err as Record<string, unknown>;

    // Check for status code
    const status =
      typeof error.status === "number"
        ? error.status
        : typeof error.code === "number"
        ? error.code
        : 500;

    // Extract message
    let message = "An unexpected error occurred";

    if (error.message && typeof error.message === "string") {
      message = error.message;
    } else if (error.error && typeof error.error === "object") {
      const errObj = error.error as Record<string, unknown>;
      if (typeof errObj.message === "string") {
        message = errObj.message;
      }
    }

    // Map status codes to user-friendly messages
    const statusMessages: Record<number, string> = {
      400: "Invalid request format",
      401: "Authentication failed",
      403: "Access forbidden",
      429: "Too many requests. Please wait a moment and try again.",
      500: "Server error. Please try again later.",
      503: "Service temporarily unavailable",
    };

    const userMessage = statusMessages[status] || message;
    const code = typeof error.code === "string" ? error.code : undefined;

    return { status, message: userMessage, code };
  }

  return { status: 500, message: "Failed to process your request" };
}

// ============================================================================
// Rate Limiting
// ============================================================================

class RateLimiter {
  private hits = new Map<string, { count: number; timestamp: number }>();
  private readonly isProd = process.env.NODE_ENV === "production";

  check(ip: string): boolean {
    if (!this.isProd) return false; // No rate limiting in development

    const now = Date.now();
    const record = this.hits.get(ip);

    // Reset if window expired
    if (!record || now - record.timestamp > CONFIG.RATE_LIMIT.WINDOW_MS) {
      this.hits.set(ip, { count: 1, timestamp: now });
      return false;
    }

    // Check if limit exceeded
    if (record.count >= CONFIG.RATE_LIMIT.MAX_REQUESTS) {
      return true;
    }

    // Increment counter
    record.count++;
    return false;
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [ip, record] of this.hits.entries()) {
      if (now - record.timestamp > CONFIG.RATE_LIMIT.WINDOW_MS) {
        this.hits.delete(ip);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Cleanup rate limiter every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

// ============================================================================
// Main Handler
// ============================================================================

export async function POST(
  req: Request
): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  try {
    // 1. Validate environment configuration
    if (!CONFIG.API_KEY || !CONFIG.BASE_URL || !CONFIG.MODEL) {
      console.error("Missing environment variables:", {
        hasApiKey: !!CONFIG.API_KEY,
        hasBaseUrl: !!CONFIG.BASE_URL,
        hasModel: !!CONFIG.MODEL,
      });

      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // 2. Rate limiting
    const clientIP = getClientIP(req);
    if (rateLimiter.check(clientIP)) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before trying again.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // 3. Parse and validate request body
    let body: ChatRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const userMessages = normalizeMessages(body.messages);

    if (userMessages.length === 0) {
      return NextResponse.json(
        {
          error: "Please provide at least one message",
          code: "NO_MESSAGES",
        },
        { status: 400 }
      );
    }

    // 4. Call OpenRouter API
    const completion = await openrouter.chat.completions.create({
      model: CONFIG.MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...userMessages],
      temperature: 0.7,
      max_tokens: 500, // Limit response length for conciseness
    });

    const assistantMessage = completion.choices?.[0]?.message?.content?.trim();

    if (!assistantMessage) {
      console.error("Empty response from OpenRouter");
      return NextResponse.json(
        { error: "Received empty response. Please try again." },
        { status: 500 }
      );
    }

    // 5. Return success response
    return NextResponse.json({ messages: assistantMessage });
  } catch (error: unknown) {
    const { status, message, code } = extractErrorDetails(error);

    console.error("Chat API error:", {
      status,
      message,
      code,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: message, ...(code && { code }) },
      { status }
    );
  }
}

export interface ContextCacheProps {
  content: string;
  builtAt: number;
}

export interface ChatbotMessageProps {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  metadata?: {
    reactions?: string[];
    isDelivered?: boolean;
    isRead?: boolean;
  };
}

export interface ChatbotProps {
  message: ChatbotMessageProps;
  now: Date | null;
  isNew?: boolean;
  listEndRef: React.RefObject<HTMLDivElement | null>;
  isDelivered?: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
  reactions?: string[];
}

export interface SysMessageProps {
  role: "system";
  content: string;
}

export interface MarkdownProps {
  content: string;
  isBot: boolean;
}

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: unknown;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

export interface SuccessResponse {
  messages: string;
}

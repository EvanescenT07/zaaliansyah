import { useEffect, useRef, useState, useMemo } from "react";
import { useTimestamp } from "@/hooks/timestamp";
import { ChatbotProps } from "@/types/chatbot-types";
import { ChatMarkdown } from "@/components/chatbot/chat-markdown";

export const MessageBubble = ({
  message,
  now,
  isNew,
  isDelivered,
  listEndRef,
  onReaction,
  reactions = [],
}: ChatbotProps) => {
  const isBot = message.role === "assistant";
  const time = useTimestamp(message.createdAt, now);

  // Calculate initial displayed text synchronously
  const initialDisplayed = useMemo(() => {
    return isBot && isNew ? "" : message.content;
  }, [isBot, isNew, message.content]);

  const [displayed, setDisplayed] = useState(initialDisplayed);
  const timerRef = useRef<number | null>(null);
  const animationCompleteRef = useRef(!isBot || !isNew);

  // Sync displayed state when message content changes (for non-animated cases)
  useEffect(() => {
    if (!isBot || !isNew) {
      // Only update if different to avoid unnecessary renders
      if (displayed !== message.content) {
        setDisplayed(message.content);
      }
      animationCompleteRef.current = true;
    }
  }, [isBot, isNew, message.content, displayed]);

  // Handle typewriter animation separately
  useEffect(() => {
    // Skip if not an animated bot message or animation already complete
    if (!(isBot && isNew) || animationCompleteRef.current) {
      return;
    }

    const full = message.content;
    let i = 0;

    const step = () => {
      i = Math.min(i + 2, full.length);
      setDisplayed(full.slice(0, i));
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

      if (i < full.length) {
        timerRef.current = window.setTimeout(step, 32);
      } else {
        animationCompleteRef.current = true;
      }
    };

    step();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isBot, isNew, message.content, listEndRef]);

  const skipAnimation = () => {
    if (displayed !== message.content) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setDisplayed(message.content);
      animationCompleteRef.current = true;
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  return (
    <div
      onClick={skipAnimation}
      role="listitem"
      aria-label={isBot ? "Assistant message" : "Your message"}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div className={`max-w-[80%] ${isBot ? "order-1" : "order-2"}`}>
        <div
          className={[
            "relative px-4 py-3 rounded-2xl text-sm shadow-sm border",
            isBot
              ? "bg-foreground/10 text-foreground border-foreground/20 rounded-bl-none"
              : "bg-foreground text-background border-foreground rounded-br-none",
          ].join(" ")}
        >
          <ChatMarkdown content={displayed} isBot={isBot} />
          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-[10px] ${
                isBot ? "text-foreground/70" : "text-background/70"
              }`}
            >
              {time}
            </span>
            {!isBot && (
              <span className="text-[8px] opacity-70">
                {isDelivered ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>

        {isBot && onReaction && (
          <div className="flex gap-1 mt-2 ml-2">
            {["👍", "👎", "❤️", "😊"].map((emoji) => (
              <button
                key={emoji}
                onClick={() =>
                  onReaction(message.id ?? message.createdAt, emoji)
                }
                className="text-xs hover:bg-foreground/10 rounded-full px-2 py-1 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {reactions.length > 0 && (
          <div className="flex gap-1 mt-1 ml-2">
            {reactions.map((r, idx) => (
              <span
                key={idx}
                className="text-xs bg-foreground/10 text-foreground rounded-full px-2 py-1"
              >
                {r}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

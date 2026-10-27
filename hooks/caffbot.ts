type ChatRole = "user" | "assistant";
type ChatResponse = { messages: string };

export function CaffBot(endpoint: string) {
  const SendChat = async (payload: { role: ChatRole; content: string }[]) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: AbortSignal.timeout(15000),
      });

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Try again later.");
      }
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatResponse;
      if (typeof data?.messages !== "string") {
        throw new Error("Invalid API response payload");
      }
      return data.messages;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("Rate limit")) {
        throw err;
      }
      throw new Error("Failed to reach chatbot service.");
    }
  };

  return { SendChat };
}

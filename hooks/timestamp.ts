"use client";

export function useTimestamp(createdAt: string, now: Date | null) {
  // Handle null case
  if (!now) return "Loading...";

  const date = new Date(createdAt);
  const diffms = Math.abs(now.getTime() - date.getTime());
  if (diffms < 5000) return "just now";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

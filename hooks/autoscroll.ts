"use client";

export function AutoScroll(listEndRef: React.RefObject<HTMLDivElement | null>) {
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    });
  };

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      const parent = listEndRef.current?.parentElement;
      if (parent) parent.scrollTop = 0;
    });
  };

  return { scrollToBottom, scrollToTop };
}

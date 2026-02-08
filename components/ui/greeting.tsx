"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { BsChevronDoubleDown } from "react-icons/bs";
import dayjs from "dayjs";
import TypeIt from "typeit-react";
import { ParticlePropss } from "@/types/data-types";


// Generate particles function
const generateParticles = (
  theme: string | undefined,
  windowWidth: number,
  windowHeight: number,
): ParticlePropss[] => {
  return [...Array(45)].map(() => ({
    width: Math.random() * 4 + 1,
    height: Math.random() * 4 + 1,
    background:
      theme === "dark"
        ? `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 30 + 50}%)`
        : "rgba(0, 0, 0, 0.8)",
    opacity: Math.random() * 0.6 + 0.3,
    initial: {
      x: Math.random() * windowWidth,
      y: Math.random() * windowHeight,
      scale: 0,
      rotate: 0,
    },
    animate: {
      x: [
        Math.random() * windowWidth,
        Math.random() * windowWidth,
        Math.random() * windowWidth,
      ],
      y: [
        Math.random() * windowHeight,
        Math.random() * windowHeight,
        Math.random() * windowHeight,
      ],
      scale: [0, 1, 0.8, 1, 0],
      rotate: [0, 180, 360],
    },
    transition: {
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    },
  }));
};

// Floating particles component
const FloatingParticles = () => {
  const { theme } = useTheme();

  // Use useMemo with a key to regenerate when theme changes
  // Initial render will use empty array, then update after mount
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get window size on mount (client-side only)
  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Generate particles using useMemo - only recalculates when dependencies change
  const particles = useMemo(() => {
    if (windowSize.width === 0) return [];
    return generateParticles(theme, windowSize.width, windowSize.height);
  }, [theme, windowSize.width, windowSize.height]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: particle.width + "px",
            height: particle.height + "px",
            background: particle.background,
            opacity: particle.opacity,
          }}
          initial={particle.initial}
          animate={particle.animate}
          transition={{
            duration: particle.transition.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: particle.transition.delay,
          }}
        />
      ))}
    </div>
  );
};

function getGreeting(): string[] {
  const hour = dayjs().hour();

  if (hour >= 5 && hour < 12) {
    return [
      "Good Morning!",
      "Guten Morgen!",
      "Goedemorgen!",
      "Bonjour!",
      "¡Buenos días!",
      "Selamat Pagi!",
      "おはようございます",
      "좋은 아침입니다",
      "صباح الخير",
      "早上好",
    ];
  } else if (hour >= 12 && hour < 18) {
    return [
      "Good Afternoon!",
      "Guten Tag!",
      "Goedemiddag!",
      "Bon après-midi!",
      "¡Buenas tardes!",
      "Selamat Siang!",
      "こんにちは",
      "좋은 오후입니다",
      "مساء الخير",
      "下午好",
    ];
  } else {
    return [
      "Good Evening!",
      "Guten Abend!",
      "Goedenavond!",
      "Bonsoir!",
      "¡Buenas noches!",
      "Selamat Malam!",
      "こんばんは",
      "좋은 저녁입니다",
      "مساء الخير",
      "晚上好",
    ];
  }
}

export const Greeting = () => {
  const [opacity, setOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  // Initialize greeting lazily to avoid hydration mismatch
  const [greeting, setGreeting] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Combined mount effect - only runs once
  useEffect(() => {
    // Set initial state immediately after mount
    const initialGreeting = getGreeting();
    setMounted(true);
    setGreeting(initialGreeting);

    // Set up interval for updating greeting
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps - runs once on mount

  // Scroll handler effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const newOpacity = Math.max(0, 1 - currentScrollY / 400);
      setOpacity(newOpacity);
      setIsVisible(currentScrollY <= 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render until mounted on client
  if (!mounted || (!isVisible && opacity <= 0)) return null;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col gradient-background items-center justify-center transition-all duration-500"
      style={{
        zIndex: opacity > 0.5 ? 40 : 10,
        opacity: opacity,
        pointerEvents: opacity < 0.2 ? "none" : "auto",
      }}
    >
      <FloatingParticles />
      <div className="text-center px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold font-comfortaa text-heading mb-4"
        >
          {greeting.length > 0 && (
            <TypeIt
              key={greeting.join(",")}
              options={{
                strings: [...greeting],
                speed: 150,
                waitUntilVisible: true,
                loop: true,
                breakLines: false,
                deleteSpeed: 75,
              }}
            />
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-foreground font-work-sans max-w-2xl mx-auto my-5"
        >
          Welcome to my Portfolio Website
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: 0.8,
          }}
          className="group mt-[100px]"
        >
          <div className="bg-blue-default/20 dark:bg-blue-dark/20 rounded-full px-6 py-3 shadow-lg transition-all duration-300 group-hover:shadow-blue-hover/20 group-hover:translate-y-1">
            <p className="text-foreground text-sm md:text-base font-medium">
              Scroll Below
            </p>
            <BsChevronDoubleDown className="mx-auto text-2xl text-foreground mt-2" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

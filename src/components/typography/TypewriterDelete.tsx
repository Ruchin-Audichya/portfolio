"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterDeleteProps {
  staticText: string;
  deleteText: string;
  finalText: string;
  className?: string;
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  onComplete?: () => void;
}

export function TypewriterDelete({
  staticText,
  deleteText,
  finalText,
  className = "",
  typingSpeed = 80,
  deleteSpeed = 50,
  pauseDuration = 1500,
  onComplete,
}: TypewriterDeleteProps) {
  const [phase, setPhase] = useState<"typing-delete" | "pausing" | "deleting" | "typing-final" | "done">("typing-delete");
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    switch (phase) {
      case "typing-delete":
        if (displayText.length < deleteText.length) {
          timeout = setTimeout(() => {
            setDisplayText(deleteText.slice(0, displayText.length + 1));
          }, typingSpeed);
        } else {
          timeout = setTimeout(() => setPhase("pausing"), pauseDuration);
        }
        break;

      case "pausing":
        timeout = setTimeout(() => setPhase("deleting"), pauseDuration);
        break;

      case "deleting":
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, deleteSpeed);
        } else {
          setPhase("typing-final");
        }
        break;

      case "typing-final":
        if (displayText.length < finalText.length) {
          timeout = setTimeout(() => {
            setDisplayText(finalText.slice(0, displayText.length + 1));
          }, typingSpeed);
        } else {
          setPhase("done");
          onComplete?.();
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, displayText, deleteText, finalText, typingSpeed, deleteSpeed, pauseDuration, onComplete]);

  return (
    <span className={className}>
      {staticText}
      <span className="relative">
        <AnimatePresence mode="wait">
          {phase === "deleting" || phase === "pausing" ? (
            <motion.span
              key="delete-text"
              className="text-red-400/80 line-through decoration-red-500/50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
            >
              {displayText}
            </motion.span>
          ) : (
            <motion.span
              key="normal-text"
              className={phase === "done" ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" : ""}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              {displayText}
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-white ml-1 align-middle"
          animate={{ opacity: cursorVisible ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        />
      </span>
    </span>
  );
}

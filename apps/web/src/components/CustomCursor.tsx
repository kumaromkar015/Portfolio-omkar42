"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    // 1. Detect if touch device or has reduced-motion preference
    const touchQuery = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(touchQuery.matches);
    
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    if (touchQuery.matches || motionQuery.matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      const isProjectCard = target.closest(".project-card") || cursorAttr === "project";
      const isLink = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";
      
      if (isProjectCard) {
        setIsHovered(true);
        setCursorText("VIEW");
      } else if (isLink) {
        setIsHovered(true);
        setCursorText("");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Disable completely on SSR, touch devices, and reduced-motion environments
  if (!mounted || !isVisible || isTouchDevice || reducedMotion) return null;

  return (
    <>
      {/* Outer soft glow ring / text container (offset dynamically by size) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-lime-500/40 pointer-events-none z-[9999] hidden md:flex items-center justify-center text-[7px] font-black uppercase tracking-wider text-lime-400 select-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: cursorText ? 52 : (isHovered ? 40 : 28),
          height: cursorText ? 52 : (isHovered ? 40 : 28),
          marginLeft: cursorText ? -26 : (isHovered ? -20 : -14),
          marginTop: cursorText ? -26 : (isHovered ? -20 : -14),
        }}
        animate={{
          backgroundColor: cursorText ? "rgba(0, 0, 0, 0.9)" : (isHovered ? "rgba(163, 230, 53, 0.06)" : "rgba(163, 230, 53, 0)"),
          borderColor: isHovered ? "rgba(132, 204, 22, 0.8)" : "rgba(163, 230, 53, 0.4)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      >
        {cursorText}
      </motion.div>

      {/* Inner dot (tracks cursor exactly) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-lime-500 rounded-full pointer-events-none z-[9999] hidden md:block -ml-1 -mt-1 select-none"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovered ? 0.4 : 1,
          backgroundColor: isHovered ? "#84cc16" : "#a3e635",
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.05 }}
      />
    </>
  );
}

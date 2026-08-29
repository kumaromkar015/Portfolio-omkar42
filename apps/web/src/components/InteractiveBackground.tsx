"use client";

import React, { useEffect, useState, useRef } from "react";

export default function InteractiveBackground() {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    const touchQuery = window.matchMedia("(pointer: coarse)");
    setIsTouch(touchQuery.matches);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    if (touchQuery.matches || motionQuery.matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Get absolute coordinates relative to the viewport
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const updateGlowPosition = () => {
      if (!containerRef.current) return;

      // Add a slight ease-out delay to make the orb movement organic and fluid
      const ease = 0.08;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      containerRef.current.style.setProperty("--mouse-x", `${currentPos.current.x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${currentPos.current.y}px`);

      animationFrameId.current = requestAnimationFrame(updateGlowPosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId.current = requestAnimationFrame(updateGlowPosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-slate-50 dark:bg-bg-dark transition-colors duration-300 select-none"
    >
      {/* 1. Fine Tech Cyberpunk Grid */}
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(163, 230, 53, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(163, 230, 53, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 2. Soft Mouse-Responsive Ambient Light/Orb (Desktop only) */}
      {!isTouch && !reducedMotion && (
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-60 dark:opacity-40"
          style={{
            background: `radial-gradient(
              600px circle at var(--mouse-x, -500px) var(--mouse-y, -500px),
              rgba(163, 230, 53, 0.045),
              transparent 80%
            )`,
          }}
        />
      )}

      {/* 3. Global Static Background Corner Blurs (Ensures visual depth on all devices) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-lime-500/5 dark:bg-lime-500/[0.02] blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-lime-600/5 dark:bg-lime-600/[0.02] blur-[150px] mix-blend-screen" />
      <div className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-lime-500/5 dark:bg-lime-500/[0.015] blur-[100px] mix-blend-screen" />
    </div>
  );
}

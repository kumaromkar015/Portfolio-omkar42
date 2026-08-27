"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import ScrollProgressBar from "./ScrollProgressBar";
import CommandPalette from "./CommandPalette";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex-grow flex flex-col">{children}</div>;
  }

  return (
    <>
      <ScrollProgressBar />
      <CustomCursor />
      <Navbar />
      <div className="flex-grow flex flex-col relative">{children}</div>
      <Footer />
      <CommandPalette />
    </>
  );
}

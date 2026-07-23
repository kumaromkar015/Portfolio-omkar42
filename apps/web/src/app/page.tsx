"use client";

import React from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Achievements from "@/components/Achievements";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section with particle gradients & marquee */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Skills Matrix */}
      <Skills />

      {/* Career Timeline */}
      <Experience />

      {/* Case Studies / Projects */}
      <Projects />

      {/* Professional Services */}
      <Services />

      {/* Credentials */}
      <Achievements />

      {/* Feedback / Testimonials Slider */}
      <Testimonials />

      {/* Contact Form with validations */}
      <Contact />
    </main>
  );
}

export interface Project {
  id: string;
  title: string;
  category: "Full Stack" | "Frontend" | "Mobile" | "Open Source";
  description: string;
  extendedDescription: string;
  techStack: string[];
  features: string[];
  architecture: string;
  role: string;
  challenges: string;
  solution: string;
  impact: string;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
}

export const projectsData: Project[] = [
  {
    id: "stellar-saas",
    title: "Stellar - Premium AI Analytics SaaS",
    category: "Full Stack",
    description: "A world-class SaaS platform offering real-time AI analytics, visual pipelines, database monitoring, and custom notification systems. Engineered with glassmorphic dashboards.",
    extendedDescription: "Stellar is an enterprise-grade SaaS platform designed to offer real-time insights into database health, server latency, and AI inference costs. Built with Next.js App Router and PostgreSQL, it features stunning visualization tools, multi-tenant RBAC, and seamless integrations.",
    techStack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Recharts", "Framer Motion"],
    features: [
      "Real-time database performance and latency logs metrics dashboard.",
      "Custom visual node graph pipelines for mapping model training.",
      "Multi-tenant authorization and API key rate limiting.",
      "Premium billing integration with Stripe subscriptions.",
      "Full dark/light mode responsive transitions."
    ],
    architecture: "Next.js App Router (RSC) served at the edge. PostgreSQL database hosted on Supabase, accessed via Prisma ORM. Real-time logging handled via Server-Sent Events (SSE).",
    role: "Lead Full Stack Developer & UI Designer. Designed the entire system architecture, UI mockups, database schemas, and implemented front-to-back features.",
    challenges: "Handling real-time data flow with high volumes (10k+ requests/sec) of server latency logs without causing main-thread UI stutter in the browser charts.",
    solution: "Implemented Web Workers to handle data aggregation off the main thread and utilized virtualized lists to only render charts currently in the viewport.",
    impact: "Boosted client page performance by 45% and reduced server compute requirements by 30% through caching and debounced updates.",
    githubUrl: "https://github.com/kumaromkar015/stellar-saas",
    liveUrl: "https://stellar-saas.dev",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "apex-palette",
    title: "Apex Palette - DevTools Design System Builder",
    category: "Frontend",
    description: "An interactive devtools app that generates accessible, beautiful, custom Tailwind palette design systems based on HSL color algorithms.",
    extendedDescription: "Apex Palette empowers engineering and design teams to build cohesive, accessible color systems in seconds. It uses mathematical color harmony formulas to calculate tints, shades, and contrast ratios (WCAG 2.1 compliance) automatically, generating direct export tokens for CSS and Tailwind.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "next-themes", "Zustand", "Framer Motion"],
    features: [
      "Dynamic HSL color algorithm generator for monochromatic, triad, and analogous systems.",
      "Real-time WCAG 2.1 AA/AAA contrast check overlay indicator.",
      "One-click copy exports for CSS, SCSS, Tailwind config, and Tailwind v4 CSS imports.",
      "Command Palette (CMD+K) integration for quick system tweaks."
    ],
    architecture: "Single-page App built using Vite, migrated to Next.js Client Routing. State managed through Zustand with custom middleware to save palette configurations locally.",
    role: "Creator and Frontend Architect. Researched color mathematics and developed the custom interactive interface.",
    challenges: "Calculating complex color contrasts across dozens of dynamically changing colors in real-time without introducing input delays or lagging slider transitions.",
    solution: "Used debounced state updates and memoized contrast math utilities via React's useMemo hook, ensuring fluid 60fps adjustments.",
    impact: "Used by over 8,000 developers worldwide, significantly speeding up design system bootstrapping times.",
    githubUrl: "https://github.com/kumaromkar015/apex-palette",
    liveUrl: "https://apex-palette.dev",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "git-trace",
    title: "GitTrace - Git Contribution & Analytics Tracker",
    category: "Open Source",
    description: "An open-source visualization dashboard detailing repository health, code frequency, commit metrics, and contribution charts using Git APIs.",
    extendedDescription: "GitTrace is a developer utility that turns standard git log outputs and GitHub REST APIs into beautiful interactive graphics. It aggregates repository-wide collaboration metrics to show top contributors, files with highest churn, and commit frequency heatmaps.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "GitHub REST API", "Zod"],
    features: [
      "Dynamic repository health grading score metrics.",
      "Interactive 3D contributions commit graph heatmap.",
      "Custom analytics showing developer code churn and refactoring velocity.",
      "Optimized API fetching with server-side caching to prevent API rate limiting."
    ],
    architecture: "Next.js App Router using Server Actions to fetch git history data. Edge-caching via Redis to store repository snapshots.",
    role: "Open Source Maintainer. Designed the data-aggregation layers and custom heatmap canvas elements.",
    challenges: "Hitting the strict GitHub REST API rate limits when fetching analytics for very large organization repositories (1,000+ branches).",
    solution: "Developed an API queuing engine with smart Redis caching, storing data snapshots for 6 hours and utilizing GraphQL endpoints to request only necessary fields.",
    impact: "Over 500 open-source repositories analyzed, with zero rate-limit blocks and response times under 200ms.",
    githubUrl: "https://github.com/kumaromkar015/git-trace",
    liveUrl: "https://git-trace.dev",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"
  }
];

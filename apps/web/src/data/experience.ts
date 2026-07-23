export interface JobExperience {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
}

export const experienceData: JobExperience[] = [
  {
    company: "Stripe",
    position: "Senior Frontend Architect",
    duration: "2024 - Present",
    responsibilities: [
      "Lead frontend architectural design for Dashboard payments products, managing complex state transitions and dynamic loading.",
      "Collaborate with product designers to implement the Stripe Design System, focusing on layout spacing, accessibility (WCAG AA), and animation performance.",
      "Optimized load times and edge network rendering for internationalized checkout pages, boosting conversion rates by 4.2% globally.",
      "Mentor and train 12+ developers on React/TypeScript best practices and performance optimization methodologies."
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Framer Motion", "Jest"],
    achievements: [
      "Architected the next-gen billing system dashboard, improving UI performance by 40%.",
      "Created an internal design-to-code automation utility used by over 150 engineers."
    ]
  },
  {
    company: "Vercel",
    position: "Staff Software Engineer - DX Team",
    duration: "2022 - 2024",
    responsibilities: [
      "Worked on framework performance features for Next.js App Router, particularly dynamic server routing and code-splitting APIs.",
      "Built developers-focused devtools interfaces, streamlining environment setup and diagnostics deployment.",
      "Collaborated with open-source contributors to resolve package build errors and speed up monorepo pipelines.",
      "Evangelized serverless architecture and React Server Components at global tech conferences."
    ],
    technologies: ["Next.js", "React", "Rust", "Node.js", "WebAssembly", "TypeScript", "Tailwind CSS"],
    achievements: [
      "Designed and deployed the Next.js DX Devtools Extension, which achieved 200k+ active installs.",
      "Co-authored dynamic runtime optimizations that reduced dev server reload latency by 35%."
    ]
  },
  {
    company: "Linear App",
    position: "Senior Full Stack Engineer",
    duration: "2020 - 2022",
    responsibilities: [
      "Developed high-fidelity keyboard-interactive interfaces and custom search capabilities (Command Palette).",
      "Designed real-time collaborative state sync layers using WebSockets and conflict-free replicated data types (CRDTs).",
      "Engineered backend API endpoints (GraphQL & REST) using NestJS, Node.js, and PostgreSQL with high test coverage.",
      "Iterated on high-performance mouse glow and canvas rendering backgrounds."
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Prisma", "WebSockets", "CSS Grid"],
    achievements: [
      "Shipped the Linear Command Palette feature, reducing average user action times by 18%.",
      "Optimized database queries and indexing, saving 25% on cloud database compute costs."
    ]
  }
];

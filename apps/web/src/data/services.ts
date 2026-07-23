export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  priceRange: string;
}

export const servicesData: Service[] = [
  {
    id: "web-dev",
    title: "Premium Website Development",
    description: "End-to-end development of custom React/Next.js web applications designed for maximum performance, premium visual aesthetics, and strict search engine ranking optimization.",
    iconName: "Monitor",
    features: [
      "Custom responsive design built with Tailwind CSS & CSS Grid.",
      "High-performance Edge deployment on Vercel.",
      "Seamless light and dark mode integration.",
      "Strict compliance with WCAG AA accessibility standards."
    ],
    priceRange: "Starting at $4,000"
  },
  {
    id: "dashboards",
    title: "Advanced Dashboard Systems",
    description: "Sophisticated data dashboards for SaaS startups and enterprise platforms, featuring real-time logging updates, custom interactive chart modules, and granular RBAC.",
    iconName: "Layout",
    features: [
      "Real-time monitoring using WebSockets or Server-Sent Events.",
      "Custom analytics widgets (Recharts / D3).",
      "Dynamic filtering, CSV exports, and multi-tenant systems.",
      "Premium command palette keyboard shortcuts (CMD+K)."
    ],
    priceRange: "Starting at $8,000"
  },
  {
    id: "api-backend",
    title: "API & Backend Architecture",
    description: "Robust, scalable API design and database schema implementations built for speed, safety, and modern security protocols.",
    iconName: "Cpu",
    features: [
      "RESTful, GraphQL, or gRPC backend architectures.",
      "Relational (PostgreSQL) and non-relational (MongoDB) solutions.",
      "Granular schema migrations using Prisma or Drizzle ORM.",
      "Secure authentication (JWT, OAuth) and rate-limiting middleware."
    ],
    priceRange: "Starting at $5,000"
  }
];

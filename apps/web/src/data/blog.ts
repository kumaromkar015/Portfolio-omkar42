export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Engineering" | "Design" | "Architecture";
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
}

export const blogData: BlogPost[] = [
  {
    id: "nextjs-16-app-router-architecture",
    title: "Mastering Next.js 16 App Router Architecture for Scale",
    excerpt: "An in-depth guide to structuring enterprise monorepos, optimizing server and client component boundaries, and achieving zero-hydration-stutter layouts.",
    content: `
# Mastering Next.js 16 App Router Architecture for Scale

Next.js has evolved into the industry-standard React framework, but scaling it within an enterprise-grade monorepo requires deliberate design patterns. In this article, we'll dive deep into folder structures, component boundaries, and layout hydration optimizations.

## 1. The Monorepo Layout
A scalable Next.js architecture should separate framework code from core business logic and UI styling. Our typical project architecture maps:
- \`apps/web\`: The primary Next.js App Router application containing page-specific logic and routing.
- \`packages/ui\`: Shared Tailwind-compiled components and design system tokens.
- \`packages/typescript-config\`: Unified TypeScript rule configurations.

## 2. Server and Client Component Boundaries
React Server Components (RSC) should be the default choice. By placing data fetching close to the layout structure, we minimize the client bundle size. Here are the golden rules for component separation:
- **Use RSCs** for layout framing, database queries, and content rendering.
- **Use Client Components** strictly for interactive leaf nodes (e.g., buttons, forms, dropdowns, and canvas animations).

\`\`\`tsx
// React Server Component (RSC)
import { fetchRepoAnalytics } from "@/lib/db";
import { InteractiveChart } from "./InteractiveChart";

export default async function DashboardSection() {
  const data = await fetchRepoAnalytics();
  return (
    <section className="p-8">
      <h2 className="text-xl font-bold">Analytics</h2>
      <InteractiveChart initialData={data} />
    </section>
  );
}
\`\`\`

## 3. Hydration Optimizations
To achieve perfect Lighthouse scores, avoid dynamic calculations during the initial render. Next.js Hydration errors occur when server-side HTML differs from client-side DOM. We solve this by:
- Using \`useEffect\` to verify client-side mounting before enabling animations or loading settings.
- Specifying explicit sizes for layout boundaries to prevent Layout Shift (CLS).

Stay tuned for our next article, where we'll unpack advanced caching policies on Vercel's Edge Network!
    `,
    category: "Engineering",
    publishedAt: "July 15, 2026",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    featured: true
  },
  {
    id: "stripe-like-micro-interactions",
    title: "Designing Stripe-like Micro-interactions in Tailwind CSS",
    excerpt: "Learn how to build responsive grids, glassmorphism card highlights, and mouse-glow cards using vanilla CSS and Framer Motion.",
    content: `
# Designing Stripe-like Micro-interactions in Tailwind CSS

Stripe's user interfaces are widely considered the gold standard for developer-facing designs. They achieve a premium look not through flashy graphics, but through meticulous attention to micro-interactions, layout grids, and spacing.

## 1. The CSS Glassmorphism Card
Premium web apps use translucent, reflective panels to group information. We can create this layout using backdrop filters and borders:

\`\`\`html
<div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 shadow-xl">
  <h3>Interactive Content</h3>
</div>
\`\`\`

## 2. Mouse Glow Effect
A mouse glow effect tracks the user's cursor across a container, updating a radial gradient background overlay:
- Attach a mousemove listener to the container.
- Update CSS variables for X and Y coordinates.
- Render a radial gradient background that centers on the cursor location.

## 3. Spacing and Grids
Give elements room to breathe. Apple and Stripe designs leverage generous line-heights and padding ranges:
- Title headings should have a tracking-tight letter spacing.
- Text content should be limited to an optimal line width (60-70 characters max).
    `,
    category: "Design",
    publishedAt: "July 02, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&auto=format&fit=crop&q=80",
    featured: false
  },
  {
    id: "postgresql-indexing-best-practices",
    title: "PostgreSQL Indexing & Optimization Best Practices",
    excerpt: "How we reduced database query latency by 45% for our AI SaaS dashboard by leveraging indexes, analyzing query plans, and managing connections.",
    content: `
# PostgreSQL Indexing & Optimization Best Practices

Query performance is the backbone of any real-time dashboard application. When server logs started scaling, our dashboard analytics began experiencing 3-second database query lag times. Here is how we optimized our PostgreSQL instance using Prisma.

## 1. Finding the Bottlenecks
We used PostgreSQL's \`EXPLAIN ANALYZE\` to trace slow SELECT queries. We noticed that filtering on a user's ID and timestamp created full-table sequential scans instead of indexed scans.

## 2. Creating Composite Indexes
When querying using multiple WHERE conditions, a multi-column (composite) index is highly effective:

\`\`\`sql
CREATE INDEX idx_logs_user_timestamp ON "Log" ("userId", "createdAt" DESC);
\`\`\`

In Prisma, you can represent this composite index directly inside your schema definition:

\`\`\`prisma
model Log {
  id        String   @id @default(uuid())
  userId    String
  createdAt DateTime @default(now())
  
  @@index([userId, createdAt(sort: Desc)])
}
\`\`\`

## 3. Connection Pooling
Starting database connections has high latency. We implemented connection pooling using Prisma Accelerate and PgBouncer, keeping database connections warm and improving API response times under high-load conditions.
    `,
    category: "Architecture",
    publishedAt: "June 20, 2026",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
    featured: false
  }
];

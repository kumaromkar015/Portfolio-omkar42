export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  relationship: "client" | "manager" | "colleague";
  content: string;
}

export const testimonialsData: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "VP of Product",
    company: "Stripe",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    relationship: "manager",
    content: "Omkar is a rare breed of frontend engineer who thinks like a product designer. He didn't just build our billing dashboards; he architected a fluid, highly-performant state system that resolved multiple layout issues."
  },
  {
    name: "Alex Rivera",
    role: "Founder",
    company: "Stellar SaaS",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    relationship: "client",
    content: "Working with Omkar was a game changer for our launch. He built our analytics dashboard from the ground up, delivering a UI that looks and feels like a premium Apple product. Highly recommended!"
  },
  {
    name: "Elena Rostova",
    role: "Senior Staff Engineer",
    company: "Vercel",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    relationship: "colleague",
    content: "Omkar's dedication to code quality and accessibility standards (WCAG) is exemplary. He spearheaded our monorepo optimization efforts, making the local dev loops faster for everyone on the team."
  }
];

export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  category: "Award" | "Certificate" | "Hackathon" | "Profile";
  description: string;
  link: string;
}

export const achievementsData: Achievement[] = [
  {
    title: "Vercel Next.js Certified Professional",
    issuer: "Vercel",
    date: "2024",
    category: "Certificate",
    description: "Officially certified for advanced Next.js routing, server component optimization, data-fetching architecture, and Edge Network caching policies.",
    link: "https://vercel.com/certification"
  },
  {
    title: "1st Place - Stripe API Global Hackathon",
    issuer: "Stripe",
    date: "2023",
    category: "Hackathon",
    description: "Won first prize globally for developing a micro-billing checkout widget designed for seamless embedded payment forms.",
    link: "https://stripe.com/blog/hackathon"
  },
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    category: "Certificate",
    description: "Validated expertise in designing distributed systems, scaling compute infrastructure, and securing AWS application networks.",
    link: "https://aws.amazon.com/certification"
  },
  {
    title: "Top Contributor (Next.js Framework)",
    issuer: "GitHub Open Source",
    date: "2022 - Present",
    category: "Profile",
    description: "Recognized as a regular contributor to the Next.js core repository, optimizing client-side build modules and dev-server runtimes.",
    link: "https://github.com/vercel/next.js"
  }
];

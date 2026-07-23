export interface Skill {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Languages" | "Cloud & DevOps" | "Tools & Design";
  iconName: string;
  progress: number;
  experienceLevel: "Expert" | "Advanced" | "Intermediate";
  years: number;
}

export const skillsData: Skill[] = [
  // Languages
  { name: "TypeScript", category: "Languages", iconName: "Code2", progress: 95, experienceLevel: "Expert", years: 6 },
  { name: "JavaScript", category: "Languages", iconName: "FileCode", progress: 98, experienceLevel: "Expert", years: 8 },
  { name: "Python", category: "Languages", iconName: "Terminal", progress: 85, experienceLevel: "Advanced", years: 5 },
  { name: "SQL", category: "Languages", iconName: "Database", progress: 88, experienceLevel: "Advanced", years: 6 },
  { name: "Go", category: "Languages", iconName: "Cpu", progress: 75, experienceLevel: "Intermediate", years: 2 },

  // Frontend
  { name: "React / Next.js", category: "Frontend", iconName: "Atom", progress: 96, experienceLevel: "Expert", years: 6 },
  { name: "Tailwind CSS", category: "Frontend", iconName: "Palette", progress: 98, experienceLevel: "Expert", years: 5 },
  { name: "Framer Motion", category: "Frontend", iconName: "Sparkles", progress: 90, experienceLevel: "Expert", years: 3 },
  { name: "Redux / Zustand", category: "Frontend", iconName: "Layers", progress: 92, experienceLevel: "Expert", years: 5 },
  { name: "HTML5 / CSS3", category: "Frontend", iconName: "Globe", progress: 98, experienceLevel: "Expert", years: 8 },

  // Backend
  { name: "Node.js / Express", category: "Backend", iconName: "Server", progress: 92, experienceLevel: "Expert", years: 6 },
  { name: "GraphQL / Apollo", category: "Backend", iconName: "GitMerge", progress: 85, experienceLevel: "Advanced", years: 4 },
  { name: "gRPC", category: "Backend", iconName: "Zap", progress: 78, experienceLevel: "Intermediate", years: 2 },
  { name: "NestJS", category: "Backend", iconName: "ShieldCheck", progress: 80, experienceLevel: "Advanced", years: 3 },

  // Database
  { name: "PostgreSQL", category: "Database", iconName: "DatabaseBackup", progress: 90, experienceLevel: "Expert", years: 5 },
  { name: "MongoDB", category: "Database", iconName: "FolderOpen", progress: 88, experienceLevel: "Advanced", years: 5 },
  { name: "Prisma ORM", category: "Database", iconName: "Binary", progress: 94, experienceLevel: "Expert", years: 4 },
  { name: "Redis", category: "Database", iconName: "Activity", progress: 85, experienceLevel: "Advanced", years: 3 },

  // Cloud & DevOps
  { name: "Docker", category: "Cloud & DevOps", iconName: "Box", progress: 88, experienceLevel: "Advanced", years: 4 },
  { name: "AWS (S3/EC2/Lambda)", category: "Cloud & DevOps", iconName: "CloudLightning", progress: 85, experienceLevel: "Advanced", years: 4 },
  { name: "CI/CD (GitHub Actions)", category: "Cloud & DevOps", iconName: "Workflow", progress: 90, experienceLevel: "Expert", years: 4 },
  { name: "Vercel / Netlify", category: "Cloud & DevOps", iconName: "Cloud", progress: 95, experienceLevel: "Expert", years: 5 },
  { name: "Kubernetes", category: "Cloud & DevOps", iconName: "Compass", progress: 70, experienceLevel: "Intermediate", years: 2 },

  // Tools & Design
  { name: "Figma (UI/UX)", category: "Tools & Design", iconName: "Figma", progress: 85, experienceLevel: "Advanced", years: 4 },
  { name: "Git / GitHub", category: "Tools & Design", iconName: "Github", progress: 96, experienceLevel: "Expert", years: 8 },
  { name: "Jest / Cypress", category: "Tools & Design", iconName: "CheckSquare", progress: 90, experienceLevel: "Expert", years: 4 },
];

import React from "react";
import * as Icons from "lucide-react";
import { GithubIcon, FigmaIcon } from "./BrandIcons";

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className = "", size = 20 }: DynamicIconProps) {
  // Brand icon overrides
  if (name === "Github") {
    return <GithubIcon className={className} size={size} />;
  }
  if (name === "Figma") {
    return <FigmaIcon className={className} size={size} />;
  }

  // Safe lookup for Lucide Icons
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a default icon if not found
    return <Icons.HelpCircle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}


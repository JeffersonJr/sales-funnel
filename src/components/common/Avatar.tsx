"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Avatar({ name, className, size = "md" }: AvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-16 h-16 text-xl"
  };

  const bgColors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-green-100 text-green-700",
    "bg-red-100 text-red-700",
    "bg-indigo-100 text-indigo-700"
  ];

  // Simple hash for consistent color
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const colorClass = bgColors[getHash(name) % bgColors.length];

  return (
    <div className={cn(
      "rounded-2xl flex items-center justify-center font-black transition-transform",
      sizes[size],
      colorClass,
      className
    )}>
      {getInitials(name)}
    </div>
  );
}

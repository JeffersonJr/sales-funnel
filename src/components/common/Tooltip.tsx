"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({ content, children, position = "top", className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-gray-900 dark:border-t-white",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-gray-900 dark:border-b-white",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-gray-900 dark:border-l-white",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-gray-900 dark:border-r-white",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 5 : position === "bottom" ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === "top" ? 5 : position === "bottom" ? -5 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-[100] px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl whitespace-nowrap pointer-events-none",
              positionClasses[position],
              className
            )}
          >
            {content}
            <div className={cn(
              "absolute border-4 border-transparent",
              arrowClasses[position]
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

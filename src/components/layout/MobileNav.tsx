"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Zap,
  FileText,
  Globe,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { name: "Negócios", href: "/", icon: LayoutDashboard },
  { name: "Empresas", href: "/companies", icon: Globe },
  { name: "Novo", href: "#", icon: Plus, isAction: true },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Mais", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 pb-8 pt-4 z-[100] flex justify-between items-center">
      {mobileItems.map((item) => {
        const isActive = pathname === item.href;
        
        if (item.isAction) {
          return (
            <button 
              key={item.name}
              className="w-14 h-14 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-gray-200 -translate-y-6 border-4 border-white"
            >
              <item.icon size={24} />
            </button>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-gray-900 scale-110" : "text-gray-400"
            )}
          >
            <item.icon size={20} className={isActive ? "text-gray-900" : "text-gray-400"} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
            {isActive && <div className="w-1 h-1 bg-gray-900 rounded-full mt-1" />}
          </Link>
        );
      })}
    </div>
  );
}

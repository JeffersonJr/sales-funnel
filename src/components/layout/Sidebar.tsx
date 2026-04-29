"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  FileText,
  MessageCircle,
  Camera,
  Globe,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Negócios", href: "/", icon: LayoutDashboard },
  { name: "Análise", href: "/analytics", icon: BarChart3 },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Documentos", href: "/documents", icon: FileText },
  { name: "Automações", href: "/automations", icon: Zap },
  { name: "Configurações", href: "/settings", icon: Settings },
];

const integrations = [
  { name: "WhatsApp", icon: MessageCircle, color: "text-green-500" },
  { name: "Instagram", icon: Camera, color: "text-pink-500" },
  { name: "Web Chat", icon: Globe, color: "text-blue-500" },
  { name: "Salesbot", icon: Bot, color: "text-purple-500" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={cn(
        "flex flex-col h-screen border-r border-gray-100 bg-[#f8f9fa] sticky top-0 transition-all duration-300",
        isCollapsed ? "items-center" : "items-start"
      )}
    >
      <div className="p-6 flex items-center justify-between w-full">
        {!isCollapsed && (
          <span className="text-xl font-black tracking-tighter text-gray-900">Funnel.io</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 transition-all"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4">
           {!isCollapsed && <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2">Principal</p>}
           {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link
                 key={item.name}
                 href={item.href}
                 className={cn(
                   "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group mb-0.5",
                   isActive 
                     ? "bg-white text-gray-900 shadow-sm border border-gray-50" 
                     : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                 )}
               >
                 <item.icon 
                   size={18} 
                   className={cn(
                     "transition-colors",
                     isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"
                   )} 
                 />
                 {!isCollapsed && (
                   <span className="text-sm font-bold">{item.name}</span>
                 )}
               </Link>
             );
           })}
        </div>

        <div className="pt-6">
           {!isCollapsed && <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-4">Integrações</p>}
           {integrations.map((item) => (
             <div
               key={item.name}
               className={cn(
                 "flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm cursor-pointer transition-all group",
                 isCollapsed && "justify-center"
               )}
             >
               <item.icon 
                 size={18} 
                 className={cn("transition-colors", item.color)} 
               />
               {!isCollapsed && (
                 <span className="text-sm font-bold">{item.name}</span>
               )}
             </div>
           ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 w-full bg-[#f8f9fa]">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed ? "justify-center" : "px-3"
        )}>
          <div className="w-9 h-9 rounded-2xl bg-white flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jefferson" alt="Avatar" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-gray-900 truncate">Jefferson Jr</span>
              <span className="text-[10px] font-bold text-blue-500 uppercase">Pro Plan</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

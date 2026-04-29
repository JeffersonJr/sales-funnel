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
  { name: "Empresas", href: "/companies", icon: Globe },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Documentos", href: "/documents", icon: FileText },
  { name: "Automações", href: "/automations", icon: Zap },
  { name: "Análise", href: "/analytics", icon: BarChart3 },
  { name: "Usuários", href: "/users", icon: Users },
  { name: "Configurações", href: "/settings", icon: Settings },
];

const integrationItems = [
  { name: "WhatsApp", href: "/integrations/whatsapp", icon: MessageCircle, color: "text-green-500" },
  { name: "Instagram", href: "/integrations/instagram", icon: Camera, color: "text-pink-500" },
  { name: "Web Chat", href: "/integrations/webchat", icon: Globe, color: "text-blue-500" },
  { name: "Salesbot", href: "/integrations/salesbot", icon: Bot, color: "text-purple-500" },
];

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
          <span className="text-xl font-black tracking-tighter text-gray-900">leads.site</span>
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
           {integrationItems.map((item) => {
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
                     isActive ? item.color : "text-gray-400 group-hover:text-gray-900"
                   )} 
                 />
                 {!isCollapsed && (
                   <span className="text-sm font-bold">{item.name}</span>
                 )}
               </Link>
             );
           })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100 w-full">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-50 shadow-sm transition-all",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
              <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{user?.name}</p>
                <p className="text-[10px] font-bold text-gray-400 truncate">{user?.role}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

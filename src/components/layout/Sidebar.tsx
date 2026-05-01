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
  Globe,
  Bot,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useFunnel } from "@/context/FunnelContext";

// Official Brand Icons in SVG
const WhatsAppIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MetaIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 640 640" fill="currentColor" className={className}>
    <path d="M640 381.9C640 473.2 600.6 530.4 529.7 530.4C467.1 530.4 433.9 495.8 372.8 393.8L341.4 341.2C333.1 328.7 326.9 317 320.2 306.2C300.1 340 273.1 389.2 273.1 389.2C206.1 505.8 168.5 530.4 116.2 530.4C43.4 530.4 0 473.1 0 384.5C0 241.5 79.8 106.4 183.9 106.4C234.1 106.4 277.7 131.1 328.7 195.9C365.8 145.8 406.8 106.4 459.3 106.4C558.4 106.4 640 232.1 640 381.9zM287.4 256.2C244.5 194.1 216.5 175.7 183 175.7C121.1 175.7 69.2 281.8 69.2 385.7C69.2 434.2 87.7 461.4 118.8 461.4C149 461.4 167.8 442.4 222 357.6C222 357.6 246.7 318.5 287.4 256.2zM531.2 461.4C563.4 461.4 578.1 433.9 578.1 386.5C578.1 262.3 523.8 161.1 454.9 161.1C421.7 161.1 393.8 187 360 239.1C369.4 252.9 379.1 268.1 389.3 284.5L426.8 346.9C485.5 441 500.3 461.4 531.2 461.4z"/>
  </svg>
);

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
  { name: "WhatsApp", href: "/integrations/whatsapp", icon: WhatsAppIcon, color: "text-green-500" },
  { name: "Instagram", href: "/integrations/instagram", icon: InstagramIcon, color: "text-pink-500" },
  { name: "Meta Ads", href: "/integrations/meta", icon: MetaIcon, color: "text-blue-600" },
  { name: "Web Chat", href: "/integrations/webchat", icon: Globe, color: "text-blue-500" },
  { name: "Salesbot", href: "/integrations/salesbot", icon: Bot, color: "text-primary" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme } = useFunnel();

  const isDarkMode = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={cn(
        "flex flex-col h-screen border-r border-border bg-card sticky top-0 transition-all duration-300 z-50",
        isCollapsed ? "items-center" : "items-start"
      )}
    >
      <div className="p-6 flex items-center justify-between w-full h-20">
        {!isCollapsed && (
          <Link href="/">
            <img 
              src={isDarkMode ? "/logo white.svg" : "/logo gray.svg"} 
              alt="Leads.site Logo" 
              className="h-7 w-auto transition-all duration-300" 
            />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 w-full overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
           {!isCollapsed && (
             <p className="text-[10px] font-black text-foreground/80 dark:text-muted-foreground uppercase tracking-[0.2em] px-3 mb-4">
               Menu Principal
             </p>
           )}
           {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link
                 key={item.name}
                 href={item.href}
                 className={cn(
                   "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                   isActive 
                     ? "bg-primary text-primary-foreground shadow-lg dark:shadow-white/5" 
                     : "text-muted-foreground hover:bg-muted hover:text-foreground"
                 )}
               >
                 <item.icon 
                   size={18} 
                   className={cn(
                     "transition-colors",
                     isActive ? "text-inherit" : "text-muted-foreground group-hover:text-foreground"
                   )} 
                 />
                 {!isCollapsed && (
                   <span className="text-sm font-bold tracking-tight">{item.name}</span>
                 )}
                 {isActive && !isCollapsed && (
                   <motion.div 
                     layoutId="active-indicator"
                     className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                   />
                 )}
               </Link>
             );
           })}
        </div>

        <div className="space-y-1">
           {!isCollapsed && (
             <p className="text-[10px] font-black text-foreground/80 dark:text-muted-foreground uppercase tracking-[0.2em] px-3 mb-4">
               Canais Ativos
             </p>
           )}
           {integrationItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link
                 key={item.name}
                 href={item.href}
                 className={cn(
                   "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                   isActive 
                     ? "bg-muted text-foreground" 
                     : "text-muted-foreground hover:bg-muted hover:text-foreground"
                 )}
               >
                 <item.icon 
                   size={18} 
                   className={cn(
                     "transition-colors",
                     isActive ? item.color : "text-muted-foreground group-hover:text-foreground"
                   )} 
                 />
                 {!isCollapsed && (
                   <span className="text-sm font-bold tracking-tight">{item.name}</span>
                 )}
               </Link>
             );
           })}
        </div>
      </nav>

      <div className="p-4 border-t border-border w-full">
        <button 
          onClick={logout}
          className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all flex items-center gap-3 group w-full px-4"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          {!isCollapsed && <span className="text-sm font-bold">Encerrar Sessão</span>}
        </button>
      </div>
    </motion.aside>
  );
}

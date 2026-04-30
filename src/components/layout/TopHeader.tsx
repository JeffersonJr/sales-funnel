"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import Link from "next/link";
import { ChevronDown, Bell, Users, Settings, LogOut, CreditCard, Zap, DollarSign, FileText, Sun, Moon, Monitor } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFunnel } from "@/context/FunnelContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TopHeader() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useFunnel();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Novo Lead recebido", desc: "João Silva entrou pelo formulário", time: "5m atrás", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", link: "/leads" },
    { id: 2, title: "Negócio Ganho!", desc: "Venda de R$ 5.000,00 fechada", time: "2h atrás", icon: DollarSign, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", link: "/" },
    { id: 3, title: "Documento Assinado", desc: "Contrato SaaS assinado por Maria", time: "5h atrás", icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", link: "/documents" },
  ];

  return (
    <header className="h-20 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-end px-8 gap-4 transition-all duration-300">
      {/* Theme Switcher */}
      <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border">
        {[
          { id: 'light', label: 'Claro', icon: Sun },
          { id: 'dark', label: 'Escuro', icon: Moon },
          { id: 'system', label: 'Auto', icon: Monitor }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all relative flex items-center gap-2 group",
              theme === t.id 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <motion.div
              initial={false}
              animate={{ 
                scale: theme === t.id ? 1 : 0.8,
                rotate: theme === t.id ? 0 : -10
              }}
            >
              <t.icon size={14} />
            </motion.div>
            <AnimatePresence>
              {theme === t.id && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-[9px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap"
                >
                  {t.label}
                </motion.span>
              )}
            </AnimatePresence>
            {theme === t.id && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-primary rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={cn(
            "p-2.5 text-muted-foreground hover:text-foreground rounded-xl transition-all relative",
            showNotifications ? "bg-muted" : "hover:bg-muted/50"
          )}
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>

        <AnimatePresence>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-card rounded-[2rem] shadow-2xl dark:shadow-none border border-border overflow-hidden z-20"
              >
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Central de Alertas</h3>
                  <span className="text-[10px] font-black text-primary px-2 py-0.5 rounded-full bg-primary/10">3 NOVAS</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((n) => (
                    <Link 
                      key={n.id} 
                      href={n.link}
                      onClick={() => setShowNotifications(false)}
                      className="flex gap-4 p-5 hover:bg-muted/50 transition-colors border-b border-border last:border-0 group"
                    >
                      <div className={cn("w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm", n.bg, n.color)}>
                        <n.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-foreground truncate tracking-tight">{n.title}</p>
                        <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">{n.desc}</p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-2">{n.time}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground transition-colors border-t border-border block text-center"
                >
                  Ver Tudo
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative group">
        <div className="flex items-center gap-4 pl-6 border-l border-border cursor-pointer py-1.5">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{user?.name || "Jefferson Jr"}</span>
            <Link 
              href="/plans"
              className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all px-2 py-0.5 rounded-full mt-1"
            >
              {user?.plan || "Pro Plan"}
            </Link>
          </div>
          <div className="relative">
             <Avatar name={user?.name || "Jefferson Jr"} size="md" className="group-hover:scale-105 transition-transform" />
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
          <div className="bg-card rounded-[2.5rem] border border-border w-72 overflow-hidden p-3">
            <div className="p-5 border-b border-border mb-2 bg-muted/30 rounded-[1.5rem]">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sua Conta</p>
              <p className="text-xs font-bold text-foreground mt-1 truncate">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground rounded-2xl transition-all">
                <Users size={18} className="text-muted-foreground" /> Meu Perfil
              </Link>
              <Link href="/billing" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground rounded-2xl transition-all">
                <CreditCard size={18} className="text-muted-foreground" /> Faturamento
              </Link>
              <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground rounded-2xl transition-all">
                <Settings size={18} className="text-muted-foreground" /> Configurações
              </Link>
            </div>
            <div className="h-[1px] bg-border my-3 mx-4" />
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-4 text-sm font-black text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <LogOut size={18} /> Sair do Sistema
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

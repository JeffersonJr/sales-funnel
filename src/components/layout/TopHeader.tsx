"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import Link from "next/link";
import { ChevronDown, Bell, Users, Settings, LogOut, CreditCard, Zap, DollarSign, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TopHeader() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Novo Lead recebido", desc: "João Silva entrou pelo formulário", time: "5m atrás", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", link: "/leads" },
    { id: 2, title: "Negócio Ganho!", desc: "Venda de R$ 5.000,00 fechada", time: "2h atrás", icon: DollarSign, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", link: "/" },
    { id: 3, title: "Documento Assinado", desc: "Contrato SaaS assinado por Maria", time: "5h atrás", icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", link: "/documents" },
  ];

  return (
    <header className="h-20 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-end px-8 gap-6 transition-all duration-300">
      {/* Notifications */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={cn(
            "p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all relative",
            showNotifications ? "bg-gray-100 dark:bg-white/10" : "hover:bg-gray-50 dark:hover:bg-white/5"
          )}
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#09090b]" />
        </button>

        <AnimatePresence>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#121215] rounded-[2rem] shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden z-20"
              >
                <div className="p-6 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Central de Alertas</h3>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30">3 NOVAS</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((n) => (
                    <Link 
                      key={n.id} 
                      href={n.link}
                      onClick={() => setShowNotifications(false)}
                      className="flex gap-4 p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0 group"
                    >
                      <div className={cn("w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm", n.bg, n.color)}>
                        <n.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900 dark:text-white truncate tracking-tight">{n.title}</p>
                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 truncate mt-0.5">{n.desc}</p>
                        <p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-2">{n.time}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-50 dark:border-white/5 block text-center"
                >
                  Ver Tudo
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative group">
        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 dark:border-white/10 cursor-pointer py-1.5">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight">{user?.name || "Jefferson Jr"}</span>
            <Link 
              href="/plans"
              className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all px-2 py-0.5 rounded-full mt-1"
            >
              {user?.plan || "Pro Plan"}
            </Link>
          </div>
          <div className="relative">
             <Avatar name={user?.name || "Jefferson Jr"} size="md" className="shadow-xl shadow-blue-100/50 dark:shadow-none group-hover:scale-105 transition-transform" />
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#09090b] rounded-full" />
          </div>
          <ChevronDown size={14} className="text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
          <div className="bg-white dark:bg-[#121215] rounded-[2.5rem] shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/10 w-72 overflow-hidden p-3">
            <div className="p-5 border-b border-gray-50 dark:border-white/5 mb-2 bg-gray-50/50 dark:bg-white/5 rounded-[1.5rem]">
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sua Conta</p>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-1 truncate">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all">
                <Users size={18} className="text-gray-400" /> Meu Perfil
              </Link>
              <Link href="/billing" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all">
                <CreditCard size={18} className="text-gray-400" /> Faturamento
              </Link>
              <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all">
                <Settings size={18} className="text-gray-400" /> Configurações
              </Link>
            </div>
            <div className="h-[1px] bg-gray-50 dark:bg-white/5 my-3 mx-4" />
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-4 text-sm font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <LogOut size={18} /> Sair do Sistema
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

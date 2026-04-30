"use client";

import React, { useState } from "react";
import { Camera, ArrowLeft, CheckCircle2, ShieldCheck, Layout, RefreshCw, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Official Instagram Logo
const InstagramIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function InstagramIntegrationPage() {
  const [status, setStatus] = useState<"disconnected" | "connected">("disconnected");

  const handleConnect = () => {
    toast.success("Redirecionando para o Meta...");
    setTimeout(() => {
      setStatus("connected");
      toast.success("Instagram conectado com sucesso!");
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto transition-colors duration-300">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3 text-xs font-black text-pink-500 uppercase tracking-widest mb-1">
             Social & Automação
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Instagram Business</h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === "disconnected" ? (
          <motion.div 
            key="disconnected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-card p-12 lg:p-24 rounded-[3.5rem] border border-gray-100 dark:border-border shadow-2xl dark:shadow-none text-center"
          >
             <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/20 text-pink-500 rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-lg shadow-pink-100 dark:shadow-none">
                <InstagramIcon size={48} />
             </div>
             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Conecte seu Instagram</h2>
             <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 font-medium leading-relaxed">
               Automatize respostas, gerencie comentários e transforme seguidores em clientes reais com nossa integração oficial.
             </p>
             <button 
              onClick={handleConnect}
              className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white px-12 py-5 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-pink-200 dark:shadow-none"
             >
                CONECTAR AO INSTAGRAM
             </button>
             <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-pink-500" /> API OFICIAL</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-pink-500" /> VERIFICADO</div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-card rounded-[3rem] border border-gray-100 dark:border-border p-10 shadow-xl dark:shadow-none">
                   <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop" 
                          alt="Profile" 
                          className="w-24 h-24 rounded-[2rem] object-cover border-4 border-pink-50 dark:border-pink-900/20"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-border flex items-center justify-center text-pink-500 shadow-lg">
                           <InstagramIcon size={20} />
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">@leads.site_oficial</h3>
                      <p className="text-xs font-bold text-gray-400 mt-1">Conta Business</p>
                      
                      <div className="grid grid-cols-2 gap-4 w-full mt-8">
                         <div className="p-4 bg-gray-50 dark:bg-muted rounded-2xl">
                            <p className="text-lg font-black text-gray-900 dark:text-white">12.4k</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Seguidores</p>
                         </div>
                         <div className="p-4 bg-gray-50 dark:bg-muted rounded-2xl">
                            <p className="text-lg font-black text-gray-900 dark:text-white">850</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Leads este mês</p>
                         </div>
                      </div>

                      <button 
                        onClick={() => setStatus("disconnected")}
                        className="w-full mt-8 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                      >
                         Desconectar Conta
                      </button>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-card rounded-[3rem] border border-gray-100 dark:border-border p-12 shadow-xl dark:shadow-none">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">Automações Ativas</h3>
                      <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">Configurar Nova</button>
                   </div>
                   
                   <div className="space-y-4">
                      {[
                        { name: "Resposta Direct (Boas-vindas)", status: "Ativo", icon: MessageCircle },
                        { name: "Automação de Comentários (Post)", status: "Ativo", icon: Layout },
                        { name: "Sincronização de Directs", status: "Pausado", icon: RefreshCw },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-muted/30 rounded-3xl border border-transparent dark:border-border hover:border-gray-200 dark:hover:border-gray-700 transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-xl flex items-center justify-center text-pink-500 shadow-sm">
                                 <item.icon size={24} />
                              </div>
                              <p className="text-sm font-black text-gray-900 dark:text-white">{item.name}</p>
                           </div>
                           <div className={cn(
                             "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                             item.status === "Ativo" ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-gray-200 dark:bg-muted text-gray-400"
                           )}>
                              {item.status}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

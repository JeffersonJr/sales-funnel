"use client";

import React, { useState } from "react";
import { 
  Settings2, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  Users2,
  RefreshCw,
  Layout,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

// Official Meta Logo
const MetaIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 640 640" fill="currentColor" className={className}>
    <path d="M640 381.9C640 473.2 600.6 530.4 529.7 530.4C467.1 530.4 433.9 495.8 372.8 393.8L341.4 341.2C333.1 328.7 326.9 317 320.2 306.2C300.1 340 273.1 389.2 273.1 389.2C206.1 505.8 168.5 530.4 116.2 530.4C43.4 530.4 0 473.1 0 384.5C0 241.5 79.8 106.4 183.9 106.4C234.1 106.4 277.7 131.1 328.7 195.9C365.8 145.8 406.8 106.4 459.3 106.4C558.4 106.4 640 232.1 640 381.9zM287.4 256.2C244.5 194.1 216.5 175.7 183 175.7C121.1 175.7 69.2 281.8 69.2 385.7C69.2 434.2 87.7 461.4 118.8 461.4C149 461.4 167.8 442.4 222 357.6C222 357.6 246.7 318.5 287.4 256.2zM531.2 461.4C563.4 461.4 578.1 433.9 578.1 386.5C578.1 262.3 523.8 161.1 454.9 161.1C421.7 161.1 393.8 187 360 239.1C369.4 252.9 379.1 268.1 389.3 284.5L426.8 346.9C485.5 441 500.3 461.4 531.2 461.4z"/>
  </svg>
);

type MetaStatus = "disconnected" | "connecting" | "connected";

export default function MetaIntegrationPage() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<MetaStatus>("disconnected");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleConnect = () => {
    setStatus("connecting");
    setTimeout(() => {
      setStatus("connected");
      toast.success("Meta Business Manager conectado!");
    }, 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen transition-colors duration-300">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
             Anúncios & Públicos
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Meta Ads Integration</h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === "disconnected" && (
          <motion.div 
            key="disconnected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-card p-12 lg:p-24 rounded-[3.5rem] border border-gray-100 dark:border-border shadow-2xl dark:shadow-none text-center"
          >
             <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-lg shadow-blue-100 dark:shadow-none">
                <MetaIcon size={48} />
             </div>
             <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Conecte sua Business Manager</h2>
             <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 font-medium leading-relaxed">
               Sincronize seus Leads de anúncios do Facebook e Instagram diretamente para seu funil de vendas em tempo real.
             </p>
             <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleConnect}
                  className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none flex items-center justify-center gap-3"
                >
                   CONECTAR COM META <ExternalLink size={18} />
                </button>
             </div>
             <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-blue-500" /> API OFICIAL</div>
                <div className="flex items-center gap-2"><Users2 size={14} className="text-blue-500" /> MULTI-CONTAS</div>
             </div>
          </motion.div>
        )}

        {status === "connecting" && (
          <motion.div 
            key="connecting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-card p-12 lg:p-24 rounded-[3.5rem] border border-gray-100 dark:border-border shadow-2xl dark:shadow-none text-center flex flex-col items-center justify-center min-h-[500px]"
          >
             <div className="relative">
                <div className="w-32 h-32 border-4 border-blue-50 dark:border-blue-900/30 rounded-full animate-spin border-t-blue-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <MetaIcon size={40} className="text-blue-600" />
                </div>
             </div>
             <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-8">Autorizando Acesso...</h2>
             <p className="text-gray-400 font-medium mt-2">Estamos conectando com a sua conta do Meta Business Suite.</p>
          </motion.div>
        )}

        {status === "connected" && (
          <motion.div 
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
             {/* Account Info Sidebar */}
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-card rounded-[3rem] border border-gray-100 dark:border-border p-10 shadow-xl dark:shadow-none">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                         <Building2 size={28} />
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-gray-900 dark:text-white">Leads Site BM</h3>
                         <p className="text-xs font-bold text-blue-600 dark:text-blue-400">ID: 488229102283</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-muted/50 rounded-2xl border border-transparent dark:border-border flex items-center justify-between">
                         <span className="text-xs font-bold text-gray-400">Status da Conta</span>
                         <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Ativo</span>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-muted/50 rounded-2xl border border-transparent dark:border-border flex items-center justify-between">
                         <span className="text-xs font-bold text-gray-400">Páginas Conectadas</span>
                         <span className="text-sm font-black text-gray-900 dark:text-white">12</span>
                      </div>
                   </div>

                   <button 
                     onClick={() => setStatus("disconnected")}
                     className="w-full mt-8 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                   >
                      Desconectar BM
                   </button>
                </div>

                <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white">
                   <div className="flex items-center gap-3 mb-6">
                      <Layout size={20} />
                      <h3 className="text-sm font-black uppercase tracking-widest">Webhooks</h3>
                   </div>
                   <p className="text-xs font-medium opacity-80 leading-relaxed">Sua conta está sincronizada e recebendo eventos em tempo real via Meta Graph API.</p>
                </div>
             </div>

             {/* Pages & Assets Area */}
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-card rounded-[3rem] border border-gray-100 dark:border-border p-12 shadow-xl dark:shadow-none">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">Formulários de Lead</h3>
                      <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">
                         <RefreshCw size={14} /> Sincronizar Agora
                      </button>
                   </div>

                   <div className="space-y-4">
                      {[
                        { name: "Campanha Lançamento 2026", form: "Formulário Oficial V1", leads: 42, date: "Hoje" },
                        { name: "Remarketing Dinâmico", form: "Cadastro Rápido", leads: 156, date: "Ontem" },
                        { name: "Topo de Funil - E-book", form: "Download Direto", leads: 890, date: "2 dias atrás" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-muted/30 rounded-3xl border border-transparent dark:border-border hover:border-gray-200 dark:hover:border-gray-700 transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                 <MetaIcon size={24} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-gray-900 dark:text-white">{item.name}</p>
                                 <p className="text-xs font-bold text-gray-400">{item.form}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-blue-600 dark:text-blue-400">{item.leads}</p>
                              <p className="text-[9px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-widest">{item.date}</p>
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

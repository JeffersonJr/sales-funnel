"use client";

import React, { useState } from "react";
import { Globe, ArrowLeft, Code, CheckCircle2, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function WebChatIntegrationPage() {
  const [status, setStatus] = useState<"disconnected" | "verifying" | "connected">("disconnected");

  const handleVerify = () => {
    setStatus("verifying");
    setTimeout(() => {
      setStatus("connected");
      toast.success("Widget detectado com sucesso!");
    }, 2500);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto transition-colors duration-300">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
             Widget de Site
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Web Chat Widget</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Installation Section */}
         <div className="bg-white dark:bg-card p-10 lg:p-12 rounded-[3rem] border border-gray-100 dark:border-border shadow-xl dark:shadow-none">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Instalação</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">
               Copie o código abaixo e cole antes da tag <code className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">&lt;/body&gt;</code> do seu site para ativar o chat.
            </p>
            <div className="bg-gray-900 dark:bg-muted p-8 rounded-[2rem] text-white font-mono text-xs leading-relaxed relative group border border-transparent dark:border-border">
               <pre className="whitespace-pre-wrap overflow-x-auto scrollbar-hide">
{`<script src="https://cdn.leads.site/widget.js"></script>
<script>
  LeadsSite.init({
    token: "XYZ-123-ABC",
    theme: "modern"
  });
</script>`}
               </pre>
               <button 
                 onClick={() => { navigator.clipboard.writeText('XYZ-123-ABC'); toast.success("Código copiado!"); }}
                 className="absolute top-6 right-6 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
               >
                  <Code size={18} />
               </button>
            </div>
            
            <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-900 flex items-start gap-4">
               <Zap size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
               <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                 O widget herda automaticamente as cores da sua marca configuradas em Aparência.
               </p>
            </div>
         </div>

         {/* Status & Verification Section */}
         <div className="bg-white dark:bg-card p-10 lg:p-12 rounded-[3rem] border border-gray-100 dark:border-border shadow-xl dark:shadow-none flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
               <div className={cn(
                 "w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500",
                 status === "connected" ? "bg-green-50 dark:bg-green-900/20 text-green-500" : "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
               )}>
                  {status === "verifying" ? (
                    <RefreshCw className="animate-spin" size={48} />
                  ) : status === "connected" ? (
                    <CheckCircle2 size={48} />
                  ) : (
                    <Globe size={48} />
                  )}
               </div>
               {status === "connected" && (
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-card"
                 >
                    <CheckCircle2 size={16} />
                 </motion.div>
               )}
            </div>

            <div className="mb-10">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Status da Conexão</h3>
               <div className="flex items-center justify-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    status === "connected" ? "bg-green-500" : status === "verifying" ? "bg-blue-500 animate-pulse" : "bg-gray-300 dark:bg-gray-600"
                  )} />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {status === "connected" ? "Conectado" : status === "verifying" ? "Verificando..." : "Aguardando Instalação"}
                  </span>
               </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button 
                disabled={status === "verifying" || status === "connected"}
                onClick={handleVerify}
                className={cn(
                  "w-full py-5 rounded-2xl font-black text-sm transition-all shadow-xl dark:shadow-none",
                  status === "connected" 
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default" 
                    : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
                )}
              >
                 {status === "connected" ? "CONEXÃO ATIVA" : status === "verifying" ? "PROCESSANDO..." : "VERIFICAR CONEXÃO"}
              </button>

              {status === "connected" && (
                <button 
                  onClick={() => {
                    setStatus("disconnected");
                    toast.error("Widget desconectado.");
                  }}
                  className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  Desconectar Widget
                </button>
              )}
            </div>

            <div className="mt-12 flex items-center gap-3 text-gray-400">
               <ShieldCheck size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">SSL Seguro Habilitado</span>
            </div>
         </div>
      </div>
    </div>
  );
}

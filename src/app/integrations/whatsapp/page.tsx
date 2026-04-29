"use client";

import React, { useState } from "react";
import { 
  MessageCircle, 
  Settings2, 
  History, 
  Zap, 
  Smartphone,
  QrCode,
  Link as LinkIcon,
  CheckCircle2,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export default function WhatsAppIntegrationPage() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"connected" | "disconnected">("connected");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm hover:shadow-md">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3 text-xs font-black text-green-500 uppercase tracking-widest mb-1">
             Integração Oficial
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">WhatsApp Business API</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Status Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-10">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
              <MessageCircle size={40} />
            </div>
            
            <div className="text-center space-y-2 mb-10">
               <div className="flex items-center justify-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-sm font-black text-gray-900">Conectado</span>
               </div>
               <p className="text-xs font-bold text-gray-400">+55 11 99999-8888</p>
            </div>

            <button 
              onClick={() => { setStatus("disconnected"); toast.error("WhatsApp desconectado."); }}
              className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
            >
              Desconectar Número
            </button>
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-yellow-400" size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest">Uso de API</h3>
            </div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">
                     <span>Mensagens Enviadas</span>
                     <span>85%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[85%]" />
                  </div>
               </div>
               <p className="text-[10px] font-medium opacity-50">Ciclo renova em 12 dias</p>
            </div>
          </div>
        </div>

        {/* Configuration Area */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-12">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Settings2 size={24} className="text-gray-400" /> 
              Configurações de Fluxo
            </h3>

            <div className="space-y-6">
               <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div>
                    <h4 className="text-sm font-black text-gray-900">Envio Automático</h4>
                    <p className="text-xs text-gray-500 font-medium">Disparar mensagem ao entrar no funil</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
               </div>

               <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div>
                    <h4 className="text-sm font-black text-gray-900">Sincronizar Histórico</h4>
                    <p className="text-xs text-gray-500 font-medium">Importar conversas antigas automaticamente</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
               </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-50">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Mensagem de Boas Vindas Padrão</h4>
               <textarea 
                  className="w-full bg-gray-50 border border-transparent rounded-3xl p-8 text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all min-h-[150px] resize-none"
                  defaultValue="Olá! Recebemos seu interesse em nosso produto. Como posso te ajudar hoje?"
               />
               <button className="mt-6 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-gray-200">
                  Salvar Configurações
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

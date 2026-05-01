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
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  SmartphoneIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

const WhatsAppIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WhatsAppIntegrationPage() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStatus("connected");
      setIsLoading(false);
      toast.success("WhatsApp conectado com sucesso!");
    }, 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen transition-colors duration-300">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm hover:shadow-md">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3 text-xs font-black text-green-500 uppercase tracking-widest mb-1">
             Integração Oficial Meta
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">WhatsApp Business API</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="wait">
          {status === "connected" ? (
            <motion.div 
              key="connected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="bg-white dark:bg-card rounded-[3rem] border border-gray-100 dark:border-border shadow-xl dark:shadow-none p-10">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-[2rem] flex items-center justify-center mb-8 mx-auto shadow-lg shadow-green-100 dark:shadow-none">
                  <WhatsAppIcon size={40} />
                </div>
                
                <div className="text-center space-y-2 mb-10">
                   <div className="flex items-center justify-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                     <span className="text-sm font-black text-foreground">Conectado</span>
                   </div>
                   <p className="text-xs font-bold text-muted-foreground">+55 11 99999-8888</p>
                </div>

                <button 
                  onClick={() => { setStatus("disconnected"); toast.error("WhatsApp desconectado."); }}
                  className="w-full py-4 bg-gray-50 dark:bg-muted text-gray-500 dark:text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                >
                  Desconectar Número
                </button>
              </div>

              <div className="bg-gray-900 dark:bg-muted rounded-[2.5rem] p-8 text-white">
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
            </motion.div>
          ) : (
            <motion.div 
              key="disconnected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-card rounded-[3.5rem] border border-gray-100 dark:border-border shadow-2xl dark:shadow-none p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-muted text-gray-300 dark:text-gray-600 rounded-[2rem] flex items-center justify-center">
                       <SmartphoneIcon size={40} />
                    </div>
                    <div>
                       <h2 className="text-4xl font-black text-foreground tracking-tight leading-tight">Conecte seu WhatsApp para automatizar seu funil</h2>
                       <p className="text-lg text-muted-foreground font-medium mt-4 max-w-md">Envie mensagens automáticas, sincronize conversas e gerencie seus leads diretamente pela plataforma.</p>
                    </div>

                    <div className="space-y-4">
                       {[
                         { text: "Automações de boas vindas", icon: Zap },
                         { text: "Relatórios de entrega e leitura", icon: History },
                         { text: "Sincronização com o Kanban", icon: CheckCircle2 },
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                            <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                               <item.icon size={14} />
                            </div>
                            {item.text}
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="w-full lg:w-[400px] bg-gray-50 dark:bg-muted/50 rounded-[3rem] p-10 border border-gray-100 dark:border-border text-center space-y-8">
                    <div className="relative inline-block p-4 bg-white dark:bg-card rounded-[2.5rem] shadow-xl">
                       <QrCode size={200} className="text-gray-900 dark:text-white opacity-20" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          {isLoading ? (
                            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
                          ) : (
                            <button 
                              onClick={handleConnect}
                              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all"
                            >
                               GERAR QR CODE
                            </button>
                          )}
                       </div>
                    </div>
                    <div>
                       <p className="text-sm font-black text-gray-900 dark:text-white">Aponte a câmera do seu celular</p>
                       <p className="text-xs font-bold text-gray-400 mt-1">Siga o mesmo processo do WhatsApp Web</p>
                    </div>
                    <div className="pt-6 border-t border-gray-100 dark:border-border flex items-center justify-center gap-3 text-gray-400">
                       <ShieldCheck size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Conexão Segura e Criptografada</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === "connected" && (
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-card rounded-[3rem] border border-gray-100 dark:border-border shadow-xl dark:shadow-none p-12">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Settings2 size={24} className="text-gray-400" /> 
                Configurações de Fluxo
              </h3>

              <div className="space-y-6">
                 <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-muted/30 rounded-3xl border border-gray-100 dark:border-border">
                    <div>
                      <h4 className="text-sm font-black text-foreground">Envio Automático</h4>
                      <p className="text-xs text-muted-foreground font-medium">Disparar mensagem ao entrar no funil</p>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-muted/30 rounded-3xl border border-gray-100 dark:border-border">
                    <div>
                      <h4 className="text-sm font-black text-foreground">Sincronizar Histórico</h4>
                      <p className="text-xs text-muted-foreground font-medium">Importar conversas antigas automaticamente</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 dark:bg-border rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-50 dark:border-border">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Mensagem de Boas Vindas Padrão</h4>
                 <textarea 
                    className="w-full bg-gray-50 dark:bg-muted/30 border border-transparent dark:border-border rounded-3xl p-8 text-sm font-medium focus:bg-white dark:focus:bg-card focus:border-blue-500 outline-none transition-all min-h-[150px] resize-none dark:text-white"
                    defaultValue="Olá! Recebemos seu interesse em nosso produto. Como posso te ajudar hoje?"
                 />
                 <button className="mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-gray-200 dark:shadow-none">
                    Salvar Configurações
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

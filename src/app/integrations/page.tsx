"use client";

import React, { useState } from "react";
import { 
  MessageCircle, 
  Camera, 
  Globe, 
  Zap, 
  ChevronRight,
  ArrowRight,
  Check,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function IntegrationsPage() {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const integrations = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Conecte seu número oficial e envie mensagens automáticas diretamente do funil.",
      icon: MessageCircle,
      color: "text-green-500",
      bg: "bg-green-50",
      href: "/integrations/whatsapp",
      status: "Conectado"
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Responda Directs e automatize comentários usando o poder do Leads.site.",
      icon: Camera,
      color: "text-pink-500",
      bg: "bg-pink-50",
      href: "/integrations/instagram",
      status: "Disponível"
    },
    {
      id: "webchat",
      name: "Web Chat",
      description: "Instale nosso widget no seu site e capture leads em tempo real.",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-50",
      href: "/integrations/webchat",
      status: "Configurar"
    },
    {
      id: "salesbot",
      name: "Salesbot AI",
      description: "Inteligência artificial avançada para qualificação e fechamento automático.",
      icon: Cpu,
      color: "text-purple-500",
      bg: "bg-purple-50",
      href: "/integrations/salesbot",
      status: "Beta"
    }
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Canais & Integrações</h1>
        <p className="text-gray-400 font-medium mt-2">Centralize sua comunicação e conecte suas ferramentas favoritas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {integrations.map((item, idx) => (
          <Link href={item.href} key={item.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50 hover:shadow-2xl hover:border-blue-200 transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                    <item.icon className={item.color} size={40} />
                  </div>
                  <span className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    item.status === "Conectado" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                  )}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{item.name}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-10 flex items-center gap-2 text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                Gerenciar Conexão <ArrowRight size={18} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-gray-900 rounded-[3.5rem] p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-widest mb-4">
              <ShieldCheck size={18} /> Segurança de Ponta-a-Ponta
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Pronto para escalar seu atendimento?</h2>
            <p className="text-gray-400 font-medium">Nossas integrações oficiais utilizam APIs de alta performance para garantir que nenhum lead seja perdido.</p>
          </div>
          <button className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-black text-sm hover:bg-blue-500 hover:text-white transition-all whitespace-nowrap">
            Explorar Marketplace
          </button>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] -ml-32 -mb-32" />
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
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
      icon: WhatsAppIcon,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      href: "/integrations/whatsapp",
      status: "Configurar"
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Responda Directs e automatize comentários usando o poder do Leads.site.",
      icon: InstagramIcon,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-900/20",
      href: "/integrations/instagram",
      status: "Disponível"
    },
    {
      id: "meta",
      name: "Meta Ads",
      description: "Sincronize Leads de anúncios do Facebook e Instagram em tempo real.",
      icon: MetaIcon,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      href: "/integrations/meta",
      status: "Novo"
    },
    {
      id: "webchat",
      name: "Web Chat",
      description: "Instale nosso widget no seu site e capture leads em tempo real.",
      icon: Globe,
      color: "text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      href: "/integrations/webchat",
      status: "Configurar"
    },
    {
      id: "salesbot",
      name: "Salesbot AI",
      description: "Inteligência artificial avançada para qualificação e fechamento automático.",
      icon: Cpu,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      href: "/integrations/salesbot",
      status: "Beta"
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto transition-colors duration-300">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Canais & Integrações</h1>
        <p className="text-gray-400 dark:text-gray-500 font-medium mt-2">Centralize sua comunicação e conecte suas ferramentas favoritas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {integrations.map((item, idx) => (
          <Link href={item.href} key={item.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-card p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:bg-white/5 transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                    <item.icon className={item.color} size={40} />
                  </div>
                  <span className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    item.status === "Conectado" ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : 
                    item.status === "Novo" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                    "bg-gray-50 dark:bg-muted text-gray-400"
                  )}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{item.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-10 flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-widest">
                Gerenciar Conexão <ArrowRight size={18} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-gray-900 dark:bg-card rounded-[3.5rem] p-12 relative overflow-hidden border border-transparent dark:border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-widest mb-4">
              <ShieldCheck size={18} /> Segurança de Ponta-a-Ponta
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Pronto para escalar seu atendimento?</h2>
            <p className="text-gray-400 font-medium">Nossas integrações oficiais utilizam APIs de alta performance para garantir que nenhum lead seja perdido.</p>
          </div>
          <button className="bg-white dark:bg-blue-600 text-gray-900 dark:text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all whitespace-nowrap">
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

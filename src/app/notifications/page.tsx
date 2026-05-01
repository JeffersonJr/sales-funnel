"use client";

import React, { useState } from "react";
import { 
  Bell, 
  Users, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  Trash2, 
  CheckCircle2, 
  Clock,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockNotifications = [
  { id: 1, title: "Novo Lead recebido", desc: "João Silva entrou pelo formulário", time: "5m atrás", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/30", link: "/leads", read: false },
  { id: 2, title: "Negócio Ganho!", desc: "Venda de R$ 5.000,00 fechada", time: "2h atrás", icon: DollarSign, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/30", link: "/", read: false },
  { id: 3, title: "Documento Assinado", desc: "Contrato SaaS assinado por Maria", time: "5h atrás", icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/30", link: "/documents", read: true },
  { id: 4, title: "Acesso de novo dispositivo", desc: "Seu login foi realizado em um iPhone 13", time: "1 dia atrás", icon: Clock, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/30", link: "/settings/security", read: true },
  { id: 5, title: "Backup concluído", desc: "O backup semanal dos seus documentos foi finalizado", time: "2 dias atrás", icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/30", link: "/documents", read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("Todas as notificações lidas!");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.error("Notificação removida.");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen pb-20">
      <div className="flex items-center gap-4 mb-12">
        <Link href="/" className="p-3 bg-card border border-border rounded-2xl text-muted-foreground hover:text-foreground transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Notificações</h1>
          <p className="text-muted-foreground font-medium mt-1">Fique por dentro de tudo o que acontece no seu funil</p>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-3">
             <span className="text-sm font-black text-foreground">Central de Alertas</span>
             <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
               {notifications.filter(n => !n.read).length} Novas
             </span>
          </div>
          <button 
            onClick={markAllRead}
            className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            Marcar todas como lidas
          </button>
        </div>

        <div className="divide-y divide-border">
          {notifications.map((n, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={n.id} 
              className={cn(
                "p-8 flex gap-6 hover:bg-muted/50 transition-all group relative",
                !n.read && "bg-blue-50/30 dark:bg-blue-900/10"
              )}
            >
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
              )}
              
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", n.bg, n.color)}>
                <n.icon size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="text-lg font-black text-foreground">{n.title}</h3>
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap ml-4">{n.time}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  {n.desc}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Link 
                    href={n.link}
                    className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                  >
                    Ver Detalhes <ChevronRight size={14} />
                  </Link>
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {notifications.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Bell size={40} className="text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground font-bold">Você não tem notificações no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

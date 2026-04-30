"use client";

import React from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Briefcase
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { deals, stages } = useFunnel();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalValue = deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  const closedDeals = deals.filter((d: any) => d.stage === "closed");
  const closedValue = closedDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  const conversionRate = (closedDeals.length / deals.length) * 100 || 0;

  const stats = [
    { 
      label: "Valor Total Pipeline", 
      value: formatCurrency(totalValue), 
      icon: DollarSign, 
      color: "bg-blue-600", 
      trend: "+12.5%", 
      positive: true,
      compareText: "mês anterior"
    },
    { 
      label: "Vendas Concluídas", 
      value: formatCurrency(closedValue), 
      icon: CheckCircle2, 
      color: "bg-green-600", 
      trend: "+8.2%", 
      positive: true,
      compareText: "mês anterior"
    },
    { 
      label: "Taxa de Conversão", 
      value: `${conversionRate.toFixed(1)}%`, 
      icon: Target, 
      color: "bg-purple-600", 
      trend: "-2.4%", 
      positive: false,
      compareText: "semana anterior"
    },
    { 
      label: "Ticket Médio", 
      value: formatCurrency(deals.length ? totalValue / deals.length : 0), 
      icon: Briefcase, 
      color: "bg-orange-600", 
      trend: "+5.1%", 
      positive: true,
      compareText: "mês anterior"
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto transition-colors duration-300">
      <div className="mb-12">
        <div className="flex items-center gap-3 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
           <BarChart3 size={14} /> Analytics Hub
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Análise de Performance</h1>
        <p className="text-gray-400 dark:text-gray-500 font-medium mt-2">Métricas inteligentes para impulsionar suas decisões de vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl dark:shadow-none group hover:shadow-2xl dark:hover:bg-white/5 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black",
                  stat.positive ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                )}>
                  {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  {stat.compareText}
                </p>
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribuição do Funil */}
        <div className="lg:col-span-2 bg-white dark:bg-card p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl dark:shadow-none">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Distribuição do Funil</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase mt-1 tracking-widest">Volume por etapa</p>
            </div>
            <select className="bg-gray-50 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 outline-none">
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>

          <div className="space-y-6">
            {stages.map((stage: any) => {
              const stageDeals = deals.filter((d: any) => d.stage === stage.id);
              const percentage = (stageDeals.length / deals.length) * 100 || 0;
              const value = stageDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);

              return (
                <div key={stage.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color || "#3b82f6" }} />
                      <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{stage.title}</span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">({stageDeals.length})</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{formatCurrency(value)}</span>
                  </div>
                  <div className="h-4 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-gray-900 dark:bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Origens */}
        <div className="bg-gray-900 dark:bg-[#0c0c0e] p-10 rounded-[3rem] shadow-2xl text-white border border-transparent dark:border-white/5">
          <h3 className="text-xl font-black mb-8">Top Origens</h3>
          <div className="space-y-6">
            {[
              { label: "LinkedIn Outreach", value: "45%", color: "bg-blue-400" },
              { label: "Indicação", value: "30%", color: "bg-emerald-400" },
              { label: "Inbound Marketing", value: "15%", color: "bg-orange-400" },
              { label: "Eventos", value: "10%", color: "bg-purple-400" },
            ].map((source, i) => (
              <div key={source.label} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn("w-2 h-10 rounded-full", source.color)} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{source.label}</p>
                    <p className="text-xl font-black">{source.value}</p>
                  </div>
                </div>
                <Zap size={20} className="text-gray-700 group-hover:text-yellow-400 transition-colors" />
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-[2rem] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-green-400" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Insight de IA</p>
            </div>
            <p className="text-sm font-medium text-gray-300 leading-relaxed">
              O seu ROI está 15% acima da média em canais de <span className="text-white font-bold underline">LinkedIn Outreach</span>. Foque seus esforços de prospecção lá esta semana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

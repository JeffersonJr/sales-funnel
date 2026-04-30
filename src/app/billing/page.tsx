"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Receipt, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentPlan = user?.plan || "Pro Plan";

  // Mock invoice data
  const invoices = [
    { id: "INV-2024-004", date: "01 Abr 2024", amount: "R$ 297,00", status: "paid" },
    { id: "INV-2024-003", date: "01 Mar 2024", amount: "R$ 297,00", status: "paid" },
    { id: "INV-2024-002", date: "01 Fev 2024", amount: "R$ 297,00", status: "paid" },
    { id: "INV-2024-001", date: "01 Jan 2024", amount: "R$ 297,00", status: "paid" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Faturamento e Assinatura
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Gerencie seu plano, método de pagamento e histórico de faturas.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Current Plan & Payment Method */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Current Plan Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100%] -z-0" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plano Atual</p>
                    <h2 className="text-2xl font-black text-gray-900">{currentPlan}</h2>
                  </div>
                </div>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 size={12} /> Ativo
                </span>
              </div>
              
              <p className="text-sm font-medium text-gray-500 mb-8 relative z-10">
                Seu plano é renovado automaticamente todo dia 01. Próxima cobrança em 01 de Maio de 2024.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link href="/plans">
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                    Mudar de Plano <ArrowRight size={16} />
                  </button>
                </Link>
                <button className="bg-white text-red-500 border border-gray-100 px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-50 transition-all w-full sm:w-auto">
                  Cancelar Assinatura
                </button>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-black text-gray-900 mb-6">Método de Pagamento</h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border-2 border-blue-50 bg-blue-50/30">
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <div className="w-12 h-10 bg-gray-900 rounded-lg flex items-center justify-center shadow-md shrink-0">
                    <span className="text-white font-black text-xs italic tracking-tighter">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">Visa terminando em 4242</p>
                    <p className="text-xs font-bold text-gray-400">Expira em 12/28</p>
                  </div>
                </div>
                
                <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-white border border-blue-100 px-4 py-2 rounded-xl transition-all shadow-sm w-full sm:w-auto">
                  Atualizar
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Invoice History */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900">Histórico de Faturas</h3>
                <Receipt className="text-gray-300" size={20} />
              </div>
              
              <div className="space-y-4">
                {invoices.map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{inv.amount}</p>
                        <p className="text-xs font-bold text-gray-400">{inv.date}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Baixar PDF">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors">
                Ver Todas as Faturas
              </button>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

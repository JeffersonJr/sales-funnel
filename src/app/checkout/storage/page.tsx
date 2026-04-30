"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  HardDrive, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Zap,
  Lock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StorageCheckoutPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(1); // 0: 50GB, 1: 200GB, 2: 1TB
  const [isProcessing, setIsProcessing] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "STORAGE10") {
      setDiscount(10);
      setIsCouponApplied(true);
      toast.success("Cupom STORAGE10 aplicado! 10% de desconto.");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const calculateTotal = (basePrice: string) => {
    const price = parseFloat(basePrice.replace(',', '.'));
    if (isCouponApplied) {
      return (price * (1 - discount / 100)).toFixed(2).replace('.', ',');
    }
    return basePrice;
  };

  const storagePlans = [
    { id: 0, size: "50 GB", price: "19,90", desc: "Ideal para pequenas equipes" },
    { id: 1, size: "200 GB", price: "49,90", desc: "Nosso plano mais popular", popular: true },
    { id: 2, size: "1 TB", price: "149,90", desc: "Para empresas com alto volume" },
  ];

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Upgrade realizado com sucesso!");
      router.push("/documents");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Plans Selection */}
        <div className="space-y-8">
          <Link href="/documents" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft size={16} /> Voltar para Documentos
          </Link>
          
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Aumentar Armazenamento</h1>
            <p className="text-gray-500 dark:text-muted-foreground mt-2 font-medium">Escolha o limite ideal para o crescimento da sua empresa</p>
          </div>

          <div className="grid gap-4">
            {storagePlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative p-8 rounded-[2.5rem] border-2 text-left transition-all group",
                  selectedPlan === plan.id 
                    ? "bg-white dark:bg-card border-blue-600 shadow-xl shadow-blue-100 dark:shadow-none" 
                    : "bg-transparent border-gray-100 dark:border-border hover:border-gray-200"
                )}
              >
                {plan.popular && (
                   <span className="absolute -top-3 right-8 px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                     Mais Popular
                   </span>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                      selectedPlan === plan.id ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-muted text-gray-400"
                    )}>
                      <HardDrive size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">{plan.size}</h3>
                      <p className="text-xs font-bold text-gray-400 mt-1">{plan.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">R$ {plan.price}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">por mês</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-800">
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
                   <Zap size={20} />
                </div>
                <div>
                   <p className="text-sm font-black text-blue-900 dark:text-blue-200">Upgrade Instantâneo</p>
                   <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mt-1">Seu novo limite estará disponível imediatamente após a confirmação do pagamento.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Payment Summary */}
        <div className="lg:sticky lg:top-12 h-fit">
          <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-gray-100 dark:border-border shadow-2xl shadow-gray-200 dark:shadow-none">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Resumo do Pedido</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-500">Upgrade ({storagePlans[selectedPlan].size})</span>
                <span className="font-black text-gray-900 dark:text-white">R$ {storagePlans[selectedPlan].price}</span>
              </div>
              
              {isCouponApplied && (
                <div className="flex justify-between items-center text-sm font-bold text-green-600">
                  <span>Desconto ({discount}%)</span>
                  <span>- R$ {(parseFloat(storagePlans[selectedPlan].price.replace(',', '.')) * discount / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-border">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cupom de Desconto</p>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="CUPOM"
                     value={coupon}
                     onChange={(e) => setCoupon(e.target.value)}
                     className="flex-1 bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500"
                   />
                   <button 
                     onClick={applyCoupon}
                     className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                   >
                     Aplicar
                   </button>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-border my-2" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-gray-900 dark:text-white">Total Hoje</span>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">R$ {calculateTotal(storagePlans[selectedPlan].price)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-gray-50 dark:bg-muted/50 rounded-3xl border border-gray-100 dark:border-border flex items-center gap-4">
                 <div className="w-10 h-10 bg-white dark:bg-card rounded-xl flex items-center justify-center shadow-sm">
                    <CreditCard size={20} className="text-gray-400" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Cartão de Crédito</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Final **** 4422 (Padrão)</p>
                 </div>
                 <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">Alterar</button>
              </div>

              <button
                disabled={isProcessing}
                onClick={handlePayment}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-6 rounded-[2rem] font-black text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 dark:shadow-none"
              >
                {isProcessing ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Zap size={24} />
                  </motion.div>
                ) : (
                  <>Finalizar Pagamento <CheckCircle2 size={24} /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Pagamento 100% Seguro</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-border">
               <p className="text-[10px] font-medium text-gray-400 text-center leading-relaxed px-4">
                 Ao finalizar, você concorda com nossos termos de serviço. O valor será cobrado mensalmente até o cancelamento.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updatePlan } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const planName = searchParams.get("plan") || "Pro Plan";
  const planPrice = searchParams.get("price") || "R$ 297";
  
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "OFF30") {
      setDiscount(30);
      setIsCouponApplied(true);
      toast.success("Cupom OFF30 aplicado! 30% de desconto.");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const calculateTotal = (basePrice: string) => {
    const price = parseInt(basePrice.replace(/\D/g, ''));
    if (isCouponApplied) {
      return `R$ ${Math.floor(price * (1 - discount / 100))}`;
    }
    return basePrice;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cardNumber || !formData.expiry || !formData.cvv) {
      toast.error("Por favor, preencha todos os campos do cartão.");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      updatePlan(planName);
      
      toast.success("Pagamento aprovado!");
      
      // Redirect after success
      setTimeout(() => {
        router.push("/billing");
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#fcfcfc] p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col items-center text-center max-w-md w-full"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Pagamento Aprovado!</h2>
          <p className="text-gray-500 font-medium mb-8">
            Seu upgrade para o <strong className="text-gray-900">{planName}</strong> foi concluído com sucesso.
          </p>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-green-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest font-black">Redirecionando...</p>
        </motion.div>
      </div>
    );
  }

  const getCardType = (number: string) => {
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'generic';
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar aos Planos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Animated Card Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "w-full h-56 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500",
                getCardType(formData.cardNumber) === 'visa' ? "bg-gradient-to-br from-blue-600 to-blue-800" :
                getCardType(formData.cardNumber) === 'mastercard' ? "bg-gradient-to-br from-orange-500 to-red-600" :
                getCardType(formData.cardNumber) === 'amex' ? "bg-gradient-to-br from-emerald-500 to-teal-700" :
                "bg-gradient-to-br from-gray-700 to-gray-900"
              )}
            >
              {/* Background Patterns */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full -ml-20 -mb-20 blur-2xl" />
              
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                    <div className="w-8 h-6 bg-yellow-400/80 rounded-sm" /> {/* Chip */}
                  </div>
                  
                  {/* Card Brand Logo */}
                  <div className="h-8 flex items-center">
                    {getCardType(formData.cardNumber) === 'visa' && (
                      <span className="text-2xl font-black italic">VISA</span>
                    )}
                    {getCardType(formData.cardNumber) === 'mastercard' && (
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/80" />
                        <div className="w-8 h-8 rounded-full bg-yellow-500/80" />
                      </div>
                    )}
                    {getCardType(formData.cardNumber) === 'amex' && (
                      <span className="text-lg font-black bg-white/20 px-2 py-1 rounded">AMEX</span>
                    )}
                    {getCardType(formData.cardNumber) === 'generic' && (
                      <CreditCard size={32} className="opacity-50" />
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    key={formData.cardNumber}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black tracking-[0.2em] font-mono"
                  >
                    {formData.cardNumber || "•••• •••• •••• ••••"}
                  </motion.div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Nome do Titular</p>
                      <motion.p 
                        key={formData.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-black uppercase tracking-wider truncate max-w-[200px]"
                      >
                        {formData.name || "Seu Nome Aqui"}
                      </motion.p>
                    </div>

                    <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Validade</p>
                      <motion.p 
                        key={formData.expiry}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-black tracking-wider"
                      >
                        {formData.expiry || "MM/AA"}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-gray-50/50 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Detalhes do Pagamento</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Transação Segura</p>
                </div>
              </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome no Cartão</label>
                <input 
                  type="text"
                  placeholder="Nome como está impresso"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Número do Cartão</label>
                <div className="relative">
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      val = val.replace(/(\d{4})/g, '$1 ').trim();
                      setFormData({...formData, cardNumber: val});
                    }}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Validade</label>
                  <input 
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={formData.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        val = val.substring(0,2) + '/' + val.substring(2,4);
                      }
                      setFormData({...formData, expiry: val});
                    }}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">CVV</label>
                  <input 
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className={cn(
                    "w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
                    isProcessing 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"
                  )}
                >
                  {isProcessing ? (
                    <>Processando Pagamento...</>
                  ) : (
                    <>
                      <Lock size={16} /> Finalizar Pagamento
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6">
                <Lock size={12} /> Pagamento 100% Seguro e Criptografado
              </div>
            </form>
          </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-card p-8 md:p-12 rounded-[3rem] shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/5 sticky top-8"
          >
            <h3 className="text-xl font-black mb-8 text-gray-900 dark:text-white">Resumo do Pedido</h3>
            
            <div className="bg-gray-50 dark:bg-muted/50 rounded-[2rem] p-6 mb-8 border border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-lg text-gray-900 dark:text-white">{planName}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Assinatura Mensal</p>
                </div>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{planPrice}</span>
              </div>
              
              {isCouponApplied && (
                <div className="flex justify-between items-center text-sm font-bold text-green-600 dark:text-green-400 mb-4">
                   <span>Desconto ({discount}%)</span>
                   <span>- {calculateTotal(planPrice)}</span>
                </div>
              )}

              <div className="h-px w-full bg-gray-100 dark:bg-white/5 my-4" />
              
              <div className="mb-6">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Cupom de Desconto</p>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="CUPOM"
                     value={coupon}
                     onChange={(e) => setCoupon(e.target.value)}
                     className="flex-1 bg-white dark:bg-muted/50 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                   />
                   <button 
                     onClick={applyCoupon}
                     className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                   >
                     Aplicar
                   </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-500 dark:text-gray-400">Total a pagar hoje</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{calculateTotal(planPrice)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Acesso imediato a todas as funcionalidades do {planName}.</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cancele quando quiser. Sem taxas escondidas.</p>
              </div>
              <div className="flex gap-4">
                <AlertCircle size={20} className="text-gray-400 dark:text-gray-600 shrink-0" />
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500">Ao finalizar a compra, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

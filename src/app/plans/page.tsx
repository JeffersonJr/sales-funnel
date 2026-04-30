"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Zap, Shield, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);

  const currentPlan = user?.plan || "Pro Plan";

  const handleDowngrade = () => {
    setShowDowngradeModal(true);
  };

  const handleUpgrade = (planName: string, planPrice: string) => {
    toast.success("Redirecionando para o checkout...");
    setTimeout(() => {
      router.push(`/checkout?plan=${encodeURIComponent(planName)}&price=${encodeURIComponent(planPrice)}`);
    }, 1500);
  };

  const confirmDowngrade = () => {
    setShowDowngradeModal(false);
    toast.info("Nossa equipe foi notificada.");
    router.push("/");
  };

  const plans = [
    {
      name: "Basic Plan",
      price: "R$ 97",
      period: "/mês",
      description: "Ideal para profissionais autônomos iniciando suas vendas.",
      icon: Zap,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-100",
      features: [
        "Até 500 leads/mês",
        "1 Usuário",
        "Pipeline Básico",
        "Suporte por Email"
      ],
      buttonText: currentPlan === "Basic Plan" ? "Plano Atual" : "Downgrade",
      action: currentPlan === "Basic Plan" ? undefined : handleDowngrade,
      isCurrent: currentPlan === "Basic Plan"
    },
    {
      name: "Pro Plan",
      price: "R$ 297",
      period: "/mês",
      description: "Perfeito para times de vendas em crescimento.",
      icon: Shield,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      popular: true,
      features: [
        "Leads Ilimitados",
        "Até 5 Usuários",
        "Múltiplos Funis",
        "Automações Avançadas",
        "Suporte Prioritário"
      ],
      buttonText: currentPlan === "Pro Plan" ? "Plano Atual" : (currentPlan === "Enterprise" ? "Downgrade" : "Fazer Upgrade"),
      action: currentPlan === "Pro Plan" ? undefined : (currentPlan === "Enterprise" ? handleDowngrade : () => handleUpgrade("Pro Plan", "R$ 297")),
      isCurrent: currentPlan === "Pro Plan"
    },
    {
      name: "Enterprise",
      price: "R$ 997",
      period: "/mês",
      description: "Solução completa para operações complexas.",
      icon: Crown,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Tudo do plano Pro",
        "Usuários Ilimitados",
        "API Completa e Webhooks",
        "Gerente de Conta Dedicado",
        "Treinamento Onboarding"
      ],
      buttonText: currentPlan === "Enterprise" ? "Plano Atual" : "Fazer Upgrade",
      action: currentPlan === "Enterprise" ? undefined : () => handleUpgrade("Enterprise", "R$ 997"),
      isCurrent: currentPlan === "Enterprise"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <header className="mb-12 text-center mt-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Escale suas vendas com nossas ferramentas avançadas. Comece pequeno e cresça com a gente.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={plan.name}
              className={`relative bg-white rounded-[2.5rem] p-8 shadow-sm border-2 flex flex-col ${plan.popular ? 'border-blue-500 shadow-xl shadow-blue-100/50 scale-105 z-10' : 'border-gray-100'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Mais Escolhido
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-2xl ${plan.bgColor} text-blue-600 flex items-center justify-center mb-6`}>
                <plan.icon size={24} className={plan.color} />
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-6 h-10">{plan.description}</p>

              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-sm font-bold text-gray-400 mb-1">{plan.period}</span>
              </div>

              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-600">
                      <Check size={18} className="text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={plan.action}
                disabled={plan.isCurrent}
                className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
                  plan.isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.buttonText}
                {!plan.isCurrent && plan.buttonText !== "Downgrade" && <ArrowRight size={16} />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <ConfirmModal 
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        onConfirm={confirmDowngrade}
        title="Downgrade de Plano"
        message="Um especialista da nossa equipe entrará em contato com você em breve para realizar o downgrade do seu plano e ajustar os limites da sua conta."
        confirmText="Entendi"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
}

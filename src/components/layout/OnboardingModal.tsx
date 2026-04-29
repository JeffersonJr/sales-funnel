"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Building2, User, Target, ChevronRight } from "lucide-react";

export function OnboardingModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setMounted(true);
    const hasCompletedOnboarding = localStorage.getItem("funnel_onboarding_completed");
    if (!hasCompletedOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("funnel_onboarding_completed", "true");
    setIsOpen(false);
  };

  const isNextDisabled = () => {
    if (step === 1) return !industry;
    if (step === 2) return !role;
    return false;
  };

  if (!mounted || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-900 transition-colors"
          >
            <X size={24} />
          </button>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                <Building2 size={32} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Torne o Funnel.io seu</h2>
              <p className="text-gray-500 font-medium mb-10 text-lg">Vamos personalizar sua experiência de acordo com seu setor.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {["Tecnologia & SaaS", "Imobiliário", "Educação", "Varejo", "Serviços Digitais", "Outros"].map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={cn(
                      "p-4 rounded-2xl border text-sm font-bold transition-all text-left",
                      industry === ind 
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm shadow-blue-100" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
                <User size={32} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Qual seu papel?</h2>
              <p className="text-gray-500 font-medium mb-10 text-lg">Isso nos ajuda a configurar suas permissões iniciais.</p>
              
              <div className="space-y-3 mb-10">
                {["Fundador / CEO", "Gestor de Vendas", "Vendedor Senior", "Analista de SDR"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "w-full p-5 rounded-2xl border text-sm font-bold transition-all text-left flex justify-between items-center",
                      role === r 
                        ? "border-purple-600 bg-purple-50 text-purple-600" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    )}
                  >
                    {r}
                    {role === r && <Check size={18} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-10">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
                <Target size={40} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Tudo pronto!</h2>
              <p className="text-gray-500 font-medium mb-12 text-lg">Seu funil foi otimizado para <span className="text-gray-900 font-black">{industry}</span>.</p>
              
              <div className="bg-gray-50 p-8 rounded-3xl mb-10 text-left border border-gray-100">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">O que configuramos para você:</p>
                 <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                       <Check size={16} className="text-green-500" /> Pipeline Digital Ativado
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                       <Check size={16} className="text-green-500" /> Integração WhatsApp Mockada
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                       <Check size={16} className="text-green-500" /> Dashboard de Performance SaaS
                    </li>
                 </ul>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between items-center border-t border-gray-50 pt-8 mt-4">
            <button 
              onClick={() => step > 1 && setStep(step - 1)}
              className={cn("text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors", step === 1 && "invisible")}
            >
              Voltar
            </button>
            <button 
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else handleComplete();
              }}
              disabled={isNextDisabled()}
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {step === 3 ? "Começar a Vender" : "Próximo Passo"}
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

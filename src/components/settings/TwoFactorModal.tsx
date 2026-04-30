"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, ShieldCheck, X, Copy, Check, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function TwoFactorModal({ isOpen, onClose, onComplete }: TwoFactorModalProps) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const secret = "JBSWY3DPEHPK3PXP"; // Mock secret

  const handleVerify = () => {
    if (code.length !== 6) {
      toast.error("Por favor, insira o código de 6 dígitos.");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleFinish = () => {
    onComplete();
    onClose();
    toast.success("Autenticação de Dois Fatores ativada!");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-card rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 dark:border-border"
        >
          <div className="p-8 border-b border-gray-50 dark:border-border flex justify-between items-center bg-gray-50/50 dark:bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl font-black text-foreground">Configurar 2FA</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-10">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Smartphone size={40} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground">Escaneie o QR Code</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    Abra o Google Authenticator ou seu app de preferência e escaneie o código abaixo.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col items-center gap-4 shadow-inner">
                  {/* Mock QR Code */}
                  <div className="w-48 h-48 bg-gray-900 rounded-2xl flex items-center justify-center p-4">
                     <div className="w-full h-full bg-white rounded-lg grid grid-cols-4 grid-rows-4 gap-1 p-2">
                        {Array.from({ length: 16 }).map((_, i) => (
                           <div key={i} className={cn("rounded-sm", (i % 3 === 0 || i % 5 === 0) ? "bg-black" : "bg-white")} />
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-xl border border-border">
                    <code className="text-xs font-black text-foreground uppercase tracking-widest">{secret}</code>
                    <button onClick={() => { navigator.clipboard.writeText(secret); toast.success("Copiado!"); }} className="p-1 text-muted-foreground hover:text-foreground">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Próximo Passo <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="text-center">
                  <h3 className="text-xl font-black text-foreground">Verificar Código</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    Insira o código de 6 dígitos gerado pelo seu aplicativo.
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <input
                    autoFocus
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000 000"
                    className="w-full bg-gray-50 dark:bg-muted border border-gray-100 dark:border-border rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] focus:ring-4 focus:ring-blue-100 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="flex gap-4">
                   <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-muted text-muted-foreground py-4 rounded-2xl font-black text-sm hover:bg-muted/80 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={handleVerify}
                    className="flex-[2] bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verificar e Ativar"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
                <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100/50">
                  <ShieldCheck size={48} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground">Segurança Ativada!</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium max-w-xs mx-auto">
                    Seu 2FA foi configurado com sucesso. Agora sua conta está muito mais segura.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 text-left">
                   <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Dica de Segurança</p>
                   <p className="text-xs text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                     Sempre mantenha um app de backup configurado ou anote seu código secreto em um local seguro.
                   </p>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-sm hover:bg-green-600 transition-all shadow-xl shadow-green-200/50"
                >
                  Concluir
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

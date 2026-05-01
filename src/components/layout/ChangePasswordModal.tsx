"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Check, ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const [formData, setFormData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new !== formData.confirm) {
      toast.error("As novas senhas não coincidem!");
      return;
    }
    if (formData.new.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    // Simulate API
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ current: "", new: "", confirm: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-card rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-border"
        >
          <div className="p-8 border-b border-border flex justify-between items-center bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-black text-foreground">Alterar Senha</h2>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-10">
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Senha Atual</label>
                  <div className="relative">
                    <input
                      required
                      type={showPass ? "text" : "password"}
                      value={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                      className="w-full bg-muted border border-transparent border-border rounded-2xl px-6 py-4 text-sm font-bold focus:bg-background focus:border-blue-500 outline-none transition-all text-foreground"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="h-px bg-border my-2" />

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nova Senha</label>
                  <input
                    required
                    type="password"
                    value={formData.new}
                    onChange={(e) => setFormData({ ...formData, new: e.target.value })}
                    className="w-full bg-muted border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:bg-background focus:border-blue-500 outline-none transition-all text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                  <input
                    required
                    type="password"
                    value={formData.confirm}
                    onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                    className="w-full bg-muted border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:bg-background focus:border-blue-500 outline-none transition-all text-foreground"
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-foreground text-background py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Atualizar Senha"}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-4">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100/50 dark:shadow-none">
                  <Check size={48} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground">Senha Alterada!</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium max-w-xs mx-auto">
                    Sua nova senha foi salva com sucesso. Use-a no seu próximo acesso.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-sm hover:bg-green-600 transition-all shadow-xl shadow-green-200/50"
                >
                  Entendido
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFunnel } from "@/context/FunnelContext";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, User, Globe } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useFunnel();
  const router = useRouter();
  const [email, setEmail] = useState("contato@jeffersonjunior.com.br");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        id: "u1",
        name: "Jefferson Jr",
        email: email,
        role: "Administrador",
        plan: "Pro Plan"
      });
      setIsLoading(false);
      toast.success("Login realizado com sucesso!");
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] opacity-60" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-400 font-medium">Acesse sua conta para gerenciar seus negócios</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl shadow-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Entrar na Conta"} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-100" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Ou entre com</span>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
              <User size={16} /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
              <Globe size={16} /> Google
            </button>
          </div>
        </div>

        <p className="text-center mt-12 text-sm font-medium text-gray-400">
          Não tem uma conta? <button className="text-gray-900 font-black underline underline-offset-4">Comece agora</button>
        </p>
      </motion.div>
    </div>
  );
}

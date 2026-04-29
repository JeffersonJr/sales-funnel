"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Preencha todos os campos");
    
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Bem-vindo de volta!");
        router.push("/");
      } else {
        toast.error("Credenciais inválidas");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-gray-900 text-white shadow-2xl shadow-gray-200 mb-4">
            <Zap size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Login.</h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Acesse sua conta para gerenciar vendas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-900 transition-colors" size={20} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-gray-900 focus:bg-white rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Senha de Acesso</label>
              <Link href="/forgot-password" size={10} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                Esqueci a senha
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-900 transition-colors" size={20} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-gray-900 focus:bg-white rounded-[2rem] py-5 pl-14 pr-6 text-sm font-bold outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Entrar no Sistema"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="pt-8 border-t border-gray-100 text-center">
          <p className="text-sm font-bold text-gray-400">
            Ainda não tem acesso?{" "}
            <Link href="/register" className="text-gray-900 hover:underline">
              Comece agora gratuitamente
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
          <ShieldCheck size={14} />
          <span>Ambiente 100% Seguro</span>
        </div>
      </motion.div>
    </div>
  );
}

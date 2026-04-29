"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Informe seu e-mail");
    
    setLoading(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSent(true);
    toast.success("E-mail de recuperação enviado!");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-orange-100 text-orange-600 shadow-xl shadow-orange-100 mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Recuperar.</h1>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Enviaremos um link para redefinir sua senha</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seu E-mail de Cadastro</label>
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

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Processando..." : "Enviar Link de Recuperação"}
              {!loading && <Send size={20} />}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-[2.5rem] p-8 text-center space-y-4 border border-gray-100">
            <p className="text-sm font-bold text-gray-600 leading-relaxed">
              Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá instruções em instantes.
            </p>
            <button 
              onClick={() => setSent(false)}
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Tentar outro e-mail
            </button>
          </div>
        )}

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
            <ArrowLeft size={14} />
            Voltar para o Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

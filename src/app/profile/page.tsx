"use client";

import React, { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Settings2,
  Lock,
  Bell,
  Check,
  Save,
  Globe
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Use session user or fallback to first user for demo
  const currentUser = user || {
    name: "Jefferson Jr",
    email: "contato@jeffersonjunior.com.br",
    role: "Administrador",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jefferson"
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Meu Perfil</h1>
        <p className="text-gray-400 font-medium mt-2">Gerencie suas informações pessoais e preferências de conta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gray-900" />
            <div className="relative mt-4">
              <div className="relative inline-block">
                <Avatar name={currentUser.name} size="xl" className="w-32 h-32 border-8 border-white shadow-2xl" />
                <button className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white">
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mt-6">{currentUser.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-4">
            <button 
              onClick={() => setActiveTab("general")}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === "general" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <User size={18} /> Dados Gerais
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === "security" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <Lock size={18} /> Segurança
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === "notifications" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-50"
              )}
            >
              <Bell size={18} /> Notificações
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-12"
          >
            {activeTab === "general" && (
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900">Informações Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      defaultValue={currentUser.name}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                    <input 
                      type="email" 
                      defaultValue={currentUser.email}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
                    <input 
                      type="text" 
                      placeholder="+55 11 99999-9999"
                      className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Idioma</label>
                    <div className="relative">
                      <select className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none">
                        <option>Português (Brasil)</option>
                        <option>English (US)</option>
                        <option>Español</option>
                      </select>
                      <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <button 
                    onClick={() => toast.success("Perfil atualizado com sucesso!")}
                    className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                  >
                    <Save size={20} /> Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900">Segurança da Conta</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha Atual</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nova Senha</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-orange-900 uppercase tracking-tight">Autenticação em Dois Fatores</h4>
                    <p className="text-xs text-orange-700 font-medium mt-1 leading-relaxed">Aumente a segurança da sua conta adicionando uma camada extra de proteção.</p>
                    <button className="text-xs font-black text-orange-600 mt-4 hover:underline">ATIVAR AGORA</button>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <button 
                    onClick={() => toast.success("Senha alterada com sucesso!")}
                    className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                  >
                    <Lock size={20} /> Atualizar Senha
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

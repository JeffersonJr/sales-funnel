"use client";

import React, { useState, useRef } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Camera, 
  Settings2,
  Lock,
  Bell,
  Check,
  Save,
  Globe,
  Plus,
  X,
  Upload,
  Smartphone,
  MessageSquare,
  Zap
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChangePasswordModal } from "@/components/layout/ChangePasswordModal";

export default function ProfilePage() {
  const { user } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentAvatar, setCurrentAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Jefferson");

  const popAvatars = [
    { name: "The Bat", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Batman" },
    { name: "Web Slinger", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Spider" },
    { name: "Dark Lord", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vader" },
    { name: "Space Master", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Skywalker" },
    { name: "Iron Hero", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stark" },
    { name: "Magic Wizard", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gandalf" },
  ];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentUser = user || {
    name: "Jefferson Jr",
    email: "contato@jeffersonjunior.com.br",
    role: "Administrador"
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast.success("Foto enviada com sucesso!");
      setShowAvatarModal(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto transition-colors duration-300">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-foreground tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground font-medium mt-2">Gerencie suas informações pessoais e preferências de conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-card rounded-[3rem] border border-border shadow-sm p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-28 bg-foreground" />
            <div className="relative mt-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-8 border-card shadow-2xl overflow-hidden bg-muted">
                   <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white dark:border-card"
                >
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="text-2xl font-black text-foreground mt-6">{currentUser.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border p-4 space-y-2">
            {[
              { id: "general", label: "Dados Gerais", icon: UserIcon },
              { id: "security", label: "Segurança", icon: Lock },
              { id: "notifications", label: "Notificações", icon: Bell },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-foreground text-background shadow-lg" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-[3rem] border border-border shadow-sm p-12"
          >
            {activeTab === "general" && (
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-foreground">Informações Pessoais</h3>
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Atualizado em abr 2026</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      defaultValue={currentUser.name}
                      className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:bg-background focus:border-blue-500 outline-none transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail</label>
                    <input 
                      type="email" 
                      defaultValue={currentUser.email}
                      className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:bg-background focus:border-blue-500 outline-none transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">WhatsApp / Telefone</label>
                    <input 
                      type="text" 
                      placeholder="+55 11 99999-9999"
                      className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:bg-background focus:border-blue-500 outline-none transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Idioma de Interface</label>
                    <div className="relative">
                      <select className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus:bg-background focus:border-blue-500 outline-none transition-all appearance-none text-foreground">
                        <option>Português (Brasil)</option>
                        <option>English (US)</option>
                        <option>Español</option>
                      </select>
                      <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border flex justify-end">
                  <button 
                    onClick={() => toast.success("Perfil atualizado com sucesso!")}
                    className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
                  >
                    <Save size={20} /> Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-10">
                <h3 className="text-2xl font-black text-foreground">Configurações de Segurança</h3>
                
                <div className="grid gap-6">
                  <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                          <Lock size={24} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-foreground">Sua Senha de Acesso</p>
                          <p className="text-xs font-bold text-muted-foreground mt-1">Alterada pela última vez em janeiro de 2026</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowPassModal(true)}
                      className="px-6 py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                      Alterar Senha
                    </button>
                  </div>

                  <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                          <Shield size={24} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-foreground">Verificação em Duas Etapas</p>
                          <p className="text-xs font-bold text-muted-foreground mt-1">Proteção adicional para logins via SMS ou App</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Ativado</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                   <div className="bg-muted/20 p-8 rounded-[2.5rem] flex items-start gap-6">
                      <Shield className="text-blue-500 shrink-0" size={32} />
                      <div>
                         <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Sessões Ativas</h4>
                         <p className="text-xs text-muted-foreground font-medium mt-1">Atualmente logado em 2 dispositivos (São Paulo, BR).</p>
                         <button className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-4 hover:underline">Encerrar todas as outras sessões</button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-10">
                <h3 className="text-2xl font-black text-foreground">Preferências de Notificação</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'n1', label: "Novos Leads", desc: "Receba alertas instantâneos quando um novo lead for capturado.", icon: UserIcon, color: "text-blue-500", bg: "bg-blue-50" },
                    { id: 'n2', label: "Mudança de Etapa", desc: "Seja avisado quando um negócio for movido no pipeline.", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
                    { id: 'n3', label: "Mensagens do Cliente", desc: "Notificações de chats do WhatsApp, Instagram e Webchat.", icon: MessageSquare, color: "text-green-500", bg: "bg-green-50" },
                  ].map((n) => (
                    <div key={n.id} className="flex items-center justify-between p-8 bg-muted/20 rounded-[2.5rem] border border-border group">
                      <div className="flex items-center gap-6">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", n.bg, "dark:bg-opacity-10", n.color)}>
                          <n.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{n.label}</p>
                          <p className="text-xs font-bold text-gray-400 mt-0.5">{n.desc}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-[8px] font-black text-muted-foreground uppercase">Push</span>
                            <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div>
                         </div>
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-[8px] font-black text-muted-foreground uppercase">E-mail</span>
                            <div className="w-10 h-5 bg-muted rounded-full relative"><div className="absolute left-0.5 top-0.5 w-4 h-4 bg-card rounded-full shadow-sm" /></div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-900 flex items-center gap-6">
                   <Smartphone className="text-blue-600 dark:text-blue-400 shrink-0" size={28} />
                   <div>
                      <p className="text-sm font-black text-blue-900 dark:text-blue-200">Alertas Mobile</p>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mt-1">Habilite as notificações no navegador para receber alertas mesmo com a aba fechada.</p>
                      <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 mt-4 uppercase tracking-widest hover:underline">Habilitar no Navegador</button>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-border"
            >
              <div className="p-8 border-b border-border flex justify-between items-center">
                <h3 className="text-xl font-black text-foreground">Alterar Foto de Perfil</h3>
                <button onClick={() => setShowAvatarModal(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
              </div>
              
              <div className="p-10 space-y-10">
                {/* Upload Section */}
                <div className="text-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-12 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                  >
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">Enviar foto da galeria</p>
                      <p className="text-xs font-bold text-muted-foreground mt-1">JPG, PNG ou SVG até 5MB</p>
                    </div>
                  </button>
                </div>

                {/* Pop Culture Selection */}
                <div>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 ml-1 text-center">Ou escolha um Avatar Premium</p>
                   <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {popAvatars.map((av) => (
                        <button 
                          key={av.name}
                          onClick={() => {
                            setCurrentAvatar(av.url);
                            setShowAvatarModal(false);
                            toast.success(`Avatar ${av.name} selecionado!`);
                          }}
                          className="group flex flex-col items-center gap-2"
                        >
                          <div className={cn(
                            "w-full aspect-square rounded-2xl border-2 transition-all p-1",
                            currentAvatar === av.url ? "border-blue-500 scale-105" : "border-border group-hover:border-primary/30"
                          )}>
                             <img src={av.url} alt={av.name} className="w-full h-full rounded-xl" />
                          </div>
                          <span className="text-[8px] font-black text-muted-foreground uppercase text-center">{av.name}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChangePasswordModal 
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
      />
    </div>
  );
}

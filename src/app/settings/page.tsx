"use client";

import React, { useState, useEffect } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  Users, 
  Users2, 
  Tag as TagIcon, 
  Layout, 
  Plus, 
  Trash2, 
  Edit2, 
  Palette,
  Lock,
  Type,
  Monitor,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Shield,
  Check,
  X,
  GripVertical
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { UserManagementModal } from "@/components/layout/UserManagementModal";
import { TwoFactorModal } from "@/components/settings/TwoFactorModal";

export default function SettingsPage() {
  const { 
    users, setUsers, 
    groups, setGroups, 
    availableTags, setAvailableTags,
    stages, setStages,
    deals, setDeals 
  } = useFunnel();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "groups" | "tags" | "funnel" | "security" | "appearance">("users");
  const [showUserModal, setShowUserModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  
  // Theme and Font Size
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState(16);
  const [previewFontSize, setPreviewFontSize] = useState(16);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("app-theme") as any || "light";
    const savedFontSize = Number(localStorage.getItem("app-font-size")) || 16;
    const saved2FA = localStorage.getItem("app-2fa-enabled") === "true";
    
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setPreviewFontSize(savedFontSize);
    setIs2FAEnabled(saved2FA);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
    
    if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    toast.success(`Tema ${newTheme} aplicado!`);
  };

  const applyAppearanceSettings = () => {
    setFontSize(previewFontSize);
    localStorage.setItem("app-font-size", previewFontSize.toString());
    document.documentElement.style.setProperty("--base-font-size", `${previewFontSize}px`);
    toast.success("Configurações de aparência aplicadas!");
  };

  // Funnel Stage Management
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState("");
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  const handleAddStage = () => {
    if (!newStageTitle) return;
    const newStage = {
      id: `stage-${Date.now()}`,
      title: newStageTitle,
      color: "#3b82f6"
    };
    setStages([...stages, newStage]);
    setNewStageTitle("");
    setIsAddingStage(false);
    toast.success("Nova etapa adicionada!");
  };

  const handleDeleteStage = (id: string) => {
    if (stages.length <= 1) {
      toast.error("O funil precisa ter pelo menos uma etapa.");
      return;
    }
    setStages(stages.filter((s: any) => s.id !== id));
    toast.error("Etapa removida.");
  };

  // Groups Management
  const [newGroupName, setNewGroupName] = useState("");

  // Tags Management
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");

  const colors = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#64748b"];

  const handleAddTag = () => {
    if (!newTagName) return;
    setAvailableTags([...availableTags, { id: Date.now().toString(), name: newTagName, color: newTagColor }]);
    setNewTagName("");
    toast.success("Tag criada!");
  };

  const handleDeleteTag = (id: string) => {
    setAvailableTags(availableTags.filter((t: any) => t.id !== id));
    toast.error("Tag removida.");
  };

  const handleAddGroup = () => {
    if (!newGroupName) return;
    setGroups([...groups, { id: Date.now().toString(), name: newGroupName, members: [] }]);
    setNewGroupName("");
    toast.success("Grupo criado!");
  };

  if (!mounted) return null;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto transition-colors duration-300">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Configurações</h1>
        <p className="text-gray-400 font-medium mt-2">Personalize o sistema e gerencie permissões da equipe</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-hide gap-1 md:gap-2 pb-2 lg:pb-0">
          {[
            { id: "users", label: "Usuários & Acessos", icon: Users },
            { id: "groups", label: "Grupos & Equipes", icon: Users2 },
            { id: "tags", label: "Tags & Etiquetas", icon: TagIcon },
            { id: "funnel", label: "Etapas do Funil", icon: Layout },
            { id: "security", label: "Segurança & 2FA", icon: Lock },
            { id: "appearance", label: "Aparência & Tema", icon: Palette },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm whitespace-nowrap lg:whitespace-normal",
                activeTab === tab.id 
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" 
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-muted hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Usuários do Sistema</h2>
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-200 transition-all"
                >
                  <Plus size={16} /> Novo Usuário
                </button>
              </div>

              <div className="grid gap-4">
                {users.map((u: any) => (
                  <div key={u.id} className="bg-white dark:bg-card p-6 rounded-[2rem] border border-gray-100 dark:border-border shadow-sm flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar name={u.name} size="md" />
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                        <Shield size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{u.role}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-300 hover:text-blue-500"><Edit2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "groups" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Grupos & Equipes</h2>
              </div>

              <div className="bg-gray-50 dark:bg-muted/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-border mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Criar Novo Grupo</p>
                <div className="flex gap-4">
                  <input 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nome do grupo (ex: Vendas Sul)"
                    className="flex-1 bg-white dark:bg-muted border border-gray-100 dark:border-border rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none dark:text-white"
                  />
                  <button 
                    onClick={handleAddGroup}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all"
                  >
                    Criar Grupo
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {groups.map((g: any) => (
                  <div key={g.id} className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-border shadow-sm flex items-center justify-between transition-colors">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">{g.name}</h3>
                      <p className="text-xs font-bold text-gray-400 mt-1">{g.members?.length || 0} Membros</p>
                    </div>
                    <div className="flex -space-x-3">
                      {g.members?.slice(0, 4).map((mId: string) => {
                        const member = users.find((u: any) => u.id === mId);
                        return <Avatar key={mId} name={member?.name || "U"} size="sm" className="border-2 border-white dark:border-card" />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "tags" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Gerenciar Tags</h2>
              
              <div className="bg-gray-50 dark:bg-muted/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-border">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nome da Tag</label>
                      <input 
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Ex: Urgente"
                        className="w-full bg-white dark:bg-muted border border-gray-100 dark:border-border rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Cor</label>
                      <div className="flex flex-wrap gap-2">
                        {colors.map(c => (
                          <button 
                            key={c} 
                            onClick={() => setNewTagColor(c)}
                            className={cn(
                              "w-8 h-8 rounded-full transition-all border-4",
                              newTagColor === c ? "border-gray-900 dark:border-white scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleAddTag}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all"
                  >
                    Adicionar Tag
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {availableTags.map((tag: any) => (
                  <div key={tag.id} className="bg-white dark:bg-card p-6 rounded-3xl border border-gray-100 dark:border-border shadow-sm flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: tag.color }} />
                      <span className="text-sm font-black text-gray-900 dark:text-white">{tag.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "funnel" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Pipeline de Vendas</h2>
                <button 
                  onClick={() => setIsAddingStage(true)}
                  className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-200 transition-all"
                >
                  <Plus size={16} /> Nova Etapa
                </button>
              </div>

              <AnimatePresence>
                {isAddingStage && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-900 flex gap-4">
                      <input 
                        autoFocus
                        value={newStageTitle}
                        onChange={(e) => setNewStageTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddStage()}
                        placeholder="Nome da nova etapa..."
                        className="flex-1 bg-white dark:bg-muted border border-blue-200 dark:border-blue-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none dark:text-white"
                      />
                      <button 
                        onClick={handleAddStage}
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all"
                      >
                        Salvar
                      </button>
                      <button 
                        onClick={() => setIsAddingStage(false)}
                        className="bg-white dark:bg-muted text-gray-400 px-6 py-4 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all border border-blue-100 dark:border-blue-900"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                {stages.map((s: any, idx: number) => (
                  <div key={s.id} className="bg-white dark:bg-card p-6 rounded-[2rem] border border-gray-100 dark:border-border flex items-center gap-6 shadow-sm group transition-colors">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-muted rounded-xl flex items-center justify-center text-xs font-black text-gray-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{s.title}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteStage(s.id)}
                        className="p-2 text-gray-300 hover:text-red-500"
                        title="Remover Etapa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Segurança da Conta</h2>
              
              <div className="grid gap-6">
                <div className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-border shadow-sm flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white">Autenticação de Dois Fatores (2FA)</p>
                      <p className="text-xs font-bold text-gray-400 mt-1">Proteja sua conta com uma camada extra de segurança</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={cn("text-[10px] font-black uppercase", is2FAEnabled ? "text-green-500" : "text-gray-400")}>
                       {is2FAEnabled ? "Ativado" : "Desativado"}
                    </span>
                    <button 
                      onClick={() => !is2FAEnabled ? setShow2FAModal(true) : setIs2FAEnabled(false)}
                      className={cn(
                        "w-14 h-7 rounded-full relative transition-all p-1",
                        is2FAEnabled ? "bg-green-500" : "bg-gray-200 dark:bg-muted"
                      )}
                    >
                      <div className={cn("w-5 h-5 bg-white rounded-full shadow-md transition-all", is2FAEnabled ? "translate-x-7" : "translate-x-0")} />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-border shadow-sm flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                      <Lock size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white">Senha de Acesso</p>
                      <p className="text-xs font-bold text-gray-400 mt-1">Última alteração há 3 meses</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-bold hover:opacity-90 transition-all">
                    Alterar Senha
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Personalização de Interface</h2>
              
              <div className="space-y-12">
                <section>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">Tema do Sistema</p>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { id: 'light', label: 'Claro', icon: Sun },
                      { id: 'dark', label: 'Escuro', icon: Moon },
                      { id: 'system', label: 'Sistema', icon: Monitor },
                    ].map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => handleThemeChange(t.id as any)}
                        className={cn(
                          "p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 group",
                          theme === t.id 
                            ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900 shadow-xl" 
                            : "bg-white dark:bg-card border-gray-100 dark:border-border text-gray-400 hover:border-gray-900/10 dark:hover:border-white/20"
                        )}
                      >
                         <div className={cn(
                           "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                           theme === t.id ? "bg-white/10" : "bg-gray-50 dark:bg-muted"
                         )}>
                           <t.icon size={24} />
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-6 text-gray-900 dark:text-white">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tamanho da Fonte</p>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">{previewFontSize}px</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-muted/30 p-10 rounded-[2.5rem] border border-gray-100 dark:border-border">
                    <div className="flex flex-col gap-8 max-w-xl mx-auto">
                      <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                        <span>Pequeno</span>
                        <span>Normal</span>
                        <span>Grande</span>
                      </div>
                      <div className="relative h-12 flex items-center">
                        <input 
                          type="range"
                          min="12"
                          max="20"
                          step="1"
                          value={previewFontSize}
                          onChange={(e) => setPreviewFontSize(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 dark:bg-muted rounded-full appearance-none cursor-pointer accent-gray-900 dark:accent-white"
                        />
                      </div>
                      <div className="p-8 bg-white dark:bg-card rounded-[2rem] border border-gray-100 dark:border-border text-center shadow-sm">
                         <p 
                           className="text-gray-900 dark:text-white font-medium transition-all"
                           style={{ fontSize: `${previewFontSize}px` }}
                         >
                            Exemplo de texto com o tamanho de {previewFontSize}px selecionado.
                         </p>
                         <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest font-black">Este texto reflete o tamanho escolhido acima</p>
                      </div>
                      <button 
                        onClick={applyAppearanceSettings}
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                         <Check size={18} /> Aplicar Configurações
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <UserManagementModal 
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        users={users}
        onUpdateUsers={setUsers}
        deals={deals}
        onUpdateDeals={setDeals}
      />

      <TwoFactorModal 
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        onComplete={() => {
          setIs2FAEnabled(true);
          localStorage.setItem("app-2fa-enabled", "true");
        }}
      />
    </div>
  );
}

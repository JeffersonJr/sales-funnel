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
  GripVertical,
  CheckCircle2
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { UserManagementModal } from "@/components/layout/UserManagementModal";
import { TwoFactorModal } from "@/components/settings/TwoFactorModal";

const STAGE_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#ec4899", "#64748b", "#3f3f46"
];

export default function SettingsPage() {
  const { 
    users, setUsers, 
    groups, setGroups, 
    availableTags, setAvailableTags,
    stages, setStages,
    deals, setDeals,
    funnels, setFunnels,
    activeFunnelId, setActiveFunnelId,
    addFunnel, deleteFunnel, updateFunnel
  } = useFunnel();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "groups" | "tags" | "funnel" | "security" | "appearance">("users");
  const [showUserModal, setShowUserModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  
  // Theme and Font Size
  const { theme, setTheme, fontSize, setFontSize } = useFunnel();
  const [previewFontSize, setPreviewFontSize] = useState(fontSize);

  useEffect(() => {
    setMounted(true);
    const saved2FA = localStorage.getItem("app-2fa-enabled") === "true";
    setIs2FAEnabled(saved2FA);
    setPreviewFontSize(fontSize);
  }, [fontSize]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast.success(`Tema ${newTheme === 'light' ? 'Claro' : newTheme === 'dark' ? 'Escuro' : 'Sistema'} aplicado!`);
  };

  const applyAppearanceSettings = () => {
    setFontSize(previewFontSize);
    localStorage.setItem("app-font-size", previewFontSize.toString());
    document.documentElement.style.setProperty("--base-font-size", `${previewFontSize}px`);
    toast.success("Configurações de aparência aplicadas!");
  };

  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState("");
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingStageTitle, setEditingStageTitle] = useState("");
  const [editingStageColor, setEditingStageColor] = useState("");
  const [showDeleteStageModal, setShowDeleteStageModal] = useState<string | null>(null);
  
  // Multiple Funnel Management
  const [settingsActiveFunnelId, setSettingsActiveFunnelId] = useState<string>(activeFunnelId || (funnels[0]?.id) || "");
  const [isAddingFunnel, setIsAddingFunnel] = useState(false);
  const [newFunnelName, setNewFunnelName] = useState("");
  const [editingFunnelId, setEditingFunnelId] = useState<string | null>(null);
  const [editingFunnelName, setEditingFunnelName] = useState("");
  const [showDeleteFunnelModal, setShowDeleteFunnelModal] = useState<string | null>(null);
  const [deleteFunnelAction, setDeleteFunnelAction] = useState<'delete' | 'move'>('delete');
  const [targetMoveStageId, setTargetMoveStageId] = useState<string>("");

  useEffect(() => {
    if (activeFunnelId && !settingsActiveFunnelId) {
      setSettingsActiveFunnelId(activeFunnelId);
    }
  }, [activeFunnelId]);

  const activeSettingsFunnel = funnels.find((f: any) => f.id === settingsActiveFunnelId) || funnels[0];
  const activeSettingsStages = stages.filter((s: any) => s.funnelId === settingsActiveFunnelId);

  const handleAddStage = () => {
    if (!newStageTitle) return;
    const newStage = {
      id: `stage-${Date.now()}`,
      title: newStageTitle,
      color: STAGE_COLORS[Math.floor(Math.random() * STAGE_COLORS.length)]
    };
    setStages([...stages, newStage]);
    setNewStageTitle("");
    setIsAddingStage(false);
    toast.success("Nova etapa adicionada!");
  };

  const handleStartEditingStage = (stage: any) => {
    setEditingStageId(stage.id);
    setEditingStageTitle(stage.title);
    setEditingStageColor(stage.color || "#3b82f6");
  };

  const handleSaveStage = () => {
    if (!editingStageId || !editingStageTitle) return;
    setStages(stages.map((s: any) => s.id === editingStageId ? { ...s, title: editingStageTitle, color: editingStageColor } : s));
    setEditingStageId(null);
    toast.success("Etapa atualizada!");
  };

  const handleDeleteStage = (id: string) => {
    if (stages.length <= 1) {
      toast.error("O funil precisa ter pelo menos uma etapa.");
      return;
    }
    
    const stageDeals = deals.filter((d: any) => d.stage === id);
    if (stageDeals.length > 0) {
      setShowDeleteStageModal(id);
    } else {
      if (confirm("Deseja realmente excluir esta etapa?")) {
        setStages(stages.filter((s: any) => s.id !== id));
        toast.error("Etapa removida.");
      }
    }
  };

  const confirmDeleteStage = (targetStageId: string) => {
    if (!showDeleteStageModal) return;
    
    // Move deals to the target stage
    setDeals(deals.map((d: any) => d.stage === showDeleteStageModal ? { ...d, stage: targetStageId } : d));
    
    // Remove the stage
    setStages(stages.filter((s: any) => s.id !== showDeleteStageModal));
    setShowDeleteStageModal(null);
    toast.success("Etapa removida e negócios movidos!");
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
        <h1 className="text-4xl font-black text-foreground tracking-tight">Configurações</h1>
        <p className="text-muted-foreground font-medium mt-2">Personalize o sistema e gerencie permissões da equipe</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-hide gap-1 md:gap-2 pb-2 lg:pb-0">
          {[
            { id: "users", label: "Usuários & Acessos", icon: Users },
            { id: "groups", label: "Grupos & Equipes", icon: Users2 },
            { id: "tags", label: "Tags & Etiquetas", icon: TagIcon },
            { id: "funnel", label: "Funis e etapas", icon: Layout },
            { id: "security", label: "Segurança & 2FA", icon: Lock },
            { id: "appearance", label: "Aparência & Tema", icon: Palette },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm whitespace-nowrap lg:whitespace-normal",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground border border-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                <h2 className="text-xl font-black text-foreground">Usuários do Sistema</h2>
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="bg-muted text-foreground px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-muted/80 transition-all border border-border"
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
                        <p className="text-sm font-black text-foreground">{u.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full">
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
              {/* Funnel Selector and Management */}
              <div className="bg-gray-50 dark:bg-muted/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Gerenciar Pipelines</h2>
                    <p className="text-sm text-muted-foreground font-medium">Crie e configure múltiplos fluxos de vendas para o seu negócio.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddingFunnel(true)}
                    className="bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus size={16} /> Novo Pipeline
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                  {funnels.map(f => (
                    <div 
                      key={f.id}
                      className={cn(
                        "group relative p-5 rounded-[1.8rem] border-2 transition-all cursor-pointer",
                        settingsActiveFunnelId === f.id 
                          ? "border-primary bg-primary/5 dark:bg-primary/10" 
                          : "border-gray-100 dark:border-border bg-white dark:bg-card hover:border-gray-200 dark:hover:border-muted-foreground/30"
                      )}
                      onClick={() => setSettingsActiveFunnelId(f.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          settingsActiveFunnelId === f.id ? "bg-primary text-white" : "bg-gray-50 dark:bg-muted text-muted-foreground"
                        )}>
                          <Layout size={18} />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingFunnelId(f.id); setEditingFunnelName(f.name); }}
                            className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          {funnels.length > 1 && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setShowDeleteFunnelModal(f.id); }}
                              className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {editingFunnelId === f.id ? (
                        <input 
                          autoFocus
                          value={editingFunnelName}
                          onChange={(e) => setEditingFunnelName(e.target.value)}
                          onBlur={() => { updateFunnel(f.id, { name: editingFunnelName }); setEditingFunnelId(null); }}
                          onKeyDown={(e) => e.key === "Enter" && { handleUpdate: updateFunnel(f.id, { name: editingFunnelName }), stop: setEditingFunnelId(null) }}
                          className="w-full bg-transparent border-b-2 border-primary outline-none text-sm font-black text-foreground"
                        />
                      ) : (
                        <p className="text-sm font-black text-foreground truncate uppercase tracking-widest">{f.name}</p>
                      )}
                      <p className="text-[10px] font-bold text-muted-foreground mt-1">
                        {stages.filter((s: any) => s.funnelId === f.id).length} etapas configuradas
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {isAddingFunnel && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/20 flex gap-4"
                  >
                    <input 
                      autoFocus
                      value={newFunnelName}
                      onChange={(e) => setNewFunnelName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && { add: addFunnel(newFunnelName), reset: (setNewFunnelName(""), setIsAddingFunnel(false)) }}
                      placeholder="Nome do novo pipeline (ex: Vendas Enterprise)"
                      className="flex-1 bg-white dark:bg-muted border border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none dark:text-white"
                    />
                    <button 
                      onClick={() => { addFunnel(newFunnelName); setNewFunnelName(""); setIsAddingFunnel(false); }}
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                      Criar Pipeline
                    </button>
                    <button onClick={() => setIsAddingFunnel(false)} className="p-4 text-muted-foreground hover:bg-white/50 dark:hover:bg-muted rounded-2xl transition-colors"><X size={20} /></button>
                  </motion.div>
                )}
              </AnimatePresence>

              <hr className="border-border opacity-50" />

              {/* Stage Management for Selected Funnel */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                      Etapas de: {activeSettingsFunnel?.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Personalize as colunas deste pipeline</p>
                  </div>
                  <button 
                    onClick={() => setIsAddingStage(true)}
                    className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-accent transition-all"
                  >
                    <Plus size={16} /> Adicionar Etapa
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
                      <div className="bg-gray-50 dark:bg-muted/30 p-8 rounded-[2.5rem] border border-gray-100 dark:border-border flex gap-4">
                        <input 
                          autoFocus
                          value={newStageTitle}
                          onChange={(e) => setNewStageTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && { 
                            add: setStages([...stages, { id: `s-${Date.now()}`, title: newStageTitle, color: STAGE_COLORS[0], funnelId: settingsActiveFunnelId }]),
                            reset: (setNewStageTitle(""), setIsAddingStage(false))
                          }}
                          placeholder="Nome da nova etapa..."
                          className="flex-1 bg-white dark:bg-muted border border-border rounded-2xl px-6 py-4 text-sm font-bold outline-none dark:text-white"
                        />
                        <button 
                          onClick={() => {
                            setStages([...stages, { id: `s-${Date.now()}`, title: newStageTitle, color: STAGE_COLORS[0], funnelId: settingsActiveFunnelId }]);
                            setNewStageTitle("");
                            setIsAddingStage(false);
                            toast.success("Etapa adicionada ao pipeline.");
                          }}
                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all"
                        >
                          Salvar
                        </button>
                        <button onClick={() => setIsAddingStage(false)} className="p-4 text-muted-foreground hover:bg-white/50 dark:hover:bg-muted rounded-2xl transition-colors"><X size={20} /></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-3">
                  {activeSettingsStages.map((s: any, idx: number) => (
                    <div key={s.id} className="bg-white dark:bg-card p-6 rounded-[2.2rem] border border-gray-100 dark:border-border flex items-center gap-6 shadow-sm group transition-all hover:shadow-md">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-muted rounded-2xl flex items-center justify-center text-xs font-black text-muted-foreground">
                        {idx + 1}
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        {editingStageId === s.id ? (
                          <div className="flex-1 space-y-4 py-2">
                             <div className="flex gap-2">
                               <input 
                                 autoFocus
                                 value={editingStageTitle}
                                 onChange={(e) => setEditingStageTitle(e.target.value)}
                                 className="flex-1 bg-gray-50 dark:bg-muted border border-primary/20 rounded-xl px-4 py-2 text-sm font-bold outline-none dark:text-white"
                               />
                               <button 
                                 onClick={() => {
                                   setStages(stages.map((st: any) => st.id === s.id ? { ...st, title: editingStageTitle, color: editingStageColor } : st));
                                   setEditingStageId(null);
                                 }} 
                                 className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                               >
                                 <Check size={18} />
                               </button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                               {STAGE_COLORS.map(c => (
                                 <button 
                                   key={c}
                                   onClick={() => setEditingStageColor(c)}
                                   className={cn(
                                     "w-6 h-6 rounded-full border-2 transition-all",
                                     editingStageColor === c ? "border-gray-900 dark:border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                   )}
                                   style={{ backgroundColor: c }}
                                 />
                               ))}
                             </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: s.color || "#3b82f6" }} />
                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{s.title}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingStageId !== s.id && (
                          <>
                            <button 
                              onClick={() => { setEditingStageId(s.id); setEditingStageTitle(s.title); setEditingStageColor(s.color); }}
                              className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => setStages(stages.filter((st: any) => st.id !== s.id))}
                              className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Delete Stage with Deals Modal */}
              <AnimatePresence>
                {showDeleteStageModal && (
                  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="bg-white dark:bg-card rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden"
                    >
                      <div className="p-10">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                           <Trash2 size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Mover Negócios</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-8">
                          Existem {deals.filter((d: any) => d.stage === showDeleteStageModal).length} negócios nesta etapa. Para onde deseja movê-los antes de excluir?
                        </p>
                        
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Etapa de Destino</label>
                          <select 
                            id="moveDealsToStage"
                            className="w-full bg-gray-50 dark:bg-muted border border-gray-100 dark:border-border rounded-2xl px-6 py-4 text-sm font-bold outline-none dark:text-white"
                          >
                            {stages.filter((s: any) => s.id !== showDeleteStageModal).map((s: any) => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex gap-4 mt-10">
                          <button 
                            onClick={() => setShowDeleteStageModal(null)}
                            className="flex-1 py-4 bg-gray-50 dark:bg-muted text-gray-500 dark:text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => {
                              const select = document.getElementById("moveDealsToStage") as HTMLSelectElement;
                              confirmDeleteStage(select.value);
                            }}
                            className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-200 dark:shadow-none transition-all"
                          >
                            Mover & Excluir
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
              {/* Delete Funnel Modal */}
              <AnimatePresence>
                {showDeleteFunnelModal && (
                  <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-card rounded-[2.5rem] w-full max-w-lg border border-border shadow-2xl overflow-hidden"
                    >
                      <div className="p-8">
                        <h3 className="text-xl font-black text-foreground mb-2">Excluir Pipeline?</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-6">
                          O que deseja fazer com os negócios deste pipeline?
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <button 
                            onClick={() => setDeleteFunnelAction('delete')}
                            className={cn(
                              "p-4 rounded-2xl border-2 transition-all text-left",
                              deleteFunnelAction === 'delete' ? "border-red-500 bg-red-500/5" : "border-border"
                            )}
                          >
                            <p className="text-xs font-black uppercase tracking-widest text-foreground">Excluir Tudo</p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1">Apagar pipeline e negócios.</p>
                          </button>

                          <button 
                            onClick={() => setDeleteFunnelAction('move')}
                            className={cn(
                              "p-4 rounded-2xl border-2 transition-all text-left",
                              deleteFunnelAction === 'move' ? "border-primary bg-primary/5" : "border-border"
                            )}
                          >
                            <p className="text-xs font-black uppercase tracking-widest text-foreground">Mover Negócios</p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1">Migrar antes de apagar.</p>
                          </button>
                        </div>

                        {deleteFunnelAction === 'move' && (
                          <div className="mb-6">
                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Destino</label>
                            <select 
                              value={targetMoveStageId}
                              onChange={(e) => setTargetMoveStageId(e.target.value)}
                              className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold text-foreground outline-none"
                            >
                              <option value="">Selecione a etapa...</option>
                              {funnels.filter((f: any) => f.id !== showDeleteFunnelModal).map((f: any) => (
                                <optgroup key={f.id} label={f.name}>
                                  {stages.filter((s: any) => s.funnelId === f.id).map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="flex gap-3 mt-8">
                          <button onClick={() => setShowDeleteFunnelModal(null)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted rounded-2xl transition-all">Cancelar</button>
                          <button 
                            onClick={() => {
                              if (deleteFunnelAction === 'move' && !targetMoveStageId) return toast.error("Selecione um destino");
                              deleteFunnel(showDeleteFunnelModal, deleteFunnelAction, targetMoveStageId);
                              setShowDeleteFunnelModal(null);
                              toast.success("Pipeline removido.");
                            }}
                            className={cn(
                              "flex-1 py-4 text-xs font-black uppercase tracking-widest text-white rounded-2xl transition-all",
                              deleteFunnelAction === 'delete' ? "bg-red-500 shadow-lg shadow-red-500/20" : "bg-primary shadow-lg shadow-primary/20"
                            )}
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
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
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-card border-border text-muted-foreground hover:border-primary/20"
                        )}
                      >
                         <div className={cn(
                           "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                           theme === t.id ? "bg-white/10" : "bg-muted"
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

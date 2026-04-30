"use client";

import React, { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  Zap, 
  Plus, 
  Trash2, 
  Edit2, 
  Play, 
  Pause, 
  ArrowRight,
  MessageCircle,
  Mail,
  UserPlus,
  RefreshCw,
  Bell,
  Settings2,
  X,
  Copy,
  ChevronRight,
  MousePointer2,
  ListChecks,
  History,
  Layout,
  Bookmark,
  Tag,
  Clock,
  FileText,
  MailOpen,
  MousePointerClick,
  CalendarPlus,
  CalendarCheck,
  Globe,
  Library,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { TagManagementModal } from "@/components/deals/TagManagementModal";

interface Action {
  id: string;
  type: string;
  config: any;
}

interface Automation {
  id: string;
  name: string;
  triggerType?: string;
  triggerStageId?: string;
  triggerTagId?: string;
  triggerDays?: number;
  actions: Action[];
  status: "active" | "paused";
  isTemplate?: boolean;
  savedAsTemplate?: boolean;
  isFavorite?: boolean;
}

export default function AutomationsPage() {
  const { 
    automations, setAutomations, 
    stages, 
    availableTags, setAvailableTags,
    automationTemplates, setAutomationTemplates 
  } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "templates">("active");
  const [deleteTarget, setDeleteTarget] = useState<{id: string, type: 'automation' | 'template'} | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // New Automation State
  const [step, setStep] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [newRule, setNewRule] = useState<Partial<Automation>>({
    name: "",
    triggerType: "stage_change",
    triggerStageId: stages[0]?.id || "",
    actions: [],
    status: "active"
  });

  const triggerTypes = [
    { id: "stage_change", label: "Movido para Coluna", icon: Layout },
    { id: "new_deal", label: "Novo Negócio Criado", icon: Plus },
    { id: "deal_won", label: "Negócio Ganho", icon: Zap },
    { id: "deal_lost", label: "Negócio Perdido", icon: Trash2 },
    { id: "deal_stale", label: "Negócio Estagnado", icon: Clock },
    { id: "activity_created", label: "Atividade Marcada", icon: CalendarPlus },
    { id: "activity_completed", label: "Atividade Concluída", icon: CalendarCheck },
    { id: "tag_added", label: "Tag Adicionada", icon: Tag },
    { id: "tag_removed", label: "Tag Removida", icon: Tag },
    { id: "form_submitted", label: "Novo Lead (Formulário)", icon: MousePointerClick },
    { id: "email_opened", label: "E-mail Aberto", icon: MailOpen },
    { id: "document_signed", label: "Proposta Assinada", icon: FileText },
  ];

  const actionTypes = [
    { id: "whatsapp", label: "Enviar WhatsApp", icon: MessageCircle, color: "text-green-500", bg: "bg-green-50", description: "Envia mensagem automática para o lead" },
    { id: "email", label: "Enviar E-mail", icon: Mail, color: "text-blue-500", bg: "bg-blue-50", description: "Dispara e-mail personalizado" },
    { id: "activity", label: "Criar Atividade", icon: ListChecks, color: "text-purple-500", bg: "bg-purple-50", description: "Agenda tarefa para o responsável" },
    { id: "notification", label: "Notificar Equipe", icon: Bell, color: "text-orange-500", bg: "bg-orange-50", description: "Envia push para usuários do sistema" },
    { id: "move_stage", label: "Mover Coluna", icon: ArrowRight, color: "text-indigo-500", bg: "bg-indigo-50", description: "Move o card para outra etapa do funil" },
    { id: "add_tag", label: "Adicionar Tag", icon: Tag, color: "text-pink-500", bg: "bg-pink-50", description: "Aplica uma tag automaticamente" },
    { id: "remove_tag", label: "Remover Tag", icon: Tag, color: "text-red-500", bg: "bg-red-50", description: "Remove uma tag do card" },
    { id: "webhook", label: "Disparar Webhook", icon: Globe, color: "text-cyan-500", bg: "bg-cyan-50", description: "Envia dados para n8n, Zapier ou API" },
  ];

  const handleSave = () => {
    if (!newRule.name || newRule.actions?.length === 0) {
      toast.error("Preencha o nome e adicione ao menos uma ação");
      return;
    }

    if (editingId) {
      if (isEditingTemplate) {
        setAutomationTemplates(automationTemplates.map((t: any) => 
          t.id === editingId ? { ...newRule, id: editingId, isTemplate: true } as Automation : t
        ));
        toast.success("Template atualizado!");
      } else {
        setAutomations(automations.map((a: any) => 
          a.id === editingId ? { ...newRule, id: editingId } as Automation : a
        ));
        toast.success("Automação atualizada!");
      }
    } else {
      if (isEditingTemplate) {
        const newTmpl: Automation = {
          id: `tmpl-${Date.now()}`,
          name: newRule.name!,
          triggerStageId: newRule.triggerStageId!,
          actions: newRule.actions!,
          status: "active",
          isTemplate: true
        };
        setAutomationTemplates([...automationTemplates, newTmpl]);
        toast.success("Template criado e salvo!");
      } else {
        const finalAutomation: Automation = {
          id: Date.now().toString(),
          name: newRule.name!,
          triggerStageId: newRule.triggerStageId!,
          actions: newRule.actions!,
          status: "active"
        };
        setAutomations([...automations, finalAutomation]);
        toast.success("Automação ativada!");
      }
    }
    resetModal();
  };

  const handleEdit = (auto: Automation, isTemplate = false) => {
    setNewRule({ ...auto });
    setEditingId(auto.id);
    setIsEditingTemplate(isTemplate);
    setStep(1);
    setShowModal(true);
  };

  const duplicateAutomation = (auto: Automation) => {
    const duplicated: Automation = { 
      ...auto, 
      id: `copy-${Date.now()}`, 
      name: `${auto.name} (Cópia)`,
      status: "paused"
    };
    setAutomations([...automations, duplicated]);
    toast.success("Automação duplicada!");
  };

  const saveAsTemplate = (auto: Automation) => {
    const newTmpl = { ...auto, id: `tmpl-${Date.now()}`, isTemplate: true };
    setAutomationTemplates([...automationTemplates, newTmpl]);
    setAutomations(automations.map((a: any) => a.id === auto.id ? { ...a, savedAsTemplate: true } : a));
    toast.success("Salvo como template!");
  };

  const toggleFavorite = (auto: Automation) => {
    setAutomations(automations.map((a: any) => a.id === auto.id ? { ...a, isFavorite: !a.isFavorite } : a));
  };

  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setEditingId(null);
    setIsEditingTemplate(false);
    setNewRule({
      name: "",
      triggerType: "stage_change",
      triggerStageId: stages[0]?.id || "",
      triggerTagId: undefined,
      triggerDays: 3,
      actions: [],
      status: "active"
    });
  };

  const addAction = (type: string) => {
    let defaultConfig: any = {};
    if (type === 'activity') defaultConfig = { title: "Nova Atividade" };
    else if (type === 'whatsapp' || type === 'email' || type === 'notification') defaultConfig = { message: "" };
    else if (type === 'move_stage') defaultConfig = { stageId: stages[0]?.id || "" };
    else if (type === 'add_tag' || type === 'remove_tag') defaultConfig = { tagId: availableTags[0]?.id || "" };
    else if (type === 'webhook') defaultConfig = { url: "https://" };

    const newAction: Action = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      config: defaultConfig
    };
    setNewRule({ ...newRule, actions: [...(newRule.actions || []), newAction] });
  };

  const removeAction = (id: string) => {
    setNewRule({ ...newRule, actions: newRule.actions?.filter(a => a.id !== id) });
  };

  const updateActionConfig = (id: string, config: any) => {
    setNewRule({
      ...newRule,
      actions: newRule.actions?.map(a => a.id === id ? { ...a, config } : a)
    });
  };

  const toggleStatus = (id: string) => {
    setAutomations(automations.map((a: any) => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'automation') {
      setAutomations(automations.filter((a: any) => a.id !== deleteTarget.id));
      toast.error("Automação removida");
    } else {
      setAutomationTemplates(automationTemplates.filter((t: any) => t.id !== deleteTarget.id));
      toast.error("Template removido");
    }
    setDeleteTarget(null);
  };

  const useTemplate = (tmpl: Automation) => {
    setNewRule({
      ...tmpl,
      id: undefined,
      isTemplate: false,
      triggerType: tmpl.triggerType || "stage_change",
      triggerStageId: tmpl.triggerStageId || stages[0]?.id || "",
      triggerTagId: tmpl.triggerTagId,
      triggerDays: tmpl.triggerDays || 3
    });
    setStep(1);
    setShowModal(true);
  };

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Workflow Automations</h1>
          <p className="text-gray-400 font-medium mt-2">Transforme seu funil em uma máquina de vendas automática</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab(activeTab === "active" ? "templates" : "active")}
            className="px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            {activeTab === "active" ? <Layout size={18} /> : <History size={18} />}
            {activeTab === "active" ? "Ver Templates" : "Minhas Automações"}
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center gap-2 hover:bg-gray-800 transition-all hover:scale-[1.02]"
          >
            <Plus size={20} /> Criar Automação
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "active" ? (
          <motion.div 
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6"
          >
            {automations.map((auto: Automation) => {
              const stage = stages.find((s: any) => s.id === auto.triggerStageId);
              const triggerTypeObj = triggerTypes.find(t => t.id === (auto.triggerType || 'stage_change'));
              
              let triggerLabel = triggerTypeObj?.label || "Movido para Coluna";
              if ((auto.triggerType === 'stage_change' || !auto.triggerType) && stage) {
                triggerLabel = `Coluna: ${stage.title}`;
              } else if (auto.triggerType === 'tag_added' || auto.triggerType === 'tag_removed') {
                const t = availableTags.find((tag: any) => tag.id === auto.triggerTagId);
                triggerLabel = `Tag: ${t?.name || 'Qualquer'}`;
              } else if (auto.triggerType === 'deal_stale') {
                triggerLabel = `Estagnado há ${auto.triggerDays || 3} dias`;
              }

              return (
                <div 
                  key={auto.id} 
                  className={cn(
                    "bg-white p-8 rounded-[3rem] border transition-all flex items-center justify-between group",
                    auto.status === 'active' ? "border-gray-100 shadow-xl shadow-gray-50/50" : "border-gray-50 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-8">
                    <div className={cn(
                      "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner",
                      auto.status === 'active' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
                    )}>
                      <Zap size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        {auto.name}
                        {auto.status === 'active' ? (
                          <span className="text-[9px] bg-green-50 text-green-600 px-3 py-1 rounded-full uppercase tracking-widest font-black border border-green-100">Fluxo Ativo</span>
                        ) : (
                          <span className="text-[10px] bg-gray-100 text-gray-400 px-3 py-1 rounded-full uppercase tracking-widest font-black">Pausada</span>
                        )}
                        {auto.savedAsTemplate && (
                          <span className="text-[9px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full uppercase tracking-widest font-black border border-purple-100 flex items-center gap-1"><Library size={10} /> Template</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <MousePointer2 size={12} />
                          Trigger: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{triggerLabel}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-200 rounded-full" />
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Plus size={12} />
                          {auto.actions?.length || 0} Ações configuradas
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleEdit(auto, false)}
                      className="p-4 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                      title="Editar Automação"
                    >
                      <Edit2 size={24} />
                    </button>
                    <button 
                      onClick={() => duplicateAutomation(auto)}
                      className="p-4 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                      title="Duplicar Automação"
                    >
                      <Copy size={24} />
                    </button>
                    {!auto.savedAsTemplate && (
                      <button 
                        onClick={() => saveAsTemplate(auto)}
                        className="p-4 text-gray-300 hover:text-purple-500 hover:bg-purple-50 rounded-2xl transition-all"
                        title="Salvar na Biblioteca de Templates"
                      >
                        <Library size={24} />
                      </button>
                    )}
                    <button 
                      onClick={() => toggleFavorite(auto)}
                      className={cn(
                        "p-4 rounded-2xl transition-all",
                        auto.isFavorite ? "text-yellow-500 bg-yellow-50" : "text-gray-300 hover:text-yellow-500 hover:bg-yellow-50"
                      )}
                      title={auto.isFavorite ? "Remover dos Favoritos" : "Favoritar Automação"}
                    >
                      <Bookmark size={24} className={cn(auto.isFavorite && "fill-yellow-500")} />
                    </button>
                    <button 
                      onClick={() => toggleStatus(auto.id)}
                      className={cn(
                        "p-4 rounded-2xl transition-all",
                        auto.status === 'active' ? "text-orange-400 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"
                      )}
                    >
                      {auto.status === 'active' ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button 
                      onClick={() => setDeleteTarget({ id: auto.id, type: 'automation' })}
                      className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              );
            })}

            {automations.length === 0 && (
              <div className="text-center py-32 bg-gray-50/50 rounded-[4rem] border-4 border-dashed border-gray-100">
                <Zap size={64} className="text-gray-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">Sua esteira está parada</h3>
                <p className="text-sm font-medium text-gray-400 max-w-sm mx-auto">
                  Crie automações para enviar mensagens, agendar tarefas e notificar sua equipe automaticamente.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {automationTemplates.map((tmpl: Automation) => (
              <div key={tmpl.id} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col justify-between group hover:border-blue-200 transition-all relative">
                <div className="absolute top-8 right-8 flex gap-2">
                  <button 
                    onClick={() => handleEdit(tmpl, true)}
                    className="p-2 text-gray-200 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Editar Template"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => setDeleteTarget({ id: tmpl.id, type: 'template' })}
                    className="p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div>
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Copy size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-3">
                    {tmpl.name}
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Modelo</span>
                  </h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
                    Template com {tmpl.actions?.length || 0} ações integradas.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tmpl.actions?.map((a: any, i: number) => (
                      <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full border border-gray-100">
                        {a.type}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => useTemplate(tmpl)}
                  className="mt-10 w-full py-5 rounded-[1.5rem] bg-gray-900 text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
                >
                  Usar este Modelo <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robust Automation Creator Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Configurador de Workflow</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("w-2 h-2 rounded-full", step >= 1 ? "bg-blue-500" : "bg-gray-200")} />
                      <span className={cn("w-2 h-2 rounded-full", step >= 2 ? "bg-blue-500" : "bg-gray-200")} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Passo {step} de 2</span>
                    </div>
                  </div>
                </div>
                <button onClick={resetModal} className="p-3 hover:bg-gray-200 rounded-2xl text-gray-400 transition-colors">
                  <X size={28} />
                </button>
              </div>

              <div className="p-12 overflow-y-auto flex-1 custom-scrollbar">
                {step === 1 ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Identificador</label>
                      <input 
                        value={newRule.name}
                        onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                        placeholder="Ex: Onboarding Cliente VIP"
                        className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-6 px-8 text-xl font-black focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Automação</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                          onClick={() => setIsEditingTemplate(false)}
                          className={cn(
                            "p-8 rounded-[2.5rem] border-2 transition-all text-left group relative overflow-hidden",
                            !isEditingTemplate ? "border-gray-900 bg-gray-900 text-white shadow-2xl" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                          )}
                        >
                          <Zap size={24} className={cn("mb-4", !isEditingTemplate ? "text-blue-400" : "text-gray-300")} />
                          <h4 className="font-black text-sm uppercase tracking-tight">Fluxo Operacional</h4>
                          <p className="text-[10px] font-medium opacity-60 mt-1">Ativa imediatamente no funil</p>
                        </button>
                        <button 
                          onClick={() => setIsEditingTemplate(true)}
                          className={cn(
                            "p-8 rounded-[2.5rem] border-2 transition-all text-left group relative overflow-hidden",
                            isEditingTemplate ? "border-blue-600 bg-blue-50 text-blue-600 shadow-xl" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                          )}
                        >
                          <Bookmark size={24} className={cn("mb-4", isEditingTemplate ? "text-blue-600" : "text-gray-300")} />
                          <h4 className="font-black text-sm uppercase tracking-tight">Modelo (Template)</h4>
                          <p className="text-[10px] font-medium opacity-60 mt-1">Salva na biblioteca de modelos</p>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-blue-600 flex items-center gap-2">
                        <MousePointer2 size={12} /> Evento Gatilho
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {triggerTypes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setNewRule({...newRule, triggerType: t.id})}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4",
                              newRule.triggerType === t.id 
                                ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50" 
                                : "border-gray-50 bg-gray-50 hover:border-gray-200"
                            )}
                          >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors", newRule.triggerType === t.id ? "bg-blue-600 text-white" : "bg-white text-gray-400 shadow-sm border border-gray-100")}>
                              <t.icon size={20} />
                            </div>
                            <span className={cn("text-sm font-black tracking-tight", newRule.triggerType === t.id ? "text-blue-900" : "text-gray-600")}>{t.label}</span>
                          </button>
                        ))}
                      </div>

                      {newRule.triggerType === "stage_change" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-gray-50">
                          <p className="text-sm font-bold text-gray-900 mb-4">Qual coluna vai disparar o gatilho?</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {stages.map((s: any) => (
                              <button
                                key={s.id}
                                onClick={() => setNewRule({...newRule, triggerStageId: s.id})}
                                className={cn(
                                  "p-6 rounded-3xl border-2 text-left transition-all",
                                  newRule.triggerStageId === s.id 
                                    ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-100/50" 
                                    : "border-gray-50 bg-gray-50 hover:border-gray-200"
                                )}
                              >
                                <div className={cn("w-8 h-8 rounded-full mb-3 flex items-center justify-center font-black text-xs", newRule.triggerStageId === s.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400")}>
                                  {stages.indexOf(s) + 1}
                                </div>
                                <span className={cn("text-xs font-black uppercase tracking-widest", newRule.triggerStageId === s.id ? "text-blue-900" : "text-gray-400")}>{s.title}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {(newRule.triggerType === "tag_added" || newRule.triggerType === "tag_removed") && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-gray-900">Qual tag deve disparar a automação?</p>
                            <button 
                              onClick={() => setShowTagModal(true)}
                              className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                            >
                              <Settings size={12} /> Gerenciar Tags
                            </button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {availableTags.map((tag: any) => (
                              <button
                                key={tag.id}
                                onClick={() => setNewRule({...newRule, triggerTagId: tag.id})}
                                className={cn(
                                  "p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3",
                                  newRule.triggerTagId === tag.id 
                                    ? "border-blue-600 bg-blue-50/50 shadow-md" 
                                    : "border-gray-50 bg-gray-50 hover:border-gray-200"
                                )}
                              >
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                                <span className={cn("text-[10px] font-black tracking-widest uppercase truncate", newRule.triggerTagId === tag.id ? "text-blue-900" : "text-gray-500")}>{tag.name}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {newRule.triggerType === "deal_stale" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-gray-50">
                          <p className="text-sm font-bold text-gray-900 mb-4">Quantos dias sem interação?</p>
                          <input 
                            type="number"
                            min="1"
                            value={newRule.triggerDays || 3}
                            onChange={(e) => setNewRule({...newRule, triggerDays: parseInt(e.target.value) || 3})}
                            className="w-full md:w-1/3 bg-white border border-gray-100 rounded-xl py-4 px-6 text-xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">Ações em Sequência</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Defina o que acontece após o trigger</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {newRule.actions?.map((action, idx) => {
                        const type = actionTypes.find(t => t.id === action.type);
                        return (
                          <div key={action.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 relative group/action">
                            <button 
                              onClick={() => removeAction(action.id)}
                              className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/action:opacity-100 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                            <div className="flex items-center gap-6 mb-8">
                              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", type?.bg)}>
                                {type && <type.icon className={type.color} size={24} />}
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ação {idx + 1}</span>
                                <p className="text-sm font-black text-gray-900">{type?.label}</p>
                              </div>
                            </div>

                            {action.type === 'activity' ? (
                              <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nome da Atividade</label>
                                <input 
                                  value={action.config.title}
                                  onChange={(e) => updateActionConfig(action.id, { ...action.config, title: e.target.value })}
                                  className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                              </div>
                            ) : action.type === 'move_stage' ? (
                              <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Para qual coluna mover?</label>
                                <select 
                                  value={action.config.stageId}
                                  onChange={(e) => updateActionConfig(action.id, { ...action.config, stageId: e.target.value })}
                                  className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                                >
                                  {stages.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                  ))}
                                </select>
                              </div>
                            ) : action.type === 'add_tag' || action.type === 'remove_tag' ? (
                              <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qual Tag?</label>
                                <select 
                                  value={action.config.tagId}
                                  onChange={(e) => updateActionConfig(action.id, { ...action.config, tagId: e.target.value })}
                                  className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                                >
                                  {availableTags.map((tag: any) => (
                                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                                  ))}
                                </select>
                              </div>
                            ) : action.type === 'webhook' ? (
                              <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">URL do Webhook (POST)</label>
                                <input 
                                  value={action.config.url}
                                  onChange={(e) => updateActionConfig(action.id, { ...action.config, url: e.target.value })}
                                  className="w-full bg-white border border-gray-100 rounded-xl py-3 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                  placeholder="https://..."
                                />
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Conteúdo da Mensagem</label>
                                <textarea 
                                  value={action.config.message}
                                  onChange={(e) => updateActionConfig(action.id, { ...action.config, message: e.target.value })}
                                  className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 text-sm font-bold outline-none min-h-[100px] resize-none focus:ring-2 focus:ring-blue-100 transition-all"
                                  placeholder="Digite sua mensagem personalizada..."
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-50">
                        {actionTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => addAction(type.id)}
                            className="p-6 rounded-[2rem] bg-white border border-gray-100 hover:border-blue-500 hover:shadow-xl hover:shadow-gray-100 transition-all flex flex-col items-center text-center group"
                          >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", type.bg)}>
                              <type.icon className={type.color} size={24} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-between gap-6">
                <button 
                  onClick={() => step === 1 ? resetModal() : setStep(1)}
                  className="px-10 py-5 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  {step === 1 ? "Cancelar" : "Voltar"}
                </button>
                <div className="flex gap-4">
                  {step === 1 ? (
                    <button 
                      onClick={() => setStep(2)}
                      className="bg-gray-900 text-white px-12 py-5 rounded-[1.5rem] font-black text-sm flex items-center gap-2 shadow-xl shadow-gray-200"
                    >
                      Continuar <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-sm flex items-center gap-2 shadow-xl shadow-blue-100"
                    >
                      <Zap size={18} /> {editingId ? "Salvar Alterações" : (isEditingTemplate ? "Criar Template" : "Ativar Fluxo")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ConfirmModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.type === 'template' ? "Excluir Template?" : "Excluir Automação?"}
        message={deleteTarget?.type === 'template' 
          ? "Tem certeza que deseja remover este modelo da sua biblioteca? Esta ação não afetará as automações ativas criadas a partir dele." 
          : "Tem certeza que deseja excluir esta automação? Esta ação não poderá ser desfeita e o fluxo de trabalho será interrompido imediatamente."}
      />

      <TagManagementModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        tags={availableTags}
        onUpdateTags={setAvailableTags}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useFunnel } from "@/context/FunnelContext";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DealCard } from "./DealCard";
import mockDb from "@/data/mock-db.json";
import { Plus, Settings2, Trash2, X, Zap, Save, Check, Tag, DollarSign, User, Building2, RefreshCw, AlertTriangle, Search, Filter, Columns, ChevronDown } from "lucide-react";
import { automationService } from "@/services/automation";
import { DocumentTab } from "@/components/deals/DocumentTab";
import { OnboardingModal } from "@/components/layout/OnboardingModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency, maskCurrency, parseCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { FilterPanel } from "@/components/common/FilterPanel";

const STAGE_COLORS = [
  "#ff5555", "#ffb86c", "#f1fa8c", "#50fa7b", "#8be9fd", 
  "#bd93f9", "#ff79c6", "#6272a4", "#44475a", "#282a36"
];

function KanbanColumn({ id, title, color, deals, onSelectedDeal, onDeleteStage, onUpdateStageTitle, onUpdateStageColor, onAddDeal, onDeleteDeal, onUpdateDealStage }: any) {
  const { setNodeRef } = useDroppable({ id });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newColor, setNewColor] = useState(color || "#3b82f6");

  const handleTitleSubmit = () => {
    onUpdateStageTitle(id, newTitle);
    if (newColor !== color && onUpdateStageColor) {
      onUpdateStageColor(id, newColor);
    }
    setIsEditingTitle(false);
    toast.info(`Etapa atualizada`);
  };

  return (
    <div ref={setNodeRef} className="kanban-column flex flex-col group/col w-[320px] shrink-0">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2 flex-1 mr-2 relative">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color || "#3b82f6" }} />
          {isEditingTitle ? (
            <div className="absolute top-0 left-4 bg-card p-3 rounded-2xl border border-border z-50 w-64">
              <input 
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                className="text-xs font-black text-foreground uppercase tracking-widest bg-transparent border-b border-border focus:border-primary outline-none w-full mb-3 pb-1"
              />
              <div className="flex flex-wrap gap-1.5 mb-3">
                {STAGE_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={cn("w-5 h-5 rounded-full transition-all", newColor === c ? "ring-2 ring-offset-1 scale-110" : "opacity-50 hover:opacity-100")}
                    style={{ backgroundColor: c, "--tw-ring-color": c } as React.CSSProperties}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                 <button onClick={() => setIsEditingTitle(false)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Cancelar</button>
                 <button onClick={handleTitleSubmit} className="text-[10px] font-bold text-blue-600">Salvar</button>
              </div>
            </div>
          ) : (
          <h2 
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-black text-foreground uppercase tracking-widest cursor-text hover:text-primary transition-colors truncate"
            >
              {title}
            </h2>
          )}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
              {deals.length}
            </span>
            <span className="text-[9px] font-black text-muted-foreground">
              {formatCurrency(deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0))}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity shrink-0">
           <button onClick={() => onAddDeal(id)} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Plus size={14} /></button>
           <button onClick={() => onDeleteStage(id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
        </div>
      </div>

      <div className="flex-1 space-y-3 min-h-[600px] bg-muted/20 p-2 rounded-2xl border border-transparent hover:border-border transition-colors">

        <SortableContext
          items={deals.map((d: any) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal: any) => (
            <div key={deal.id} onClick={() => onSelectedDeal(deal)} className="relative group/deal">
              <DealCard 
                deal={deal} 
                stageColor={color || "#3b82f6"}
                onDelete={() => onDeleteDeal(deal.id)} 
                onUpdateStage={onUpdateDealStage}
              />
            </div>
          ))}
        </SortableContext>
        
        <button 
          onClick={() => onAddDeal(id)}
          className="w-full mt-3 h-12 border border-dashed border-border rounded-xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-all group text-muted-foreground hover:text-foreground shrink-0"
        >
          <Plus size={16} className="text-muted-foreground/50 group-hover:text-foreground" />
          <span className="text-[11px] font-black uppercase tracking-widest transition-colors">Adicionar mais um negócio</span>
        </button>
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { 
    deals, setDeals, 
    stages, setStages, 
    funnels, setFunnels,
    activeFunnelId, setActiveFunnelId,
    addFunnel, deleteFunnel, updateFunnel,
    templates, setTemplates,
    users, setUsers,
    availableTags, setAvailableTags
  } = useFunnel();

  const [activeDeal, setActiveDeal] = useState<any | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showManageFunnels, setShowManageFunnels] = useState(false);
  const [showNewFunnelModal, setShowNewFunnelModal] = useState(false);
  const [newFunnelName, setNewFunnelName] = useState("");
  const [newFunnelTemplate, setNewFunnelTemplate] = useState("vendas");
  const [editingFunnelId, setEditingFunnelId] = useState<string | null>(null);
  const [editingFunnelName, setEditingFunnelName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmBack, setShowConfirmBack] = useState(false);
  const [showConfirmDeleteDeal, setShowConfirmDeleteDeal] = useState<string | null>(null);
  const [showConfirmDeleteStage, setShowConfirmDeleteStage] = useState<string | null>(null);
  const [showConfirmDeleteFunnel, setShowConfirmDeleteFunnel] = useState<string | null>(null);
  const [deleteFunnelAction, setDeleteFunnelAction] = useState<'delete' | 'move'>('delete');
  const [targetMoveStageId, setTargetMoveStageId] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logActivity = (deal: any, action: string, user: string = "Jefferson Jr") => {
    const newLog = {
      id: Date.now().toString(),
      action,
      user,
      date: new Date().toISOString()
    };
    return {
      ...deal,
      activityLogs: [newLog, ...(deal.activityLogs || [])]
    };
  };
  
  const [form, setForm] = useState({
    title: "",
    company: "",
    value: "",
    source: "Manual",
    tags: "",
    industry: "Tecnologia & SaaS",
    website: "",
    stage: ""
  });

  const activeFunnel = funnels.find((f: any) => f.id === activeFunnelId) || funnels[0];
  const activeStages = stages.filter((s: any) => s.funnelId === (activeFunnel?.id || activeFunnelId));

  const openNewDealModal = (stageId?: string) => {
    setForm(prev => ({ ...prev, stage: stageId || activeStages[0]?.id || "" }));
    setShowNewDealModal(true);
  };

  useEffect(() => {
    const handleNewDeal = () => openNewDealModal();
    const handleNewFunnel = () => setShowNewFunnelModal(true);

    window.addEventListener("cmd-new-deal", handleNewDeal);
    window.addEventListener("cmd-new-funnel", handleNewFunnel);

    return () => {
      window.removeEventListener("cmd-new-deal", handleNewDeal);
      window.removeEventListener("cmd-new-funnel", handleNewFunnel);
    };
  }, [activeStages]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find((d: any) => d.id === active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeDeal = deals.find((d: any) => d.id === activeId);
    if (!activeDeal) return;

    const overStageId = activeStages.find((s: any) => s.id === overId)?.id || deals.find((d: any) => d.id === overId)?.stage;

    if (overStageId && activeDeal.stage !== overStageId) {
      const targetStageTitle = activeStages.find((s: any) => s.id === overStageId)?.title;

      setDeals((prev: any[]) => prev.map((d: any) => {
        if (d.id === activeId) {
          const updated = { ...d, stage: overStageId as string, lastActivity: new Date().toISOString() };
          return logActivity(updated, `Mudou estágio para ${targetStageTitle}`);
        }
        return d;
      }));
      
      toast.info(`Negócio movido para: ${targetStageTitle}`);

      if (overStageId === "proposal") {
        automationService.handleStageChange(activeId.toString(), "proposal").then(result => {
          if (result?.type === "DOCUMENT_GENERATED") {
             setDeals((prev: any[]) => prev.map((d: any) => {
               if (d.id === activeId) {
                 const withDoc = { 
                   ...d, 
                   documents: [result.document, ...(d.documents || [])] 
                 };
                 return logActivity(withDoc, `Documento "${result.document.name}" gerado automaticamente`);
               }
               return d;
             }));
             toast.success("Automação: Proposta gerada automaticamente!");
          }
        });
      }
    }

    setActiveDeal(null);
  };

  const filteredDeals = deals.filter((d: any) => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.company?.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filters.tags && filters.tags.length > 0) {
      if (!d.tags || !filters.tags.some((tag: string) => d.tags.includes(tag))) return false;
    }

    if (filters.value) {
      if (filters.value.min !== undefined && d.value < filters.value.min) return false;
      if (filters.value.max !== undefined && d.value > filters.value.max) return false;
    }

    return true;
  });

  const addStage = () => {
    const title = "Nova Etapa";
    setStages([...stages, { id: `stage-${Date.now()}`, title, funnelId: activeFunnelId }]);
    toast.success("Nova etapa adicionada ao funil");
  };

  const updateStageTitle = (id: string, newTitle: string) => {
    setStages(stages.map((s: any) => s.id === id ? { ...s, title: newTitle } : s));
  };

  const updateStageColor = (id: string, newColor: string) => {
    setStages(stages.map((s: any) => s.id === id ? { ...s, color: newColor } : s));
  };

  const deleteStage = (id: string) => {
    if (activeStages.length <= 1) {
      toast.error("O funil deve ter pelo menos uma etapa.");
      return;
    }
    setShowConfirmDeleteStage(id);
  };

  const confirmDeleteStage = (targetStageId?: string) => {
    if (!showConfirmDeleteStage) return;
    
    const stageDeals = deals.filter((d: any) => d.stage === showConfirmDeleteStage);
    if (stageDeals.length > 0) {
      if (!targetStageId) {
        toast.error("Selecione uma etapa para mover os negócios.");
        return;
      }
      setDeals((prev: any[]) => prev.map((d: any) => 
        d.stage === showConfirmDeleteStage ? { ...d, stage: targetStageId } : d
      ));
    }

    setStages(stages.filter((s: any) => s.id !== showConfirmDeleteStage));
    setShowConfirmDeleteStage(null);
    toast.error("Etapa removida");
  };
  
  const handleDeleteDeal = (id: string) => {
    setShowConfirmDeleteDeal(id);
  };

  const handleUpdateDeal = (updated: any) => {
    setDeals(deals.map((d: any) => d.id === updated.id ? updated : d));
    setSelectedDeal(updated);
  };

  const handleUpdateDealStage = (id: string, newStage: string) => {
    setDeals(deals.map((d: any) => d.id === id ? { ...d, stage: newStage } : d));
  };

  const confirmDeleteDeal = () => {
    if (!showConfirmDeleteDeal) return;
    setDeals(deals.filter((d: any) => d.id !== showConfirmDeleteDeal));
    setShowConfirmDeleteDeal(null);
    setSelectedDeal(null);
    toast.error("Negócio removido permanentemente");
  };

  const handleCreateDeal = () => {
    if (!form.title) return;
    const newDeal = {
      id: `d${Date.now()}`,
      title: form.title,
      company: form.company || "Empresa Pendente",
      value: parseCurrency(form.value) || 0,
      stage: form.stage || stages[0]?.id,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      tags: form.tags.split(",").map(t => t.trim()).filter(t => t),
      leadSource: form.source,
      entryDate: new Date().toISOString(),
      checklists: [],
      notes: [],
      activities: [],
      documents: [],
      profile: { 
        name: form.company || "Empresa Pendente", 
        industry: form.industry || "Pendente", 
        website: form.website || "",
        contacts: [] 
      }
    };
    setDeals([logActivity(newDeal, "Novo negócio criado manualmente"), ...deals]);
    setShowNewDealModal(false);
    setForm({ title: "", company: "", value: "", source: "Manual", tags: "", industry: "Tecnologia & SaaS", website: "", stage: "" });
    toast.success("Novo negócio criado com sucesso!");
  };

  const handleAddFunnel = () => {
    if (!newFunnelName.trim()) return;
    addFunnel(newFunnelName, newFunnelTemplate);
    setNewFunnelName("");
    setNewFunnelTemplate("vendas");
    toast.success("Novo funil criado!");
  };

  const handleUpdateFunnel = (id: string) => {
    if (!editingFunnelName.trim()) return;
    updateFunnel(id, { name: editingFunnelName });
    setEditingFunnelId(null);
    setEditingFunnelName("");
    toast.success("Nome do funil atualizado");
  };

  const updateTemplates = (newTemplates: any[]) => {
    setTemplates(newTemplates);
    setDeals((prevDeals: any[]) => prevDeals.map((deal: any) => {
      const updatedChecklists = deal.checklists?.map((cl: any) => {
        if (cl.templateId) {
          const template = newTemplates.find((t: any) => t.id === cl.templateId);
          if (template) {
            return {
              ...cl,
              name: template.name,
              items: template.checkpoints.map((cp: string) => ({
                text: cp,
                checked: cl.items.find((it: any) => it.text === cp)?.checked || false
              }))
            };
          }
        }
        return cl;
      });
      return { ...deal, checklists: updatedChecklists };
    }));
  };

  const handleResetData = () => {
    if (confirm("Isso irá apagar todas as suas alterações e carregar os dados padrão (incluindo Michael Jackson). Deseja continuar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6 md:p-10 scrollbar-hide transition-colors duration-300">
      <OnboardingModal />
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="relative group/funnel flex items-center gap-2">
            <button 
              onClick={() => setShowManageFunnels(!showManageFunnels)}
              className="flex items-center gap-3 hover:bg-muted p-2 -ml-2 rounded-2xl transition-all"
            >
              <h1 className="text-2xl font-black text-foreground tracking-tight">{activeFunnel?.name || "Pipeline de Vendas"}</h1>
              <ChevronDown size={20} className="text-muted-foreground group-hover/funnel:text-primary transition-colors" />
            </button>
            <button 
              onClick={() => setShowNewFunnelModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all border border-primary/20"
            >
              <Plus size={14} /> Novo Funil
            </button>
            
            <AnimatePresence>
              {showManageFunnels && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowManageFunnels(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-card border border-border rounded-[2rem] shadow-2xl p-4 z-20"
                  >
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-2">Seus Pipelines</p>
                    <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-hide">
                      {funnels.map((f: any) => (
                        <div key={f.id} className="flex items-center gap-2 group/item">
                          {editingFunnelId === f.id ? (
                            <div className="flex-1 flex items-center gap-2 px-2 py-1">
                              <input 
                                autoFocus
                                value={editingFunnelName}
                                onChange={(e) => setEditingFunnelName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleUpdateFunnel(f.id)}
                                className="flex-1 bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold outline-none text-foreground"
                              />
                              <button onClick={() => handleUpdateFunnel(f.id)} className="text-green-500"><Check size={14} /></button>
                            </div>
                          ) : (
                            <>
                              <button 
                                onClick={() => { setActiveFunnelId(f.id); setShowManageFunnels(false); }}
                                className={cn(
                                  "flex-1 text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex justify-between items-center",
                                  activeFunnelId === f.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                                )}
                              >
                                {f.name}
                                {activeFunnelId === f.id && <Check size={14} />}
                              </button>
                              {funnels.length > 1 && (
                                <div className="flex opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => { setEditingFunnelId(f.id); setEditingFunnelName(f.name); }}
                                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Settings2 size={12} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setShowConfirmDeleteFunnel(f.id);
                                      setDeleteFunnelAction('delete');
                                    }}
                                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {showNewFunnelModal && (
                <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-card w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-border flex flex-col"
                  >
                    <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          <Plus size={20} />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-foreground">Novo Pipeline</h2>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Configure as etapas do seu funil</p>
                        </div>
                      </div>
                      <button onClick={() => setShowNewFunnelModal(false)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-black text-foreground uppercase tracking-widest mb-2">Nome do Funil</label>
                        <input 
                          autoFocus
                          placeholder="Ex: Vendas B2B, Locação SP..."
                          value={newFunnelName}
                          onChange={(e) => setNewFunnelName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newFunnelName.trim()) {
                              handleAddFunnel();
                              setShowNewFunnelModal(false);
                            }
                          }}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all"
                        />
                      </div>

                      {/* Template picker */}
                      <div>
                        <label className="block text-xs font-black text-foreground uppercase tracking-widest mb-4">Modelo de Etapas</label>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            { id: "vendas",      emoji: "💼", label: "Vendas",       desc: "Lead → Qualif. → Reunião → Proposta → Contrato" },
                            { id: "locacao",     emoji: "🏠", label: "Locação",      desc: "Interesse → Visita → Análise → Contrato → Chaves" },
                            { id: "recrutamento",emoji: "🧑‍💼",label: "Recrutamento",  desc: "Candidatura → Triagem → RH → Técnica → Contratado" },
                            { id: "cs",          emoji: "🤝", label: "Suc. do Cliente",desc: "Onboarding → Adoção → Expansão → Renovação" },
                            { id: "parceiro",    emoji: "🌐", label: "Parceiros",    desc: "Prospecção → Due Diligence → Parceria → Ativo" },
                            { id: "blank",       emoji: "➕", label: "Em Branco",    desc: "Começa com uma única etapa vazia" },
                          ] as const).map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setNewFunnelTemplate(t.id)}
                              className={cn(
                                "p-4 rounded-2xl border-2 text-left transition-all",
                                newFunnelTemplate === t.id
                                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                  : "border-border bg-muted/30 hover:border-primary/30 hover:bg-muted/50"
                              )}
                            >
                              <span className="text-2xl block mb-2">{t.emoji}</span>
                              <p className={cn("text-xs font-black uppercase tracking-widest", newFunnelTemplate === t.id ? "text-primary" : "text-foreground")}>{t.label}</p>
                              <p className="text-[10px] text-muted-foreground font-bold mt-1 leading-tight">{t.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
                      <button 
                        onClick={() => setShowNewFunnelModal(false)}
                        className="px-6 py-3 rounded-xl font-black text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => {
                          if (newFunnelName.trim()) {
                            handleAddFunnel();
                            setShowNewFunnelModal(false);
                          }
                        }}
                        disabled={!newFunnelName.trim()}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2"
                      >
                        <Check size={18} /> Criar Pipeline
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             Ativo • {filteredDeals.filter((d: any) => activeStages.some((s: any) => s.id === d.stage)).length} Negócios
          </div>
        </div>
        {!selectedDeal && (
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar negócio..."
                className="w-48 bg-card border border-border rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/5 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-5 py-2.5 rounded-2xl transition-all border flex items-center gap-2",
                showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              )}
            >
              <Filter size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Filtrar</span>
            </button>

            <button 
              onClick={addStage}
              className="bg-card border border-border text-foreground px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-muted transition-all"
            >
              <Columns size={16} />
              Etapas
            </button>
            <button 
              onClick={() => setShowNewDealModal(true)}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Novo Lead
            </button>
          </div>
        )}
      </header>

      {selectedDeal ? (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => {
              if (hasUnsavedChanges) {
                setShowConfirmBack(true);
              } else {
                setSelectedDeal(null);
              }
            }}
            className="text-xs font-black text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2 uppercase tracking-widest px-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar ao Funil
          </button>
          <DocumentTab 
            deal={selectedDeal} 
            onUpdate={handleUpdateDeal} 
            onDelete={handleDeleteDeal}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {!selectedDeal && (
            <FilterPanel 
              isOpen={showFilters}
              filters={[
                { key: "tags", label: "Tags", type: "multi-select", options: availableTags.map((t: any) => ({ label: t.name, value: t.name })) },
                { key: "value", label: "Valor Estimado (R$)", type: "number-range" }
              ]}
              values={filters}
              onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
              onClear={() => setFilters({})}
            />
          )}
          <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide -mx-6 md:-mx-8 px-6 md:px-8">
            <div className="flex gap-6 h-full min-w-full pb-4 items-start w-fit">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={activeStages.map((s: any) => s.id)} 
                  strategy={horizontalListSortingStrategy}
                >
                  {activeStages.map((stage: any) => (
                    <KanbanColumn 
                      key={stage.id} 
                      id={stage.id}
                      title={stage.title}
                      color={stage.color}
                      deals={filteredDeals.filter((d: any) => d.stage === stage.id)}
                    onSelectedDeal={setSelectedDeal}
                    onAddDeal={openNewDealModal}
                    onUpdateStageTitle={updateStageTitle}
                    onUpdateStageColor={updateStageColor}
                    onDeleteStage={deleteStage}
                    onDeleteDeal={handleDeleteDeal}
                    onUpdateDealStage={handleUpdateDealStage}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeDeal ? (
                  <div className="opacity-80 rotate-3 scale-105 pointer-events-none">
                    <DealCard deal={activeDeal} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
            
            <button 
              onClick={addStage}
              className="w-[320px] shrink-0 h-24 border-2 border-dashed border-border rounded-[2rem] flex items-center justify-center gap-3 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/30 transition-all group"
            >
              <Columns size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Adicionar mais uma coluna</span>
            </button>
          </div>
        </div>
      </div>
    )}

      <AnimatePresence>
        {showNewDealModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card rounded-[2.5rem] p-10 w-full max-w-xl border border-border"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Novo Negócio</h2>
                  <p className="text-xs text-muted-foreground font-bold uppercase mt-1">Preencha os detalhes da oportunidade</p>
                </div>
                <button onClick={() => setShowNewDealModal(false)} className="p-2 hover:bg-muted rounded-2xl text-muted-foreground hover:text-foreground transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User size={12} /> Nome do Negócio
                  </label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Ex: Consultoria de Marketing"
                    className="w-full p-4 rounded-2xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/5 transition-all outline-none" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Settings2 size={12} /> Empresa
                  </label>
                  <input 
                    type="text" 
                    value={form.company}
                    onChange={(e) => setForm({...form, company: e.target.value})}
                    placeholder="Ex: Acme Corp"
                    className="w-full p-4 rounded-2xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/5 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <DollarSign size={12} /> Valor Estimado
                  </label>
                  <input 
                    type="text" 
                    value={form.value}
                    onChange={(e) => setForm({...form, value: maskCurrency(e.target.value)})}
                    placeholder="R$ 0,00"
                    className="w-full p-4 rounded-2xl border border-border bg-muted/50 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/5 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap size={12} /> Origem do Lead
                  </label>
                  <select 
                    value={form.source}
                    onChange={(e) => setForm({...form, source: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/5 transition-all outline-none appearance-none"
                  >
                    <option>Manual</option>
                    <option>LinkedIn</option>
                    <option>Website</option>
                    <option>Indicação</option>
                    <option>Instagram</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Tag size={12} /> Etapa do Funil
                  </label>
                  <select 
                    value={form.stage}
                    onChange={(e) => setForm({...form, stage: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-border bg-muted/50 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/5 transition-all outline-none appearance-none"
                  >
                     {activeStages.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                 <div className="col-span-2">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Tag size={12} /> Tags (separadas por vírgula)
                  </label>
                  <input 
                    type="text" 
                    value={form.tags}
                    onChange={(e) => setForm({...form, tags: e.target.value})}
                    placeholder="VIP, Urgente, Demo"
                    className="w-full p-4 rounded-2xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/5 transition-all outline-none" 
                  />
                </div>

                <div className="col-span-2 p-6 bg-blue-50/30 rounded-3xl border border-blue-50/50 mt-4">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Building2 size={12} /> Perfil da Empresa (Opcional)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-2">Setor</label>
                      <select 
                        value={form.industry}
                        onChange={(e) => setForm({...form, industry: e.target.value})}
                        className="w-full p-3 rounded-xl border border-border bg-muted/50 text-foreground text-xs font-bold outline-none focus:ring-2 focus:ring-primary/5"
                      >
                        <option>Tecnologia & SaaS</option>
                        <option>Imobiliário</option>
                        <option>Educação</option>
                        <option>Varejo</option>
                        <option>Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-2">Website</label>
                      <input 
                        type="text"
                        value={form.website}
                        onChange={(e) => setForm({...form, website: e.target.value})}
                        placeholder="www.empresa.com"
                        className="w-full p-3 rounded-xl border border-border bg-muted/50 text-foreground text-xs font-bold outline-none focus:ring-2 focus:ring-primary/5"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 pt-6">
                  <button 
                    onClick={handleCreateDeal}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl text-sm font-black hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Criar Negócio no Funil
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={showConfirmBack}
        onClose={() => setShowConfirmBack(false)}
        onConfirm={() => {
          setHasUnsavedChanges(false);
          setSelectedDeal(null);
        }}
        title="Alterações não salvas"
        message="Você tem alterações que não foram salvas. Deseja sair sem salvar?"
        confirmText="Sair sem salvar"
        cancelText="Continuar editando"
        type="warning"
      />

      <ConfirmModal 
        isOpen={!!showConfirmDeleteDeal}
        onClose={() => setShowConfirmDeleteDeal(null)}
        onConfirm={confirmDeleteDeal}
        title="Excluir Negócio"
        message="Tem certeza que deseja excluir este negócio permanentemente? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
      {showConfirmDeleteStage && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-border"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <button onClick={() => setShowConfirmDeleteStage(null)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-foreground mb-2">Excluir Etapa?</h3>
              
              {deals.filter((d: any) => d.stage === showConfirmDeleteStage).length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4">
                    Existem {deals.filter((d: any) => d.stage === showConfirmDeleteStage).length} negócios nesta etapa. Para onde você deseja movê-los?
                  </p>
                  <select 
                    id="targetStageSelect"
                    className="w-full p-4 rounded-2xl border border-border bg-muted/50 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/5 transition-all outline-none appearance-none mb-4"
                  >
                    <option value="">Selecione uma etapa...</option>
                    {activeStages.filter((s: any) => s.id !== showConfirmDeleteStage).map((s: any) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </>
              ) : (
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4">
                  Tem certeza que deseja remover esta etapa do seu funil de vendas?
                </p>
              )}
              
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowConfirmDeleteStage(null)}
                  className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    const targetSelect = document.getElementById("targetStageSelect") as HTMLSelectElement;
                    const targetStageId = targetSelect ? targetSelect.value : undefined;
                    confirmDeleteStage(targetStageId);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 bg-red-500 shadow-red-100 hover:bg-red-600"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {showConfirmDeleteFunnel && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-[2rem] w-full max-w-lg border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <button onClick={() => setShowConfirmDeleteFunnel(null)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-foreground mb-2">Excluir Funil: {funnels.find((f: any) => f.id === showConfirmDeleteFunnel)?.name}?</h3>
              
              <div className="space-y-6 mt-6">
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  O que você deseja fazer com os negócios que estão neste funil?
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDeleteFunnelAction('delete')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-left",
                      deleteFunnelAction === 'delete' ? "border-red-500 bg-red-500/5" : "border-border hover:border-muted-foreground/20"
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center", deleteFunnelAction === 'delete' ? "border-red-500" : "border-muted-foreground")}>
                      {deleteFunnelAction === 'delete' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-foreground">Excluir Tudo</p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1">Apagar funil e todos os negócios permanentemente.</p>
                  </button>

                  <button 
                    onClick={() => setDeleteFunnelAction('move')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-left",
                      deleteFunnelAction === 'move' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/20"
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center", deleteFunnelAction === 'move' ? "border-primary" : "border-muted-foreground")}>
                      {deleteFunnelAction === 'move' && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-foreground">Mover Negócios</p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1">Transferir negócios para outro pipeline antes de excluir.</p>
                  </button>
                </div>

                {deleteFunnelAction === 'move' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Destino dos Negócios</label>
                    <select 
                      value={targetMoveStageId}
                      onChange={(e) => setTargetMoveStageId(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/5 appearance-none"
                    >
                      <option value="">Selecione uma etapa de destino...</option>
                      {funnels.filter((f: any) => f.id !== showConfirmDeleteFunnel).map((f: any) => (
                        <optgroup key={f.id} label={f.name}>
                          {stages.filter((s: any) => s.funnelId === f.id).map((s: any) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-10">
                <button 
                  onClick={() => setShowConfirmDeleteFunnel(null)}
                  className="flex-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    if (deleteFunnelAction === 'move' && !targetMoveStageId) {
                      toast.error("Selecione uma etapa de destino para os negócios.");
                      return;
                    }
                    deleteFunnel(showConfirmDeleteFunnel, deleteFunnelAction, targetMoveStageId);
                    setShowConfirmDeleteFunnel(null);
                    setTargetMoveStageId("");
                    toast.error(`Funil excluído com sucesso.`);
                  }}
                  className={cn(
                    "flex-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95",
                    deleteFunnelAction === 'delete' ? "bg-red-500 shadow-red-500/20 hover:bg-red-600" : "bg-primary shadow-primary/20 hover:opacity-90"
                  )}
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

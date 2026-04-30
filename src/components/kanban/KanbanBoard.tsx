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
import { Plus, Settings2, Trash2, X, Zap, Save, Check, Tag, DollarSign, User, Building2, RefreshCw, AlertTriangle, Search, Filter, Columns } from "lucide-react";
import { automationService } from "@/services/automation";
import { DocumentTab } from "@/components/deals/DocumentTab";
import { OnboardingModal } from "@/components/layout/OnboardingModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency, maskCurrency, parseCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { FilterPanel } from "@/components/common/FilterPanel";

const STAGE_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#ec4899", "#64748b", "#3f3f46"
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
            <div className="absolute top-0 left-4 bg-white dark:bg-card p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-border z-50 w-64">
              <input 
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest bg-transparent border-b border-gray-200 dark:border-border focus:border-blue-500 outline-none w-full mb-3 pb-1"
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
                 <button onClick={() => setIsEditingTitle(false)} className="text-[10px] font-bold text-gray-400">Cancelar</button>
                 <button onClick={handleTitleSubmit} className="text-[10px] font-bold text-blue-600">Salvar</button>
              </div>
            </div>
          ) : (
          <h2 
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest cursor-text hover:text-blue-600 transition-colors truncate"
            >
              {title}
            </h2>
          )}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-muted px-2 py-0.5 rounded-full shrink-0">
              {deals.length}
            </span>
            <span className="text-[9px] font-black text-gray-400">
              {formatCurrency(deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0))}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity shrink-0">
           <button onClick={() => onAddDeal(id)} className="p-1 text-gray-400 hover:text-gray-900"><Plus size={14} /></button>
           <button onClick={() => onDeleteStage(id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
        </div>
      </div>

      <div className="flex-1 space-y-3 min-h-[600px] bg-gray-50/30 p-2 rounded-2xl border border-transparent hover:border-gray-100 transition-colors">

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
          className="w-full mt-3 h-12 border border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all group text-gray-400 hover:text-gray-900 shrink-0"
        >
          <Plus size={16} className="text-gray-300 group-hover:text-gray-500" />
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">Adicionar mais um negócio</span>
        </button>
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { 
    deals, setDeals, 
    stages, setStages, 
    templates, setTemplates,
    users, setUsers,
    availableTags, setAvailableTags
  } = useFunnel();

  const [activeDeal, setActiveDeal] = useState<any | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmBack, setShowConfirmBack] = useState(false);
  const [showConfirmDeleteDeal, setShowConfirmDeleteDeal] = useState<string | null>(null);
  const [showConfirmDeleteStage, setShowConfirmDeleteStage] = useState<string | null>(null);
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

  const openNewDealModal = (stageId?: string) => {
    setForm(prev => ({ ...prev, stage: stageId || stages[0]?.id || "" }));
    setShowNewDealModal(true);
  };

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

    const overStageId = stages.find((s: any) => s.id === overId)?.id || deals.find((d: any) => d.id === overId)?.stage;

    if (overStageId && activeDeal.stage !== overStageId) {
      const targetStageTitle = stages.find((s: any) => s.id === overStageId)?.title;

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
    setStages([...stages, { id: `stage-${Date.now()}`, title }]);
    toast.success("Nova etapa adicionada ao funil");
  };

  const updateStageTitle = (id: string, newTitle: string) => {
    setStages(stages.map((s: any) => s.id === id ? { ...s, title: newTitle } : s));
  };

  const updateStageColor = (id: string, newColor: string) => {
    setStages(stages.map((s: any) => s.id === id ? { ...s, color: newColor } : s));
  };

  const deleteStage = (id: string) => {
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
    <div className="flex flex-col h-full bg-[#fcfcfc] p-6 md:p-10 scrollbar-hide">
      <OnboardingModal />
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 px-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pipeline de Vendas</h1>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             Ativo • {filteredDeals.length} Negócios
          </div>
        </div>
        {!selectedDeal && (
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar negócio..."
                className="w-48 bg-white border border-gray-100 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-5 py-2.5 rounded-2xl transition-all shadow-sm border flex items-center gap-2",
                showFilters ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-400 border-gray-100 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Filter size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Filtrar</span>
            </button>
            <button 
              onClick={handleResetData}
              className="bg-white border border-gray-100 text-gray-400 px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
              title="Resetar dados para o padrão"
            >
              <RefreshCw size={16} />
              Resetar
            </button>
            <button 
              onClick={addStage}
              className="bg-white border border-gray-100 text-gray-700 px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Columns size={16} />
              Adicionar Coluna
            </button>
            <button 
              onClick={() => openNewDealModal()}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              <Plus size={18} />
              Novo Lead
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
            className="text-xs font-black text-gray-400 hover:text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest px-2 group"
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
                  items={stages.map((s: any) => s.id)} 
                  strategy={horizontalListSortingStrategy}
                >
                  {stages.map((stage: any) => (
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
              className="w-[320px] shrink-0 h-24 border-2 border-dashed border-gray-100 rounded-[2rem] flex items-center justify-center gap-3 text-gray-300 hover:border-gray-200 hover:text-gray-400 hover:bg-gray-50/50 transition-all group"
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
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Novo Negócio</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1">Preencha os detalhes da oportunidade</p>
                </div>
                <button onClick={() => setShowNewDealModal(false)} className="p-2 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User size={12} /> Nome do Negócio
                  </label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Ex: Consultoria de Marketing"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Settings2 size={12} /> Empresa
                  </label>
                  <input 
                    type="text" 
                    value={form.company}
                    onChange={(e) => setForm({...form, company: e.target.value})}
                    placeholder="Ex: Acme Corp"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <DollarSign size={12} /> Valor Estimado
                  </label>
                  <input 
                    type="text" 
                    value={form.value}
                    onChange={(e) => setForm({...form, value: maskCurrency(e.target.value)})}
                    placeholder="R$ 0,00"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap size={12} /> Origem do Lead
                  </label>
                  <select 
                    value={form.source}
                    onChange={(e) => setForm({...form, source: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none appearance-none"
                  >
                    <option>Manual</option>
                    <option>LinkedIn</option>
                    <option>Website</option>
                    <option>Indicação</option>
                    <option>Instagram</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Tag size={12} /> Etapa do Funil
                  </label>
                  <select 
                    value={form.stage}
                    onChange={(e) => setForm({...form, stage: e.target.value})}
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none appearance-none"
                  >
                    {stages.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                 <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Tag size={12} /> Tags (separadas por vírgula)
                  </label>
                  <input 
                    type="text" 
                    value={form.tags}
                    onChange={(e) => setForm({...form, tags: e.target.value})}
                    placeholder="VIP, Urgente, Demo"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none" 
                  />
                </div>

                <div className="col-span-2 p-6 bg-blue-50/30 rounded-3xl border border-blue-50/50 mt-4">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Building2 size={12} /> Perfil da Empresa (Opcional)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase mb-2">Setor</label>
                      <select 
                        value={form.industry}
                        onChange={(e) => setForm({...form, industry: e.target.value})}
                        className="w-full p-3 rounded-xl border border-white bg-white text-xs font-bold outline-none"
                      >
                        <option>Tecnologia & SaaS</option>
                        <option>Imobiliário</option>
                        <option>Educação</option>
                        <option>Varejo</option>
                        <option>Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase mb-2">Website</label>
                      <input 
                        type="text"
                        value={form.website}
                        onChange={(e) => setForm({...form, website: e.target.value})}
                        placeholder="www.empresa.com"
                        className="w-full p-3 rounded-xl border border-white bg-white text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 pt-6">
                  <button 
                    onClick={handleCreateDeal}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
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
            className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <button onClick={() => setShowConfirmDeleteStage(null)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-2">Excluir Etapa?</h3>
              
              {deals.filter((d: any) => d.stage === showConfirmDeleteStage).length > 0 ? (
                <>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                    Existem {deals.filter((d: any) => d.stage === showConfirmDeleteStage).length} negócios nesta etapa. Para onde você deseja movê-los?
                  </p>
                  <select 
                    id="targetStageSelect"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none appearance-none mb-4"
                  >
                    <option value="">Selecione uma etapa...</option>
                    {stages.filter((s: any) => s.id !== showConfirmDeleteStage).map((s: any) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </>
              ) : (
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                  Tem certeza que deseja remover esta etapa do seu funil de vendas?
                </p>
              )}
              
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowConfirmDeleteStage(null)}
                  className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
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
    </div>
  );
}

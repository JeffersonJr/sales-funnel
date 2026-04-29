"use client";

import React, { useState } from "react";
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
} from "@dnd-kit/sortable";
import { DealCard } from "./DealCard";
import mockDb from "@/data/mock-db.json";
import { Plus, Settings2, Trash2, X, Zap, Save, Check, Tag, DollarSign, User } from "lucide-react";
import { automationService } from "@/services/automation";
import { DocumentTab } from "@/components/deals/DocumentTab";
import { OnboardingModal } from "@/components/layout/OnboardingModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function KanbanColumn({ id, title, deals, onSelectedDeal, onDeleteStage, onUpdateStageTitle, onQuickAdd }: any) {
  const { setNodeRef } = useDroppable({ id });
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTitle) {
      onQuickAdd(id, quickTitle);
      setQuickTitle("");
      setIsQuickAdding(false);
    }
  };

  const handleTitleSubmit = () => {
    onUpdateStageTitle(id, newTitle);
    setIsEditingTitle(false);
  };

  return (
    <div ref={setNodeRef} className="kanban-column flex flex-col group/col w-[320px] shrink-0">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2 flex-1 mr-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          {isEditingTitle ? (
            <input 
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              className="text-xs font-black text-gray-900 uppercase tracking-widest bg-transparent border-b border-blue-500 outline-none w-full"
            />
          ) : (
            <h2 
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-black text-gray-900 uppercase tracking-widest cursor-text hover:text-blue-600 transition-colors truncate"
            >
              {title}
            </h2>
          )}
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
            {deals.length}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity shrink-0">
           <button onClick={() => setIsQuickAdding(true)} className="p-1 text-gray-400 hover:text-gray-900"><Plus size={14} /></button>
           <button onClick={() => onDeleteStage(id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
        </div>
      </div>

      <div className="flex-1 space-y-3 min-h-[600px] bg-gray-50/30 p-2 rounded-2xl border border-transparent hover:border-gray-100 transition-colors">
        {isQuickAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleQuickAdd}
            className="bg-white p-3 rounded-xl shadow-md border border-blue-200 mb-3"
          >
            <input 
              autoFocus
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Nome do negócio..."
              className="text-sm w-full outline-none mb-2"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsQuickAdding(false)} className="text-[10px] font-bold text-gray-400">Cancelar</button>
              <button type="submit" className="text-[10px] font-bold text-blue-600">Adicionar</button>
            </div>
          </motion.form>
        )}

        <SortableContext
          items={deals.map((d: any) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal: any) => (
            <div key={deal.id} onClick={() => onSelectedDeal(deal)}>
              <DealCard deal={deal} />
            </div>
          ))}
        </SortableContext>
        
        {!isQuickAdding && deals.length === 0 && (
          <button 
            onClick={() => setIsQuickAdding(true)}
            className="w-full h-12 border border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:bg-white transition-all group"
          >
            <Plus size={14} className="text-gray-300 group-hover:text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [deals, setDeals] = useState<any[]>(mockDb.deals);
  const [stages, setStages] = useState<any[]>(mockDb.stages);
  const [templates, setTemplates] = useState<any[]>(mockDb.templates);
  const [activeDeal, setActiveDeal] = useState<any | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    company: "",
    value: "",
    source: "Manual",
    tags: ""
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find((d) => d.id === active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeDeal = deals.find(d => d.id === activeId);
    if (!activeDeal) return;

    const overStageId = stages.find(s => s.id === overId)?.id || deals.find(d => d.id === overId)?.stage;

    if (overStageId && activeDeal.stage !== overStageId) {
      setDeals(prev => prev.map(d => 
        d.id === activeId ? { ...d, stage: overStageId as string, lastActivity: new Date().toISOString() } : d
      ));
      
      if (overStageId === "proposal") {
        automationService.handleStageChange(activeId.toString(), "proposal");
      }
    }

    setActiveDeal(null);
  };

  const handleQuickAdd = (stageId: string, title: string) => {
    const newDeal = {
      id: `d${Date.now()}`,
      title,
      company: "Empresa Pendente",
      value: 0,
      stage: stageId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      tags: ["Rápido"],
      leadSource: "Adição Rápida",
      entryDate: new Date().toISOString(),
      checklists: [],
      notes: [],
      activities: [],
      documents: [],
      profile: { name: "Empresa Pendente", industry: "Pendente", contacts: [] }
    };
    setDeals([newDeal, ...deals]);
  };

  const addStage = () => {
    const title = "Nova Coluna";
    setStages([...stages, { id: `stage-${Date.now()}`, title }]);
  };

  const updateStageTitle = (id: string, newTitle: string) => {
    setStages(stages.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const deleteStage = (id: string) => {
    if (confirm("Excluir esta etapa?")) {
      setStages(stages.filter(s => s.id !== id));
    }
  };

  const handleCreateDeal = () => {
    if (!form.title) return;
    const newDeal = {
      id: `d${Date.now()}`,
      title: form.title,
      company: form.company || "Empresa Pendente",
      value: parseFloat(form.value) || 0,
      stage: stages[0].id,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      tags: form.tags.split(",").map(t => t.trim()).filter(t => t),
      leadSource: form.source,
      entryDate: new Date().toISOString(),
      checklists: [],
      notes: [],
      activities: [],
      documents: [],
      profile: { name: form.company || "Empresa Pendente", industry: "Pendente", contacts: [] }
    };
    setDeals([newDeal, ...deals]);
    setShowNewDealModal(false);
    setForm({ title: "", company: "", value: "", source: "Manual", tags: "" });
  };

  const updateTemplates = (newTemplates: any[]) => {
    setTemplates(newTemplates);
    // Propagate changes to deals that use these templates
    setDeals(prevDeals => prevDeals.map(deal => {
      const updatedChecklists = deal.checklists?.map((cl: any) => {
        if (cl.templateId) {
          const template = newTemplates.find(t => t.id === cl.templateId);
          if (template) {
            // Merge existing completion status with new template items
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

  return (
    <div className="p-8 h-full flex flex-col bg-[#fcfcfc]">
      <OnboardingModal />
      <header className="flex justify-between items-center mb-8 px-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pipeline de Vendas</h1>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             Ativo • {deals.length} Negócios
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={addStage}
            className="bg-white border border-gray-100 text-gray-600 px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Settings2 size={16} />
            Adicionar Coluna
          </button>
          <button 
            onClick={() => setShowNewDealModal(true)}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
            <Plus size={18} />
            Novo Lead
          </button>
        </div>
      </header>

      {selectedDeal ? (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => setSelectedDeal(null)}
            className="text-xs font-black text-gray-400 hover:text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest px-2"
          >
            ← Voltar ao Funil
          </button>
          <DocumentTab 
            deal={selectedDeal} 
            stages={stages}
            templates={templates}
            onUpdateTemplates={updateTemplates}
            onUpdate={(updated) => {
              setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
              setSelectedDeal(updated);
            }} 
          />
        </div>
      ) : (
        <div className="flex gap-6 flex-1 overflow-x-auto pb-8 items-start scrollbar-hide px-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {stages.map((stage) => (
              <KanbanColumn 
                key={stage.id} 
                id={stage.id} 
                title={stage.title} 
                deals={deals.filter(d => d.stage === stage.id)}
                onSelectedDeal={setSelectedDeal}
                onDeleteStage={deleteStage}
                onUpdateStageTitle={updateStageTitle}
                onQuickAdd={handleQuickAdd}
              />
            ))}
            <DragOverlay dropAnimation={null}>
              {activeDeal ? <DealCard deal={activeDeal} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Enhanced Creation Form */}
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
                    type="number" 
                    value={form.value}
                    onChange={(e) => setForm({...form, value: e.target.value})}
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
    </div>
  );
}

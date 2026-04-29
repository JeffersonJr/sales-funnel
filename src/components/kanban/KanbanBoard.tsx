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
import { Plus, Settings2, Trash2, X, Zap } from "lucide-react";
import { automationService } from "@/services/automation";
import { DocumentTab } from "@/components/deals/DocumentTab";
import { OnboardingModal } from "@/components/layout/OnboardingModal";
import { motion, AnimatePresence } from "framer-motion";

function KanbanColumn({ id, title, deals, onSelectedDeal, onDeleteStage, onQuickAdd }: any) {
  const { setNodeRef } = useDroppable({ id });
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTitle) {
      onQuickAdd(id, quickTitle);
      setQuickTitle("");
      setIsQuickAdding(false);
    }
  };

  return (
    <div ref={setNodeRef} className="kanban-column flex flex-col group/col w-[320px] shrink-0">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">
            {title}
          </h2>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {deals.length}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
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
  const [activeDeal, setActiveDeal] = useState<any | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState("");
  const [newDealCompany, setNewDealCompany] = useState("");

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
    const title = prompt("Nome da nova etapa:");
    if (title) {
      setStages([...stages, { id: title.toLowerCase().replace(/ /g, "-"), title }]);
    }
  };

  const deleteStage = (id: string) => {
    if (confirm("Excluir esta etapa?")) {
      setStages(stages.filter(s => s.id !== id));
    }
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
            Configurar Funil
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
                onQuickAdd={handleQuickAdd}
              />
            ))}
            <DragOverlay dropAnimation={null}>
              {activeDeal ? <DealCard deal={activeDeal} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Modal Estilo Kommo para Novo Deal */}
      <AnimatePresence>
        {showNewDealModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-gray-900">Novo Lead</h2>
                <button onClick={() => setShowNewDealModal(false)} className="p-2 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nome do Lead</label>
                  <input 
                    type="text" 
                    value={newDealTitle}
                    onChange={(e) => setNewDealTitle(e.target.value)}
                    placeholder="Quem é o seu novo cliente?"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Empresa</label>
                  <input 
                    type="text" 
                    value={newDealCompany}
                    onChange={(e) => setNewDealCompany(e.target.value)}
                    placeholder="Onde eles trabalham?"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none" 
                  />
                </div>
                <div className="pt-6">
                  <button 
                    onClick={() => {
                      if(newDealTitle) {
                        handleQuickAdd(stages[0].id, newDealTitle);
                        setShowNewDealModal(false);
                        setNewDealTitle("");
                      }
                    }}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                  >
                    Adicionar ao Funil
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

"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  FileText, 
  Wand2, 
  User, 
  Calendar, 
  DollarSign, 
  Tag as TagIcon,
  MessageSquare,
  History,
  Building2,
  Plus,
  Clock,
  Layout,
  Save,
  Trash2,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Eye,
  Download,
  X
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { docGenerator } from "@/services/doc-generator";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import mockDb from "@/data/mock-db.json";
import { motion, AnimatePresence } from "framer-motion";

export function DocumentTab({ deal, onUpdate, stages }: { deal: any, onUpdate: (deal: any) => void, stages: any[] }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"details" | "profile" | "documents" | "activity">("details");
  const [newNote, setNewNote] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  const toggleChecklistItem = (checklistId: string, itemText: string) => {
    const updatedChecklists = deal.checklists.map((cl: any) => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map((item: any) => 
            item.text === itemText ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return cl;
    });
    onUpdate({ ...deal, checklists: updatedChecklists });
  };

  const addChecklist = () => {
    const name = prompt("Nome do novo checklist:");
    if (!name) return;
    const newCl = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      items: []
    };
    onUpdate({ ...deal, checklists: [...(deal.checklists || []), newCl] });
  };

  const addChecklistItem = (checklistId: string) => {
    const text = prompt("Novo item:");
    if (!text) return;
    const updatedChecklists = deal.checklists.map((cl: any) => {
      if (cl.id === checklistId) {
        return { ...cl, items: [...cl.items, { text, checked: false }] };
      }
      return cl;
    });
    onUpdate({ ...deal, checklists: updatedChecklists });
  };

  const deleteDocument = (docId: string) => {
    if (confirm("Excluir documento?")) {
      onUpdate({ ...deal, documents: deal.documents.filter((d: any) => d.id !== docId) });
    }
  };

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    const summary = await docGenerator.generateDealSummary(deal);
    setPreviewContent(summary);
    setIsGenerating(false);
    setShowPdfPreview(true);
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 pb-20">
      {/* Cabeçalho do Negócio */}
      <div className="bg-white p-8 rounded-t-3xl border border-gray-100 shadow-sm mb-1">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <select 
                value={deal.stage}
                onChange={(e) => onUpdate({ ...deal, stage: e.target.value })}
                className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                {stages.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              <span className="text-[10px] text-gray-400 font-medium">Entrada: {format(parseISO(deal.createdAt), "dd/MM/yy", { locale: ptBR })}</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{deal.title}</h1>
            <p className="text-xl text-gray-400 font-medium flex items-center gap-2">
              <Building2 size={20} />
              {deal.company}
            </p>
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={handleGenerateProposal}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg shadow-gray-200"
            >
              {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Wand2 size={18} />}
              Gerar Proposta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6 pt-8 border-t border-gray-50">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Valor do Negócio</p>
            <p className="text-xl font-black text-gray-900">{formatCurrency(deal.value)}</p>
          </div>
          <div className="space-y-1 border-l border-gray-50 pl-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Origem do Lead</p>
            <p className="text-sm font-bold text-gray-700">{deal.leadSource || "Manual"}</p>
          </div>
          <div className="space-y-1 border-l border-gray-50 pl-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Último Contato</p>
            <p className="text-sm font-bold text-gray-700">{deal.lastContactDate ? format(parseISO(deal.lastContactDate), "dd/MM/yy") : "Nenhum"}</p>
          </div>
          <div className="space-y-1 border-l border-gray-50 pl-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Responsável</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-200" />
              <p className="text-sm font-bold text-gray-700">Jefferson Jr</p>
            </div>
          </div>
          <div className="space-y-2 border-l border-gray-50 pl-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tags</p>
            <div className="flex flex-wrap gap-1">
              {deal.tags.map((tag: string) => (
                <span key={tag} className="text-[9px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md font-bold border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex bg-white border-x border-b border-gray-100 px-8 sticky top-0 z-10 shadow-sm">
        {[
          { id: "details", label: "Visão Geral", icon: Layout },
          { id: "profile", label: "Perfil & Contatos", icon: Building2 },
          { id: "documents", label: "Documentos", icon: FileText },
          { id: "activity", label: "Histórico", icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 py-5 px-6 border-b-2 transition-all text-sm font-bold",
              activeSubTab === tab.id 
                ? "border-gray-900 text-gray-900" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white p-10 rounded-b-3xl border-x border-b border-gray-100 shadow-sm min-h-[600px]">
        {activeSubTab === "details" && (
          <div className="grid grid-cols-3 gap-16">
            <div className="col-span-2 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                    Checklists de Execução
                    <span className="text-xs font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{deal.checklists?.length || 0}</span>
                  </h3>
                  <button 
                    onClick={addChecklist}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={14} /> Novo Checklist
                  </button>
                </div>
                
                <div className="space-y-6">
                  {deal.checklists?.map((cl: any) => (
                    <div key={cl.id} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-gray-900">{cl.name}</h4>
                        <button onClick={() => addChecklistItem(cl.id)} className="text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase">Adicionar Item</button>
                      </div>
                      <div className="space-y-3">
                        {cl.items.map((item: any, i: number) => (
                          <div 
                            key={i}
                            onClick={() => toggleChecklistItem(cl.id, item.text)}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-sm transition-all"
                          >
                             <div className="flex items-center gap-3">
                               <div className={cn("w-5 h-5 rounded-md border flex items-center justify-center transition-colors", item.checked ? "bg-green-500 border-green-500 text-white" : "border-gray-200")}>
                                 {item.checked && <CheckCircle2 size={12} />}
                               </div>
                               <span className={cn("text-sm font-medium", item.checked ? "text-gray-400 line-through" : "text-gray-700")}>{item.text}</span>
                             </div>
                          </div>
                        ))}
                        {cl.items.length === 0 && <p className="text-xs text-gray-400 italic text-center py-2">Sem itens.</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-black text-gray-900 mb-6">Notas do Negócio</h3>
                <div className="bg-gray-50/30 rounded-2xl p-6 border border-gray-100 mb-8">
                  <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Anote algo importante sobre este negócio..."
                    className="w-full bg-white p-4 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-gray-900/5 transition-all resize-none min-h-[120px] shadow-inner"
                  />
                  <div className="flex justify-end mt-4">
                    <button onClick={() => {
                      if(newNote) {
                        onUpdate({...deal, notes: [{id: Date.now(), text: newNote, author: "Jefferson Jr", date: new Date().toISOString()}, ...(deal.notes || [])]});
                        setNewNote("");
                      }
                    }} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 shadow-md">Salvar Nota</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {deal.notes?.map((note: any) => (
                    <div key={note.id} className="p-5 bg-white border border-gray-50 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-gray-900">{note.author}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{format(parseISO(note.date), "dd MMM, HH:mm", { locale: ptBR })}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-10">
               <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Ações Estratégicas</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => alert("Agendamento aberto!")} className="w-full text-left p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-orange-400" />
                      Agendar Reunião
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full text-left p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-blue-400" />
                      Enviar E-mail
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Próximos Compromissos</h3>
                <div className="space-y-3">
                   {deal.activities?.map((act: any) => (
                     <div key={act.id} className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
                        <p className="text-sm font-black text-orange-700 mb-1">{act.title}</p>
                        <p className="text-[10px] font-bold text-orange-600/70">{format(parseISO(act.date), "eeee, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</p>
                     </div>
                   ))}
                   {deal.activities?.length === 0 && <p className="text-xs text-gray-400 italic text-center py-6">Nenhum agendamento.</p>}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeSubTab === "profile" && (
          <div className="grid grid-cols-3 gap-16">
            <div className="col-span-2 space-y-12">
               <section>
                  <div className="flex items-center gap-8 mb-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 border border-gray-100 shadow-inner">
                      <Building2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight">{deal.profile.name}</h2>
                      <div className="flex gap-3 text-sm font-bold text-gray-400">
                        <span>{deal.profile.industry}</span>
                        <span className="text-gray-200">•</span>
                        <a href={deal.profile.website} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1">
                          {deal.profile.website} <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                     <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sobre a Conta</p>
                        <p className="text-sm text-gray-600 leading-relaxed">Cliente estratégico focado em {deal.profile.industry}. Relacionamento iniciado via {deal.leadSource}.</p>
                     </div>
                     <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Métricas</p>
                        <div className="space-y-3">
                           <div className="flex justify-between text-xs">
                              <span className="text-gray-400 font-bold">Total Gasto</span>
                              <span className="text-gray-900 font-black">R$ 145k</span>
                           </div>
                           <div className="flex justify-between text-xs">
                              <span className="text-gray-400 font-bold">Tempo de Vida</span>
                              <span className="text-gray-900 font-black">2.4 Anos</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>

               <section>
                  <h3 className="text-lg font-black text-gray-900 mb-8">Contatos na Empresa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {deal.profile.contacts?.map((contact: any) => (
                      <div 
                        key={contact.id} 
                        onClick={() => setSelectedPerson(contact)}
                        className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-900/10 hover:shadow-xl hover:shadow-gray-100 transition-all cursor-pointer group"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                               <img src={contact.avatar} alt={contact.name} />
                            </div>
                            <div className="min-w-0">
                               <p className="text-sm font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">{contact.name}</p>
                               <p className="text-xs font-bold text-gray-400">{contact.role}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </section>
            </div>

            {selectedPerson && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-3xl p-8 text-white h-fit sticky top-24 shadow-2xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 p-0.5 border border-white/10">
                    <img src={selectedPerson.avatar} className="rounded-2xl" alt="" />
                  </div>
                  <button onClick={() => setSelectedPerson(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <h4 className="text-2xl font-black mb-1">{selectedPerson.name}</h4>
                <p className="text-sm font-bold text-gray-400 mb-8">{selectedPerson.role} @ {deal.company}</p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">E-mail</p>
                    <p className="text-sm font-bold">{selectedPerson.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Telefone</p>
                    <p className="text-sm font-bold">{selectedPerson.phone}</p>
                  </div>
                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <button className="w-full bg-white text-gray-900 py-3 rounded-xl text-xs font-black hover:bg-gray-100 transition-all">Enviar WhatsApp</button>
                    <button className="w-full bg-white/10 text-white py-3 rounded-xl text-xs font-black hover:bg-white/20 transition-all">Ver no LinkedIn</button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeSubTab === "documents" && (
           <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-black text-gray-900">Arquivo de Documentos</h3>
                 <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-2">
                   <Plus size={14} /> Enviar Arquivo
                 </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {deal.documents?.map((doc: any) => (
                  <div key={doc.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group hover:border-gray-900/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{doc.name}</p>
                        <p className="text-[10px] font-bold text-gray-400">{doc.size} • {format(parseISO(doc.date), "dd/MM/yy")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => deleteDocument(doc.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                      <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"><Download size={16} /></button>
                    </div>
                  </div>
                ))}
                {deal.documents?.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-sm text-gray-400 italic">Nenhum documento anexado.</p>
                  </div>
                )}
              </div>
           </div>
        )}

        {activeSubTab === "activity" && (
           <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-50">
              {[
                { time: "2 horas atrás", user: "Jefferson Jr", action: "Mudou estágio para Negociação", color: "bg-blue-500" },
                { time: "1 dia atrás", user: "Jefferson Jr", action: "Nota adicionada: 'Cliente gostou do demo'", color: "bg-orange-500" },
                { time: "3 dias atrás", user: "Sistema", action: "Lead identificado via LinkedIn", color: "bg-green-500" },
              ].map((log, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className={cn("w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10", log.color)}>
                     <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm text-gray-900 font-black">{log.action}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.user} • {log.time}</p>
                  </div>
                </div>
              ))}
           </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white rounded-[2rem] w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-900 text-white rounded-xl">
                      <FileText size={18} />
                   </div>
                   <h2 className="text-sm font-black text-gray-900">Visualização da Proposta: {deal.title}.pdf</h2>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowPdfPreview(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900">Cancelar</button>
                   <button onClick={() => { alert("Proposta enviada!"); setShowPdfPreview(false); }} className="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-gray-800 flex items-center gap-2">
                      <Wand2 size={14} /> Enviar Proposta
                   </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 p-12">
                 <div className="bg-white mx-auto max-w-[800px] min-h-[1000px] shadow-2xl p-20 font-serif">
                    <div className="flex justify-between items-start mb-20">
                       <h1 className="text-3xl font-bold tracking-tighter">Funnel.io</h1>
                       <div className="text-right text-xs text-gray-400 uppercase font-sans font-bold">
                          <p>Data: <span suppressHydrationWarning>{format(new Date(), "dd/MM/yyyy")}</span></p>
                          <p>Ref: PROP-{deal.id}-2026</p>
                       </div>
                    </div>
                    <div className="mb-12">
                       <p className="text-xs text-gray-400 uppercase font-bold mb-2">Para:</p>
                       <p className="text-xl font-bold">{deal.profile.contacts[0]?.name}</p>
                       <p className="text-sm text-gray-500">{deal.company}</p>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                       {previewContent}
                    </div>
                    <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-end italic text-xs text-gray-400">
                       <p>Esta proposta é válida por 15 dias.</p>
                       <p>Documento gerado eletronicamente.</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

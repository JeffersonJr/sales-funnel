"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Edit2,
  Check,
  Zap,
  Bookmark,
  RefreshCw,
  MoreVertical,
  Video,
  Coffee,
  MapPin
} from "lucide-react";
import { cn, formatCurrency, maskCurrency, parseCurrency } from "@/lib/utils";
import { docGenerator } from "@/services/doc-generator";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import mockDb from "@/data/mock-db.json";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MeetingModal } from "./MeetingModal";
import { ContactModal } from "./ContactModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Avatar } from "@/components/common/Avatar";
import { TagManagementModal } from "./TagManagementModal";
import { useFunnel } from "@/context/FunnelContext";

export function DocumentTab({ 
  deal, 
  onUpdate, 
  onDelete,
  onUnsavedChanges 
}: { 
  deal: any, 
  onUpdate: (deal: any) => void, 
  onDelete?: (id: string) => void,
  onUnsavedChanges?: (isDirty: boolean) => void
}) {
  const { 
    users, 
    setUsers, 
    deals, 
    setDeals, 
    availableTags, 
    setAvailableTags,
    stages,
    templates,
    setTemplates
  } = useFunnel();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onUpdateTemplates = setTemplates;
  const onUpdateTags = setAvailableTags;
  const onUpdateUsers = setUsers;
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"details" | "profile" | "documents" | "activity">("details");
  const [newNote, setNewNote] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState<{ type: string, id: any, data?: any } | null>(null);

  // Edit State
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editForm, setEditForm] = useState({
    title: deal.title,
    company: deal.company,
    value: deal.value,
    leadSource: deal.leadSource,
    owner: deal.owner || "Jefferson Jr"
  });

  useEffect(() => {
    const isDirty = 
      editForm.title !== deal.title || 
      editForm.company !== deal.company || 
      editForm.value !== deal.value || 
      editForm.leadSource !== deal.leadSource ||
      editForm.owner !== (deal.owner || "Jefferson Jr");
    
    onUnsavedChanges?.(isDirty);
  }, [editForm, deal, onUnsavedChanges]);

  const [editingItem, setEditingItem] = useState<{clId: string, index: number} | null>(null);
  const [editingItemText, setEditingItemText] = useState("");
  const [editingChecklistTitleId, setEditingChecklistTitleId] = useState<string | null>(null);

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
    const newId = Math.random().toString(36).substr(2, 9);
    const newCl = {
      id: newId,
      name: "Novo Checklist",
      items: []
    };
    onUpdate({ ...deal, checklists: [...(deal.checklists || []), newCl] });
    setEditingChecklistTitleId(newId);
    toast.success("Checklist adicionado");

    setTimeout(() => {
      document.getElementById(`checklist-${newId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const updateChecklistTitle = (id: string, newName: string) => {
    const updatedChecklists = deal.checklists.map((cl: any) => 
      cl.id === id ? { ...cl, name: newName || "Checklist sem nome" } : cl
    );
    onUpdate({ ...deal, checklists: updatedChecklists });
    setEditingChecklistTitleId(null);
  };

  const deleteChecklist = (id: string) => {
    setShowConfirmDelete({ type: 'checklist', id });
  };

  const saveAsTemplate = (checklist: any) => {
    const templateId = `t${Date.now()}`;
    const newTemplate = {
      id: templateId,
      name: checklist.name,
      checkpoints: checklist.items.map((it: any) => it.text)
    };
    
    onUpdateTemplates([...templates, newTemplate]);
    
    const updatedChecklists = deal.checklists.map((cl: any) => 
      cl.id === checklist.id ? { ...cl, templateId } : cl
    );
    onUpdate({ ...deal, checklists: updatedChecklists });
    
    toast.success("Modelo global criado com sucesso!");
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t: any) => t.id === templateId);
    if (!template) return;
    
    const newCl = {
      id: Math.random().toString(36).substr(2, 9),
      templateId: template.id,
      name: template.name,
      items: template.checkpoints.map((cp: string) => ({ text: cp, checked: false }))
    };
    onUpdate({ ...deal, checklists: [...(deal.checklists || []), newCl] });
    toast.success(`Modelo "${template.name}" aplicado`);

    setTimeout(() => {
      document.getElementById(`checklist-${newCl.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const addChecklistItem = (checklistId: string) => {
    const updatedChecklists = deal.checklists.map((cl: any) => {
      if (cl.id === checklistId) {
        const newItem = { text: "Novo Item", checked: false };
        const newItems = [...cl.items, newItem];
        
        if (cl.templateId) {
          const newTemplates = templates.map((t: any) => 
            t.id === cl.templateId ? { ...t, checkpoints: newItems.map((it: any) => it.text) } : t
          );
          onUpdateTemplates(newTemplates);
        }
        
        return { ...cl, items: newItems };
      }
      return cl;
    });
    onUpdate({ ...deal, checklists: updatedChecklists });
    
    // Set to editing mode for the newly added item
    const cl = updatedChecklists.find((c: any) => c.id === checklistId);
    setEditingItem({ clId: checklistId, index: cl.items.length - 1 });
    setEditingItemText("Novo Item");
  };

  const deleteChecklistItem = (checklistId: string, index: number) => {
    const updatedChecklists = deal.checklists.map((cl: any) => {
      if (cl.id === checklistId) {
        const newItems = cl.items.filter((_: any, i: number) => i !== index);
        if (cl.templateId) {
          const newTemplates = templates.map((t: any) => 
            t.id === cl.templateId ? { ...t, checkpoints: newItems.map((it: any) => it.text) } : t
          );
          onUpdateTemplates(newTemplates);
        }
        return { ...cl, items: newItems };
      }
      return cl;
    });
    onUpdate({ ...deal, checklists: updatedChecklists });
  };

  const updateItemText = (clId: string, index: number, newText: string) => {
    const updatedChecklists = deal.checklists.map((cl: any) => {
      if (cl.id === clId) {
        const newItems = cl.items.map((it: any, i: number) => 
          i === index ? { ...it, text: newText || "Item sem nome" } : it
        );
        
        if (cl.templateId) {
          const newTemplates = templates.map((t: any) => 
            t.id === cl.templateId ? { ...t, checkpoints: newItems.map((it: any) => it.text) } : t
          );
          onUpdateTemplates(newTemplates);
        }
        
        return { ...cl, items: newItems };
      }
      return cl;
    });
    onUpdate({ ...deal, checklists: updatedChecklists });
    setEditingItem(null);
  };

  const handleHeaderSave = () => {
    onUpdate({ 
      ...deal, 
      title: editForm.title, 
      company: editForm.company, 
      value: typeof editForm.value === 'string' ? parseCurrency(editForm.value) : editForm.value,
      leadSource: editForm.leadSource,
      owner: editForm.owner
    });
    setIsEditingHeader(false);
    toast.success("Negócio atualizado");
  };

  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    const summary = await docGenerator.generateDealSummary(deal);
    setPreviewContent(summary);
    setIsGenerating(false);
    setShowPdfPreview(true);
    toast.success("Proposta gerada pela IA");
  };

  const handleScheduleActivity = (meeting: any) => {
    const isEdit = deal.activities?.some((a: any) => a.id === meeting.id);
    let updatedActivities;
    if (isEdit) {
      updatedActivities = deal.activities.map((a: any) => a.id === meeting.id ? meeting : a);
      toast.success(`Atividade "${meeting.title}" atualizada!`);
    } else {
      updatedActivities = [...(deal.activities || []), meeting];
      toast.success(`Atividade "${meeting.title}" agendada!`);
    }
    onUpdate({ ...deal, activities: updatedActivities });
    setEditingActivity(null);
  };

  const deleteActivity = (id: string) => {
    const updatedActivities = deal.activities.filter((a: any) => a.id !== id);
    onUpdate({ ...deal, activities: updatedActivities });
    toast.error("Atividade excluída");
  };

  const toggleActivityStatus = (id: string) => {
    const updatedActivities = deal.activities.map((a: any) => 
      a.id === id ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' } : a
    );
    onUpdate({ ...deal, activities: updatedActivities });
    toast.success("Status da atividade atualizado");
  };

  const handleSaveContact = (contact: any) => {
    const isEdit = deal.profile.contacts?.some((c: any) => c.id === contact.id);
    let updatedContacts;
    if (isEdit) {
      updatedContacts = deal.profile.contacts.map((c: any) => c.id === contact.id ? contact : c);
      toast.success(`Contato "${contact.name}" atualizado!`);
    } else {
      updatedContacts = [...(deal.profile.contacts || []), contact];
      toast.success(`Contato "${contact.name}" adicionado!`);
    }
    onUpdate({
      ...deal,
      profile: {
        ...deal.profile,
        contacts: updatedContacts
      }
    });
    setEditingContact(null);
    setShowContactModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        date: new Date().toISOString()
      };
      onUpdate({ ...deal, documents: [...(deal.documents || []), newDoc] });
      toast.success(`Documento "${file.name}" enviado com sucesso!`);
    }
  };

  const deleteDocument = (id: string) => {
    const updatedDocs = deal.documents.filter((d: any) => d.id !== id);
    onUpdate({ ...deal, documents: updatedDocs });
    toast.error("Documento removido");
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 pb-20">
      <ConfirmModal 
        isOpen={!!showConfirmDelete}
        onClose={() => setShowConfirmDelete(null)}
        onConfirm={() => {
          if (!showConfirmDelete) return;
          if (showConfirmDelete.type === 'activity') deleteActivity(showConfirmDelete.id);
          if (showConfirmDelete.type === 'note') onUpdate({ ...deal, notes: deal.notes.filter((n: any) => n.id !== showConfirmDelete.id) });
          if (showConfirmDelete.type === 'contact') onUpdate({ ...deal, profile: { ...deal.profile, contacts: deal.profile.contacts.filter((c: any) => c.id !== showConfirmDelete.id) } });
          if (showConfirmDelete.type === 'checklist') onUpdate({ ...deal, checklists: deal.checklists.filter((cl: any) => cl.id !== showConfirmDelete.id) });
          setShowConfirmDelete(null);
        }}
        title={`Excluir ${showConfirmDelete?.type === 'contact' ? 'Contato' : showConfirmDelete?.type === 'activity' ? 'Atividade' : showConfirmDelete?.type === 'note' ? 'Nota' : 'Checklist'}`}
        message="Esta ação não pode ser desfeita. Tem certeza?"
      />
      <MeetingModal 
        isOpen={showMeetingModal || !!editingActivity}
        onClose={() => {
          setShowMeetingModal(false);
          setEditingActivity(null);
        }}
        onSchedule={handleScheduleActivity}
        contacts={deal.profile.contacts || []}
        initialData={editingActivity}
      />
      <ContactModal 
        isOpen={showContactModal || !!editingContact}
        onClose={() => {
          setShowContactModal(false);
          setEditingContact(null);
        }}
        onSave={handleSaveContact}
        initialData={editingContact}
      />
      <TagManagementModal 
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        tags={availableTags}
        onUpdateTags={onUpdateTags}
        dealTags={deal.tags || []}
        onUpdateDealTags={(tags) => onUpdate({ ...deal, tags })}
      />
      {/* Cabeçalho do Negócio */}
      <div className="bg-white p-6 md:p-8 rounded-t-3xl border border-gray-100 shadow-sm mb-1 relative group/header">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-3 w-full max-w-2xl">
            <div className="flex items-center gap-3">
              <select 
                value={deal.stage}
                onChange={(e) => {
                  onUpdate({ 
                    ...deal, 
                    stage: e.target.value,
                    activityLogs: [{
                      id: Date.now().toString(),
                      action: `Mudou estágio para: ${stages.find((s: any) => s.id === e.target.value)?.title}`,
                      user: "Jefferson Jr",
                      date: new Date().toISOString()
                    }, ...(deal.activityLogs || [])]
                  });
                  toast.info(`Estágio alterado para: ${stages.find((s: any) => s.id === e.target.value)?.title}`);
                }}
                className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 pr-8 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-blue-100 cursor-pointer appearance-none"
              >
                {stages.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              <span className="text-[10px] text-gray-400 font-medium">Entrada: {format(parseISO(deal.createdAt), "dd/MM/yy", { locale: ptBR })}</span>
            </div>
            
            {isEditingHeader ? (
              <div className="space-y-4 pt-2">
                <input 
                  autoFocus
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="text-4xl font-black text-gray-900 tracking-tight bg-gray-50 p-2 rounded-xl w-full outline-none border-b-2 border-blue-500"
                />
                <input 
                  value={editForm.company}
                  onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                  className="text-xl text-gray-400 font-medium bg-gray-50 p-2 rounded-xl w-full outline-none"
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{deal.title}</h1>
                <p className="text-xl text-gray-400 font-medium flex items-center gap-2">
                  <Building2 size={20} />
                  {deal.company}
                </p>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
             {isEditingHeader ? (
                <button 
                  onClick={handleHeaderSave}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Check size={18} /> Salvar Alterações
                </button>
             ) : (
               <>
                 <button 
                  onClick={() => setIsEditingHeader(true)}
                  className="flex items-center gap-2 bg-white border border-gray-100 text-gray-700 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Edit2 size={18} /> Editar
                </button>
                <button 
                  onClick={handleGenerateProposal}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Wand2 size={18} /> Gerar Proposta
                </button>
                <button 
                  onClick={() => onDelete?.(deal.id)}
                  className="flex items-center gap-2 bg-red-50 text-red-500 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all"
                >
                  <Trash2 size={18} /> Excluir
                </button>
               </>
             )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-8 border-t border-gray-50">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Valor do Negócio</p>
            {isEditingHeader ? (
              <input 
                type="text"
                value={editForm.value}
                onChange={(e) => setEditForm({...editForm, value: maskCurrency(e.target.value)})}
                className="text-xl font-black text-gray-900 bg-gray-50 w-full rounded p-1 outline-none"
              />
            ) : (
              <p className="text-xl font-black text-gray-900">{formatCurrency(deal.value)}</p>
            )}
          </div>
          <div className="space-y-1 border-l border-gray-50 pl-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Origem do Lead</p>
            {isEditingHeader ? (
               <select 
                value={editForm.leadSource}
                onChange={(e) => setEditForm({...editForm, leadSource: e.target.value})}
                className="text-sm font-bold text-gray-700 bg-gray-50 w-full rounded p-1"
               >
                 <option>Manual</option>
                 <option>LinkedIn</option>
                 <option>Website</option>
                 <option>Instagram</option>
               </select>
            ) : (
              <p className="text-sm font-bold text-gray-700">{deal.leadSource || "Manual"}</p>
            )}
          </div>
          <div className="space-y-1 border-l border-gray-50 pl-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Último Contato</p>
            <p className="text-sm font-bold text-gray-700">{deal.lastContactDate ? format(parseISO(deal.lastContactDate), "dd/MM/yy") : "Nenhum"}</p>
          </div>
          <div className="space-y-1 border-l border-gray-50 pl-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Responsável</p>
            <div className="flex items-center gap-2">
              {isEditingHeader ? (
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2">
                   <Avatar name={editForm.owner} size="sm" />
                   <select 
                    value={editForm.owner}
                    onChange={(e) => setEditForm({...editForm, owner: e.target.value})}
                    className="text-sm font-bold text-gray-700 bg-transparent py-2 outline-none"
                   >
                     {users.map((u: any) => (
                       <option key={u.id} value={u.name}>{u.name}</option>
                     ))}
                   </select>
                </div>
              ) : (
                <>
                  <Avatar name={deal.owner || "Jefferson Jr"} size="sm" />
                  <p className="text-sm font-bold text-gray-700">{deal.owner || "Jefferson Jr"}</p>
                </>
              )}
            </div>
          </div>
          <div className="space-y-2 border-l border-gray-50 pl-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tags</p>
              <button onClick={() => setShowTagModal(true)} className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                <Edit2 size={10} /> Editar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(!deal.tags || deal.tags.length === 0) && (
                <span className="text-[10px] text-gray-400 font-medium italic">Nenhuma tag</span>
              )}
              {deal.tags?.map((tagName: string) => {
                const tagObj = availableTags.find((t: any) => t.name === tagName);
                return (
                  <span 
                    key={tagName} 
                    style={{ backgroundColor: tagObj?.color || "#111827" }}
                    className="px-2.5 py-1 text-white rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm"
                  >
                    {tagName}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex bg-white border-x border-b border-gray-100 px-4 md:px-8 sticky top-0 z-10 shadow-sm overflow-x-auto scrollbar-hide">
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
              "flex items-center gap-2 py-5 px-4 md:px-6 border-b-2 transition-all text-sm font-bold whitespace-nowrap",
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
      <div className="bg-white p-6 md:p-10 rounded-b-3xl border-x border-b border-gray-100 shadow-sm min-h-[600px]">
        {activeSubTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
            <div className="col-span-1 lg:col-span-2 space-y-8 md:space-y-12">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                    Checklists de Execução
                  </h3>
                  <div className="flex gap-2">
                    <select 
                      onChange={(e) => applyTemplate(e.target.value)}
                      className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-gray-200 outline-none"
                    >
                      <option key="default-template" value="">Aplicar Modelo...</option>
                      {templates.map((t: any, idx: number) => (
                        <option key={t.id || `temp-${idx}`} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <button 
                      onClick={addChecklist}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={14} /> Novo Checklist
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {deal.checklists?.map((cl: any) => (
                    <div key={cl.id} id={`checklist-${cl.id}`} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 group/cl">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          {editingChecklistTitleId === cl.id ? (
                            <input 
                              autoFocus
                              defaultValue={cl.name}
                              onBlur={(e) => updateChecklistTitle(cl.id, e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && updateChecklistTitle(cl.id, (e.target as HTMLInputElement).value)}
                              className="text-sm font-black text-gray-900 bg-transparent border-b border-blue-500 outline-none"
                            />
                          ) : (
                            <h4 
                              onClick={() => setEditingChecklistTitleId(cl.id)}
                              className="text-sm font-bold text-gray-900 flex items-center gap-2 cursor-text hover:text-blue-600 transition-colors"
                            >
                               {cl.name}
                               {cl.templateId && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-black"><RefreshCw size={8} /> GLOBAL</span>}
                            </h4>
                          )}
                          {!cl.templateId && (
                             <button 
                              onClick={() => saveAsTemplate(cl)}
                              className="p-1 text-gray-300 hover:text-orange-500 transition-colors opacity-0 group-hover/cl:opacity-100"
                              title="Transformar em Modelo Global"
                            >
                              <Bookmark size={14} />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover/cl:opacity-100 transition-all">
                          <button onClick={() => addChecklistItem(cl.id)} className="text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase">Adicionar Item</button>
                          <button onClick={() => deleteChecklist(cl.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {cl.items.map((item: any, i: number) => (
                          <div 
                            key={i}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 group/item hover:shadow-sm transition-all"
                          >
                             <div className="flex items-center gap-3 flex-1">
                               <div 
                                 onClick={() => toggleChecklistItem(cl.id, item.text)}
                                 className={cn("w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer", item.checked ? "bg-green-500 border-green-500 text-white" : "border-gray-200")}
                               >
                                 {item.checked && <CheckCircle2 size={12} />}
                               </div>
                               {editingItem?.clId === cl.id && editingItem?.index === i ? (
                                  <input 
                                    autoFocus
                                    value={editingItemText}
                                    onChange={(e) => setEditingItemText(e.target.value)}
                                    onBlur={(e) => updateItemText(cl.id, i, e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && updateItemText(cl.id, i, (e.target as HTMLInputElement).value)}
                                    className="text-sm font-medium w-full bg-blue-50/50 p-1 rounded-lg outline-none border border-blue-100"
                                  />
                               ) : (
                                  <span 
                                    onClick={() => {
                                      setEditingItem({clId: cl.id, index: i});
                                      setEditingItemText(item.text);
                                    }}
                                    className={cn("text-sm font-medium cursor-text flex-1", item.checked ? "text-gray-400 line-through" : "text-gray-700")}
                                  >
                                    {item.text}
                                  </span>
                               )}
                             </div>
                             <div className="flex items-center gap-2 opacity-0 group-item:opacity-100 transition-all">
                                {cl.templateId && <div className="text-[9px] font-black text-blue-300 mr-2">EDITANDO GLOBAL</div>}
                                <button onClick={() => deleteChecklistItem(cl.id, i)} className="text-gray-200 hover:text-red-500"><X size={14} /></button>
                             </div>
                          </div>
                        ))}
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
                        const log = {
                          id: Date.now().toString(),
                          action: "Adicionou uma nova nota",
                          user: "Jefferson Jr",
                          date: new Date().toISOString()
                        };
                        onUpdate({
                          ...deal, 
                          notes: [{id: Date.now(), text: newNote, author: "Jefferson Jr", date: new Date().toISOString()}, ...(deal.notes || [])],
                          activityLogs: [log, ...(deal.activityLogs || [])]
                        });
                        setNewNote("");
                        toast.success("Nota salva");
                      }
                    }} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 shadow-md">Salvar Nota</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {deal.notes?.map((note: any) => (
                    <div key={note.id} className="p-5 bg-white border border-gray-50 rounded-2xl shadow-sm group/note relative">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900">{note.author}</span>
                          {note.edited && <span className="text-[9px] text-gray-400 font-bold uppercase italic">(editada)</span>}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-gray-400 font-medium">{format(parseISO(note.date), "dd MMM, HH:mm", { locale: ptBR })}</span>
                          <div className="flex gap-2 opacity-0 group-hover/note:opacity-100 transition-all">
                            <button 
                              onClick={() => {
                                setEditingNote(note);
                                setEditingNoteText(note.text);
                              }}
                              className="text-gray-300 hover:text-blue-500"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button 
                              onClick={() => {
                                setShowConfirmDelete({ type: 'note', id: note.id });
                              }}
                              className="text-gray-300 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {editingNote?.id === note.id ? (
                        <div className="space-y-3">
                          <textarea 
                            value={editingNoteText}
                            onChange={(e) => setEditingNoteText(e.target.value)}
                            className="w-full bg-gray-50 p-3 rounded-xl border border-blue-100 text-sm outline-none resize-none min-h-[80px]"
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingNote(null)} className="text-[10px] font-bold text-gray-400">Cancelar</button>
                            <button 
                              onClick={() => {
                                onUpdate({
                                  ...deal,
                                  notes: deal.notes.map((n: any) => n.id === note.id ? { ...n, text: editingNoteText, edited: true } : n)
                                });
                                setEditingNote(null);
                                toast.success("Nota atualizada");
                              }}
                              className="text-[10px] font-bold text-blue-600"
                            >
                              Atualizar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 leading-relaxed">{note.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-10">
               <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Ações Estratégicas</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => setShowMeetingModal(true)} 
                    className="w-full text-left p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-orange-400" />
                      Agendar Atividade
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => toast.info("Interface de e-mail em desenvolvimento")} className="w-full text-left p-4 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-between group">
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
                <div className="space-y-4">
                    {deal.activities?.map((act: any) => (
                      <div key={act.id} className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all shadow-sm group/act">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                             <div className={cn("p-1.5 rounded-lg text-gray-400", act.isImportant ? "bg-red-50 text-red-500" : "bg-gray-50")}>
                                {act.type === 'online' && <Video size={14} />}
                                {act.type === 'cafe' && <Coffee size={14} />}
                                {act.type === 'presencial' && <MapPin size={14} />}
                             </div>
                             {act.isImportant && <span className="text-[9px] font-black uppercase text-red-500">Urgente</span>}
                           </div>
                           <div className="flex items-center gap-2">
                             <span className={cn(
                               "text-[9px] font-black uppercase px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity",
                               act.status === 'completed' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"
                             )}
                             onClick={() => toggleActivityStatus(act.id)}
                             >
                               {act.status === 'completed' ? 'Realizada' : 'Pendente'}
                             </span>
                             <div className="flex gap-1 opacity-0 group-hover/act:opacity-100 transition-all">
                                <button 
                                  onClick={() => toggleActivityStatus(act.id)} 
                                  className={cn("p-1 transition-all", act.status === 'completed' ? "text-green-500" : "text-gray-300 hover:text-green-500")}
                                  title={act.status === 'completed' ? "Desmarcar como realizada" : "Marcar como realizada"}
                                >
                                  <CheckCircle2 size={12} />
                                </button>
                                <button onClick={() => setEditingActivity(act)} className="p-1 text-gray-300 hover:text-blue-500"><Edit2 size={12} /></button>
                                <button onClick={() => setShowConfirmDelete({ type: 'activity', id: act.id })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 size={12} /></button>
                             </div>
                           </div>
                        </div>
                        <p className="text-sm font-black text-gray-900 mb-1">{act.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                           <Clock size={10} />
                           {format(parseISO(act.date), "eeee, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                        {act.description && (
                          <p className="text-[10px] text-gray-500 mt-3 bg-gray-50 p-2 rounded-lg italic">"{act.description}"</p>
                        )}
                      </div>
                    ))}
                   {deal.activities?.length === 0 && <p className="text-xs text-gray-400 italic text-center py-6">Nenhum agendamento.</p>}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeSubTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="col-span-1 lg:col-span-2 space-y-12">
               <section>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 border border-gray-100 shadow-inner">
                      <Building2 size={48} />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight">{deal.profile.name}</h2>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-bold text-gray-400">
                        <span>{deal.profile.industry}</span>
                        <span className="text-gray-200">•</span>
                        <a href={deal.profile.website} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1">
                          {deal.profile.website} <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-gray-900">Contatos na Empresa</h3>
                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    >
                      <Plus size={14} /> Novo Contato
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deal.profile.contacts?.map((contact: any) => (
                      <div 
                        key={contact.id} 
                        className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-900/10 hover:shadow-xl hover:shadow-gray-100 transition-all cursor-pointer group flex justify-between items-center"
                      >
                         <div className="flex items-center gap-4 flex-1" onClick={() => setSelectedPerson(contact)}>
                            <Avatar name={contact.name} size="lg" />
                            <div className="min-w-0">
                               <p className="text-sm font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">{contact.name}</p>
                               <p className="text-xs font-bold text-gray-400">{contact.role}</p>
                            </div>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingContact(contact);
                              }}
                              className="p-2 text-gray-300 hover:text-blue-500"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirmDelete({ type: 'contact', id: contact.id });
                              }}
                              className="p-2 text-gray-300 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
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
                  <Avatar name={selectedPerson.name} size="xl" className="shadow-lg border-4 border-white/10" />
                  <button onClick={() => setSelectedPerson(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <h4 className="text-2xl font-black mb-1">{selectedPerson.name}</h4>
                <p className="text-sm font-bold text-gray-400 mb-8">{selectedPerson.role} @ {deal.company}</p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">E-mails</p>
                    {(selectedPerson.emails?.length > 0 ? selectedPerson.emails : [selectedPerson.email]).map((e: string, i: number) => e && (
                      <div key={i} className="flex items-center justify-between group/email">
                        <p className="text-sm font-bold flex items-center gap-2">
                           <Mail size={12} className="text-gray-600" /> {e}
                        </p>
                        <button 
                          onClick={() => window.location.href = `mailto:${e}?subject=Sobre o projeto ${deal.title}`}
                          className="text-[10px] text-blue-400 opacity-0 group-hover/email:opacity-100 transition-opacity"
                        >
                          Enviar
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Telefones</p>
                    {(selectedPerson.phones?.length > 0 ? selectedPerson.phones : [selectedPerson.phone]).map((p: string, i: number) => p && (
                      <div key={i} className="flex items-center justify-between group/phone">
                        <p className="text-sm font-bold flex items-center gap-2">
                           <Phone size={12} className="text-gray-600" /> {p}
                        </p>
                        <button 
                          onClick={() => {
                            const message = encodeURIComponent(`Olá ${selectedPerson.name}, aqui é o Jefferson Jr. Gostaria de falar sobre o projeto ${deal.title}.`);
                            const phoneClean = p.replace(/\D/g, '');
                            window.open(`https://wa.me/${phoneClean}?text=${message}`, '_blank');
                          }}
                          className="text-[10px] text-green-400 opacity-0 group-hover/phone:opacity-100 transition-opacity"
                        >
                          WhatsApp
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <button 
                      onClick={() => {
                        const message = encodeURIComponent(`Olá ${selectedPerson.name}, aqui é o Jefferson Jr. Gostaria de falar sobre o projeto ${deal.title}.`);
                        const phone = selectedPerson.phone.replace(/\D/g, '');
                        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                        
                        onUpdate({
                          ...deal,
                          activityLogs: [{
                            id: Date.now().toString(),
                            action: `Enviou WhatsApp para ${selectedPerson.name}`,
                            user: "Jefferson Jr",
                            date: new Date().toISOString()
                          }, ...(deal.activityLogs || [])]
                        });
                      }} 
                      className="w-full bg-white text-gray-900 py-3 rounded-xl text-xs font-black hover:bg-gray-100 transition-all"
                    >
                      Enviar WhatsApp
                    </button>
                    <button 
                      onClick={() => {
                        window.location.href = `mailto:${selectedPerson.email}?subject=Sobre o projeto ${deal.title}`;
                        onUpdate({
                          ...deal,
                          activityLogs: [{
                            id: Date.now().toString(),
                            action: `Enviou E-mail para ${selectedPerson.name}`,
                            user: "Jefferson Jr",
                            date: new Date().toISOString()
                          }, ...(deal.activityLogs || [])]
                        });
                      }}
                      className="w-full bg-white/10 text-white py-3 rounded-xl text-xs font-black hover:bg-white/20 transition-all"
                    >
                      Enviar E-mail
                    </button>
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
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
                  >
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
              </div>
           </div>
        )}

        {activeSubTab === "activity" && (
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {deal.activityLogs?.map((log: any, i: number) => {
                const isStatusChange = log.action.includes("estágio");
                const isNote = log.action.includes("nota");
                const isDoc = log.action.includes("Documento");
                const isEmail = log.action.includes("E-mail");
                const isWhatsApp = log.action.includes("WhatsApp");
                
                return (
                  <div key={log.id} className="flex gap-6 relative group">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl border-4 border-white shadow-md flex items-center justify-center flex-shrink-0 z-10 transition-transform group-hover:scale-110",
                      i === 0 ? "bg-gray-900 text-white" : "bg-white text-gray-400"
                    )}>
                       {isStatusChange && <RefreshCw size={14} />}
                       {isNote && <MessageSquare size={14} />}
                       {isDoc && <FileText size={14} />}
                       {isEmail && <Mail size={14} />}
                       {isWhatsApp && <Zap size={14} />}
                       {!isStatusChange && !isNote && !isDoc && !isEmail && !isWhatsApp && <Clock size={14} />}
                    </div>
                    <div className="flex-1 bg-gray-50/50 p-5 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-gray-100 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-900 font-black leading-tight">{log.action}</p>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap ml-4">
                          {format(parseISO(log.date), "dd MMM, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                         <div className="w-4 h-4 rounded-full bg-gray-200" />
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                           {log.user}
                         </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!deal.activityLogs || deal.activityLogs.length === 0) && (
                <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-100">
                   <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                     <History size={32} className="text-gray-200" />
                   </div>
                   <p className="text-sm font-black text-gray-900 mb-1">Nenhuma atividade</p>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">O histórico do negócio aparecerá aqui</p>
                </div>
              )}
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
                   <button onClick={() => { toast.success("Proposta enviada!"); setShowPdfPreview(false); }} className="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-gray-800 flex items-center gap-2">
                      <Wand2 size={14} /> Enviar Proposta
                   </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 p-12">
                 <div className="bg-white mx-auto max-w-[800px] min-h-[1000px] shadow-2xl p-20 font-serif">
                    <div className="flex justify-between items-start mb-20">
                       <h1 className="text-3xl font-bold tracking-tighter">Leads.site</h1>
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

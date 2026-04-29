"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Globe, MapPin, Save, FileText, Info, Hash } from "lucide-react";
import { maskCEP } from "@/lib/utils";
import { useFunnel } from "@/context/FunnelContext";
import { UserPlus, UserMinus, Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: any) => void;
  initialData?: any;
}

export function CompanyModal({ isOpen, onClose, onSave, initialData }: CompanyModalProps) {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    website: "",
    cep: "",
    address: "",
    description: "",
  });

  const { leads, setLeads } = useFunnel();
  
  const companyLeads = leads.filter((l: any) => l.companyId === initialData?.id || (l.company === initialData?.name && initialData?.name));

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showQuickAddLead, setShowQuickAddLead] = useState(false);
  const [editingQuickLeadId, setEditingQuickLeadId] = useState<string | null>(null);
  const [quickLead, setQuickLead] = useState({ name: "", role: "", email: "" });
  
  useEffect(() => {
    if (initialData) {
      setSelectedLeads(companyLeads.map((l: any) => l.id));
      setForm({
        name: initialData.name || "",
        industry: initialData.industry || "",
        website: initialData.website || "",
        cep: initialData.cep || "",
        address: initialData.address || "",
        description: initialData.description || "",
      });
    } else {
      setForm({ name: "", industry: "", website: "", cep: "", address: "", description: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-black text-gray-900">{initialData ? "Editar Empresa" : "Nova Empresa"}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dados da organização</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome da Empresa</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="Ex: TechCorp Solutions"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Setor</label>
                  <div className="relative">
                    <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.industry}
                      onChange={(e) => setForm({...form, industry: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="Ex: Tecnologia"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.website}
                      onChange={(e) => setForm({...form, website: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">CEP</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.cep}
                      onChange={(e) => setForm({...form, cep: maskCEP(e.target.value)})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Endereço</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.address}
                      onChange={(e) => setForm({...form, address: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="Cidade, Estado, País"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contatos Associados</label>
                  </div>
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-hide py-2">
                    {leads.filter((l: any) => selectedLeads.includes(l.id)).map((lead: any) => (
                      <div key={lead.id} className="group relative bg-white border border-gray-100 rounded-[1.5rem] p-4 flex items-center justify-between hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center text-xs font-black shadow-inner">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-tight">{lead.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{lead.role || "Contato"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => {
                              setQuickLead({ name: lead.name, role: lead.role, email: lead.email });
                              setEditingQuickLeadId(lead.id);
                              setShowQuickAddLead(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => setSelectedLeads(selectedLeads.filter(id => id !== lead.id))}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <UserMinus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {selectedLeads.length === 0 && (
                      <div className="py-8 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-[2rem]">
                        <p className="text-xs font-bold text-gray-400">Nenhum contato vinculado ainda</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <select 
                      onChange={(e) => {
                        if (e.target.value && !selectedLeads.includes(e.target.value)) {
                          setSelectedLeads([...selectedLeads, e.target.value]);
                        }
                        e.target.value = "";
                      }}
                      className="flex-1 bg-gray-50 border border-dashed border-gray-200 rounded-xl py-3 px-4 text-xs font-bold text-gray-500 outline-none hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <option value="">+ Associar Contato Existente</option>
                      {leads.filter((l: any) => !selectedLeads.includes(l.id)).map((l: any) => (
                        <option key={l.id} value={l.id}>{l.name} ({l.company || 'Sem empresa'})</option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={() => setShowQuickAddLead(!showQuickAddLead)}
                      className="px-4 bg-blue-50 text-blue-600 rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-blue-100 transition-all"
                    >
                      <UserPlus size={16} /> {showQuickAddLead ? "Cancelar" : "Novo"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showQuickAddLead && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        className="mt-4 p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-md border border-blue-100 rounded-[2rem] space-y-4 overflow-hidden shadow-inner"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            {editingQuickLeadId ? "Editando Contato" : "Novo Contato Rápido"}
                          </p>
                          {editingQuickLeadId && (
                            <button 
                              onClick={() => {
                                setShowQuickAddLead(false);
                                setEditingQuickLeadId(null);
                                setQuickLead({ name: "", role: "", email: "" });
                              }}
                              className="text-[10px] font-black text-gray-400 hover:text-gray-600"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2 space-y-1.5">
                            <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">Nome Completo</label>
                            <input 
                              value={quickLead.name}
                              onChange={(e) => setQuickLead({...quickLead, name: e.target.value})}
                              placeholder="Ex: João Silva"
                              className="w-full bg-white border border-blue-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">Cargo</label>
                            <input 
                              value={quickLead.role}
                              onChange={(e) => setQuickLead({...quickLead, role: e.target.value})}
                              placeholder="Ex: Diretor"
                              className="w-full bg-white border border-blue-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-1">E-mail</label>
                            <input 
                              value={quickLead.email}
                              onChange={(e) => setQuickLead({...quickLead, email: e.target.value})}
                              placeholder="joao@email.com"
                              className="w-full bg-white border border-blue-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (!quickLead.name) return toast.error("Nome é obrigatório");
                            
                            if (editingQuickLeadId) {
                              setLeads(leads.map((l: any) => l.id === editingQuickLeadId ? { ...l, ...quickLead } : l));
                              toast.success("Contato atualizado!");
                              setEditingQuickLeadId(null);
                            } else {
                              const newLeadId = `l${Date.now()}`;
                              const newLead = {
                                id: newLeadId,
                                ...quickLead,
                                company: form.name,
                                companyId: initialData?.id || "temp",
                                createdAt: new Date().toISOString(),
                                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${quickLead.name}`
                              };
                              setLeads([...leads, newLead]);
                              setSelectedLeads([...selectedLeads, newLeadId]);
                              toast.success("Contato criado e vinculado!");
                            }
                            
                            setQuickLead({ name: "", role: "", email: "" });
                            setShowQuickAddLead(false);
                          }}
                          className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                        >
                          {editingQuickLeadId ? "Salvar Alterações" : "Adicionar à Empresa"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descrição</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-gray-300" size={18} />
                    <textarea 
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all min-h-[80px] resize-none"
                      placeholder="Breve descrição da empresa..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => onSave({ ...form, leadIds: selectedLeads })}
                className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
              >
                <Save size={18} /> {initialData ? "Salvar Alterações" : "Criar Empresa"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

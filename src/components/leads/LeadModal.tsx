"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Briefcase, Building2, Save, Edit2 } from "lucide-react";
import { maskPhone } from "@/lib/utils";
import { useFunnel } from "@/context/FunnelContext";
import { toast } from "sonner";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: any) => void;
  initialData?: any;
}

export function LeadModal({ isOpen, onClose, onSave, initialData }: LeadModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    company: "",
    companyId: "",
  });

  const { companies, setCompanies } = useFunnel();
  const [showQuickAddCompany, setShowQuickAddCompany] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [quickCompany, setQuickCompany] = useState({ name: "", industry: "", website: "" });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: "", email: "", phone: "", role: "", company: "", companyId: "" });
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
              <h2 className="text-xl font-black text-gray-900">{initialData ? "Editar Contato" : "Novo Contato"}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gerencie informações do lead</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="joao@empresa.com"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: maskPhone(e.target.value)})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.role}
                      onChange={(e) => setForm({...form, role: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="Ex: Diretor Comercial"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Empresa</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <div className="flex gap-1.5">
                      <select 
                        value={form.companyId || ""}
                        onChange={(e) => {
                          const selected = companies.find((c: any) => c.id === e.target.value);
                          setForm({
                            ...form, 
                            companyId: e.target.value,
                            company: selected ? selected.name : ""
                          });
                          if (e.target.value === "new") {
                            setEditingCompanyId(null);
                            setQuickCompany({ name: "", industry: "", website: "" });
                            setShowQuickAddCompany(true);
                          } else {
                            setShowQuickAddCompany(false);
                          }
                        }}
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-9 pr-2 text-[13px] font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all appearance-none"
                      >
                        <option value="">Nenhuma / Outra</option>
                        {companies.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                        <option value="new">+ Nova Empresa</option>
                      </select>
                      {form.companyId && form.companyId !== "new" && (
                        <button 
                          type="button"
                          onClick={() => {
                            const comp = companies.find((c: any) => c.id === form.companyId);
                            if (comp) {
                              setQuickCompany({ name: comp.name, industry: comp.industry || "", website: comp.website || "" });
                              setEditingCompanyId(comp.id);
                              setShowQuickAddCompany(true);
                            }
                          }}
                          className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showQuickAddCompany && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      className="col-span-2 mt-2 p-6 bg-gradient-to-br from-purple-50/80 to-blue-50/80 backdrop-blur-md border border-purple-100 rounded-[2rem] space-y-4 overflow-hidden shadow-inner"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                          {editingCompanyId ? "Editando Empresa" : "Novo Cadastro de Empresa"}
                        </p>
                        <button 
                          onClick={() => setShowQuickAddCompany(false)}
                          className="text-[10px] font-black text-gray-400 hover:text-gray-600"
                        >
                          Fechar
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                          <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">Nome da Empresa</label>
                          <input 
                            value={quickCompany.name}
                            onChange={(e) => setQuickCompany({...quickCompany, name: e.target.value})}
                            placeholder="Ex: TechCorp"
                            className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">Indústria</label>
                          <input 
                            value={quickCompany.industry}
                            onChange={(e) => setQuickCompany({...quickCompany, industry: e.target.value})}
                            placeholder="Ex: SaaS"
                            className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">Website</label>
                          <input 
                            value={quickCompany.website}
                            onChange={(e) => setQuickCompany({...quickCompany, website: e.target.value})}
                            placeholder="Ex: techcorp.com"
                            className="w-full bg-white border border-purple-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          if (!quickCompany.name) return;
                          
                          if (editingCompanyId) {
                            setCompanies(companies.map((c: any) => c.id === editingCompanyId ? { ...c, ...quickCompany } : c));
                            setForm({ ...form, company: quickCompany.name });
                            toast.success("Empresa atualizada!");
                          } else {
                            const newCompId = `c${Date.now()}`;
                            const newComp = {
                              id: newCompId,
                              ...quickCompany,
                              createdAt: new Date().toISOString()
                            };
                            setCompanies([...companies, newComp]);
                            setForm({ ...form, companyId: newCompId, company: quickCompany.name });
                            toast.success("Empresa criada!");
                          }
                          
                          setShowQuickAddCompany(false);
                          setQuickCompany({ name: "", industry: "", website: "" });
                          setEditingCompanyId(null);
                        }}
                        className="w-full bg-purple-600 text-white py-4 rounded-2xl text-xs font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95"
                      >
                        {editingCompanyId ? "Salvar Alterações" : "Salvar e Vincular"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(!form.companyId && !showQuickAddCompany) && (
                  <div className="col-span-2">
                    <input 
                      value={form.company}
                      onChange={(e) => setForm({...form, company: e.target.value})}
                      className="w-full mt-2 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold outline-none"
                      placeholder="Ou digite o nome da empresa"
                    />
                  </div>
                )}
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
                onClick={() => onSave(form)}
                className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
              >
                <Save size={18} /> {initialData ? "Salvar Alterações" : "Criar Contato"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

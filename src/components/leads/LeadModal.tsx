"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Briefcase, Building2, Save } from "lucide-react";

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
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: "", email: "", phone: "", role: "", company: "" });
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
              <div className="grid grid-cols-2 gap-4">
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
                      onChange={(e) => setForm({...form, phone: e.target.value})}
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
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      value={form.company}
                      onChange={(e) => setForm({...form, company: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                      placeholder="Nome da empresa"
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

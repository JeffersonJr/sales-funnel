"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Globe, MapPin, Save, FileText, Info, Hash } from "lucide-react";
import { maskCEP } from "@/lib/utils";

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

  useEffect(() => {
    if (initialData) {
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
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descrição</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-gray-300" size={18} />
                    <textarea 
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all min-h-[100px] resize-none"
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
                onClick={() => onSave(form)}
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

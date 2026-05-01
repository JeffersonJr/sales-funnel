"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Briefcase, Mail, Phone, Plus, Trash2, Check } from "lucide-react";
import { cn, maskPhone } from "@/lib/utils";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: any) => void;
  initialData?: any;
}

export function ContactModal({ isOpen, onClose, onSave, initialData }: ContactModalProps) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    emails: [""] as string[],
    phones: [""] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        role: initialData.role || "",
        emails: Array.isArray(initialData.emails) ? initialData.emails : [initialData.email || ""],
        phones: Array.isArray(initialData.phones) ? initialData.phones : [initialData.phone || ""],
      });
    } else {
      setForm({ name: "", role: "", emails: [""], phones: [""] });
    }
  }, [initialData, isOpen]);

  const handleAddField = (type: 'emails' | 'phones') => {
    if (form[type].length < 3) {
      setForm({ ...form, [type]: [...form[type], ""] });
    }
  };

  const handleRemoveField = (type: 'emails' | 'phones', index: number) => {
    if (form[type].length > 1) {
      const newFields = form[type].filter((_, i) => i !== index);
      setForm({ ...form, [type]: newFields });
    } else {
      setForm({ ...form, [type]: [""] });
    }
  };

  const handleFieldChange = (type: 'emails' | 'phones', index: number, value: string) => {
    const newFields = [...form[type]];
    if (type === 'phones') {
      value = maskPhone(value);
    }
    newFields[index] = value;
    setForm({ ...form, [type]: newFields });
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSave = () => {
    if (!form.name) return;
    
    onSave({
      id: initialData?.id || Date.now().toString(),
      name: form.name,
      role: form.role,
      emails: form.emails.filter(e => e.trim()),
      phones: form.phones.filter(p => p.trim()),
      // Compatibility with old format
      email: form.emails[0] || "",
      phone: form.phones[0] || "",
      initials: getInitials(form.name)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col border border-border"
        >
          <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
            <div>
              <h2 className="text-xl font-black text-foreground">{initialData ? "Editar Contato" : "Novo Contato"}</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Detalhes do representante</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-10 space-y-8 flex-1 overflow-auto max-h-[70vh]">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                  <User size={12} /> Nome Completo
                </label>
                <input 
                  autoFocus
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Nome do contato"
                  className="w-full p-4 rounded-2xl border border-border bg-muted/50 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Briefcase size={12} /> Cargo / Função
                </label>
                <input 
                  type="text" 
                  value={form.role}
                  onChange={(e) => setForm({...form, role: e.target.value})}
                  placeholder="Ex: Diretor Comercial, Gerente de TI"
                  className="w-full p-4 rounded-2xl border border-border bg-muted/50 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                />
              </div>

              {/* Emails Section */}
              <div className="col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} /> E-mails (Máx. 3)
                  </label>
                  {form.emails.length < 3 && (
                    <button 
                      onClick={() => handleAddField('emails')}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                      <Plus size={10} /> Adicionar
                    </button>
                  )}
                </div>
                {form.emails.map((email, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => handleFieldChange('emails', idx, e.target.value)}
                      placeholder="email@exemplo.com"
                      className="flex-1 p-4 rounded-2xl border border-border bg-muted/50 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    />
                    {form.emails.length > 1 && (
                      <button onClick={() => handleRemoveField('emails', idx)} className="p-4 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Phones Section */}
              <div className="col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Phone size={12} /> Telefones (Máx. 3)
                  </label>
                  {form.phones.length < 3 && (
                    <button 
                      onClick={() => handleAddField('phones')}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                      <Plus size={10} /> Adicionar
                    </button>
                  )}
                </div>
                {form.phones.map((phone, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => handleFieldChange('phones', idx, e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="flex-1 p-4 rounded-2xl border border-border bg-muted/50 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    />
                    {form.phones.length > 1 && (
                      <button onClick={() => handleRemoveField('phones', idx)} className="p-4 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-muted/20 border-t border-border flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={!form.name}
              className="flex-[2] bg-foreground text-background py-4 rounded-2xl text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-30"
            >
              <Check size={18} /> {initialData ? "Salvar Alterações" : "Criar Contato"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

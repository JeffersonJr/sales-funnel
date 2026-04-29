"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Video, Coffee, MapPin, Users, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (meeting: any) => void;
  contacts: any[];
}

export function MeetingModal({ isOpen, onClose, onSchedule, contacts }: MeetingModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    type: "online",
    description: "",
    participants: [] as string[]
  });

  const types = [
    { id: "online", label: "Reunião Online", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "cafe", label: "Café / Almoço", icon: Coffee, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "presencial", label: "Presencial", icon: MapPin, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const handleSchedule = () => {
    if (!form.title || !form.date || !form.time) return;
    onSchedule({
      id: Date.now().toString(),
      title: form.title,
      date: `${form.date}T${form.time}:00Z`,
      type: form.type,
      participants: form.participants,
      description: form.description,
      status: "pending"
    });
    onClose();
    setStep(1);
    setForm({ title: "", date: "", time: "", type: "online", description: "", participants: [] });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-gray-900">Agendar Atividade</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Passo {step} de 2</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl text-gray-300 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-10 flex-1 overflow-auto max-h-[70vh]">
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">O que será feito?</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Ex: Demo da plataforma, Alinhamento de proposta..."
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tipo de Atividade</label>
                  <div className="grid grid-cols-3 gap-3">
                    {types.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setForm({...form, type: t.id})}
                        className={cn(
                          "p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all",
                          form.type === t.id 
                            ? "border-gray-900 bg-gray-900 text-white shadow-xl shadow-gray-200" 
                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                        )}
                      >
                        <t.icon size={24} className={cn(form.type === t.id ? "text-white" : t.color)} />
                        <span className="text-[10px] font-black uppercase tracking-tight">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Calendar size={12} /> Data</label>
                    <input 
                      type="date" 
                      value={form.date}
                      onChange={(e) => setForm({...form, date: e.target.value})}
                      className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Clock size={12} /> Horário</label>
                    <input 
                      type="time" 
                      value={form.time}
                      onChange={(e) => setForm({...form, time: e.target.value})}
                      className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Users size={12} /> Participantes</label>
                  <div className="grid grid-cols-1 gap-2">
                    {contacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          const exists = form.participants.includes(contact.id);
                          setForm({
                            ...form,
                            participants: exists 
                              ? form.participants.filter(id => id !== contact.id) 
                              : [...form.participants, contact.id]
                          });
                        }}
                        className={cn(
                          "p-3 rounded-xl border flex items-center justify-between transition-all",
                          form.participants.includes(contact.id)
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 bg-white">
                              <img src={contact.avatar} alt="" />
                           </div>
                           <span className="text-xs font-bold">{contact.name}</span>
                        </div>
                        {form.participants.includes(contact.id) && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Observações / Agenda</label>
                  <textarea 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Quais os principais tópicos da reunião?"
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none min-h-[100px] resize-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-8 bg-gray-50 flex justify-between items-center">
            <button 
              onClick={() => step === 2 && setStep(1)}
              className={cn("text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors", step === 1 && "invisible")}
            >
              Voltar
            </button>
            <button 
              onClick={() => step === 1 ? setStep(2) : handleSchedule()}
              disabled={step === 1 && (!form.title || !form.date || !form.time)}
              className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-30"
            >
              {step === 1 ? "Próximo Passo" : "Confirmar Agendamento"}
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

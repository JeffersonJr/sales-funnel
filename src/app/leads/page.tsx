"use client";

import React, { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2, 
  ExternalLink,
  Trash2,
  Edit2,
  User,
  Zap,
  X
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn, formatCurrency } from "@/lib/utils";
import { LeadModal } from "@/components/leads/LeadModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function LeadsPage() {
  const { leads, setLeads, deals } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredLeads = leads.filter((l: any) => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (leadData: any) => {
    if (editingLead) {
      setLeads(leads.map((l: any) => l.id === editingLead.id ? { ...l, ...leadData } : l));
      toast.success("Contato atualizado!");
    } else {
      const newLead = {
        ...leadData,
        id: `l${Date.now()}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${leadData.name}`,
        createdAt: new Date().toISOString()
      };
      setLeads([...leads, newLead]);
      toast.success("Contato criado!");
    }
    setShowModal(false);
    setEditingLead(null);
  };

  const handleDelete = () => {
    setLeads(leads.filter((l: any) => l.id !== showDeleteConfirm.id));
    setShowDeleteConfirm(null);
    toast.error("Contato excluído.");
  };

  const getLeadDeals = (leadEmail: string) => {
    // In a real system we'd use IDs, here we'll match by email for simplicity in the mock
    return deals.filter((d: any) => d.profile?.contacts?.some((c: any) => c.email === leadEmail));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Contatos & Leads</h1>
          <p className="text-gray-400 font-medium mt-1 text-sm md:text-base">Gerencie sua base de contatos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gray-900 text-white p-4 md:px-8 md:py-4 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <Plus size={20} /> <span className="hidden md:inline">Novo Contato</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, empresa ou e-mail..."
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 md:flex-none p-3 text-gray-400 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 flex items-center justify-center">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="md:hidden p-4 space-y-4">
          {filteredLeads.map((lead: any) => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedLead(lead)}
              className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-4 active:scale-95 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar name={lead.name} size="md" />
                  <div>
                    <p className="text-sm font-black text-gray-900">{lead.name}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{lead.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setEditingLead(lead); setShowModal(true); }}
                     className="p-2 text-gray-400"
                   >
                     <Edit2 size={16} />
                   </button>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Building2 size={12} /> {lead.company}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Mail size={12} /> {lead.email}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Empresa</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contato</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead: any) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar name={lead.name} size="md" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{lead.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{lead.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                      <Building2 size={14} className="text-gray-300" />
                      {lead.company}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Mail size={12} /> {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Phone size={12} /> {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingLead(lead); setShowModal(true); }}
                        className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(lead); }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel Detail View */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h2 className="text-xl font-black text-gray-900">Perfil do Lead</h2>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-10">
                <div className="flex flex-col items-center text-center mb-12">
                  <Avatar name={selectedLead.name} size="xl" className="w-24 h-24 text-2xl mb-6 shadow-2xl shadow-gray-200" />
                  <h3 className="text-2xl font-black text-gray-900">{selectedLead.name}</h3>
                  <p className="text-blue-600 font-black text-xs uppercase tracking-widest mt-1">{selectedLead.role} @ {selectedLead.company}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-12">
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">E-mail</p>
                    <p className="text-sm font-bold text-gray-700">{selectedLead.email}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Telefone</p>
                    <p className="text-sm font-bold text-gray-700">{selectedLead.phone}</p>
                  </div>
                </div>

                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Negócios Atrelados</h4>
                    <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-1 rounded-lg">
                      {getLeadDeals(selectedLead.email).length} ATIVOS
                    </span>
                  </div>

                  <div className="space-y-3">
                    {getLeadDeals(selectedLead.email).map((deal: any) => (
                      <div key={deal.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                        <div>
                          <p className="text-sm font-black text-gray-900">{deal.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{deal.stage}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{formatCurrency(deal.value)}</span>
                          </div>
                        </div>
                        <button className="p-2 text-gray-300 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    ))}
                    {getLeadDeals(selectedLead.email).length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-gray-50 rounded-3xl">
                        <Zap size={32} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-400">Nenhum negócio ativo para este lead</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LeadModal 
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingLead(null); }}
        onSave={handleSave}
        initialData={editingLead}
      />

      <ConfirmModal 
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Excluir Contato?"
        message="Tem certeza que deseja excluir este contato? Esta ação não poderá ser desfeita."
      />
    </div>
  );
}

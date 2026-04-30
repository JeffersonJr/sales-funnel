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
import { FilterPanel } from "@/components/common/FilterPanel";

export default function LeadsPage() {
  const { leads, setLeads, deals } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Merge registered leads with contacts inferred from deals' profiles
  const dealContacts = deals.flatMap((d: any) =>
    (d.profile?.contacts || []).map((c: any) => ({ ...c, dealTitle: d.title, dealId: d.id }))
  );
  const registeredEmails = new Set(leads.map((l: any) => l.email));
  const inferredLeads = dealContacts
    .filter((c: any) => c.email && !registeredEmails.has(c.email))
    .reduce((acc: any[], c: any) => {
      // dedupe by email
      if (!acc.find((x: any) => x.email === c.email)) {
        acc.push({
          id: `inferred-${c.email}`,
          name: c.name || c.email,
          email: c.email,
          phone: c.phone || "",
          role: c.role || "Contato",
          company: deals.find((d: any) => d.id === c.dealId)?.company || "",
          inferred: true,
        });
      }
      return acc;
    }, []);

  const allLeads = [...leads, ...inferredLeads];

  const filteredLeads = allLeads.filter((l: any) => {
    if (search && 
        !(l.name || "").toLowerCase().includes(search.toLowerCase()) && 
        !(l.company || "").toLowerCase().includes(search.toLowerCase()) && 
        !(l.email || "").toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filters.company && filters.company !== "" && l.company !== filters.company) return false;
    if (filters.role && filters.role !== "" && l.role !== filters.role) return false;
    
    return true;
  });

  const availableCompanies = Array.from(new Set(allLeads.map((l: any) => l.company))).filter(Boolean);
  const availableRoles = Array.from(new Set(allLeads.map((l: any) => l.role))).filter(Boolean);

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
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Contatos & Leads</h1>
          <p className="text-muted-foreground font-medium mt-1 text-sm md:text-base">Gerencie sua base de contatos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white p-4 md:px-8 md:py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <Plus size={20} /> <span className="hidden md:inline">Novo Contato</span>
        </button>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, empresa ou e-mail..."
              className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex-1 md:flex-none px-5 py-3 rounded-xl transition-all border flex items-center justify-center gap-2",
                showFilters ? "bg-primary text-white border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              )}
            >
              <Filter size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Filtrar</span>
            </button>
          </div>
        </div>

        <FilterPanel 
          isOpen={showFilters}
          filters={[
            { key: "company", label: "Empresa", type: "select", options: availableCompanies.map((c: any) => ({ label: c, value: c })) },
            { key: "role", label: "Cargo", type: "select", options: availableRoles.map((r: any) => ({ label: r, value: r })) }
          ]}
          values={filters}
          onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
          onClear={() => setFilters({})}
        />

        <div className="md:hidden p-4 space-y-4">
          {filteredLeads.map((lead: any) => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedLead(lead)}
              className="bg-muted/50 p-6 rounded-[2rem] border border-border space-y-4 active:scale-95 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar name={lead.name} size="md" />
                  <div>
                    <p className="text-sm font-black text-foreground">{lead.name}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{lead.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setEditingLead(lead); setShowModal(true); }}
                     className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                   >
                     <Edit2 size={16} />
                   </button>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Building2 size={12} /> {lead.company}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Mail size={12} /> {lead.email}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nome</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Empresa</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contato</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.map((lead: any) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar name={lead.name} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-foreground">{lead.name}</p>
                          {lead.inferred && (
                            <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">Do Funil</span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{lead.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-foreground/80 font-bold text-sm">
                      <Building2 size={14} className="text-muted-foreground/40" />
                      {lead.company}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Mail size={12} /> {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Phone size={12} /> {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingLead(lead); setShowModal(true); }}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(lead); }}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
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
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-card shadow-2xl z-[110] flex flex-col border-l border-border"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
                <h2 className="text-xl font-black text-foreground">Perfil do Lead</h2>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-10 bg-card">
                <div className="flex flex-col items-center text-center mb-12">
                  <Avatar name={selectedLead.name} size="xl" className="w-24 h-24 text-2xl mb-6 shadow-2xl shadow-primary/10" />
                  <h3 className="text-2xl font-black text-foreground">{selectedLead.name}</h3>
                  <p className="text-primary font-black text-xs uppercase tracking-widest mt-1">{selectedLead.role} @ {selectedLead.company}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  <div className="bg-muted p-6 rounded-[2rem] border border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">E-mail</p>
                    <p className="text-sm font-bold text-foreground">{selectedLead.email}</p>
                  </div>
                  <div className="bg-muted p-6 rounded-[2rem] border border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Telefone</p>
                    <p className="text-sm font-bold text-foreground">{selectedLead.phone}</p>
                  </div>
                </div>

                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Negócios Atrelados</h4>
                    <span className="text-[10px] font-black bg-primary text-white px-2 py-1 rounded-lg">
                      {getLeadDeals(selectedLead.email).length} ATIVOS
                    </span>
                  </div>

                  <div className="space-y-3">
                    {getLeadDeals(selectedLead.email).map((deal: any) => (
                      <div key={deal.id} className="bg-muted/30 border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                        <div>
                          <p className="text-sm font-black text-foreground">{deal.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{deal.stage}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{formatCurrency(deal.value)}</span>
                          </div>
                        </div>
                        <button className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    ))}
                    {getLeadDeals(selectedLead.email).length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-border rounded-3xl bg-muted/20">
                        <Zap size={32} className="text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-sm font-bold text-muted-foreground">Nenhum negócio ativo para este lead</p>
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

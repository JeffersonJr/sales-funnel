"use client";

import React, { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  Search, 
  Plus, 
  Filter, 
  Building2, 
  ExternalLink, 
  Trash2, 
  Edit2, 
  Globe, 
  MapPin, 
  Users, 
  Zap, 
  X 
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn, formatCurrency } from "@/lib/utils";
import { CompanyModal } from "@/components/companies/CompanyModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FilterPanel } from "@/components/common/FilterPanel";

export default function CompaniesPage() {
  const { companies, setCompanies, deals, leads, setLeads } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredCompanies = companies.filter((c: any) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.industry.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.industry && filters.industry !== "" && c.industry !== filters.industry) return false;
    return true;
  });

  const availableIndustries = Array.from(new Set(companies.map((c: any) => c.industry))).filter(Boolean);

  const handleSave = (companyData: any) => {
    const { leadIds, ...pureCompanyData } = companyData;
    let companyId = editingCompany?.id;

    if (editingCompany) {
      setCompanies(companies.map((c: any) => c.id === editingCompany.id ? { ...c, ...pureCompanyData } : c));
      toast.success("Empresa atualizada!");
    } else {
      companyId = `c${Date.now()}`;
      const newCompany = {
        ...pureCompanyData,
        id: companyId,
        createdAt: new Date().toISOString()
      };
      setCompanies([...companies, newCompany]);
      toast.success("Empresa criada!");
    }

    // Update leads relationship
    if (leadIds) {
      setLeads(leads.map((l: any) => {
        if (leadIds.includes(l.id)) {
          return { ...l, companyId, company: pureCompanyData.name };
        }
        // If lead was linked to THIS company but is NO LONGER in leadIds, unlink it
        if (l.companyId === companyId && !leadIds.includes(l.id)) {
          return { ...l, companyId: null, company: "Sem empresa" };
        }
        return l;
      }));
    }

    setShowModal(false);
    setEditingCompany(null);
  };

  const handleDelete = () => {
    setCompanies(companies.filter((c: any) => c.id !== showDeleteConfirm.id));
    setShowDeleteConfirm(null);
    toast.error("Empresa excluída.");
  };

  const getCompanyDeals = (companyName: string) => {
    return deals.filter((d: any) => d.company === companyName);
  };

  const getCompanyEmployees = (companyName: string) => {
    return leads.filter((l: any) => l.company === companyName);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Empresas</h1>
          <p className="text-muted-foreground font-medium mt-1 text-sm md:text-base">Gerencie suas organizações</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white p-4 md:px-8 md:py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <Plus size={20} /> <span className="hidden md:inline">Nova Empresa</span>
        </button>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou setor..."
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
            { key: "industry", label: "Setor", type: "select", options: availableIndustries.map((i: any) => ({ label: i, value: i })) }
          ]}
          values={filters}
          onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
          onClear={() => setFilters({})}
        />

        <div className="md:hidden p-4 space-y-4">
          {filteredCompanies.map((company: any) => (
            <div 
              key={company.id} 
              onClick={() => setSelectedCompany(company)}
              className="bg-muted/50 p-6 rounded-[2rem] border border-border space-y-4 active:scale-95 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-muted-foreground/50 shadow-sm">
                      <Building2 size={24} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-foreground">{company.name}</p>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{company.industry}</p>
                   </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingCompany(company); setShowModal(true); }}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground pt-2 border-t border-border">
                 <MapPin size={12} /> {company.address}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Empresa</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Setor</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Localização</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCompanies.map((company: any) => (
                <tr 
                  key={company.id} 
                  onClick={() => setSelectedCompany(company)}
                  className="hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground/50 group-hover:bg-background transition-colors">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">{company.name}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{company.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-black bg-muted text-foreground/70 px-3 py-1 rounded-full uppercase tracking-widest">
                      {company.industry}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <MapPin size={12} /> {company.address}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingCompany(company); setShowModal(true); }}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(company); }}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Building2 size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-sm font-bold text-muted-foreground">Nenhuma empresa encontrada</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel Detail View */}
      <AnimatePresence>
        {selectedCompany && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompany(null)}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
                <h2 className="text-xl font-black text-foreground">Detalhes da Empresa</h2>
                <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6 md:p-10 bg-card">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 mb-12">
                  <div className="w-20 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-primary/20">
                    <Building2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-foreground">{selectedCompany.name}</h3>
                    <p className="text-primary font-black text-xs uppercase tracking-widest mt-1">{selectedCompany.industry}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1"><Globe size={14} /> {selectedCompany.website}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {selectedCompany.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-8 rounded-[2.5rem] border border-border mb-12">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Sobre a Empresa</p>
                  <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                    {selectedCompany.description || "Nenhuma descrição informada para esta empresa."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <section className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Colaboradores</h4>
                      <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-lg">
                        {getCompanyEmployees(selectedCompany.name).length} TOTAL
                      </span>
                    </div>
                    <div className="space-y-3">
                      {getCompanyEmployees(selectedCompany.name).map((lead: any) => (
                        <div key={lead.id} className="flex items-center gap-3 p-3 bg-background border border-border rounded-2xl hover:shadow-md transition-all">
                          <Avatar name={lead.name} size="sm" />
                          <div>
                            <p className="text-xs font-black text-foreground">{lead.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">{lead.role}</p>
                          </div>
                        </div>
                      ))}
                      {getCompanyEmployees(selectedCompany.name).length === 0 && (
                        <p className="text-xs font-bold text-gray-400 text-center py-4">Nenhum colaborador vinculado</p>
                      )}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Negócios</h4>
                      <span className="text-[10px] font-black bg-primary text-white px-2 py-1 rounded-lg">
                        {getCompanyDeals(selectedCompany.name).length} ATIVOS
                      </span>
                    </div>
                    <div className="space-y-3">
                      {getCompanyDeals(selectedCompany.name).map((deal: any) => (
                        <div key={deal.id} className="p-4 bg-background border border-border rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                          <div>
                            <p className="text-xs font-black text-foreground">{deal.title}</p>
                            <p className="text-[9px] font-bold text-primary uppercase mt-1">{formatCurrency(deal.value)}</p>
                          </div>
                          <button className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all">
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      ))}
                      {getCompanyDeals(selectedCompany.name).length === 0 && (
                        <p className="text-xs font-bold text-gray-400 text-center py-4">Nenhum negócio ativo</p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CompanyModal 
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCompany(null); }}
        onSave={handleSave}
        initialData={editingCompany}
      />

      <ConfirmModal 
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Excluir Empresa?"
        message="Deseja realmente excluir esta organização? Todos os leads vinculados continuarão existindo mas ficarão sem empresa."
      />
    </div>
  );
}

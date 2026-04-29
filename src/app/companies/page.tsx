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

export default function CompaniesPage() {
  const { companies, setCompanies, deals, leads } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredCompanies = companies.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (companyData: any) => {
    if (editingCompany) {
      setCompanies(companies.map((c: any) => c.id === editingCompany.id ? { ...c, ...companyData } : c));
      toast.success("Empresa atualizada!");
    } else {
      const newCompany = {
        ...companyData,
        id: `c${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setCompanies([...companies, newCompany]);
      toast.success("Empresa criada!");
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Empresas</h1>
          <p className="text-gray-400 font-medium mt-2">Gerencie as organizações que sua equipe atende</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center gap-2 hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} /> Nova Empresa
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou setor..."
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Empresa</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Setor</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCompanies.map((company: any) => (
                <tr 
                  key={company.id} 
                  onClick={() => setSelectedCompany(company)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{company.name}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{company.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-black bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest">
                      {company.industry}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <MapPin size={12} /> {company.address}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingCompany(company); setShowModal(true); }}
                        className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(company); }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
                    <Building2 size={48} className="text-gray-100 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">Nenhuma empresa encontrada</p>
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
              className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h2 className="text-xl font-black text-gray-900">Detalhes da Empresa</h2>
                <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-10">
                <div className="flex items-start gap-6 mb-12">
                  <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-gray-200">
                    <Building2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">{selectedCompany.name}</h3>
                    <p className="text-blue-600 font-black text-xs uppercase tracking-widest mt-1">{selectedCompany.industry}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1"><Globe size={14} /> {selectedCompany.website}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {selectedCompany.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-12">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sobre a Empresa</p>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    {selectedCompany.description || "Nenhuma descrição informada para esta empresa."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <section className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Colaboradores</h4>
                      <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">
                        {getCompanyEmployees(selectedCompany.name).length} TOTAL
                      </span>
                    </div>
                    <div className="space-y-3">
                      {getCompanyEmployees(selectedCompany.name).map((lead: any) => (
                        <div key={lead.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all">
                          <Avatar name={lead.name} size="sm" />
                          <div>
                            <p className="text-xs font-black text-gray-900">{lead.name}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">{lead.role}</p>
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
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Negócios</h4>
                      <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-1 rounded-lg">
                        {getCompanyDeals(selectedCompany.name).length} ATIVOS
                      </span>
                    </div>
                    <div className="space-y-3">
                      {getCompanyDeals(selectedCompany.name).map((deal: any) => (
                        <div key={deal.id} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                          <div>
                            <p className="text-xs font-black text-gray-900">{deal.title}</p>
                            <p className="text-[9px] font-bold text-blue-500 uppercase mt-1">{formatCurrency(deal.value)}</p>
                          </div>
                          <button className="p-2 text-gray-300 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all">
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

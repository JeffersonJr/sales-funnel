"use client";

import React, { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  FileText, 
  Upload, 
  Search, 
  MoreVertical, 
  Trash2, 
  Download, 
  Edit2, 
  File as FileIcon,
  Plus,
  Clock,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DocumentsPage() {
  const { deals } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // In this mock, we aggregate documents from all deals
  const allDocuments = deals.flatMap((deal: any) => 
    (deal.documents || []).map((doc: any) => ({ ...doc, dealTitle: deal.title, dealId: deal.id }))
  );

  const filteredDocs = allDocuments.filter((doc: any) => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.dealTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    // In a real system, we'd update the specific deal's documents
    toast.error("Documento removido.");
    setShowDeleteConfirm(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Central de Documentos</h1>
          <p className="text-gray-400 font-medium mt-2">Gerencie arquivos, propostas e contratos de todos os seus negócios</p>
        </div>
        <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center gap-2 hover:bg-gray-800 transition-all">
          <Upload size={20} /> Enviar Arquivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: "Armazenamento", value: "2.4 GB / 10 GB", icon: HardDrive, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total de Arquivos", value: allDocuments.length, icon: FileIcon, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Propostas Geradas", value: allDocuments.filter((d: any) => d.name.toLowerCase().includes('proposta')).length, icon: Clock, color: "text-green-500", bg: "bg-green-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou negócio..."
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Documento</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Negócio Relacionado</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tamanho</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDocs.map((doc: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={doc.id} 
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <p className="text-sm font-black text-gray-900">{doc.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      {doc.dealTitle}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-gray-400">{new Date(doc.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[10px] font-black text-gray-400 uppercase">{doc.size}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Download size={18} />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(doc)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <FileText size={48} className="text-gray-100 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-400">Nenhum documento encontrado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Excluir Documento?"
        message={`Tem certeza que deseja excluir o arquivo "${showDeleteConfirm?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  Users as UsersIcon, 
  Plus, 
  Search, 
  Shield, 
  Mail, 
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { UserManagementModal } from "@/components/layout/UserManagementModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UsersPage() {
  const { users, setUsers, deals, setDeals } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserStatus = (id: string) => {
    setUsers(users.map((u: any) => u.id === id ? { ...u, active: u.active === false ? true : false } : u));
    toast.success("Status do usuário atualizado!");
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Equipe & Acessos</h1>
          <p className="text-gray-400 font-medium mt-2">Gerencie quem tem acesso ao seu funil e seus níveis de permissão</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setShowModal(true); }}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
        >
          <Plus size={20} /> Convidar Usuário
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usuário</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Permissão</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar name={u.name} size="md" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{u.name}</p>
                        <p className="text-xs font-bold text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 w-fit">
                      <Shield size={14} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{u.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", u.active !== false ? "bg-green-500 animate-pulse" : "bg-gray-300")} />
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", u.active !== false ? "text-green-500" : "text-gray-400")}>
                        {u.active !== false ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => toggleUserStatus(u.id)}
                        className={cn(
                          "p-2.5 rounded-xl transition-all",
                          u.active !== false ? "text-orange-300 hover:text-orange-600 hover:bg-orange-50" : "text-green-300 hover:text-green-600 hover:bg-green-50"
                        )}
                        title={u.active !== false ? "Desativar Usuário" : "Ativar Usuário"}
                      >
                        {u.active !== false ? <X size={18} /> : <Check size={18} />}
                      </button>
                      <button 
                        onClick={() => { setEditingUser(u); setShowModal(true); }}
                        className="p-2.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserManagementModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        users={users}
        onUpdateUsers={setUsers}
        deals={deals}
        onUpdateDeals={setDeals}
        initialEditingUser={editingUser}
      />
    </div>
  );
}

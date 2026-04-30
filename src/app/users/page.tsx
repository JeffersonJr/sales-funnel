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
  X,
  Filter
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { UserManagementModal } from "@/components/layout/UserManagementModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FilterPanel } from "@/components/common/FilterPanel";

export default function UsersPage() {
  const { users, setUsers, deals, setDeals } = useFunnel();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredUsers = users.filter((u: any) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && 
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filters.role && filters.role !== "" && u.role !== filters.role) return false;
    
    if (filters.status && filters.status !== "") {
      const isActive = u.active !== false;
      const filterActive = filters.status === "active";
      if (isActive !== filterActive) return false;
    }
    
    return true;
  });

  const availableRoles = Array.from(new Set(users.map((u: any) => u.role))).filter(Boolean);

  const toggleUserStatus = (id: string) => {
    setUsers(users.map((u: any) => u.id === id ? { ...u, active: u.active === false ? true : false } : u));
    toast.success("Status do usuário atualizado!");
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Equipe & Acessos</h1>
          <p className="text-muted-foreground font-medium mt-2">Gerencie quem tem acesso ao seu funil e seus níveis de permissão</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setShowModal(true); }}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} /> <span className="hidden md:inline">Convidar Usuário</span>
        </button>
      </div>

      <div className="bg-card rounded-[3rem] border border-border shadow-xl overflow-hidden">
        <div className="p-8 border-b border-border bg-muted/30 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex-1 md:flex-none px-6 py-4 rounded-2xl transition-all border flex items-center justify-center gap-2",
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
            { key: "role", label: "Nível de Acesso", type: "select", options: availableRoles.map((r: any) => ({ label: r, value: r })) },
            { key: "status", label: "Status", type: "select", options: [{ label: "Ativo", value: "active" }, { label: "Inativo", value: "inactive" }] }
          ]}
          values={filters}
          onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
          onClear={() => setFilters({})}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Usuário</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Permissão</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar name={u.name} size="md" />
                      <div>
                        <p className="text-sm font-black text-foreground">{u.name}</p>
                        <p className="text-xs font-bold text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary w-fit">
                      <Shield size={14} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{u.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", u.active !== false ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30")} />
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", u.active !== false ? "text-green-500" : "text-muted-foreground")}>
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
                          u.active !== false ? "text-orange-400 hover:text-orange-500 hover:bg-orange-500/10" : "text-green-400 hover:text-green-500 hover:bg-green-500/10"
                        )}
                        title={u.active !== false ? "Desativar Usuário" : "Ativar Usuário"}
                      >
                        {u.active !== false ? <X size={18} /> : <Check size={18} />}
                      </button>
                      <button 
                        onClick={() => { setEditingUser(u); setShowModal(true); }}
                        className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
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

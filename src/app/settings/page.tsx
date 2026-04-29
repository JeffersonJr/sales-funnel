"use client";

import React, { useState } from "react";
import { useFunnel } from "@/context/FunnelContext";
import { 
  Users, 
  Users2, 
  Tag as TagIcon, 
  Layout, 
  Plus, 
  Trash2, 
  Edit2, 
  Shield, 
  Check, 
  X,
  Palette
} from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { UserManagementModal } from "@/components/layout/UserManagementModal";

export default function SettingsPage() {
  const { 
    users, setUsers, 
    groups, setGroups, 
    availableTags, setAvailableTags,
    stages, setStages,
    deals, setDeals 
  } = useFunnel();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "groups" | "tags" | "funnel">("users");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Groups Management
  const [newGroupName, setNewGroupName] = useState("");

  // Tags Management
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");

  const colors = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#64748b"];

  const handleAddTag = () => {
    if (!newTagName) return;
    setAvailableTags([...availableTags, { id: Date.now().toString(), name: newTagName, color: newTagColor }]);
    setNewTagName("");
    toast.success("Tag criada!");
  };

  const handleDeleteTag = (id: string) => {
    setAvailableTags(availableTags.filter((t: any) => t.id !== id));
    toast.error("Tag removida.");
  };

  const handleAddGroup = () => {
    if (!newGroupName) return;
    setGroups([...groups, { id: Date.now().toString(), name: newGroupName, members: [] }]);
    setNewGroupName("");
    toast.success("Grupo criado!");
  };

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configurações</h1>
        <p className="text-gray-400 font-medium mt-2">Personalize o sistema e gerencie permissões da equipe</p>
      </div>

      <div className="flex gap-12">
        {/* Sidebar Tabs */}
        <div className="w-64 space-y-2">
          {[
            { id: "users", label: "Usuários & Acessos", icon: Users },
            { id: "groups", label: "Grupos & Equipes", icon: Users2 },
            { id: "tags", label: "Tags & Etiquetas", icon: TagIcon },
            { id: "funnel", label: "Etapas do Funil", icon: Layout },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-gray-900 text-white shadow-xl shadow-gray-200" 
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">Usuários do Sistema</h2>
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-200 transition-all"
                >
                  <Plus size={16} /> Novo Usuário
                </button>
              </div>

              <div className="grid gap-4">
                {users.map((u: any) => (
                  <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <Avatar name={u.name} size="md" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{u.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full">
                        <Shield size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{u.role}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setShowUserModal(true)}
                          className="p-2 text-gray-300 hover:text-blue-500"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "groups" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">Grupos & Equipes</h2>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Criar Novo Grupo</p>
                <div className="flex gap-4">
                  <input 
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nome do grupo (ex: Vendas Sul)"
                    className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none"
                  />
                  <button 
                    onClick={handleAddGroup}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all"
                  >
                    Criar Grupo
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {groups.map((g: any) => (
                  <div key={g.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{g.name}</h3>
                      <p className="text-xs font-bold text-gray-400 mt-1">{g.members?.length || 0} Membros</p>
                    </div>
                    <div className="flex -space-x-3">
                      {g.members?.slice(0, 4).map((mId: string) => {
                        const member = users.find((u: any) => u.id === mId);
                        return <Avatar key={mId} name={member?.name || "U"} size="sm" className="border-2 border-white" />;
                      })}
                      {g.members?.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-400">
                          +{g.members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "tags" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-xl font-black text-gray-900">Gerenciar Tags</h2>
              
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nome da Tag</label>
                      <input 
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Ex: Urgente"
                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-gray-900/5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Cor</label>
                      <div className="flex flex-wrap gap-2">
                        {colors.map(c => (
                          <button 
                            key={c} 
                            onClick={() => setNewTagColor(c)}
                            className={cn(
                              "w-8 h-8 rounded-full transition-all border-4",
                              newTagColor === c ? "border-gray-900 scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleAddTag}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all"
                  >
                    Adicionar Tag
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {availableTags.map((tag: any) => (
                  <div key={tag.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: tag.color }} />
                      <span className="text-sm font-black text-gray-900">{tag.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "funnel" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">Pipeline de Vendas</h2>
                <button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2">
                  <Plus size={16} /> Nova Etapa
                </button>
              </div>

              <div className="space-y-3">
                {stages.map((s: any, idx: number) => (
                  <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6 shadow-sm group">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-black text-gray-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-widest">{s.title}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-300 hover:text-blue-500"><Edit2 size={16} /></button>
                      <button className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <UserManagementModal 
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        users={users}
        onUpdateUsers={setUsers}
        deals={deals}
        onUpdateDeals={setDeals}
      />
    </div>
  );
}

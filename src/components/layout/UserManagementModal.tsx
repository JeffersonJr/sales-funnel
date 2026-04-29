"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Trash2, Shield, Mail, Check, AlertTriangle, ArrowRight, Edit2 } from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: any[];
  onUpdateUsers: (users: any[]) => void;
  deals: any[];
  onUpdateDeals: (deals: any[]) => void;
}

export function UserManagementModal({ isOpen, onClose, users, onUpdateUsers, deals, onUpdateDeals }: UserManagementModalProps) {
  const [showTransferModal, setShowTransferModal] = useState<{ userToDelete: any, replacementUserId: string } | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Vendedor", department: "Comercial" });

  const handleSaveUser = () => {
    if (!form.name || !form.email) return;
    
    if (editingUser) {
      onUpdateUsers(users.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
      toast.success("Usuário atualizado com sucesso!");
    } else {
      const user = {
        id: Date.now().toString(),
        ...form,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`
      };
      onUpdateUsers([...users, user]);
      toast.success("Usuário criado com sucesso!");
    }
    
    setForm({ name: "", email: "", role: "Vendedor", department: "Comercial" });
    setIsAddingUser(false);
    setEditingUser(null);
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setForm({ 
      name: user.name, 
      email: user.email, 
      role: user.role || "Vendedor", 
      department: user.department || "Comercial" 
    });
    setIsAddingUser(true);
  };

  const handleDeleteClick = (user: any) => {
    if (users.length <= 1) {
      toast.error("Não é possível excluir o único usuário do sistema.");
      return;
    }
    const userDeals = deals.filter(d => d.owner === user.name);
    if (userDeals.length > 0) {
      setShowTransferModal({ userToDelete: user, replacementUserId: users.find(u => u.id !== user.id)?.id || "" });
    } else {
      onUpdateUsers(users.filter(u => u.id !== user.id));
      toast.error(`Usuário ${user.name} excluído.`);
    }
  };

  const handleTransferAndSave = () => {
    if (!showTransferModal) return;
    const { userToDelete, replacementUserId } = showTransferModal;
    const replacementUser = users.find(u => u.id === replacementUserId);
    
    // Transfer deals
    const updatedDeals = deals.map(d => 
      d.owner === userToDelete.name ? { ...d, owner: replacementUser.name } : d
    );
    onUpdateDeals(updatedDeals);

    // Remove user
    onUpdateUsers(users.filter(u => u.id !== userToDelete.id));
    
    toast.success(`Leads transferidos para ${replacementUser.name} e usuário excluído.`);
    setShowTransferModal(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-black text-gray-900">Gestão de Equipe</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gerencie acessos e responsabilidades</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 flex-1 overflow-auto">
            {!isAddingUser ? (
              <div className="space-y-4">
                <button 
                  onClick={() => { setIsAddingUser(true); setEditingUser(null); setForm({ name: "", email: "", role: "Vendedor", department: "Comercial" }); }}
                  className="w-full p-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <UserPlus size={18} /> Convidar Novo Usuário
                </button>
                
                <div className="space-y-2 mt-6">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all group">
                      <div className="flex items-center gap-4">
                        <Avatar name={u.name} size="md" />
                        <div>
                          <p className="text-sm font-black text-gray-900">{u.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Mail size={10} /> {u.email}</span>
                            <span className={cn(
                              "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                              u.role === 'Administrador' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                            )}>
                              {u.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleEditClick(u)}
                          className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(u)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Ex: João Silva"
                      className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">E-mail</label>
                    <input 
                      type="email" 
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder="joao@empresa.com"
                      className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nível de Acesso</label>
                    <select 
                      value={form.role}
                      onChange={(e) => setForm({...form, role: e.target.value})}
                      className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none"
                    >
                      <option>Vendedor</option>
                      <option>Gerente</option>
                      <option>Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Departamento</label>
                    <select 
                      value={form.department}
                      onChange={(e) => setForm({...form, department: e.target.value})}
                      className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none"
                    >
                      <option>Comercial</option>
                      <option>SDR / BDR</option>
                      <option>Customer Success</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsAddingUser(false)} className="flex-1 py-4 text-sm font-bold text-gray-400">Cancelar</button>
                  <button onClick={handleSaveUser} className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-black text-sm">
                    {editingUser ? "Salvar Alterações" : "Criar Usuário"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Transfer leads modal */}
        <AnimatePresence>
          {showTransferModal && (
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl text-center"
              >
                <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <AlertTriangle size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Transferir leads de {showTransferModal.userToDelete.name}?</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                  Este usuário possui leads ativos. Antes de excluí-lo, você deve transferir toda a sua carteira para outro responsável.
                </p>

                <div className="space-y-4 mb-10 text-left">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Novo Responsável</label>
                  <div className="space-y-2">
                    {users.filter(u => u.id !== showTransferModal.userToDelete.id).map(u => (
                      <button
                        key={u.id}
                        onClick={() => setShowTransferModal({...showTransferModal, replacementUserId: u.id})}
                        className={cn(
                          "w-full p-4 rounded-2xl border flex items-center justify-between transition-all",
                          showTransferModal.replacementUserId === u.id 
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100" 
                            : "border-gray-100 bg-gray-50 text-gray-500"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <span className="text-xs font-bold">{u.name}</span>
                        </div>
                        {showTransferModal.replacementUserId === u.id && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleTransferAndSave}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    Transferir e Excluir <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => setShowTransferModal(null)}
                    className="w-full py-4 text-xs font-black text-gray-400 uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

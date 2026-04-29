"use client";

import React from "react";
import { Avatar } from "@/components/common/Avatar";
import { ChevronDown, Bell, Users, Settings, LogOut } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { useFunnel } from "@/context/FunnelContext";

export function TopHeader() {
  const { users, setUsers, deals, setDeals, user, logout } = useFunnel();
  const [showUserModal, setShowUserModal] = React.useState(false);

  return (
    <header className="h-20 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-end px-8 gap-6">
      <button 
        onClick={() => setShowUserModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all text-xs font-bold mr-auto"
      >
        <Users size={16} /> Gestão de Equipe
      </button>

      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all relative">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>
      
      <div className="relative group">
        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 cursor-pointer py-2">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{user?.name || "Jefferson Jr"}</span>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full mt-0.5">{user?.plan || "Pro Plan"}</span>
          </div>
          <Avatar name={user?.name || "Jefferson Jr"} size="md" className="shadow-lg shadow-blue-100/50 group-hover:scale-105 transition-transform" />
          <ChevronDown size={14} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-64 overflow-hidden p-2">
            <div className="p-4 border-b border-gray-50 mb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sua Conta</p>
              <p className="text-xs font-bold text-gray-600 mt-1 truncate">{user?.email}</p>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-2xl transition-all">
              <Users size={16} /> Meu Perfil
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-2xl transition-all">
              <Settings size={16} /> Configurações
            </button>
            <div className="h-[1px] bg-gray-50 my-2 mx-4" />
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut size={16} /> Sair do Sistema
            </button>
          </div>
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
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Plus, Trash2, Edit2, Check } from "lucide-react";
import { toast } from "sonner";

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onUpdateTags: (tags: Tag[]) => void;
}

export function TagManagementModal({ isOpen, onClose, tags, onUpdateTags }: TagManagementModalProps) {
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<{ id: string, name: string } | null>(null);

  const handleAdd = () => {
    if (!newTag || tags.some(t => t.name === newTag)) return;
    onUpdateTags([...tags, { id: Date.now().toString(), name: newTag, color: "#3b82f6" }]);
    setNewTag("");
    toast.success(`Tag "${newTag}" criada.`);
  };

  const handleDelete = (id: string) => {
    onUpdateTags(tags.filter(t => t.id !== id));
    toast.error("Tag excluída.");
  };

  const handleEdit = () => {
    if (!editingTag || !editingTag.name || tags.some(t => t.name === editingTag.name && t.id !== editingTag.id)) return;
    const newTags = tags.map(t => t.id === editingTag.id ? { ...t, name: editingTag.name } : t);
    onUpdateTags(newTags);
    setEditingTag(null);
    toast.success("Tag atualizada.");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[2.5rem] w-full max-md shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-black text-gray-900">Gerenciar Tags</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Tags globais do sistema</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nome da nova tag..."
                className="flex-1 p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button 
                onClick={handleAdd}
                className="p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-auto pr-2 scrollbar-hide">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  {editingTag?.id === tag.id ? (
                    <div className="flex-1 flex gap-2">
                       <input 
                        autoFocus
                        value={editingTag.name}
                        onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                        className="flex-1 bg-white border border-blue-200 rounded-lg px-2 py-1 text-sm font-bold outline-none"
                       />
                       <button onClick={handleEdit} className="text-green-500"><Check size={16} /></button>
                       <button onClick={() => setEditingTag(null)} className="text-gray-400"><X size={16} /></button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Tag size={12} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">{tag.name}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => setEditingTag({id: tag.id, name: tag.name})} className="p-1 text-gray-300 hover:text-blue-500"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(tag.id)} className="p-1 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 flex justify-center">
            <button onClick={onClose} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">Fechar</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

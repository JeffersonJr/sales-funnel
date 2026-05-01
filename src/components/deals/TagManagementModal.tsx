"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Plus, Trash2, Edit2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  dealTags?: string[];
  onUpdateDealTags?: (tags: string[]) => void;
}

const TAG_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#64748b", // slate
];

export function TagManagementModal({ isOpen, onClose, tags, onUpdateTags, dealTags, onUpdateDealTags }: TagManagementModalProps) {
  const [newTag, setNewTag] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [editingTag, setEditingTag] = useState<{ id: string, name: string, color: string } | null>(null);

  const handleAdd = () => {
    if (!newTag || tags.some(t => t.name.toLowerCase() === newTag.toLowerCase())) {
      if (newTag) toast.error("Uma tag com esse nome já existe.");
      return;
    }
    onUpdateTags([...tags, { id: Date.now().toString(), name: newTag, color: selectedColor }]);
    setNewTag("");
    toast.success(`Tag "${newTag}" criada.`);
  };

  const handleDelete = (id: string) => {
    onUpdateTags(tags.filter(t => t.id !== id));
    toast.error("Tag excluída.");
  };

  const handleEdit = () => {
    if (!editingTag || !editingTag.name || tags.some(t => t.name.toLowerCase() === editingTag.name.toLowerCase() && t.id !== editingTag.id)) {
      toast.error("Nome de tag inválido ou já existe.");
      return;
    }
    const newTags = tags.map(t => t.id === editingTag.id ? { ...t, name: editingTag.name, color: editingTag.color } : t);
    onUpdateTags(newTags);
    setEditingTag(null);
    toast.success("Tag atualizada.");
  };

  const toggleDealTag = (tagName: string) => {
    if (!dealTags || !onUpdateDealTags) return;
    if (dealTags.includes(tagName)) {
      onUpdateDealTags(dealTags.filter(t => t !== tagName));
    } else {
      onUpdateDealTags([...dealTags, tagName]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col border border-border"
        >
          <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
            <div>
              <h2 className="text-xl font-black text-foreground">{dealTags ? "Tags do Negócio" : "Gerenciar Tags"}</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {dealTags ? "Selecione ou crie novas tags" : "Tags globais do sistema"}
              </p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-muted bg-background rounded-2xl text-muted-foreground hover:text-foreground transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-8 bg-card">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nome da nova tag..."
                  className="flex-1 p-4 rounded-2xl border-2 border-border bg-background text-sm font-bold outline-none focus:border-primary transition-all text-foreground"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button 
                  onClick={handleAdd}
                  className="p-4 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex gap-3 justify-center pb-2">
                {TAG_COLORS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all flex items-center justify-center",
                      selectedColor === c ? "ring-4 ring-offset-2 scale-110 shadow-md" : "hover:scale-110 opacity-50 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c, "--tw-ring-color": c } as React.CSSProperties}
                  >
                    {selectedColor === c && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence>
                {tags.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                    <Tag className="mx-auto mb-3 text-muted-foreground/40" size={32} />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nenhuma tag criada</p>
                  </motion.div>
                )}
                {tags.map(tag => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={tag.id} 
                    className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border group transition-all"
                  >
                    {editingTag?.id === tag.id ? (
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex gap-2">
                           <input 
                            autoFocus
                            value={editingTag.name}
                            onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                            className="flex-1 bg-background border-2 border-primary/30 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-primary transition-colors text-foreground"
                           />
                           <button onClick={handleEdit} className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500/20 transition-colors"><Check size={18} /></button>
                           <button onClick={() => setEditingTag(null)} className="p-2 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors"><X size={18} /></button>
                        </div>
                        <div className="flex gap-2">
                          {TAG_COLORS.map(c => (
                            <button 
                              key={c}
                              onClick={() => setEditingTag({...editingTag, color: c})}
                              className={cn(
                                "w-6 h-6 rounded-full transition-all",
                                editingTag.color === c ? "ring-2 ring-offset-1 scale-110" : "opacity-50 hover:opacity-100"
                              )}
                              style={{ backgroundColor: c, "--tw-ring-color": c } as React.CSSProperties}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          className={cn("flex items-center gap-3 flex-1", dealTags ? "cursor-pointer" : "")}
                          onClick={() => dealTags ? toggleDealTag(tag.name) : null}
                        >
                          {dealTags && (
                            <div className={cn(
                              "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                              dealTags.includes(tag.name) ? "bg-primary border-primary text-primary-foreground" : "border-border"
                            )}>
                              {dealTags.includes(tag.name) && <Check size={12} />}
                            </div>
                          )}
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color || "#3b82f6" }} />
                          <span className={cn(
                            "text-sm font-black tracking-tight",
                            dealTags?.includes(tag.name) ? "text-foreground" : "text-muted-foreground"
                          )}>{tag.name}</span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setEditingTag({id: tag.id, name: tag.name, color: tag.color || "#3b82f6"})} className="p-2 bg-card text-muted-foreground rounded-xl border border-border hover:text-primary transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(tag.id)} className="p-2 bg-card text-muted-foreground rounded-xl border border-border hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-6 bg-muted/30 flex justify-center border-t border-border">
            <button onClick={onClose} className="px-6 py-3 bg-card border border-border rounded-xl text-xs font-black text-muted-foreground uppercase tracking-widest hover:text-foreground hover:border-muted transition-all">Concluído</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

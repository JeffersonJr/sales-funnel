"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { AlertCircle, Clock, DollarSign, MoreHorizontal, Trash2, Trophy, Frown, Archive } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  lastActivity: string;
  tags: string[];
}

export function DealCard({ deal, onDelete, onUpdateStage }: { deal: Deal, onDelete?: () => void, onUpdateStage?: (id: string, stage: string) => void }) {
  const [mounted, setMounted] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  React.useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const daysInactive = (mounted && deal.lastActivity) ? differenceInDays(new Date(), parseISO(deal.lastActivity)) : 0;
  const isStale = daysInactive >= 3;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing card-hover",
        isDragging && "opacity-50",
        isStale && "border-l-4 border-l-red-500"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-black text-gray-900 truncate flex-1 group-hover:text-blue-600 transition-colors">{deal.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover/deal:opacity-100 transition-opacity relative">
           <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className={cn("text-gray-300 hover:text-gray-900 transition-colors p-1", showMenu && "text-gray-900")}
          >
            <MoreHorizontal size={14} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div 
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-8 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => { onUpdateStage?.(deal.id, 'closed'); setShowMenu(false); toast.success("Parabéns pelo fechamento! 🎉"); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-green-600 hover:bg-green-50 flex items-center gap-3 transition-colors"
                >
                  <Trophy size={14} /> Ganhamos!
                </button>
                <button 
                  onClick={() => { onDelete?.(); setShowMenu(false); toast.error("Negócio marcado como perdido."); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <Frown size={14} /> Perdemos...
                </button>
                <div className="h-px bg-gray-50 my-1" />
                <button 
                  onClick={() => { setShowMenu(false); toast.info("Negócio arquivado"); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-gray-500 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Archive size={14} /> Arquivar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">{deal.company}</p>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 text-gray-900 bg-gray-50 px-2 py-1 rounded-lg text-xs font-black">
          {formatCurrency(deal.value)}
        </div>
        {isStale && (
          <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={10} />
            Estagnado
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {deal.tags?.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md border border-blue-100/50"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-gray-300 text-[10px] font-bold">
          <Clock size={10} />
          <span>{daysInactive}d</span>
        </div>
      </div>
    </div>
  );
}

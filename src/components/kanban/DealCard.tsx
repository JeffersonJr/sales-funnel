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

export function DealCard({ deal, stageColor, onDelete, onUpdateStage }: { deal: Deal, stageColor?: string, onDelete?: () => void, onUpdateStage?: (id: string, stage: string) => void }) {
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
      {...attributes}
      {...listeners}
      className={cn(
        "bg-card p-4 rounded-xl border border-border cursor-grab active:cursor-grabbing card-hover overflow-hidden transition-all duration-300",
        isDragging && "opacity-50"
      )}
      style={{
        ...style,
        borderLeft: `4px solid ${stageColor || '#3b82f6'}`
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-black text-foreground truncate flex-1 group-hover:text-primary transition-colors tracking-tight">{deal.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover/deal:opacity-100 transition-opacity relative">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="text-muted-foreground/50 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className={cn("text-muted-foreground/50 hover:text-foreground transition-colors p-1", showMenu && "text-foreground")}
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
                className="absolute right-0 top-8 w-48 bg-card rounded-xl border border-border py-2 z-50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => { onUpdateStage?.(deal.id, 'closed'); setShowMenu(false); toast.success("Parabéns pelo fechamento! 🎉"); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 flex items-center gap-3 transition-colors"
                >
                  <Trophy size={14} /> Ganhamos!
                </button>
                <button 
                  onClick={() => { onDelete?.(); setShowMenu(false); toast.error("Negócio marcado como perdido."); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                >
                  <Frown size={14} /> Perdemos...
                </button>
                <div className="h-px bg-border my-1" />
                <button 
                  onClick={() => { setShowMenu(false); toast.info("Negócio arquivado"); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-muted-foreground hover:bg-muted flex items-center gap-3 transition-colors"
                >
                  <Archive size={14} /> Arquivar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">{deal.company}</p>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 text-foreground bg-muted px-2 py-1 rounded-lg text-xs font-black">
          {formatCurrency(deal.value)}
        </div>
        {isStale && (
          <div className="flex items-center gap-1 text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
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
              className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
          <Clock size={10} />
          <span>{daysInactive}d</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { AlertCircle, Clock, DollarSign, MoreHorizontal } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  lastActivity: string;
  tags: string[];
}

export function DealCard({ deal }: { deal: Deal }) {
  const [mounted, setMounted] = React.useState(false);
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
  }, []);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const daysInactive = mounted ? differenceInDays(new Date(), parseISO(deal.lastActivity)) : 0;
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
        <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">{deal.title}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-4">{deal.company}</p>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-medium">
          <DollarSign size={10} />
          {formatCurrency(deal.value)}
        </div>
        {isStale && (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px] font-medium">
            <AlertCircle size={10} />
            Inativo
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-1">
          {deal.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <Clock size={10} />
          <span>{daysInactive}d</span>
        </div>
      </div>
    </div>
  );
}

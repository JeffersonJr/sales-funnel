"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type FilterType = "select" | "multi-select" | "number-range" | "text";

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onClear: () => void;
  onClose?: () => void;
}

export function FilterPanel({ isOpen, filters, values, onChange, onClear, onClose }: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden w-full"
        >
          <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-[2rem] mt-4 mb-4 md:mb-8 mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filtros Avançados</h3>
              <div className="flex gap-2">
                <button 
                  onClick={onClear}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Limpar Todos
                </button>
                {onClose && (
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    <Check size={14} /> Aplicar
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {filter.label}
                  </label>
                  
                  {filter.type === "select" && (
                    <select
                      value={values[filter.key] || ""}
                      onChange={(e) => onChange(filter.key, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/5 appearance-none"
                    >
                      <option value="">Todos</option>
                      {filter.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}

                  {filter.type === "multi-select" && (
                    <div className="flex flex-wrap gap-2">
                      {filter.options?.map((opt) => {
                        const isSelected = (values[filter.key] || []).includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            onClick={() => {
                              const current = values[filter.key] || [];
                              const next = isSelected 
                                ? current.filter((v: string) => v !== opt.value)
                                : [...current, opt.value];
                              onChange(filter.key, next);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                              isSelected 
                                ? "bg-blue-50 text-blue-600 border-blue-200" 
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {filter.type === "number-range" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Mínimo"
                        value={values[filter.key]?.min || ""}
                        onChange={(e) => onChange(filter.key, { ...values[filter.key], min: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/5"
                      />
                      <span className="text-gray-300">-</span>
                      <input
                        type="number"
                        placeholder="Máximo"
                        value={values[filter.key]?.max || ""}
                        onChange={(e) => onChange(filter.key, { ...values[filter.key], max: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/5"
                      />
                    </div>
                  )}
                  
                  {filter.type === "text" && (
                     <input
                        type="text"
                        placeholder={filter.placeholder || "Buscar..."}
                        value={values[filter.key] || ""}
                        onChange={(e) => onChange(filter.key, e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/5"
                     />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

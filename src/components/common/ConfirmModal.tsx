"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info" | "warning";
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                type === 'danger' ? 'bg-red-50 text-red-500' : 
                type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {type === 'danger' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl text-gray-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">{message}</p>
            
            <div className="flex gap-3 mt-8">
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                {cancelText}
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${
                  type === 'danger' ? 'bg-red-500 shadow-red-100 hover:bg-red-600' : 
                  type === 'warning' ? 'bg-orange-500 shadow-orange-100 hover:bg-orange-600' : 'bg-gray-900 shadow-gray-200 hover:bg-gray-800'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

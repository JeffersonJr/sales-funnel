"use client";
import React from "react";
import { Cpu, ArrowLeft, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SalesbotIntegrationPage() {
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Salesbot AI</h1>
        </div>
      </div>
      
      <div className="bg-gray-900 p-20 rounded-[4rem] text-center relative overflow-hidden">
         <div className="relative z-10">
            <div className="w-24 h-24 bg-blue-500/20 text-blue-400 rounded-[2rem] flex items-center justify-center mb-10 mx-auto animate-pulse">
               <Cpu size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-6">Automação Inteligente com LLM</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">Deixe que nossa IA qualifique seus leads, agende reuniões e tire dúvidas 24/7 sem intervenção humana.</p>
            
            <div className="flex justify-center gap-4">
               <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/20">
                  <Sparkles size={20} /> Ativar Beta Antecipado
               </button>
            </div>
         </div>
         
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[150px] -mr-48 -mt-48" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 blur-[150px] -ml-48 -mb-48" />
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { Globe, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";

export default function WebChatIntegrationPage() {
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-12 flex items-center gap-6">
        <Link href="/integrations" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Web Chat Widget</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl">
            <h2 className="text-xl font-black text-gray-900 mb-6">Instalação</h2>
            <p className="text-sm text-gray-500 mb-8 font-medium">Copie o código abaixo e cole antes da tag <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">&lt;/body&gt;</code> do seu site.</p>
            <div className="bg-gray-900 p-8 rounded-2xl text-white font-mono text-xs leading-relaxed relative group">
               <pre className="whitespace-pre-wrap">
{`<script src="https://cdn.leads.site/widget.js"></script>
<script>
  LeadsSite.init({
    token: "XYZ-123-ABC"
  });
</script>`}
               </pre>
               <button className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
                  <Code size={14} />
               </button>
            </div>
         </div>
         <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col items-center justify-center text-center">
            <Globe className="text-blue-500 mb-6" size={48} />
            <h3 className="text-xl font-black text-gray-900 mb-2">Visualização ao Vivo</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-black">Status: Aguardando Conexão</p>
         </div>
      </div>
    </div>
  );
}

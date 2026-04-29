import { Zap, Plus, Bot, Mail, MessageCircle, Settings, ArrowDown } from "lucide-react";

export default function AutomationsPage() {
  const stages = [
    { name: "Lead", automations: [{ type: "bot", title: "Salesbot: Qualificação" }, { type: "task", title: "Tarefa: Primeiro Contato" }] },
    { name: "Descoberta", automations: [{ type: "email", title: "E-mail: Boas-vindas" }] },
    { name: "Proposta", automations: [{ type: "doc", title: "Gerar Proposta PDF" }] },
    { name: "Negociação", automations: [{ type: "alert", title: "Alerta: Estagnação" }] },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "bot": return <Bot size={14} className="text-purple-500" />;
      case "email": return <Mail size={14} className="text-blue-500" />;
      case "doc": return <Zap size={14} className="text-orange-500" />;
      case "message": return <MessageCircle size={14} className="text-green-500" />;
      default: return <Settings size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="p-8 h-full bg-[#fcfcfc]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Digital Pipeline</h1>
          <p className="text-sm text-gray-500 font-medium">Automatize gatilhos e ações por etapa do funil.</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
          <Plus size={18} /> Novo Gatilho
        </button>
      </div>
      
      <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col gap-4 w-[280px] shrink-0">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{stage.name}</span>
              <Settings size={14} className="text-gray-300" />
            </div>
            
            <div className="flex justify-center">
              <ArrowDown size={14} className="text-gray-200" />
            </div>

            <div className="space-y-3">
               {stage.automations.map((auto, j) => (
                 <div key={j} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 group hover:border-blue-200 transition-all cursor-pointer">
                   <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                      {getIcon(auto.type)}
                   </div>
                   <span className="text-xs font-bold text-gray-700">{auto.title}</span>
                 </div>
               ))}
               <button className="w-full border-2 border-dashed border-gray-100 rounded-2xl p-4 flex items-center justify-center text-gray-300 hover:text-gray-900 hover:border-gray-200 transition-all text-xs font-bold">
                 <Plus size={14} className="mr-2" /> Adicionar Ação
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

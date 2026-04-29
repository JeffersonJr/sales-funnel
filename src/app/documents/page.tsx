import { FileText, Download, Trash2, Edit2 } from "lucide-react";

export default function DocumentsPage() {
  const docs = [
    { name: "Proposta_Enterprise_V1.pdf", type: "PDF", size: "1.2MB", date: "28/04/2026" },
    { name: "Contrato_Padrao.docx", type: "DOCX", size: "450KB", date: "25/04/2026" },
    { name: "Apresentação_Vendas.pptx", type: "PPTX", size: "5.6MB", date: "20/04/2026" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Central de Documentos</h1>
      <p className="text-sm text-gray-500 mb-8">Gerencie todos os arquivos e propostas do sistema.</p>
      
      <div className="grid grid-cols-1 gap-4">
        {docs.map((doc, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.type} • {doc.size} • Enviado em {doc.date}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Edit2 size={16} /></button>
              <button className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={16} /></button>
              <button className="p-2 hover:bg-gray-900 hover:text-white rounded-lg text-gray-900 transition-colors"><Download size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

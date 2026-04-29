import mockDb from "@/data/mock-db.json";
import { User, Mail, Phone, Calendar } from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Base de Leads</h1>
      <p className="text-sm text-gray-500 mb-8">Todos os contatos e prospecções em um só lugar.</p>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Lead</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Contato</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Origem</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockDb.deals.map(deal => (
              <tr key={deal.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{deal.company}</p>
                      <p className="text-xs text-gray-500">{deal.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={12} /> {deal.profile.contacts[0]?.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={12} /> {deal.profile.contacts[0]?.phone}
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{deal.leadSource}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold uppercase px-2 py-1 bg-blue-50 text-blue-600 rounded">
                    {deal.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

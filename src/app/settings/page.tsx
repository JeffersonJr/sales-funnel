import { User, Shield, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    { title: "Perfil", desc: "Gerencie suas informações pessoais", icon: User },
    { title: "Segurança", desc: "Configurações de senha e 2FA", icon: Shield },
    { title: "Notificações", desc: "Como você deseja ser avisado", icon: Bell },
    { title: "Regional", desc: "Idioma, moeda e fuso horário", icon: Globe },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações</h1>
      <p className="text-sm text-gray-500 mb-8">Personalize sua experiência no Funnel.io.</p>
      
      <div className="grid grid-cols-2 gap-6">
        {sections.map((sec, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 hover:bg-gray-50/50 cursor-pointer transition-colors group">
            <div className="p-4 bg-gray-50 rounded-xl text-gray-400 group-hover:text-gray-900 transition-colors">
              <sec.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{sec.title}</p>
              <p className="text-xs text-gray-500">{sec.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

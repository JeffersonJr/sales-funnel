export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Análise de Performance</h1>
      <p className="text-sm text-gray-500 mb-8">Acompanhe métricas e conversões do seu funil.</p>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Taxa de Conversão</p>
          <p className="text-3xl font-bold text-gray-900">24.8%</p>
          <div className="mt-2 text-[10px] text-green-600 font-bold">+2.4% vs mês passado</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Receita Projetada</p>
          <p className="text-3xl font-bold text-gray-900">R$ 1.2M</p>
          <div className="mt-2 text-[10px] text-gray-400 font-bold">Baseado no pipeline atual</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Velocidade de Vendas</p>
          <p className="text-3xl font-bold text-gray-900">12 dias</p>
          <div className="mt-2 text-[10px] text-red-600 font-bold">-1 dia vs média anual</div>
        </div>
      </div>
    </div>
  );
}

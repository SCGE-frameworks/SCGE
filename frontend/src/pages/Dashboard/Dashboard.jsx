import React from 'react';

// Mocks atualizados baseados no layout do Figma
const mockAtividades = [
  { id: 1, tipo: 'ENTRADA DE ATIVO', descricao: 'Monitor Dell 27"', data: '12/05/2026', valor: '+10 un' },
  { id: 2, tipo: 'SAÍDA DE ATIVO', descricao: 'Teclado Mecânico Keychron', data: '12/05/2026', valor: '-2 un' },
  { id: 3, tipo: 'AJUSTE DE ATIVO', descricao: 'Cadeira Ergonômica', data: '11/05/2026', valor: '0' },
  { id: 4, tipo: 'ENTRADA DE ATIVO', descricao: 'Mouse Logitech MX Master', data: '10/05/2026', valor: '+15 un' },
];

export default function Dashboard() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-950 font-title">Dashboard</h1>
        <p className="text-slate-500">Visão geral do inventário e movimentações</p>
      </header>

      {/* Grid de KPIs - Atualizado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
              {/* Ícone de Caixa */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Total de Ativos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">1.284</p>
          <p className="text-xs text-green-600 font-medium mt-1">+12% este mês</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              {/* Ícone de Dinheiro */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Valor do Inventário</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ 145.200</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              {/* Ícone de Alerta */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Itens em Baixa</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <p className="text-xs text-slate-500 mt-1">Requerem atenção</p>
        </div>
      </div>

      {/* Grid Principal - 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda (Gráfico e Atividades) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gráfico de Movimentações (Mock Visual) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 font-title">Movimentações por Categoria</h2>
            <div className="h-64 flex items-end justify-between gap-2 pb-6 border-b border-slate-100">
              
              {/* Barras simuladas: Valor SEMPRE visível e Barra SEMPRE azul */}
              {[40, 70, 45, 90, 60, 30, 80].map((height, i) => (
                <div key={i} className="w-1/6 bg-brand-500 rounded-t-md relative" style={{ height: `${height}%` }}>
                  {/* Etiqueta de valor fixada */}
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded">
                    {height}
                  </div>
                </div>
              ))}

            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2">
              <span>Eletrônicos</span>
              <span>Móveis</span>
              <span>Periféricos</span>
              <span>Limpeza</span>
              <span>Cabos</span>
              <span>Escritório</span>
              <span>Outros</span>
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 font-title">Atividades Recentes</h2>
              <button className="text-brand-500 hover:text-brand-600 text-sm font-medium">Ver todas</button>
            </div>
            
            <div className="space-y-4">
              {mockAtividades.map((atividade) => (
                <div key={atividade.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      atividade.tipo.includes('ENTRADA') ? 'bg-green-500' : 
                      atividade.tipo.includes('SAÍDA') ? 'bg-red-500' : 'bg-slate-400'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{atividade.descricao}</p>
                      <p className="text-xs text-slate-500">{atividade.tipo} • {atividade.data}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    atividade.tipo.includes('ENTRADA') ? 'text-green-600' : 
                    atividade.tipo.includes('SAÍDA') ? 'text-red-600' : 'text-slate-600'
                  }`}>
                    {atividade.valor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita (Ações Rápidas e Alertas) */}
        <div className="space-y-8">
          
          {/* Ações Rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-title">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors border border-brand-100">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                <span className="text-sm font-medium">Novo Item</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                <span className="text-sm font-medium">Movimentar</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200 col-span-2">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span className="text-sm font-medium">Gerar Relatório</span>
              </button>
            </div>
          </div>

          {/* Itens em Alerta */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-4 font-title">Itens em Alerta</h2>
             <ul className="space-y-4">
               {['Cartucho Impressora HP', 'Papel A4 Resma', 'Cabo HDMI 2m'].map((item, idx) => (
                 <li key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                   <span className="text-sm font-medium text-red-900">{item}</span>
                   <span className="text-xs font-bold text-red-600 px-2 py-1 bg-red-100 rounded">Estoque Baixo</span>
                 </li>
               ))}
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
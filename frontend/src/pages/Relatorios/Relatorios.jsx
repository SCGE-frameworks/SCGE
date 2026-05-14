import React, { useState } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Input } from '../../components/ui';
import ModalRelatorio from './ModalRelatorio';

const coresCategoria = {
  'A': 'bg-blue-100 text-blue-700',
  'B': 'bg-pink-100 text-pink-700',
  'C': 'bg-amber-100 text-amber-700',
};

const mockRelatorios = [
  { id: 'REL-001', nome: 'Item A', categoria: 'A', dataGeracao: '2026-05-12', status: 'Pronto', formato: 'PDF' },
  { id: 'REL-002', nome: 'Item B', categoria: 'B', dataGeracao: '2026-05-10', status: 'Processando', formato: 'XLSX' },
  { id: 'REL-003', nome: 'Item C', categoria: 'C', dataGeracao: '2026-05-08', status: 'Pronto', formato: 'CSV' }
];

const categoriasDisponiveis = ['A', 'B', 'C'];

export default function Relatorios() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const relatoriosFiltrados = mockRelatorios.filter((relatorio) => {
    // 1. Filtro por Busca (Nome ou ID)
    const termoBusca = busca.toLowerCase();
    const matchBusca = relatorio.nome.toLowerCase().includes(termoBusca) || relatorio.id.toLowerCase().includes(termoBusca);
    
    // 2. Filtro por Categoria
    const matchCategoria = categoriaSelecionada === '' || relatorio.categoria === categoriaSelecionada;
    
    // 3. Filtro por Data
    let matchData = true;
    if (dataInicio || dataFim) {
      const dataRel = new Date(relatorio.dataGeracao);
      dataRel.setUTCHours(12, 0, 0, 0);

      const inicio = dataInicio ? new Date(dataInicio) : new Date('2000-01-01');
      inicio.setUTCHours(0, 0, 0, 0);

      const fim = dataFim ? new Date(dataFim) : new Date('2100-01-01');
      fim.setUTCHours(23, 59, 59, 999);
      
      matchData = dataRel >= inicio && dataRel <= fim;
    }

    return matchBusca && matchCategoria && matchData;
  });

  const formatarDataBr = (dataIso) => {
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // NOVA FUNÇÃO: Limpar todos os filtros
  const limparFiltros = () => {
    setBusca('');
    setCategoriaSelecionada('');
    setDataInicio('');
    setDataFim('');
  };

  return (
    <PageWrapper title="Relatórios" description="Gere e gerencie exportações do sistema">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          
          {/* CABEÇALHO DO FILTRO COM BOTÃO LIMPAR */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900">Filtros</h2>
            {(busca || categoriaSelecionada || dataInicio || dataFim) && (
              <button 
                onClick={limparFiltros} 
                className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Limpar todos
              </button>
            )}
          </div>

          <div className="space-y-5">
            <Input 
              label="Buscar por nome" 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Categoria</label>
              <select 
                value={categoriaSelecionada} 
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Todas</option>
                {categoriasDisponiveis.map(cat => <option key={cat} value={cat}>Categoria {cat}</option>)}
              </select>
            </div>

            <Input label="Data Inicial" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            <Input label="Data Final" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              + Gerar Novo Relatório
            </button>
          </div>
        </aside>

        <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {relatoriosFiltrados.length > 0 ? (
                relatoriosFiltrados.map((rel) => (
                  <tr key={rel.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{rel.nome}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${coresCategoria[rel.categoria]}`}>
                        Categoria {rel.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatarDataBr(rel.dataGeracao)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${rel.status === 'Pronto' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {rel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* BOTÃO BAIXAR COM LÓGICA DE DISABLED */}
                      <button 
                        disabled={rel.status !== 'Pronto'}
                        className={`font-medium transition-colors ${
                          rel.status === 'Pronto' 
                            ? 'text-brand-600 hover:underline' 
                            : 'text-slate-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        Baixar {rel.formato}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-slate-500 font-medium">Nenhum relatório encontrado.</p>
                    <p className="text-slate-400 text-xs mt-1">Tente ajustar ou limpar os filtros aplicados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalRelatorio 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categorias={categoriasDisponiveis}
      />
    </PageWrapper>
  );
}
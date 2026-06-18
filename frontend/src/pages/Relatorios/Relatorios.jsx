import React, { useState, useContext } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Input } from '../../components/ui';
import ModalRelatorio from './ModalRelatorio';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';

const coresCategoria = {
  'Tecnologia': 'bg-blue-100 text-blue-700',
  'Eletrodomésticos': 'bg-pink-100 text-pink-700',
  'Móveis': 'bg-amber-100 text-amber-700',
};

export default function Relatorios() {
  const { relatorios, categorias, addRelatorio } = useContext(GlobalStateContext);

  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const relatoriosFiltrados = relatorios.filter((relatorio) => {
    const termoBusca = busca.toLowerCase();
    const matchBusca = relatorio.nome.toLowerCase().includes(termoBusca) || relatorio.id.toLowerCase().includes(termoBusca);
    
    const matchCategoria = categoriaSelecionada === '' || relatorio.categoria === categoriaSelecionada;
    
    let matchData = true;
    if (dataInicio || dataFim) {
      const dataRel = new Date(relatorio.dataGeracao);
      dataRel.setUTCHours(12, 0, 0, 0);

      const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00`) : new Date('2000-01-01');
      const fim = dataFim ? new Date(`${dataFim}T23:59:59`) : new Date('2100-01-01');
      
      matchData = dataRel >= inicio && dataRel <= fim;
    }

    return matchBusca && matchCategoria && matchData;
  });

  const formatarDataBr = (dataIso) => {
    const [ano, mes, dia] = dataIso.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

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
                {categorias.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${coresCategoria[rel.categoria] || 'bg-slate-100 text-slate-700'}`}>
                        {rel.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatarDataBr(rel.dataGeracao)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${rel.status === 'Pronto' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {rel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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
                    <p className="text-slate-500 font-medium">Nenhum relatório encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AQUI: O Modal interno da tela de relatórios TAMBÉM recebe a função! */}
      <ModalRelatorio 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categorias={categorias.map(c => c.name)}
        onSalvar={addRelatorio}
      />
    </PageWrapper>
  );
}
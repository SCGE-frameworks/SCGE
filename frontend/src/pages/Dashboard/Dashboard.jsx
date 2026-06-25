import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_LEVEL } from '../../constants/accessLevels';
import { useAuth } from '../../contexts';
import {
  listarCategoriasApi,
  criarProdutoApi,
  obterAtividadesRecentesApi,
  obterItensParaReporApi,
  obterKpisDashboardApi,
  listarProdutosApi,
} from '../../services';
import ModalProduto from '../Inventario/ModalProduto';

const TIPO_LABEL = {
  IN: 'ENTRADA',
  OUT: 'SAÍDA',
  ADJUSTMENT: 'PERDA',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { hasAccess } = useAuth();
  const canManageProducts = hasAccess(ACCESS_LEVEL.MANAGER);

  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [kpis, setKpis] = useState({ total_itens: 0, abaixo_minimo: 0, movimentacoes_hoje: 0 });
  const [atividades, setAtividades] = useState([]);
  const [itensAlerta, setItensAlerta] = useState([]);
  const [categoriasChart, setCategoriasChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErrorMessage('');

      try {
        const [kpiData, atividadesData, alertaData, categoriasData, produtos] = await Promise.all([
          obterKpisDashboardApi(),
          obterAtividadesRecentesApi(),
          obterItensParaReporApi(),
          listarCategoriasApi(),
          listarProdutosApi(),
        ]);

        setKpis(kpiData);
        setAtividades(atividadesData);
        setItensAlerta(alertaData.slice(0, 5));
        setCategorias(categoriasData);

        const contagemPorCategoria = categoriasData.map((categoria) => ({
          name: categoria.name,
          total: produtos.filter((p) => p.category_id === categoria.id).length,
        }));
        const maxTotal = Math.max(...contagemPorCategoria.map((c) => c.total), 1);
        setCategoriasChart(
          contagemPorCategoria.map((item) => ({
            ...item,
            height: Math.round((item.total / maxTotal) * 100),
          })),
        );
      } catch (error) {
        setErrorMessage(error?.message || 'Não foi possível carregar o dashboard.');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  async function salvarProduto(produto) {
    await criarProdutoApi(produto);
    setModalProdutoAberto(false);
    window.location.reload();
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-950 font-title">Dashboard</h1>
        <p className="text-slate-500">Visão geral do inventário e movimentações</p>
      </header>

      {errorMessage && (
        <div role="alert" className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Total de Produtos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '—' : kpis.total_itens}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Movimentações Hoje</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '—' : kpis.movimentacoes_hoje}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Itens em Baixa</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '—' : kpis.abaixo_minimo}</p>
          <p className="text-xs text-slate-500 mt-1">Requerem atenção</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 font-title">Produtos por Categoria</h2>
            {categoriasChart.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum dado disponível.</p>
            ) : (
              <>
                <div className="h-64 flex items-end justify-between gap-2 pb-6 border-b border-slate-100">
                  {categoriasChart.map((item) => (
                    <div key={item.name} className="flex-1 bg-brand-500 rounded-t-md relative" style={{ height: `${Math.max(item.height, 8)}%` }}>
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded">{item.total}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2 gap-2">
                  {categoriasChart.map((item) => (
                    <span key={item.name} className="truncate text-center flex-1">{item.name}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 font-title">Atividades Recentes</h2>
              <Link to="/movimentacoes" className="text-brand-500 hover:text-brand-600 text-sm font-medium">Ver todas</Link>
            </div>
            <div className="space-y-4">
              {atividades.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma movimentação registrada.</p>
              ) : atividades.map((atividade) => (
                <div key={atividade.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${atividade.type === 'IN' ? 'bg-green-500' : atividade.type === 'OUT' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{atividade.item_name}</p>
                      <p className="text-xs text-slate-500">
                        {TIPO_LABEL[atividade.type] ?? atividade.type} • {new Date(atividade.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${atividade.type === 'IN' ? 'text-green-600' : atividade.type === 'OUT' ? 'text-red-600' : 'text-amber-600'}`}>
                    {atividade.type === 'IN' ? '+' : atividade.type === 'OUT' ? '-' : ''}{atividade.quantity} un
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-title">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              {canManageProducts && (
                <button
                  type="button"
                  onClick={() => setModalProdutoAberto(true)}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors border border-brand-100"
                >
                  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  <span className="text-sm font-medium">Novo Produto</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/movimentacoes')}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
              >
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                <span className="text-sm font-medium">Movimentar</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/relatorios')}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200 col-span-2"
              >
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span className="text-sm font-medium">Ver Relatórios</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-title">Itens em Alerta</h2>
            <ul className="space-y-4">
              {itensAlerta.length === 0 ? (
                <li className="text-sm text-slate-500">Nenhum item em alerta.</li>
              ) : itensAlerta.map((item) => (
                <li key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-sm font-medium text-red-900">{item.name}</span>
                  <span className="text-xs font-bold text-red-600 px-2 py-1 bg-red-100 rounded">
                    {item.quantity}/{item.min_quantity} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {canManageProducts && (
        <ModalProduto
          isOpen={modalProdutoAberto}
          onClose={() => setModalProdutoAberto(false)}
          categorias={categorias}
          onSalvar={salvarProduto}
        />
      )}
    </div>
  );
}

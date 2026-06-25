import { useEffect, useState } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Input } from '../../components/ui';
import {
  exportarCsvEstoqueBaixo,
  listarCategoriasApi,
  obterRelatorioEstoqueBaixoApi,
} from '../../services';

const coresCategoria = {
  blue: 'bg-blue-100 text-blue-700',
  pink: 'bg-pink-100 text-pink-700',
  amber: 'bg-amber-100 text-amber-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
};

export default function Relatorios() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErrorMessage('');

      try {
        const [listaProdutos, listaCategorias] = await Promise.all([
          obterRelatorioEstoqueBaixoApi(),
          listarCategoriasApi(),
        ]);
        setProdutos(listaProdutos);
        setCategorias(listaCategorias);
      } catch (error) {
        setErrorMessage(error?.message || 'Não foi possível carregar o relatório.');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const buscarCategoria = (categoryId) =>
    categorias.find((categoria) => String(categoria.id) === String(categoryId));

  const produtosFiltrados = produtos.filter((produto) => {
    const termoBusca = busca.toLowerCase();
    const matchBusca =
      produto.name.toLowerCase().includes(termoBusca) ||
      produto.sku.toLowerCase().includes(termoBusca);
    const matchCategoria =
      categoriaSelecionada === '' ||
      String(produto.category_id) === String(categoriaSelecionada);

    return matchBusca && matchCategoria;
  });

  const limparFiltros = () => {
    setBusca('');
    setCategoriaSelecionada('');
  };

  return (
    <PageWrapper title="Relatórios" description="Produtos com estoque abaixo do mínimo">
      {errorMessage && (
        <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-slate-900">Filtros</h2>
            {(busca || categoriaSelecionada) && (
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
              label="Buscar por nome ou código"
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
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => exportarCsvEstoqueBaixo(produtosFiltrados)}
              disabled={produtosFiltrados.length === 0}
              className="w-full mt-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Exportar CSV
            </button>
          </div>
        </aside>

        <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <h3 className="font-semibold text-slate-900">Relatório de Estoque Baixo</h3>
            <p className="text-sm text-slate-500 mt-1">
              {loading ? 'Carregando...' : `${produtosFiltrados.length} produto(s) encontrado(s)`}
            </p>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Quantidade</th>
                <th className="px-6 py-4">Mínimo</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    Carregando relatório...
                  </td>
                </tr>
              ) : produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((produto) => {
                  const categoria = buscarCategoria(produto.category_id);

                  return (
                    <tr key={produto.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">{produto.sku}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{produto.name}</td>
                      <td className="px-6 py-4">
                        {categoria ? (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${coresCategoria[categoria.color] ?? 'bg-slate-100 text-slate-700'}`}>
                            {categoria.name}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4">{produto.quantity} {produto.unit}</td>
                      <td className="px-6 py-4">{produto.min_quantity}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-red-50 text-red-700">
                          Estoque Baixo
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-slate-500 font-medium">Nenhum produto com estoque baixo.</p>
                    <p className="text-slate-400 text-xs mt-1">Ajuste os filtros ou aguarde novas movimentações.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}

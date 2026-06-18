import { useState, useContext } from 'react';
import { AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Card, Table } from '../../components/ui';
import ModalProduto from './ModalProduto';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';
import { PageWrapper } from '../../components/layout/PageWrapper';

const coresCategoria = {
  'Tecnologia': 'bg-blue-100 text-blue-700',
  'Eletrodomésticos': 'bg-pink-100 text-pink-700',
  'Móveis': 'bg-amber-100 text-amber-700',
};

function Inventario() {
  // Puxando as funções de atualização e delete do contexto
  const { items, categorias, addProduto, updateProduto, deleteProduto } = useContext(GlobalStateContext);

  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  const totalItens = items.length;
  const estoqueBaixo = items.filter((i) => i.quantity <= i.min_quantity).length;

  const buscarCategoria = (categoryId) => categorias.find((c) => String(c.id) === String(categoryId));

  const obterStatus = (item) => item.quantity <= item.min_quantity ? 'Baixo' : 'Suficiente';

  const itensFiltrados = items.filter((item) => {
    if (categoriaFiltro && String(item.category_id) !== String(categoriaFiltro)) return false;
    if (statusFiltro && obterStatus(item) !== statusFiltro) return false;
    return true;
  });

  function abrirNovoProduto() {
    setItemEditando(null); // Garante que é um NOVO produto
    setModalAberto(true);
  }

  function salvarProduto(produto) {
    if (itemEditando) {
      updateProduto(itemEditando.id, produto); // Atualiza o existente
    } else {
      addProduto(produto); // Cria um novo
    }
    setModalAberto(false);
    setItemEditando(null);
  }

  function excluirProduto(id) {
    if (confirm('Tem certeza que deseja deletar este item do inventário?')) {
      deleteProduto(id); // Deleta de verdade do Contexto
    }
  }

  return (
    <PageWrapper title="Inventário" description="Gestão de todo o patrimônio corporativo.">
      <section className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-3">
            <div className="rounded-xl border border-slate-200 border-l-4 border-l-brand-500 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase text-slate-500">Total Itens</p>
              <p className="mt-1 text-2xl font-bold text-brand-500">{totalItens}</p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-orange-200 border-l-4 border-l-orange-500 bg-orange-50 px-5 py-3 shadow-sm">
              <div>
                <p className="text-xs font-medium uppercase text-orange-700">Estoque Baixo</p>
                <p className="mt-1 text-2xl font-bold text-orange-700">{estoqueBaixo}</p>
              </div>
              <AlertTriangle size={20} className="text-orange-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 p-4">
          <div className="flex gap-3">
            <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium uppercase text-slate-700 shadow-sm hover:border-slate-300">
              <option value="">Categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium uppercase text-slate-700 shadow-sm hover:border-slate-300">
              <option value="">Status</option>
              <option value="Suficiente">Suficiente</option>
              <option value="Baixo">Baixo</option>
            </select>
          </div>

          <Button variant="primary" onClick={abrirNovoProduto} className="gap-2">
            <Plus size={16} />
            Novo Produto
          </Button>
        </div>

        <Card>
          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="py-3 px-4 text-center">Código</th>
                <th className="py-3 px-4 text-center">Nome</th>
                <th className="py-3 px-4 text-center">Categoria</th>
                <th className="py-3 px-4 text-center">Quantidade</th>
                <th className="py-3 px-4 text-center">Estoque Mín.</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : itensFiltrados.map((item) => {
                const categoria = buscarCategoria(item.category_id);
                const status = obterStatus(item);

                return (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-500 text-center">{item.sku || `PRD-00${item.id}`}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-900 text-center">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-center">
                      {categoria ? (
                        <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium uppercase ${coresCategoria[categoria.name] || 'bg-slate-100 text-slate-800'}`}>{categoria.name}</span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-900 text-center">{`${item.quantity} ${item.unit || 'un'}`}</td>
                    <td className="py-3 px-4 text-sm text-slate-500 text-center">{item.min_quantity}</td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${status === 'Baixo' ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className={status === 'Baixo' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>{status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button type="button" onClick={() => { setItemEditando(item); setModalAberto(true); }} className="text-slate-400 hover:text-brand-500">
                          <Pencil size={18} />
                        </button>
                        <button type="button" onClick={() => excluirProduto(item.id)} className="text-slate-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>

        <ModalProduto 
          isOpen={modalAberto} 
          onClose={() => { setModalAberto(false); setItemEditando(null); }} 
          categorias={categorias} 
          item={itemEditando} 
          onSalvar={salvarProduto} 
        />
      </section>
    </PageWrapper>
  );
}

export default Inventario;
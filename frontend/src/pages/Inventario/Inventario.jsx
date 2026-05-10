import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, Table } from '../../components/ui';
import { listarItens, listarCategorias } from '../../services';

const coresCategoria = {
  blue:  'bg-blue-100 text-blue-700',
  pink:  'bg-pink-100 text-pink-700',
  amber: 'bg-amber-100 text-amber-700',
};

function Inventario() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    setItems(listarItens());
    setCategorias(listarCategorias());
  }, []);

  const totalItens = items.length;
  const estoqueBaixo = items.filter((i) => i.quantity < i.min_quantity).length;

  const buscarCategoria = (categoryId) =>
    categorias.find((c) => c.id === categoryId);

  const obterStatus = (item) =>
    item.quantity < item.min_quantity ? 'Baixo' : 'Suficiente';

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Inventário Geral</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie o fluxo de entrada e saída de materiais com precisão.
          </p>
        </div>

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
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const categoria = buscarCategoria(item.category_id);
              const status = obterStatus(item);

              return (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-3 px-4 text-sm text-slate-500 text-center">{item.sku}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-900 text-center">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    {categoria ? (
                      <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium uppercase ${coresCategoria[categoria.color]}`}>
                        {categoria.name}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-900 text-center">{item.quantity} {item.unit}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 text-center">{item.min_quantity}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${status === 'Baixo' ? 'bg-red-500' : 'bg-green-500'}`} />
                      <span className={status === 'Baixo' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {status}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </section>
  );
}

export default Inventario;
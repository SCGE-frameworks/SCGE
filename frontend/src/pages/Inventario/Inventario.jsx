import { useState, useEffect } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
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

  const buscarCategoria = (categoryId) =>
    categorias.find((c) => c.id === categoryId);

  const obterStatus = (item) =>
    item.quantity < item.min_quantity ? 'Baixo' : 'Suficiente';

  return (
    <PageWrapper
      title="Inventário"
      description="Gerencie os produtos cadastrados"
    >
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
    </PageWrapper>
  );
}

export default Inventario;
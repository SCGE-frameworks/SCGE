import { useState, useEffect } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Table } from '../../components/ui';
import { listarItens, listarCategorias } from '../../services';

function Inventario() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    setItems(listarItens());
    setCategorias(listarCategorias());
  }, []);

  const obterNomeCategoria = (categoryId) => {
    const categoria = categorias.find((c) => c.id === categoryId);
    return categoria ? categoria.name : '—';
  };

  const obterStatus = (item) => {
    return item.quantity < item.min_quantity ? 'Baixo' : 'Suficiente';
  };

  return (
    <PageWrapper
      title="Inventário"
      description="Gerencie os produtos cadastrados"
    >
      <Table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Estoque Mín.</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{obterNomeCategoria(item.category_id)}</td>
              <td>{item.quantity} {item.unit}</td>
              <td>{item.min_quantity}</td>
              <td>{obterStatus(item)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageWrapper>
  );
}

export default Inventario;
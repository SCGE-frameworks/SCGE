import { apiRequest } from '../api';
import { listarMovimentacoesApi } from '../movements/movements.api';
import { listarProdutosApi } from '../items/items.service';

function mapProductFromApi(product) {
  return {
    id: product.id,
    sku: product.code,
    name: product.name,
    category_id: product.category_id,
    quantity: product.quantity,
    min_quantity: product.minimum_stock,
    unit: product.unit_of_measure,
    low_stock: product.low_stock,
  };
}

export async function obterRelatorioEstoqueBaixoApi() {
  const response = await apiRequest('/reports/low-stock');
  const products = response.data?.products ?? [];

  return products.map(mapProductFromApi);
}

export async function obterKpisDashboardApi() {
  const products = await listarProdutosApi();
  const movements = await listarMovimentacoesApi(products);

  const hoje = new Date().toDateString();

  return {
    total_itens: products.length,
    abaixo_minimo: products.filter((item) => item.low_stock).length,
    movimentacoes_hoje: movements.filter(
      (movement) => new Date(movement.created_at).toDateString() === hoje,
    ).length,
  };
}

export async function obterAtividadesRecentesApi() {
  const products = await listarProdutosApi();
  const movements = await listarMovimentacoesApi(products);

  return movements.slice(0, 5);
}

export async function obterItensParaReporApi() {
  return obterRelatorioEstoqueBaixoApi();
}

export function exportarCsvEstoqueBaixo(produtos) {
  const header = ['Código', 'Nome', 'Quantidade', 'Estoque Mínimo', 'Unidade'];
  const rows = produtos.map((item) => [
    item.sku,
    item.name,
    item.quantity,
    item.min_quantity,
    item.unit,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `scge-estoque-baixo-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

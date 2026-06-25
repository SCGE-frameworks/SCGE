import { apiRequest } from '../api';

const CATEGORY_COLORS = ['blue', 'pink', 'amber', 'green', 'purple'];

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
    is_active: product.is_active,
    created_at: product.created_at,
  };
}

function mapProductToApi(product) {
  return {
    name: product.name,
    code: product.sku,
    quantity: Number(product.quantity),
    unit_of_measure: product.unit,
    minimum_stock: Number(product.min_quantity),
    category_id: Number(product.category_id),
    is_active: product.is_active ?? true,
  };
}

export async function listarProdutosApi() {
  const response = await apiRequest('/products/');
  const products = response.data?.products ?? [];

  return products
    .filter((product) => product.is_active !== false)
    .map(mapProductFromApi);
}

export async function criarProdutoApi(product) {
  const response = await apiRequest('/products/', {
    method: 'POST',
    body: JSON.stringify(mapProductToApi(product)),
  });

  return mapProductFromApi(response.data.product);
}

export async function atualizarProdutoApi(id, product) {
  const response = await apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mapProductToApi(product)),
  });

  return mapProductFromApi(response.data.product);
}

export async function deletarProdutoApi(id) {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
}

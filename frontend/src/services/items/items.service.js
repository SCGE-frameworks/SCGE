import { apiRequest } from '../api';

function mapProductFromApi(product) {
  return {
    id: product.id,
    sku: product.codigo,
    name: product.nome,
    category_id: product.categoria_id,
    quantity: product.quantidade,
    min_quantity: product.estoque_minimo,
    unit: product.unid_medida,
  };
}

function mapProductToApi(product) {
  return {
    nome: product.name,
    codigo: product.sku,
    quantidade: Number(product.quantity),
    unid_medida: product.unit,
    estoque_minimo: Number(product.min_quantity),
    categoria_id: Number(product.category_id),
    ativo: true,
  };
}

let items = [
  { id: 1, sku: 'PRD-001', name: 'Item A', category_id: 1, quantity: 100, min_quantity: 20, unit: 'un', price: 50,  is_stagnant: false },
  { id: 2, sku: 'PRD-002', name: 'Item B', category_id: 2, quantity: 5,   min_quantity: 10, unit: 'un', price: 200, is_stagnant: false },
  { id: 3, sku: 'PRD-003', name: 'Item C', category_id: 3, quantity: 30,  min_quantity: 5,  unit: 'un', price: 80,  is_stagnant: true  },
];

export const listarItens = () => items;
export const buscarItemPorId = (id) => items.find((i) => i.id === Number(id));

export const criarItem = (data) => {
  const novo = { id: items.length + 1, is_stagnant: false, ...data };
  items.push(novo);
  return novo;
};

export const atualizarItem = (id, data) => {
  const i = items.findIndex((it) => it.id === Number(id));
  items[i] = { ...items[i], ...data };
  return items[i];
};

export const deletarItem = (id) => {
  items = items.filter((i) => i.id !== Number(id));
};

export async function listarProdutosApi() {
  const response = await apiRequest('/products/');
  const products = [];

  for (const product of response.data) {
    if (product.ativo !== false) {
      products.push(mapProductFromApi(product));
    }
  }

  return products;
}

export async function criarProdutoApi(product) {
  const response = await apiRequest('/products/create', {
    method: 'POST',
    body: JSON.stringify(mapProductToApi(product)),
  });

  return mapProductFromApi(response.data);
}

export async function atualizarProdutoApi(id, product) {
  const response = await apiRequest(`/products/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mapProductToApi(product)),
  });

  return mapProductFromApi(response.data);
}

export async function deletarProdutoApi(id) {
  return apiRequest(`/products/delete/${id}`, {
    method: 'DELETE',
  });
}

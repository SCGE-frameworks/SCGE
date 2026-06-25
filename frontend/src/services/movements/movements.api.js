import { apiRequest } from '../api';

const UI_TYPE_MAP = {
  entry: 'IN',
  exit: 'OUT',
  loss: 'ADJUSTMENT',
};

const API_ENDPOINTS = {
  IN: '/movements/entry',
  OUT: '/movements/exit',
  ADJUSTMENT: '/movements/loss',
};

function mapMovementFromApi(movement, productsById = {}) {
  const product = productsById[movement.product_id];

  return {
    id: movement.id,
    type: UI_TYPE_MAP[movement.type] ?? movement.type,
    product_id: movement.product_id,
    item_name: product?.name ?? `Produto #${movement.product_id}`,
    item_sku: product?.sku ?? product?.code ?? '',
    quantity: movement.quantity,
    reason: movement.notes ?? '',
    notes: movement.notes,
    user_id: movement.user_id,
    created_at: movement.movement_date,
    movement_date: movement.movement_date,
  };
}

export async function listarMovimentacoesApi(products = []) {
  const response = await apiRequest('/movements/');
  const movements = response.data?.movements ?? [];
  const productsById = Object.fromEntries(
    products.map((product) => [product.id, product]),
  );

  return movements.map((movement) => mapMovementFromApi(movement, productsById));
}

export async function registrarMovimentacaoApi(type, { product_id, quantity, notes }) {
  const endpoint = API_ENDPOINTS[type];

  if (!endpoint) {
    throw new Error('Tipo de movimentação inválido.');
  }

  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      product_id: Number(product_id),
      quantity: Number(quantity),
      notes: notes || null,
    }),
  });

  return response.data;
}

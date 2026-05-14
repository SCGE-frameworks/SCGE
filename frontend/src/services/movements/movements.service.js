let movements = [
  { id: 1, type: 'IN',         item_id: 1, item_name: 'Item A', item_sku: 'PRD-001', quantity: 10, user_name: 'Admin',     reason: 'Reposição', created_at: '2026-05-09T08:00:00' },
  { id: 2, type: 'OUT',        item_id: 2, item_name: 'Item B', item_sku: 'PRD-002', quantity: 5,  user_name: 'Usuário 1', reason: 'Venda',     created_at: '2026-05-09T11:00:00' },
  { id: 3, type: 'ADJUSTMENT', item_id: 3, item_name: 'Item C', item_sku: 'PRD-003', quantity: -2, user_name: 'Admin',     reason: 'Ajuste',    created_at: '2026-05-08T14:00:00' },
];

export const listarMovimentacoes = () => movements;

export const registrarEntrada = (data) => {
  const novo = { id: movements.length + 1, type: 'IN', ...data };
  movements.push(novo);
  return novo;
};

export const registrarSaida = (data) => {
  const novo = { id: movements.length + 1, type: 'OUT', ...data };
  movements.push(novo);
  return novo;
};

export const registrarAjuste = (data) => {
  const novo = { id: movements.length + 1, type: 'ADJUSTMENT', ...data };
  movements.push(novo);
  return novo;
};
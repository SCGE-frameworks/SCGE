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
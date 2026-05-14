let categories = [
  { id: 1, name: 'Categoria A', color: 'blue' },
  { id: 2, name: 'Categoria B', color: 'pink' },
  { id: 3, name: 'Categoria C', color: 'amber' },
];

export const listarCategorias = () => categories;

export const criarCategoria = (data) => {
  const nova = { id: categories.length + 1, ...data };
  categories.push(nova);
  return nova;
};

export const atualizarCategoria = (id, data) => {
  const i = categories.findIndex((c) => c.id === Number(id));
  categories[i] = { ...categories[i], ...data };
  return categories[i];
};

export const deletarCategoria = (id) => {
  categories = categories.filter((c) => c.id !== Number(id));
};
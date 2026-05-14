let users = [
  { id: 1, name: 'Admin', email: 'admin@scge.com', role: 'Administrador' },
  { id: 2, name: 'Diogo Queiroz', email: 'diogo.queiroz@scge.com', role: 'Administrador' },
  { id: 3, name: 'Dirceu Neto', email: 'dirceu.neto@scge.com', role: 'Administrador' },
  { id: 4, name: 'Fernando Tinno', email: 'fernando.tinno@scge.com', role: 'Operador' },
];

export const listarUsuarios = () => users;

export const buscarUsuarioPorId = (id) => users.find((u) => u.id === Number(id));

export const criarUsuario = (data) => {
  const novo = { id: users.length + 1, ...data };
  users.push(novo);
  return novo;
};

export const atualizarUsuario = (id, data) => {
  const i = users.findIndex((u) => u.id === Number(id));
  users[i] = { ...users[i], ...data };
  return users[i];
};

export const deletarUsuario = (id) => {
  users = users.filter((u) => u.id !== Number(id));
};
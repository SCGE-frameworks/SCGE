let users = [
  { id: 1, name: 'Diogo',    email: 'diogo@email.com',    role: 'Administrador' },
  { id: 2, name: 'Dirceu',   email: 'dirceu@email.com',   role: 'Administrador' },
  { id: 3, name: 'Fernando', email: 'fernando@email.com', role: 'Operador' },
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
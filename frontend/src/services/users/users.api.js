import { apiRequest } from '../api';

function mapUserFromApi(user) {
  if (!user) return user;

  return {
    ...user,
    nome: user.name ?? user.nome,
    cargo_id: user.role_id ?? user.cargo_id,
    cargo_nome: user.role_name ?? user.cargo_nome,
    ativo: user.is_active ?? user.ativo,
  };
}

export async function listarUsuariosApi() {
  const response = await apiRequest('/users/');
  const users = response.data?.users ?? [];

  return users.map(mapUserFromApi);
}

export async function buscarUsuarioPorIdApi(id) {
  const response = await apiRequest(`/users/${id}`);

  return mapUserFromApi(response.data);
}

export async function criarUsuarioApi(data) {
  const payload = {
    name: data.nome ?? data.name,
    email: data.email,
    password: data.senha ?? data.password,
    role_id: Number(data.cargo_id ?? data.role_id),
  };

  return apiRequest('/users/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function atualizarUsuarioApi(id, data) {
  const payload = {};

  if (data.nome ?? data.name) payload.name = data.nome ?? data.name;
  if (data.email) payload.email = data.email;
  if (data.senha ?? data.password) payload.password = data.senha ?? data.password;
  if (data.cargo_id ?? data.role_id) payload.role_id = Number(data.cargo_id ?? data.role_id);

  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function inativarUsuarioApi(id) {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
}

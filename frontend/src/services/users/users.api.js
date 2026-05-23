import { apiRequest } from '../api';

export async function listarUsuariosApi() {
  const response = await apiRequest('/users/');

  return response.data.users;
}

export async function buscarUsuarioPorIdApi(id) {
  const response = await apiRequest(`/users/${id}`);

  return response.data;
}

export async function criarUsuarioApi(data) {
  const payload = {
    nome: data.nome,
    email: data.email,
    senha: data.senha,
    cargo_id: data.cargo_id,
  };

  return apiRequest('/users/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function atualizarUsuarioApi(id, data) {
  return apiRequest(`/users/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function inativarUsuarioApi(id) {
  return apiRequest(`/users/delete/${id}`, {
    method: 'DELETE',
  });
}

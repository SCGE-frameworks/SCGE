import { apiRequest } from '../api';

export async function listarCargosApi() {
  const response = await apiRequest('/roles/');

  return response.data;
}

export async function criarCargoApi(data) {
  const payload = {
    nome: data.nome,
    ativo: data.ativo,
  };

  return apiRequest('/roles/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function atualizarCargoApi(id, data) {
  const payload = {
    nome: data.nome,
    ativo: data.ativo,
  };

  return apiRequest(`/roles/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function inativarCargoApi(id) {
  return apiRequest(`/roles/delete/${id}`, {
    method: 'DELETE',
  });
}

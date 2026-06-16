import { apiRequest } from '../api';

function mapRoleFromApi(role) {
  if (!role) return role;

  return {
    ...role,
    nome: role.name ?? role.nome,
    ativo: role.is_active ?? role.ativo,
  };
}

export async function listarCargosApi() {
  const response = await apiRequest('/roles/');
  const roles = response.data?.roles ?? response.data ?? [];

  return Array.isArray(roles) ? roles.map(mapRoleFromApi) : [];
}

export async function criarCargoApi(data) {
  const payload = {
    name: data.nome ?? data.name,
    is_active: data.ativo ?? data.is_active ?? true,
  };

  return apiRequest('/roles/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function atualizarCargoApi(id, data) {
  const payload = {
    name: data.nome ?? data.name,
    is_active: data.ativo ?? data.is_active ?? true,
  };

  return apiRequest(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function inativarCargoApi(id) {
  return apiRequest(`/roles/${id}`, {
    method: 'DELETE',
  });
}

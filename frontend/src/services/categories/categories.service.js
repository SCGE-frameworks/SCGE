import { apiRequest } from '../api';

const CATEGORY_COLORS = ['blue', 'pink', 'amber', 'green', 'purple'];

function mapCategoryFromApi(category, index) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    active: category.is_active,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  };
}

export async function listarCategoriasApi() {
  const response = await apiRequest('/categories/');
  const categories = response.data?.categories ?? [];

  return categories
    .filter((category) => category.is_active !== false)
    .map(mapCategoryFromApi);
}

export async function criarCategoriaApi({ name, description }) {
  const response = await apiRequest('/categories/', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });

  return mapCategoryFromApi(response.data.category, 0);
}

export async function atualizarCategoriaApi(id, { name, description }) {
  const response = await apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  });

  return mapCategoryFromApi(response.data.category, 0);
}

export async function deletarCategoriaApi(id) {
  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
}

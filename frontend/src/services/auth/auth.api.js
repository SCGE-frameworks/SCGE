import { apiRequest } from '../api';
import { clearAuth, setAuth } from './auth.storage';

function mapUserFromApi(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    is_active: user.is_active,
    role_id: user.role_id,
    role_name: user.role_name,
    access_level: user.access_level,
    cargo_id: user.role_id,
    cargo_nome: user.role_name,
  };
}

export async function loginApi(email, password) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const { access_token: token, user } = response.data;
  const mappedUser = mapUserFromApi(user);
  setAuth(token, mappedUser);

  return mappedUser;
}

export async function fetchMeApi() {
  const response = await apiRequest('/auth/me');
  const mappedUser = mapUserFromApi(response.data);
  const token = localStorage.getItem('scge:token');

  if (token && mappedUser) {
    setAuth(token, mappedUser);
  }

  return mappedUser;
}

export async function logoutApi() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    clearAuth();
  }
}

export async function forgotPasswordApi(email) {
  const response = await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  return response.data;
}

export async function resetPasswordApi(resetToken, password) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ reset_token: resetToken, password }),
  });
}

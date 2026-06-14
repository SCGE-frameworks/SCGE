import { apiRequest } from '../api';

export async function login({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      senha: password,
    }),
  });
}
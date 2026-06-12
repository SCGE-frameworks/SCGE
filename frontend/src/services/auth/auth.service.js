import { apiRequest } from '../api';
import { listarUsuariosApi } from '../users';

function normalizeUser(user) {
  return {
    id: user.id,
    name: user.nome ?? user.name ?? 'Usuário',
    email: user.email,
    role: user.cargo_nome ?? user.role ?? 'Sem perfil',
    cargo_id: user.cargo_id ?? null,
    cargo_nome: user.cargo_nome ?? user.role ?? 'Sem perfil',
  };
}

export async function login({ email, password }) {
  const authResponse = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      senha: password,
    }),
  });

  const accessToken = authResponse?.data?.access_token;

  if (!accessToken) {
    throw new Error('A API não retornou o token de acesso.');
  }

  const usuarios = await listarUsuariosApi();
  const user = usuarios.find(
    (usuario) => usuario.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    throw new Error('Login realizado, mas não foi possível carregar os dados do usuário.');
  }

  return {
    access_token: accessToken,
    token_type: authResponse?.data?.token_type ?? 'bearer',
    user: normalizeUser(user),
  };
}
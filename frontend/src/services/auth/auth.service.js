import { listarUsuarios } from '../users';

export const login = ({ email, password }) => {
  if (password !== '123456') return null;

  const user = listarUsuarios().find((u) => u.email === email);
  if (!user) return null;

  return {
    access_token: 'mock.jwt.token',
    user,
  };
};
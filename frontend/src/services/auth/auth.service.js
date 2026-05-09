export const login = ({ email, password }) => {
  if (email === 'admin@scge.com' && password === '123456') {
    return { access_token: 'mock.jwt.token', token_type: 'Bearer' };
  }
  return null;
};


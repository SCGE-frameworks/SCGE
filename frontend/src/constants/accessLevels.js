export const ACCESS_LEVEL = {
  VIEWER: 1,
  OPERATOR: 2,
  MANAGER: 3,
  ADMIN: 4,
};

export const ACCESS_LEVEL_LABELS = {
  1: 'Consulta',
  2: 'Operador',
  3: 'Gerente',
  4: 'Administrador',
};

export function hasMinAccess(user, minLevel) {
  return Number(user?.access_level ?? 0) >= minLevel;
}

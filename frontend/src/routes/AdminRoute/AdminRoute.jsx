import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const storedUser = localStorage.getItem('scge:user');

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    const perfil = user?.cargo_nome || user?.role;

    if (perfil !== 'Administrador') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;

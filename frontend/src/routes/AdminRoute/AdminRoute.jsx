import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const storedUser = localStorage.getItem('scge:user');

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (user?.role !== 'Administrador') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;

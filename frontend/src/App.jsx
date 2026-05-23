import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthenticatedLayout } from './layouts';
import {
  Dashboard,
  ForgotPassword,
  Inventario,
  Login,
  Movimentacoes,
  PerfisAcesso,
  Relatorios,
  ResetPassword,
  Usuarios,
} from './pages';
import { AdminRoute } from './routes/AdminRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
            <Route path="/relatorios" element={<Relatorios />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/usuarios" element={<Usuarios />} />
              <Route path="/admin/perfis-acesso" element={<PerfisAcesso />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

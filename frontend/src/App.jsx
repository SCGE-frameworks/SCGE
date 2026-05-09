import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <AuthenticatedLayout>
              <h1 className="text-2xl font-semibold text-slate-900">
                Dashboard
              </h1>
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/inventario"
          element={
            <AuthenticatedLayout>
              <h1>Inventário</h1>
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/movimentacoes"
          element={
            <AuthenticatedLayout>
              <h1>Movimentações</h1>
            </AuthenticatedLayout>
          }
        />

        <Route
          path="/relatorios"
          element={
            <AuthenticatedLayout>
              <h1>Relatórios</h1>
            </AuthenticatedLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
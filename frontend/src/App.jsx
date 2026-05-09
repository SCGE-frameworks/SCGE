import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthenticatedLayout } from './layouts';
import { Dashboard, Inventario, Movimentacoes, Relatorios } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/dashboard"
              element={
                <h1 className="font-title text-2xl font-semibold text-slate-950">
                  Dashboard
                </h1>
              }
            />

            <Route
              path="/inventario"
              element={
                <h1 className="font-title text-2xl font-semibold text-slate-950">
                  Inventário
                </h1>
              }
            />

            <Route
              path="/movimentacoes"
              element={
                <h1 className="font-title text-2xl font-semibold text-slate-950">
                  Movimentações
                </h1>
              }
            />

            <Route
              path="/relatorios"
              element={
                <h1 className="font-title text-2xl font-semibold text-slate-950">
                  Relatórios
                </h1>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
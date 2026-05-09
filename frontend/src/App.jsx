import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header />

          <main className="flex-1 px-6 py-8">
            <Routes>
              <Route path="/dashboard" element={<h1>Dashboard</h1>} />
              <Route path="/inventario" element={<h1>Inventário</h1>} />
              <Route path="/movimentacoes" element={<h1>Movimentações</h1>} />
              <Route path="/relatorios" element={<h1>Relatórios</h1>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
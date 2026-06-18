import React, { createContext, useState } from 'react';

const categoriasIniciais = [
  { id: 1, name: 'Tecnologia' },
  { id: 2, name: 'Eletrodomésticos' },
  { id: 3, name: 'Móveis' }
];

const itemsIniciais = [
  { id: 1, name: 'Notebook Dell Inspiron', category_id: 1, quantity: 15, min_quantity: 5, price: 3500.00, unit: 'un', sku: 'PRD-001' },
  { id: 2, name: 'Monitor LG UltraWide', category_id: 1, quantity: 8, min_quantity: 10, price: 1200.00, unit: 'un', sku: 'PRD-002' },
];

const movimentacoesIniciais = [];
const relatoriosIniciais = [];

const cargosIniciais = [
  { id: 1, nome: 'Administrador', access_level: '4' },
  { id: 2, nome: 'Operador', access_level: '2' },
];

const usuariosIniciais = [
  { id: 1, nome: 'Admin', email: 'admin@scge.com', cargo_id: 1, senha: '123', ativo: true },
  { id: 4, nome: 'Fernando Tinno', email: 'fernando.tinno@scge.com', cargo_id: 2, senha: '123', ativo: true },
];

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [categorias] = useState(categoriasIniciais);
  const [items, setItems] = useState(itemsIniciais);
  const [movimentacoes, setMovimentacoes] = useState(movimentacoesIniciais);
  const [relatorios, setRelatorios] = useState(relatoriosIniciais);
  const [cargos, setCargos] = useState(cargosIniciais);
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, tipo: 'INFO', msg: 'Sistema SCGE inicializado', lida: false }
  ]);

  const addProduto = (produto) => setItems(prev => [...prev, { ...produto, id: Date.now() }]);
  const updateProduto = (id, produto) => setItems(prev => prev.map(item => item.id === id ? { ...item, ...produto } : item));
  const deleteProduto = (id) => setItems(prev => prev.filter(item => item.id !== id));
  
  const addMovimentacao = (mov) => {
    setMovimentacoes(prev => [{ ...mov, id: Date.now() }, ...prev]);
    setNotificacoes(prev => [{ id: Date.now(), tipo: 'INFO', msg: `Nova movimentação: ${mov.item_name}`, lida: false }, ...prev]);
  };

  const addRelatorio = (rel) => {
    setRelatorios(prev => [{ ...rel, id: `REL-${Date.now().toString().slice(-3)}` }, ...prev]);
    setNotificacoes(prev => [{ id: Date.now(), tipo: 'INFO', msg: `Relatório "${rel.nome}" gerado`, lida: false }, ...prev]);
  };

  const addCargo = (cargo) => setCargos(prev => [...prev, { ...cargo, id: Date.now() }]);
  const updateCargo = (id, cargo) => setCargos(prev => prev.map(c => c.id === id ? { ...c, ...cargo } : c));
  const deleteCargo = (id) => setCargos(prev => prev.filter(c => c.id !== id));

  const addUsuario = (usuario) => setUsuarios(prev => [...prev, { ...usuario, id: Date.now(), ativo: true }]);
  const updateUsuario = (id, usuario) => setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...usuario } : u));
  const inativarUsuario = (id) => setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u));

  return (
    <GlobalStateContext.Provider value={{
      categorias, items, addProduto, updateProduto, deleteProduto,
      movimentacoes, addMovimentacao, relatorios, addRelatorio,
      cargos, addCargo, updateCargo, deleteCargo,
      usuarios, addUsuario, updateUsuario, inativarUsuario,
      notificacoes, setNotificacoes
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
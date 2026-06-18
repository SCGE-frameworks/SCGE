import React, { createContext, useState } from 'react';

// Mocks Realistas Iniciais
const categoriasIniciais = [
  { id: 1, name: 'Tecnologia' },
  { id: 2, name: 'Eletrodomésticos' },
  { id: 3, name: 'Móveis' }
];

const itemsIniciais = [
  { id: 1, name: 'Notebook Dell Inspiron', category_id: 1, quantity: 15, min_quantity: 5, price: 3500.00, unit: 'un', sku: 'PRD-001' },
  { id: 2, name: 'Monitor LG UltraWide', category_id: 1, quantity: 8, min_quantity: 10, price: 1200.00, unit: 'un', sku: 'PRD-002' },
  { id: 3, name: 'Micro-ondas Brastemp', category_id: 2, quantity: 3, min_quantity: 2, price: 600.00, unit: 'un', sku: 'PRD-003' },
  { id: 4, name: 'Cadeira Ergonômica', category_id: 3, quantity: 12, min_quantity: 5, price: 850.00, unit: 'un', sku: 'PRD-004' },
];

const movimentacoesIniciais = [
  { id: 1, type: 'IN', item_name: 'Notebook Dell Inspiron', quantity: 15, reason: 'Estoque Inicial', created_at: new Date('2026-06-10T12:00:00').toISOString() },
  { id: 2, type: 'OUT', item_name: 'Monitor LG UltraWide', quantity: 2, reason: 'Venda Direta', created_at: new Date('2026-06-15T12:30:00').toISOString() },
];

const relatoriosIniciais = [
  { id: 'REL-001', nome: 'Auditoria Inicial', categoria: 'Tecnologia', dataGeracao: new Date('2026-06-15T12:00:00').toISOString(), status: 'Pronto', formato: 'PDF' },
];

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [categorias] = useState(categoriasIniciais);
  const [items, setItems] = useState(itemsIniciais);
  const [movimentacoes, setMovimentacoes] = useState(movimentacoesIniciais);
  const [relatorios, setRelatorios] = useState(relatoriosIniciais);

  // PRODUTOS (Agora com Edição e Exclusão)
  const addProduto = (produto) => {
    setItems(prev => [...prev, { ...produto, id: Date.now() }]);
  };
  
  const updateProduto = (id, produto) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...produto } : item));
  };

  const deleteProduto = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  // MOVIMENTAÇÕES
  const addMovimentacao = (mov) => {
    setMovimentacoes(prev => [{ ...mov, id: Date.now() }, ...prev]);
  };

  // RELATÓRIOS
  const addRelatorio = (rel) => {
    setRelatorios(prev => [{ ...rel, id: `REL-${Date.now().toString().slice(-3)}` }, ...prev]);
  };

  return (
    <GlobalStateContext.Provider value={{
      categorias,
      items, addProduto, updateProduto, deleteProduto,
      movimentacoes, addMovimentacao,
      relatorios, addRelatorio
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
import { apiRequest } from '../api';


let movements = [
  { id: 1, type: 'IN', item_id: 1, item_name: 'Item A', item_sku: 'PRD-001', quantity: 10, user_name: 'Admin', reason: 'Reposição', created_at: '2026-05-09T08:00:00' },
  { id: 2, type: 'OUT', item_id: 2, item_name: 'Item B', item_sku: 'PRD-002', quantity: 5, user_name: 'Usuário 1', reason: 'Venda', created_at: '2026-05-09T11:00:00' },
  { id: 3, type: 'ADJUSTMENT', item_id: 3, item_name: 'Item C', item_sku: 'PRD-003', quantity: -2, user_name: 'Admin', reason: 'Ajuste', created_at: '2026-05-08T14:00:00' },
];

export const listarMovimentacoes = () => movements;

export const registrarEntrada = (data) => {
  const novo = { id: movements.length + 1, type: 'IN', ...data };
  movements.push(novo);
  return novo;
};

export const registrarSaida = (data) => {
  const novo = { id: movements.length + 1, type: 'OUT', ...data };
  movements.push(novo);
  return novo;
};

export const registrarAjuste = (data) => {
  const novo = { id: movements.length + 1, type: 'ADJUSTMENT', ...data };
  movements.push(novo);
  return novo;
};


function mapTipoParaTela(tipo) {
  const mapa = {
    entrada: 'IN',
    saida: 'OUT',
    perda: 'LOSS',
  };
  return mapa[tipo] ?? tipo;
}


function mapTipoParaApi(tipo) {
  const mapa = {
    IN: 'entrada',
    OUT: 'saida',
    LOSS: 'perda',
  };
  return mapa[tipo] ?? tipo;
}


function getUsuarioIdLogado() {
  try {
    const user = JSON.parse(localStorage.getItem('scge:user'));
    return user?.id ?? 1;
  } catch {
    return 1;
  }
}

export async function listarMovimentacoesApi() {
  const response = await apiRequest('/movements/');

  return response.data.movements.map((m) => ({
    id: m.id,
    type: mapTipoParaTela(m.tipo),
    produto_id: m.produto_id,
    item_name: m.produto_nome,
    usuario_id: m.usuario_id,
    user_name: m.usuario_nome,
    quantity: m.quantidade,
    reason: m.observacao ?? '—',
    created_at: m.data_movimentacao,
  }));
}

export async function registrarEntradaApi(dados) {
  return apiRequest('/movements/create_entry', {
    method: 'POST',
    body: JSON.stringify({
      tipo: 'entrada',
      produto_id: dados.produto_id,
      quantidade: dados.quantidade,
      observacao: dados.observacao,
      usuario_id: getUsuarioIdLogado(),
    }),
  });
}

export async function registrarSaidaApi(dados) {
  return apiRequest('/movements/create_exit', {
    method: 'POST',
    body: JSON.stringify({
      tipo: 'saida',
      produto_id: dados.produto_id,
      quantidade: dados.quantidade,
      observacao: dados.observacao,
      usuario_id: getUsuarioIdLogado(),
    }),
  });
}

export async function registrarPerdaApi(dados) {
  return apiRequest('/movements/create_loss', {
    method: 'POST',
    body: JSON.stringify({
      tipo: 'perda',
      produto_id: dados.produto_id,
      quantidade: dados.quantidade,
      observacao: dados.observacao,
      usuario_id: getUsuarioIdLogado(),
    }),
  });
}
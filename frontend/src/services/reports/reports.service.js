import { listarItens } from '../items';
import { listarMovimentacoes } from '../movements';

export const obterKpisDashboard = () => {
  const items = listarItens();
  const movements = listarMovimentacoes();
  return {
    total_itens: items.length,
    abaixo_minimo: items.filter((i) => i.quantity < i.min_quantity).length,
    movimentacoes_hoje: movements.length,
  };
};

export const obterAtividadesRecentes = () => listarMovimentacoes();

export const obterMovimentacaoSemanal = () => [
  { dia: 'SEG', entradas: 10, saidas: 5 },
  { dia: 'TER', entradas: 8,  saidas: 7 },
  { dia: 'QUA', entradas: 15, saidas: 4 },
  { dia: 'QUI', entradas: 12, saidas: 6 },
  { dia: 'SEX', entradas: 20, saidas: 8 },
];

export const obterItensParaRepor = () =>
  listarItens().filter((item) => item.quantity <= item.min_quantity);

export const obterEstoqueParado = () =>
  listarItens().filter((item) => item.is_stagnant);
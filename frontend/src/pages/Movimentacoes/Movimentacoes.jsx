import PageWrapper from '../../components/PageWrapper';
import { useState, useEffect } from 'react';
import { Button, Card, Input, Table } from '../../components/ui';
import { listarMovimentacoes, registrarEntrada, registrarSaida, registrarAjuste } from '../../services';

import { ArrowDownCircle, ArrowUpCircle, AlertTriangle } from 'lucide-react';

const TIPO_CONFIG = {
  IN: { label: 'ENTRADA', cor: 'bg-green-100 text-green-700 border border-green-200', icone: <ArrowDownCircle size={13} /> },
  OUT: { label: 'SAÍDA', cor: 'bg-blue-100 text-blue-700 border border-blue-200', icone: <ArrowUpCircle size={13} /> },
  ADJUSTMENT: { label: 'AJUSTE', cor: 'bg-amber-100 text-amber-700 border border-amber-200', icone: <AlertTriangle size={13} /> },
};

const MOTIVOS = ['Reposição Fornecedor', 'Venda Direta', 'Ajuste de Inventário', 'Avaria no Transporte', 'Projeto Interno', 'Outro'];

const ESTOQUE_DISPONIVEL = 142;

const hoje = () => new Date().toISOString().slice(0, 10);

const formatarData = (iso) => {
  const d = new Date(iso);
  return {
    dia: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
    hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
};

function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [periodo, setPeriodo] = useState('hoje');
  const [ordenar, setOrdenar] = useState('recentes');
  const [produto, setProduto] = useState('');
  const [operacao, setOperacao] = useState('IN');
  const [quantidade, setQtd] = useState('');
  const [motivo, setMotivo] = useState('');
  const [data, setData] = useState(hoje());

  const carregar = () => setMovimentacoes(listarMovimentacoes());
  useEffect(() => { carregar(); }, []);

  const qtdNum = Number(quantidade);
  const excede = operacao === 'OUT' && qtdNum > ESTOQUE_DISPONIVEL;
  const invalido = !produto || !quantidade || !motivo || excede;

  const handleLimpar = () => {
    setProduto(''); setOperacao('IN'); setQtd(''); setMotivo(''); setData(hoje());
  };

  const listaFiltrada = [...movimentacoes]
    .filter((m) => {
      const d = new Date(m.created_at);
      const now = new Date();
      if (periodo === 'hoje') return d.toDateString() === now.toDateString();
      if (periodo === 'semana') return (now - d) / 86400000 <= 7;
      if (periodo === 'mes') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return true;
    })
    .sort((a, b) =>
      ordenar === 'recentes'
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  const handleRegistrar = () => {
    if (invalido) return;
    const payload = { item_name: produto, item_sku: '', quantity: qtdNum, reason: motivo, user_name: 'Admin', created_at: new Date(data).toISOString(), type: operacao };
    if (operacao === 'IN') registrarEntrada(payload);
    else if (operacao === 'OUT') registrarSaida(payload);
    else registrarAjuste(payload);
    carregar();
    handleLimpar();
  };
  return (
    <PageWrapper title="Movimentações" description="Gerencie entrada e saída de produtos">

    </PageWrapper>
  );
}

export default Movimentacoes;











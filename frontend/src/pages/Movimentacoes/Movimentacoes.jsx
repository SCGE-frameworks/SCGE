import PageWrapper from '../../components/PageWrapper';
import { useState, useEffect } from 'react';
import { Button, Card, Input, Table } from '../../components/ui';
import { listarMovimentacoes, registrarEntrada, registrarSaida, registrarAjuste } from '../../services';

import { ArrowDownCircle, ArrowUpCircle, AlertTriangle, PlusCircle } from 'lucide-react';

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
      <Card className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-500">
          <PlusCircle size={20} /> Nova Operação
        </h2>

        <Input label="PRODUTO" value={produto} onChange={(e) => setProduto(e.target.value)} placeholder="Nome do produto" />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600">OPERAÇÃO</label>
            <select value={operacao} onChange={(e) => setOperacao(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
              <option value="IN">Entrada</option>
              <option value="OUT">Saída</option>
              <option value="ADJUSTMENT">Ajuste</option>
            </select>
          </div>
          <Input label="QTD" type="number" min="1" value={quantidade} onChange={(e) => setQtd(e.target.value)} />
          <Input label="DATA" type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600">MOTIVO</label>
            <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
              <option value="">Selecione</option>
              {MOTIVOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-end">
            <Button variant="primary" onClick={handleRegistrar} disabled={invalido} className="flex-1">Registrar</Button>
            <Button variant="secondary" onClick={handleLimpar} className="px-4">Limpar</Button>
          </div>
        </div>
      </Card>
    </PageWrapper>
  );
}

export default Movimentacoes;











import { PageWrapper } from "../../components/layout/PageWrapper";
import { useState, useEffect } from 'react';
import { Button, Card, Input, Table } from '../../components/ui';
import {
  listarMovimentacoesApi,
  registrarEntradaApi,
  registrarSaidaApi,
  registrarPerdaApi,
} from '../../services';
import { listarProdutosApi } from '../../services';

import { ArrowDownCircle, ArrowUpCircle, AlertTriangle, PlusCircle } from 'lucide-react';

const TIPO_CONFIG = {
  IN:   { label: 'ENTRADA', cor: 'bg-green-100 text-green-700 border border-green-200', icone: <ArrowDownCircle size={13} /> },
  OUT:  { label: 'SAÍDA',   cor: 'bg-blue-100 text-blue-700 border border-blue-200',   icone: <ArrowUpCircle size={13} /> },
  LOSS: { label: 'PERDA',   cor: 'bg-red-100 text-red-700 border border-red-200',       icone: <AlertTriangle size={13} /> },
};

const MOTIVOS = ['Reposição Fornecedor', 'Venda Direta', 'Ajuste de Inventário', 'Avaria no Transporte', 'Projeto Interno', 'Outro'];

const formatarData = (iso) => {
  const d = new Date(iso);
  return {
    dia: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
    hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
};

function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [erroForm, setErroForm] = useState('');

  const [periodo, setPeriodo] = useState('semana');
  const [ordenar, setOrdenar] = useState('recentes');

  const [produtoId, setProdutoId] = useState('');
  const [operacao, setOperacao] = useState('IN');
  const [quantidade, setQtd] = useState('');
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const [movs, prods] = await Promise.all([
        listarMovimentacoesApi(),
        listarProdutosApi(),
      ]);
      setMovimentacoes(movs);
      setProdutos(prods);
    } catch (error) {
      setErro(error?.message || 'Não foi possível carregar as movimentações.');
    } finally {
      setLoading(false);
    }
  }

  const produtoSelecionado = produtos.find((p) => p.id === Number(produtoId));
  const qtdNum = Number(quantidade);
  const excede = operacao === 'OUT' && produtoSelecionado && qtdNum > produtoSelecionado.quantity;
  const invalido = !produtoId || !quantidade || qtdNum <= 0 || !motivo || excede;

  const handleLimpar = () => {
    setProdutoId('');
    setOperacao('IN');
    setQtd('');
    setMotivo('');
    setErroForm('');
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

  async function handleRegistrar() {
    if (invalido) return;

    setSalvando(true);
    setErroForm('');

    const dados = {
      produto_id: Number(produtoId),
      quantidade: qtdNum,
      observacao: motivo,
    };

    try {
      if (operacao === 'IN')   await registrarEntradaApi(dados);
      if (operacao === 'OUT')  await registrarSaidaApi(dados);
      if (operacao === 'LOSS') await registrarPerdaApi(dados);

      await carregar();
      handleLimpar();
    } catch (error) {
      setErroForm(error?.message || 'Não foi possível registrar a movimentação.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <PageWrapper title="Movimentações" description="Gerencie entrada e saída de produtos">
      <Card className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-500">
          <PlusCircle size={20} /> Nova Operação
        </h2>

        <div>
          <label className="text-xs font-medium text-gray-600">PRODUTO</label>
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600"
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.sku} (estoque: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600">OPERAÇÃO</label>
            <select value={operacao} onChange={(e) => setOperacao(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
              <option value="IN">Entrada</option>
              <option value="OUT">Saída</option>
              <option value="LOSS">Perda</option>
            </select>
          </div>
          <Input label="QTD" type="number" min="1" value={quantidade} onChange={(e) => setQtd(e.target.value)} />
          <div>
            <label className="text-xs font-medium text-gray-600">MOTIVO</label>
            <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
              <option value="">Selecione</option>
              {MOTIVOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {excede && (
          <div role="alert" className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Quantidade maior que o estoque disponível ({produtoSelecionado?.quantity}).
          </div>
        )}

        {erroForm && (
          <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {erroForm}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="primary" onClick={handleRegistrar} disabled={invalido || salvando} className="flex-1">
            {salvando ? 'Registrando...' : 'Registrar'}
          </Button>
          <Button variant="secondary" onClick={handleLimpar} className="px-4">
            Limpar
          </Button>
        </div>
      </Card>

      <Card className="!p-0 mt-6">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-4">
          <h3 className="font-bold">Histórico</h3>

          <div className="flex gap-2">
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm">
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Este mês</option>
              <option value="todos">Todos</option>
            </select>
            <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)} className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm">
              <option value="recentes">Mais recentes</option>
              <option value="antigos">Mais antigos</option>
            </select>
          </div>
        </div>

        {erro && (
          <div role="alert" className="px-6 py-3 text-sm text-red-700 bg-red-50 border-b border-red-100">
            {erro}
          </div>
        )}

        <Table>
          <thead>
            <tr className="border-b bg-slate-50 text-xs uppercase">
              <th className="px-6 py-3 text-left">Data</th>
              <th className="px-6 py-3 text-left">Produto</th>
              <th className="px-6 py-3 text-left">Tipo</th>
              <th className="px-6 py-3 text-center">Qtd</th>
              <th className="px-6 py-3 text-left">Motivo</th>
              <th className="px-6 py-3 text-left">Usuário</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">Carregando...</td></tr>
            ) : listaFiltrada.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">Sem registros</td></tr>
            ) : listaFiltrada.map((m) => (
              <tr key={m.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4 text-sm">{formatarData(m.created_at).dia} às {formatarData(m.created_at).hora}</td>
                <td className="px-6 py-4 text-sm font-medium">{m.item_name}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${TIPO_CONFIG[m.type]?.cor || ''}`}>
                    {TIPO_CONFIG[m.type]?.icone} {TIPO_CONFIG[m.type]?.label || m.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm font-bold">{m.quantity}</td>
                <td className="px-6 py-4 text-sm">{m.reason}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{m.user_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </PageWrapper>
  );
}

export default Movimentacoes;
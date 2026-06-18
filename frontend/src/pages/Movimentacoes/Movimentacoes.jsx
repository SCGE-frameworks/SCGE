import { PageWrapper } from "../../components/layout/PageWrapper";
import { useState, useContext } from 'react';
import { Button, Card, Input, Table } from '../../components/ui';
import { ArrowDownCircle, ArrowUpCircle, PlusCircle } from 'lucide-react';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';

const TIPO_CONFIG = {
  IN: { label: 'ENTRADA', cor: 'bg-green-100 text-green-700 border border-green-200', icone: <ArrowDownCircle size={13} /> },
  OUT: { label: 'SAÍDA', cor: 'bg-blue-100 text-blue-700 border border-blue-200', icone: <ArrowUpCircle size={13} /> },
};

const MOTIVOS = ['Reposição Fornecedor', 'Venda Direta', 'Avaria no Transporte', 'Projeto Interno', 'Outro'];

const formatarData = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
};

function Movimentacoes() {
  const { items, movimentacoes, addMovimentacao } = useContext(GlobalStateContext);
  
  const [periodo, setPeriodo] = useState('semana');
  const [ordenar, setOrdenar] = useState('recentes');
  const [produto, setProduto] = useState('');
  const [operacao, setOperacao] = useState('IN');
  const [quantidade, setQtd] = useState('');
  const [motivo, setMotivo] = useState('');

  const itemSelecionado = items.find(i => i.name === produto);
  const estoqueInsuficiente = operacao === 'OUT' && itemSelecionado && Number(quantidade) > itemSelecionado.quantity;
  const qtdNum = Number(quantidade);
  const invalido = !produto || !quantidade || !motivo || estoqueInsuficiente || qtdNum <= 0;

  const handleLimpar = () => {
    setProduto(''); 
    setOperacao('IN'); 
    setQtd(''); 
    setMotivo(''); 
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
    .sort((a, b) => ordenar === 'recentes' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at));

  const handleRegistrar = () => {
    if (invalido) return;
    addMovimentacao({
      item_name: produto,
      quantity: qtdNum,
      reason: motivo,
      created_at: new Date().toISOString(),
      type: operacao
    });
    handleLimpar();
  };

  return (
    <PageWrapper title="Movimentações" description="Gerencie entrada e saída do estoque">
      <Card className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-brand-500 mb-4">
          <PlusCircle size={20} /> Nova Operação
        </h2>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">PRODUTO CADASTRADO</label>
          <select value={produto} onChange={(e) => setProduto(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Selecione na lista de inventário...</option>
            {items.map(i => (
              <option key={i.id} value={i.name}>{i.name} (Estoque atual: {i.quantity})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">OPERAÇÃO</label>
            <select value={operacao} onChange={(e) => setOperacao(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="IN">Entrada (+)</option>
              <option value="OUT">Saída (-)</option>
            </select>
          </div>
          
          <div>
            <Input label="QUANTIDADE" type="number" min="1" value={quantidade} onChange={(e) => setQtd(e.target.value)} />
            {estoqueInsuficiente && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">Estoque insuficiente!</span>
            )}
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">MOTIVO</label>
            <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Selecione um motivo</option>
              {MOTIVOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={handleLimpar} className="px-8 w-full md:w-auto">Limpar</Button>
          <Button variant="primary" onClick={handleRegistrar} disabled={invalido} className="px-8 w-full md:w-auto">Registrar</Button>
        </div>
      </Card>
      
      <Card className="!p-0 mt-6 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Histórico</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                <th className="px-6 py-3 text-left">Data</th>
                <th className="px-6 py-3 text-left">Produto</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-center">Qtd</th>
                <th className="px-6 py-3 text-left">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">Nenhum registro encontrado.</td></tr>
              ) : listaFiltrada.map((m) => (
                <tr key={m.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{formatarData(m.created_at)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{m.item_name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${TIPO_CONFIG[m.type]?.cor || ''}`}>
                      {TIPO_CONFIG[m.type]?.icone} {TIPO_CONFIG[m.type]?.label || m.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-slate-700">{m.quantity}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </PageWrapper>
  );
}

export default Movimentacoes;
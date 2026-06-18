import React, { useState, useContext } from 'react';
import { Button, Input } from '../../components/ui';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';

const MOTIVOS = ['Reposição Fornecedor', 'Venda Direta', 'Avaria no Transporte', 'Projeto Interno', 'Outro'];

export default function ModalMovimentacao({ isOpen, onClose, onRegistrar }) {
  const { items } = useContext(GlobalStateContext);

  const [produto, setProduto] = useState('');
  const [operacao, setOperacao] = useState('IN');
  const [quantidade, setQtd] = useState('');
  const [motivo, setMotivo] = useState('');

  if (!isOpen) return null;

  const itemSelecionado = items.find(i => i.name === produto);
  const estoqueInsuficiente = operacao === 'OUT' && itemSelecionado && Number(quantidade) > itemSelecionado.quantity;
  const invalido = !produto || !quantidade || !motivo || estoqueInsuficiente || Number(quantidade) <= 0;

  const salvar = (e) => {
    e.preventDefault();
    if (invalido) return;

    onRegistrar({
      item_name: produto,
      type: operacao,
      quantity: Number(quantidade),
      reason: motivo,
      created_at: new Date().toISOString()
    });
    setProduto(''); setQtd(''); setMotivo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={salvar} className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Nova Movimentação Rápida</h2>
          <button type="button" onClick={onClose} className="text-2xl font-bold text-slate-400 hover:text-slate-700">&times;</button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 block">PRODUTO</label>
            <select value={produto} onChange={(e) => setProduto(e.target.value)} className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Selecione um produto cadastrado...</option>
              {items.map(i => (
                <option key={i.id} value={i.name}>{i.name} (Estoque atual: {i.quantity})</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">OPERAÇÃO</label>
              <select value={operacao} onChange={(e) => setOperacao(e.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="IN">Entrada (+)</option>
                <option value="OUT">Saída (-)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Input label="QUANTIDADE" type="number" min="1" required value={quantidade} onChange={(e) => setQtd(e.target.value)} />
              {estoqueInsuficiente && (
                <span className="text-[10px] text-red-500 font-bold">Estoque insuficiente para esta saída!</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">MOTIVO</label>
            <select value={motivo} onChange={(e) => setMotivo(e.target.value)} required className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Selecione um motivo</option>
              {MOTIVOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">Cancelar</button>
          <Button type="submit" variant="primary" disabled={invalido}>Registrar e Salvar</Button>
        </div>
      </form>
    </div>
  );
}
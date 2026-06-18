import React, { useState } from 'react';
import { Button, Input } from '../../components/ui';

const MOTIVOS = ['Reposição Fornecedor', 'Venda Direta', 'Ajuste de Inventário', 'Avaria no Transporte', 'Projeto Interno', 'Outro'];

export default function ModalMovimentacao({ isOpen, onClose, onRegistrar }) {
  const [produto, setProduto] = useState('');
  const [operacao, setOperacao] = useState('IN');
  const [quantidade, setQtd] = useState('');
  const [motivo, setMotivo] = useState('');

  if (!isOpen) return null;

  const invalido = !produto || !quantidade || !motivo;

  const salvar = (e) => {
    e.preventDefault();
    onRegistrar({
      item_name: produto,
      type: operacao,
      quantity: Number(quantidade),
      reason: motivo,
      // Salva a data e hora de agora sem dar opção de escolha!
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
          <Input label="PRODUTO" required value={produto} onChange={(e) => setProduto(e.target.value)} placeholder="Ex: Monitor LG" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">OPERAÇÃO</label>
              <select value={operacao} onChange={(e) => setOperacao(e.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="IN">Entrada</option>
                <option value="OUT">Saída</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </select>
            </div>
            <Input label="QTD" type="number" min="1" required value={quantidade} onChange={(e) => setQtd(e.target.value)} />
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
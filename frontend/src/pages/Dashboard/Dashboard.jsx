import React, { useState, useContext } from 'react';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';
import ModalProduto from '../Inventario/ModalProduto';
import ModalRelatorio from '../Relatorios/ModalRelatorio';
import ModalMovimentacao from '../Movimentacoes/ModalMovimentacao';

export default function Dashboard() {
  // AQUI: Adicionei o addRelatorio que estava faltando!
  const { items, categorias, addProduto, movimentacoes, addMovimentacao, addRelatorio } = useContext(GlobalStateContext);

  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [modalMovimentacaoAberto, setModalMovimentacaoAberto] = useState(false);

  // Cálculos dinâmicos
  const totalAtivos = items.reduce((acc, curr) => acc + Number(curr.quantity), 0);
  const itensEmBaixa = items.filter((i) => i.quantity <= i.min_quantity).length;
  const valorTotal = items.reduce((acc, curr) => acc + (Number(curr.price || 0) * Number(curr.quantity)), 0);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-950 font-title">Dashboard</h1>
        <p className="text-slate-500">Visão geral do inventário e movimentações</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Unidades Totais</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalAtivos}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Valor do Inventário</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-sm font-medium text-slate-500">Itens em Baixa</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{itensEmBaixa}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 font-title">Atividades Recentes</h2>
              <button className="text-brand-500 hover:text-brand-600 text-sm font-medium">Ver todas</button>
            </div>
            <div className="space-y-4">
              {movimentacoes.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma movimentação registrada.</p>
              ) : movimentacoes.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${m.type === 'IN' ? 'bg-green-500' : m.type === 'OUT' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.item_name}</p>
                      <p className="text-xs text-slate-500">{m.type === 'IN' ? 'ENTRADA' : m.type === 'OUT' ? 'SAÍDA' : 'AJUSTE'} • {new Date(m.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${m.type === 'IN' ? 'text-green-600' : m.type === 'OUT' ? 'text-blue-600' : 'text-amber-600'}`}>
                    {m.type === 'IN' ? '+' : m.type === 'OUT' ? '-' : ''}{m.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-title">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setModalProdutoAberto(true)} className="flex flex-col items-center justify-center p-4 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors border border-brand-100">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                <span className="text-sm font-medium">Novo Produto</span>
              </button>
              <button onClick={() => setModalMovimentacaoAberto(true)} className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                <span className="text-sm font-medium">Movimentar</span>
              </button>
              <button onClick={() => setModalRelatorioAberto(true)} className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200 col-span-2">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span className="text-sm font-medium">Gerar Relatório</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalProduto isOpen={modalProdutoAberto} onClose={() => setModalProdutoAberto(false)} categorias={categorias} onSalvar={addProduto} />
      <ModalMovimentacao isOpen={modalMovimentacaoAberto} onClose={() => setModalMovimentacaoAberto(false)} onRegistrar={addMovimentacao} />
      {/* AQUI: O onSalvar={addRelatorio} finalmente conecta o Modal ao Contexto! */}
      <ModalRelatorio isOpen={modalRelatorioAberto} onClose={() => setModalRelatorioAberto(false)} categorias={categorias.map(c => c.name)} onSalvar={addRelatorio} />
    </div>
  );
}
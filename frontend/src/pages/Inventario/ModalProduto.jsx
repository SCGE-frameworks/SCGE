import { useState } from 'react';
import { X, ClipboardList, Warehouse } from 'lucide-react';
import { Button, Input } from '../../components/ui';

function ModalProduto({ isOpen, onClose, categorias }) {
  const [passoAtual, setPassoAtual] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Novo Produto</h2>
            <p className="mt-1 text-xs font-medium uppercase text-slate-500">
              Passo {passoAtual} de 2: {passoAtual === 1 ? 'Dados Essenciais' : 'Controle de Armazém e Preços'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="h-1 bg-slate-100">
          <div className={`h-1 bg-brand-500 ${passoAtual === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        {passoAtual === 1 ? (
          <div className="space-y-5 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2">
                <ClipboardList size={20} className="text-brand-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Dados Essenciais</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Código SKU" placeholder="Ex: PRD-0000" />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Categoria</label>
                <select className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600">
                  <option>Selecione...</option>
                  {categorias?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input label="Nome do Produto" placeholder="Ex: RedBull " />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Descrição (Opcional)</label>
              <textarea placeholder="Breve descrição técnica do item..." rows={3} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30" />
            </div>
          </div>
        ) : (
          <div className="space-y-5 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2">
                <Warehouse size={20} className="text-brand-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Controle de Armazém e Preços</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantidade em Estoque" type="number" placeholder="0" />
              <Input label="Estoque Mínimo" type="number" placeholder="Alerta abaixo de..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Unidade de Medida</label>
                <select className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600">
                  <option>Unidade (un)</option>
                  <option>Caixa (cx)</option>
                  <option>Quilograma (kg)</option>
                  <option>Metro (m)</option>
                </select>
              </div>
              <Input label="Localização no Armazém" placeholder="Ex: Corredor A, Prateleira 2" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={() => setPassoAtual(1)} disabled={passoAtual === 1} className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300">
             Voltar
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Cancelar
            </button>
            {passoAtual === 1 ? (
              <Button variant="primary" onClick={() => setPassoAtual(2)}>
                Próximo 
              </Button>
            ) : (
              <Button variant="primary" onClick={onClose}>
                Finalizar 
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalProduto;
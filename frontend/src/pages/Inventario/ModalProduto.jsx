import { X, ClipboardList } from 'lucide-react';
import { Button, Input } from '../../components/ui';

function ModalProduto({ isOpen, onClose, categorias }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Novo Produto</h2>
            <p className="mt-1 text-xs font-medium uppercase text-slate-500">Passo 1 de 2: Dados Essenciais</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="h-1 bg-slate-100">
          <div className="h-1 w-1/2 bg-brand-500" />
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-50 p-2">
              <ClipboardList size={20} className="text-brand-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Dados</h3>
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

          <Input label="Nome do Produto" placeholder="Ex: Notebook RedBull" />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Descrição (Opcional)</label>
            <textarea placeholder="Breve descrição técnica do item..." rows={3} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" disabled className="text-sm font-medium text-slate-300 cursor-not-allowed">
            ← Voltar
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Cancelar
            </button>
            <Button variant="primary">Próximo →</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalProduto;
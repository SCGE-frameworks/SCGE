import { X } from 'lucide-react';
import { Button } from '../../components/ui';

function ModalProduto({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Novo Produto</h2>
            <p className="mt-1 text-xs font-medium uppercase text-slate-500">
              dados
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-8">
          <p className="text-sm text-slate-500">Contedo</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" className="text-sm font-medium text-slate-400">
             Voltar
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Cancelar
            </button>
            <Button variant="primary">
              Próximo 
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalProduto;
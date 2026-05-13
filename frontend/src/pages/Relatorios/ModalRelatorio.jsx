import React, { useState } from 'react';
import { Button, Input } from '../../components/ui';

function ModalRelatorio({ isOpen, onClose, categorias }) {
  const [arquivo, setArquivo] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        
        {/* Header do Modal */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-50 p-2 text-brand-500 text-sm font-bold">
              DOC
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Novo Relatório</h2>
              <p className="text-xs text-slate-500 uppercase font-medium">Configurações de Geração</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
            &times;
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6 space-y-5">
          <Input label="Nome do Relatório" placeholder="Ex: Item A - Relatório" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">Categoria</label>
              <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option value="">Selecione...</option>
                {categorias?.map((cat) => (
                  <option key={cat} value={cat}>Categoria {cat}</option>
                ))}
              </select>
            </div>
            <Input label="Data" type="date" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Anexar Arquivo (Opcional)</label>
            <div className="mt-1">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 p-6 transition-colors hover:border-brand-400 hover:bg-brand-50"
              >
                <span className="text-sm text-slate-600 font-medium">
                  {arquivo ? arquivo.name : "Clique para selecionar o arquivo"}
                </span>
              </label>
            </div>
            {!arquivo && (
              <p className="mt-1 text-[10px] font-medium text-amber-600 italic">
                * Sem arquivo anexado. Status será "Processando".
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Cancelar
          </button>
          <Button onClick={onClose}>Gerar Relatório</Button>
        </div>
      </div>
    </div>
  );
}

export default ModalRelatorio;
import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import {
  atualizarCategoriaApi,
  criarCategoriaApi,
  deletarCategoriaApi,
} from '../../services';

const FORM_INICIAL = { name: '', description: '' };

function ModalCategorias({ isOpen, onClose, categorias, onChange }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm(FORM_INICIAL);
      setEditandoId(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function iniciarEdicao(categoria) {
    setEditandoId(categoria.id);
    setForm({ name: categoria.name, description: categoria.description ?? '' });
    setErrorMessage('');
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(FORM_INICIAL);
  }

  async function salvar(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    try {
      if (editandoId) {
        await atualizarCategoriaApi(editandoId, payload);
      } else {
        await criarCategoriaApi(payload);
      }

      cancelarEdicao();
      await onChange?.();
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível salvar a categoria.');
    } finally {
      setSubmitting(false);
    }
  }

  async function excluir(id) {
    if (!confirm('Deseja excluir esta categoria?')) return;

    setErrorMessage('');

    try {
      await deletarCategoriaApi(id);
      if (editandoId === id) cancelarEdicao();
      await onChange?.();
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível excluir a categoria.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Categorias</h2>
            <p className="mt-1 text-xs font-medium uppercase text-slate-500">Gestão de categorias</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          {errorMessage && (
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={salvar} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Bebidas"
                required
              />
              <Input
                label="Descrição"
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Mín. 3 caracteres"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Cancelar edição
                </button>
              )}
              <Button type="submit" variant="primary" disabled={submitting} className="gap-2">
                <Plus size={16} />
                {editandoId ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>

          <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200">
            {categorias.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">Nenhuma categoria cadastrada.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {categorias.map((categoria) => (
                  <li key={categoria.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{categoria.name}</p>
                      {categoria.description && (
                        <p className="text-xs text-slate-500">{categoria.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => iniciarEdicao(categoria)} className="text-slate-400 hover:text-brand-500">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => excluir(categoria.id)} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalCategorias;

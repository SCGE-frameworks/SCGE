import { useEffect, useState } from 'react';
import { Pencil, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Button, Card, Input, Table } from '../../components/ui';
import { ACCESS_LEVEL_LABELS } from '../../constants/accessLevels';
import {
  atualizarCargoApi,
  criarCargoApi,
  inativarCargoApi,
  listarCargosApi,
} from '../../services';

const INITIAL_FORM = {
  nome: '',
  access_level: '1',
};

function getRoleName(role) {
  return role.nome ?? role.name ?? 'Sem nome';
}

function PerfisAcesso() {
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [perfilEditando, setPerfilEditando] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  async function carregar() {
    setLoading(true);
    setErrorMessage('');

    try {
      setPerfis(await listarCargosApi());
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível carregar os perfis.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    setPerfilEditando(null);
    setForm(INITIAL_FORM);
    setModalAberto(true);
  }

  function abrirEdicao(perfil) {
    setPerfilEditando(perfil);
    setForm({
      nome: getRoleName(perfil),
      access_level: String(perfil.access_level ?? 1),
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setPerfilEditando(null);
    setForm(INITIAL_FORM);
  }

  async function salvarPerfil(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      nome: form.nome.trim(),
      access_level: Number(form.access_level),
      ativo: true,
    };

    try {
      if (perfilEditando) {
        await atualizarCargoApi(perfilEditando.id, payload);
        setSuccessMessage('Perfil atualizado com sucesso.');
      } else {
        await criarCargoApi(payload);
        setSuccessMessage('Perfil criado com sucesso.');
      }

      fecharModal();
      await carregar();
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível salvar o perfil.');
    } finally {
      setSubmitting(false);
    }
  }

  async function inativarPerfil(id) {
    if (!confirm('Deseja inativar este perfil de acesso?')) return;

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await inativarCargoApi(id);
      setSuccessMessage('Perfil inativado com sucesso.');
      await carregar();
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível inativar o perfil.');
    }
  }

  return (
    <PageWrapper
      title="Perfis de Acesso"
      description="Gerencie os perfis e níveis de acesso do sistema."
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck size={18} />
          <span>Níveis: Consulta (1), Operador (2), Gerente (3), Administrador (4)</span>
        </div>
        <Button variant="primary" onClick={abrirNovo} className="gap-2">
          <Plus size={16} />
          Novo Perfil
        </Button>
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <Card>
        <Table>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <th className="py-3 px-4">Nome</th>
              <th className="py-3 px-4">Nível de Acesso</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                  Carregando perfis...
                </td>
              </tr>
            ) : perfis.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                  Nenhum perfil cadastrado.
                </td>
              </tr>
            ) : perfis.map((perfil) => (
              <tr key={perfil.id} className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm font-medium text-slate-900">{getRoleName(perfil)}</td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  {ACCESS_LEVEL_LABELS[perfil.access_level] ?? perfil.access_level}
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex items-center justify-center gap-3">
                    <button type="button" onClick={() => abrirEdicao(perfil)} className="text-slate-400 hover:text-brand-500">
                      <Pencil size={18} />
                    </button>
                    <button type="button" onClick={() => inativarPerfil(perfil.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={salvarPerfil} className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {perfilEditando ? 'Editar Perfil' : 'Novo Perfil'}
                </h2>
                <p className="mt-1 text-xs font-medium uppercase text-slate-500">Configuração de acesso</p>
              </div>
              <button type="button" onClick={fecharModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <Input
                label="Nome do perfil"
                name="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Operador"
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Nível de acesso</label>
                <select
                  name="access_level"
                  value={form.access_level}
                  onChange={(e) => setForm({ ...form, access_level: e.target.value })}
                  className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600"
                  required
                >
                  {Object.entries(ACCESS_LEVEL_LABELS).map(([level, label]) => (
                    <option key={level} value={level}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button type="button" onClick={fecharModal} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Cancelar
              </button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </PageWrapper>
  );
}

export default PerfisAcesso;

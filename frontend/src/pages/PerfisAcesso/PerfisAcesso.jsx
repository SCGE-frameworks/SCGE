import { useEffect, useState } from 'react';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Button, Card, Input, Table } from '../../components/ui';
import {
  atualizarCargoApi,
  criarCargoApi,
  inativarCargoApi,
  listarCargosApi,
} from '../../services';

const FORM_INICIAL = {
  nome: '',
  access_level: '1',
};

const niveisAcesso = {
  1: 'Visualizador',
  2: 'Operador',
  3: 'Gerente',
  4: 'Administrador',
};

function PerfisAcesso() {
  const [cargos, setCargos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [cargoEditando, setCargoEditando] = useState(null);
  const [feedback, setFeedback] = useState('');

  async function carregarCargos() {
    const cargosResponse = await listarCargosApi();
    setCargos(cargosResponse);
  }

  useEffect(() => {
    let ativo = true;

    listarCargosApi().then((cargosResponse) => {
      if (ativo) {
        setCargos(cargosResponse);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  function alterarCampo(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function limparFormulario() {
    setForm(FORM_INICIAL);
    setCargoEditando(null);
  }

  function editarCargo(cargo) {
    setCargoEditando(cargo);
    setForm({
      nome: cargo.nome ?? cargo.name,
      access_level: String(cargo.access_level ?? 1),
    });
  }

  async function salvarCargo(event) {
    event.preventDefault();

    const payload = {
      nome: form.nome.trim(),
      access_level: Number(form.access_level),
      ativo: true,
    };

    if (cargoEditando) {
      await atualizarCargoApi(cargoEditando.id, payload);
      setFeedback('Perfil atualizado com sucesso.');
    } else {
      await criarCargoApi(payload);
      setFeedback('Perfil criado com sucesso.');
    }

    limparFormulario();
    await carregarCargos();
  }

  async function inativarCargo(cargo) {
    if (confirm(`Deseja inativar o perfil ${cargo.nome ?? cargo.name}?`)) {
      await inativarCargoApi(cargo.id);
      setFeedback('Perfil inativado com sucesso.');
      await carregarCargos();
    }
  }

  return (
    <PageWrapper
      title="Perfis de Acesso"
      description="Gerencie os perfis e níveis de acesso do sistema."
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-brand-50 p-3 text-brand-500">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {cargoEditando ? 'Editar perfil' : 'Novo perfil'}
              </h2>
              <p className="text-sm text-slate-500">
                Defina o nome e o nível de acesso.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={salvarCargo}>
            <Input
              label="Nome do perfil"
              name="nome"
              value={form.nome}
              onChange={alterarCampo}
              placeholder="Ex: Operador"
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Nível de acesso
              </label>
              <select
                name="access_level"
                value={form.access_level}
                onChange={alterarCampo}
                className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600"
              >
                <option value="1">Visualizador</option>
                <option value="2">Operador</option>
                <option value="3">Gerente</option>
                <option value="4">Administrador</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 gap-2">
                <Plus size={16} />
                {cargoEditando ? 'Salvar' : 'Criar'}
              </Button>
              {cargoEditando && (
                <Button type="button" variant="secondary" onClick={limparFormulario}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-0">
          {feedback && (
            <div className="border-b border-green-100 bg-green-50 px-6 py-3 text-sm text-green-700">
              {feedback}
            </div>
          )}

          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Perfil</th>
                <th className="px-6 py-3">Nível</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cargos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                    Nenhum perfil encontrado.
                  </td>
                </tr>
              ) : (
                cargos.map((cargo) => (
                  <tr key={cargo.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {cargo.nome ?? cargo.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {niveisAcesso[cargo.access_level] ?? 'Visualizador'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => editarCargo(cargo)}
                          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-500"
                          aria-label="Editar perfil"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => inativarCargo(cargo)}
                          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label="Inativar perfil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default PerfisAcesso;

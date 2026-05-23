import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Users,
  UserX,
  X,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Button, Card, Input, Table } from '../../components/ui';
import {
  atualizarUsuarioApi,
  criarUsuarioApi,
  inativarUsuarioApi,
  listarCargosApi,
  listarUsuariosApi,
} from '../../services';

const INITIAL_CREATE_FORM = {
  nome: '',
  email: '',
  cargo_id: '',
  senha: '',
  confirmarSenha: '',
};

const INITIAL_EDIT_FORM = {
  nome: '',
  email: '',
  cargo_id: '',
  senha: '',
};

function getUserId(user) {
  return user.id ?? user.user_id ?? user.usuario_id;
}

function getUserName(user) {
  return user.nome ?? user.name ?? 'Sem nome';
}

function getRoleId(user) {
  return user.cargo_id ?? user.role_id ?? user.cargo?.id ?? '';
}

function getRoleNameById(cargos, cargoId) {
  const cargo = cargos.find((item) => String(item.id) === String(cargoId));

  return cargo?.nome ?? cargo?.name;
}

function getRoleName(user, cargos) {
  return (
    user.cargo_nome ??
    user.role ??
    user.cargo?.nome ??
    getRoleNameById(cargos, getRoleId(user)) ??
    'Sem perfil'
  );
}

function isUserActive(user) {
  if (typeof user.ativo === 'boolean') {
    return user.ativo;
  }

  if (typeof user.active === 'boolean') {
    return user.active;
  }

  if (typeof user.status === 'string') {
    return user.status.toLowerCase() !== 'inativo';
  }

  return true;
}

function isAdminUser(user, cargos) {
  return getRoleName(user, cargos).toLowerCase().includes('administrador');
}

function getCargoName(cargo) {
  return cargo.nome ?? cargo.name ?? 'Sem nome';
}

function getErrorMessage(error) {
  return error?.message || 'Não foi possível concluir a operação.';
}

function Feedback({ type, message }) {
  if (!message) return null;

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  const classes =
    type === 'success'
      ? 'border-green-200 bg-green-50 text-green-700'
      : 'border-red-200 bg-red-50 text-red-700';

  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-4 py-3 text-sm ${classes}`}
      role="alert"
    >
      <Icon size={18} />
      <span>{message}</span>
    </div>
  );
}

function ModalShell({ title, description, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  children,
  error,
  disabled = false,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={[
          'h-11 rounded-md border bg-white px-3 text-sm text-gray-600 outline-none transition-all disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400/30'
            : 'border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30',
        ].join(' ')}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function UsuarioFormModal({
  title,
  description,
  cargos,
  form,
  errors,
  isSaving,
  mode,
  onChange,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit';

  return (
    <ModalShell title={title} description={description} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Nome completo"
              name="nome"
              value={form.nome}
              onChange={onChange}
              error={errors.nome}
              required
            />
          </div>

          <Input
            label="E-mail corporativo"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            error={errors.email}
            required
          />

          <SelectField
            label="Perfil de acesso"
            name="cargo_id"
            value={form.cargo_id}
            onChange={onChange}
            error={errors.cargo_id}
            disabled={isEdit}
            required={!isEdit}
          >
            <option value="">Selecione um perfil</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.id}>
                {getCargoName(cargo)}
              </option>
            ))}
          </SelectField>

          <Input
            label={isEdit ? 'Nova senha opcional' : 'Senha'}
            name="senha"
            type="password"
            value={form.senha}
            onChange={onChange}
            error={errors.senha}
            minLength={isEdit ? undefined : 8}
            required={!isEdit}
          />

          {!isEdit && (
            <Input
              label="Confirmar senha"
              name="confirmarSenha"
              type="password"
              value={form.confirmarSenha}
              onChange={onChange}
              error={errors.confirmarSenha}
              minLength={8}
              required
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Cancelar
          </button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

function InativarUsuarioModal({ usuario, isSaving, onClose, onConfirm }) {
  return (
    <ModalShell title="Inativar usuário?" onClose={onClose}>
      <div className="space-y-5 px-6 py-6">
        <p className="text-sm leading-6 text-slate-600">
          Este usuário não poderá mais acessar o sistema. Esta ação poderá ser
          revertida posteriormente por um administrador.
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">
            {getUserName(usuario)}
          </p>
          <p className="text-sm text-slate-500">{usuario.email}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          Cancelar
        </button>
        <Button variant="danger" onClick={onConfirm} disabled={isSaving}>
          {isSaving ? 'Inativando...' : 'Inativar'}
        </Button>
      </div>
    </ModalShell>
  );
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busca, setBusca] = useState('');
  const [cargoFiltro, setCargoFiltro] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioInativando, setUsuarioInativando] = useState(null);
  const [createForm, setCreateForm] = useState(INITIAL_CREATE_FORM);
  const [editForm, setEditForm] = useState(INITIAL_EDIT_FORM);
  const [formErrors, setFormErrors] = useState({});

  async function carregarDados({ clearFeedback = true } = {}) {
    setLoading(true);
    if (clearFeedback) {
      setFeedback({ type: '', message: '' });
    }

    try {
      const [usuariosResponse, cargosResponse] = await Promise.all([
        listarUsuariosApi(),
        listarCargosApi(),
      ]);

      setUsuarios(Array.isArray(usuariosResponse) ? usuariosResponse : []);
      setCargos(Array.isArray(cargosResponse) ? cargosResponse : []);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados().catch(() => {});
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const nome = getUserName(usuario).toLowerCase();
      const email = String(usuario.email ?? '').toLowerCase();
      const cargoId = getRoleId(usuario);

      const matchesSearch =
        !termoBusca || nome.includes(termoBusca) || email.includes(termoBusca);
      const matchesRole =
        !cargoFiltro || String(cargoId) === String(cargoFiltro);

      return matchesSearch && matchesRole;
    });
  }, [busca, cargoFiltro, usuarios]);

  const resumo = useMemo(
    () => ({
      total: usuarios.length,
      ativos: usuarios.filter(isUserActive).length,
      inativos: usuarios.filter((usuario) => !isUserActive(usuario)).length,
      administradores: usuarios.filter((usuario) => isAdminUser(usuario, cargos))
        .length,
    }),
    [cargos, usuarios],
  );

  function handleCreateChange(event) {
    const { name, value } = event.target;
    setCreateForm((current) => ({ ...current, [name]: value }));
  }

  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  }

  function validateCreateForm() {
    const errors = {};

    if (!createForm.nome.trim()) errors.nome = 'Informe o nome completo.';
    if (!createForm.email.trim()) errors.email = 'Informe o e-mail.';
    if (!createForm.cargo_id) errors.cargo_id = 'Selecione um perfil.';
    if (createForm.senha.length < 8) {
      errors.senha = 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (createForm.confirmarSenha !== createForm.senha) {
      errors.confirmarSenha = 'As senhas devem ser iguais.';
    }

    return errors;
  }

  function validateEditForm() {
    const errors = {};

    if (!editForm.nome.trim()) errors.nome = 'Informe o nome completo.';
    if (!editForm.email.trim()) errors.email = 'Informe o e-mail.';
    if (editForm.senha && editForm.senha.length < 8) {
      errors.senha = 'A senha deve ter pelo menos 8 caracteres.';
    }

    return errors;
  }

  function openCreateModal() {
    setCreateForm(INITIAL_CREATE_FORM);
    setFormErrors({});
    setModalNovoAberto(true);
  }

  function openEditModal(usuario) {
    setUsuarioEditando(usuario);
    setEditForm({
      nome: getUserName(usuario),
      email: usuario.email ?? '',
      cargo_id: getRoleId(usuario),
      senha: '',
    });
    setFormErrors({});
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();
    const errors = validateCreateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await criarUsuarioApi({
        nome: createForm.nome.trim(),
        email: createForm.email.trim(),
        senha: createForm.senha,
        cargo_id: Number(createForm.cargo_id),
      });
      setModalNovoAberto(false);
      setCreateForm(INITIAL_CREATE_FORM);
      await carregarDados({ clearFeedback: false });
      setFeedback({
        type: 'success',
        message: 'Usuário criado com sucesso.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    const errors = validateEditForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    const payload = {
      nome: editForm.nome.trim(),
      email: editForm.email.trim(),
    };

    if (editForm.senha) {
      payload.senha = editForm.senha;
    }

    try {
      await atualizarUsuarioApi(getUserId(usuarioEditando), payload);
      setUsuarioEditando(null);
      await carregarDados({ clearFeedback: false });
      setFeedback({
        type: 'success',
        message: 'Usuário atualizado com sucesso.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleInativarUsuario() {
    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await inativarUsuarioApi(getUserId(usuarioInativando));
      setUsuarioInativando(null);
      await carregarDados({ clearFeedback: false });
      setFeedback({
        type: 'success',
        message: 'Usuário inativado com sucesso.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageWrapper
      title="Gestão de Usuários"
      description="Administre os acessos e permissões dos colaboradores do sistema."
      className="mx-auto max-w-7xl"
    >
      <div className="space-y-6">
        <Feedback type={feedback.type} message={feedback.message} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Users}
            label="Total de usuários"
            value={resumo.total}
          />
          <SummaryCard
            icon={UserCheck}
            label="Usuários ativos"
            value={resumo.ativos}
          />
          <SummaryCard
            icon={UserMinus}
            label="Usuários inativos"
            value={resumo.inativos}
          />
          <SummaryCard
            icon={ShieldCheck}
            label="Administradores"
            value={resumo.administradores}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome ou e-mail"
                className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30"
              />
            </div>

            <select
              value={cargoFiltro}
              onChange={(event) => setCargoFiltro(event.target.value)}
              className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30"
            >
              <option value="">Todos os perfis</option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {getCargoName(cargo)}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={openCreateModal} className="gap-2">
            <Plus size={16} />
            Novo usuário
          </Button>
        </div>

        <Card className="p-0">
          <Table>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Nome / E-mail</th>
                <th className="px-6 py-3">Perfil</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    Carregando usuários...
                  </td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => {
                  const ativo = isUserActive(usuario);

                  return (
                    <tr key={getUserId(usuario)} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {getUserName(usuario)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {usuario.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {getRoleName(usuario, cargos)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            ativo
                              ? 'bg-green-50 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              ativo ? 'bg-green-500' : 'bg-slate-400'
                            }`}
                          />
                          {ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => openEditModal(usuario)}
                            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-500"
                            aria-label="Editar usuário"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setUsuarioInativando(usuario)}
                            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Inativar usuário"
                            disabled={!ativo}
                          >
                            <UserX size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card>
      </div>

      {modalNovoAberto && (
        <UsuarioFormModal
          title="Novo usuário"
          description="Cadastre um colaborador e defina seu perfil de acesso."
          cargos={cargos}
          form={createForm}
          errors={formErrors}
          isSaving={isSaving}
          mode="create"
          onChange={handleCreateChange}
          onClose={() => setModalNovoAberto(false)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {usuarioEditando && (
        <UsuarioFormModal
          title="Editar usuário"
          description="Atualize os dados principais do colaborador."
          cargos={cargos}
          form={editForm}
          errors={formErrors}
          isSaving={isSaving}
          mode="edit"
          onChange={handleEditChange}
          onClose={() => setUsuarioEditando(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {usuarioInativando && (
        <InativarUsuarioModal
          usuario={usuarioInativando}
          isSaving={isSaving}
          onClose={() => setUsuarioInativando(null)}
          onConfirm={handleInativarUsuario}
        />
      )}
    </PageWrapper>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="rounded-lg bg-brand-50 p-3 text-brand-500">
        <Icon size={22} />
      </div>
    </Card>
  );
}

export default Usuarios;

import { useState, useMemo, useContext } from 'react';
import { Pencil, Plus, Search, ShieldCheck, UserCheck, UserMinus, Users, UserX, X } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Button, Card, Input, Table } from '../../components/ui';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';

const INITIAL_CREATE = { nome: '', email: '', cargo_id: '', senha: '', confirmarSenha: '' };

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Usuarios() {
  const { usuarios, cargos, addUsuario, updateUsuario, inativarUsuario } = useContext(GlobalStateContext);
  
  const [busca, setBusca] = useState('');
  const [cargoFiltro, setCargoFiltro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(INITIAL_CREATE);
  const [erro, setErro] = useState('');

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const matchSearch = u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase());
      const matchCargo = !cargoFiltro || String(u.cargo_id) === String(cargoFiltro);
      return matchSearch && matchCargo;
    });
  }, [busca, cargoFiltro, usuarios]);

  const resumo = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.ativo).length,
    inativos: usuarios.filter(u => !u.ativo).length,
    admins: usuarios.filter(u => cargos.find(c => c.id === u.cargo_id)?.access_level === '4').length,
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    
    // Validação 1: Senhas iguais
    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }
    
    // Validação 2: E-mail único (NOVO!)
    const emailJaExiste = usuarios.some(u => u.email.toLowerCase() === form.email.trim().toLowerCase());
    if (emailJaExiste) {
      setErro('Este e-mail já está cadastrado no sistema.');
      return;
    }
    
    addUsuario({
      nome: form.nome,
      email: form.email.trim(),
      cargo_id: Number(form.cargo_id),
      senha: form.senha
    });
    setModalAberto(false);
    setForm(INITIAL_CREATE);
    setErro('');
  };

  return (
    <PageWrapper title="Gestão de Usuários" description="Administre os acessos e permissões dos colaboradores.">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="flex items-center justify-between p-5"><div className="text-slate-500 uppercase text-xs font-bold">Total<p className="text-2xl text-slate-900">{resumo.total}</p></div><Users className="text-brand-500" size={24}/></Card>
          <Card className="flex items-center justify-between p-5"><div className="text-slate-500 uppercase text-xs font-bold">Ativos<p className="text-2xl text-green-600">{resumo.ativos}</p></div><UserCheck className="text-green-500" size={24}/></Card>
          <Card className="flex items-center justify-between p-5"><div className="text-slate-500 uppercase text-xs font-bold">Inativos<p className="text-2xl text-red-600">{resumo.inativos}</p></div><UserMinus className="text-red-500" size={24}/></Card>
          <Card className="flex items-center justify-between p-5"><div className="text-slate-500 uppercase text-xs font-bold">Admins<p className="text-2xl text-purple-600">{resumo.admins}</p></div><ShieldCheck className="text-purple-500" size={24}/></Card>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-100 p-4 lg:flex-row lg:items-center">
          <div className="flex-1 flex gap-3">
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-3 top-3 text-slate-400" />
              <input type="text" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} className="h-11 w-full pl-10 pr-3 rounded-md border border-slate-200 outline-none" />
            </div>
            <select value={cargoFiltro} onChange={e => setCargoFiltro(e.target.value)} className="h-11 px-3 rounded-md border border-slate-200 outline-none">
              <option value="">Todos os perfis</option>
              {cargos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <Button onClick={() => setModalAberto(true)} className="gap-2"><Plus size={16} /> Novo usuário</Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <Table>
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500 border-b">
                <th className="px-6 py-3">Usuário</th>
                <th className="px-6 py-3">Perfil</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => {
                const cargoNome = cargos.find(c => c.id === u.cargo_id)?.nome || 'Sem Perfil';
                return (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{u.nome}</p>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{cargoNome}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => inativarUsuario(u.id)} className="p-1 text-slate-400 hover:text-red-500" title="Ativar/Inativar">
                        <UserX size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </div>

      {modalAberto && (
        <ModalShell title="Novo Usuário" onClose={() => { setModalAberto(false); setErro(''); setForm(INITIAL_CREATE); }}>
          <form onSubmit={handleSalvar} className="p-6 space-y-4">
            {erro && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded font-medium text-sm">{erro}</div>}
            <Input label="Nome Completo" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
            <Input label="E-mail Corporativo" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Perfil de Acesso</label>
              <select required value={form.cargo_id} onChange={e => setForm({...form, cargo_id: e.target.value})} className="h-11 border border-slate-300 rounded px-3 outline-none">
                <option value="">Selecione...</option>
                {cargos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Senha" type="password" required minLength={3} value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
              <Input label="Confirmar Senha" type="password" required minLength={3} value={form.confirmarSenha} onChange={e => setForm({...form, confirmarSenha: e.target.value})} />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => { setModalAberto(false); setErro(''); setForm(INITIAL_CREATE); }} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">Cancelar</button>
              <Button type="submit">Cadastrar Usuário</Button>
            </div>
          </form>
        </ModalShell>
      )}
    </PageWrapper>
  );
}

export default Usuarios;
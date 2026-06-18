import { Eye, EyeOff } from 'lucide-react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { PublicLayout } from '../../layouts';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';

function Login() {
  const navigate = useNavigate();
  const { usuarios, cargos } = useContext(GlobalStateContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email')).trim().toLowerCase();
    const password = String(formData.get('password'));

    if (!password) {
      setErrorMessage('Informe sua senha para acessar o sistema.');
      return;
    }

    const user = usuarios.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      setErrorMessage('E-mail não encontrado. Verifique o endereço informado.');
      return;
    }

    // A MÁGICA: Verificação REAL da senha!
    if (user.senha !== password) {
      setErrorMessage('Senha incorreta. Tente novamente.');
      return;
    }

    if (!user.ativo) {
      setErrorMessage('Seu usuário está inativo. Contate o administrador.');
      return;
    }

    const cargoDoUsuario = cargos.find(c => c.id === user.cargo_id);
    const perfil = cargoDoUsuario ? cargoDoUsuario.nome : 'Sem Perfil';

    localStorage.setItem(
      'scge:user',
      JSON.stringify({ id: user.id, name: user.nome, email: user.email, role: perfil })
    );

    setErrorMessage('');
    navigate('/dashboard');
  }

  return (
    <PublicLayout>
      <Card className="p-6 shadow-lg border-slate-100">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-slate-800">Acesso ao Sistema</h2>
            <p className="text-xs text-slate-500">Utilize admin@scge.com e senha 123 para testar</p>
          </div>

          <Input label="E-mail corporativo" name="email" type="email" placeholder="seu.email@exemplo.com" required />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Senha</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                className="h-11 w-full rounded-md border border-gray-300 bg-white py-0 pl-3 pr-10 text-sm text-gray-600 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/30"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full font-bold">
            Entrar no SCGE
          </Button>
        </form>
      </Card>
    </PublicLayout>
  );
}

export default Login;
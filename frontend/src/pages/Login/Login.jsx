import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { useAuth } from '../../contexts';
import { PublicLayout } from '../../layouts';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email')).trim().toLowerCase();
    const password = String(formData.get('password'));

    if (!password) {
      setErrorMessage('Informe sua senha para acessar o sistema.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error?.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <Card className="p-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            autoComplete="email"
            required
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs font-medium text-gray-600"
            >
              Senha
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="h-11 w-full rounded-md border border-gray-300 bg-white py-0 pl-3 pr-10 text-sm text-gray-600 outline-none transition-all duration-150 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-gray-500 transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
            />
            Lembrar de mim
          </label>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </Button>
        </form>
      </Card>

      <div className="mt-6 text-center">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-600"
        >
          Esqueceu sua senha?
        </Link>
      </div>
    </PublicLayout>
  );
}

export default Login;

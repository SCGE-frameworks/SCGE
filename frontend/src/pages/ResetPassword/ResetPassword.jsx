import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { PublicLayout } from '../../layouts';
import { resetPasswordApi } from '../../services';

const PASSWORD_RULES = [
  {
    message: 'A senha deve ter no mínimo 8 caracteres.',
    isValid: (password) => password.length >= 8,
  },
  {
    message: 'A senha deve ter pelo menos uma letra maiúscula.',
    isValid: (password) => /[A-Z]/.test(password),
  },
  {
    message: 'A senha deve ter pelo menos uma letra minúscula.',
    isValid: (password) => /[a-z]/.test(password),
  },
  {
    message: 'A senha deve ter pelo menos um número.',
    isValid: (password) => /\d/.test(password),
  },
];

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';
  const [resetToken, setResetToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordErrors = useMemo(
    () =>
      PASSWORD_RULES.filter((rule) => !rule.isValid(password)).map(
        (rule) => rule.message,
      ),
    [password],
  );

  const confirmationError =
    confirmPassword && password !== confirmPassword
      ? 'A confirmação deve ser igual à nova senha.'
      : '';

  const showPasswordError = submitted && passwordErrors.length > 0;
  const showConfirmationError =
    submitted && (password !== confirmPassword || !confirmPassword);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setErrorMessage('');

    if (passwordErrors.length > 0 || password !== confirmPassword) {
      return;
    }

    if (!resetToken.trim()) {
      setErrorMessage('Informe o token de recuperação.');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi(resetToken.trim(), password);
      setSuccessMessage('Senha alterada com sucesso. Redirecionando para login.');
      window.setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout description="Crie uma nova senha para voltar a acessar sua conta">
      <Card className="p-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <h2 className="font-title text-xl font-semibold text-slate-950">
              Trocar senha
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Informe uma senha segura para concluir a recuperação.
            </p>
          </div>

          <Input
            label="Token de recuperação"
            name="resetToken"
            value={resetToken}
            onChange={(event) => setResetToken(event.target.value)}
            placeholder="Cole o token recebido"
            required
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs font-medium text-gray-600"
            >
              Nova senha
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite a nova senha"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={[
                  'h-11 w-full rounded-md border bg-white py-0 pl-3 pr-10 text-sm text-gray-600',
                  'outline-none transition-all duration-150',
                  'placeholder:text-gray-400',
                  showPasswordError
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400/30'
                    : 'border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30',
                  'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
                ].join(' ')}
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-gray-500 transition-colors hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
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

            {showPasswordError && (
              <span className="text-xs text-red-500">{passwordErrors[0]}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-gray-600"
            >
              Confirmar nova senha
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirme a nova senha"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={[
                  'h-11 w-full rounded-md border bg-white py-0 pl-3 pr-10 text-sm text-gray-600',
                  'outline-none transition-all duration-150',
                  'placeholder:text-gray-400',
                  showConfirmationError
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-400/30'
                    : 'border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400/30',
                  'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
                ].join(' ')}
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-gray-500 transition-colors hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
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

            {showConfirmationError && (
              <span className="text-xs text-red-500">
                {confirmationError || 'Confirme a nova senha.'}
              </span>
            )}
          </div>

          <ul className="space-y-1 text-xs text-slate-500">
            {PASSWORD_RULES.map((rule) => (
              <li key={rule.message}>{rule.message}</li>
            ))}
          </ul>

          {successMessage && (
            <div
              role="status"
              className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-700"
            >
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Trocar senha'}
          </Button>
        </form>
      </Card>
    </PublicLayout>
  );
}

export default ResetPassword;

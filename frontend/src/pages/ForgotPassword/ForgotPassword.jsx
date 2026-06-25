import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { PublicLayout } from '../../layouts';
import { forgotPasswordApi } from '../../services';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setResetToken('');

    try {
      const data = await forgotPasswordApi(normalizedEmail);
      setSuccessMessage(
        'Se o e-mail estiver cadastrado, use o token abaixo para redefinir sua senha.',
      );

      if (data?.reset_token) {
        setResetToken(data.reset_token);
      }
    } catch (error) {
      setErrorMessage(error?.message || 'Não foi possível processar a solicitação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout description="Informe seu e-mail para recuperar o acesso ao sistema">
      <Card className="p-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <h2 className="font-title text-xl font-semibold text-slate-950">
              Recuperar senha
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Enviaremos as instruções para o e-mail informado.
            </p>
          </div>

          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {successMessage && (
            <div
              role="status"
              className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-700"
            >
              {successMessage}
            </div>
          )}

          {resetToken && (
            <div className="rounded-md border border-brand-200 bg-brand-50 px-3 py-3 text-sm text-brand-800">
              <p className="font-medium">Token de recuperação (ambiente de desenvolvimento):</p>
              <p className="mt-2 break-all font-mono text-xs">{resetToken}</p>
              <Link
                to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Ir para redefinição de senha
              </Link>
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
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>
      </Card>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-brand-500 transition-colors hover:text-brand-600"
        >
          Voltar para login
        </Link>
      </div>
    </PublicLayout>
  );
}

export default ForgotPassword;

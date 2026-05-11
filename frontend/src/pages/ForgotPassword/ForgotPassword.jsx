import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { PublicLayout } from '../../layouts';
import { listarUsuarios } from '../../services';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const user = listarUsuarios().find(
      (mockedUser) => mockedUser.email.toLowerCase() === normalizedEmail,
    );

    if (!user) {
      setSuccessMessage('');
      setErrorMessage(
        'Nenhuma conta encontrada. Verifique seu e-mail e tente novamente.',
      );
      return;
    }

    setErrorMessage('');
    setSuccessMessage(
      'Enviaremos um link de recuperação em instantes.',
    );
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

          {errorMessage && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full">
            Enviar link de recuperação
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

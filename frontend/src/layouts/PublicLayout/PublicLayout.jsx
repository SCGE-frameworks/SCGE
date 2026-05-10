import { PackageCheck } from 'lucide-react';

function PublicLayout({
  children,
  description = 'Acesse sua conta para gerenciar o inventário',
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-sm">
            <PackageCheck size={28} aria-hidden="true" />
          </div>

          <h1 className="font-title text-3xl font-semibold text-slate-950">
            SCGE
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-700">
            Sistema de Gestão de Estoque
          </p>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            {description}
          </p>
        </header>

        <section className="w-full">{children}</section>
      </div>
    </main>
  );
}

export default PublicLayout;

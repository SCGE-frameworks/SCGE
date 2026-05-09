import { Button, Input } from './components';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
        <Input label="E-mail" placeholder="nome@empresa.com.br" />
        <Input label="Senha" type="password" placeholder="••••••••" />
        <Input label="Código" error="Campo obrigatório" />
        <Input label="Desabilitado" disabled placeholder="Não editável" />

        <Button size='lg'>Entrar no Sistema</Button>
      </div>
    </div>
  );
}

export default App;
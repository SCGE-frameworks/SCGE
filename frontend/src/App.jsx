import { Button, Card, Input } from './components';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <Card className="mx-auto flex w-full max-w-md flex-col gap-4">
        <Input label="E-mail" placeholder="nome@empresa.com.br" />
        <Input label="Senha" type="password" placeholder="••••••••" />
        <Button>Entrar no Sistema</Button>
      </Card>
    </div>
  );
}

export default App;
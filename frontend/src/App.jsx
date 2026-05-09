import { Button, Input, Card, Table } from './components';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="mx-auto w-full max-w-3xl">
        <Table>
          <thead>
            <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
              <th className="px-4 py-2">Produto</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2">Quantidade</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2">Mouse</td>
              <td className="px-4 py-2">Periférico</td>
              <td className="px-4 py-2">450</td>
              <td className="px-4 py-2 text-green-600">Suficiente</td>
            </tr>

            <tr className="border-b border-gray-100">
              <td className="px-4 py-2">Notebook</td>
              <td className="px-4 py-2">Equipamento</td>
              <td className="px-4 py-2">8</td>
              <td className="px-4 py-2 text-red-600">Baixo</td>
            </tr>

            <tr>
              <td className="px-4 py-2">Cabo HDMI</td>
              <td className="px-4 py-2">Acessório</td>
              <td className="px-4 py-2">120</td>
              <td className="px-4 py-2 text-green-600">Suficiente</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
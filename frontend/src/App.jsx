import { Button } from './components';

function App() {
  return (
    <div className="p-10 flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>

      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="lg">Large</Button>

      <Button disabled>Disabled</Button>
    </div>
  );
}

export default App;
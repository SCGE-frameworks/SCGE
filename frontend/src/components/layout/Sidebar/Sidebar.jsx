import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  FileText,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Inventário', icon: Boxes, href: '/inventario' },
  { label: 'Movimentações', icon: ArrowLeftRight, href: '/movimentacoes' },
  { label: 'Relatórios', icon: FileText, href: '/relatorios' },
];

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-200 p-6 text-slate-700">
      <div className="mb-8">
        <h1 className="font-title text-xl font-bold text-brand-500">SCGE</h1>
        <p className="mt-1 text-xs uppercase tracking-wide text-gray-600">
          Gestão de Estoque
        </p>
      </div>

<nav className="flex flex-1 flex-col gap-2">
  {menuItems.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.href}
        to={item.href}
        className={({ isActive }) =>
          [
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-white text-brand-500 shadow-sm'
              : 'text-slate-500 hover:bg-white hover:text-brand-500',
          ].join(' ')
        }
      >
        <Icon size={18} />
        {item.label}
      </NavLink>
    );
  })}
</nav>

      <button className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-brand-500">
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}

export default Sidebar;
import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  FileText,
  LogOut,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Estoque', icon: Boxes, href: '/inventario' },
  { label: 'Movimentações', icon: ArrowLeftRight, href: '/movimentacoes' },
  { label: 'Relatórios', icon: FileText, href: '/relatorios' },
];

const adminItems = [
  { label: 'Gestão de Usuários', icon: UserCog, href: '/admin/usuarios' },
  { label: 'Perfis de Acesso', icon: ShieldCheck, href: '/admin/perfis-acesso' },
];

function Sidebar() {
  const storedUser = localStorage.getItem('scge:user');
  let isAdmin = false;

  if (storedUser) {
    try {
      isAdmin = JSON.parse(storedUser)?.role === 'Administrador';
    } catch {
      isAdmin = false;
    }
  }

  function handleLogout() {
    localStorage.removeItem('scge:user');
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-slate-200 p-6 text-slate-700">
      <div className="mb-8">
        <h1 className="font-title text-xl font-bold text-brand-500">SCGE</h1>
        <p className="mt-1 text-xs uppercase tracking-wide text-gray-600">
          Gestão de Estoque
        </p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
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

        {isAdmin && (
          <div className="mt-6 border-t border-slate-300 pt-5">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Administração
            </p>

            <div className="flex flex-col gap-2">
              {adminItems.map((item) => {
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
            </div>
          </div>
        )}
      </nav>

      <Link
        to="/login"
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-brand-500"
      >
        <LogOut size={18} />
        Sair
      </Link>
    </aside>
  );
}

export default Sidebar;

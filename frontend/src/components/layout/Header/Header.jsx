import { Bell } from 'lucide-react';

const fallbackUser = {
  name: 'Usuário',
  role: 'Sem perfil',
};

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem('scge:user');

    if (!storedUser) {
      return fallbackUser;
    }

    const user = JSON.parse(storedUser);

    return {
      name: user?.name || fallbackUser.name,
      role: user?.cargo_nome || user?.role || fallbackUser.role,
    };
  } catch {
    return fallbackUser;
  }
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Header() {
  const user = getStoredUser();
  const initials = getInitials(user.name) || 'U';

  return (
    <header className="flex h-16 items-center justify-end bg-slate-200 px-6">
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 hover:bg-slate-100">
          <Bell size={20} className="text-slate-500" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="font-medium text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

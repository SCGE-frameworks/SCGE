import { Bell } from 'lucide-react';

function Header() {
  return (
    <header className="flex h-16 items-center justify-end bg-slate-200 px-6">
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 hover:bg-slate-100">
          <Bell size={20} className="text-slate-500" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="font-medium text-slate-700">Dirceu Neto</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            DN
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
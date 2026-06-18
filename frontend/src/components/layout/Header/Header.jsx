import { Bell, LogOut, Menu } from 'lucide-react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../../../contexts/GlobalStateContext';

function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Pegando as notificações e a função para limpar do Contexto
  const { notificacoes, setNotificacoes } = useContext(GlobalStateContext);
  
  // Recupera as infos do usuário logado do localStorage
  const userStr = localStorage.getItem('scge:user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Usuário', role: 'Operador' };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  function handleLogout() {
    localStorage.removeItem('scge:user');
    localStorage.removeItem('token');
    navigate('/login');
  }

  function marcarComoLidas() {
    setNotificacoes(notificacoes.map(n => ({ ...n, lida: true })));
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:block">
          <span className="text-sm font-medium text-slate-500">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        {/* COMPONENTE DO SINO DE NOTIFICAÇÕES */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <Bell size={20} />
            {notificacoesNaoLidas > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {notificacoesNaoLidas}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">Notificações</h3>
                {notificacoesNaoLidas > 0 && (
                  <button onClick={marcarComoLidas} className="text-[10px] font-medium text-brand-500 hover:underline">
                    Marcar todas lidas
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                {notificacoes.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">Nenhuma novidade por aqui.</div>
                ) : (
                  notificacoes.map((notif) => (
                    <div key={notif.id} className={`rounded-lg px-3 py-2 text-xs transition-colors ${notif.lida ? 'bg-transparent text-slate-500' : 'bg-brand-50 text-slate-800 font-medium'}`}>
                      {notif.msg}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {/* FIM DO SINO */}

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 hover:bg-slate-50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-700">{user.name}</p>
              <p className="text-xs leading-tight text-slate-500">{user.role}</p>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-lg ring-1 ring-black/5">
              <div className="border-b border-slate-100 px-4 py-3 sm:hidden">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sair do sistema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
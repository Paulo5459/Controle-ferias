import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarPlus,
  Calendar,
  UserCheck,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Building2,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentRoute, navigate, currentUser, logout, conflicts } = useApp();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { label: 'Servidores', icon: Users, route: '/servidores' },
    { label: 'Agendar Férias', icon: CalendarPlus, route: '/ferias/novo' },
    { label: 'Calendário', icon: Calendar, route: '/calendario' },
    { label: 'Meus Períodos', icon: UserCheck, route: '/ferias' },
    { label: 'Relatórios', icon: FileText, route: '/relatorios' },
    { label: 'Administração', icon: ShieldCheck, route: '/admin', badge: conflicts.length > 0 ? `${conflicts.length}` : undefined },
    { label: 'Configurações', icon: Settings, route: '/configuracoes' },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0F172A] border-r border-[#263244] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#263244]">
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#F8FAFC] tracking-tight block leading-tight">
                Gestão de Férias
              </span>
              <span className="text-[10px] font-semibold text-[#14B8A6] tracking-wider uppercase">
                Institucional · MVP
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-[#94A3B8] hover:text-[#F8FAFC] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tag */}
        <div className="px-5 pt-3 pb-1">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
            Navegação Geral
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route || (item.route === '/servidores' && currentRoute.startsWith('/servidores/'));

            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logged in User Footer Card */}
        <div className="p-3 border-t border-[#263244] bg-[#0B1220]/60">
          <div className="p-2.5 rounded-lg bg-[#111827] border border-[#263244]/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#1F2937] border border-[#263244] flex items-center justify-center text-xs font-semibold text-[#60A5FA] shrink-0">
                {currentUser.name
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#F8FAFC] truncate">{currentUser.name}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">{currentUser.role.split('/')[0]}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Encerrar Sessão"
              className="p-1.5 rounded-md text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1F2937] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, CalendarPlus, AlertTriangle, Shield, Building } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentRoute, navigate, conflicts } = useApp();

  const getPageTitle = () => {
    if (currentRoute === '/dashboard') return 'Painel de Controle Institucional';
    if (currentRoute.startsWith('/servidores/')) return 'Ficha Individual do Servidor';
    if (currentRoute === '/servidores') return 'Quadro de Servidores e Saldos';
    if (currentRoute === '/ferias/novo') return 'Agendamento e Fracionamento de Férias';
    if (currentRoute === '/calendario') return 'Calendário Anual de Férias';
    if (currentRoute === '/ferias') return 'Meus Períodos de Férias';
    if (currentRoute === '/relatorios') return 'Relatórios e Demonstrativos';
    if (currentRoute === '/admin') return 'Administração e Gestão de Efetivo';
    if (currentRoute === '/configuracoes') return 'Configurações do Sistema';
    return 'Gestão de Férias';
  };

  return (
    <header className="h-16 bg-[#111827]/90 backdrop-blur-md border-b border-[#263244] sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Contextual Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1F2937] lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-semibold text-[#F8FAFC] tracking-tight">
              {getPageTitle()}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] bg-[#1F2937] px-2 py-0.5 rounded border border-[#263244]">
              <Building className="w-3 h-3 text-[#14B8A6]" />
              Exercício 2027
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Conflict Quick Alert (if any) */}
        {conflicts.length > 0 && (
          <button
            onClick={() => navigate('/calendario')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-medium hover:bg-[#F59E0B]/20 transition-colors cursor-pointer"
            title="Conflitos de efetivo detectados"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-mono">{conflicts.length} conflito(s)</span>
          </button>
        )}

        {/* Security / Internal Mode Pill */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#94A3B8] border-r border-[#263244] pr-3">
          <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Ambiente Corporativo Interno</span>
        </div>

        {/* Main Action: New vacation scheduling */}
        {currentRoute !== '/ferias/novo' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/ferias/novo')}
            className="shadow-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Agendar Férias</span>
            <span className="sm:hidden">Agendar</span>
          </Button>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { VacationStatus, FunctionalSituation } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#1F2937] text-[#94A3B8] border border-[#263244]',
    success: 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
    error: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
    info: 'bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/30',
    purple: 'bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30',
    outline: 'border border-[#263244] text-[#94A3B8]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: VacationStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'agendado':
      return (
        <Badge variant="info" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          Agendado
        </Badge>
      );
    case 'em_andamento':
      return (
        <Badge variant="warning" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          Em Andamento
        </Badge>
      );
    case 'concluido':
      return (
        <Badge variant="default" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
          Concluído
        </Badge>
      );
    case 'homologado':
      return (
        <Badge variant="success" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          Homologado
        </Badge>
      );
    case 'pendente':
      return (
        <Badge variant="warning" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          Pendente
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const SituationBadge: React.FC<{ situation: FunctionalSituation; className?: string }> = ({
  situation,
  className = '',
}) => {
  switch (situation) {
    case 'Ativo':
      return (
        <Badge variant="success" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          Ativo
        </Badge>
      );
    case 'Em Férias':
      return (
        <Badge variant="warning" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          Em Férias
        </Badge>
      );
    case 'Licença Prêmio':
      return (
        <Badge variant="purple" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          Licença Prêmio
        </Badge>
      );
    case 'Afastado':
      return (
        <Badge variant="error" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          Afastado
        </Badge>
      );
    default:
      return <Badge variant="outline">{situation}</Badge>;
  }
};

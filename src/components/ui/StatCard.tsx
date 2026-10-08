import React from 'react';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string;
  variant?: 'default' | 'primary' | 'teal' | 'warning' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}) => {
  const iconColors = {
    default: 'text-[#94A3B8] bg-[#1F2937]',
    primary: 'text-[#60A5FA] bg-[#2563EB]/15 border border-[#2563EB]/30',
    teal: 'text-[#2DD4BF] bg-[#14B8A6]/15 border border-[#14B8A6]/30',
    warning: 'text-[#FBBF24] bg-[#F59E0B]/15 border border-[#F59E0B]/30',
    purple: 'text-[#C4B5FD] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30',
  };

  return (
    <Card className="hover:border-slate-600 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{title}</p>
            <h4 className="text-2xl font-bold text-[#F8FAFC] mt-1.5 font-mono tabular-nums">
              {value}
            </h4>
            {subtitle && (
              <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1.5">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-2.5 rounded-lg ${iconColors[variant]}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface BalanceCardProps {
  direitoAnual: number;
  saldoAcumulado: number;
  totalDisponivel: number;
  diasUtilizados: number;
  saldoRestante: number;
  percentUtilizado: number;
  servidorName?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  direitoAnual,
  saldoAcumulado,
  totalDisponivel,
  diasUtilizados,
  saldoRestante,
  percentUtilizado,
  servidorName,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-5 pb-4 border-b border-[#263244]/60 bg-gradient-to-r from-[#111827] to-[#1F2937]/50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider">
              Controle de Saldo de Férias
            </span>
            {servidorName && (
              <h3 className="text-base font-semibold text-[#F8FAFC] mt-0.5">{servidorName}</h3>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs text-[#94A3B8]">Saldo Restante</span>
            <div className="text-2xl font-bold text-[#22C55E] font-mono tabular-nums">
              {saldoRestante} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5 font-mono tabular-nums">
            <span>{diasUtilizados} dias utilizados</span>
            <span>{percentUtilizado}% do total de {totalDisponivel} dias</span>
          </div>
          <div className="w-full h-2.5 bg-[#1F2937] rounded-full overflow-hidden p-0.5 border border-[#263244]">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#2563EB] to-[#14B8A6]"
              style={{ width: `${Math.min(100, percentUtilizado)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#263244]/60 bg-[#111827]">
        <div className="p-4 text-center">
          <span className="text-xs text-[#94A3B8] block">Direito Anual</span>
          <span className="text-lg font-bold text-[#F8FAFC] font-mono tabular-nums">
            {direitoAnual} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
          </span>
        </div>
        <div className="p-4 text-center">
          <span className="text-xs text-[#94A3B8] block">Saldo Acumulado</span>
          <span className="text-lg font-bold text-[#8B5CF6] font-mono tabular-nums">
            +{saldoAcumulado} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
          </span>
        </div>
        <div className="p-4 text-center">
          <span className="text-xs text-[#94A3B8] block">Total Disponível</span>
          <span className="text-lg font-bold text-[#60A5FA] font-mono tabular-nums">
            {totalDisponivel} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
          </span>
        </div>
        <div className="p-4 text-center">
          <span className="text-xs text-[#94A3B8] block">Dias Já Utilizados</span>
          <span className="text-lg font-bold text-[#F59E0B] font-mono tabular-nums">
            {diasUtilizados} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
          </span>
        </div>
      </div>
    </Card>
  );
};

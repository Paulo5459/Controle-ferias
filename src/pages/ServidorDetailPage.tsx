import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  CalendarPlus,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { BalanceCard } from '../components/ui/StatCard';
import { StatusBadge, SituationBadge } from '../components/ui/Badge';
import { calculateServerBalances, formatDateBR } from '../utils/vacationCalculations';

interface ServidorDetailPageProps {
  servidorId?: string;
}

export const ServidorDetailPage: React.FC<ServidorDetailPageProps> = ({ servidorId }) => {
  const {
    servidores,
    periods,
    navigate,
    selectedServidorId,
    cancelPeriod,
    setSelectedServidorId,
  } = useApp();

  const activeId = servidorId || selectedServidorId || 'srv-1';
  const servidor = servidores.find(s => s.id === activeId) || servidores[0];

  const serverPeriods = periods
    .filter(p => p.servidorId === servidor.id)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  const balances = calculateServerBalances(servidor, periods);

  const handleScheduleForThisServer = () => {
    setSelectedServidorId(servidor.id);
    navigate('/ferias/novo');
  };

  return (
    <div className="space-y-6">
      {/* Navigation and Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/servidores')}
            className="h-8"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Voltar aos Servidores
          </Button>
          <div>
            <span className="text-[11px] font-mono text-[#14B8A6] uppercase tracking-wider">
              Ficha Funcional Individual
            </span>
            <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">{servidor.name}</h2>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleScheduleForThisServer}>
          <CalendarPlus className="w-4 h-4 mr-1.5" />
          Agendar Férias para este Servidor
        </Button>
      </div>

      {/* Functional Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dados Funcionais do Servidor</CardTitle>
              <CardDescription>
                Informações de lotação, cargo e situação cadastral do servidor público.
              </CardDescription>
            </div>
            <SituationBadge situation={servidor.situation} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg bg-[#1F2937]/40 border border-[#263244]">
              <span className="text-[11px] text-[#94A3B8] block mb-1">Matrícula Funcional</span>
              <span className="text-sm font-semibold font-mono text-[#F8FAFC]">
                {servidor.matricula}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#1F2937]/40 border border-[#263244]">
              <span className="text-[11px] text-[#94A3B8] block mb-1">Seção / Lotação</span>
              <span className="text-sm font-semibold text-[#CBD5E1] truncate block">
                {servidor.secao}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#1F2937]/40 border border-[#263244]">
              <span className="text-[11px] text-[#94A3B8] block mb-1">Cargo / Função</span>
              <span className="text-sm font-semibold text-[#CBD5E1] truncate block">
                {servidor.role}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#1F2937]/40 border border-[#263244]">
              <span className="text-[11px] text-[#94A3B8] block mb-1">Contatos Institucionais</span>
              <span className="text-xs text-[#94A3B8] truncate block">{servidor.email}</span>
              <span className="text-xs text-[#94A3B8] font-mono mt-0.5 block">{servidor.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vacation Balance Visual Card */}
      <BalanceCard
        direitoAnual={balances.direitoAnual}
        saldoAcumulado={balances.saldoAcumulado}
        totalDisponivel={balances.totalDisponivel}
        diasUtilizados={balances.diasUtilizados}
        saldoRestante={balances.saldoRestante}
        percentUtilizado={balances.percentUtilizado}
        servidorName={servidor.name}
      />

      {/* Vacation History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico e Cronograma de Férias</CardTitle>
              <CardDescription>
                Registro de todos os períodos fracionados, gozados e previstos para este servidor.
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-[#94A3B8]">
              {serverPeriods.length} período(s) cadastrado(s)
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#263244] bg-[#1F2937]/50 text-[#94A3B8]">
                  <th className="py-3 px-4 font-semibold">Período de Usufruto</th>
                  <th className="py-3 px-3 font-semibold text-right">Duração (Dias)</th>
                  <th className="py-3 px-3 font-semibold text-center">Ano de Referência</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Observações</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263244]/60">
                {serverPeriods.map(period => (
                  <tr key={period.id} className="hover:bg-[#1F2937]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#F8FAFC]">
                      {formatDateBR(period.startDate)} até {formatDateBR(period.endDate)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-[#14B8A6]">
                      {period.daysCount} dias
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-[#94A3B8]">
                      {period.referenceYear}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={period.status} />
                    </td>
                    <td className="py-3.5 px-3 text-[#94A3B8] max-w-[200px] truncate">
                      {period.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {period.status === 'agendado' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => cancelPeriod(period.id)}
                          className="h-7 px-2 text-xs"
                          title="Cancelar este agendamento"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

                {serverPeriods.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                      Nenhum período de férias registrado ainda para este servidor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

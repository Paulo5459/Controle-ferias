import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarPlus,
  CalendarCheck,
  Clock,
  CheckCircle,
  CalendarDays,
  ArrowRight,
  Shield,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BalanceCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/Badge';
import { calculateServerBalances, formatDateBR } from '../utils/vacationCalculations';

export const MeusPeriodosPage: React.FC = () => {
  const { currentUser, periods, navigate, cancelPeriod, setSelectedServidorId } = useApp();

  const balances = useMemo(() => {
    return calculateServerBalances(currentUser, periods);
  }, [currentUser, periods]);

  // Current user's periods
  const myPeriods = useMemo(() => {
    return periods
      .filter(p => p.servidorId === currentUser.id)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [periods, currentUser.id]);

  const hoje = new Date().toISOString().split('T')[0];

  // Next upcoming period
  const proximoPeriodo = useMemo(() => {
    return myPeriods.find(p => p.startDate >= hoje || p.status === 'em_andamento');
  }, [myPeriods, hoje]);

  // Future periods
  const periodosFuturos = useMemo(() => {
    return myPeriods.filter(p => p.startDate > hoje && p.id !== proximoPeriodo?.id);
  }, [myPeriods, hoje, proximoPeriodo]);

  // Previous periods
  const periodosAnteriores = useMemo(() => {
    return myPeriods.filter(p => p.endDate < hoje);
  }, [myPeriods, hoje]);

  const handleRequestNew = () => {
    setSelectedServidorId(currentUser.id);
    navigate('/ferias/novo');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#14B8A6] uppercase tracking-wider">
            Portal do Servidor
          </span>
          <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
            Meus Períodos de Férias
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Acompanhe seu saldo individual, programação anual de usufruto e parcelas homologadas.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleRequestNew}>
          <CalendarPlus className="w-4 h-4 mr-1.5" />
          Agendar Novo Período
        </Button>
      </div>

      {/* Balance Summary Card */}
      <BalanceCard
        direitoAnual={balances.direitoAnual}
        saldoAcumulado={balances.saldoAcumulado}
        totalDisponivel={balances.totalDisponivel}
        diasUtilizados={balances.diasUtilizados}
        saldoRestante={balances.saldoRestante}
        percentUtilizado={balances.percentUtilizado}
        servidorName={currentUser.name}
      />

      {/* Próximo Período Highlight Card */}
      <Card className="bg-gradient-to-r from-[#111827] via-[#1E293B]/60 to-[#111827] border-[#2563EB]/40">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40 shrink-0">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider">
                  Próximo Afastamento Previsto
                </span>
                {proximoPeriodo ? (
                  <>
                    <h3 className="text-lg font-bold text-[#F8FAFC] mt-1 font-mono">
                      {formatDateBR(proximoPeriodo.startDate)} até {formatDateBR(proximoPeriodo.endDate)}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Duração de <strong>{proximoPeriodo.daysCount} dias corridos</strong> ({proximoPeriodo.notes || 'Período regular'}).
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-[#F8FAFC] mt-1">
                      Nenhum período agendado no momento
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Você ainda possui saldo disponível para planejar ao longo do ano.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              {proximoPeriodo && <StatusBadge status={proximoPeriodo.status} />}
              <Button size="sm" variant="accent" onClick={handleRequestNew}>
                Planejar Período
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid of Future vs Previous Periods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Períodos Futuros / Programados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#14B8A6]" />
              <span>Demais Períodos Futuros ({periodosFuturos.length})</span>
            </CardTitle>
            <CardDescription>
              Férias programadas para usufruto posterior neste exercício.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#263244]/60">
              {periodosFuturos.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
                  <div>
                    <div className="font-mono text-sm font-semibold text-[#F8FAFC]">
                      {formatDateBR(p.startDate)} a {formatDateBR(p.endDate)}
                    </div>
                    <div className="text-xs text-[#94A3B8] mt-0.5">
                      {p.daysCount} dias · {p.notes || 'Parcela regulamentar'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => cancelPeriod(p.id)}
                      className="h-7 w-7 p-0 text-[#EF4444]"
                      title="Cancelar período"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {periodosFuturos.length === 0 && (
                <div className="p-6 text-center text-xs text-[#94A3B8]">
                  Nenhum outro período futuro cadastrado.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Períodos Anteriores / Concluídos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              <span>Períodos Já Gozados / Concluídos ({periodosAnteriores.length})</span>
            </CardTitle>
            <CardDescription>
              Histórico de férias já usufruídas em períodos passados.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#263244]/60">
              {periodosAnteriores.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
                  <div>
                    <div className="font-mono text-sm font-semibold text-[#CBD5E1]">
                      {formatDateBR(p.startDate)} a {formatDateBR(p.endDate)}
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      {p.daysCount} dias · Ano base {p.referenceYear}
                    </div>
                  </div>
                  <StatusBadge status="concluido" />
                </div>
              ))}

              {periodosAnteriores.length === 0 && (
                <div className="p-6 text-center text-xs text-[#94A3B8]">
                  Nenhum período anterior registrado neste histórico.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

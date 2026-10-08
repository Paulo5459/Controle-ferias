import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Palmtree,
  CalendarClock,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  Eye,
  CalendarPlus,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConflictAlert } from '../components/ui/ConflictAlert';
import { calculateServerBalances, formatDateBR } from '../utils/vacationCalculations';

export const DashboardPage: React.FC = () => {
  const { servidores, periods, conflicts, navigate, setSelectedServidorId } = useApp();

  // Metrics calculations
  const totalServidores = servidores.length;
  
  // Em férias (atualmente afastados)
  const servidoresEmFerias = servidores.filter(s => s.situation === 'Em Férias').length;

  // Próximas férias (períodos futuros agendados)
  const hoje = new Date().toISOString().split('T')[0];
  const proximosPeriodos = periods
    .filter(p => p.startDate >= hoje || p.status === 'agendado')
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Consolidated vacation balances
  let totalDiasDisponiveis = 0;
  let totalDiasUtilizados = 0;
  let totalSaldoAcumulado = 0;
  let servidoresComSaldoPendente = 0;

  servidores.forEach(s => {
    const bal = calculateServerBalances(s, periods);
    totalDiasDisponiveis += bal.totalDisponivel;
    totalDiasUtilizados += bal.diasUtilizados;
    totalSaldoAcumulado += bal.saldoAcumulado;
    if (bal.saldoRestante > 0) {
      servidoresComSaldoPendente += 1;
    }
  });

  const percentUtilizadoGeral = totalDiasDisponiveis > 0 
    ? Math.round((totalDiasUtilizados / totalDiasDisponiveis) * 100) 
    : 0;

  const handleViewServidor = (servidorId: string) => {
    setSelectedServidorId(servidorId);
    navigate(`/servidores/${servidorId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
            Painel Geral de Férias e Efetivo
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Acompanhamento em tempo real do planejamento, saldos funcionais e continuidade dos serviços da seção.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => navigate('/calendario')}>
            Ver Calendário
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/ferias/novo')}>
            <CalendarPlus className="w-4 h-4 mr-1.5" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* 1. Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Servidores"
          value={totalServidores}
          subtitle="Quadro total cadastrado"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Em Férias"
          value={servidoresEmFerias}
          subtitle="Afastados atualmente"
          icon={Palmtree}
          variant="warning"
        />
        <StatCard
          title="Próximas Férias"
          value={proximosPeriodos.length}
          subtitle="Períodos programados"
          icon={CalendarClock}
          variant="teal"
        />
        <StatCard
          title="Conflitos"
          value={conflicts.length}
          subtitle={conflicts.length > 0 ? "Impacto de efetivo detectado" : "Sem conflitos na seção"}
          icon={AlertTriangle}
          variant={conflicts.length > 0 ? "warning" : "default"}
        />
      </div>

      {/* 2. Card: Saldo de Férias (Consolidado) */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>Saldo Geral de Férias da Seção</span>
                <span className="text-xs font-normal text-[#14B8A6] px-2 py-0.5 rounded bg-[#14B8A6]/10 border border-[#14B8A6]/20">
                  Exercício Vigente
                </span>
              </CardTitle>
              <CardDescription>
                Consolidação dos direitos anuais, saldos de períodos anteriores e utilização total.
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#94A3B8]">Saldo Disponível Total: </span>
              <span className="text-lg font-bold text-[#22C55E] font-mono tabular-nums">
                {totalDiasDisponiveis - totalDiasUtilizados} dias
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3.5 rounded-lg bg-[#1F2937]/50 border border-[#263244]">
              <span className="text-xs text-[#94A3B8] block">Total de Dias Disponíveis</span>
              <span className="text-xl font-bold text-[#60A5FA] font-mono tabular-nums mt-1 block">
                {totalDiasDisponiveis} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#1F2937]/50 border border-[#263244]">
              <span className="text-xs text-[#94A3B8] block">Dias Já Utilizados</span>
              <span className="text-xl font-bold text-[#F59E0B] font-mono tabular-nums mt-1 block">
                {totalDiasUtilizados} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#1F2937]/50 border border-[#263244]">
              <span className="text-xs text-[#94A3B8] block">Saldo Acumulado Anterior</span>
              <span className="text-xl font-bold text-[#8B5CF6] font-mono tabular-nums mt-1 block">
                +{totalSaldoAcumulado} <span className="text-xs font-normal text-[#94A3B8]">dias</span>
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#1F2937]/50 border border-[#263244]">
              <span className="text-xs text-[#94A3B8] block">Servidores c/ Saldo Pendente</span>
              <span className="text-xl font-bold text-[#22C55E] font-mono tabular-nums mt-1 block">
                {servidoresComSaldoPendente} <span className="text-xs font-normal text-[#94A3B8]">de {totalServidores}</span>
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-[#94A3B8] mb-1.5 font-mono tabular-nums">
              <span>Execução Global da Escala: {percentUtilizadoGeral}% agendado/utilizado</span>
              <span>Restante a programar: {100 - percentUtilizadoGeral}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#1F2937] rounded-full overflow-hidden p-0.5 border border-[#263244]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] transition-all duration-500"
                style={{ width: `${percentUtilizadoGeral}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Section: Atenção no Planejamento (Alertas e Conflitos) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#F8FAFC] tracking-tight">
              Atenção no planejamento
            </h3>
            <span className="text-[11px] text-[#94A3B8] bg-[#111827] px-2 py-0.5 rounded border border-[#263244]">
              Auditoria de Conflitos & Saldos
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            Painel Administrativo <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        {/* Dynamic conflict alerts */}
        {conflicts.length > 0 ? (
          <div className="space-y-3">
            {conflicts.map(conf => (
              <ConflictAlert
                key={conf.id}
                conflict={conf}
                onResolve={() => navigate('/calendario')}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#111827] border border-[#263244] text-xs text-[#94A3B8] flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#22C55E]" />
            <span>Nenhuma sobreposição crítica identificada no momento na escala das seções.</span>
          </div>
        )}

        {/* Additional Planning Advice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-lg bg-[#111827] border border-[#263244] flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#F59E0B]/15 text-[#F59E0B] shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F8FAFC]">Servidores com saldo disponível acumulado</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Roberto Viana (DIRAD) e Pedro Henrique (DITEC) possuem saldos acumulados de períodos anteriores ainda não totalmente fracionados.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#111827] border border-[#263244] flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#2563EB]/15 text-[#60A5FA] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F8FAFC]">Prazo regimental de homologação</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Períodos previstos para o 1º trimestre de 2027 devem ser consolidados pela chefia imediata até 60 dias antes do usufruto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Table: Próximas Férias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Próximas Férias Agendadas</CardTitle>
              <CardDescription>
                Cronograma dos períodos programados para os próximos meses em todas as seções.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/calendario')}>
              Visualizar Calendário Completo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#263244] bg-[#1F2937]/40 text-[#94A3B8]">
                  <th className="py-3 px-4 font-semibold">Servidor</th>
                  <th className="py-3 px-4 font-semibold">Seção / Lotação</th>
                  <th className="py-3 px-4 font-semibold">Início</th>
                  <th className="py-3 px-4 font-semibold">Fim</th>
                  <th className="py-3 px-4 font-semibold text-right">Dias</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263244]/60">
                {proximosPeriodos.slice(0, 8).map(period => {
                  const srv = servidores.find(s => s.id === period.servidorId);
                  if (!srv) return null;

                  return (
                    <tr
                      key={period.id}
                      className="hover:bg-[#1F2937]/50 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#F8FAFC]">{srv.name}</div>
                        <div className="text-[11px] text-[#94A3B8]">Mat: {srv.matricula}</div>
                      </td>
                      <td className="py-3 px-4 text-[#CBD5E1]">
                        {srv.secao.split('-')[0].trim()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#F8FAFC]">
                        {formatDateBR(period.startDate)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#F8FAFC]">
                        {formatDateBR(period.endDate)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-semibold text-[#14B8A6]">
                        {period.daysCount} d
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={period.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewServidor(srv.id)}
                          className="h-7 px-2 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Ver Ficha
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

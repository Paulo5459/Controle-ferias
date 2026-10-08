import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  CalendarCheck,
  CalendarClock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Check,
  Trash2,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { calculateServerBalances, formatDateBR } from '../utils/vacationCalculations';
import { VacationStatus } from '../types';

export const AdminPage: React.FC = () => {
  const { servidores, periods, conflicts, updatePeriodStatus, cancelPeriod, navigate } = useApp();

  const [selectedServer, setSelectedServer] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const hoje = new Date().toISOString().split('T')[0];

  // Calculated metrics
  const totalServidores = servidores.length;
  const periodosCadastrados = periods.length;
  const feriasEmAndamento = periods.filter(p => p.status === 'em_andamento').length;
  const feriasFuturas = periods.filter(p => p.startDate >= hoje).length;
  const servidoresComSaldo = servidores.filter(
    s => calculateServerBalances(s, periods).saldoRestante > 0
  ).length;

  // Filtered periods
  const filteredPeriods = useMemo(() => {
    return periods.filter(p => {
      const matchServer = selectedServer === 'ALL' || p.servidorId === selectedServer;
      const matchYear = selectedYear === 'ALL' || String(p.referenceYear) === selectedYear;
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      
      let matchMonth = true;
      if (selectedMonth !== 'ALL') {
        const startM = p.startDate.split('-')[1];
        matchMonth = startM === selectedMonth;
      }

      return matchServer && matchYear && matchStatus && matchMonth;
    }).sort((a, b) => b.startDate.localeCompare(a.startDate));
  }, [periods, selectedServer, selectedYear, selectedStatus, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Módulo de Administração Institucional</span>
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
            Gestão e Homologação de Férias
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Supervisão geral, homologação de pedidos, controle de conflitos de escala e governança funcional.
          </p>
        </div>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263244]">
          <span className="text-[11px] text-[#94A3B8] block">Total Servidores</span>
          <span className="text-xl font-bold font-mono text-[#F8FAFC] mt-1 block">{totalServidores}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263244]">
          <span className="text-[11px] text-[#94A3B8] block">Períodos Gravados</span>
          <span className="text-xl font-bold font-mono text-[#60A5FA] mt-1 block">{periodosCadastrados}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263244]">
          <span className="text-[11px] text-[#94A3B8] block">Em Andamento</span>
          <span className="text-xl font-bold font-mono text-[#F59E0B] mt-1 block">{feriasEmAndamento}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263244]">
          <span className="text-[11px] text-[#94A3B8] block">Férias Futuras</span>
          <span className="text-xl font-bold font-mono text-[#2DD4BF] mt-1 block">{feriasFuturas}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263244]">
          <span className="text-[11px] text-[#94A3B8] block">Conflitos Efetivo</span>
          <span className="text-xl font-bold font-mono text-[#EF4444] mt-1 block">{conflicts.length}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#263244]">
          <span className="text-[11px] text-[#94A3B8] block">Com Saldo Pend.</span>
          <span className="text-xl font-bold font-mono text-[#22C55E] mt-1 block">{servidoresComSaldo}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Filter by Server */}
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Filtrar por Servidor</label>
              <select
                value={selectedServer}
                onChange={e => setSelectedServer(e.target.value)}
                className="w-full bg-[#111827] border border-[#263244] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC]"
              >
                <option value="ALL">Todos os Servidores</option>
                {servidores.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Year */}
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Ano de Referência</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full bg-[#111827] border border-[#263244] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC]"
              >
                <option value="ALL">Todos os Anos</option>
                <option value="2027">2027</option>
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Filter by Month */}
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Mês de Início</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-full bg-[#111827] border border-[#263244] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC]"
              >
                <option value="ALL">Todos os Meses</option>
                <option value="01">Janeiro (01)</option>
                <option value="02">Fevereiro (02)</option>
                <option value="03">Março (03)</option>
                <option value="04">Abril (04)</option>
                <option value="05">Maio (05)</option>
                <option value="06">Junho (06)</option>
                <option value="07">Julho (07)</option>
                <option value="08">Agosto (08)</option>
                <option value="09">Setembro (09)</option>
                <option value="10">Outubro (10)</option>
                <option value="11">Novembro (11)</option>
                <option value="12">Dezembro (12)</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">Situação / Status</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full bg-[#111827] border border-[#263244] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC]"
              >
                <option value="ALL">Todos os Status</option>
                <option value="agendado">Agendado</option>
                <option value="homologado">Homologado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Periods Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Painel de Controle e Homologação de Períodos</CardTitle>
              <CardDescription>
                Homologue pedidos ou ajuste o status conforme as deliberações da chefia.
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-[#94A3B8]">
              {filteredPeriods.length} período(s) encontrado(s)
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#263244] bg-[#1F2937]/50 text-[#94A3B8]">
                  <th className="py-3 px-4 font-semibold">Servidor</th>
                  <th className="py-3 px-3 font-semibold">Seção</th>
                  <th className="py-3 px-3 font-semibold">Período</th>
                  <th className="py-3 px-3 font-semibold text-right">Dias</th>
                  <th className="py-3 px-3 font-semibold">Status Atual</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações Administrativas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263244]/60">
                {filteredPeriods.map(period => {
                  const srv = servidores.find(s => s.id === period.servidorId);

                  return (
                    <tr key={period.id} className="hover:bg-[#1F2937]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#F8FAFC]">{srv?.name}</div>
                        <div className="text-[11px] text-[#94A3B8]">Mat: {srv?.matricula}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[#CBD5E1]">
                        {srv?.secao.split('-')[0].trim()}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#38BDF8]">
                        {formatDateBR(period.startDate)} a {formatDateBR(period.endDate)}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-right text-[#14B8A6]">
                        {period.daysCount} d
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={period.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {period.status === 'agendado' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updatePeriodStatus(period.id, 'homologado')}
                              className="h-7 px-2 text-xs text-[#22C55E] hover:text-[#4ADE80]"
                              title="Homologar este período"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Homologar
                            </Button>
                          )}
                          {period.status === 'homologado' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updatePeriodStatus(period.id, 'agendado')}
                              className="h-7 px-2 text-xs text-[#60A5FA]"
                              title="Reverter para Agendado"
                            >
                              Reverter
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => cancelPeriod(period.id)}
                            className="h-7 px-2 text-xs text-[#EF4444]"
                            title="Cancelar e restabelecer saldo"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredPeriods.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#94A3B8]">
                      Nenhum período de férias encontrado com os filtros selecionados.
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

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Users,
  Filter,
  Layers,
  CalendarDays,
  CalendarRange,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConflictAlert } from '../components/ui/ConflictAlert';
import { StatusBadge } from '../components/ui/Badge';
import { MONTH_NAMES_PT, formatDateBR, formatDateShortBR } from '../utils/vacationCalculations';

export const CalendarioPage: React.FC = () => {
  const { servidores, periods, conflicts, navigate } = useApp();

  const [currentYear, setCurrentYear] = useState<number>(2027);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(6); // July (month 6, 0-indexed) where conflict is prominent!
  const [viewMode, setViewMode] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  // Available sections
  const sections = useMemo(() => {
    return Array.from(new Set(servidores.map(s => s.secao))).sort();
  }, [servidores]);

  // Filter periods by year and optional section
  const relevantPeriods = useMemo(() => {
    return periods.filter(p => {
      const srv = servidores.find(s => s.id === p.servidorId);
      if (!srv) return false;
      const matchesYear = p.startDate.startsWith(`${currentYear}`) || p.endDate.startsWith(`${currentYear}`);
      const matchesSection = selectedSection === 'ALL' || srv.secao === selectedSection;
      return matchesYear && matchesSection;
    });
  }, [periods, servidores, currentYear, selectedSection]);

  // Active month's periods (for Month View)
  const monthPeriods = useMemo(() => {
    const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
    const prefix = `${currentYear}-${monthStr}`;

    return relevantPeriods
      .filter(p => {
        // Starts or ends in this month, or spans across it
        const startMonth = p.startDate.substring(0, 7);
        const endMonth = p.endDate.substring(0, 7);
        return startMonth <= prefix && prefix <= endMonth;
      })
      .map(p => {
        const srv = servidores.find(s => s.id === p.servidorId);
        return {
          ...p,
          servidor: srv,
        };
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [relevantPeriods, currentYear, currentMonthIndex, servidores]);

  // Find conflicts specific to current month
  const currentMonthConflicts = useMemo(() => {
    const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
    const prefix = `${currentYear}-${monthStr}`;
    return conflicts.filter(c => {
      const startMonth = c.dateStart.substring(0, 7);
      const endMonth = c.dateEnd.substring(0, 7);
      return startMonth <= prefix && prefix <= endMonth;
    });
  }, [conflicts, currentYear, currentMonthIndex]);

  // Generate days in month for the month view grid
  const daysInCurrentMonth = useMemo(() => {
    const date = new Date(currentYear, currentMonthIndex + 1, 0);
    return date.getDate();
  }, [currentYear, currentMonthIndex]);

  const nextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonthIndex(m => m + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonthIndex(m => m - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
            Calendário Anual e Mensal de Férias
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Visualização cronológica das férias programadas e monitoramento visual de sobreposições de efetivo.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-[#111827] border border-[#263244] p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setViewMode('mes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'mes'
                  ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode('trimestre')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'trimestre'
                  ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setViewMode('ano')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'ano'
                  ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Ano Completo
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Month Navigation Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Month Selector Controls */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={prevMonth} className="h-8 w-8 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center min-w-[160px]">
              <span className="text-sm font-bold text-[#F8FAFC] block">
                {MONTH_NAMES_PT[currentMonthIndex]} de {currentYear}
              </span>
              <span className="text-[10px] text-[#14B8A6] font-mono uppercase tracking-wider">
                {monthPeriods.length} servidores escalados
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={nextMonth} className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Section Filter */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] whitespace-nowrap">Filtrar Lotação:</span>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="bg-[#111827] border border-[#263244] rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="ALL">Todas as Seções</option>
              {sections.map(sec => (
                <option key={sec} value={sec}>
                  {sec.split('-')[0].trim()}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Conflict Highlights (if any in this month) */}
      {currentMonthConflicts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F59E0B]">
            <AlertTriangle className="w-4 h-4" />
            <span>Alerta de Sobreposição Detectado neste Mês</span>
          </div>
          {currentMonthConflicts.map(conf => (
            <ConflictAlert key={conf.id} conflict={conf} />
          ))}
        </div>
      )}

      {/* VIEW MODE: MÊS */}
      {viewMode === 'mes' && (
        <div className="space-y-6">
          {/* Table representation matching exact prompt example */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="uppercase font-mono text-[#F8FAFC]">
                    {MONTH_NAMES_PT[currentMonthIndex]} {currentYear}
                  </CardTitle>
                  <CardDescription>
                    Escala de férias cadastrada para os servidores da seção no mês.
                  </CardDescription>
                </div>
                <Button size="sm" variant="primary" onClick={() => navigate('/ferias/novo')}>
                  + Incluir Férias neste Mês
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#263244] bg-[#1F2937]/50 text-[#94A3B8]">
                      <th className="py-3 px-4 font-semibold">Servidor</th>
                      <th className="py-3 px-4 font-semibold">Seção / Lotação</th>
                      <th className="py-3 px-4 font-semibold">Período</th>
                      <th className="py-3 px-4 font-semibold text-right">Dias</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#263244]/60">
                    {monthPeriods.map(p => (
                      <tr
                        key={p.id}
                        className="hover:bg-[#1F2937]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">
                          <div>{p.servidor?.name}</div>
                          <div className="text-[11px] text-[#94A3B8]">Mat: {p.servidor?.matricula}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#CBD5E1]">
                          {p.servidor?.secao}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#60A5FA]">
                          {formatDateShortBR(p.startDate)} – {formatDateShortBR(p.endDate)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#14B8A6] text-right">
                          {p.daysCount}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}

                    {monthPeriods.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-[#94A3B8]">
                          Nenhum servidor em férias no mês de {MONTH_NAMES_PT[currentMonthIndex]} de {currentYear}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Visual Gantt-like Grid of the Month */}
          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo Visual do Mês (1 a {daysInCurrentMonth})</CardTitle>
              <CardDescription>
                Acompanhe a distribuição diária dos afastamentos ao longo do mês.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthPeriods.map(p => {
                  const sDay = parseInt(p.startDate.split('-')[2], 10);
                  const eDay = parseInt(p.endDate.split('-')[2], 10);
                  
                  // Compute start and end percentage relative to month days
                  const startPct = Math.max(0, ((sDay - 1) / daysInCurrentMonth) * 100);
                  const widthPct = Math.max(5, ((Math.min(eDay, daysInCurrentMonth) - sDay + 1) / daysInCurrentMonth) * 100);

                  return (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between text-xs text-[#94A3B8]">
                        <span className="font-medium text-[#F8FAFC]">{p.servidor?.name}</span>
                        <span className="font-mono text-[#38BDF8]">
                          {formatDateShortBR(p.startDate)} a {formatDateShortBR(p.endDate)} ({p.daysCount}d)
                        </span>
                      </div>
                      <div className="h-6 w-full bg-[#1F2937]/50 rounded-lg relative overflow-hidden border border-[#263244]/80">
                        <div
                          className="absolute top-1 bottom-1 rounded bg-gradient-to-r from-[#2563EB] to-[#14B8A6] flex items-center px-2 text-[10px] text-white font-semibold truncate shadow-xs"
                          style={{
                            left: `${startPct}%`,
                            width: `${widthPct}%`,
                          }}
                        >
                          {p.servidor?.name.split(' ')[0]} ({p.daysCount}d)
                        </div>
                      </div>
                    </div>
                  );
                })}

                {monthPeriods.length === 0 && (
                  <p className="text-xs text-[#94A3B8] text-center py-4">Sem afastamentos nesta linha do tempo.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* VIEW MODE: TRIMESTRE */}
      {viewMode === 'trimestre' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map(offset => {
            const mIdx = (Math.floor(currentMonthIndex / 3) * 3) + offset;
            const mName = MONTH_NAMES_PT[mIdx];
            const mPrefix = `${currentYear}-${String(mIdx + 1).padStart(2, '0')}`;
            const mList = relevantPeriods.filter(
              p => p.startDate.substring(0, 7) <= mPrefix && mPrefix <= p.endDate.substring(0, 7)
            );

            return (
              <Card key={mIdx}>
                <CardHeader className="p-4 pb-2 border-b border-[#263244]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-[#F8FAFC] uppercase font-mono">
                      {mName}
                    </CardTitle>
                    <span className="text-xs font-mono text-[#14B8A6]">{mList.length} períod.(s)</span>
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {mList.map(p => {
                    const srv = servidores.find(s => s.id === p.servidorId);
                    return (
                      <div
                        key={p.id}
                        className="p-2 rounded bg-[#1F2937]/60 border border-[#263244] text-xs flex justify-between items-center"
                      >
                        <div className="truncate mr-2">
                          <p className="font-medium text-[#F8FAFC] truncate">{srv?.name}</p>
                          <p className="text-[10px] text-[#94A3B8] font-mono">
                            {formatDateShortBR(p.startDate)} a {formatDateShortBR(p.endDate)}
                          </p>
                        </div>
                        <span className="font-mono text-[#14B8A6] font-bold shrink-0">{p.daysCount}d</span>
                      </div>
                    );
                  })}
                  {mList.length === 0 && (
                    <p className="text-[11px] text-[#64748B] text-center py-4">Nenhum servidor em férias</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* VIEW MODE: ANO COMPLETO */}
      {viewMode === 'ano' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MONTH_NAMES_PT.map((mName, mIdx) => {
            const mPrefix = `${currentYear}-${String(mIdx + 1).padStart(2, '0')}`;
            const mList = relevantPeriods.filter(
              p => p.startDate.substring(0, 7) <= mPrefix && mPrefix <= p.endDate.substring(0, 7)
            );

            return (
              <Card
                key={mIdx}
                className="hover:border-[#2563EB]/40 cursor-pointer transition-colors"
                onClick={() => {
                  setCurrentMonthIndex(mIdx);
                  setViewMode('mes');
                }}
              >
                <div className="p-3.5 border-b border-[#263244] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFC] uppercase font-mono">{mName}</span>
                  <span className="text-[11px] font-mono text-[#60A5FA] bg-[#2563EB]/15 px-2 py-0.5 rounded border border-[#2563EB]/30">
                    {mList.length}
                  </span>
                </div>
                <div className="p-3 space-y-1.5 min-h-[90px]">
                  {mList.slice(0, 3).map(p => {
                    const srv = servidores.find(s => s.id === p.servidorId);
                    return (
                      <div key={p.id} className="text-[11px] flex justify-between text-[#94A3B8] truncate">
                        <span className="truncate mr-1 text-[#CBD5E1]">{srv?.name.split(' ')[0]}</span>
                        <span className="font-mono text-[#38BDF8] shrink-0">{p.daysCount}d</span>
                      </div>
                    );
                  })}
                  {mList.length > 3 && (
                    <span className="text-[10px] text-[#14B8A6] block mt-1">
                      +{mList.length - 3} outros servidores...
                    </span>
                  )}
                  {mList.length === 0 && (
                    <span className="text-[10px] text-[#64748B] block pt-3 text-center">Sem afastamentos</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarPlus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  User,
  ArrowRight,
  Split,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  calculateDaysBetween,
  addDaysInclusive,
  calculateServerBalances,
  formatDateBR,
  datesOverlap,
} from '../utils/vacationCalculations';

export const AgendarFeriasPage: React.FC = () => {
  const { servidores, periods, addPeriod, navigate, selectedServidorId, setSelectedServidorId } = useApp();

  const [servidorId, setServidorId] = useState<string>(() => selectedServidorId || servidores[0]?.id || 'srv-1');
  const [referenceYear, setReferenceYear] = useState<number>(2027);
  const [startDate, setStartDate] = useState<string>('2027-06-01');
  const [endDate, setEndDate] = useState<string>('2027-06-15');
  const [notes, setNotes] = useState<string>('');

  const currentServidor = useMemo(() => {
    return servidores.find(s => s.id === servidorId) || servidores[0];
  }, [servidores, servidorId]);

  // Current balance of selected server
  const balances = useMemo(() => {
    return calculateServerBalances(currentServidor, periods);
  }, [currentServidor, periods]);

  // Calculated requested days
  const daysRequested = useMemo(() => {
    return calculateDaysBetween(startDate, endDate);
  }, [startDate, endDate]);

  // Projected remaining balance
  const projectedBalance = balances.saldoRestante - daysRequested;

  // Realtime Validations
  const validationError = useMemo(() => {
    if (!startDate || !endDate) {
      return 'Selecione as datas de início e fim do período.';
    }

    if (endDate < startDate) {
      return 'A data final não pode ser anterior à data inicial.';
    }

    if (daysRequested <= 0) {
      return 'A duração do período deve ser de pelo menos 1 dia.';
    }

    if (daysRequested > balances.saldoRestante) {
      return `Saldo insuficiente: O servidor possui apenas ${balances.saldoRestante} dias disponíveis, mas foram solicitados ${daysRequested} dias.`;
    }

    // Check overlap with the same server
    const selfOverlap = periods.some(
      p =>
        p.servidorId === servidorId &&
        datesOverlap(startDate, endDate, p.startDate, p.endDate)
    );

    if (selfOverlap) {
      return 'Conflito de período: O servidor já possui férias registradas nessas datas ou em intervalo concorrente.';
    }

    return null;
  }, [startDate, endDate, daysRequested, balances.saldoRestante, periods, servidorId]);

  // Check section coworkers overlap (for non-blocking advisory alert)
  const coworkerOverlaps = useMemo(() => {
    if (!startDate || !endDate || !currentServidor) return [];
    
    const overlaps: { name: string; matricula: string; period: string }[] = [];
    periods.forEach(p => {
      if (p.servidorId === currentServidor.id) return;
      const otherServ = servidores.find(s => s.id === p.servidorId);
      if (otherServ && otherServ.secao === currentServidor.secao) {
        if (datesOverlap(startDate, endDate, p.startDate, p.endDate)) {
          overlaps.push({
            name: otherServ.name,
            matricula: otherServ.matricula,
            period: `${formatDateBR(p.startDate)} a ${formatDateBR(p.endDate)}`,
          });
        }
      }
    });

    return overlaps;
  }, [startDate, endDate, currentServidor, periods, servidores]);

  // Quick fraction buttons
  const handleApplyFraction = (days: number) => {
    if (!startDate) return;
    const computedEnd = addDaysInclusive(startDate, days);
    setEndDate(computedEnd);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) return;

    const result = addPeriod({
      servidorId,
      referenceYear,
      startDate,
      endDate,
      daysCount: daysRequested,
      status: 'agendado',
      notes: notes.trim() || undefined,
    });

    if (result.success) {
      setSelectedServidorId(servidorId);
      navigate(`/servidores/${servidorId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>Agendamento de Período de Férias</span>
        </div>
        <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
          Registrar e Fracionar Período
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1">
          Defina as datas com cálculo automático de dias e validação de saldo e conflitos de equipe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Form Fields */}
          <div className="md:col-span-7 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Identificação do Servidor e Exercício</CardTitle>
                <CardDescription>
                  Selecione o servidor público e o ano de referência do direito a férias.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Servidor Select */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    Servidor Público
                  </label>
                  <select
                    value={servidorId}
                    onChange={e => setServidorId(e.target.value)}
                    className="w-full bg-[#111827] border border-[#263244] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                  >
                    {servidores.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Mat: {s.matricula}) — {s.secao.split('-')[0].trim()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ano de Referência */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    Ano de Referência / Exercício
                  </label>
                  <select
                    value={referenceYear}
                    onChange={e => setReferenceYear(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-[#263244] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value={2027}>Exercício 2027 (Planejamento Vigente)</option>
                    <option value={2026}>Exercício 2026 (Períodos Anteriores)</option>
                    <option value={2028}>Exercício 2028 (Planejamento Futuro)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Período Solicitado</CardTitle>
                <CardDescription>
                  Informe a data inicial e final ou utilize os atalhos de fracionamento regulamentar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Fraction Shortcuts */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Split className="w-3.5 h-3.5 text-[#14B8A6]" />
                      Atalhos Rápidos de Fracionamento:
                    </span>
                    <span className="text-[11px] text-[#64748B]">a partir da data inicial</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 20, 30].map(fractionDays => (
                      <button
                        key={fractionDays}
                        type="button"
                        onClick={() => handleApplyFraction(fractionDays)}
                        disabled={fractionDays > balances.saldoRestante}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          daysRequested === fractionDays
                            ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                            : fractionDays > balances.saldoRestante
                            ? 'bg-[#1F2937]/30 text-[#64748B] border-[#263244] cursor-not-allowed'
                            : 'bg-[#1F2937] hover:bg-[#263244] text-[#F8FAFC] border-[#263244]'
                        }`}
                      >
                        {fractionDays} dias
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Data Inicial"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                  <Input
                    label="Data Final"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                  />
                </div>

                {/* Days Count Auto Calculated Display */}
                <div className="p-3.5 rounded-lg bg-[#1F2937]/50 border border-[#263244] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#14B8A6]" />
                    <span className="text-xs text-[#94A3B8]">Duração calculada:</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#F8FAFC]">
                    {daysRequested > 0 ? (
                      <span className="text-[#14B8A6]">{daysRequested} dias corridos</span>
                    ) : (
                      <span className="text-[#EF4444]">Data inválida</span>
                    )}
                  </div>
                </div>

                {/* Observações */}
                <Input
                  label="Observações / Motivação (Opcional)"
                  placeholder="Ex: 1ª parcela de férias; recesso de inverno; adiantamento"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Balance Simulation & Validations */}
          <div className="md:col-span-5 space-y-5">
            <Card className="bg-gradient-to-b from-[#111827] to-[#1E293B]/70 border-[#263244]">
              <CardHeader>
                <CardTitle>Simulação do Saldo</CardTitle>
                <CardDescription>
                  Cálculo em tempo real do impacto no saldo do servidor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#263244]/60">
                    <span className="text-[#94A3B8]">Direito Anual ({referenceYear})</span>
                    <span className="font-mono text-[#F8FAFC]">{balances.direitoAnual} dias</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-[#263244]/60">
                    <span className="text-[#94A3B8]">Saldo Acumulado Anterior</span>
                    <span className="font-mono text-[#8B5CF6]">+{balances.saldoAcumulado} dias</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-[#263244]/60 font-medium">
                    <span className="text-[#CBD5E1]">Total Disponível</span>
                    <span className="font-mono text-[#60A5FA]">{balances.totalDisponivel} dias</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-[#263244]/60">
                    <span className="text-[#94A3B8]">Dias Já Utilizados / Agendados</span>
                    <span className="font-mono text-[#F59E0B]">{balances.diasUtilizados} dias</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-[#263244] font-semibold text-sm">
                    <span className="text-[#F8FAFC]">Saldo Disponível Atual</span>
                    <span className="font-mono text-[#22C55E]">{balances.saldoRestante} dias</span>
                  </div>

                  <div className="flex justify-between py-1.5 text-xs font-semibold">
                    <span className="text-[#F8FAFC]">Dias Solicitados Neste Período</span>
                    <span className="font-mono text-[#14B8A6]">{daysRequested} dias</span>
                  </div>

                  {/* Projected Remaining */}
                  <div className={`p-3.5 rounded-lg border mt-3 ${
                    projectedBalance >= 0
                      ? 'bg-[#111827] border-[#22C55E]/40 text-[#22C55E]'
                      : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Saldo Após o Período:</span>
                      <span className="text-xl font-bold font-mono tabular-nums">
                        {projectedBalance >= 0 ? `${projectedBalance} dias` : `${projectedBalance} dias`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Validation Message Box */}
                {validationError ? (
                  <div className="p-3.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Não é possível agendar</span>
                      <span>{validationError}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Período válido e dentro do saldo disponível.</span>
                  </div>
                )}

                {/* Coworker Overlap Advisory Box */}
                {coworkerOverlaps.length > 0 && (
                  <div className="p-3.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Alerta de Efetivo na Mesma Seção</span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1]">
                      Servidores da mesma lotação ({currentServidor.secao.split('-')[0].trim()}) já agendados nestas datas:
                    </p>
                    <ul className="space-y-1">
                      {coworkerOverlaps.map((c, i) => (
                        <li key={i} className="text-[11px] text-[#F8FAFC] flex justify-between">
                          <span>{c.name}</span>
                          <span className="font-mono text-[#F59E0B]">{c.period}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={!!validationError}
                    className="w-full shadow-lg"
                  >
                    <span>Confirmar Agendamento</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rule summary guide */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#263244] text-xs text-[#94A3B8] space-y-1.5">
              <span className="font-semibold text-[#F8FAFC] block flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#14B8A6]" />
                Regras de Fracionamento Institucional
              </span>
              <p>• As férias podem ser usufruídas em parcelas (ex: 10, 15, 20 ou 30 dias).</p>
              <p>• A soma de todos os períodos não pode exceder o saldo total disponível.</p>
              <p>• O cancelamento pode ser efetuado na ficha do servidor antes do início.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

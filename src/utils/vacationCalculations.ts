import { Servidor, VacationPeriod, ConflictAlertItem } from '../types';

/**
 * Calculates number of calendar days between two dates inclusive (YYYY-MM-DD)
 */
export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (end < start) return 0;
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  return diffDays;
}

/**
 * Given a start date string (YYYY-MM-DD) and a number of days, calculates end date string inclusive
 */
export function addDaysInclusive(startDateStr: string, daysCount: number): string {
  if (!startDateStr || daysCount <= 0) return startDateStr;
  const start = new Date(startDateStr + 'T00:00:00');
  if (isNaN(start.getTime())) return startDateStr;
  
  // start is day 1, so we add (daysCount - 1) days
  const end = new Date(start.getTime() + (daysCount - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split('T')[0];
}

/**
 * Formats YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Formats YYYY-MM-DD to short DD/MM
 */
export function formatDateShortBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}`;
}

/**
 * Checks whether two date ranges [s1, e1] and [s2, e2] overlap
 */
export function datesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  return s1 <= e2 && s2 <= e1;
}

/**
 * Calculates financial / functional vacation balances for a specific server
 */
export function calculateServerBalances(servidor: Servidor, periods: VacationPeriod[]) {
  const serverPeriods = periods.filter(p => p.servidorId === servidor.id);
  const totalDisponivel = (servidor.direitoAnual || 30) + (servidor.saldoAcumulado || 0);
  
  const diasUtilizados = serverPeriods.reduce((acc, p) => acc + (p.daysCount || 0), 0);
  const saldoRestante = Math.max(0, totalDisponivel - diasUtilizados);
  const percentUtilizado = totalDisponivel > 0 ? Math.min(100, Math.round((diasUtilizados / totalDisponivel) * 100)) : 0;
  
  return {
    direitoAnual: servidor.direitoAnual || 30,
    saldoAcumulado: servidor.saldoAcumulado || 0,
    totalDisponivel,
    diasUtilizados,
    saldoRestante,
    percentUtilizado,
  };
}

/**
 * Analyzes periods to identify workforce conflicts (servers overlapping in same section or team)
 */
export function detectWorkforceConflicts(
  servidores: Servidor[],
  periods: VacationPeriod[]
): ConflictAlertItem[] {
  const conflicts: ConflictAlertItem[] = [];
  const serverMap = new Map(servidores.map(s => [s.id, s]));

  // Group periods by section
  const sectionMap = new Map<string, { period: VacationPeriod; servidor: Servidor }[]>();

  periods.forEach(p => {
    const s = serverMap.get(p.servidorId);
    if (!s) return;
    if (!sectionMap.has(s.secao)) {
      sectionMap.set(s.secao, []);
    }
    sectionMap.get(s.secao)!.push({ period: p, servidor: s });
  });

  // For each section, find overlapping sets
  sectionMap.forEach((items, secao) => {
    // Compare pairs
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];

        if (itemA.servidor.id === itemB.servidor.id) continue;

        if (datesOverlap(itemA.period.startDate, itemA.period.endDate, itemB.period.startDate, itemB.period.endDate)) {
          // Check overlap window
          const overlapStart = itemA.period.startDate > itemB.period.startDate ? itemA.period.startDate : itemB.period.startDate;
          const overlapEnd = itemA.period.endDate < itemB.period.endDate ? itemA.period.endDate : itemB.period.endDate;

          // Check if there's an existing conflict record covering this window and section
          const existing = conflicts.find(c => c.secao === secao && datesOverlap(c.dateStart, c.dateEnd, overlapStart, overlapEnd));
          
          if (existing) {
            if (!existing.servidores.some(srv => srv.id === itemA.servidor.id)) {
              existing.servidores.push({
                id: itemA.servidor.id,
                name: itemA.servidor.name,
                matricula: itemA.servidor.matricula,
                periodo: `${formatDateShortBR(itemA.period.startDate)} - ${formatDateShortBR(itemA.period.endDate)}`,
              });
            }
            if (!existing.servidores.some(srv => srv.id === itemB.servidor.id)) {
              existing.servidores.push({
                id: itemB.servidor.id,
                name: itemB.servidor.name,
                matricula: itemB.servidor.matricula,
                periodo: `${formatDateShortBR(itemB.period.startDate)} - ${formatDateShortBR(itemB.period.endDate)}`,
              });
            }
            if (existing.servidores.length >= 3) {
              existing.severity = 'critico';
              existing.message = `${existing.servidores.length} servidores da seção ${secao} estarão afastados simultaneamente.`;
            }
          } else {
            conflicts.push({
              id: `conflict-${secao}-${overlapStart}`,
              dateStart: overlapStart,
              dateEnd: overlapEnd,
              secao,
              severity: 'alerta',
              message: `Sobreposição de férias na seção ${secao} entre ${formatDateBR(overlapStart)} e ${formatDateBR(overlapEnd)}.`,
              servidores: [
                {
                  id: itemA.servidor.id,
                  name: itemA.servidor.name,
                  matricula: itemA.servidor.matricula,
                  periodo: `${formatDateShortBR(itemA.period.startDate)} - ${formatDateShortBR(itemA.period.endDate)}`,
                },
                {
                  id: itemB.servidor.id,
                  name: itemB.servidor.name,
                  matricula: itemB.servidor.matricula,
                  periodo: `${formatDateShortBR(itemB.period.startDate)} - ${formatDateShortBR(itemB.period.endDate)}`,
                },
              ],
            });
          }
        }
      }
    }
  });

  return conflicts;
}

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

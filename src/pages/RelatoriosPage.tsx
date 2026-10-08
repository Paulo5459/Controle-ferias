import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  Eye,
  Filter,
  CheckCircle2,
  Calendar,
  Users,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { calculateServerBalances, formatDateBR } from '../utils/vacationCalculations';

type ReportType = 'servidor' | 'anual' | 'efetivo' | 'saldo';

export const RelatoriosPage: React.FC = () => {
  const { servidores, periods, showToast } = useApp();
  const [activeReport, setActiveReport] = useState<ReportType>('servidor');
  const [exportModal, setExportModal] = useState<{ isOpen: boolean; format: 'PDF' | 'Excel'; title: string } | null>(null);

  // Calculations for reports
  const serversWithBalances = useMemo(() => {
    return servidores.map(s => ({
      ...s,
      bal: calculateServerBalances(s, periods),
      periods: periods.filter(p => p.servidorId === s.id),
    }));
  }, [servidores, periods]);

  const handleExport = (format: 'PDF' | 'Excel', reportTitle: string) => {
    setExportModal({
      isOpen: true,
      format,
      title: reportTitle,
    });
  };

  const confirmMockExport = () => {
    if (exportModal) {
      showToast(
        'info',
        `Exportação em ${exportModal.format}`,
        `O documento "${exportModal.title}" foi compilado e o download será acionado na versão final.`
      );
      setExportModal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
          Relatórios e Demonstrativos Institucionais
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1">
          Emissão de mapas de férias, controle de efetivo e demonstrativo analítico de saldos da corporação.
        </p>
      </div>

      {/* Report Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Report 1 */}
        <Card
          className={`cursor-pointer transition-all ${
            activeReport === 'servidor'
              ? 'border-[#2563EB] bg-[#1E293B]/60 shadow-md ring-1 ring-[#2563EB]'
              : 'hover:border-slate-600'
          }`}
          onClick={() => setActiveReport('servidor')}
        >
          <CardContent className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#60A5FA] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F8FAFC]">Férias por Servidor</h4>
            <p className="text-xs text-[#94A3B8]">
              Nome, períodos concedidos, dias utilizados e saldo remanescente.
            </p>
          </CardContent>
        </Card>

        {/* Report 2 */}
        <Card
          className={`cursor-pointer transition-all ${
            activeReport === 'anual'
              ? 'border-[#14B8A6] bg-[#1E293B]/60 shadow-md ring-1 ring-[#14B8A6]'
              : 'hover:border-slate-600'
          }`}
          onClick={() => setActiveReport('anual')}
        >
          <CardContent className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/15 text-[#2DD4BF] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F8FAFC]">Relatório Anual</h4>
            <p className="text-xs text-[#94A3B8]">
              Consolidação de todos os períodos registrados para o exercício de 2027.
            </p>
          </CardContent>
        </Card>

        {/* Report 3 */}
        <Card
          className={`cursor-pointer transition-all ${
            activeReport === 'efetivo'
              ? 'border-[#F59E0B] bg-[#1E293B]/60 shadow-md ring-1 ring-[#F59E0B]'
              : 'hover:border-slate-600'
          }`}
          onClick={() => setActiveReport('efetivo')}
        >
          <CardContent className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 text-[#FBBF24] flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F8FAFC]">Impacto de Efetivo</h4>
            <p className="text-xs text-[#94A3B8]">
              Quantidade de servidores afastados por período e por seção.
            </p>
          </CardContent>
        </Card>

        {/* Report 4 */}
        <Card
          className={`cursor-pointer transition-all ${
            activeReport === 'saldo'
              ? 'border-[#8B5CF6] bg-[#1E293B]/60 shadow-md ring-1 ring-[#8B5CF6]'
              : 'hover:border-slate-600'
          }`}
          onClick={() => setActiveReport('saldo')}
        >
          <CardContent className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 text-[#C4B5FD] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F8FAFC]">Relatório de Saldo</h4>
            <p className="text-xs text-[#94A3B8]">
              Lista de servidores que ainda possuem saldo disponível não utilizado.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Report Preview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>
                {activeReport === 'servidor' && 'Demonstrativo de Férias por Servidor'}
                {activeReport === 'anual' && 'Mapa Anual Consolidado de Períodos de Férias'}
                {activeReport === 'efetivo' && 'Demonstrativo de Impacto no Efetivo das Seções'}
                {activeReport === 'saldo' && 'Relação de Servidores com Saldo Pendente de Fruição'}
              </CardTitle>
              <CardDescription>
                Visualização do relatório com parâmetros oficiais da corporação.
              </CardDescription>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleExport(
                    'PDF',
                    activeReport === 'servidor'
                      ? 'Relatorio_Ferias_Por_Servidor.pdf'
                      : activeReport === 'anual'
                      ? 'Relatorio_Anual_Ferias.pdf'
                      : activeReport === 'efetivo'
                      ? 'Relatorio_Efetivo_Secoes.pdf'
                      : 'Relatorio_Saldo_Disponivel.pdf'
                  )
                }
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Exportar PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleExport(
                    'Excel',
                    activeReport === 'servidor'
                      ? 'Relatorio_Ferias_Por_Servidor.xlsx'
                      : activeReport === 'anual'
                      ? 'Relatorio_Anual_Ferias.xlsx'
                      : activeReport === 'efetivo'
                      ? 'Relatorio_Efetivo_Secoes.xlsx'
                      : 'Relatorio_Saldo_Disponivel.xlsx'
                  )
                }
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[#22C55E]" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* TAB 1: Por Servidor */}
          {activeReport === 'servidor' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#263244] bg-[#1F2937]/50 text-[#94A3B8]">
                    <th className="py-3 px-4 font-semibold">Servidor</th>
                    <th className="py-3 px-3 font-semibold">Matrícula</th>
                    <th className="py-3 px-3 font-semibold">Períodos Cadastrados</th>
                    <th className="py-3 px-3 font-semibold text-right">Direito Total</th>
                    <th className="py-3 px-3 font-semibold text-right">Dias Utilizados</th>
                    <th className="py-3 px-4 font-semibold text-right">Saldo Restante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263244]/60">
                  {serversWithBalances.map(item => (
                    <tr key={item.id} className="hover:bg-[#1F2937]/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">{item.name}</td>
                      <td className="py-3.5 px-3 font-mono text-[#CBD5E1]">{item.matricula}</td>
                      <td className="py-3.5 px-3 text-[#94A3B8]">
                        {item.periods.length > 0 ? (
                          <div className="space-y-1">
                            {item.periods.map(p => (
                              <div key={p.id} className="font-mono text-[11px] text-[#38BDF8]">
                                {formatDateBR(p.startDate)} a {formatDateBR(p.endDate)} ({p.daysCount}d)
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>Nenhum período agendado</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#60A5FA]">
                        {item.bal.totalDisponivel} d
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#F59E0B]">
                        {item.bal.diasUtilizados} d
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#22C55E]">
                        {item.bal.saldoRestante} d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Anual */}
          {activeReport === 'anual' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#263244] bg-[#1F2937]/50 text-[#94A3B8]">
                    <th className="py-3 px-4 font-semibold">Data Início</th>
                    <th className="py-3 px-4 font-semibold">Data Fim</th>
                    <th className="py-3 px-4 font-semibold">Servidor</th>
                    <th className="py-3 px-4 font-semibold">Seção</th>
                    <th className="py-3 px-4 font-semibold text-right">Duração</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263244]/60">
                  {periods
                    .sort((a, b) => a.startDate.localeCompare(b.startDate))
                    .map(p => {
                      const s = servidores.find(srv => srv.id === p.servidorId);
                      return (
                        <tr key={p.id} className="hover:bg-[#1F2937]/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-[#F8FAFC]">{formatDateBR(p.startDate)}</td>
                          <td className="py-3.5 px-4 font-mono text-[#F8FAFC]">{formatDateBR(p.endDate)}</td>
                          <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">{s?.name}</td>
                          <td className="py-3.5 px-4 text-[#CBD5E1]">{s?.secao}</td>
                          <td className="py-3.5 px-4 font-mono text-right font-bold text-[#14B8A6]">{p.daysCount} d</td>
                          <td className="py-3.5 px-4 text-[#94A3B8] capitalize">{p.status}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Efetivo */}
          {activeReport === 'efetivo' && (
            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-lg bg-[#1F2937]/40 border border-[#263244] text-xs text-[#94A3B8]">
                Mapeamento da densidade de servidores simultaneamente afastados por mês e divisão administrativa.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from(new Set(servidores.map(s => s.secao))).map(sec => {
                  const secServidores = servidores.filter(s => s.secao === sec);
                  const secPeriods = periods.filter(p => secServidores.some(s => s.id === p.servidorId));
                  return (
                    <div key={sec} className="p-4 rounded-xl bg-[#111827] border border-[#263244] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-[#F8FAFC]">{sec}</span>
                        <span className="text-xs font-mono text-[#60A5FA]">{secServidores.length} servidores</span>
                      </div>
                      <div className="text-xs text-[#94A3B8]">
                        Total de períodos cadastrados na seção: <strong>{secPeriods.length}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Saldo */}
          {activeReport === 'saldo' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#263244] bg-[#1F2937]/50 text-[#94A3B8]">
                    <th className="py-3 px-4 font-semibold">Servidor</th>
                    <th className="py-3 px-4 font-semibold">Seção</th>
                    <th className="py-3 px-4 font-semibold text-right">Direito Anual</th>
                    <th className="py-3 px-4 font-semibold text-right">Saldo Acumulado</th>
                    <th className="py-3 px-4 font-semibold text-right">Saldo Disponível</th>
                    <th className="py-3 px-4 font-semibold">Status de Atenção</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263244]/60">
                  {serversWithBalances
                    .filter(s => s.bal.saldoRestante > 0)
                    .sort((a, b) => b.bal.saldoRestante - a.bal.saldoRestante)
                    .map(item => (
                      <tr key={item.id} className="hover:bg-[#1F2937]/40 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">{item.name}</td>
                        <td className="py-3.5 px-4 text-[#CBD5E1]">{item.secao}</td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">{item.bal.direitoAnual} d</td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#8B5CF6]">+{item.bal.saldoAcumulado} d</td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#22C55E]">
                          {item.bal.saldoRestante} d
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#F59E0B]">
                          {item.bal.saldoAcumulado > 0 ? 'Possui saldo acumulado pendente' : 'Dentro do exercício'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Confirmation Dialog */}
      {exportModal && (
        <Dialog
          isOpen={exportModal.isOpen}
          onClose={() => setExportModal(null)}
          title={`Exportação de Relatório (${exportModal.format})`}
          description="Geração de arquivo institucional formatado para arquivamento ou auditoria."
        >
          <div className="space-y-4">
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              No MVP, os botões de exportação apresentam esta confirmação técnica informando que os dados foram consolidados no formato <strong>{exportModal.format}</strong>. O download automático de arquivos binários será habilitado na fase de integração do backend.
            </p>
            <div className="p-3 rounded-lg bg-[#1F2937] border border-[#263244] text-xs font-mono text-[#14B8A6]">
              Arquivo gerado: {exportModal.title}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="secondary" onClick={() => setExportModal(null)}>
                Fechar
              </Button>
              <Button size="sm" variant="accent" onClick={confirmMockExport}>
                Simular Download
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

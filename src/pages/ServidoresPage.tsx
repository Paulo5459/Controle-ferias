import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CalendarPlus,
  UserCheck,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { SituationBadge } from '../components/ui/Badge';
import { calculateServerBalances } from '../utils/vacationCalculations';

export const ServidoresPage: React.FC = () => {
  const { servidores, periods, navigate, setSelectedServidorId } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'disponivel' | 'utilizado'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // List of distinct sections
  const sections = useMemo(() => {
    const list = Array.from(new Set(servidores.map(s => s.secao)));
    return list.sort();
  }, [servidores]);

  // Enriched servers with their calculated balances
  const enrichedServidores = useMemo(() => {
    return servidores.map(s => {
      const balances = calculateServerBalances(s, periods);
      return {
        ...s,
        balances,
      };
    });
  }, [servidores, periods]);

  // Filter and sort
  const filteredServidores = useMemo(() => {
    return enrichedServidores
      .filter(s => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSection = selectedSection === 'ALL' || s.secao === selectedSection;

        return matchesSearch && matchesSection;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortBy === 'disponivel') {
          return sortOrder === 'asc'
            ? a.balances.saldoRestante - b.balances.saldoRestante
            : b.balances.saldoRestante - a.balances.saldoRestante;
        }
        if (sortBy === 'utilizado') {
          return sortOrder === 'asc'
            ? a.balances.diasUtilizados - b.balances.diasUtilizados
            : b.balances.diasUtilizados - a.balances.diasUtilizados;
        }
        return 0;
      });
  }, [enrichedServidores, searchTerm, selectedSection, sortBy, sortOrder]);

  const handleOpenDetail = (id: string) => {
    setSelectedServidorId(id);
    navigate(`/servidores/${id}`);
  };

  const toggleSort = (type: 'name' | 'disponivel' | 'utilizado') => {
    if (sortBy === type) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
            Quadro de Servidores e Saldos
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Controle analítico de direitos anuais, saldos acumulados e dias disponíveis de cada servidor.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/ferias/novo')}>
          <CalendarPlus className="w-4 h-4 mr-1.5" />
          Agendar Férias
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Buscar por nome, matrícula ou função..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#111827] border border-[#263244] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Section Filter */}
            <div className="sm:col-span-4">
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="w-full bg-[#111827] border border-[#263244] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="ALL">Todas as Seções / Lotações</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Count Badge */}
            <div className="sm:col-span-2 text-right">
              <span className="text-xs font-mono text-[#94A3B8]">
                {filteredServidores.length} de {servidores.length} servidores
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#263244] bg-[#1F2937]/50 text-[#94A3B8]">
                  <th
                    className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#F8FAFC] select-none"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Servidor</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-semibold">Matrícula</th>
                  <th className="py-3.5 px-3 font-semibold">Lotação / Cargo</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Direito Anual</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Saldo Acumulado</th>
                  <th
                    className="py-3.5 px-3 font-semibold text-right cursor-pointer hover:text-[#F8FAFC] select-none"
                    onClick={() => toggleSort('utilizado')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Utilizado</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-3 font-semibold text-right cursor-pointer hover:text-[#F8FAFC] select-none"
                    onClick={() => toggleSort('disponivel')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[#22C55E]">Disponível</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#22C55E]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-semibold">Situação</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263244]/60">
                {filteredServidores.map(srv => {
                  return (
                    <tr
                      key={srv.id}
                      className="hover:bg-[#1F2937]/50 transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => handleOpenDetail(srv.id)}
                          className="font-medium text-[#F8FAFC] hover:text-[#60A5FA] cursor-pointer transition-colors"
                        >
                          {srv.name}
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">{srv.email}</div>
                      </td>

                      {/* Matricula */}
                      <td className="py-3.5 px-3 font-mono text-[#CBD5E1]">
                        {srv.matricula}
                      </td>

                      {/* Lotação / Cargo */}
                      <td className="py-3.5 px-3">
                        <div className="text-[#CBD5E1] truncate max-w-[180px]">
                          {srv.secao.split('-')[0].trim()}
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate max-w-[180px]">
                          {srv.role}
                        </div>
                      </td>

                      {/* Direito Anual */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#F8FAFC]">
                        {srv.balances.direitoAnual} d
                      </td>

                      {/* Saldo Acumulado */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {srv.balances.saldoAcumulado > 0 ? (
                          <span className="text-[#8B5CF6] font-semibold">
                            +{srv.balances.saldoAcumulado} d
                          </span>
                        ) : (
                          <span className="text-[#64748B]">0 d</span>
                        )}
                      </td>

                      {/* Utilizado */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#F59E0B]">
                        {srv.balances.diasUtilizados} d
                      </td>

                      {/* Disponível */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        <span className="font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                          {srv.balances.saldoRestante} d
                        </span>
                      </td>

                      {/* Situação */}
                      <td className="py-3.5 px-3">
                        <SituationBadge situation={srv.situation} />
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDetail(srv.id)}
                            className="h-7 px-2 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-[#60A5FA]" />
                            Visualizar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredServidores.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-[#94A3B8]">
                      Nenhum servidor encontrado para os filtros selecionados.
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

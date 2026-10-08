import React from 'react';
import { ConflictAlertItem } from '../../types';
import { AlertTriangle, AlertCircle, Users, Calendar } from 'lucide-react';
import { Button } from './Button';

interface ConflictAlertProps {
  conflict: ConflictAlertItem;
  onResolve?: () => void;
}

export const ConflictAlert: React.FC<ConflictAlertProps> = ({ conflict, onResolve }) => {
  const isCritical = conflict.severity === 'critico';

  return (
    <div
      className={`p-4 rounded-xl border ${
        isCritical
          ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#F8FAFC]'
          : 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F8FAFC]'
      } transition-colors`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg shrink-0 ${
            isCritical ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
          }`}
        >
          {isCritical ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <span>{isCritical ? 'Alerta Crítico de Efetivo' : 'Atenção no Planejamento'}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#111827] border border-[#263244] text-[#94A3B8]">
                {conflict.secao}
              </span>
            </h4>
            <span className="text-xs text-[#94A3B8] font-mono tabular-nums flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {conflict.dateStart.split('-').reverse().join('/')} até {conflict.dateEnd.split('-').reverse().join('/')}
            </span>
          </div>

          <p className="text-xs text-[#94A3B8] mt-1.5">{conflict.message}</p>

          <div className="mt-3 bg-[#111827]/70 rounded-lg p-3 border border-[#263244]/50">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#CBD5E1] mb-2">
              <Users className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Servidores Afastados Concomitantemente ({conflict.servidores.length}):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {conflict.servidores.map((srv, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-[#1F2937]/80 px-2.5 py-1.5 rounded border border-[#263244] flex flex-col justify-between"
                >
                  <span className="font-medium text-[#F8FAFC] truncate">{srv.name}</span>
                  <div className="flex justify-between text-[11px] text-[#94A3B8] mt-0.5">
                    <span>Mat: {srv.matricula}</span>
                    <span className="font-mono text-[#38BDF8]">{srv.periodo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {onResolve && (
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="secondary" onClick={onResolve}>
                Ver Opções de Remanejamento
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

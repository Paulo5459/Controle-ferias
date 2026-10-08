import React, { createContext, useContext, useState, useMemo } from 'react';
import { Servidor, VacationPeriod, ConflictAlertItem, VacationStatus } from '../types';
import { INITIAL_SERVIDORES, INITIAL_PERIODS, CURRENT_USER } from '../data/mockData';
import { detectWorkforceConflicts, calculateServerBalances } from '../utils/vacationCalculations';

interface ToastData {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  currentRoute: string;
  navigate: (route: string) => void;
  currentUser: Servidor;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  servidores: Servidor[];
  periods: VacationPeriod[];
  conflicts: ConflictAlertItem[];
  addPeriod: (newPeriod: Omit<VacationPeriod, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  cancelPeriod: (id: string) => void;
  updatePeriodStatus: (id: string, status: VacationStatus) => void;
  selectedServidorId: string | null;
  setSelectedServidorId: (id: string | null) => void;
  toasts: ToastData[];
  showToast: (type: ToastData['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Read hash or default to '/'
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash.replace('#', '') || '/';
    }
    return '/';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default true for instant exploration, can login/logout
  const [currentUser, setCurrentUser] = useState<Servidor>(CURRENT_USER);
  const [servidores, setServidores] = useState<Servidor[]>(INITIAL_SERVIDORES);
  const [periods, setPeriods] = useState<VacationPeriod[]>(INITIAL_PERIODS);
  const [selectedServidorId, setSelectedServidorId] = useState<string | null>('srv-1');
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.location.hash = route;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (type: ToastData['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = () => {
    setIsAuthenticated(true);
    showToast('success', 'Acesso Concedido', 'Bem-vindo ao Sistema de Gestão de Férias Institucional.');
    navigate('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('info', 'Sessão Finalizada', 'Você saiu com segurança do sistema.');
    navigate('/auth/login');
  };

  // Derive workforce conflicts reactively whenever periods change
  const conflicts = useMemo(() => {
    return detectWorkforceConflicts(servidores, periods);
  }, [servidores, periods]);

  const addPeriod = (newPeriodData: Omit<VacationPeriod, 'id' | 'createdAt'>) => {
    const srv = servidores.find(s => s.id === newPeriodData.servidorId);
    if (!srv) {
      return { success: false, error: 'Servidor não encontrado no cadastro.' };
    }

    // Check balances
    const balance = calculateServerBalances(srv, periods);
    if (newPeriodData.daysCount > balance.saldoRestante) {
      return {
        success: false,
        error: `Saldo insuficiente. Dias solicitados (${newPeriodData.daysCount}) ultrapassam o saldo restante de ${balance.saldoRestante} dias.`,
      };
    }

    // Check overlap with same servant
    const hasSelfOverlap = periods.some(
      p => p.servidorId === newPeriodData.servidorId &&
        newPeriodData.startDate <= p.endDate &&
        p.startDate <= newPeriodData.endDate
    );

    if (hasSelfOverlap) {
      return {
        success: false,
        error: 'Conflito de período: O servidor já possui férias registradas nessas datas.',
      };
    }

    const created: VacationPeriod = {
      ...newPeriodData,
      id: `per-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPeriods(prev => [created, ...prev]);

    // Check if new period creates workforce conflict with colleagues
    const tempPeriods = [created, ...periods];
    const newConflicts = detectWorkforceConflicts(servidores, tempPeriods);
    const affected = newConflicts.filter(c => c.secao === srv.secao);
    
    if (affected.length > 0) {
      showToast('warning', 'Alerta de Efetivo', `Período agendado com sucesso, porém gerou alerta de sobreposição de efetivo na seção ${srv.secao}.`);
    } else {
      showToast('success', 'Férias Agendadas', `Período de ${newPeriodData.daysCount} dias agendado com sucesso para ${srv.name}.`);
    }

    return { success: true };
  };

  const cancelPeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
    showToast('info', 'Período Removido', 'O agendamento de férias foi cancelado e o saldo foi restabelecido.');
  };

  const updatePeriodStatus = (id: string, status: VacationStatus) => {
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    showToast('success', 'Situação Atualizada', `Status do período atualizado para ${status}.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        currentUser,
        isAuthenticated,
        login,
        logout,
        servidores,
        periods,
        conflicts,
        addPeriod,
        cancelPeriod,
        updatePeriodStatus,
        selectedServidorId,
        setSelectedServidorId,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

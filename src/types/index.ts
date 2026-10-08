export type VacationStatus = 'agendado' | 'em_andamento' | 'concluido' | 'homologado' | 'pendente';

export type FunctionalSituation = 'Ativo' | 'Em Férias' | 'Licença Prêmio' | 'Afastado';

export interface VacationPeriod {
  id: string;
  servidorId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  referenceYear: number;
  status: VacationStatus;
  notes?: string;
  createdAt: string;
}

export interface Servidor {
  id: string;
  name: string;
  matricula: string;
  email: string;
  phone: string;
  secao: string;
  role: string;
  situation: FunctionalSituation;
  admissionDate: string;
  direitoAnual: number; // default 30
  saldoAcumulado: number; // accumulated from previous years
  avatarUrl?: string;
}

export interface ConflictAlertItem {
  id: string;
  dateStart: string;
  dateEnd: string;
  secao: string;
  servidores: {
    id: string;
    name: string;
    periodo: string;
    matricula: string;
  }[];
  severity: 'alerta' | 'critico';
  message: string;
}

export type NavigationRoute = 
  | '/'
  | '/auth/login'
  | '/dashboard'
  | '/servidores'
  | '/servidores/:id'
  | '/ferias/novo'
  | '/calendario'
  | '/ferias'
  | '/relatorios'
  | '/admin'
  | '/configuracoes';

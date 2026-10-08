import { Servidor, VacationPeriod } from '../types';

export const INITIAL_SERVIDORES: Servidor[] = [
  {
    id: 'srv-1',
    name: 'Carlos Eduardo Mendes',
    matricula: '2024.0812',
    email: 'carlos.mendes@instituicao.gov.br',
    phone: '(61) 98124-5501',
    secao: 'DITEC - Tecnologia da Informação',
    role: 'Analista de Sistemas / Chefe da Seção',
    situation: 'Ativo',
    admissionDate: '2018-03-15',
    direitoAnual: 30,
    saldoAcumulado: 10, // Total 40
  },
  {
    id: 'srv-2',
    name: 'Mariana Silveira Castro',
    matricula: '2021.0345',
    email: 'mariana.castro@instituicao.gov.br',
    phone: '(61) 99231-8842',
    secao: 'DITEC - Tecnologia da Informação',
    role: 'Engenheira de Software Pleno',
    situation: 'Ativo',
    admissionDate: '2021-02-10',
    direitoAnual: 30,
    saldoAcumulado: 0, // Total 30
  },
  {
    id: 'srv-3',
    name: 'Pedro Henrique Alcantara',
    matricula: '2019.1102',
    email: 'pedro.alcantara@instituicao.gov.br',
    phone: '(61) 98455-1290',
    secao: 'DITEC - Tecnologia da Informação',
    role: 'Administrador de Banco de Dados',
    situation: 'Ativo',
    admissionDate: '2019-06-01',
    direitoAnual: 30,
    saldoAcumulado: 15, // Total 45
  },
  {
    id: 'srv-4',
    name: 'Ana Flávia Rezende',
    matricula: '2022.0498',
    email: 'ana.rezende@instituicao.gov.br',
    phone: '(61) 98877-3321',
    secao: 'DIRAD - Diretoria de Administração',
    role: 'Técnica Administrativa',
    situation: 'Em Férias',
    admissionDate: '2022-04-18',
    direitoAnual: 30,
    saldoAcumulado: 5, // Total 35
  },
  {
    id: 'srv-5',
    name: 'Roberto Viana Guimarães',
    matricula: '2016.0076',
    email: 'roberto.viana@instituicao.gov.br',
    phone: '(61) 99102-7711',
    secao: 'DIRAD - Diretoria de Administração',
    role: 'Coordenador de Compras e Contratos',
    situation: 'Ativo',
    admissionDate: '2016-08-01',
    direitoAnual: 30,
    saldoAcumulado: 20, // Total 50
  },
  {
    id: 'srv-6',
    name: 'Juliana Beatriz Farias',
    matricula: '2020.0914',
    email: 'juliana.farias@instituicao.gov.br',
    phone: '(61) 98311-9045',
    secao: 'SECRH - Gestão de Pessoas',
    role: 'Analista de Recursos Humanos',
    situation: 'Ativo',
    admissionDate: '2020-09-01',
    direitoAnual: 30,
    saldoAcumulado: 0, // Total 30
  },
  {
    id: 'srv-7',
    name: 'Lucas Gabriel Albuquerque',
    matricula: '2023.0129',
    email: 'lucas.albuquerque@instituicao.gov.br',
    phone: '(61) 99654-2200',
    secao: 'ASJUR - Assessoria Jurídica',
    role: 'Assessor Jurídico',
    situation: 'Ativo',
    admissionDate: '2023-01-20',
    direitoAnual: 30,
    saldoAcumulado: 0, // Total 30
  },
  {
    id: 'srv-8',
    name: 'Cláudia Regina Nogueira',
    matricula: '2017.0543',
    email: 'claudia.nogueira@instituicao.gov.br',
    phone: '(61) 98200-4499',
    secao: 'AUDIT - Controle Interno e Auditoria',
    role: 'Auditora Federal de Controle',
    situation: 'Ativo',
    admissionDate: '2017-05-10',
    direitoAnual: 30,
    saldoAcumulado: 10, // Total 40
  },
  {
    id: 'srv-9',
    name: 'Fernando Augusto Lima',
    matricula: '2021.0887',
    email: 'fernando.lima@instituicao.gov.br',
    phone: '(61) 98711-6632',
    secao: 'DITEC - Tecnologia da Informação',
    role: 'Especialista em Segurança Cibernética',
    situation: 'Ativo',
    admissionDate: '2021-11-05',
    direitoAnual: 30,
    saldoAcumulado: 5, // Total 35
  }
];

export const INITIAL_PERIODS: VacationPeriod[] = [
  // Carlos Eduardo Mendes (srv-1): Exact prompt example: 10 dias em março, 15 dias em julho, 15 dias em novembro. Total 40 dias.
  {
    id: 'per-101',
    servidorId: 'srv-1',
    startDate: '2027-03-10',
    endDate: '2027-03-19',
    daysCount: 10,
    referenceYear: 2027,
    status: 'agendado',
    notes: '1ª parcela referente a saldo acumulado',
    createdAt: '2026-10-01',
  },
  {
    id: 'per-102',
    servidorId: 'srv-1',
    startDate: '2027-07-05',
    endDate: '2027-07-19',
    daysCount: 15,
    referenceYear: 2027,
    status: 'agendado',
    notes: '2ª parcela - recesso de meio de ano',
    createdAt: '2026-10-01',
  },
  {
    id: 'per-103',
    servidorId: 'srv-1',
    startDate: '2027-11-01',
    endDate: '2027-11-15',
    daysCount: 15,
    referenceYear: 2027,
    status: 'agendado',
    notes: '3ª parcela - encerramento do exercício',
    createdAt: '2026-10-01',
  },

  // Mariana Silveira (srv-2): 15 dias em julho (conflito intencional na DITEC com Carlos e Pedro), 15 dias em dezembro
  {
    id: 'per-201',
    servidorId: 'srv-2',
    startDate: '2027-07-10',
    endDate: '2027-07-24',
    daysCount: 15,
    referenceYear: 2027,
    status: 'agendado',
    notes: 'Período regular de inverno',
    createdAt: '2026-10-02',
  },
  {
    id: 'per-202',
    servidorId: 'srv-2',
    startDate: '2027-12-15',
    endDate: '2027-12-29',
    daysCount: 15,
    referenceYear: 2027,
    status: 'agendado',
    notes: 'Período de fim de ano',
    createdAt: '2026-10-02',
  },

  // Pedro Henrique (srv-3): 10 dias em julho (gerando o clássico conflito de 3 servidores da DITEC simultâneos entre 10/07 e 19/07)
  {
    id: 'per-301',
    servidorId: 'srv-3',
    startDate: '2027-07-10',
    endDate: '2027-07-19',
    daysCount: 10,
    referenceYear: 2027,
    status: 'agendado',
    notes: '1ª fração acumulada',
    createdAt: '2026-10-03',
  },
  {
    id: 'per-302',
    servidorId: 'srv-3',
    startDate: '2027-04-01',
    endDate: '2027-04-20',
    daysCount: 20,
    referenceYear: 2027,
    status: 'homologado',
    notes: 'Férias de outono',
    createdAt: '2026-09-15',
  },

  // Ana Flávia Rezende (srv-4): Atualmente em férias (Outubro 2026)
  {
    id: 'per-401',
    servidorId: 'srv-4',
    startDate: '2026-10-01',
    endDate: '2026-10-20',
    daysCount: 20,
    referenceYear: 2026,
    status: 'em_andamento',
    notes: 'Usufruto em andamento',
    createdAt: '2026-08-10',
  },
  {
    id: 'per-402',
    servidorId: 'srv-4',
    startDate: '2027-01-11',
    endDate: '2027-01-25',
    daysCount: 15,
    referenceYear: 2027,
    status: 'agendado',
    notes: 'Férias de verão 2027',
    createdAt: '2026-09-20',
  },

  // Roberto Viana (srv-5): DIRAD - 20 dias em maio 2027
  {
    id: 'per-501',
    servidorId: 'srv-5',
    startDate: '2027-05-03',
    endDate: '2027-05-22',
    daysCount: 20,
    referenceYear: 2027,
    status: 'homologado',
    notes: 'Período aprovado pela chefia',
    createdAt: '2026-09-01',
  },

  // Juliana Beatriz (srv-6): SECRH - 30 dias integrais em janeiro 2027
  {
    id: 'per-601',
    servidorId: 'srv-6',
    startDate: '2027-01-04',
    endDate: '2027-02-02',
    daysCount: 30,
    referenceYear: 2027,
    status: 'agendado',
    notes: 'Período contínuo integral',
    createdAt: '2026-09-10',
  },

  // Lucas Gabriel (srv-7): ASJUR - 15 dias em agosto 2027
  {
    id: 'per-701',
    servidorId: 'srv-7',
    startDate: '2027-08-09',
    endDate: '2027-08-23',
    daysCount: 15,
    referenceYear: 2027,
    status: 'agendado',
    notes: 'Primeira fração solicitada',
    createdAt: '2026-10-04',
  },

  // Fernando Augusto Lima (srv-9): DITEC - 10 dias em março
  {
    id: 'per-901',
    servidorId: 'srv-9',
    startDate: '2027-03-01',
    endDate: '2027-03-10',
    daysCount: 10,
    referenceYear: 2027,
    status: 'agendado',
    notes: 'Alinhado com equipe de infra',
    createdAt: '2026-10-05',
  }
];

export const CURRENT_USER: Servidor = INITIAL_SERVIDORES[0]; // Carlos Eduardo Mendes

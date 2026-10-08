import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  CalendarCheck2,
  Split,
  CalendarDays,
  Users2,
  History,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const { navigate, isAuthenticated } = useApp();

  const handleAccess = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth/login');
    }
  };

  const scrollToFeatures = () => {
    document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8FAFC]">
      {/* Top Bar for Landing Page */}
      <header className="border-b border-[#263244] bg-[#0B1220]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#F8FAFC] tracking-tight block leading-tight">
                Gestão de Férias Institucional
              </span>
              <span className="text-[10px] font-semibold text-[#14B8A6] tracking-wider uppercase">
                Ambiente Interno Corporativo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToFeatures}
              className="text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors hidden sm:block cursor-pointer"
            >
              Conhecer Funcionalidades
            </button>
            <Button size="sm" variant="accent" onClick={handleAccess}>
              <span>Acessar Sistema</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden border-b border-[#263244]/60">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#2563EB]/15 to-[#14B8A6]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] border border-[#263244] text-[#14B8A6] text-xs font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Sistema Exclusivo de Controle Interno de Servidores</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8FAFC] max-w-4xl mx-auto leading-tight">
            Gestão de Férias <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">Institucional</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto font-normal leading-relaxed">
            Planeje, acompanhe e organize as férias dos servidores de forma simples, transparente e eficiente.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="accent" onClick={handleAccess} className="w-full sm:w-auto shadow-lg shadow-blue-900/20">
              <span>Acessar sistema</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="secondary" onClick={scrollToFeatures} className="w-full sm:w-auto">
              Conhecer funcionalidades
            </Button>
          </div>

          {/* Institutional Highlights */}
          <div className="mt-16 pt-8 border-t border-[#263244]/50 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#F8FAFC] font-mono tabular-nums">30 dias</div>
              <div className="text-xs text-[#94A3B8] mt-1">Direito Anual Padrão</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#14B8A6] font-mono tabular-nums">10, 15, 20 ou 30</div>
              <div className="text-xs text-[#94A3B8] mt-1">Fracionamento Flexível</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#8B5CF6] font-mono tabular-nums">100% Automático</div>
              <div className="text-xs text-[#94A3B8] mt-1">Cálculo de Saldos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F59E0B] font-mono tabular-nums">Monitoramento</div>
              <div className="text-xs text-[#94A3B8] mt-1">Conflitos de Efetivo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-20 bg-[#0F172A]/50 border-b border-[#263244]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#14B8A6]">
              Fluxo Simplificado
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-2">
              Como funciona o processo de férias
            </h2>
            <p className="text-sm text-[#94A3B8] mt-2">
              Quatro etapas estruturadas para dar previsibilidade aos servidores e garantir a continuidade das operações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-[#2563EB]/50 transition-colors relative group">
              <div className="text-3xl font-extrabold text-[#2563EB] font-mono mb-4">01</div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Consulte</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Visualize o direito e o saldo disponível de cada servidor, considerando saldo acumulado e períodos anteriores.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-[#14B8A6]/50 transition-colors relative group">
              <div className="text-3xl font-extrabold text-[#14B8A6] font-mono mb-4">02</div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Planeje</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Escolha os períodos de férias de acordo com a disponibilidade da seção e organize as frações ideais.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-[#8B5CF6]/50 transition-colors relative group">
              <div className="text-3xl font-extrabold text-[#8B5CF6] font-mono mb-4">03</div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Agende</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Registre os períodos utilizados ou solicite um novo agendamento com validação matemática instantânea.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-[#22C55E]/50 transition-colors relative group">
              <div className="text-3xl font-extrabold text-[#22C55E] font-mono mb-4">04</div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Acompanhe</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Visualize o calendário institucional e monitore em tempo real o impacto das férias no efetivo da seção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section id="funcionalidades" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Recursos Principais
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-2">
              Funcionalidades desenvolvidas para o controle interno
            </h2>
            <p className="text-sm text-[#94A3B8] mt-2">
              Todas as ferramentas essenciais para a administração da seção gerenciar com segurança e transparência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#2563EB]/15 text-[#60A5FA] flex items-center justify-center mb-4">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Controle de saldo</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Controle o direito anual, saldo acumulado e dias já utilizados com apuração automática de saldos restantes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/15 text-[#2DD4BF] flex items-center justify-center mb-4">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Agendamento</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Registre períodos de férias de diferentes durações com cálculo de dias corridos em conformidade com o regimento.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/15 text-[#C4B5FD] flex items-center justify-center mb-4">
                <Split className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Fracionamento</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Permita utilizar os dias disponíveis em diferentes períodos (10+15+15, 15+15, 20+10, ou integrais).
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Calendário anual</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Visualize as férias distribuídas durante o ano em visualizações mensais, trimestrais e anuais da seção.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/15 text-[#FBBF24] flex items-center justify-center mb-4">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Controle de efetivo</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Identifique períodos com muitos servidores afastados simultaneamente para evitar desassistência aos serviços.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-[#111827] border border-[#263244] hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#22C55E]/15 text-[#4ADE80] flex items-center justify-center mb-4">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Histórico funcional</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Consulte os períodos de férias já registrados por ano de referência e acompanhe o status de homologação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Guarantee Banner */}
      <section className="py-12 bg-[#0F172A] border-t border-[#263244]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 bg-gradient-to-r from-[#111827] to-[#1F2937] border border-[#263244] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB]/20 text-[#60A5FA] flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#F8FAFC]">Plataforma de Uso Exclusivo Interno</h4>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Ambiente restrito aos servidores da corporação. Dados protegidos e controle de acesso individual.
                </p>
              </div>
            </div>

            <Button size="md" variant="accent" onClick={handleAccess} className="whitespace-nowrap shrink-0">
              Acessar Painel Interno
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0B1220] border-t border-[#263244]/80 text-center text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2027 Gestão de Férias Institucional · MVP · Todos os direitos reservados à Seção de Administração e Pessoal.</p>
          <p className="mt-1 text-[11px]">Ambiente institucional fechado para planejamento e controle do efetivo.</p>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Lock, User, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [identifier, setIdentifier] = useState('2024.0812');
  const [password, setPassword] = useState('••••••••');
  const [forgotModal, setForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-[#2563EB]/10 to-[#14B8A6]/10 blur-3xl pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <div
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 cursor-pointer group mb-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Gestão de Férias Institucional
        </h1>
        <p className="text-xs text-[#14B8A6] mt-1 font-semibold uppercase tracking-wider">
          Acesso Corporativo Restrito
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#111827] border border-[#263244] rounded-2xl shadow-2xl p-7 relative z-10">
        <div className="mb-6 pb-4 border-b border-[#263244]/60">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">Autenticação de Servidor</h2>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
            Ambiente interno para gerenciamento e planejamento de férias.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail funcional ou Matrícula"
            placeholder="Ex: 2024.0812 ou nome.sobrenome@instituicao.gov.br"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            required
            autoFocus
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#94A3B8]">Senha de Acesso</label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-xs text-[#60A5FA] hover:text-[#93C5FD] transition-colors cursor-pointer"
              >
                Esqueci minha senha
              </button>
            </div>
            <Input
              type="password"
              placeholder="Digite sua senha de rede"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="accent" size="lg" className="w-full shadow-md">
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        {/* Quick Demo Access Note */}
        <div className="mt-6 pt-4 border-t border-[#263244]/60 bg-[#1F2937]/40 -mx-7 -mb-7 p-5 rounded-b-2xl">
          <div className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
            <KeyRound className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#F8FAFC]">Acesso Rápido de Demonstração (MVP):</span>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Utilize a credencial padrão pré-preenchida para acessar o perfil de Chefe de Seção / Administrador.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#111827] border border-[#263244] rounded-xl p-6 text-[#F8FAFC]">
            <h3 className="text-base font-semibold">Recuperação Institucional</h3>
            <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
              Para redefinição da senha do portal de férias, entre em contato com o suporte da Seção de Tecnologia da Informação (DITEC) pelo ramal <strong>#3300</strong> ou envie solicitação ao e-mail <strong>suporte.ti@instituicao.gov.br</strong> informando sua matrícula funcional.
            </p>
            <div className="mt-5 flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setForgotModal(false)}>
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Security Note */}
      <div className="mt-8 text-center text-xs text-[#64748B] flex items-center gap-1.5 relative z-10">
        <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
        <span>Conexão interna autenticada e criptografada</span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  KeyRound,
  Bell,
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ConfiguracoesPage: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [matricula, setMatricula] = useState(currentUser.matricula);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [secao, setSecao] = useState(currentUser.secao);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [notifyConflicts, setNotifyConflicts] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyApprovals, setNotifyApprovals] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Perfil Atualizado', 'As informações cadastrais foram salvas com sucesso.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('error', 'Erro na Senha', 'A confirmação de senha não confere com a nova senha digitada.');
      return;
    }
    showToast('success', 'Senha Alterada', 'Sua senha institucional de rede foi atualizada.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">
          Configurações do Usuário e Sistema
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1">
          Gerenciamento de dados funcionais, credenciais de acesso e parâmetros de alertas institucionais.
        </p>
      </div>

      <div className="space-y-6">
        {/* Functional Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#2563EB]" />
              <span>Dados Funcionais do Servidor</span>
            </CardTitle>
            <CardDescription>
              Informações do cadastro institucional vinculadas ao perfil de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Input
                  label="Matrícula Funcional"
                  value={matricula}
                  onChange={e => setMatricula(e.target.value)}
                  disabled
                  helperText="Matrícula bloqueada para alteração pela chefia"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="E-mail Institucional"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Telefone / Ramal"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  label="Seção / Lotação de Exercício"
                  value={secao}
                  onChange={e => setSecao(e.target.value)}
                  disabled
                  helperText="Alterações de lotação devem ser solicitadas à SECRH"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm">
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#14B8A6]" />
              <span>Alteração de Senha Institucional</span>
            </CardTitle>
            <CardDescription>
              Atualize sua senha de autenticação com os padrões de segurança da organização.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              <Input
                label="Senha Atual"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nova Senha"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" size="sm">
                  Atualizar Senha
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notifications & System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8B5CF6]" />
              <span>Preferências de Alertas de Efetivo</span>
            </CardTitle>
            <CardDescription>
              Configuração dos avisos proativos do sistema para proteção do funcionamento da seção.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1F2937]/40 border border-[#263244]">
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">Alertas de sobreposição simultânea de férias</p>
                <p className="text-[11px] text-[#94A3B8]">Receber notificação quando 2 ou mais servidores coincidirem na mesma seção.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyConflicts}
                onChange={e => setNotifyConflicts(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1F2937]/40 border border-[#263244]">
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">Aviso de prazo de homologação da escala</p>
                <p className="text-[11px] text-[#94A3B8]">Lembrete 60 dias antes do início do trimestre de planejamento.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyDeadlines}
                onChange={e => setNotifyDeadlines(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1F2937]/40 border border-[#263244]">
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">Confirmação de deferimento pela chefia</p>
                <p className="text-[11px] text-[#94A3B8]">Notificação imediata ao homologar ou alterar status de períodos.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyApprovals}
                onChange={e => setNotifyApprovals(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ServidoresPage } from './pages/ServidoresPage';
import { ServidorDetailPage } from './pages/ServidorDetailPage';
import { AgendarFeriasPage } from './pages/AgendarFeriasPage';
import { CalendarioPage } from './pages/CalendarioPage';
import { MeusPeriodosPage } from './pages/MeusPeriodosPage';
import { RelatoriosPage } from './pages/RelatoriosPage';
import { AdminPage } from './pages/AdminPage';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';

function AppRouter() {
  const { currentRoute, navigate } = useApp();

  // Listen to browser hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      if (hash !== currentRoute) {
        navigate(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute, navigate]);

  // Public standalone pages
  if (currentRoute === '/') {
    return <LandingPage />;
  }

  if (currentRoute === '/auth/login') {
    return <LoginPage />;
  }

  // Internal protected views wrapped in institutional layout
  let content: React.ReactNode = null;

  if (currentRoute.startsWith('/servidores/')) {
    const id = currentRoute.replace('/servidores/', '');
    content = <ServidorDetailPage servidorId={id} />;
  } else {
    switch (currentRoute) {
      case '/dashboard':
        content = <DashboardPage />;
        break;
      case '/servidores':
        content = <ServidoresPage />;
        break;
      case '/ferias/novo':
        content = <AgendarFeriasPage />;
        break;
      case '/calendario':
        content = <CalendarioPage />;
        break;
      case '/ferias':
        content = <MeusPeriodosPage />;
        break;
      case '/relatorios':
        content = <RelatoriosPage />;
        break;
      case '/admin':
        content = <AdminPage />;
        break;
      case '/configuracoes':
        content = <ConfiguracoesPage />;
        break;
      default:
        content = <DashboardPage />;
        break;
    }
  }

  return <AppLayout>{content}</AppLayout>;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

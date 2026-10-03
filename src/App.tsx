import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatbotWidget } from './components/ChatbotWidget';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { VehicleDashboardPage } from './pages/VehicleDashboardPage';
import { TrackerPage } from './pages/TrackerPage';
import { WomenServicesPage } from './pages/WomenServicesPage';
import { WomenBusCardPage } from './pages/WomenBusCardPage';
import { VehicleSearchPage } from './pages/VehicleSearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ServiceCategory } from './types';
import { RightSideNavDock } from './components/RightSideNavDock';
import { recordServiceAccess } from './lib/activityService';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'fastag-recharge';
  });
  const [initialCategory, setInitialCategory] = useState<ServiceCategory>('All');

  // Handle URL synchronizing
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setSelectedServiceId(id);
      }
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial query params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setSelectedServiceId(id);
    }
  }, []);

  const navigateTo = (path: string, serviceId?: string) => {
    let url = path;
    if (serviceId) {
      url = `${path}?id=${serviceId}`;
      setSelectedServiceId(serviceId);
    }
    window.history.pushState({}, '', url);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (slugOrId: string) => {
    setSelectedServiceId(slugOrId);
    recordServiceAccess({ id: slugOrId }, user?.uid);
    navigateTo('/service-detail', slugOrId);
  };

  // Keyboard shortcut Ctrl+K to jump to search/services
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        navigateTo('/services');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine active view based on path
  const renderCurrentView = () => {
    const p = currentPath.toLowerCase();

    if (p.includes('service-detail') || p.includes('service-detail.html')) {
      return (
        <ServiceDetailPage
          serviceIdOrSlug={selectedServiceId}
          onNavigate={navigateTo}
          onSelectService={handleSelectService}
        />
      );
    }

    if (p.includes('vehicle-dashboard') || p.includes('vehicle-dashboard.html')) {
      return (
        <VehicleDashboardPage
          onSelectService={handleSelectService}
          onNavigate={navigateTo}
        />
      );
    }

    if (p.includes('maha-bus-women-card') || p.includes('maha-bus') || p.includes('women-bus-card') || p.includes('bus-card')) {
      return (
        <WomenBusCardPage
          onNavigate={navigateTo}
          onSelectService={handleSelectService}
        />
      );
    }

    if (p.includes('vehicle-information') || p.includes('vehicle-search') || p.includes('vehicle-info') || p.includes('vahan')) {
      return (
        <VehicleSearchPage
          onNavigate={navigateTo}
          onSelectService={handleSelectService}
        />
      );
    }

    if (p.includes('women-services') || p.includes('women') || p.includes('women-services.html')) {
      return (
        <WomenServicesPage
          onSelectService={handleSelectService}
          onNavigate={navigateTo}
        />
      );
    }

    if (p.includes('tracker') || p.includes('tracker.html')) {
      return (
        <TrackerPage
          onNavigate={navigateTo}
          onSelectService={handleSelectService}
        />
      );
    }

    if (p.includes('services') || p.includes('services.html')) {
      return (
        <ServicesPage
          onSelectService={handleSelectService}
          initialCategory={initialCategory}
        />
      );
    }

    if (p.includes('about') || p.includes('about.html')) {
      return <AboutPage onNavigate={navigateTo} />;
    }

    if (p.includes('contact') || p.includes('contact.html')) {
      return (
        <ContactPage
          onOpenChatbot={() => {
            const chatBtn = document.getElementById('btn-open-chatbot');
            if (chatBtn) chatBtn.click();
          }}
        />
      );
    }

    // Default Home view
    return (
      <HomePage
        onNavigate={navigateTo}
        onSelectService={handleSelectService}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Navigation Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onSelectService={handleSelectService}
        onOpenSearch={() => navigateTo('/services')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Floating High-Visibility Right-Side Navigation Dock */}
      <RightSideNavDock
        currentPath={currentPath}
        onNavigate={navigateTo}
      />

      {/* Floating AI Chatbot Widget on Every Page */}
      <ChatbotWidget
        onNavigateToService={handleSelectService}
      />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Site Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

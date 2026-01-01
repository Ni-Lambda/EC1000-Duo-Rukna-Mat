import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { ECSpend } from './pages/ECSpend';
import { Repayments } from './pages/Repayments';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { ScanPay } from './pages/ScanPay';
import { Landing } from './pages/Landing';
import { QuickLogin } from './pages/QuickLogin';
import { AppStage, UserState } from './types';
import { ThemeProvider } from './ThemeContext';

function AppContent() {
  // Global State
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [user, setUser] = useState<UserState | null>(null);
  const [onboardingPhone, setOnboardingPhone] = useState<string>('');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [spendContext, setSpendContext] = useState<any>(null);
  const [isScanOpen, setIsScanOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ec1000_user');
    if (savedUser) {
        try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // If user has a PIN, require Quick Login
            if (parsedUser.pin) {
                setStage(AppStage.QUICK_LOGIN);
            } else {
                setStage(AppStage.DASHBOARD);
            }
        } catch (e) {
            console.error("Failed to parse user data");
            localStorage.removeItem('ec1000_user');
        }
    }
  }, []);

  // Handle Swipe Back (History API)
  useEffect(() => {
    // Initial push for landing
    window.history.replaceState({ stage: AppStage.LANDING }, '');

    const handlePopState = (event: PopStateEvent) => {
        if (event.state) {
            if (event.state.stage) {
                setStage(event.state.stage);
            }
            if (event.state.tab) {
                setActiveTab(event.state.tab);
            }
            if (event.state.modal === 'scan') {
                setIsScanOpen(true);
            } else {
                setIsScanOpen(false);
            }
        } else {
            // Fallback
            setStage(AppStage.LANDING);
        }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper to change stage with History push
  const changeStage = (newStage: AppStage) => {
      setStage(newStage);
      window.history.pushState({ stage: newStage }, '');
  };

  // Handlers
  const handleStartOnboarding = (phone: string) => {
      setOnboardingPhone(phone);
      changeStage(AppStage.ONBOARDING);
  };

  const handleOnboardingComplete = (newUser: UserState) => {
    setUser(newUser);
    // Persist user for Quick Access
    localStorage.setItem('ec1000_user', JSON.stringify(newUser));
    changeStage(AppStage.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ec1000_user');
    changeStage(AppStage.LANDING);
    setActiveTab('home');
  };

  const handleNavigate = (tab: string, context?: any) => {
    if (tab === 'scan') {
        setIsScanOpen(true);
        window.history.pushState({ stage: stage, tab: activeTab, modal: 'scan' }, '');
        return;
    }
    setActiveTab(tab);
    if (context) setSpendContext(context);
    else setSpendContext(null); // Reset context if not provided
    
    // Push tab change to history so back button works within dashboard
    window.history.pushState({ stage: stage, tab: tab }, '');
  };

  const closeScan = () => {
      setIsScanOpen(false);
      // If closing manually, we go back to remove the modal state from history
      // This prevents the 'forward' button from reopening it unexpectedly
      window.history.back();
  };

  // Render Logic
  if (stage === AppStage.LANDING) {
    return <Landing onGetStarted={handleStartOnboarding} />;
  }

  if (stage === AppStage.ONBOARDING) {
    return <Onboarding initialPhone={onboardingPhone} onComplete={handleOnboardingComplete} />;
  }

  if (stage === AppStage.QUICK_LOGIN && user) {
    return <QuickLogin user={user} onLoginSuccess={() => changeStage(AppStage.DASHBOARD)} onSwitchAccount={handleLogout} />;
  }

  if (!user) return null; // Should not happen

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={handleNavigate}>
        {activeTab === 'home' && <Home user={user} onNavigate={handleNavigate} />}
        {activeTab === 'spend' && <ECSpend onNavigate={handleNavigate} initialCategory={spendContext?.categoryId} />}
        {activeTab === 'repayments' && <Repayments />}
        {activeTab === 'history' && <History />}
        {activeTab === 'profile' && <Profile user={user} onLogout={handleLogout} />}
      </Layout>
      
      {/* Modals/Overlays */}
      {isScanOpen && <ScanPay onClose={closeScan} balance={user.balance} />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
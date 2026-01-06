import React, { useState } from 'react';
import { Home, Grid, Repeat, Clock, User, HelpCircle, ShieldCheck, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme, language, setLanguage } = useTheme();

  const navItems = [
    { id: 'home', label: language === 'en' ? 'Home' : 'Home', icon: Home },
    { id: 'spend', label: 'EC Duo', icon: Grid }, // Renamed to EC Duo
    { id: 'repayments', label: language === 'en' ? 'Repayments' : 'Repay', icon: Repeat },
    { id: 'history', label: language === 'en' ? 'History' : 'History', icon: Clock },
    { id: 'profile', label: language === 'en' ? 'Profile' : 'Profile', icon: User },
  ];

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const renderNav = (isMobile: boolean) => (
    <nav className={`
      ${isMobile 
        ? 'flex justify-around w-full bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 fixed bottom-0 left-0 z-50 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]' 
        : 'flex flex-col space-y-1 p-4'}
    `}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              if (!isMobile) setIsSidebarOpen(false);
            }}
            className={`
              flex items-center 
              ${isMobile ? 'flex-col justify-center w-full space-y-1 py-1' : 'w-full p-3 space-x-3 text-left hover:bg-slate-100 dark:hover:bg-zinc-800'}
              ${isActive ? 'text-blue-600 dark:text-emerald-400 bg-blue-50/50 dark:bg-zinc-800' : 'text-slate-500 dark:text-zinc-400'}
            `}
          >
            <Icon size={isMobile ? 22 : 24} />
            <span className={isMobile ? 'text-[10px] font-medium' : 'text-base font-medium'}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col lg:flex-row relative transition-colors duration-200">
      {/* Mobile Top Bar (Visible on Mobile & Tablet Portrait) */}
      <header className="lg:hidden bg-white dark:bg-zinc-900 p-4 flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="flex flex-col items-start justify-center">
            <div className="flex items-baseline space-x-3">
                <span className="font-bold text-2xl text-black dark:text-white leading-none tracking-tight">EC1000</span>
                <span className="font-bold text-2xl text-green-600 dark:text-emerald-500 leading-none tracking-tight">Duo</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium tracking-wide mt-0.5">Rukna Mat - Dont Stop</span>
        </div>
        <div className="flex items-center space-x-2">
           <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
           >
               <Languages size={14} />
               <span>{language === 'en' ? 'EN' : 'HI'}</span>
           </button>
           <button onClick={toggleTheme} className="text-slate-600 dark:text-zinc-400 p-1">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
           </button>
           <HelpCircle size={24} className="text-slate-600 dark:text-zinc-400" />
        </div>
      </header>

      {/* Desktop/Landscape Sidebar (Hidden on Mobile & Tablet Portrait) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
           <div>
              <div className="flex items-baseline space-x-3">
                  <span className="font-bold text-3xl text-black dark:text-white leading-none tracking-tight">EC1000</span>
                  <span className="font-bold text-3xl text-green-600 dark:text-emerald-500 leading-none tracking-tight">Duo</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 font-medium tracking-wide">Rukna Mat - Dont Stop</p>
           </div>
           <button onClick={toggleTheme} className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
           </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderNav(false)}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
             <div className="flex justify-between items-center mb-3">
                 <button 
                    onClick={toggleLanguage}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300"
                 >
                    <Languages size={14} />
                    <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
                 </button>
             </div>
             <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-zinc-500">
                <ShieldCheck size={14} className="text-green-600 dark:text-emerald-500"/>
                <span>RBI-regulated Partner</span>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0 w-full max-w-7xl mx-auto flex">
          {/* Central Feed */}
          <div className="flex-1 p-4 md:p-8 w-full">
            {children}
          </div>

          {/* Right Panel (Desktop only - Supporting Info) */}
          <div className="hidden xl:block w-80 p-8 border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-screen sticky top-0 overflow-y-auto">
             <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Quick Help</h3>
             <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-l-4 border-blue-600">
                    <h4 className="font-bold text-sm text-blue-800 dark:text-blue-400">Need more limit?</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Repay your current dues on time to unlock higher limits up to ₹5000.</p>
                </div>
                <div className="bg-green-50 dark:bg-emerald-900/20 p-4 border-l-4 border-green-600 dark:border-emerald-500">
                    <h4 className="font-bold text-sm text-green-800 dark:text-emerald-400">Liquidity Partner</h4>
                    <p className="text-sm text-green-700 dark:text-emerald-300 mt-1">We are here to help with daily essentials. Not a loan, but a lifeline.</p>
                </div>
             </div>
          </div>
      </main>

      {/* Mobile Bottom Navigation (Visible on Mobile & Tablet Portrait) */}
      <div className="lg:hidden">
        {renderNav(true)}
      </div>
    </div>
  );
};
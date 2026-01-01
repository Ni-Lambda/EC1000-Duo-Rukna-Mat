import React from 'react';
import { Button } from '../components/Button';
import { UserState, SPEND_CATEGORIES, SpendCategoryType } from '../types';
import * as Icons from 'lucide-react';

interface HomeProps {
  user: UserState;
  onNavigate: (tab: string, context?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
  const percentageUsed = (user.usedAmount / user.totalLimit) * 100;
  
  const handleCategoryClick = (category: any) => {
     onNavigate('spend', { categoryId: category.id });
  };

  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Personalized Greeting */}
      <div className="flex justify-between items-center px-1">
          <div>
              <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Hi, {firstName} <span className="text-2xl">👋</span></h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back to your dashboard.</p>
          </div>
      </div>

      {/* Balance Block - Sharp Design */}
      <div className="bg-white dark:bg-zinc-900 border-l-4 border-blue-600 p-6 shadow-sm">
        <h2 className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wide font-bold mb-1">Available Balance</h2>
        <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-zinc-800 dark:text-white">₹{user.balance}</span>
            <span className="text-sm text-zinc-400 font-medium">/ ₹{user.totalLimit} Limit</span>
        </div>
        
        {/* Progress Bar - Sharp */}
        <div className="mt-4 w-full h-4 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
            <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${100 - percentageUsed}%` }}
            ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <span>Used: ₹{user.usedAmount}</span>
            <span className="text-blue-600 dark:text-blue-400">Available to Spend</span>
        </div>
      </div>

      {/* DUAL ACTION CARDS - INNOVATIVE APPROACH */}
      <div className="grid grid-cols-2 gap-4">
          
          {/* 1. EC CASH CARD - Dark Theme (High Value) */}
          <div 
             onClick={() => {
                 const ecCashCat = SPEND_CATEGORIES.find(c => c.type === SpendCategoryType.EC_CASH);
                 if (ecCashCat) handleCategoryClick(ecCashCat);
             }}
             className="group relative bg-zinc-900 dark:bg-black p-5 flex flex-col justify-between min-h-[180px] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500"
          >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-500 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
              
              <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-zinc-800 rounded-lg text-green-500">
                          <Icons.Banknote size={20} />
                      </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-white leading-none mb-2">EC Cash</h3>
                  <p className="text-zinc-400 text-xs font-medium leading-tight">₹1000 instant to bank account</p>
              </div>

              <div className="relative z-10 mt-4">
                  <button className="bg-green-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider flex items-center space-x-1 group-hover:bg-green-500 transition-colors w-fit shadow-lg">
                      <span>Get Now</span>
                      <Icons.ArrowRight size={12} />
                  </button>
              </div>
          </div>

          {/* 2. SCAN & PAY CARD - Light Theme (Daily Use) */}
          <div 
             onClick={() => onNavigate('scan')}
             className="group relative bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between min-h-[180px] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-600"
          >
             {/* Background Pattern */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600 rounded-full opacity-5 blur-xl group-hover:opacity-10 transition-opacity"></div>

              <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-blue-50 dark:bg-zinc-800 rounded-lg text-blue-600">
                          <Icons.QrCode size={20} />
                      </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white leading-none mb-2">Scan & Pay</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium leading-tight">EC Spend Essentials</p>
              </div>

              <div className="relative z-10 mt-4">
                   <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider flex items-center space-x-1 group-hover:bg-blue-700 transition-colors w-fit shadow-lg">
                      <span>Scan QR</span>
                      <Icons.ScanLine size={12} />
                  </button>
              </div>
          </div>
      </div>

      {/* Quick Spend Tiles - Sharp */}
      <div>
        <h3 className="text-zinc-800 dark:text-white font-bold mb-4 px-1">Quick Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SPEND_CATEGORIES.slice(0, 4).map((cat) => {
                // @ts-ignore
                const Icon = Icons[cat.icon];
                const isECCash = cat.type === SpendCategoryType.EC_CASH;
                return (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className={`p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center space-y-3 transition-colors shadow-sm ${isECCash ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'bg-white dark:bg-zinc-900'}`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-none ${isECCash ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                            <Icon size={24} />
                        </div>
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{cat.type}</span>
                        {cat.isAppOnly && <span className="text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 font-bold uppercase">App Only</span>}
                    </button>
                )
            })}
        </div>
        <button 
            onClick={() => onNavigate('spend')}
            className="w-full mt-4 py-3 text-center text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-50 dark:hover:bg-zinc-800"
        >
            View all categories
        </button>
      </div>

      {/* Contextual Nudge - Sharp */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 border-l-4 border-yellow-400">
        <div className="flex items-start space-x-3">
            <Icons.AlertCircle className="text-yellow-600 dark:text-yellow-400 shrink-0" size={20} />
            <div>
                <h4 className="font-bold text-yellow-800 dark:text-yellow-300 text-sm">Maintain your limit</h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">Paying on time keeps your balance available for emergencies.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
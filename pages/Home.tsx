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
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Personalized Greeting & Score */}
      <div className="flex justify-between items-center px-1">
          <div>
              <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Hi, {firstName} <span className="text-2xl">👋</span></h1>
              <div className="flex items-center space-x-2">
                 <span className="text-sm text-zinc-500 dark:text-zinc-400">EC Score:</span>
                 <span className={`text-sm font-bold ${user.ecScore > 700 ? 'text-green-600' : 'text-orange-500'}`}>{user.ecScore}</span>
              </div>
          </div>
          <div className="flex flex-col items-end">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 border-yellow-500`}>
                  LEVEL {user.creditLevel}
              </span>
          </div>
      </div>

      {/* RBI Guard Rail Shield */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-3 flex items-center gap-3">
          <Icons.ShieldCheck className="text-emerald-600 dark:text-emerald-500 shrink-0" size={20} />
          <div>
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">RBI Guard Rails Active</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">Spends restricted to essentials. P2P transfers blocked.</p>
          </div>
      </div>

      {/* Balance Block - Cumulative Spend Limit */}
      <div className="bg-white dark:bg-zinc-900 border-l-4 border-blue-600 p-6 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h2 className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wide font-bold mb-1">Cumulative Spend Limit</h2>
                <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-zinc-800 dark:text-white">₹{user.totalLimit - user.usedAmount}</span>
                    <span className="text-sm text-zinc-400 font-medium">/ ₹{user.totalLimit}</span>
                </div>
            </div>
            <div className="text-right">
                 <p className="text-[10px] text-zinc-400 uppercase font-bold">Shared Limit</p>
                 <Icons.Grid size={16} className="ml-auto text-blue-500 mt-1" />
            </div>
        </div>
        
        <div className="mt-4 w-full h-4 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
            <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <span>Used: ₹{user.usedAmount}</span>
            <span className="text-blue-600 dark:text-blue-400">Spend across Fuel, Grocery, Pharma...</span>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/10 p-2">
                <Icons.TrendingUp size={12} />
                <span>Next Level: Repay to unlock +₹1000 Spend Limit!</span>
            </div>
        </div>
      </div>

      {/* DUAL ACTION CARDS */}
      <div className="grid grid-cols-2 gap-4">
          
          {/* 1. EC CASH CARD - Separate Limit */}
          <div 
             onClick={() => {
                 const ecCashCat = SPEND_CATEGORIES.find(c => c.type === SpendCategoryType.EC_CASH);
                 if (ecCashCat) handleCategoryClick(ecCashCat);
             }}
             className="group relative bg-zinc-900 dark:bg-black p-5 flex flex-col justify-between min-h-[180px] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500"
          >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-500 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
              
              <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-zinc-800 rounded-lg text-green-500">
                          <Icons.Banknote size={20} />
                      </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-white leading-none mb-1">EC Cash</h3>
                  <p className="text-zinc-400 text-xs font-medium leading-tight mb-2">Self-transfer only</p>
                  
                  {/* Separate Limit Badge */}
                  <div className="inline-block bg-zinc-800 border border-zinc-700 rounded px-2 py-1">
                      <p className="text-[10px] text-zinc-400 uppercase">Separate Limit</p>
                      <p className="text-sm font-bold text-green-400">₹{user.cashLimit}</p>
                  </div>
              </div>

              <div className="relative z-10 mt-3">
                  <button className="bg-green-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider flex items-center space-x-1 group-hover:bg-green-500 transition-colors w-fit shadow-lg">
                      <span>Get Now</span>
                      <Icons.ArrowRight size={12} />
                  </button>
              </div>
          </div>

          {/* 2. SCAN & PAY CARD */}
          <div 
             onClick={() => onNavigate('scan')}
             className="group relative bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between min-h-[180px] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-600"
          >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600 rounded-full opacity-5 blur-xl group-hover:opacity-10 transition-opacity"></div>

              <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-blue-50 dark:bg-zinc-800 rounded-lg text-blue-600">
                          <Icons.QrCode size={20} />
                      </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white leading-none mb-2">Scan & Pay</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium leading-tight mb-2">Verified Merchants Only</p>
                  
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Using Spend Limit
                  </div>
              </div>

              <div className="relative z-10 mt-3">
                   <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider flex items-center space-x-1 group-hover:bg-blue-700 transition-colors w-fit shadow-lg">
                      <span>Scan QR</span>
                      <Icons.ScanLine size={12} />
                  </button>
              </div>
          </div>
      </div>

      {/* Quick Spend Tiles */}
      <div>
        <h3 className="text-zinc-800 dark:text-white font-bold mb-4 px-1">Quick Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SPEND_CATEGORIES.slice(0, 4).map((cat) => {
                // @ts-ignore
                const Icon = Icons[cat.icon];
                const isECCash = cat.type === SpendCategoryType.EC_CASH;
                // Visual distinction for limits
                const limitLabel = isECCash ? `Separate: ₹${user.cashLimit}` : 'Shared Spend Limit';
                
                return (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className={`p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center space-y-3 transition-colors shadow-sm ${isECCash ? 'bg-zinc-900 text-white' : 'bg-white dark:bg-zinc-900'}`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-none ${isECCash ? 'bg-green-500 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <span className={`block text-sm font-bold ${isECCash ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>{cat.type}</span>
                            <span className={`block text-[10px] mt-1 ${isECCash ? 'text-zinc-400' : 'text-zinc-400'}`}>{limitLabel}</span>
                        </div>
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { UserState } from '../types';
import { User, Phone, FileText, LogOut, MessageCircle, TrendingUp, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';

interface ProfileProps {
    user: UserState;
    onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostStep, setBoostStep] = useState(0);

  const menuItems = [
      { icon: User, label: 'Personal Details', desc: 'Name, Email, KYC Status' },
      { icon: FileText, label: 'Loan Agreements (KFS)', desc: 'View your signed documents' },
      { icon: Phone, label: 'Help & Support', desc: 'FAQs, Contact Us' },
      { icon: MessageCircle, label: 'Grievance Redressal', desc: 'Report an issue' },
  ];

  const handleBoostLimit = () => {
      setIsBoosting(true);
      // Simulate Account Aggregator Fetch
      let step = 0;
      const interval = setInterval(() => {
          step++;
          setBoostStep(step);
          if (step >= 4) {
              clearInterval(interval);
              setTimeout(() => {
                  setIsBoosting(false);
                  setBoostStep(0);
                  alert("Limit Boost Request Submitted! Our underwriting AI is analyzing your bank statement.");
              }, 1000);
          }
      }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white px-1">Profile</h2>

        {/* User Card - Sharp */}
        <div className="bg-white dark:bg-zinc-900 p-6 border-b-4 border-blue-600 flex items-center space-x-4 shadow-sm">
            <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-2xl font-bold rounded-none">
                {user.name.charAt(0)}
            </div>
            <div>
                <h3 className="font-bold text-lg text-zinc-800 dark:text-white">{user.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">+91 98765 43210</p>
                <div className="mt-2 inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 uppercase">
                    KYC Verified
                </div>
            </div>
        </div>

        {/* Account Aggregator Limit Boost - New Feature */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={!isBoosting ? handleBoostLimit : undefined}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            
            {!isBoosting ? (
                <>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingUp size={20} className="text-yellow-300" />
                                Boost Your Limit
                            </h3>
                            <p className="text-emerald-100 text-xs mt-1 max-w-[200px]">Link your main bank account securely to unlock up to ₹5,000.</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-200 font-medium">
                        <span className="bg-black/20 px-2 py-1 rounded">Powered by Account Aggregator</span>
                        <ShieldCheck size={12} />
                    </div>
                </>
            ) : (
                <div className="relative z-10 text-center py-2">
                     <Loader2 className="animate-spin mx-auto mb-2 text-yellow-300" size={28} />
                     <p className="font-bold text-sm">
                        {boostStep === 1 && "Connecting to Anumati AA..."}
                        {boostStep === 2 && "Requesting Bank Statement..."}
                        {boostStep === 3 && "Analyzing Cash Flow..."}
                        {boostStep === 4 && "Finalizing Offer..."}
                     </p>
                     <p className="text-xs text-emerald-200 mt-1">100% Secure & RBI Regulated</p>
                </div>
            )}
        </div>

        {/* Menu - Sharp */}
        <div className="grid gap-4">
            {menuItems.map((item, idx) => (
                <button key={idx} className="bg-white dark:bg-zinc-900 p-4 flex items-center space-x-4 border-l-4 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left shadow-sm">
                    <div className="text-zinc-400">
                        <item.icon size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-zinc-700 dark:text-zinc-200">{item.label}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{item.desc}</p>
                    </div>
                </button>
            ))}
        </div>

        {/* LSP/RE Footer Info */}
        <div className="mt-8 p-4 text-center border-t border-zinc-200 dark:border-zinc-800">
             <p className="text-xs text-zinc-400 mb-2">Partnered with RBI-regulated NBFCs</p>
             <p className="text-[10px] text-zinc-300 dark:text-zinc-600">Version 1.0.0 • EC1000 <span className="text-emerald-600 dark:text-emerald-500">Duo</span></p>
             <button 
                onClick={onLogout}
                className="mt-4 flex items-center justify-center space-x-2 text-red-500 hover:text-red-600 w-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 transition-colors"
             >
                 <LogOut size={16} />
                 <span className="font-medium text-sm">Log Out</span>
             </button>
        </div>
    </div>
  );
};
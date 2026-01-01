import React, { useState } from 'react';
import { UserState } from '../types';
import { Button } from '../components/Button';
import { Lock, AlertCircle, LogOut, ShieldCheck } from 'lucide-react';

interface QuickLoginProps {
  user: UserState;
  onLoginSuccess: () => void;
  onSwitchAccount: () => void;
}

export const QuickLogin: React.FC<QuickLoginProps> = ({ user, onLoginSuccess, onSwitchAccount }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (pin === user.pin) {
      onLoginSuccess();
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  // Allow Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 border border-zinc-200 shadow-sm text-center">
        <div className="mb-6 flex justify-center">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Lock size={32} />
           </div>
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-800 mb-1">Welcome Back, {user.name.split(' ')[0]}</h2>
        <p className="text-zinc-500 text-sm mb-8">{user.phone ? `+91 ${user.phone}` : 'Enter your PIN to access'}</p>

        <div className="mb-6">
           <label className="block text-left text-xs font-bold text-zinc-500 uppercase mb-2 tracking-wide">Security PIN</label>
           <input 
              type="password"
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 6) {
                    setPin(val);
                    setError('');
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="••••"
              className={`w-full p-4 text-center text-2xl font-bold tracking-[0.5em] border-2 outline-none transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-zinc-200 focus:border-blue-600'}`}
              autoFocus
           />
           {error && (
             <div className="flex items-center justify-center mt-2 text-red-500 text-sm font-medium animate-pulse">
                <AlertCircle size={14} className="mr-1" />
                {error}
             </div>
           )}
        </div>

        <Button fullWidth onClick={handleLogin} size="lg" className="mb-4">
           Unlock Dashboard
        </Button>

        <button 
           onClick={onSwitchAccount}
           className="text-zinc-400 text-sm font-medium hover:text-zinc-600 flex items-center justify-center space-x-1 mx-auto mt-4"
        >
           <LogOut size={14} />
           <span>Switch Account</span>
        </button>
        
        <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-center space-x-2 text-zinc-300">
            <ShieldCheck size={14} />
            <span className="text-xs font-medium">Secured by EC1000 Duo</span>
        </div>
      </div>
    </div>
  );
};
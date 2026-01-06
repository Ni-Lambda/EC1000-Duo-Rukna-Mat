import React, { useState } from 'react';
import { Button } from '../components/Button';
import { UserState } from '../types';
import { AlertTriangle, Calendar, ArrowUpCircle, Loader2, CheckCircle, ChevronDown, ChevronUp, Banknote, ScanLine, Clock, Building2, Receipt, Info, ShieldCheck, Wallet, FileText, Landmark } from 'lucide-react';

interface RepaymentsProps {
    user: UserState;
    onRepaySuccess?: (type: 'SPEND' | 'CASH') => void;
}

export const Repayments: React.FC<RepaymentsProps> = ({ user, onRepaySuccess }) => {
  const [processingType, setProcessingType] = useState<'SPEND' | 'CASH' | null>(null);
  const [expandedSchedule, setExpandedSchedule] = useState<'SPEND' | 'CASH' | null>(null);

  // Mocking Due Dates based on current date
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 5); // 5 days from now
  const dueDateStr = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const handlePay = (type: 'SPEND' | 'CASH', e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent toggling when clicking Pay
      setProcessingType(type);
      setTimeout(() => {
          setProcessingType(null);
          if (onRepaySuccess) onRepaySuccess(type);
      }, 2000);
  };

  const toggleSchedule = (type: 'SPEND' | 'CASH') => {
      if (expandedSchedule === type) setExpandedSchedule(null);
      else setExpandedSchedule(type);
  };

  const hasSpendDue = user.usedAmount > 0;
  const hasCashDue = user.cashUsed > 0;
  const totalDue = user.usedAmount + user.cashUsed;

  // Mock Schedules
  const spendSchedule = [
      { id: 1, label: 'Current Cycle Bill', date: dueDateStr, amount: user.usedAmount, status: 'DUE' },
  ];

  const installmentAmt = Math.ceil(user.cashUsed / 4); 
  const cashSchedule = [
      { id: 1, label: 'Installment 1', date: dueDateStr, amount: installmentAmt, status: 'DUE' },
      { id: 2, label: 'Installment 2', date: 'Next Week', amount: installmentAmt, status: 'UPCOMING' },
      { id: 3, label: 'Installment 3', date: 'In 2 Weeks', amount: installmentAmt, status: 'UPCOMING' },
      { id: 4, label: 'Installment 4', date: 'In 3 Weeks', amount: installmentAmt, status: 'UPCOMING' },
  ];

  // Helper to render expanded details
  const renderExpandedDetails = (type: 'SPEND' | 'CASH') => {
      const isSpend = type === 'SPEND';
      const schedule = isSpend ? spendSchedule : cashSchedule;
      const lan = isSpend ? 'LAN: HDFC-BNPL-8821' : 'LAN: SL-PL-4902';
      const lender = isSpend ? 'HDFC Bank' : 'SafeLend NBFC';
      const sanctionDate = 'Oct 1, 2025';

      return (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-700 animate-fade-in">
              {/* Loan Details Section */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Loan Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                          <p className="text-zinc-400 text-xs">Lender</p>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                              <Building2 size={12} /> {lender}
                          </p>
                      </div>
                      <div>
                          <p className="text-zinc-400 text-xs">Account Number (LAN)</p>
                          <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{lan}</p>
                      </div>
                      <div>
                          <p className="text-zinc-400 text-xs">Sanction Date</p>
                          <p className="font-bold text-zinc-800 dark:text-zinc-200">{sanctionDate}</p>
                      </div>
                      <div>
                          <p className="text-zinc-400 text-xs">Reference ID</p>
                          <p className="font-mono text-zinc-800 dark:text-zinc-200">REF-{Math.floor(Math.random()*100000)}</p>
                      </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                       <button className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                           <FileText size={12} /> View KFS
                       </button>
                       <button className="text-xs font-bold text-zinc-500 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                           <Landmark size={12} /> NOC Status
                       </button>
                  </div>
              </div>

              {/* Repayment Schedule */}
              <div className="p-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Repayment Schedule</h4>
                  <div className="space-y-3">
                      {schedule.map((item, idx) => (
                          <div key={item.id} className={`flex justify-between items-center ${idx !== schedule.length - 1 ? 'border-b border-zinc-200 dark:border-zinc-800 pb-2' : ''}`}>
                              <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${item.status === 'DUE' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'}`}>
                                      {item.id}
                                  </div>
                                  <div>
                                      <p className={`text-sm font-bold ${item.status === 'DUE' ? 'text-zinc-800 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>{item.label}</p>
                                      <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                                          <Calendar size={10} /> {item.date}
                                      </p>
                                  </div>
                              </div>
                              <span className={`font-bold text-sm ${item.status === 'DUE' ? 'text-red-600 dark:text-red-400' : 'text-zinc-400'}`}>
                                  ₹{item.amount}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  };

  if (totalDue === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-fade-in">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 shadow-sm animate-bounce">
                <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">No Dues Pending</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
                Great job! Your <span className="text-emerald-600 font-bold">EC Score</span> is healthy.
            </p>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded border border-zinc-200 dark:border-zinc-700 max-w-sm w-full">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck size={20} className="text-blue-500" />
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Limits Unlocked</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>EC Spend</span>
                    <span className="font-bold text-zinc-800 dark:text-white">₹{user.totalLimit}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    <span>EC Cash</span>
                    <span className="font-bold text-zinc-800 dark:text-white">₹{user.cashLimit}</span>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
        <div className="px-1">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Repayments</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage your dues efficiently.</p>
        </div>

        {/* Aggregate Health Card */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 text-white p-5 rounded-none shadow-md border-l-4 border-yellow-500">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-1">Total Outstanding</p>
                    <h3 className="text-3xl font-bold">₹{totalDue}</h3>
                </div>
                <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1 text-xs font-bold uppercase rounded border border-yellow-500/30 animate-pulse">
                    Action Required
                </div>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-2">
                <Info size={14} />
                <span>Pay by <strong>{dueDateStr}</strong> to avoid late fees.</span>
            </p>
        </div>

        {/* 1. EC SPEND REPAYMENT CARD */}
        {hasSpendDue && (
            <div 
                className={`bg-white dark:bg-zinc-900 border transition-all duration-300 shadow-sm rounded-none overflow-hidden cursor-pointer ${expandedSchedule === 'SPEND' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-300'}`}
                onClick={() => toggleSchedule('SPEND')}
            >
                {/* Header */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 border-b border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-white dark:bg-zinc-800 rounded text-blue-600 shadow-sm border border-blue-100 dark:border-blue-900/30">
                             <ScanLine size={20} />
                         </div>
                         <div>
                             <h3 className="font-bold text-zinc-800 dark:text-white text-base">EC Spend</h3>
                             <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium">Shared Limit Usage</p>
                         </div>
                    </div>
                    <div className="text-right">
                         <ChevronDown size={20} className={`text-zinc-400 transition-transform duration-300 ${expandedSchedule === 'SPEND' ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Body Summary */}
                <div className="p-5">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                             <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Bill Amount</p>
                             <p className="text-3xl font-bold text-zinc-800 dark:text-white">₹{user.usedAmount}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded inline-flex items-center gap-1">
                                 <AlertTriangle size={12} /> Due {dueDateStr}
                             </p>
                        </div>
                    </div>

                    <Button 
                        fullWidth 
                        onClick={(e) => handlePay('SPEND', e)} 
                        disabled={processingType === 'SPEND'} 
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {processingType === 'SPEND' ? <Loader2 className="animate-spin" /> : `Pay Bill ₹${user.usedAmount}`}
                    </Button>
                </div>

                {/* Expandable Content */}
                {expandedSchedule === 'SPEND' && renderExpandedDetails('SPEND')}
            </div>
        )}

        {/* 2. EC CASH REPAYMENT CARD */}
        {hasCashDue && (
            <div 
                className={`bg-white dark:bg-zinc-900 border transition-all duration-300 shadow-sm rounded-none overflow-hidden cursor-pointer ${expandedSchedule === 'CASH' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-300'}`}
                onClick={() => toggleSchedule('CASH')}
            >
                {/* Header */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 border-b border-emerald-100 dark:border-emerald-900/30 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-white dark:bg-zinc-800 rounded text-emerald-600 shadow-sm border border-emerald-100 dark:border-emerald-900/30">
                             {/* VISIBLE CASH VECTOR/ICON */}
                             <Banknote size={24} strokeWidth={2.5} />
                         </div>
                         <div>
                             <h3 className="font-bold text-zinc-800 dark:text-white text-base">EC Cash</h3>
                             <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium">Personal Loan</p>
                         </div>
                    </div>
                    <div className="text-right">
                        <ChevronDown size={20} className={`text-zinc-400 transition-transform duration-300 ${expandedSchedule === 'CASH' ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {/* Body Summary */}
                <div className="p-5">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                             <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Installment Due</p>
                             <p className="text-3xl font-bold text-zinc-800 dark:text-white">₹{installmentAmt}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded inline-flex items-center gap-1">
                                 <Calendar size={12} /> Due {dueDateStr}
                             </p>
                        </div>
                    </div>
                    
                    <Button 
                        fullWidth 
                        onClick={(e) => handlePay('CASH', e)} 
                        disabled={processingType === 'CASH'} 
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {processingType === 'CASH' ? <Loader2 className="animate-spin" /> : `Pay Installment ₹${installmentAmt}`}
                    </Button>
                </div>

                {/* Expandable Content */}
                {expandedSchedule === 'CASH' && renderExpandedDetails('CASH')}
            </div>
        )}
    </div>
  );
};
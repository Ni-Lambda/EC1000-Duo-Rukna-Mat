import React from 'react';
import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const MOCK_HISTORY: Transaction[] = [
    { id: '1', title: 'Manoj Kirana', date: 'Oct 24, 2:30 PM', amount: 250, type: 'debit', status: 'completed', category: 'Grocery' as any },
    { id: '2', title: 'Indian Oil Corp', date: 'Oct 23, 9:15 AM', amount: 500, type: 'debit', status: 'completed', category: 'Fuel' as any },
    { id: '3', title: 'Repayment Received', date: 'Oct 20, 10:00 AM', amount: 1000, type: 'credit', status: 'completed' },
    { id: '4', title: 'Apollo Pharmacy', date: 'Oct 18, 6:45 PM', amount: 150, type: 'debit', status: 'completed', category: 'Pharma' as any },
];

export const History: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white px-1">Transaction History</h2>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {MOCK_HISTORY.map((tx, index) => (
                <div key={tx.id} className={`p-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${index !== MOCK_HISTORY.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                    <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'} rounded-none`}>
                            {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                            <p className="font-bold text-zinc-800 dark:text-white text-sm">{tx.title}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{tx.date}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-zinc-800 dark:text-white'}`}>
                            {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                        </p>
                        <p className="text-[10px] uppercase text-zinc-400 tracking-wide">{tx.status}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="text-center pt-4">
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Load More Transactions</button>
        </div>
    </div>
  );
};
import React from 'react';
import { Button } from '../components/Button';
import { AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

export const Repayments: React.FC = () => {
  const dueAmount = 250;
  const dueDate = 'Today';
  
  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white px-1">Repayments</h2>

        {/* Health Indicator - Sharp */}
        <div className="bg-white dark:bg-zinc-900 p-6 border-t-4 border-yellow-500 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-zinc-800 dark:text-white">Repayment Status</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Keep your EC score healthy</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 text-xs font-bold uppercase flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    Payment Due
                </div>
            </div>

            <div className="w-full h-6 bg-zinc-100 dark:bg-zinc-800 flex mb-2">
                <div className="w-2/3 bg-green-500 h-full"></div>
                <div className="w-1/3 bg-yellow-400 h-full relative">
                     <div className="absolute -top-2 -right-2 w-4 h-4 bg-zinc-800 dark:bg-zinc-200 transform rotate-45"></div>
                </div>
            </div>
            <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span>Good Standing</span>
                <span>Attention Needed</span>
            </div>
        </div>

        {/* Due Card - Sharp */}
        <div className="bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                 <div>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Due Amount</p>
                     <p className="text-3xl font-bold text-zinc-800 dark:text-white">₹{dueAmount}</p>
                 </div>
                 <div className="text-right">
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Due Date</p>
                     <p className="text-xl font-bold text-red-600 dark:text-red-500">{dueDate}</p>
                 </div>
             </div>

             <Button fullWidth>Pay Now</Button>

             <div className="mt-4 text-center">
                 <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View Breakup</button>
             </div>
        </div>

        {/* FlexiSmart Options */}
        <div>
             <h3 className="font-bold text-zinc-800 dark:text-white mb-4 px-1">FlexiSmart Options</h3>
             <div className="space-y-3">
                 <label className="flex items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                     <input type="radio" name="flexi" className="w-5 h-5 text-blue-600" defaultChecked />
                     <div className="ml-4">
                         <span className="block font-bold text-zinc-800 dark:text-white">Pay Full Amount</span>
                         <span className="block text-xs text-zinc-500 dark:text-zinc-400">Clear dues instantly, unlock higher limits.</span>
                     </div>
                 </label>
                 <label className="flex items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                     <input type="radio" name="flexi" className="w-5 h-5 text-blue-600" />
                     <div className="ml-4">
                         <span className="block font-bold text-zinc-800 dark:text-white">Convert to Weekly</span>
                         <span className="block text-xs text-zinc-500 dark:text-zinc-400">Pay ₹65/week for 4 weeks.</span>
                     </div>
                 </label>
             </div>
        </div>

        {/* History Preview */}
        <div>
            <h3 className="font-bold text-zinc-800 dark:text-white mb-4 px-1">Upcoming</h3>
            <div className="bg-white dark:bg-zinc-900 border-l-4 border-zinc-300 dark:border-zinc-700 p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center space-x-3">
                    <Calendar className="text-zinc-400" />
                    <div>
                        <p className="font-bold text-zinc-700 dark:text-zinc-300">Next Cycle</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">Due Nov 15</p>
                    </div>
                </div>
                <span className="font-bold text-zinc-500 dark:text-zinc-400">₹0</span>
            </div>
        </div>
    </div>
  );
};
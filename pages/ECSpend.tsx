import React, { useState, useEffect } from 'react';
import { SPEND_CATEGORIES, SpendCategoryType, RepaymentPlan, UserState } from '../types';
import { Button } from '../components/Button';
import * as Icons from 'lucide-react';

interface ECSpendProps {
  onNavigate: (page: string, context?: any) => void;
  initialCategory?: number;
  user: UserState;
}

// Real Bank Logos and Base Rates for sorting
const BANKS = [
  { 
    id: 'hdfc', 
    name: 'HDFC Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg', 
    baseRate: 0.12, // 12% lowest
    color: 'bg-blue-900'
  },
  { 
    id: 'sbi', 
    name: 'State Bank of India', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg', 
    baseRate: 0.125,
    color: 'bg-blue-500'
  },
  { 
    id: 'icici', 
    name: 'ICICI Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg', 
    baseRate: 0.14,
    color: 'bg-orange-600'
  },
  { 
    id: 'axis', 
    name: 'Axis Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Axis_Bank_logo.svg', 
    baseRate: 0.15, // highest
    color: 'bg-red-800'
  }
];

const SPEND_HIGHLIGHTS = [
    { 
        id: 'h1', 
        title: 'Fuel on the Go', 
        image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=800',
        desc: 'Pay at any petrol pump' 
    },
    { 
        id: 'h2', 
        title: 'Weekly Groceries', 
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
        desc: 'Fresh veggies & staples' 
    },
    { 
        id: 'h3', 
        title: 'Pharmacy Needs', 
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
        desc: 'Medicines & healthcare' 
    },
    { 
        id: 'h4', 
        title: 'Utility Bills', 
        image: 'https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?auto=format&fit=crop&q=80&w=800',
        desc: 'Electricity, Water, Gas' 
    },
];

interface BankOffer {
    bankId: string;
    bankName: string;
    logo: string;
    interestRate: number;
    plan: RepaymentPlan;
}

export const ECSpend: React.FC<ECSpendProps> = ({ onNavigate, initialCategory, user }) => {
  // Navigation State
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Transaction State
  const [amount, setAmount] = useState('');
  
  // Inline Flow State
  const [showOffers, setShowOffers] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);
  const [showKFS, setShowKFS] = useState(false);
  const [processingState, setProcessingState] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  
  // KFS Customization
  const [kfsFrequency, setKfsFrequency] = useState<'WEEKLY' | 'BIWEEKLY'>('WEEKLY');

  // Initialize view based on props
  useEffect(() => {
    if (initialCategory) {
        handleCategorySelect(initialCategory);
    } else {
        setSelectedCategory(null);
        resetFlow();
    }
  }, [initialCategory]);

  const resetFlow = () => {
      setAmount('');
      setShowOffers(false);
      setSelectedOffer(null);
      setShowKFS(false);
      setProcessingState('IDLE');
      setKfsFrequency('WEEKLY');
  };

  const handleCategorySelect = (id: number) => {
    const cat = SPEND_CATEGORIES.find(c => c.id === id);
    if (!cat) return;

    if (cat.isAppOnly) {
        // App-based categories (EC Cash, Mobile, DTH, Bills) use internal flow
        setSelectedCategory(id);
        if (cat.type === SpendCategoryType.EC_CASH) {
            setAmount('1000');
        } else {
            setAmount('');
        }
        // Reset sub-states when entering new category
        setShowOffers(false);
        setSelectedOffer(null);
        setShowKFS(false);
    } else {
        // Physical Scan categories (Fuel, Grocery, Pharma) redirect to ScanPay modal
        onNavigate('scan', { categoryId: id });
        setSelectedCategory(null);
    }
  };

  const handleBack = () => {
      if (showKFS) {
          setShowKFS(false);
          return;
      }
      if (showOffers) {
          setShowOffers(false);
          setSelectedOffer(null);
          return;
      }
      // Go back to the Spend List
      setSelectedCategory(null);
      resetFlow();
  };
  
  const handlePaymentProcess = () => {
      setShowKFS(false);
      setProcessingState('PROCESSING');
      setTimeout(() => {
          setProcessingState('SUCCESS');
      }, 2500);
  };

  const getPlanConfig = (categoryType: SpendCategoryType | undefined) => {
      switch (categoryType) {
          case SpendCategoryType.EC_CASH:
          default:
               return { 
                  name: 'Smart Split', 
                  description: 'Standard liquidity plan',
                  days: 28, // Defaulting to ~1 month for weekly breakdown
                  installments: 4, 
                  freqLabel: 'Weekly',
                  type: 'Standard'
              };
      }
  };

  const getBankOffers = (): BankOffer[] => {
      const principal = Number(amount);
      if (!principal) return [];

      const category = SPEND_CATEGORIES.find(c => c.id === selectedCategory);
      const config = getPlanConfig(category?.type);

      const offers: BankOffer[] = [];

      BANKS.forEach(bank => {
          const interestAmt = Math.ceil(principal * bank.baseRate * (config.days/365));
          const fee = Math.ceil(principal * 0.01); 
          const total = principal + interestAmt + fee;
          const installmentAmt = Math.ceil(total / config.installments);

          offers.push({
              bankId: bank.id,
              bankName: bank.name,
              logo: bank.logo,
              interestRate: bank.baseRate,
              plan: {
                  id: `${bank.id}_${config.name.replace(/\s/g, '')}`,
                  title: config.name,
                  description: config.description,
                  duration: `${config.days} Days`,
                  interest: `${(bank.baseRate * 100).toFixed(1)}% p.a.`,
                  fee: fee,
                  principal: principal,
                  interestAmount: interestAmt,
                  totalPayable: total,
                  installments: config.installments,
                  installmentAmount: installmentAmt,
                  frequency: config.freqLabel
              }
          });
      });

      return offers.sort((a, b) => a.interestRate - b.interestRate);
  };

  // --- SUB-RENDERERS ---

  const renderProcessing = () => (
      <div className="fixed inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col items-center justify-center space-y-6 animate-fade-in">
          <div className="relative">
              <div className="w-20 h-20 border-4 border-zinc-100 dark:border-zinc-800 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
              <Icons.Building2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          <div className="text-center">
              <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Connecting to {selectedOffer?.bankName}...</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Verifying Limit & Initiating Disbursal</p>
          </div>
      </div>
  );

  const renderSuccess = () => (
      <div className="fixed inset-0 bg-green-50 dark:bg-green-950/50 z-50 overflow-y-auto animate-fade-in">
             <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-6 text-green-600 dark:text-green-400 animate-bounce">
                    <Icons.CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Funds Disbursed!</h2>
                <p className="text-green-700 dark:text-green-300 mb-8">₹{amount} sent to your account via {selectedOffer?.bankName}</p>
                
                {/* Disbursal Receipt */}
                <div className="w-full max-w-sm bg-white dark:bg-zinc-900 p-4 space-y-4 mb-4 border border-green-200 dark:border-green-800 shadow-sm text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 font-bold">PAID</div>
                    <h3 className="text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-800 pb-2">Transaction Receipt</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Ref ID</span>
                        <span className="font-mono text-zinc-700 dark:text-zinc-300">TXN_882910</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Bank</span>
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{selectedOffer?.bankName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Repayment</span>
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{kfsFrequency === 'WEEKLY' ? 'Weekly' : 'Bi-Weekly'} Plan</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Time</span>
                        <span className="text-zinc-700 dark:text-zinc-300">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="mt-8 w-full max-w-sm">
                    <Button fullWidth onClick={() => onNavigate('home')}>Back to Home</Button>
                </div>
             </div>
        </div>
  );

  const renderKFSModal = () => {
    if (!selectedOffer) return null;

    // Recalculate based on frequency choice
    const principal = Number(amount);
    const durationDays = kfsFrequency === 'WEEKLY' ? 28 : 30; // 4 weeks vs 1 month
    const installments = kfsFrequency === 'WEEKLY' ? 4 : 2;

    // Dynamic Interest Rate: Lower rate for quicker repayment (Weekly)
    // Bi-Weekly gets +5% p.a. premium
    const effectiveInterestRate = kfsFrequency === 'WEEKLY' 
        ? selectedOffer.interestRate 
        : selectedOffer.interestRate + 0.05;

    const interestAmt = Math.ceil(principal * effectiveInterestRate * (durationDays/365));
    const fee = Math.ceil(principal * 0.01);
    const totalPayable = principal + interestAmt + fee;
    const installmentAmt = Math.ceil(totalPayable / installments);

    // Generate Schedule Dates
    const schedule = [];
    const today = new Date();
    const intervalDays = kfsFrequency === 'WEEKLY' ? 7 : 15;
    
    for(let i=1; i<=installments; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + (i * intervalDays));
        schedule.push({
            id: i,
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            amount: installmentAmt
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-2xl md:rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto animate-slide-in-right md:animate-none">
                 {/* Modal Header */}
                 <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
                     <h2 className="text-lg font-bold text-zinc-800 dark:text-white">Key Fact Statement</h2>
                     <button onClick={() => setShowKFS(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                         <Icons.X size={20} className="text-zinc-500" />
                     </button>
                 </div>

                 <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                         <img src={selectedOffer.logo} alt="Bank" className="h-8 w-auto" />
                         <div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase">Lender</p>
                            <h3 className="text-base font-bold text-zinc-800 dark:text-white">{selectedOffer.bankName}</h3>
                         </div>
                    </div>

                    {/* FREQUENCY TOGGLE */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-3 block">Choose Repayment Schedule</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setKfsFrequency('WEEKLY')}
                                className={`p-3 border-2 rounded text-center transition-all relative ${kfsFrequency === 'WEEKLY' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">BEST RATE</div>
                                <span className="block font-bold text-sm">Weekly</span>
                                <span className="text-[10px]">4 Installments</span>
                            </button>
                            <button 
                                onClick={() => setKfsFrequency('BIWEEKLY')}
                                className={`p-3 border-2 rounded text-center transition-all ${kfsFrequency === 'BIWEEKLY' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <span className="block font-bold text-sm">Bi-Weekly</span>
                                <span className="text-[10px]">2 Installments</span>
                            </button>
                        </div>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-700 rounded p-4 space-y-4 mb-6 bg-zinc-50 dark:bg-zinc-800/50">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500 dark:text-zinc-400">Loan Principal</span>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{principal}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-zinc-500 dark:text-zinc-400">Interest</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">₹{interestAmt}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500 dark:text-zinc-400">Processing Fees</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">₹{fee}</span>
                        </div>
                        <div className="border-t border-zinc-300 dark:border-zinc-600 pt-3 flex justify-between">
                             <span className="text-zinc-500 dark:text-zinc-400 font-medium">Total Repayment</span>
                             <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">₹{totalPayable}</span>
                        </div>
                    </div>

                    {/* SCHEDULE PREVIEW */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                             <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Repayment Schedule</label>
                             <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">Starts in {intervalDays} days</span>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm">
                            {schedule.map((item, idx) => (
                                <div key={item.id} className={`flex justify-between p-2 ${idx !== schedule.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}>
                                    <span className="text-zinc-500 dark:text-zinc-400 text-xs">Inst {item.id} <span className="mx-1">•</span> {item.date}</span>
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{item.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 mb-6">
                        <div className="mt-1">
                             <Icons.ShieldCheck className="text-emerald-500" size={20} />
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                            I agree to the Terms & Conditions and authorize {selectedOffer.bankName} to disburse the loan amount.
                        </p>
                    </div>

                    <Button fullWidth onClick={handlePaymentProcess} size="lg" className="shadow-lg font-bold">Accept & Get Money</Button>
                 </div>
            </div>
        </div>
    )
  };

  // --- MAIN RENDERERS ---

  const renderSpendList = () => {
    return (
    <div className="pb-20 animate-fade-in">
        {/* Explore Carousel */}
        <div className="mb-8">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-3 px-1">Explore Spending</h3>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
                {SPEND_HIGHLIGHTS.map((item) => (
                    <div key={item.id} className="snap-center flex-none w-[85%] md:w-80 h-48 relative overflow-hidden shadow-sm group cursor-pointer border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
                        {/* @ts-ignore */}
                        {item.image && (
                            <img 
                                // @ts-ignore
                                src={item.image} 
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent flex flex-col justify-end p-5">
                            <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                            <p className="text-zinc-300 text-sm font-medium border-l-2 border-green-500 pl-2">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Categories Grid */}
        <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-white">Spend Categories</h3>
            <span className="text-xs font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">All Options</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPEND_CATEGORIES.map((cat) => {
                // @ts-ignore
                const Icon = Icons[cat.icon];
                const isECCash = cat.type === SpendCategoryType.EC_CASH;
                
                return (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-l-4 transition-all shadow-sm relative flex items-center space-x-4 ${isECCash ? 'bg-zinc-900 border-green-500' : 'bg-white dark:bg-zinc-900 border-transparent hover:border-blue-600'}`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-none ${isECCash ? 'bg-green-500 text-white' : (cat.isAppOnly ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400')}`}>
                            <Icon size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className={`font-bold ${isECCash ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}`}>{cat.type}</h3>
                            <span className={`text-xs mt-1 ${isECCash ? 'text-zinc-400' : 'text-zinc-400'}`}>
                                {isECCash ? 'Instant Bank Transfer' : (cat.isAppOnly ? 'Pay Bills' : 'Scan & Pay')}
                            </span>
                        </div>
                        <Icons.ChevronRight className={`${isECCash ? 'text-zinc-500' : 'text-zinc-300 dark:text-zinc-600'}`} />
                    </button>
                )
            })}
        </div>
    </div>
  )};

  const renderDetails = () => {
    const cat = SPEND_CATEGORIES.find(c => c.id === selectedCategory);
    if (!cat) return null;
    // @ts-ignore
    const Icon = Icons[cat.icon];
    const isECCash = cat.type === SpendCategoryType.EC_CASH;
    
    const availableLimit = isECCash 
        ? (user.cashLimit - user.cashUsed) 
        : (user.totalLimit - user.usedAmount);

    const limitLabel = isECCash ? 'Cash Limit' : 'Cumulative Spend Limit';

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm animate-slide-in-right min-h-[calc(100vh-140px)] relative pb-20">
            <div className="p-6">
                <div className="flex items-center space-x-2 mb-6 text-zinc-500 dark:text-zinc-400 cursor-pointer" onClick={handleBack}>
                    <Icons.ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back</span>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className={`w-16 h-16 flex items-center justify-center mb-4 rounded-none ${isECCash ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                        <Icon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">{cat.type}</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {isECCash ? 'Instant liquidity to your account' : 'Enter transaction details below'}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Simplified Inputs for App Only Flows */}
                    {cat.isAppOnly && !isECCash && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    {cat.type === SpendCategoryType.BILLS ? 'Biller Name' : 'Operator'}
                                </label>
                                <select className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-600 outline-none text-black dark:text-white">
                                    <option>Select Provider</option>
                                    <option>Airtel</option>
                                    <option>Jio</option>
                                    <option>Vi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    {cat.type === SpendCategoryType.BILLS ? 'Consumer Number' : 'Mobile Number'}
                                </label>
                                 <input 
                                    type="text"
                                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-600 focus:border-blue-600 dark:focus:border-blue-500 outline-none text-black dark:text-white"
                                    placeholder="Enter Number"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Amount (₹)</label>
                        <div className="relative">
                            <input 
                                type="number"
                                value={amount}
                                readOnly={isECCash || showOffers} // Lock amount when offers are shown
                                onChange={(e) => setAmount(e.target.value)}
                                className={`w-full p-4 text-2xl font-bold border-b-2 outline-none text-black dark:text-white ${isECCash || showOffers ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 focus:border-blue-600 dark:focus:border-blue-500'}`}
                                placeholder="0"
                            />
                            {/* Dynamic Limit Message */}
                             <div className="mt-2 text-center flex justify-between items-center px-1">
                                 <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                     Available {limitLabel}: <span className="font-bold text-zinc-800 dark:text-white">₹{availableLimit}</span>
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTON - Only show if offers are NOT shown */}
            {!showOffers && (
                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 sticky bottom-0 z-10">
                    <Button fullWidth onClick={() => setShowOffers(true)} disabled={!amount || Number(amount) < 1 || Number(amount) > availableLimit}>
                        {Number(amount) > availableLimit ? 'Limit Exceeded' : 'View Bank Offers'}
                    </Button>
                </div>
            )}

            {/* EXPANDING OFFERS SECTION (Inline) */}
            {showOffers && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 animate-fade-in border-t-2 border-zinc-200 dark:border-zinc-800">
                     <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">Select Repayment Plan</h3>
                     
                     <div className="space-y-4">
                         {getBankOffers().map((offer, index) => (
                             <div 
                                key={offer.bankId}
                                onClick={() => {
                                    setSelectedOffer(offer);
                                    setShowKFS(true);
                                }}
                                className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-blue-500 cursor-pointer transition-all group"
                             >
                                 <div className="flex justify-between items-center">
                                     <div className="flex items-center space-x-3">
                                         <div className="w-10 h-10 border border-zinc-100 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-800">
                                             <img src={offer.logo} alt={offer.bankName} className="w-full h-full object-contain" />
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-zinc-800 dark:text-white text-sm">{offer.bankName}</h4>
                                             <p className="text-xs text-zinc-500">{offer.plan.title}</p>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <span className="block font-bold text-blue-600 dark:text-blue-400">₹{offer.plan.installmentAmount?.toFixed(0)}</span>
                                         <span className="text-[10px] text-zinc-400">per installment</span>
                                     </div>
                                 </div>
                                 <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                                     <span className="text-zinc-500">{offer.plan.installments} Installments ({offer.plan.frequency})</span>
                                     <span className="font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 flex items-center gap-1">
                                         Select <Icons.ChevronRight size={14} />
                                     </span>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            )}
        </div>
    );
  };

  // --- STATE-BASED RETURN ---

  if (processingState === 'PROCESSING') return renderProcessing();
  if (processingState === 'SUCCESS') return renderSuccess();
  
  return (
    <div className="animate-fade-in">
         {selectedCategory === null ? (
             <>
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6 px-1">EC <span className="text-emerald-600 dark:text-emerald-500">Duo</span></h2>
                {renderSpendList()}
             </>
         ) : (
             <>
                 {renderDetails()}
                 {showKFS && renderKFSModal()}
             </>
         )}
    </div>
  );
};
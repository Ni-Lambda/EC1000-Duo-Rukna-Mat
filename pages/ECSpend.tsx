import React, { useState, useEffect } from 'react';
import { SPEND_CATEGORIES, SpendCategoryType, RepaymentPlan } from '../types';
import { Button } from '../components/Button';
import * as Icons from 'lucide-react';

interface ECSpendProps {
  onNavigate: (page: string) => void;
  initialCategory?: number;
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
        // Image removed
        desc: 'Pay at any petrol pump' 
    },
    { 
        id: 'h2', 
        title: 'Weekly Groceries', 
        // Image removed
        desc: 'Fresh veggies & staples' 
    },
    { 
        id: 'h3', 
        title: 'Pharmacy Needs', 
        // Image removed
        desc: 'Medicines & healthcare' 
    },
    { 
        id: 'h4', 
        title: 'Utility Bills', 
        // Image removed
        desc: 'Electricity, Water, Gas' 
    },
];

const EC_CASH_USE_CASES = [
  { id: 1, label: '₹1000 Cash' },
  { id: 2, label: 'Partner Support' },
  { id: 3, label: 'Fuel Refill' },
  { id: 4, label: 'Daily Grocery' },
  { id: 5, label: 'Mobile Recharge' }
];

interface BankOffer {
    bankId: string;
    bankName: string;
    logo: string;
    interestRate: number;
    plan: RepaymentPlan;
}

export const ECSpend: React.FC<ECSpendProps> = ({ onNavigate, initialCategory }) => {
  // Navigation State
  const [rootView, setRootView] = useState<'SELECTION' | 'SPEND_LIST'>('SELECTION');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Transaction State
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'DETAILS' | 'OFFERS' | 'KFS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);

  // Initialize view based on props
  useEffect(() => {
    if (initialCategory) {
        handleCategorySelect(initialCategory);
    } else {
        // Reset to selection if no initial category
        setRootView('SELECTION');
        setSelectedCategory(null);
    }
  }, [initialCategory]);

  const handleCategorySelect = (id: number) => {
    setSelectedCategory(id);
    const cat = SPEND_CATEGORIES.find(c => c.id === id);
    if (cat && cat.type === SpendCategoryType.EC_CASH) {
        setAmount('1000');
    } else {
        setAmount('');
    }
    setStep('DETAILS'); // Move to details flow
  };

  const handleBack = () => {
      // Flow back logic
      if (step === 'KFS') {
          setStep('OFFERS');
      } else if (step === 'OFFERS') {
          setStep('DETAILS');
      } else if (step === 'DETAILS') {
          // If we were in details, we go back to either Spend List or Root Selection
          const cat = SPEND_CATEGORIES.find(c => c.id === selectedCategory);
          if (cat?.type === SpendCategoryType.EC_CASH) {
              setRootView('SELECTION'); // EC Cash goes back to main selection
          } else {
              setRootView('SPEND_LIST'); // Others go back to the list
          }
          setSelectedCategory(null);
      }
  };
  
  const handleVerticalSelect = (vertical: 'CASH' | 'SPEND') => {
      if (vertical === 'CASH') {
          // Directly find EC Cash category and select it
          const ecCashCat = SPEND_CATEGORIES.find(c => c.type === SpendCategoryType.EC_CASH);
          if (ecCashCat) handleCategorySelect(ecCashCat.id);
      } else {
          setRootView('SPEND_LIST');
      }
  };

  const handlePaymentProcess = () => {
      setStep('PROCESSING');
      setTimeout(() => {
          setStep('SUCCESS');
      }, 2500);
  };

  const getPlanConfig = (categoryType: SpendCategoryType | undefined) => {
      switch (categoryType) {
          case SpendCategoryType.FUEL:
              return { 
                  name: 'Smart Fuel 4', 
                  description: 'Frequent refills, quick repayment',
                  days: 8, 
                  installments: 4, 
                  freqLabel: 'Every 2 Days',
                  type: 'Frequent'
              };
          case SpendCategoryType.GROCERY:
              return { 
                  name: 'Smart Kitchen 3', 
                  description: 'Daily needs, simple terms',
                  days: 9, 
                  installments: 3, 
                  freqLabel: 'Every 3 Days',
                  type: 'Frequent'
              };
          case SpendCategoryType.MOBILE:
          case SpendCategoryType.DTH:
          case SpendCategoryType.BILLS:
              return { 
                  name: 'Bill Flexi Weekly', 
                  description: 'Monthly bills, weekly ease',
                  days: 28, 
                  installments: 4, 
                  freqLabel: 'Weekly',
                  type: 'Extended'
              };
          case SpendCategoryType.PHARMA:
               return { 
                  name: 'Wellness Ease', 
                  description: 'Emergency support, relaxed timeline',
                  days: 45, 
                  installments: 3, 
                  freqLabel: 'Every 15 Days',
                  type: 'Extended'
              };
          case SpendCategoryType.EC_CASH:
          default:
               return { 
                  name: 'Smart Split', 
                  description: 'Standard liquidity plan',
                  days: 15, 
                  installments: 3, 
                  freqLabel: 'Every 5 Days',
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

  // --- VIEWS ---

  const renderSelection = () => (
      <div className="space-y-6 pb-20 animate-fade-in">
          <div>
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Choose Product</h2>
              <p className="text-zinc-500 dark:text-zinc-400">Select how you want to use your limit.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
              {/* EC CASH Card */}
              <div 
                  onClick={() => handleVerticalSelect('CASH')}
                  className="bg-zinc-900 dark:bg-zinc-800 rounded-none p-6 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-xl group relative overflow-hidden"
              >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Icons.Banknote size={120} />
                  </div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-none mb-4 font-bold shadow-lg">
                          <Icons.IndianRupee size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">EC Cash</h3>
                      <p className="text-zinc-400 mb-6 max-w-[80%]">Transfer funds directly to your bank account instantly.</p>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                          Get Cash <Icons.ArrowRight size={16} />
                      </button>
                  </div>
              </div>

              {/* EC SPEND Card */}
              <div 
                  onClick={() => handleVerticalSelect('SPEND')}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all group relative overflow-hidden"
              >
                   <div className="absolute top-0 right-0 p-4 text-blue-100 dark:text-blue-900 opacity-50 group-hover:text-blue-200 dark:group-hover:text-blue-800 transition-colors">
                      <Icons.Grid size={120} />
                  </div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-none mb-4 font-bold">
                          <Icons.ShoppingCart size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">EC Spend</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-[80%]">Use limit for groceries, fuel, bills, and merchant payments.</p>
                      <button className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-6 py-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                          Explore Categories <Icons.ArrowRight size={16} />
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderSpendList = () => (
    <div className="pb-20 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6 text-zinc-500 dark:text-zinc-400 cursor-pointer" onClick={() => setRootView('SELECTION')}>
            <Icons.ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Selection</span>
        </div>

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

        {/* Filtered Grid (Exclude EC Cash) */}
        <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-3 px-1">Spend Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPEND_CATEGORIES.filter(c => c.type !== SpendCategoryType.EC_CASH).map((cat) => {
                // @ts-ignore
                const Icon = Icons[cat.icon];
                return (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-l-4 border-transparent hover:border-blue-600 flex items-center space-x-4 transition-all shadow-sm bg-white dark:bg-zinc-900`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-none ${cat.isAppOnly ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                            <Icon size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-bold text-zinc-800 dark:text-zinc-200">{cat.type}</h3>
                            {cat.isAppOnly ? (
                                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">In-App Payment</span>
                            ) : (
                                <span className="text-xs text-zinc-400">Scan or Enter Amount</span>
                            )}
                        </div>
                        <Icons.ChevronRight className="text-zinc-300 dark:text-zinc-600" />
                    </button>
                )
            })}
        </div>
    </div>
  );

  const renderDetails = () => {
    const cat = SPEND_CATEGORIES.find(c => c.id === selectedCategory);
    if (!cat) return null;
    // @ts-ignore
    const Icon = Icons[cat.icon];
    const isECCash = cat.type === SpendCategoryType.EC_CASH;

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm pb-32 animate-slide-in-right">
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
                {isECCash ? (
                    <>
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">Popular Use Cases</h3>
                            <div className="flex overflow-x-auto space-x-3 pb-4 scrollbar-hide snap-x -mx-2 px-2">
                                {EC_CASH_USE_CASES.map((item) => (
                                    <div key={item.id} className="flex-none w-32 snap-start group relative border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                        <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800">
                                            {/* @ts-ignore */}
                                            {item.src && (
                                                <img 
                                                    // @ts-ignore
                                                    src={item.src} 
                                                    alt={item.label} 
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                            <span className="text-white text-[10px] font-bold leading-tight">{item.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-200 dark:border-zinc-700 mb-4">
                             <div className="flex justify-between items-center mb-2">
                                 <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold">Transfer To</p>
                                 <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 font-bold uppercase">Verified</span>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <div className="bg-white dark:bg-zinc-900 p-2 border border-zinc-100 dark:border-zinc-800">
                                    <Icons.Building2 size={20} className="text-zinc-700 dark:text-zinc-300" />
                                 </div>
                                 <div>
                                     <p className="font-bold text-zinc-800 dark:text-white">HDFC Bank</p>
                                     <p className="text-xs text-zinc-500 dark:text-zinc-400">A/c •••• 4590 | IFSC HDFC00012</p>
                                 </div>
                             </div>
                        </div>
                    </>
                ) : null}

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
                                <option>Tata Sky</option>
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
                            readOnly={isECCash}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`w-full p-4 text-2xl font-bold border-b-2 outline-none text-black dark:text-white ${isECCash ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 focus:border-blue-600 dark:focus:border-blue-500'}`}
                            placeholder="0"
                        />
                        {isECCash && (
                             <div className="mt-2 text-center">
                                 <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                     Repay in time to unlock more.
                                 </p>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Button fullWidth onClick={() => setStep('OFFERS')} disabled={!amount || Number(amount) < 1}>
                    View Bank Offers
                </Button>
            </div>
        </div>
    );
  };

  const renderOffers = () => {
    const offers = getBankOffers();
    const category = SPEND_CATEGORIES.find(c => c.id === selectedCategory);

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pb-20 animate-fade-in">
             <div className="max-w-4xl mx-auto p-4">
                 <div className="flex items-center space-x-2 mb-6 text-zinc-500 dark:text-zinc-400 cursor-pointer" onClick={handleBack}>
                    <Icons.ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Amount</span>
                </div>
                
                <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-1">Repayment Plans</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Tailored for <span className="font-bold text-zinc-700 dark:text-zinc-200">{category?.type}</span>.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offers.map((offer, index) => (
                        <div 
                            key={offer.bankId}
                            onClick={() => setSelectedOffer(offer)}
                            className={`relative bg-white dark:bg-zinc-900 p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${selectedOffer?.bankId === offer.bankId ? 'border-blue-600 ring-4 ring-blue-50 dark:ring-blue-900/30' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                        >
                            {/* Lowest Rate Badge */}
                            {index === 0 && (
                                <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 shadow-sm z-10">
                                    BEST OFFER
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                     <div className="w-10 h-10 p-1 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-800">
                                        <img src={offer.logo} alt={offer.bankName} className="w-full h-full object-contain" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-zinc-800 dark:text-white leading-tight">{offer.bankName}</h3>
                                         <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide text-blue-600 dark:text-blue-400">{offer.plan.title}</p>
                                     </div>
                                </div>
                                {selectedOffer?.bankId === offer.bankId ? (
                                     <Icons.CheckCircle fill="currentColor" size={24} className="text-white bg-blue-600 rounded-none" />
                                ) : (
                                    <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 rounded-none"></div>
                                )}
                            </div>

                            {/* Plan Details Grid */}
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Frequency</p>
                                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{offer.plan.frequency}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Duration</p>
                                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{offer.plan.duration}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Rate (AIR)</p>
                                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{offer.interestRate * 100}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Total Due</p>
                                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">₹{offer.plan.totalPayable}</p>
                                </div>
                            </div>

                            {/* Installment Highlight */}
                            <div className="flex items-baseline justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Installment</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">₹{offer.plan.installmentAmount?.toFixed(0)}</span>
                                    <span className="text-xs text-zinc-400 ml-1">x {offer.plan.installments}</span>
                                </div>
                            </div>
                            
                            {/* INSTANT PROCEED BUTTON IN CARD */}
                            {selectedOffer?.bankId === offer.bankId && (
                                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 animate-fade-in">
                                    <Button 
                                        fullWidth 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStep('KFS');
                                        }} 
                                        size="md" 
                                        className="shadow-md bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Proceed with {offer.bankName}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  const renderKFS = () => {
    if (!selectedOffer) return null;
    const plan = selectedOffer.plan;

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pb-8 animate-fade-in">
            <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                 <div className="flex items-center space-x-2 mb-6 text-zinc-500 dark:text-zinc-400 cursor-pointer" onClick={() => setStep('OFFERS')}>
                    <Icons.ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Offers</span>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                     <img src={selectedOffer.logo} alt="Bank" className="h-8 w-auto" />
                     <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Key Fact Statement</h2>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-700 p-4 space-y-4 mb-6 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Loan Principal</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{plan.principal}</span>
                    </div>
                     
                     <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Interest Amount</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">₹{plan.interestAmount}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Processing Fees</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">₹{plan.fee}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Annual Interest Rate</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{(selectedOffer.interestRate * 100).toFixed(1)}%</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Installments</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{plan.installments} ({plan.frequency})</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Installment Amount</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{plan.installmentAmount?.toFixed(0)}</span>
                    </div>
                    
                    <div className="border-t border-zinc-300 dark:border-zinc-600 pt-3 flex justify-between">
                         <span className="text-zinc-500 dark:text-zinc-400 font-medium">Total Repayment</span>
                         <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">₹{plan.totalPayable}</span>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900 p-2 text-center border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
                        Lender: {selectedOffer.bankName} (RBI Regulated)
                    </div>
                </div>

                <div className="flex items-start space-x-3 mb-6">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded-none" defaultChecked />
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                        I agree to the Terms & Conditions and the KFS above. I authorize {selectedOffer.bankName} to disburse funds and enable auto-debit.
                    </p>
                </div>

                {/* Inline Action Button */}
                <div className="mt-4">
                    <Button fullWidth onClick={handlePaymentProcess} size="lg" className="shadow-lg font-bold">Accept & Get Money</Button>
                </div>
            </div>
        </div>
    )
  };

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

  const renderSuccess = () => {
    return (
        <div className="fixed inset-0 bg-green-50 dark:bg-green-950/50 z-50 overflow-y-auto animate-fade-in">
             <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-6 text-green-600 dark:text-green-400 animate-bounce">
                    <Icons.CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Funds Disbursed!</h2>
                <p className="text-green-700 dark:text-green-300 mb-8">₹{amount} sent to your account via {selectedOffer?.bankName}</p>
                
                {/* Disbursal Receipt - Sharp */}
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
                        <span className="text-zinc-500 dark:text-zinc-400">Time</span>
                        <span className="text-zinc-700 dark:text-zinc-300">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="mt-8 w-full max-w-sm">
                    <Button fullWidth onClick={() => onNavigate('home')}>Back to Home</Button>
                </div>
             </div>
        </div>
    )
  }

  // --- MAIN RENDER ---

  if (step === 'PROCESSING') return renderProcessing();
  if (step === 'SUCCESS') return renderSuccess();
  
  if (selectedCategory !== null) {
      if (step === 'KFS') return renderKFS();
      if (step === 'OFFERS') return renderOffers();
      return renderDetails();
  }

  return (
    <div className="animate-fade-in">
         <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6 px-1">EC <span className="text-emerald-600 dark:text-emerald-500">Duo</span></h2>
         {rootView === 'SELECTION' && renderSelection()}
         {rootView === 'SPEND_LIST' && renderSpendList()}
    </div>
  );
};
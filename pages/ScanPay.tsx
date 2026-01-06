import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { X, CheckCircle, Zap, ArrowLeft, ShieldCheck, RefreshCw, QrCode, ShoppingCart, Fuel, Pill, Tv, Receipt, Smartphone, Calendar, CameraOff, ChevronRight } from 'lucide-react';
import { RepaymentPlan, UserState, SPEND_CATEGORIES, SpendCategoryType } from '../types';

interface ScanPayProps {
    onClose: () => void;
    user?: UserState; 
    balance?: number; // Legacy prop fallback
    initialCategoryId?: number;
}

// Reuse Banks logic
const BANKS = [
  { 
    id: 'hdfc', 
    name: 'HDFC Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg', 
    baseRate: 0.12
  },
  { 
    id: 'sbi', 
    name: 'SBI', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg', 
    baseRate: 0.125
  },
  { 
    id: 'icici', 
    name: 'ICICI', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg', 
    baseRate: 0.14
  },
  { 
    id: 'axis', 
    name: 'Axis', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Axis_Bank_logo.svg', 
    baseRate: 0.15
  }
];

interface BankOffer {
    bankId: string;
    bankName: string;
    logo: string;
    interestRate: number;
    plan: RepaymentPlan;
}

// Icon Mapping helper
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'Fuel': return Fuel;
        case 'Pill': return Pill;
        case 'ShoppingBasket': return ShoppingCart;
        case 'Tv': return Tv;
        case 'Receipt': return Receipt;
        case 'Smartphone': return Smartphone;
        default: return ShoppingCart;
    }
};

export const ScanPay: React.FC<ScanPayProps> = ({ onClose, user, balance: legacyBalance, initialCategoryId }) => {
    // Flow: INPUT (Amount+Cat) -> OFFERS (Inline) -> SCAN -> PROCESSING -> SUCCESS
    const [step, setStep] = useState<'INPUT' | 'SCAN' | 'PROCESSING' | 'SUCCESS'>('INPUT');
    const [amount, setAmount] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialCategoryId || null);
    
    // Inline & Modal State
    const [offersVisible, setOffersVisible] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);
    const [showKFS, setShowKFS] = useState(false);
    
    // KFS State
    const [kfsFrequency, setKfsFrequency] = useState<'WEEKLY' | 'BIWEEKLY'>('WEEKLY');

    // Camera State
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0); 
    const videoRef = useRef<HTMLVideoElement>(null);
    const [detectedMerchant, setDetectedMerchant] = useState<string>('');
    const [processingStep, setProcessingStep] = useState(0);

    // Calculate Balance
    const currentBalance = user ? (user.totalLimit - user.usedAmount) : (legacyBalance || 0);

    // Camera Effect
    useEffect(() => {
        let stream: MediaStream | null = null;
        let isMounted = true;

        if (step === 'SCAN') {
            setCameraError(null);
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                if(isMounted) setCameraError("Camera API not supported in this environment.");
                return;
            }

            const startCamera = async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'environment' } 
                    });
                    
                    if (isMounted && videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err: any) {
                    console.warn("Camera init failed:", err);
                    if (!isMounted) return;
                    setCameraError("Camera unavailable. Use simulation mode.");
                }
            };

            startCamera();
        }

        return () => {
            isMounted = false;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [step, retryCount]);

    // Reset frequency when opening KFS
    useEffect(() => {
        if (showKFS) setKfsFrequency('WEEKLY');
    }, [showKFS]);

    const handleRetryCamera = () => {
        setCameraError(null);
        setRetryCount(prev => prev + 1);
    };

    const handleKFSProceed = () => {
        setShowKFS(false);
        setStep('SCAN');
    };

    const handleScanSuccess = () => {
        const cat = SPEND_CATEGORIES.find(c => c.id === selectedCategoryId);
        setDetectedMerchant(cat ? `Verified ${cat.type} Merchant` : "Manoj Kirana Store");
        setStep('PROCESSING');
        
        setProcessingStep(0);
        let current = 0;
        const interval = setInterval(() => {
            current++;
            setProcessingStep(current);
            if(current >= 5) {
                clearInterval(interval);
                setTimeout(() => {
                    setStep('SUCCESS');
                }, 500);
            }
        }, 800);
    };

    const getOffers = (): BankOffer[] => {
        const principal = Number(amount);
        if(!principal) return [];
        
        const cat = SPEND_CATEGORIES.find(c => c.id === selectedCategoryId);
        
        let planConfig = {
            days: 10,
            installments: 4,
            freq: 'Every 2 Days',
            name: 'Smart Retail Pay',
            desc: 'Quick Repayment'
        };

        if (cat?.type === SpendCategoryType.FUEL) {
            planConfig = { days: 8, installments: 4, freq: 'Every 2 Days', name: 'Smart Fuel 4', desc: 'Refill Now, Pay Later' };
        } else if (cat?.type === SpendCategoryType.GROCERY) {
            planConfig = { days: 9, installments: 3, freq: 'Every 3 Days', name: 'Kitchen Essentials', desc: 'Weekly Stock up' };
        } else if (cat?.type === SpendCategoryType.PHARMA) {
            planConfig = { days: 30, installments: 2, freq: 'Every 15 Days', name: 'Medi-Care Flexi', desc: 'Emergency Support' };
        }

        const offers: BankOffer[] = [];

        BANKS.forEach(bank => {
             const interestAmt = Math.ceil(principal * bank.baseRate * (planConfig.days/365));
             const fee = Math.ceil(principal * 0.01); 
             const total = principal + interestAmt + fee;
             const installmentAmt = Math.ceil(total / planConfig.installments);

            offers.push({
                bankId: bank.id,
                bankName: bank.name,
                logo: bank.logo,
                interestRate: bank.baseRate,
                plan: {
                    id: `${bank.id}_${cat?.type}_plan`,
                    title: planConfig.name,
                    description: planConfig.desc,
                    duration: `${planConfig.days} Days`,
                    interest: `${(bank.baseRate * 100).toFixed(1)}% p.a.`,
                    fee: fee,
                    principal: principal,
                    interestAmount: interestAmt,
                    totalPayable: total,
                    installments: planConfig.installments,
                    installmentAmount: installmentAmt,
                    frequency: planConfig.freq
                }
            });
        });

        return offers.sort((a,b) => a.interestRate - b.interestRate);
    };

    // --- RENDERERS ---

    const renderKFSModal = () => {
        if (!selectedOffer) return null;
        
        // Recalculate based on frequency choice (Local to modal)
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
            <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-md bg-white rounded-t-2xl md:rounded-xl overflow-hidden animate-slide-in-right md:animate-none">
                    <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-zinc-800">Key Fact Statement</h2>
                        <button onClick={() => setShowKFS(false)}><X size={20} className="text-zinc-500" /></button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                         <div className="flex items-center space-x-3 mb-4">
                            <img src={selectedOffer.logo} alt="Bank" className="h-6 w-auto" />
                            <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase">Lender</p>
                                <h3 className="font-bold text-zinc-800">{selectedOffer.bankName}</h3>
                            </div>
                        </div>

                        {/* FREQUENCY TOGGLE */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-3 block">Repayment Frequency</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setKfsFrequency('WEEKLY')}
                                    className={`p-3 border-2 rounded text-center transition-all relative ${kfsFrequency === 'WEEKLY' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-zinc-200 text-zinc-600'}`}
                                >
                                    {kfsFrequency === 'WEEKLY' && <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">BEST RATE</div>}
                                    <span className="block font-bold text-sm">Weekly</span>
                                    <span className="text-[10px]">4 Payments</span>
                                </button>
                                <button 
                                    onClick={() => setKfsFrequency('BIWEEKLY')}
                                    className={`p-3 border-2 rounded text-center transition-all ${kfsFrequency === 'BIWEEKLY' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-zinc-200 text-zinc-600'}`}
                                >
                                    <span className="block font-bold text-sm">Bi-Weekly</span>
                                    <span className="text-[10px]">2 Payments</span>
                                </button>
                            </div>
                        </div>

                        <div className="border border-zinc-200 p-4 space-y-4 mb-6 bg-zinc-50 rounded">
                            <div className="flex justify-between text-sm bg-yellow-50 p-2 border border-yellow-100 rounded">
                                <span className="text-zinc-600 font-bold">Merchant</span>
                                <span className="font-bold text-zinc-800 uppercase text-xs bg-yellow-200 px-2 py-0.5 rounded">To Be Scanned</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Loan Principal</span>
                                <span className="font-bold text-zinc-800">₹{principal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Processing Fee</span>
                                <span className="font-medium text-zinc-800">₹{fee}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-bold text-blue-800">APR</span>
                                <span className="font-bold text-blue-800">{(effectiveInterestRate * 100).toFixed(1)}%</span>
                            </div>
                            <div className="border-t border-zinc-200 pt-3 flex justify-between">
                                <span className="text-zinc-500 font-medium">Total Repayment</span>
                                <span className="font-bold text-blue-600 text-lg">₹{totalPayable}</span>
                            </div>
                        </div>

                         {/* SCHEDULE PREVIEW */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Schedule</label>
                                    <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">Starts in {intervalDays} days</span>
                            </div>
                            <div className="bg-white border border-zinc-200 text-sm rounded overflow-hidden">
                                {schedule.map((item, idx) => (
                                    <div key={item.id} className={`flex justify-between p-2 ${idx !== schedule.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                                        <span className="text-zinc-500 text-xs">Inst {item.id} <span className="mx-1">•</span> {item.date}</span>
                                        <span className="font-bold text-zinc-800">₹{item.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 mb-6">
                            <div className="mt-1"><ShieldCheck className="text-emerald-500" size={18}/></div>
                            <p className="text-xs text-zinc-600 leading-snug">
                                I accept the KFS and authorize the LSP to facilitate the loan from the RE.
                            </p>
                        </div>

                        <Button fullWidth onClick={handleKFSProceed} size="lg" className="shadow-lg font-bold flex items-center justify-center gap-2">
                            <QrCode size={18} /> Agree & Scan to Pay
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderAmount = () => {
        const activeCat = SPEND_CATEGORIES.find(c => c.id === selectedCategoryId);
        const CatIcon = activeCat ? getIcon(activeCat.icon) : ShoppingCart;

        return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col h-[100dvh] animate-fade-in">
             {/* Header */}
            <div className="relative p-4 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
                 <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <QrCode size={18} />
                     </div>
                     <span className="font-bold text-zinc-800">Scan & Pay</span>
                 </div>
                 <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600"><X size={24} /></button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
                 
                 {/* Amount Input - Centered & Large - Always Visible */}
                 <div className="mb-8 mt-4 text-center w-full max-w-xs transition-all duration-300">
                     {activeCat && !offersVisible && (
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                             <CatIcon size={32} />
                        </div>
                     )}
                     
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-4">Enter Amount</label>
                     <div className={`flex justify-center items-center border-b-2 pb-2 ${amount ? 'border-blue-600' : 'border-zinc-200'}`}>
                         <span className="text-4xl font-bold text-zinc-800 mr-2">₹</span>
                         <input 
                             type="number" 
                             value={amount}
                             readOnly={offersVisible}
                             onChange={(e) => setAmount(e.target.value)}
                             className={`text-5xl font-bold w-40 text-center outline-none bg-transparent ${offersVisible ? 'text-zinc-400' : 'text-black'}`}
                             placeholder="0"
                             autoFocus={!offersVisible}
                         />
                     </div>
                     <p className="text-xs text-zinc-400 mt-4">Available Limit: ₹{currentBalance}</p>
                 </div>

                 {/* CATEGORY GRID - Only visible if offers NOT visible */}
                 {!initialCategoryId && !offersVisible && (
                    <div className="mb-6 w-full max-w-md animate-fade-in">
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-3 text-center">Select Purpose</label>
                        <div className="grid grid-cols-3 gap-3">
                            {SPEND_CATEGORIES.filter(c => !c.isAppOnly).map(cat => {
                                const Icon = getIcon(cat.icon);
                                const isSelected = selectedCategoryId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategoryId(cat.id)}
                                        className={`p-3 flex flex-col items-center justify-center border-2 transition-all rounded-lg ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-zinc-100 bg-zinc-50 text-zinc-500 hover:bg-zinc-100'}`}
                                    >
                                        <Icon size={20} className="mb-1" />
                                        <span className="text-[10px] font-bold">{cat.type}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                 )}

                 {/* OFFERS LIST - Inline Expansion */}
                 {offersVisible && (
                     <div className="w-full max-w-md animate-fade-in border-t border-zinc-100 pt-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-zinc-800">Select Lender Offer</h3>
                            <button onClick={() => setOffersVisible(false)} className="text-xs text-blue-600 font-bold">Change Amount</button>
                         </div>
                         <div className="space-y-3">
                            {getOffers().map((offer, index) => (
                                <div 
                                    key={offer.bankId}
                                    onClick={() => {
                                        setSelectedOffer(offer);
                                        setShowKFS(true);
                                    }}
                                    className="bg-white p-4 border border-zinc-200 rounded-lg shadow-sm hover:border-blue-500 cursor-pointer flex justify-between items-center group"
                                >
                                    <div className="flex items-center space-x-3">
                                         <div className="w-10 h-10 p-1 border border-zinc-100 rounded bg-white">
                                            <img src={offer.logo} alt={offer.bankName} className="w-full h-full object-contain" />
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-sm text-zinc-800">{offer.bankName}</h4>
                                             <p className="text-xs text-zinc-500">{offer.plan.title}</p>
                                         </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-blue-600">₹{offer.plan.installmentAmount?.toFixed(0)}</span>
                                        <span className="text-[10px] text-zinc-400">per installment</span>
                                    </div>
                                </div>
                            ))}
                         </div>
                     </div>
                 )}
            </div>

            {/* Sticky Footer Button - Hide if offers are visible (offers act as buttons) */}
            {!offersVisible && (
                <div className="p-4 bg-white border-t border-zinc-100 pb-[calc(1rem+env(safe-area-inset-bottom))] shrink-0">
                    <div className="max-w-md mx-auto">
                        <Button 
                            fullWidth 
                            onClick={() => setOffersVisible(true)} 
                            disabled={!amount || !selectedCategoryId || Number(amount) > currentBalance || Number(amount) <= 0}
                            size="lg"
                        >
                            {!selectedCategoryId ? 'Select Purpose first' : 'Find Lender Offers'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
        );
    };

    const renderScan = () => (
        <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in">
            <div className="flex justify-between items-center p-4 text-white bg-black">
                <span className="font-bold flex items-center gap-2"><ShieldCheck size={18} className="text-green-500"/> Scan Merchant QR</span>
                <button onClick={onClose}><X size={24} /></button>
            </div>
            
            {/* Context Overlay */}
            <div className="absolute top-14 left-0 right-0 bg-zinc-800/80 p-3 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                 <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Paying</p>
                 <div className="flex items-baseline gap-1">
                    <span className="text-lg text-white">₹</span>
                    <span className="text-2xl font-bold text-white">{amount}</span>
                 </div>
                 <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                    <Zap size={10} className="text-yellow-400 fill-current" />
                    Powered by {selectedOffer?.bankName}
                 </p>
            </div>

            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {!cameraError ? (
                     <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60"></video>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-zinc-900 z-30">
                        <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <CameraOff size={32} />
                        </div>
                        <p className="text-white font-bold mb-2 text-lg">
                           {cameraError === "Permission denied. Use simulation mode." ? "Permission Denied" : "Camera Unavailable"}
                        </p>
                        <p className="text-sm text-zinc-400 max-w-xs mb-6">{cameraError}</p>
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button 
                                onClick={handleRetryCamera} 
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 text-white rounded font-medium hover:bg-zinc-700 transition-colors w-full"
                            >
                                <RefreshCw size={16} /> Retry Camera
                            </button>
                            <Button 
                                onClick={handleScanSuccess} 
                                variant="primary"
                                fullWidth
                            >
                                Simulate Scan
                            </Button>
                        </div>
                    </div>
                )}
                
                {/* Scanner Frame */}
                {!cameraError && (
                    <div className="relative w-64 h-64 border-4 border-white z-10 flex flex-col items-center justify-center">
                            <div className="w-60 h-0.5 bg-red-500 absolute top-1/2 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                            <p className="text-white text-xs mt-2 bg-black/50 px-2 py-1 absolute bottom-2">Align QR code</p>
                    </div>
                )}
            </div>
            
            {!cameraError && (
                <div className="p-6 bg-white pb-[env(safe-area-inset-bottom)]">
                    <Button fullWidth onClick={handleScanSuccess}>Simulate Scan Success</Button>
                </div>
            )}
        </div>
    );

    const renderProcessing = () => (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-6 animate-fade-in">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-zinc-100 rounded-full"></div>
                    <div className="w-24 h-24 border-4 border-t-emerald-600 rounded-full animate-spin absolute top-0 left-0"></div>
                    <ShieldCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-600" size={32} />
                </div>
                <div className="text-center max-w-xs">
                    <h2 className="text-xl font-bold text-zinc-800 mb-4">Verifying Transaction</h2>
                    <div className="space-y-3 text-left bg-zinc-50 p-4 rounded border border-zinc-200">
                        <div className="flex items-center gap-3">
                             <div className={`w-4 h-4 rounded-full flex items-center justify-center ${processingStep >= 1 ? 'bg-green-500 text-white' : 'bg-zinc-200'}`}>
                                 {processingStep >= 1 && <CheckCircle size={10} />}
                             </div>
                             <span className={`text-sm ${processingStep >= 1 ? 'text-zinc-800 font-bold' : 'text-zinc-400'}`}>Checking Merchant Category...</span>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className={`w-4 h-4 rounded-full flex items-center justify-center ${processingStep >= 2 ? 'bg-green-500 text-white' : 'bg-zinc-200'}`}>
                                 {processingStep >= 2 && <CheckCircle size={10} />}
                             </div>
                             <span className={`text-sm ${processingStep >= 2 ? 'text-zinc-800 font-bold' : 'text-zinc-400'}`}>Connecting to {selectedOffer?.bankName}...</span>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className={`w-4 h-4 rounded-full flex items-center justify-center ${processingStep >= 3 ? 'bg-green-500 text-white' : 'bg-zinc-200'}`}>
                                 {processingStep >= 3 && <CheckCircle size={10} />}
                             </div>
                             <span className={`text-sm ${processingStep >= 3 ? 'text-zinc-800 font-bold' : 'text-zinc-400'}`}>Verifying Limits...</span>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className={`w-4 h-4 rounded-full flex items-center justify-center ${processingStep >= 4 ? 'bg-green-500 text-white' : 'bg-zinc-200'}`}>
                                 {processingStep >= 4 && <CheckCircle size={10} />}
                             </div>
                             <span className={`text-sm ${processingStep >= 4 ? 'text-zinc-800 font-bold' : 'text-zinc-400'}`}>Bank Confirmation Received...</span>
                        </div>
                         <div className="flex items-center gap-3">
                             <div className={`w-4 h-4 rounded-full flex items-center justify-center ${processingStep >= 5 ? 'bg-green-500 text-white' : 'bg-zinc-200'}`}>
                                 {processingStep >= 5 && <CheckCircle size={10} />}
                             </div>
                             <span className={`text-sm ${processingStep >= 5 ? 'text-zinc-800 font-bold' : 'text-zinc-400'}`}>Disbursing to Merchant...</span>
                        </div>
                    </div>
                </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="fixed inset-0 bg-green-50 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 flex items-center justify-center mb-6 text-green-600 animate-bounce">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
                <p className="text-green-700 mb-8">₹{amount} paid to {detectedMerchant}</p>
                
                <div className="w-full max-w-sm bg-white p-4 space-y-2 mb-4 border border-green-200 shadow-sm text-left relative">
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 font-bold">PAID</div>
                    <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wide border-b border-zinc-100 pb-2">Transaction Receipt</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Ref ID</span>
                        <span className="font-mono text-zinc-700">TXN_882910</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Merchant</span>
                        <span className="text-zinc-700 font-bold">{detectedMerchant}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Bank</span>
                        <span className="text-zinc-700 font-medium">{selectedOffer?.bankName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Status</span>
                        <span className="text-green-600 font-bold">Confirmed by Bank</span>
                    </div>
                </div>

                <div className="w-full max-w-sm bg-white border-l-4 border-blue-600 p-4 shadow-sm text-left">
                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-4 flex items-center">
                        <Calendar className="mr-2" size={14}/> 
                        Repayment Schedule
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-xs text-zinc-500">Plan Type</div>
                        <div className="text-sm font-bold text-zinc-700">{selectedOffer?.plan.title} ({kfsFrequency})</div>
                    </div>

                    <div className="bg-zinc-50 p-3 border border-zinc-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-zinc-800">Next Deduction</span>
                            <span className="text-sm font-bold text-zinc-800">₹{selectedOffer?.plan.installmentAmount?.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-zinc-500">
                            <span>Frequency: {kfsFrequency === 'WEEKLY' ? 'Weekly' : 'Bi-Weekly'}</span>
                            <span className="flex items-center text-blue-600"><Zap size={10} className="mr-1"/> Auto-Pay Active</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 w-full max-w-sm">
                    <Button fullWidth onClick={onClose}>Done</Button>
                </div>
        </div>
    );

    return (
        <>
            {step === 'INPUT' && renderAmount()}
            {step === 'SCAN' && renderScan()}
            {step === 'PROCESSING' && renderProcessing()}
            {step === 'SUCCESS' && renderSuccess()}
            {showKFS && renderKFSModal()}
        </>
    );
};
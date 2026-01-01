import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { Camera, X, CheckCircle, Smartphone, Calendar, Zap, Building2, ArrowLeft, AlertCircle } from 'lucide-react';
import { RepaymentPlan } from '../types';

interface ScanPayProps {
    onClose: () => void;
    balance: number;
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
    name: 'State Bank of India', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg', 
    baseRate: 0.125
  },
  { 
    id: 'icici', 
    name: 'ICICI Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg', 
    baseRate: 0.14
  },
  { 
    id: 'axis', 
    name: 'Axis Bank', 
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

export const ScanPay: React.FC<ScanPayProps> = ({ onClose, balance }) => {
    const [step, setStep] = useState<'SCAN' | 'AMOUNT' | 'OFFERS' | 'KFS' | 'PROCESSING' | 'SUCCESS'>('SCAN');
    const [amount, setAmount] = useState('');
    const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (step === 'SCAN') {
            // Request camera
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error("Camera error:", err));
        }
        return () => {
            // Cleanup stream
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [step]);

    const handleScanSimulate = () => {
        setStep('AMOUNT');
    };

    const handleCheckOffers = () => {
        setStep('OFFERS');
    };

    const handleKFSConfirm = () => {
        setStep('PROCESSING');
        setTimeout(() => {
            setStep('SUCCESS');
        }, 2000);
    };

    const getOffers = (): BankOffer[] => {
        const principal = Number(amount);
        if(!principal) return [];
        
        const offers: BankOffer[] = [];
        
        // Scan & Pay Plan: Smart Retail (Frequent)
        const days = 10;
        const installments = 4; // Every 2-3 days

        BANKS.forEach(bank => {
             const interestAmt = Math.ceil(principal * bank.baseRate * (days/365));
             const fee = 0; 
             const total = principal + interestAmt + fee;
             const installmentAmt = Math.ceil(total / installments);

            offers.push({
                bankId: bank.id,
                bankName: bank.name,
                logo: bank.logo,
                interestRate: bank.baseRate,
                plan: {
                    id: `${bank.id}_smart_retail`,
                    title: 'Smart Retail Pay',
                    description: 'Every 2 days',
                    duration: '10 Days',
                    interest: `${(bank.baseRate * 100).toFixed(1)}% p.a.`,
                    fee: fee,
                    principal: principal,
                    interestAmount: interestAmt,
                    totalPayable: total,
                    installments: installments,
                    installmentAmount: installmentAmt,
                    frequency: 'Every 2 Days'
                }
            });
        });

        // Lowest Rate First
        return offers.sort((a,b) => a.interestRate - b.interestRate);
    };

    const renderScan = () => (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 text-white">
                <span className="font-bold">Scan QR</span>
                <button onClick={onClose}><X size={24} /></button>
            </div>
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60"></video>
                {/* Scanner Frame - Sharp */}
                <div className="relative w-64 h-64 border-4 border-white z-10 flex flex-col items-center justify-center">
                        <div className="w-60 h-0.5 bg-red-500 absolute top-1/2 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        <p className="text-white text-xs mt-2 bg-black/50 px-2 py-1">Align QR code within frame</p>
                </div>
            </div>
            <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-zinc-500 text-sm">Available Limit</span>
                    <span className="font-bold text-zinc-800">₹{balance}</span>
                </div>
                <Button fullWidth onClick={handleScanSimulate}>Simulate Scan Success</Button>
            </div>
        </div>
    );

    const renderAmount = () => (
        <div className="min-h-screen bg-zinc-50 p-4 pt-10">
            <div className="max-w-md mx-auto bg-white p-6 relative shadow-sm border border-zinc-200">
                    <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"><X size={24} /></button>
                    
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 flex items-center justify-center mb-2">
                            <span className="font-bold text-blue-700 text-xl">MK</span>
                        </div>
                        <h2 className="text-xl font-bold text-zinc-800">Manoj Kirana Store</h2>
                        <p className="text-zinc-500 text-sm">rajesh@upi</p>
                        <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 font-bold uppercase mt-2">Verified Merchant</span>
                    </div>

                    <div className="mb-6">
                        <label className="block text-center text-sm font-medium text-zinc-500 mb-2">Enter Amount</label>
                        <div className="flex justify-center items-center border-b-2 border-zinc-200 focus-within:border-blue-600 pb-2">
                            <span className="text-3xl font-bold text-zinc-800 mr-1">₹</span>
                            <input 
                                type="number" 
                                autoFocus
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-4xl font-bold text-black w-32 text-center outline-none bg-transparent"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 mb-6 flex justify-between items-center border border-blue-100">
                        <span className="text-xs text-blue-800 font-medium">Available Limit: ₹{balance}</span>
                        {Number(amount) > balance && <span className="text-xs text-red-600 font-bold">Insufficient Limit</span>}
                    </div>

                    <Button fullWidth onClick={handleCheckOffers} disabled={!amount || Number(amount) > balance || Number(amount) <= 0}>
                        Check Repayment Plans
                    </Button>
            </div>
        </div>
    );

    const renderOffers = () => {
        const offers = getOffers();
        return (
            <div className="min-h-screen bg-zinc-50 pb-20">
                <div className="max-w-4xl mx-auto p-4 pt-10">
                    <div className="flex items-center space-x-2 mb-6 text-zinc-500 cursor-pointer" onClick={() => setStep('AMOUNT')}>
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back</span>
                    </div>

                    <h2 className="text-xl font-bold text-zinc-800 mb-1">Select Banking Partner</h2>
                    <p className="text-sm text-zinc-500 mb-6">Retail specific repayment plans.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {offers.map((offer, index) => (
                            <div 
                                key={offer.bankId}
                                onClick={() => setSelectedOffer(offer)}
                                className={`relative bg-white p-5 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${selectedOffer?.bankId === offer.bankId ? 'border-blue-600 ring-4 ring-blue-50' : 'border-zinc-200 hover:border-zinc-300'}`}
                            >
                                {index === 0 && (
                                    <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 shadow-sm z-10">
                                        BEST OFFER
                                    </div>
                                )}
                                
                                <div className="flex items-start justify-between mb-4">
                                     <div className="flex items-center space-x-3">
                                         <div className="w-10 h-10 p-1 border border-zinc-100 bg-white">
                                            <img src={offer.logo} alt={offer.bankName} className="w-full h-full object-contain" />
                                         </div>
                                         <div>
                                             <h3 className="font-bold text-zinc-800 leading-tight">{offer.bankName}</h3>
                                             <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide text-blue-600">{offer.plan.title}</p>
                                         </div>
                                    </div>
                                    {selectedOffer?.bankId === offer.bankId ? (
                                        <CheckCircle fill="currentColor" size={24} className="text-white bg-blue-600 rounded-none" />
                                    ) : (
                                        <div className="w-6 h-6 border-2 border-zinc-300 rounded-none"></div>
                                    )}
                                </div>

                                {/* Plan Details Grid */}
                                <div className="bg-zinc-50 p-3 grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold">Frequency</p>
                                        <p className="text-sm font-bold text-zinc-700">{offer.plan.frequency}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold">Duration</p>
                                        <p className="text-sm font-bold text-zinc-700">{offer.plan.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold">Rate (AIR)</p>
                                        <p className="text-sm font-bold text-zinc-700">{offer.interestRate * 100}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold">Total Due</p>
                                        <p className="text-sm font-bold text-zinc-700">₹{offer.plan.totalPayable}</p>
                                    </div>
                                </div>

                                {/* Installment Highlight */}
                                <div className="flex items-baseline justify-between pt-2 border-t border-zinc-100">
                                    <span className="text-xs text-zinc-500 font-medium">Installment</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-zinc-900">₹{offer.plan.installmentAmount?.toFixed(0)}</span>
                                        <span className="text-xs text-zinc-400 ml-1">x {offer.plan.installments}</span>
                                    </div>
                                </div>

                                {/* INSTANT PROCEED BUTTON IN CARD */}
                                {selectedOffer?.bankId === offer.bankId && (
                                    <div className="mt-4 pt-4 border-t border-zinc-100 animate-fade-in">
                                        <Button 
                                            fullWidth 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setStep('KFS');
                                            }} 
                                            size="md" 
                                            className="shadow-md bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            Pay with {offer.bankName}
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
            <div className="min-h-screen bg-zinc-50 p-4 pt-10 pb-8">
                <div className="max-w-md mx-auto bg-white p-6 relative shadow-sm border border-zinc-200">
                    <div className="flex items-center space-x-2 mb-6 text-zinc-500 cursor-pointer" onClick={() => setStep('OFFERS')}>
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back to Offers</span>
                    </div>

                    <div className="flex items-center space-x-3 mb-6">
                        <img src={selectedOffer.logo} alt="Bank" className="h-6 w-auto" />
                        <h2 className="text-xl font-bold text-zinc-800">Key Fact Statement</h2>
                    </div>

                    <div className="border border-zinc-200 p-4 space-y-4 mb-6 bg-zinc-50">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Merchant</span>
                            <span className="font-bold text-zinc-800">Manoj Kirana Store</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Loan Principal</span>
                            <span className="font-bold text-zinc-800">₹{plan.principal}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Interest</span>
                            <span className="font-medium text-zinc-800">₹{plan.interestAmount}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Rate (AIR)</span>
                            <span className="font-medium text-zinc-800">{(selectedOffer.interestRate * 100).toFixed(1)}%</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Auto Debits</span>
                            <span className="font-bold text-zinc-800">{plan.installments}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Installment Amount</span>
                            <span className="font-bold text-zinc-800">₹{plan.installmentAmount?.toFixed(0)}</span>
                        </div>
                        
                        <div className="border-t border-zinc-200 pt-3 flex justify-between">
                            <span className="text-zinc-500">Total Repayment</span>
                            <span className="font-bold text-blue-600 text-lg">₹{plan.totalPayable}</span>
                        </div>
                        
                        <div className="bg-yellow-50 p-2 text-center border border-yellow-200">
                            <span className="text-xs text-yellow-800 font-medium">
                                {plan.frequency} Auto-Debit Enabled
                            </span>
                        </div>

                        <div className="bg-white p-2 text-[10px] text-zinc-500 border border-zinc-200">
                            Lender: {selectedOffer.bankName} (RBI Regulated)
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 mb-6">
                        <input type="checkbox" className="mt-1 w-5 h-5 rounded-none" defaultChecked />
                        <p className="text-xs text-zinc-600 leading-snug">
                            I agree to the Terms & Conditions and KFS. I authorize the disbursement to Manoj Kirana Store.
                        </p>
                    </div>

                    {/* Inline Action Button */}
                    <div className="mt-4">
                        <Button fullWidth onClick={handleKFSConfirm} size="lg" className="shadow-lg font-bold">Confirm & Pay</Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderProcessing = () => (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-6 animate-fade-in">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-zinc-100 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
                    <Building2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-zinc-800">Processing Payment...</h2>
                    <p className="text-zinc-500 mt-2 text-sm">Disbursing via {selectedOffer?.bankName}</p>
                </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="fixed inset-0 bg-green-50 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 flex items-center justify-center mb-6 text-green-600 animate-bounce">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
                <p className="text-green-700 mb-8">₹{amount} paid to Manoj Kirana Store</p>
                
                {/* Disbursal Receipt */}
                <div className="w-full max-w-sm bg-white p-4 space-y-2 mb-4 border border-green-200 shadow-sm text-left relative">
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 font-bold">PAID</div>
                    <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wide border-b border-zinc-100 pb-2">Transaction Receipt</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Ref ID</span>
                        <span className="font-mono text-zinc-700">TXN_882910</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Bank</span>
                        <span className="text-zinc-700 font-medium">{selectedOffer?.bankName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Time</span>
                        <span className="text-zinc-700">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Repayment Schedule */}
                <div className="w-full max-w-sm bg-white border-l-4 border-blue-600 p-4 shadow-sm text-left">
                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-4 flex items-center">
                        <Calendar className="mr-2" size={14}/> 
                        Repayment Schedule
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-xs text-zinc-500">Plan Type</div>
                        <div className="text-sm font-bold text-zinc-700">{selectedOffer?.plan.title}</div>
                    </div>

                    <div className="bg-zinc-50 p-3 border border-zinc-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-zinc-800">Next Deduction</span>
                            <span className="text-sm font-bold text-zinc-800">₹{selectedOffer?.plan.installmentAmount?.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-zinc-500">
                            <span>Frequency: {selectedOffer?.plan.frequency}</span>
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
            {step === 'SCAN' && renderScan()}
            {step === 'AMOUNT' && renderAmount()}
            {step === 'OFFERS' && renderOffers()}
            {step === 'KFS' && renderKFS()}
            {step === 'PROCESSING' && renderProcessing()}
            {step === 'SUCCESS' && renderSuccess()}
        </>
    );
};
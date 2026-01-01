import React, { useState, useEffect } from 'react';
import { OnboardingStep, UserState } from '../types';
import { Button } from '../components/Button';
import { ShieldCheck, CheckCircle, Upload, Camera, Loader2, AlertCircle, Lock, Fingerprint, IndianRupee } from 'lucide-react';

interface OnboardingProps {
  initialPhone?: string;
  onComplete: (user: UserState) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialPhone }) => {
  // If phone is passed, we skip PHONE_ENTRY and go straight to DETAILS
  const [step, setStep] = useState<OnboardingStep>(
      initialPhone ? OnboardingStep.DETAILS : OnboardingStep.PHONE_ENTRY
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [phone, setPhone] = useState(initialPhone || '');
  const [password, setPassword] = useState(''); // PIN/Password
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [name, setName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [email, setEmail] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Validation & Navigation Handler
  const handleNext = async () => {
    setErrors({}); // Clear previous errors
    let isValid = true;
    const newErrors: {[key: string]: string} = {};

    if (step === OnboardingStep.DETAILS) {
        // Combined Validation
        if (name.trim().length < 3) {
            newErrors.name = "Enter full name as per PAN.";
            isValid = false;
        }
        // Validate Aadhaar (strip spaces first)
        const cleanAadhaar = aadhaar.replace(/\s/g, '');
        if (!/^\d{12}$/.test(cleanAadhaar)) {
            newErrors.aadhaar = "Aadhaar must be 12 digits.";
            isValid = false;
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
            newErrors.pan = "Invalid PAN format.";
            isValid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email.";
            isValid = false;
        }
    } else if (step === OnboardingStep.CONSENT) {
        if (!consentGiven) {
            newErrors.consent = "Please authorize to proceed.";
            isValid = false;
        }
    } else if (step === OnboardingStep.SECURITY) {
        if (password.length < 4) {
            newErrors.password = "Enter a 4-6 digit secure PIN.";
            isValid = false;
        }
    }

    if (!isValid) {
        setErrors(newErrors);
        return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (step === OnboardingStep.DETAILS) {
          setStep(OnboardingStep.CONSENT);
      } else if (step === OnboardingStep.CONSENT) {
          setStep(OnboardingStep.SECURITY);
      } else if (step === OnboardingStep.SECURITY) {
          handleComplete();
      }
    }, 800);
  };

  const handleComplete = () => {
     onComplete({
        isAuth: true,
        isOnboarded: true,
        balance: 800,
        totalLimit: 1000,
        usedAmount: 200,
        name: name || 'Rajesh Kumar',
        phone: phone,
        pin: password
     });
  };

  const renderProgress = () => {
    const currentProgressIdx = 
        step === OnboardingStep.PHONE_ENTRY ? 0 :
        step === OnboardingStep.DETAILS ? 1 :
        step === OnboardingStep.CONSENT ? 2 : 3;
    
    const totalSteps = 4;
    const progress = ((currentProgressIdx + 1) / totalSteps) * 100;
    
    return (
        <div className="w-full bg-zinc-200 h-1 mb-6">
            <div className="bg-emerald-600 h-1 transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
    );
  };

  const renderStep = () => {
    switch(step) {
        case OnboardingStep.PHONE_ENTRY:
            return (
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-zinc-800 tracking-tight">Welcome</h2>
                        <p className="text-zinc-600 mt-2">Enter mobile number to begin.</p>
                    </div>
                    {/* Simplified for fallback if accessed directly without landing */}
                    <Button fullWidth onClick={() => setStep(OnboardingStep.DETAILS)} size="lg">Continue</Button>
                </div>
            );
        
        // Combined Registration Step
        case OnboardingStep.DETAILS:
             return (
                <div className="space-y-6">
                     <div className="text-center mb-6">
                        <h2 className="text-2xl font-extrabold text-zinc-800 tracking-tight">Complete Profile</h2>
                        <p className="text-zinc-600 text-sm mt-1">One-time details for KYC & approval.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors({...errors, name: ''});
                                }}
                                className={`w-full p-3 bg-white border-2 outline-none text-black transition-colors ${errors.name ? 'border-red-500' : 'border-zinc-200 focus:border-emerald-600'}`}
                                placeholder="Rajesh Kumar"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                         {/* Email */}
                         <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email ID</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if(errors.email) setErrors({...errors, email: ''});
                                }}
                                className={`w-full p-3 bg-white border-2 border-zinc-200 focus:border-emerald-600 outline-none text-black ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="rajesh@example.com"
                            />
                             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Aadhaar */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Aadhaar Number</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={aadhaar}
                                    maxLength={14} // 12 digits + 2 spaces
                                    onChange={(e) => {
                                        // Strip non-digits
                                        let val = e.target.value.replace(/\D/g, '');
                                        
                                        // Limit to 12 digits
                                        if (val.length > 12) val = val.substring(0, 12);
                                        
                                        // Add spaces every 4 characters
                                        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                                        
                                        setAadhaar(formatted);
                                        if (errors.aadhaar) setErrors({...errors, aadhaar: ''});
                                    }}
                                    className={`w-full p-3 bg-white border-2 outline-none text-black transition-colors ${errors.aadhaar ? 'border-red-500' : 'border-zinc-200 focus:border-emerald-600'}`}
                                    placeholder="0000 0000 0000"
                                />
                                {aadhaar.replace(/\s/g, '').length === 12 && <ShieldCheck className="absolute right-3 top-3 text-emerald-600" size={20} />}
                            </div>
                            {errors.aadhaar && <p className="text-red-500 text-xs mt-1">{errors.aadhaar}</p>}
                        </div>

                        {/* PAN */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">PAN Number</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={pan}
                                    maxLength={10}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase();
                                        if (val.length <= 10) {
                                            setPan(val);
                                            if (errors.pan) setErrors({...errors, pan: ''});
                                        }
                                    }}
                                    className={`w-full p-3 bg-white border-2 outline-none text-black transition-colors uppercase ${errors.pan ? 'border-red-500' : 'border-zinc-200 focus:border-emerald-600'}`}
                                    placeholder="ABCDE1234F"
                                />
                                {pan.length === 10 && <ShieldCheck className="absolute right-3 top-3 text-emerald-600" size={20} />}
                            </div>
                            {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <Button fullWidth onClick={handleNext} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Submit & Proceed'}
                        </Button>
                    </div>
                </div>
             );

        case OnboardingStep.CONSENT:
             return (
                 <div className="space-y-6">
                     <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                            <IndianRupee size={32} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-zinc-800 tracking-tight">Enable Auto-Pay</h2>
                        <p className="text-zinc-600 text-sm mt-1">Never miss a repayment deadline.</p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-none">
                        <h3 className="font-bold text-zinc-800 mb-2">UPI Auto-Debit Mandate</h3>
                        <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                            I hereby authorize EC1000 Duo (via SafeLend NBFC) to debit my linked bank account for repayments as per the schedule chosen during transactions. Max limit: ₹5000.
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-zinc-400">
                            <ShieldCheck size={14} />
                            <span>NPCI Approved Mandate</span>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                         <input 
                            type="checkbox" 
                            id="consent" 
                            className="w-5 h-5 mt-0.5 rounded-none"
                            checked={consentGiven}
                            onChange={(e) => {
                                setConsentGiven(e.target.checked);
                                if(errors.consent) setErrors({...errors, consent: ''});
                            }}
                         />
                         <label htmlFor="consent" className="text-sm text-zinc-700 font-medium cursor-pointer">
                             I agree to the Terms & Conditions and authorize UPI Auto-Debit.
                         </label>
                    </div>
                    {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}

                    <div className="pt-4">
                        <Button fullWidth onClick={handleNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Agree & Continue'}
                        </Button>
                    </div>
                 </div>
             );

        case OnboardingStep.SECURITY:
            return (
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-zinc-800 tracking-tight">Secure Access</h2>
                        <p className="text-zinc-600 mt-2">Set a PIN for quick login.</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wide">Create 4-Digit PIN</label>
                        <div className={`flex border-2 transition-colors items-center bg-white ${errors.password ? 'border-red-500' : 'border-zinc-300 focus-within:border-emerald-600'}`}>
                            <div className="p-4 text-zinc-400">
                                <Lock size={20} />
                            </div>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 4) {
                                        setPassword(val);
                                        if (errors.password) setErrors({...errors, password: ''});
                                    }
                                }}
                                className="flex-1 p-4 bg-transparent outline-none text-lg text-black tracking-[0.5em] placeholder:tracking-normal"
                                placeholder="••••"
                                maxLength={4}
                            />
                        </div>
                        {errors.password && (
                            <div className="flex items-center mt-2 text-red-500 text-sm">
                                <AlertCircle size={14} className="mr-1" />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    {/* Biometric Toggle Option */}
                    <div className="bg-zinc-50 p-4 border border-zinc-200 flex items-center justify-between cursor-pointer" onClick={() => setBiometricEnabled(!biometricEnabled)}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${biometricEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-200 text-zinc-500'}`}>
                                <Fingerprint size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-zinc-800 text-sm">Enable Biometric</p>
                                <p className="text-xs text-zinc-500">Use fingerprint for faster login</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${biometricEnabled ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    <Button fullWidth onClick={handleNext} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Finish & Go to Home'}
                    </Button>
                </div>
            );

        default:
            return null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-0 md:p-4">
      <div className="w-full max-w-md bg-white p-8 md:border border-zinc-200 shadow-none min-h-screen md:min-h-0">
        {renderProgress()}
        {renderStep()}
      </div>
    </div>
  );
};
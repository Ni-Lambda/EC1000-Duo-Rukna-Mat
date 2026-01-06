import React, { useState, useEffect } from 'react';
import { OnboardingStep, UserState } from '../types';
import { Button } from '../components/Button';
import { ShieldCheck, CheckCircle, Upload, Camera, Loader2, AlertCircle, Lock, Fingerprint, IndianRupee, Database, Server, Zap, Scale, Briefcase } from 'lucide-react';

interface OnboardingProps {
  initialPhone?: string;
  onComplete: (user: UserState) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialPhone }) => {
  // If phone is passed, we skip PHONE_ENTRY and go straight to CONSENT (was DETAILS)
  const [step, setStep] = useState<OnboardingStep>(
      initialPhone ? OnboardingStep.CONSENT : OnboardingStep.PHONE_ENTRY
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // RBIH PTPFC Simulation State
  const [isFrictionlessFetch, setIsFrictionlessFetch] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchLogs, setFetchLogs] = useState<string[]>([]);
  
  // Form State
  const [phone, setPhone] = useState(initialPhone || '');
  const [password, setPassword] = useState(''); // PIN/Password
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [name, setName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [email, setEmail] = useState('');
  const [incomeRange, setIncomeRange] = useState<'BELOW_3L' | 'ABOVE_3L' | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Start Frictionless Data Fetch Simulation
  const startFrictionlessFetch = () => {
      setIsFrictionlessFetch(true);
      setFetchProgress(0);
      setFetchLogs(['Initializing PTPFC Handshake...']);

      const milestones = [
          { p: 20, log: 'Connected to RBI Innovation Hub Node...' },
          { p: 40, log: 'Verifying Mobile via Tuples...' },
          { p: 60, log: 'Fetching Masked Aadhaar (UIDAI)...' },
          { p: 80, log: 'Validating PAN (NSDL)...' },
          { p: 100, log: 'Data Received Successfully.' }
      ];

      let current = 0;
      const interval = setInterval(() => {
          if (current >= milestones.length) {
              clearInterval(interval);
              setTimeout(() => {
                  setIsFrictionlessFetch(false);
                  // Auto-fill Data
                  setName('Rajesh Kumar');
                  setAadhaar('xxxx xxxx 4590');
                  setPan('ABCDE1234F');
                  setEmail('rajesh.kumar@email.com');
              }, 800);
              return;
          }
          
          const m = milestones[current];
          setFetchProgress(m.p);
          setFetchLogs(prev => [...prev, m.log]);
          current++;
      }, 800);
  };

  // Validation & Navigation Handler
  const handleNext = async () => {
    setErrors({}); // Clear previous errors
    let isValid = true;
    const newErrors: {[key: string]: string} = {};

    if (step === OnboardingStep.CONSENT) {
        if (!consentGiven) {
            newErrors.consent = "Please authorize to proceed.";
            isValid = false;
        }
    } else if (step === OnboardingStep.DETAILS) {
        // Combined Validation
        if (name.trim().length < 3) {
            newErrors.name = "Enter full name as per PAN.";
            isValid = false;
        }
        // Validate Aadhaar (strip spaces first)
        const cleanAadhaar = aadhaar.replace(/\s/g, '');
        // Allow masked aadhaar for simulation or full 12 digits
        if (!/^\d{12}$/.test(cleanAadhaar) && !cleanAadhaar.includes('x')) {
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
    } else if (step === OnboardingStep.ECONOMIC_PROFILE) {
        if (!incomeRange) {
            newErrors.income = "Please select an income range.";
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
      // Flow Transition
      if (step === OnboardingStep.PHONE_ENTRY) {
          setStep(OnboardingStep.CONSENT);
      } else if (step === OnboardingStep.CONSENT) {
          setStep(OnboardingStep.DETAILS);
      } else if (step === OnboardingStep.DETAILS) {
          setStep(OnboardingStep.ECONOMIC_PROFILE);
      } else if (step === OnboardingStep.ECONOMIC_PROFILE) {
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
        // Spend Line
        totalLimit: 1000, 
        usedAmount: 200, // Simulated initial usage
        // Cash Line
        cashLimit: 1000,
        cashUsed: 0,
        
        name: name || 'Rajesh Kumar',
        phone: phone,
        pin: password,
        creditLevel: 1,
        ecScore: 650
     });
  };

  const renderProgress = () => {
    const currentProgressIdx = 
        step === OnboardingStep.PHONE_ENTRY ? 0 :
        step === OnboardingStep.CONSENT ? 1 :
        step === OnboardingStep.DETAILS ? 2 :
        step === OnboardingStep.ECONOMIC_PROFILE ? 3 : 4;
    
    const totalSteps = 5;
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
                    <Button fullWidth onClick={() => setStep(OnboardingStep.CONSENT)} size="lg">Continue</Button>
                </div>
            );

        case OnboardingStep.CONSENT:
             return (
                 <div className="space-y-6">
                     <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                            <Scale size={32} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-zinc-800 tracking-tight">Authorizations</h2>
                        <p className="text-zinc-600 text-sm mt-1">Regulatory Declarations</p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-none space-y-3">
                        <div className="flex items-start gap-2">
                             <ShieldCheck className="shrink-0 text-emerald-600 mt-0.5" size={16} />
                             <p className="text-xs text-zinc-600 leading-relaxed">
                                 <strong>LSP Declaration:</strong> I understand that <strong>EC1000 Duo</strong> is a Lending Service Provider (LSP) acting on behalf of <strong>SafeLend NBFC</strong> (Regulated Entity).
                             </p>
                        </div>
                        <div className="flex items-start gap-2">
                             <Briefcase className="shrink-0 text-emerald-600 mt-0.5" size={16} />
                             <p className="text-xs text-zinc-600 leading-relaxed">
                                 <strong>Fund Flow:</strong> All loan disbursements will be made directly from SafeLend NBFC's bank account to my account/merchant.
                             </p>
                        </div>
                        <div className="flex items-start gap-2">
                             <IndianRupee className="shrink-0 text-emerald-600 mt-0.5" size={16} />
                             <p className="text-xs text-zinc-600 leading-relaxed">
                                 <strong>Auto-Pay:</strong> I authorize the setup of a UPI Auto-Pay mandate (Max ₹5000) for repayments.
                             </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-white p-3 border border-zinc-200">
                         <input 
                            type="checkbox" 
                            id="consent" 
                            className="w-5 h-5 mt-0.5 rounded-none shrink-0"
                            checked={consentGiven}
                            onChange={(e) => {
                                setConsentGiven(e.target.checked);
                                if(errors.consent) setErrors({...errors, consent: ''});
                            }}
                         />
                         <label htmlFor="consent" className="text-sm text-zinc-800 font-bold cursor-pointer leading-snug">
                             I agree to the Terms, Privacy Policy, and authorize EC1000 & SafeLend NBFC to access my credit report.
                         </label>
                    </div>
                    {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}

                    <div className="pt-4">
                        <Button fullWidth onClick={handleNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Accept & Continue'}
                        </Button>
                    </div>
                 </div>
             );
        
        // Combined Registration Step with PTPFC Simulation
        case OnboardingStep.DETAILS:
             if (isFrictionlessFetch) {
                 return (
                     <div className="space-y-8 text-center py-10">
                         <div className="relative w-24 h-24 mx-auto mb-6">
                             <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                             <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <Database className="text-emerald-600" size={32} />
                             </div>
                         </div>
                         <div>
                             <h2 className="text-xl font-bold text-zinc-800 mb-2">Connecting to PTPFC...</h2>
                             <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Public Tech Platform for Frictionless Credit</p>
                         </div>
                         
                         <div className="bg-zinc-900 text-green-400 p-4 font-mono text-xs text-left h-32 overflow-hidden rounded-md border border-zinc-800 shadow-inner">
                             {fetchLogs.map((log, i) => (
                                 <p key={i} className="mb-1">> {log}</p>
                             ))}
                             <span className="animate-pulse">_</span>
                         </div>
                     </div>
                 )
             }

             return (
                <div className="space-y-6">
                     <div className="text-center mb-6">
                        <h2 className="text-2xl font-extrabold text-zinc-800 tracking-tight">KYC Details</h2>
                        <p className="text-zinc-600 text-sm mt-1">Verify your identity to unlock limits.</p>
                    </div>

                    {/* Frictionless Fetch CTA */}
                    {!name && (
                        <div 
                            onClick={startFrictionlessFetch}
                            className="bg-blue-50 border border-blue-200 p-4 cursor-pointer hover:bg-blue-100 transition-colors group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="font-bold text-blue-900">Fetch via RBI Innovation Hub</h3>
                                    <p className="text-xs text-blue-700">Zero typing. Instant verify via PTPFC.</p>
                                </div>
                                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    FAST
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {name && (
                        <div className="bg-green-50 border border-green-200 p-3 flex items-center gap-2 text-green-800 text-sm font-medium animate-fade-in">
                            <CheckCircle size={16} />
                            Data fetched successfully via PTPFC
                        </div>
                    )}

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
                                        // Strip non-digits except 'x' for masked
                                        // Simple logic for manual entry
                                        let val = e.target.value;
                                        setAadhaar(val);
                                        if (errors.aadhaar) setErrors({...errors, aadhaar: ''});
                                    }}
                                    className={`w-full p-3 bg-white border-2 outline-none text-black transition-colors ${errors.aadhaar ? 'border-red-500' : 'border-zinc-200 focus:border-emerald-600'}`}
                                    placeholder="0000 0000 0000"
                                />
                                {aadhaar.length >= 12 && <ShieldCheck className="absolute right-3 top-3 text-emerald-600" size={20} />}
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
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm & Proceed'}
                        </Button>
                    </div>
                </div>
             );

        case OnboardingStep.ECONOMIC_PROFILE:
             return (
                 <div className="space-y-6">
                     <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 border border-yellow-100">
                            <Briefcase size={32} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-zinc-800 tracking-tight">Economic Profile</h2>
                        <p className="text-zinc-600 text-sm mt-1">Required for Regulatory Classification</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-bold text-zinc-700">What is your Annual Household Income?</p>
                        <p className="text-xs text-zinc-500 mb-4">
                            Per RBI Microfinance guidelines, this helps us categorize your loan product.
                        </p>
                        
                        <div 
                            onClick={() => { setIncomeRange('BELOW_3L'); if(errors.income) setErrors({...errors, income: ''}); }}
                            className={`p-4 border-2 rounded cursor-pointer transition-all ${incomeRange === 'BELOW_3L' ? 'border-emerald-600 bg-emerald-50' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-zinc-800">Below ₹3 Lakhs</span>
                                {incomeRange === 'BELOW_3L' && <CheckCircle className="text-emerald-600" size={20} />}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Eligible for collateral-free Microfinance Loans.</p>
                        </div>

                        <div 
                            onClick={() => { setIncomeRange('ABOVE_3L'); if(errors.income) setErrors({...errors, income: ''}); }}
                            className={`p-4 border-2 rounded cursor-pointer transition-all ${incomeRange === 'ABOVE_3L' ? 'border-blue-600 bg-blue-50' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-zinc-800">Above ₹3 Lakhs</span>
                                {incomeRange === 'ABOVE_3L' && <CheckCircle className="text-blue-600" size={20} />}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Eligible for Standard Personal Loans.</p>
                        </div>
                        
                        {errors.income && <p className="text-red-500 text-xs">{errors.income}</p>}
                    </div>

                    <div className="pt-4">
                        <Button fullWidth onClick={handleNext} size="lg" className="bg-zinc-800 hover:bg-zinc-900 text-white">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Save Profile'}
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
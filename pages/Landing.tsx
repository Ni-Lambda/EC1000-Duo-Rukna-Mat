// ... (imports remain same)
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Smartphone, IndianRupee, Banknote, ScanLine, Repeat, ShieldCheck, Building2, TrendingUp, Globe, ExternalLink, ArrowRight, Mic, Tv, Wifi, Clapperboard, ChevronLeft, Lock, FileText, Scale, Loader2, Zap, Landmark, Moon, Sun } from 'lucide-react';
import { Button } from '../components/Button';
import { AppStage } from '../types';
import { useTheme } from '../ThemeContext';

interface LandingProps {
  onGetStarted: (phone: string) => void;
}

// Provider Data for Recharge Hub
const RECHARGE_PROVIDERS = [
  {
    category: "Mobile",
    icon: Smartphone,
    color: "text-blue-500",
    brands: [
      { name: "Jio", url: "https://www.jio.com", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Reliance_Jio_Logo_%28October_2015%29.svg" },
      { name: "Airtel", url: "https://www.airtel.in", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Airtel_logo_2010.svg" },
      { name: "Vi", url: "https://www.myvi.in", logo: "https://upload.wikimedia.org/wikipedia/en/9/93/Vodafone_Idea_logo.svg" },
      { name: "BSNL", url: "https://www.bsnl.co.in", logo: "https://upload.wikimedia.org/wikipedia/en/9/98/Bharat_Sanchar_Nigam_Limited_logo.svg" }
    ]
  },
  {
    category: "OTT",
    icon: Clapperboard,
    color: "text-red-500",
    brands: [
      { name: "Netflix", url: "https://www.netflix.com", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
      { name: "Disney+ Hotstar", url: "https://www.hotstar.com", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg" },
      { name: "Prime Video", url: "https://www.primevideo.com", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png" },
      { name: "SonyLIV", url: "https://www.sonyliv.com", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/SonyLIV_2020_Logo.svg" }
    ]
  },
  {
    category: "DTH",
    icon: Tv,
    color: "text-purple-500",
    brands: [
      { name: "Tata Play", url: "https://www.tataplay.com", logo: "https://upload.wikimedia.org/wikipedia/commons/7/73/Tata_Play_Logo_2022.svg" },
      { name: "Dish TV", url: "https://www.dishtv.in", logo: "https://upload.wikimedia.org/wikipedia/en/9/94/Dish_TV_India_logo.svg" },
      { name: "Airtel DTH", url: "https://www.airtel.in/dth/", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Airtel_logo_2010.svg" },
      { name: "D2H", url: "https://www.d2h.com", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Videocon_d2h_logo.png" }
    ]
  },
  {
    category: "Broadband",
    icon: Wifi,
    color: "text-emerald-500",
    brands: [
      { name: "JioFiber", url: "https://www.jio.com/fiber", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Reliance_Jio_Logo_%28October_2015%29.svg" },
      { name: "Airtel Xstream", url: "https://www.airtel.in/broadband/", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Airtel_logo_2010.svg" },
      { name: "ACT Fibernet", url: "https://www.actcorp.in", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/ACT_Fibernet_logo.svg" },
      { name: "Hathway", url: "https://www.hathway.com", logo: "https://upload.wikimedia.org/wikipedia/en/1/14/Hathway_logo.png" }
    ]
  }
];

interface HeroSlide {
  id: number;
  video?: string;
  image: string;
  headline: string;
  subtext: string;
  fallbackColor: string;
  ctaText: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1920',
    headline: "EC1000 Duo",
    subtext: "RBI inspired LSP, Turning Micro-Access into Macro-Momentum for Viksit Bharat 2047.",
    fallbackColor: "bg-zinc-900",
    ctaText: "Explore Now"
  },
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/d/1pC4kqgYrvG-NwVsNGiHlgrDitKh8RUKD',
    headline: "Data & Entertainment",
    subtext: "Recharge Data, DTH, OTT platforms for higher value packs. Repay in weekly or bi-weekly smaller amounts.",
    fallbackColor: "bg-zinc-900",
    ctaText: "Recharge Now"
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/d/1JAjVRkj-o4t3eY1g5YYpKPWTKN1JC7v7',
    headline: "EC Spend",
    subtext: "Get Instant fuel credit for viksit barath Rukna Mat Don't Stop",
    fallbackColor: "bg-zinc-900",
    ctaText: "Fuel Now"
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/d/1cKpK3knErsmgAnslSDtIXYv_zt5-AUl_',
    headline: "Rider Support",
    subtext: "Bike maintenance, tyres, or repairs. Instant credit for delivery partners. Rukna Mat.",
    fallbackColor: "bg-zinc-900",
    ctaText: "Repair Now"
  },
  {
    id: 4,
    image: 'https://lh3.googleusercontent.com/d/1EhY1pYeT-uaPKPfohTitG9-DE6ywzw3d',
    headline: "EC Cash",
    subtext: "Need urgent funds? Transfer directly to your bank account instantly.",
    fallbackColor: "bg-zinc-900",
    ctaText: "Transfer Now"
  }
];

const NEWS_ITEMS = [
  {
    id: 1,
    tag: "RBI SPEECH",
    title: "Micro Matters, Macro Momentum",
    summary: "Speech by Shri Swaminathan J, Deputy Governor at MFIN, Nov 2025.",
    date: "Nov 14",
    source: "Reserve Bank of India",
    icon: Mic,
    color: "text-blue-500",
    link: "https://www.rbi.org.in/"
  },
  {
    id: 2,
    tag: "REGULATION",
    title: "Digital Lending 2025",
    summary: "New guidelines on KFS and interest rates for micro-loans.",
    date: "Nov 12",
    source: "RBI Press Release",
    icon: Building2,
    color: "text-emerald-500",
    link: "https://www.rbi.org.in/Scripts/NotificationUser.aspx"
  },
  {
    id: 3,
    tag: "INNOVATION",
    title: "UPI Lite X Offline",
    summary: "Offline transactions for feature phones.",
    date: "Nov 10",
    source: "NPCI News",
    icon: TrendingUp,
    color: "text-purple-500",
    link: "https://www.npci.org.in/"
  },
  {
    id: 4,
    tag: "PRB UPDATE",
    title: "Payment Systems 2026",
    summary: "Payments Regulatory Board issues new framework for fintech oversight.",
    date: "Nov 08",
    source: "PRB Notification",
    icon: Landmark,
    color: "text-orange-500",
    link: "#"
  }
];

const HOW_IT_WORKS_STEPS = [
    { id: 1, title: 'Enter Number', desc: 'Sign up with your mobile number linked to Aadhaar.', icon: Smartphone },
    { id: 2, title: 'Instant KYC', desc: 'We fetch your details securely via RBI PTPFC.', icon: ShieldCheck },
    { id: 3, title: 'Start Spending', desc: 'Get ₹1000 limit instantly. Scan & Pay or Transfer.', icon: Zap }
];

// Page Content Data
const INFO_PAGES: {[key: string]: { title: string; content: React.ReactNode; icon: any }} = {
    'about-us': {
        title: "About EC1000 Duo",
        icon: Globe,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <p className="text-lg leading-relaxed text-zinc-900 dark:text-white font-medium">
                    EC1000 Duo is built on a simple premise: <span className="text-emerald-600 font-bold">Rukna Mat</span> (Don't Stop).
                </p>
                <p className="text-base leading-relaxed">
                    We understand that life's little emergencies shouldn't stop your daily progress. Whether it's a fuel refill, a pharmacy bill, or a grocery run, we provide instant, small-ticket liquidity to keep you moving.
                </p>
                <p className="text-base leading-relaxed">
                    We are a digital-first Lending Service Provider (LSP) compliant with RBI's digital lending guidelines. Our technology ensures that credit is accessible, affordable, and transparent for every Indian.
                </p>

                <div className="grid gap-6 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-l-4 border-blue-500">
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 flex items-center gap-2">
                           <ScanLine size={20} className="text-blue-500" /> EC Spend
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Our Scan & Pay solution allows users to pay directly at verified merchants for essentials like fuel, groceries, and pharmacy needs. It operates on a shared cumulative spend limit, ensuring funds are used responsibly for daily necessities.
                        </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-l-4 border-emerald-500">
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 flex items-center gap-2">
                           <Banknote size={20} className="text-emerald-500" /> EC Cash
                        </h3>
                        <p className="text-sm leading-relaxed">
                            A separate limit dedicated for direct bank transfers to meet personal emergencies. It provides instant access to liquid cash when digital merchant payments aren't an option, with flexible repayment plans.
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    'ethical-lending': {
        title: "Ethical Lending",
        icon: Scale,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <p className="text-lg leading-relaxed text-zinc-900 dark:text-white font-medium">
                    At EC1000 <span className="text-emerald-600 dark:text-emerald-500 font-bold">Duo</span>, we believe in ethical lending practices for the sustainable growth of our community.
                </p>
                <p className="text-base leading-relaxed">
                    We believe in providing small liquidity for the user's daily essentials with <span className="text-emerald-600 dark:text-emerald-400 font-bold">FlexiSmart</span> repayment options. This helps the user in many ways, and that is the core idea behind EC1000 <span className="text-emerald-600 dark:text-emerald-500 font-bold">Duo</span>: <span className="text-zinc-900 dark:text-white font-bold italic">'Rukna Mat'</span> - Don't Stop. Keep Moving.
                </p>
                <p className="text-base leading-relaxed">
                    As a <span className="text-zinc-800 dark:text-zinc-100 font-semibold">Lending Service Provider (LSP)</span>, we bridge the gap by partnering with RBI-recognized banks and service providers to ensure safety and trust.
                </p>
                
                <div className="grid gap-6 mt-6">
                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 border-l-4 border-emerald-500">
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 flex items-center gap-2"><FileText size={20}/> Transparent Fees</h3>
                        <p className="text-sm">No hidden charges. The user sees the exact Processing Fee and APR in the Key Fact Statement (KFS) before the user clicks 'Agree'. We believe in 100% transparency.</p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 border-l-4 border-blue-500">
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 flex items-center gap-2"><IndianRupee size={20}/> Direct Fund Flow</h3>
                        <p className="text-sm">We partner with regulated NBFCs (SafeLend) ensuring 100% direct fund flow to the user's bank or merchant. No third-party wallets holding the user's money.</p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 border-l-4 border-purple-500">
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 flex items-center gap-2"><Lock size={20}/> Data Integrity</h3>
                        <p className="text-sm">We only use authorized data (Account Aggregator & UPI logs) for underwriting. No scraping of contacts or gallery.</p>
                    </div>
                </div>
            </div>
        )
    },
    'user-responsibility': {
        title: "User Responsibility",
        icon: ShieldCheck,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Be a Smart Borrower</h3>
                <ul className="space-y-4 list-disc pl-5 text-sm">
                    <li><strong>Borrow Only What You Need:</strong> Credit is a tool, not income. Use it for planned expenses or emergencies.</li>
                    <li><strong>Repay on Time:</strong> Timely repayments boost the user's EC Score, unlocking higher limits and lower interest rates.</li>
                    <li><strong>Protect Credentials:</strong> Never share OTP, PIN, or Password with anyone, including EC1000 support staff.</li>
                    <li><strong>Read the KFS:</strong> Always review the Key Fact Statement before accepting a loan to understand fees and APR.</li>
                </ul>
            </div>
        )
    },
    'rbi-rules': {
        title: "Regulatory Disclosures",
        icon: Building2,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded border-l-4 border-blue-600">
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Lending Service Provider (LSP)</h4>
                    <p className="text-sm">Name: EC1000 Digital Services Pvt Ltd</p>
                    <p className="text-sm">CIN: U72900MH2024PTC123456</p>
                    <p className="text-sm">Address: 101, Fintech Park, Mumbai, Maharashtra 400001</p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded border-l-4 border-emerald-600">
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Regulated Entity (RE) Partner</h4>
                    <p className="text-sm">Name: SafeLend NBFC Ltd</p>
                    <p className="text-sm">RBI Reg No: B.05.02345</p>
                </div>
                <p className="text-sm">
                    We adhere strictly to RBI's Guidelines on Digital Lending (2022). All loans are disbursed directly from the RE's bank account to the borrower.
                </p>
            </div>
        )
    },
    'grievance': {
        title: "Grievance Redressal",
        icon: Scale,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <p className="text-base font-medium">
                    We are committed to resolving your concerns quickly.
                </p>
                <div className="space-y-4">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                        <h4 className="font-bold text-zinc-900 dark:text-white">Level 1: Customer Support</h4>
                        <p className="text-sm">Email: support@ec1000.in</p>
                        <p className="text-sm">Phone: 022-4567-8900 (Mon-Sat, 9 AM - 6 PM)</p>
                    </div>
                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                        <h4 className="font-bold text-zinc-900 dark:text-white">Level 2: Grievance Officer</h4>
                        <p className="text-sm">Name: Mr. Vinay Kumar</p>
                        <p className="text-sm">Email: grievance@ec1000.in</p>
                        <p className="text-sm">Address: 101, Fintech Park, Mumbai</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white">Level 3: RBI Ombudsman</h4>
                        <p className="text-sm">If unresolved after 30 days, lodge a complaint on <a href="#" className="text-blue-500 underline">cms.rbi.org.in</a>.</p>
                    </div>
                </div>
            </div>
        )
    },
    'privacy-policy': {
        title: "Privacy Policy",
        icon: Lock,
        content: (
             <div className="space-y-4 text-zinc-600 dark:text-zinc-300 text-sm">
                <p><strong>Last Updated: Nov 2025</strong></p>
                <p>1. <strong>Data Collection:</strong> We only collect data required for KYC and underwriting (Name, Phone, Pan, Location for transaction verification).</p>
                <p>2. <strong>No Contact Scraping:</strong> We do NOT access your contact list or photo gallery.</p>
                <p>3. <strong>Data Sharing:</strong> Data is shared only with our partner NBFC (SafeLend) for loan processing. We do not sell data to third-party marketers.</p>
                <p>4. <strong>Storage:</strong> All data is stored on servers located within India.</p>
             </div>
        )
    },
    'terms': {
        title: "Terms of Service",
        icon: FileText,
        content: (
            <div className="space-y-4 text-zinc-600 dark:text-zinc-300 text-sm">
                <p>By using EC1000 Duo, you agree to the following:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>You are an Indian citizen above 21 years of age.</li>
                    <li>You consent to credit checks via Credit Bureaus.</li>
                    <li>You authorize UPI Auto-Pay for loan repayments.</li>
                    <li>Late payments may attract penal charges and impact your credit score.</li>
                </ul>
            </div>
        )
    }
};

export const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Inline Onboarding State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
        const state = event.state;
        if (state?.overlay) {
            setActiveOverlay(state.overlay);
        } else {
            setActiveOverlay(null);
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!videoError && videoRef.current) {
        const attemptPlay = async () => {
             try {
                 videoRef.current!.muted = true;
                 await videoRef.current!.play();
             } catch (e) {
                 console.warn("Autoplay failed");
             }
        };
        attemptPlay();
    }
  }, [videoError]);

  const openOverlay = (name: string) => {
    setActiveOverlay(name);
    window.history.pushState({ overlay: name }, '');
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
    window.history.back();
  };

  const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '');
      if (val.length <= 10) {
          setPhone(val);
      }
  };

  const handleGetOtp = () => {
    if (phone.length === 10) {
        setShowOtp(true);
    }
  };

  const handleVerify = () => {
      if (otp.length === 4) {
          setIsVerifying(true);
          setTimeout(() => {
             onGetStarted(phone);
          }, 1000);
      }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">EC1000</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">Duo</span>
          </div>
          
          <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button 
                onClick={() => openOverlay('menu')}
                className="p-2 -mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Menu size={24} />
              </button>
          </div>
        </div>
      </nav>

      {/* Main Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth pt-16"
      >
          {/* VERTICAL HERO SECTIONS - Full Screen */}
          {HERO_SLIDES.map((slide, index) => (
              <section 
                key={slide.id}
                className="relative h-screen w-full snap-start flex-shrink-0 bg-zinc-900 overflow-hidden border-b border-zinc-800"
              >
                  {slide.video && !videoError ? (
                       <video 
                          ref={index === 0 ? videoRef : undefined}
                          src={slide.video}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          onError={() => setVideoError(true)}
                       />
                  ) : (
                       <img src={slide.image} alt={slide.headline} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>

                  {/* Subtext - Moved Higher and Bold */}
                  <div className="absolute top-16 left-0 p-6 md:p-12 z-20 max-w-xl">
                      <p className="text-lg md:text-xl text-white/90 font-bold leading-snug drop-shadow-lg border-l-4 border-emerald-500 pl-4">
                          {slide.subtext}
                      </p>
                  </div>

                  {/* Headline & CTA - Bottom Aligned Single Line */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 pb-12 md:pb-12 flex flex-row items-end justify-between gap-4">
                      <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter drop-shadow-xl uppercase flex-1 whitespace-normal">
                          {slide.headline}
                      </h1>

                      <button 
                           onClick={() => scrollToSection('how-it-works')}
                           className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl flex items-center gap-2 shrink-0 mb-1"
                      >
                          {slide.ctaText}
                      </button>
                  </div>
              </section>
          ))}

          {/* FEATURES GRID - Compact Single View */}
          <section className="h-screen snap-start bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center px-4 overflow-hidden relative">
              <div className="max-w-6xl mx-auto w-full">
                  <div className="text-left md:text-center mb-8 md:mb-12">
                      <span className="text-emerald-600 dark:text-emerald-500 font-bold tracking-widest uppercase text-xs md:text-sm">Why EC1000 Duo?</span>
                      <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mt-1 uppercase tracking-tighter leading-none">
                          Small Credit. <span className="text-zinc-400">Massive Impact.</span>
                      </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                      {/* EC Cash */}
                      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 flex flex-row md:flex-col items-center md:items-start text-left gap-4 group hover:bg-zinc-50 dark:hover:bg-black transition-colors">
                          <div className="shrink-0 text-emerald-600 dark:text-emerald-400 transform group-hover:scale-110 transition-transform">
                              <Banknote size={32} strokeWidth={1.5} />
                          </div>
                          <div>
                              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-1">EC Cash</h3>
                              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                                  Instant transfer to bank account for emergency needs.
                              </p>
                          </div>
                      </div>

                      {/* EC Spend */}
                      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 flex flex-row md:flex-col items-center md:items-start text-left gap-4 group hover:bg-zinc-50 dark:hover:bg-black transition-colors">
                          <div className="shrink-0 text-blue-600 dark:text-blue-400 transform group-hover:scale-110 transition-transform">
                              <ScanLine size={32} strokeWidth={1.5} />
                          </div>
                          <div>
                              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-1">EC Spend</h3>
                              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                                  Scan & Pay at Fuel Stations, Pharmacies, and Grocery stores.
                              </p>
                          </div>
                      </div>

                      {/* FlexiSmart */}
                      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 flex flex-row md:flex-col items-center md:items-start text-left gap-4 group hover:bg-zinc-50 dark:hover:bg-black transition-colors">
                          <div className="shrink-0 text-purple-600 dark:text-purple-400 transform group-hover:scale-110 transition-transform">
                              <Repeat size={32} strokeWidth={1.5} />
                          </div>
                          <div>
                              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-1">FlexiSmart</h3>
                              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                                  Weekly or bi-weekly cycles aligned with your earnings.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* HOW IT WORKS + INPUT SECTION */}
          <section id="how-it-works" className="min-h-screen py-16 bg-zinc-900 snap-start flex flex-col justify-center items-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-950 opacity-50"></div>
              
              <div className="max-w-4xl mx-auto px-4 w-full relative z-10">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-8 text-left">
                          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-8 text-white">How It Works</h2>
                           {HOW_IT_WORKS_STEPS.map((step) => (
                                  <div key={step.id} className="flex items-start gap-4 group">
                                      <div className="text-3xl font-black text-emerald-600/30 group-hover:text-emerald-500 transition-colors">0{step.id}</div>
                                      <div>
                                          <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                                          <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                                      </div>
                                  </div>
                              ))}
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                           {!showOtp ? (
                               <div className="space-y-4">
                                   <div>
                                       <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-2 block">Check Eligibility</label>
                                       <div className="flex items-center border-b-2 border-zinc-500 focus-within:border-emerald-500 transition-colors pb-2">
                                           <span className="text-xl font-bold text-zinc-300 mr-3 shrink-0">+91</span>
                                           <input 
                                                type="tel" 
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                className="w-full text-2xl font-bold bg-transparent outline-none placeholder:text-zinc-600 text-white min-w-0"
                                                placeholder="99999 00000"
                                                maxLength={10}
                                           />
                                           {phone.length === 10 && (
                                               <button 
                                                   onClick={handleGetOtp}
                                                   className="shrink-0 bg-emerald-600 text-white text-sm font-bold px-4 py-2 uppercase tracking-wider hover:bg-emerald-500 transition-all animate-fade-in rounded-sm"
                                               >
                                                   Get OTP
                                               </button>
                                           )}
                                       </div>
                                   </div>
                               </div>
                           ) : (
                               <div className="space-y-6 animate-fade-in">
                                   <div>
                                       <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-2 block">Enter OTP</label>
                                       <div className="flex items-center border-b-2 border-zinc-500 focus-within:border-emerald-500 transition-colors pb-2">
                                           <Lock className="text-zinc-400 mr-3 mb-1 shrink-0" size={20} />
                                           <input 
                                                type="text" 
                                                value={otp}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 4) setOtp(val);
                                                }}
                                                className="w-full text-2xl font-bold bg-transparent outline-none tracking-[0.5em] placeholder:tracking-normal placeholder:text-zinc-600 text-white min-w-0"
                                                placeholder="••••"
                                                maxLength={4}
                                                autoFocus
                                           />
                                           {otp.length === 4 && (
                                                <button 
                                                    onClick={handleVerify}
                                                    className="shrink-0 bg-emerald-600 text-white text-sm font-bold px-4 py-2 uppercase tracking-wider hover:bg-emerald-500 transition-all animate-fade-in flex items-center gap-2 rounded-sm"
                                                >
                                                    {isVerifying ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
                                                </button>
                                           )}
                                       </div>
                                   </div>
                                   
                                   <button onClick={() => { setShowOtp(false); setOtp(''); }} className="w-full text-right text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wide">
                                       Change Number
                                   </button>
                               </div>
                           )}
                           
                           <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400 font-medium bg-black/30 p-3 rounded">
                               <ShieldCheck size={16} className="text-emerald-500" />
                               <span>Data secured via RBI Account Aggregator.</span>
                           </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* NEWS TICKER - Vertical Scrolling List */}
          <section className="h-screen snap-start bg-zinc-100 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 flex flex-col justify-center overflow-hidden">
             <div className="max-w-4xl mx-auto px-4 w-full h-full flex flex-col justify-center py-20">
                 <div className="flex justify-between items-end mb-4 shrink-0">
                      <h3 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Fintech Updates</h3>
                      <a href="#" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</a>
                 </div>

                 {/* Vertical Scrolling Container */}
                 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                     <div className="space-y-3">
                         {NEWS_ITEMS.map((item) => (
                             <div key={item.id} className="bg-white dark:bg-zinc-800/50 p-4 rounded-none border-l-4 border-l-transparent hover:border-l-emerald-500 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all flex flex-row items-start gap-3">
                                 {/* Icon - Aligned Left */}
                                 <div className={`shrink-0 p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 ${item.color}`}>
                                     <item.icon size={20} />
                                 </div>
                                 {/* Content */}
                                 <div className="flex-1 w-full">
                                      <div className="flex justify-between items-start w-full mb-0.5">
                                         <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>
                                             {item.tag}
                                         </span>
                                         <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.date}</span>
                                      </div>
                                      <h4 className="font-bold text-base text-zinc-900 dark:text-white leading-tight mb-1">{item.title}</h4>
                                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2 line-clamp-2">{item.summary}</p>
                                      
                                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-700">
                                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[150px]">
                                              Source: {item.source}
                                          </div>
                                          <a href={item.link} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:underline whitespace-nowrap">
                                              Read <ExternalLink size={10} />
                                          </a>
                                      </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
          </section>

          {/* RECHARGE HUB TEASER - Full Screen View */}
          <section className="h-screen bg-white dark:bg-zinc-950 snap-start flex items-center justify-center relative">
              <div className="max-w-7xl mx-auto px-4 w-full">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                      <div className="flex-1 space-y-6">
                          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">
                              Recharge<br/>Hub
                          </h2>
                          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-4 border-blue-500 pl-4">
                              Pay later for Mobile, DTH, and Broadband.
                          </p>
                          <button 
                            onClick={() => openOverlay('recharge')}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
                          >
                              View Operators <ArrowRight size={18} />
                          </button>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                          {RECHARGE_PROVIDERS.slice(0, 4).map((cat, idx) => (
                              <div key={idx} className={`p-6 bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-black transition-colors`}>
                                  <cat.icon size={32} className={`mb-3 ${cat.color}`} />
                                  <span className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">{cat.category}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </section>

          {/* FOOTER - Compact Full Screen */}
          <footer className="h-screen bg-zinc-950 text-zinc-500 snap-start flex flex-col justify-center px-6 relative overflow-hidden border-t border-zinc-900">
              <div className="max-w-7xl mx-auto w-full">
                  
                  {/* Grid Layout: 2 Cols on Mobile, 4 on Desktop */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 items-start">
                      
                      {/* Brand Column */}
                      <div className="col-span-2 md:col-span-1 space-y-4">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-black text-white tracking-tighter">EC1000</span>
                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">Duo</span>
                          </div>
                          <p className="text-xs leading-relaxed max-w-xs text-zinc-400">
                              Instant, ethical, regulated liquidity for Bharat. 
                              <span className="block mt-1 text-emerald-600/50 font-medium">Digital India Initiative.</span>
                          </p>
                      </div>

                      {/* Links */}
                      <div>
                          <h4 className="text-zinc-300 font-bold uppercase tracking-widest mb-4 text-xs">Legal</h4>
                          <ul className="space-y-2 text-xs font-medium">
                              <li><button onClick={() => openOverlay('privacy-policy')} className="hover:text-emerald-500 transition-colors text-left">Privacy Policy</button></li>
                              <li><button onClick={() => openOverlay('terms')} className="hover:text-emerald-500 transition-colors text-left">Terms of Service</button></li>
                              <li><button onClick={() => openOverlay('rbi-rules')} className="hover:text-emerald-500 transition-colors text-left">Regulatory Disclosures</button></li>
                          </ul>
                      </div>
                      
                      <div>
                          <h4 className="text-zinc-300 font-bold uppercase tracking-widest mb-4 text-xs">Company</h4>
                          <ul className="space-y-2 text-xs font-medium">
                              <li><button onClick={() => openOverlay('about-us')} className="hover:text-emerald-500 transition-colors text-left">About Us</button></li>
                              <li><button onClick={() => openOverlay('ethical-lending')} className="hover:text-emerald-500 transition-colors text-left">Ethical Lending</button></li>
                              <li><a href="#" className="hover:text-emerald-500 transition-colors">Careers</a></li>
                          </ul>
                      </div>
                      
                      <div>
                          <h4 className="text-zinc-300 font-bold uppercase tracking-widest mb-4 text-xs">Contact</h4>
                          <ul className="space-y-2 text-xs font-medium">
                              <li><button onClick={() => openOverlay('grievance')} className="hover:text-emerald-500 transition-colors text-left">Grievance Redressal</button></li>
                              <li><a href="mailto:support@ec1000.in" className="hover:text-emerald-500 transition-colors">support@ec1000.in</a></li>
                              <li>022-4567-8900</li>
                          </ul>
                      </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
                      <p>&copy; 2025 EC1000 Duo. Licensed LSP.</p>
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span>Systems Operational</span>
                      </div>
                  </div>
              </div>
          </footer>
      </div>

      {/* OVERLAYS (Menu, Recharge, etc.) - same logic, kept for functionality */}
      
      {activeOverlay === 'menu' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeOverlay}>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-950 shadow-2xl p-8 overflow-y-auto animate-slide-in-right" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-12">
                      <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Menu</h2>
                      <button onClick={closeOverlay}><X size={24} /></button>
                  </div>
                  
                  <div className="space-y-8">
                      {Object.entries(INFO_PAGES).map(([key, page]) => (
                          <button 
                            key={key}
                            onClick={() => openOverlay(key)}
                            className="flex items-center space-x-4 text-lg font-bold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 w-full text-left group"
                          >
                              <page.icon size={24} className="text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                              <span>{page.title}</span>
                          </button>
                      ))}
                      
                      <hr className="border-zinc-200 dark:border-zinc-800" />
                      
                      <div className="space-y-4">
                           <button onClick={() => openOverlay('recharge')} className="flex items-center space-x-4 text-lg font-bold text-blue-600 dark:text-blue-400 w-full text-left">
                              <Smartphone size={24} />
                              <span>Recharge Hub</span>
                           </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* RECHARGE OVERLAY */}
      {activeOverlay === 'recharge' && (
           <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 overflow-y-auto animate-slide-in-right">
               <div className="sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                       <button onClick={closeOverlay}><ChevronLeft size={24} /></button>
                       <span className="font-bold text-lg uppercase tracking-widest">Recharge Hub</span>
                   </div>
               </div>
               
               <div className="max-w-4xl mx-auto p-4 py-12 space-y-12">
                   {RECHARGE_PROVIDERS.map((section, idx) => (
                       <div key={idx} className="space-y-6">
                           <h3 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-3 ${section.color}`}>
                               <section.icon size={28} />
                               {section.category}
                           </h3>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                               {section.brands.map((brand, bIdx) => (
                                   <a 
                                     key={bIdx}
                                     href={brand.url}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="flex flex-col items-center p-8 bg-zinc-50 dark:bg-zinc-900 hover:bg-white dark:hover:bg-black transition-all group"
                                   >
                                       <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                           <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                                       </div>
                                       <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">{brand.name}</span>
                                   </a>
                               ))}
                           </div>
                       </div>
                   ))}
               </div>
           </div>
      )}

      {/* GENERIC INFO PAGES */}
      {activeOverlay && INFO_PAGES[activeOverlay] && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 overflow-y-auto animate-slide-in-right">
               <div className="sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between z-10">
                   <div className="flex items-center space-x-3">
                       <button onClick={closeOverlay}><ChevronLeft size={24} /></button>
                       <span className="font-bold text-lg uppercase tracking-widest">{INFO_PAGES[activeOverlay].title}</span>
                   </div>
               </div>
               <div className="max-w-3xl mx-auto p-6 md:p-16 pb-24">
                   <div className="mb-12 flex justify-center">
                       <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                            {React.createElement(INFO_PAGES[activeOverlay].icon, { size: 48 })}
                       </div>
                   </div>
                   <div className="prose dark:prose-invert max-w-none">
                       {INFO_PAGES[activeOverlay].content}
                   </div>
               </div>
          </div>
      )}

    </div>
  );
};
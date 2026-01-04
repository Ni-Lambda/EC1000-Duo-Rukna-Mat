import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Smartphone, CheckCircle, IndianRupee, Banknote, ScanLine, Repeat, ShieldCheck, Building2, TrendingUp, Globe, ExternalLink, ArrowRight, Mic, Tv, Wifi, Clapperboard, ChevronLeft, Lock, FileText, Scale, Loader2, RotateCcw, Mail, Phone, Info, Sun, Moon } from 'lucide-react';
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
  iframeUrl?: string;
  video?: string;
  image: string;
  headline: string;
  subtext: string;
  fallbackColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    // Intro - Main Hero Video
    // Switched to iframeUrl for reliable Google Drive rendering
    iframeUrl: 'https://drive.google.com/file/d/1cniFYKmM08eJZmO_FxTOq1XS5WhzUjX9/preview',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1920', // Fallback
    headline: "EC1000 Duo",
    subtext: "RBI inspired LSP, Turning Micro-Access into Macro-Momentum for Viksit Bharat 2047.",
    fallbackColor: "bg-zinc-900"
  },
  {
    id: 1,
    // Scenario: Mobile/Data
    image: 'https://lh3.googleusercontent.com/d/1pC4kqgYrvG-NwVsNGiHlgrDitKh8RUKD',
    headline: "Data & Entertainment",
    subtext: "Recharge Data, DTH, OTT platforms for higher value packs. Repay in weekly or bi-weekly smaller amounts.",
    fallbackColor: "bg-zinc-900"
  },
  {
    id: 2,
    // Scenario: Auto Rickshaw / Fuel
    image: 'https://lh3.googleusercontent.com/d/1JAjVRkj-o4t3eY1g5YYpKPWTKN1JC7v7',
    headline: "EC Spend",
    subtext: "Get Instant fuel credit for viksit barath Rukna Mat Don't Stop",
    fallbackColor: "bg-zinc-900"
  },
  {
    id: 3,
    // Scenario: Delivery / Maintenance
    image: 'https://lh3.googleusercontent.com/d/1cKpK3knErsmgAnslSDtIXYv_zt5-AUl_',
    headline: "Rider Support",
    subtext: "Bike maintenance, tyres, or repairs. Instant credit for delivery partners. Rukna Mat.",
    fallbackColor: "bg-zinc-900"
  },
  {
    id: 4,
    // Scenario: EC Cash (Moved to Last)
    image: 'https://lh3.googleusercontent.com/d/1EhY1pYeT-uaPKPfohTitG9-DE6ywzw3d',
    headline: "EC Cash",
    subtext: "Need urgent funds? Transfer directly to your bank account instantly.",
    fallbackColor: "bg-zinc-900"
  }
];

const NEWS_ITEMS = [
  {
    id: 1,
    tag: "RBI SPEECH",
    title: "Micro Matters, Macro Momentum: Microfinance for Viksit Bharat",
    summary: "Speech by Shri Swaminathan J, Deputy Governor at the MFIN event at Mumbai on November 14, 2025. Emphasizing the need for responsible lending in the micro-finance sector.",
    date: "Nov 14, 2025",
    source: "Reserve Bank of India",
    icon: Mic,
    color: "text-blue-500",
    link: "https://www.rbi.org.in/"
  },
  {
    id: 2,
    tag: "REGULATION UPDATE",
    title: "Master Direction on Digital Lending 2025",
    summary: "New guidelines ensuring 100% transparency in Key Fact Statements (KFS) and banning floating interest rates for micro-loans under ₹10,000.",
    date: "Nov 12, 2025",
    source: "RBI Press Release",
    icon: Building2,
    color: "text-emerald-500",
    link: "https://www.rbi.org.in/Scripts/NotificationUser.aspx"
  },
  {
    id: 3,
    tag: "FINTECH INNOVATION",
    title: "UPI Lite X: Offline Payments for Rural India",
    summary: "NPCI launches offline transaction capabilities for feature phones, empowering street vendors to accept digital payments without internet.",
    date: "Nov 10, 2025",
    source: "NPCI News",
    icon: TrendingUp,
    color: "text-purple-500",
    link: "https://www.npci.org.in/"
  }
];

const TESTIMONIALS = [
  {
    name: "Ramesh, Auto Driver",
    quote: "CNG line was long, pocket was empty. EC1000 saved my day.",
    color: "text-blue-400"
  },
  {
    name: "Sunita, Vegetable Seller",
    quote: "I bought fresh stock early morning using the credit. Repaid by evening.",
    color: "text-emerald-400"
  },
  {
    name: "Vikram, Delivery Partner",
    quote: "Bike maintenance couldn't wait. Got it done instantly.",
    color: "text-orange-400"
  },
  {
    name: "Rahul, Student",
    quote: "My internet pack expired during exams. Renewed it in seconds.",
    color: "text-purple-400"
  }
];

// Page Content Data
const INFO_PAGES: {[key: string]: { title: string; content: React.ReactNode; icon: any }} = {
    'ethical-lending': {
        title: "Ethical Lending",
        icon: Scale,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <p className="text-lg leading-relaxed text-zinc-900 dark:text-white font-medium">
                    At EC1000 <span className="text-emerald-600 dark:text-emerald-500 font-bold">Duo</span>, we believe in ethical lending practices for the sustainable growth of our community.
                </p>
                <p className="text-base leading-relaxed">
                    We believe in providing small liquidity for your daily essentials with <span className="text-emerald-600 dark:text-emerald-400 font-bold">FlexiSmart</span> repayment options. This helps you in many ways, and that is the core idea behind EC1000 <span className="text-emerald-600 dark:text-emerald-500 font-bold">Duo</span>: <span className="text-zinc-900 dark:text-white font-bold italic">'Rukna Mat'</span> - Don't Stop. Keep Moving.
                </p>
                <p className="text-base leading-relaxed">
                    As a <span className="text-zinc-800 dark:text-zinc-100 font-semibold">Lending Service Provider (LSP)</span>, we bridge the gap by partnering with RBI-recognized banks and service providers to ensure safety and trust.
                </p>
                
                <div className="grid gap-6 mt-6">
                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 border-l-4 border-emerald-500">
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 flex items-center gap-2"><FileText size={20}/> Transparent Fees</h3>
                        <p className="text-sm">No hidden charges. You see the exact Processing Fee and APR in the Key Fact Statement (KFS) before you click 'Agree'. We believe in 100% transparency.</p>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 border-l-4 border-blue-500">
                        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 flex items-center gap-2"><IndianRupee size={20}/> Direct Fund Flow</h3>
                        <p className="text-sm">We partner with regulated NBFCs (SafeLend) ensuring 100% direct fund flow to your bank or merchant. No third-party wallets holding your money.</p>
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
        title: "Your Responsibility",
        icon: ShieldCheck,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                 <p className="text-lg leading-relaxed">
                    Financial Freedom comes with Responsibility. We empower you, and in return, we expect disciplined financial behavior.
                </p>

                <div className="space-y-8 mt-8">
                    <div>
                        <h3 className="text-zinc-900 dark:text-white font-bold text-xl mb-2 text-emerald-600 dark:text-emerald-400">Build Trust</h3>
                        <p className="text-sm leading-relaxed">Your repayment behavior is your 'Social Capital'. Timely repayments unlock higher limits (up to ₹5,000) and better products in the future.</p>
                    </div>

                    <div>
                        <h3 className="text-zinc-900 dark:text-white font-bold text-xl mb-2 text-blue-600 dark:text-blue-400">Smart Usage</h3>
                        <p className="text-sm leading-relaxed">Use EC1000 <span className="text-emerald-600 dark:text-emerald-500 font-bold">Duo</span> for high-efficiency needs—full tank fuel to save station visits, or bulk data packs to save money. Don't use it for impulse spending.</p>
                    </div>

                    <div>
                        <h3 className="text-zinc-900 dark:text-white font-bold text-xl mb-2 text-red-600 dark:text-red-400">Timely Repayments</h3>
                        <p className="text-sm leading-relaxed">We sync repayments with your earning cycle (e.g., Weekly for delivery partners). Missing payments affects your credit score (CIBIL) and blocks future access to credit.</p>
                    </div>
                </div>
            </div>
        )
    },
    'rbi-rules': {
        title: "Regulatory Disclosures",
        icon: Building2,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <div className="bg-zinc-100 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-500 uppercase font-bold mb-1">Lending Service Provider (LSP)</p>
                    <p className="text-xl text-zinc-900 dark:text-white font-bold">EC1000 <span className="text-emerald-600 dark:text-emerald-500">Duo</span> (Rukna Mat)</p>
                </div>

                 <div className="bg-zinc-100 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-500 uppercase font-bold mb-1">Regulated Entity (RE)</p>
                    <p className="text-xl text-zinc-900 dark:text-white font-bold">SafeLend NBFC</p>
                    <p className="text-xs text-zinc-500 mt-1">RBI Reg No. 12.34567</p>
                </div>

                <div className="mt-8">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-4">Grievance Redressal</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 border-l-2 border-zinc-600 space-y-2">
                        <p className="text-sm"><span className="text-zinc-500">Officer Name:</span> Mr. Vinay Kumar</p>
                        <p className="text-sm"><span className="text-zinc-500">Email:</span> grievance@ec1000.in</p>
                        <p className="text-sm"><span className="text-zinc-500">Phone:</span> 022-1234-5678</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2">Digital Lending Guidelines 2025</h3>
                    <p className="text-sm leading-relaxed">
                        We fully adhere to RBI's guidelines regarding Key Fact Statements (KFS), cooling-off periods, and direct fund transfers.
                    </p>
                </div>
            </div>
        )
    },
    'about-us': {
        title: "About EC1000 Duo",
        icon: Globe,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Solving the 'Nano-Credit Vacuum'</h3>
                <p className="text-base leading-relaxed">
                    India's informal economy runs on speed. But traditional loans are too slow, and asking friends is awkward. 
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold"> EC1000 Duo</span> is the 'Operational Liquidity Utility' for the mass-market—delivery riders, auto drivers, and gig workers.
                </p>
                <p className="text-base leading-relaxed">
                    We don't just give money; we ensure you <span className="text-zinc-900 dark:text-white font-bold italic">'Rukna Mat'</span> (Don't Stop). Whether it's fuel, data, or pharmacy needs, we bridge the gap instantly.
                </p>

                {/* Updated to show Dual Offerings clearly */}
                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Our Dual Offerings</h4>
                    
                    <div className="space-y-4">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-l-2 border-blue-500">
                            <h5 className="font-bold text-blue-600 dark:text-blue-400 text-lg">1. EC Spend</h5>
                            <p className="text-sm mt-1">
                                A dedicated limit of <span className="text-zinc-900 dark:text-white font-bold">up to ₹1000</span> for your essential daily needs. Use it at listed counters for Fuel, Grocery, Pharma, and Utility Bills.
                            </p>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-l-2 border-emerald-500">
                            <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">2. EC Cash</h5>
                            <p className="text-sm mt-1">
                                Need cash in hand? Get direct fund disbursal to your verified bank account instantly for any other emergency needs.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 text-center">
                         <p className="text-3xl font-bold text-zinc-900 dark:text-white">10M+</p>
                         <p className="text-xs text-zinc-500 uppercase mt-1">Lives Impacted</p>
                    </div>
                     <div className="bg-zinc-100 dark:bg-zinc-800 p-4 text-center">
                         <p className="text-3xl font-bold text-zinc-900 dark:text-white">₹500Cr</p>
                         <p className="text-xs text-zinc-500 uppercase mt-1">Credit Disbursed</p>
                    </div>
                </div>
            </div>
        )
    },
    'privacy-policy': {
        title: "Privacy Policy",
        icon: Lock,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <p className="text-sm text-zinc-400">Last Updated: November 15, 2025</p>
                
                <h3 className="text-zinc-900 dark:text-white font-bold text-lg">1. Data Collection</h3>
                <p className="text-sm leading-relaxed">
                    We collect minimal data required for underwriting:
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-500 dark:text-zinc-400">
                        <li><strong>Identity:</strong> Name, Aadhaar, PAN (for KYC).</li>
                        <li><strong>Financial SMS:</strong> Transactional SMS logs to assess repayment capacity (read-only).</li>
                        <li><strong>Device Data:</strong> Model, OS version for fraud prevention.</li>
                        <li><strong>Location:</strong> One-time capture during onboarding for regulatory compliance.</li>
                    </ul>
                </p>

                <h3 className="text-zinc-900 dark:text-white font-bold text-lg">2. Data Usage</h3>
                <p className="text-sm leading-relaxed">
                    Your data is used strictly for:
                    <br/>- Verifying identity and fraud prevention.
                    <br/>- Assessing creditworthiness for the ₹1000 limit.
                    <br/>- Processing repayments via NACH/UPI.
                </p>

                <h3 className="text-zinc-900 dark:text-white font-bold text-lg">3. Data Security</h3>
                <p className="text-sm leading-relaxed">
                    All data is encrypted in transit (TLS 1.2) and at rest (AES-256). We do not share your data with third parties for marketing.
                </p>
            </div>
        )
    },
    'terms': {
        title: "Terms of Service",
        icon: FileText,
        content: (
            <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <h3 className="text-zinc-900 dark:text-white font-bold text-lg">1. Eligibility</h3>
                <p className="text-sm leading-relaxed">
                    You must be an Indian citizen, aged 18-60 years, with a valid bank account and Aadhaar linked mobile number.
                </p>

                <h3 className="text-zinc-900 dark:text-white font-bold text-lg">2. Products & Limits</h3>
                <p className="text-sm leading-relaxed">
                    <strong>EC Spend:</strong> Maximum limit of ₹1000 restricted to specific merchant categories (Fuel, Grocery, Pharma).<br/>
                    <strong>EC Cash:</strong> Direct bank transfer facility based on user eligibility.<br/>
                    Usage implies agreement to the Key Fact Statement (KFS) generated at the time of transaction.
                </p>

                <h3 className="text-zinc-900 dark:text-white font-bold text-lg">3. Repayment</h3>
                <p className="text-sm leading-relaxed">
                    Repayments are auto-debited based on the schedule selected. Failure to repay triggers a late fee of ₹10 per day (capped at ₹100) and impacts your CIBIL score.
                </p>
            </div>
        )
    },
    'grievance': {
        title: "Grievance Redressal",
        icon: Scale, 
        content: (
             <div className="space-y-6 text-zinc-600 dark:text-zinc-300">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-6 border-l-4 border-emerald-500">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-4">Level 1: Customer Support</h3>
                    <p className="text-sm mb-2"><span className="text-zinc-500">Email:</span> support@ec1000.in</p>
                    <p className="text-sm"><span className="text-zinc-500">Timeline:</span> 24-48 Hours</p>
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-800 p-6 border-l-4 border-blue-500">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-4">Level 2: Grievance Officer</h3>
                    <p className="text-sm mb-2"><span className="text-zinc-500">Name:</span> Mr. Vinay Kumar</p>
                    <p className="text-sm mb-2"><span className="text-zinc-500">Email:</span> grievance@ec1000.in</p>
                    <p className="text-sm mb-2"><span className="text-zinc-500">Phone:</span> 022-4567-8900</p>
                    <p className="text-sm"><span className="text-zinc-500">Address:</span> Unit 401, Fintech Park, BKC, Mumbai - 400051</p>
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-800 p-6 border-l-4 border-red-500">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-4">Level 3: RBI Sachet</h3>
                    <p className="text-sm leading-relaxed">
                        If your issue is not resolved within 30 days, you may lodge a complaint on the RBI CMS portal: <a href="https://cms.rbi.org.in" target="_blank" className="text-blue-400 underline">cms.rbi.org.in</a>
                    </p>
                </div>
            </div>
        )
    }
};

export const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null); // 'menu', 'recharge', or page keys
  const [videoError, setVideoError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Inline Onboarding State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync state with history for back navigation support
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

  // Force video autoplay on mount and handle mute
  useEffect(() => {
    if (currentSlide === 0 && !videoError && videoRef.current) {
        // Attempt to play
        const attemptPlay = async () => {
             try {
                 videoRef.current!.muted = true;
                 await videoRef.current!.play();
             } catch (e) {
                 console.warn("Autoplay failed", e);
                 // If autoplay fails, we can fall back to the image to avoid stuck loading state
                 setVideoError(true);
             }
        };

        // Fallback timeout: if video doesn't play within 3s, show image
        const timeout = setTimeout(() => {
            if (videoRef.current && (videoRef.current.networkState === 3 || videoRef.current.readyState === 0)) {
               setVideoError(true); 
            }
        }, 3000); 

        attemptPlay();

        return () => clearTimeout(timeout);
    }
  }, [currentSlide, videoError]);

  const openOverlay = (name: string) => {
      setActiveOverlay(name);
      window.history.pushState({ stage: AppStage.LANDING, overlay: name }, '');
  };

  const closeOverlay = () => {
      if (activeOverlay) {
          window.history.back(); // This triggers popstate, which sets ActiveOverlay to null
      }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, clientHeight } = scrollContainerRef.current;
      const index = Math.round(scrollTop / clientHeight);
      setCurrentSlide(index);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: index * scrollContainerRef.current.clientHeight,
        behavior: 'smooth'
      });
    }
  };

  const handlePhoneSubmit = () => {
      if (phone.length === 10) {
          setShowOtp(true);
      }
  };

  const handleVerifyOtp = () => {
      if (otp.length === 4) {
          setIsVerifying(true);
          setTimeout(() => {
              setIsVerifying(false);
              onGetStarted(phone);
          }, 1000);
      }
  };

  const menuItems = [
    { label: "How it Works", action: () => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: "Ethical Lending", action: () => openOverlay('ethical-lending') },
    { label: "Your Responsibility", action: () => openOverlay('user-responsibility') },
    { label: "RBI Rules & Partners", action: () => openOverlay('rbi-rules') },
    { label: "About Us", action: () => openOverlay('about-us') },
    { label: "Contact Support", action: () => openOverlay('grievance') },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans relative text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Sticky Header - Ash Grey Theme - Sharp Edges */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm z-40 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 transition-all duration-300 pt-[env(safe-area-inset-top)]">
        <div className="flex flex-col justify-center">
            <div className="flex items-baseline space-x-3">
                <span className="font-bold text-4xl md:text-5xl text-zinc-900 dark:text-white leading-none tracking-tighter">EC1000</span>
                <span className="font-bold text-4xl md:text-5xl text-emerald-600 dark:text-emerald-500 leading-none tracking-tighter">Duo</span>
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <button 
                onClick={toggleTheme}
                className="p-3 text-zinc-500 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <button 
                onClick={() => openOverlay('menu')}
                className="p-3 text-zinc-500 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <Menu size={24} />
            </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {activeOverlay === 'menu' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeOverlay}></div>
          <div className="relative w-64 md:w-80 bg-white dark:bg-zinc-900 h-full shadow-2xl p-6 flex flex-col animate-slide-in-right border-l border-zinc-200 dark:border-zinc-800 pt-[calc(1.5rem+env(safe-area-inset-top))]">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">Menu</span>
              <button onClick={closeOverlay} className="text-zinc-400 hover:text-red-500 transition-colors p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {menuItems.map((item, index) => (
                <button 
                  key={index} 
                  className="block w-full text-left text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-4 text-base font-medium border-b border-zinc-100 dark:border-zinc-800/50 transition-colors"
                  onClick={() => {
                      if(item.label === 'How it Works') {
                          closeOverlay();
                          setTimeout(item.action, 300); // Wait for menu close
                      } else {
                          // Replace menu state with content state (replaceState logic handled by just pushing new state, menu closes naturally if not stacked)
                          // Actually, we want to go from Menu -> Content.
                          // So we push new state.
                          item.action();
                      }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-6 text-xs text-zinc-500 font-medium pb-[env(safe-area-inset-bottom)]">
              v1.0.0 • EC1000 <span className="text-emerald-600 dark:text-emerald-500">Duo</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Pages Modal (Ethical Lending, etc) */}
      {activeOverlay && INFO_PAGES[activeOverlay] && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeOverlay}></div>
            <div className="relative w-full md:w-[600px] bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 sticky top-0 z-10 pt-[calc(1.5rem+env(safe-area-inset-top))]">
                    <div className="flex items-center gap-3">
                        <button onClick={closeOverlay} className="p-2 -ml-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400">
                            <ChevronLeft size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            {/* @ts-ignore */}
                            {React.createElement(INFO_PAGES[activeOverlay].icon, { size: 24, className: "text-emerald-600 dark:text-emerald-500" })}
                            {INFO_PAGES[activeOverlay].title}
                        </h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    {INFO_PAGES[activeOverlay].content}
                </div>
                <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                    <Button fullWidth onClick={closeOverlay} variant="secondary">Close</Button>
                </div>
            </div>
          </div>
      )}

      {/* Recharge Modal Overlay */}
      {activeOverlay === 'recharge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeOverlay}></div>
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90dvh] overflow-y-auto rounded-none border border-zinc-200 dark:border-zinc-700 shadow-2xl animate-fade-in">
             <div className="sticky top-0 bg-zinc-50 dark:bg-zinc-950 p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center z-10">
                <div>
                   <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Recharge Hub</h2>
                   <p className="text-zinc-500 dark:text-zinc-400 text-sm">Select a provider to proceed with EC1000 credit</p>
                </div>
                <button onClick={closeOverlay} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
                   <X className="text-zinc-900 dark:text-white" />
                </button>
             </div>
             
             <div className="p-6 space-y-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                {RECHARGE_PROVIDERS.map((category) => (
                   <div key={category.category}>
                      <div className="flex items-center space-x-2 mb-4">
                         <category.icon className={category.color} size={24} />
                         <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{category.category}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {category.brands.map((brand) => (
                            <a 
                               key={brand.name}
                               href={brand.url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="bg-zinc-50 dark:bg-white hover:bg-zinc-100 p-6 flex flex-col items-center justify-center space-y-4 transition-all hover:scale-105 group border border-zinc-200"
                            >
                               <div className="h-12 w-full flex items-center justify-center">
                                  <img 
                                    src={brand.logo} 
                                    alt={brand.name} 
                                    className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" 
                                    referrerPolicy="no-referrer"
                                  />
                               </div>
                               <span className="text-zinc-800 font-bold text-sm">{brand.name}</span>
                            </a>
                         ))}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[calc(100dvh-64px)] min-h-[500px] bg-zinc-50 dark:bg-zinc-900 mt-16 group">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full h-full flex flex-col overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`w-full h-full flex-shrink-0 snap-center relative overflow-hidden bg-zinc-900 rounded-none`}
              role="img"
              aria-label={slide.headline}
            >
              {/* Conditional Iframe, Video or Image Background */}
              {/* @ts-ignore */}
              {slide.iframeUrl ? (
                  <iframe
                      src={`${slide.iframeUrl}?autoplay=1&mute=1&controls=0&loop=1`}
                      className="absolute inset-0 w-[300%] h-full -ml-[100%] md:w-full md:ml-0 object-cover z-0"
                      allow="autoplay; encrypted-media"
                      title={slide.headline}
                      style={{ pointerEvents: 'none' }} // Prevent interaction with Drive UI for background effect
                  ></iframe>
              ) : (
                /* @ts-ignore */
                slide.video && !videoError ? (
                   <video
                      ref={slide.id === 0 ? videoRef : null}
                      key={slide.video}
                      poster={slide.image} // Fallback image shown while loading
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0 rounded-none"
                      onError={() => setVideoError(true)}
                   >
                      <source src={slide.video} />
                   </video>
                ) : (
                  <>
                      {slide.image && (
                          <img 
                              src={slide.image} 
                              alt={slide.headline}
                              className={`absolute inset-0 w-full h-full z-0 rounded-none object-cover`}
                              referrerPolicy="no-referrer"
                          />
                      )}
                  </>
                )
              )}

              {/* Gradient Overlay - Darkened top AND bottom for better text readability on white text */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 pointer-events-none"></div>
              
              {/* Text Content - Layout Restructured */}
              
              {/* Subtext - Extreme Top Left - Minimal Padding */}
              <div className="absolute top-0 left-0 z-20 px-4 pt-4 md:px-6 md:pt-8 max-w-2xl pointer-events-none text-left">
                <p className={`text-2xl md:text-4xl font-bold tracking-wide leading-tight shadow-sm drop-shadow-md text-white`}>
                    {slide.subtext}
                </p>
              </div>

              {/* Headline and Button - Extreme Bottom Right - Inline Stack with Faded Line */}
              <div className="absolute bottom-0 right-0 z-30 flex flex-row items-center gap-6 pointer-events-none justify-end w-full max-w-full px-4 pb-4 md:px-6 md:pb-6">
                  {/* Headline - Inline with CTA */}
                  <h1 className={`text-2xl md:text-6xl font-extrabold leading-none tracking-tight shadow-sm drop-shadow-md text-right text-white`}>
                    {slide.headline.split('Duo').map((part, i, arr) => (
                        <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && <span className="text-emerald-500">Duo</span>}
                        </React.Fragment>
                    ))}
                  </h1>

                  {/* Stylish Violet Vertical Line */}
                  <div className="h-12 md:h-20 w-1.5 bg-violet-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)] hidden md:block transform rotate-0 mx-2"></div>
                  
                  {/* CTA Button */}
                  <div className="pointer-events-auto shrink-0">
                      <Button 
                        onClick={() => {
                           if (slide.id === 1) { // Data & Entertainment Slide
                              openOverlay('recharge');
                           } else {
                              document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' });
                           }
                        }} 
                        className={`bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl font-bold tracking-wide border-none px-6 py-4 md:px-8 md:py-5 text-base md:text-lg transition-transform hover:scale-105 flex items-center gap-2 rounded-none`}
                      >
                        {slide.id === 0 && "Explore Now"}
                        {slide.id === 1 && "Recharge Now"}
                        {slide.id === 2 && "Fuel Now"}
                        {slide.id === 3 && "Fix Now"}
                        {slide.id === 4 && "Get Cash"}
                      </Button>
                  </div>
              </div>

            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-4 pointer-events-none">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`transition-all duration-300 pointer-events-auto shadow-sm ${
                index === currentSlide 
                    ? 'w-1 h-8 bg-white opacity-100' 
                    : 'w-1 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Access / Steps Section - Compact Layout */}
      <section id="steps" className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 scroll-mt-16">
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row shadow-sm">
                
                {/* Left Column: Steps List - More Compact */}
                <div className="w-full md:w-1/2 p-6 md:p-12 bg-zinc-50 dark:bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-6 md:mb-8">Access EC1000 <span className="text-emerald-600 dark:text-emerald-500">Duo</span> in 3 Steps</h2>
                    
                    <div className="space-y-6">
                        <div className="flex flex-row items-start space-x-4">
                             <div className="shrink-0">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base border border-blue-200 dark:border-blue-800">1</div>
                             </div>
                             <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-0.5">Enter Mobile</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Enter your phone number to start.</p>
                             </div>
                        </div>

                        <div className="flex flex-row items-start space-x-4">
                             <div className="shrink-0">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-200 dark:border-emerald-800">2</div>
                             </div>
                             <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-0.5">Verify</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Input your Pan, Aadhaar + selfie for ekyc verification</p>
                             </div>
                        </div>

                        <div className="flex flex-row items-start space-x-4">
                             <div className="shrink-0">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-base border border-orange-200 dark:border-orange-800">3</div>
                             </div>
                             <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white text-lg mb-0.5">Get Limits</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Access EC1000 <span className="text-emerald-600 dark:text-emerald-500">Duo</span> instantly</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Input Form - Compact */}
                <div className="w-full md:w-1/2 p-6 md:p-12 bg-white dark:bg-zinc-900 flex flex-col justify-center">
                     <div className="max-w-lg mx-auto w-full">
                        <h3 className="text-base md:text-lg font-medium text-zinc-500 dark:text-zinc-400 mb-6 whitespace-nowrap">Enter Mobile Number to Start</h3>

                        <div className="flex items-end gap-3">
                             <div className="relative flex-1 flex items-center border-b-2 border-zinc-200 dark:border-zinc-700 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 py-2 transition-colors">
                                {/* Phone Input Stage */}
                                {!showOtp && (
                                    <>
                                        <span className="text-2xl md:text-4xl font-bold text-zinc-400 dark:text-zinc-600 mr-3 select-none">+91</span>
                                        <input 
                                            type="tel" 
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhone(val);
                                            }}
                                            className="w-full bg-transparent text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700 tracking-wide"
                                            placeholder="98765 43210"
                                            maxLength={10}
                                        />
                                    </>
                                )}

                                {/* OTP Input Stage */}
                                {showOtp && (
                                    <div className="flex-1 flex items-center justify-center animate-slide-in-right">
                                         <input 
                                            type="text" 
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 4) setOtp(val);
                                            }}
                                            className="w-full bg-transparent text-center text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white outline-none tracking-[0.5em] placeholder:tracking-normal placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                            placeholder="OTP"
                                            maxLength={4}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="shrink-0 mb-1">
                                {!showOtp ? (
                                    <Button 
                                        onClick={handlePhoneSubmit}
                                        disabled={phone.length !== 10}
                                        size="md"
                                        className="rounded-full py-2 px-6 text-sm font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        Get OTP
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleVerifyOtp}
                                        disabled={otp.length !== 4 || isVerifying}
                                        size="md"
                                        className={`rounded-full py-2 px-6 text-sm font-bold shadow-lg whitespace-nowrap ${otp.length === 4 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}
                                    >
                                        {isVerifying ? <Loader2 className="animate-spin w-4 h-4" /> : 'Verify'}
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        {showOtp && (
                            <div className="flex justify-between mt-4 px-1">
                                <button onClick={() => {setShowOtp(false); setOtp('');}} className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline">Change Number</button>
                                <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"><RotateCcw size={12} /> Resend OTP</button>
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>
      </section>

      {/* Features - Clean Icons, No Boxes */}
      <section className="bg-white dark:bg-zinc-900 relative border-b border-zinc-200 dark:border-zinc-800">
         <div className="w-full">
            <div className="text-left py-12 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                 <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm block mb-2">Features</span>
                 {/* Removed 'Designed for the Common Man' headline as requested */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                {/* EC Cash */}
                <div className="group relative bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-8 md:p-12 transition-colors text-left flex flex-row items-start space-x-6">
                    <div className="shrink-0 text-blue-600 dark:text-blue-500 mt-1">
                        <Banknote size={48} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">EC Cash</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                            <span className="font-bold text-zinc-900 dark:text-white">₹1000 instant</span> directly to your bank account.
                        </p>
                    </div>
                </div>

                {/* EC Spend */}
                <div className="group relative bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-8 md:p-12 transition-colors text-left flex flex-row items-start space-x-6">
                    <div className="shrink-0 text-purple-600 dark:text-purple-500 mt-1">
                        <ScanLine size={48} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">EC Spend</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                            Pay for <span className="font-bold text-zinc-900 dark:text-white">fuel & groceries</span> instantly via QR scan.
                        </p>
                    </div>
                </div>

                {/* Flexible Repay */}
                <div className="group relative bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-8 md:p-12 transition-colors text-left flex flex-row items-start space-x-6">
                    <div className="shrink-0 text-orange-600 dark:text-orange-500 mt-1">
                        <Repeat size={48} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Flexible Repay</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                            Small <span className="font-bold text-zinc-900 dark:text-white">daily, weekly, bi-weekly</span> aligned with your earnings cycles.
                        </p>
                    </div>
                </div>

                {/* Build Trust */}
                <div className="group relative bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 p-8 md:p-12 transition-colors text-left flex flex-row items-start space-x-6">
                    <div className="shrink-0 text-emerald-600 dark:text-emerald-500 mt-1">
                        <ShieldCheck size={48} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Build Trust</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                            Good usage behavior unlocks <span className="font-bold text-zinc-900 dark:text-white">higher limits</span>.
                        </p>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Partners Strip - Full width - Left Aligned */}
      <section className="py-10 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-8 text-left text-zinc-600 dark:text-zinc-300 text-base md:text-lg font-bold tracking-wide uppercase flex-wrap">
                <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-200">
                    <ShieldCheck className="text-green-600 dark:text-green-500" size={28} />
                    <span>RBI Inspired</span>
                </div>
                <div className="h-6 w-0.5 bg-zinc-300 dark:bg-zinc-600 hidden md:block"></div>
                <div>Reputed Banks & NBFC</div>
                <div className="h-6 w-0.5 bg-zinc-300 dark:bg-zinc-600 hidden md:block"></div>
                <div>UPI Enabled</div>
                <div className="h-6 w-0.5 bg-zinc-300 dark:bg-zinc-600 hidden md:block"></div>
                <div>NPCI Compliant</div>
                <div className="bg-white dark:bg-zinc-900 text-green-700 dark:text-green-400 px-6 py-2 text-sm md:text-base font-bold border-2 border-green-200 dark:border-green-900 rounded-full shadow-sm">
                    RBI Digital Lending 2025
                </div>
            </div>
        </div>
      </section>

      {/* Financial Feed - Rectangular Grid, No Gaps, Real Content, Horizontal Layout */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-full">
             <div className="p-6 md:p-8 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight whitespace-nowrap">Financial News & Updates</h2>
                 <div className="flex items-center space-x-2 text-red-500 animate-pulse mt-0">
                     <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                     <span className="text-xs font-bold uppercase tracking-wider">Live Feed</span>
                 </div>
             </div>
             
             {/* Full width rectangular grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                 {NEWS_ITEMS.map((item) => (
                     <a 
                        key={item.id} 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all p-6 md:p-8 group cursor-pointer flex flex-row items-center space-x-6 h-full block"
                     >
                         {/* Icon aligned center - No Box */}
                         <div className={`shrink-0 ${item.color}`}>
                            <item.icon size={36} strokeWidth={1.5} />
                         </div>
                         
                         {/* Content right */}
                         <div className="flex flex-col h-full w-full">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-1">{item.tag}</span>
                                <ExternalLink size={14} className="text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 leading-relaxed">
                                {item.summary}
                            </p>
                            <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-700/50 flex justify-between items-center">
                                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{item.source}</span>
                                 <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{item.date}</span>
                            </div>
                         </div>
                     </a>
                 ))}
             </div>
             
             <div className="bg-white dark:bg-zinc-900 p-4 border-b border-zinc-200 dark:border-zinc-800 text-right">
                 <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-bold inline-flex items-center gap-2 group px-4 py-2">
                     View All Updates <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
          </div>
      </section>

      {/* Testimonials - Rectangular Grid, No Gaps, Horizontal Layout */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-full">
            <div className="p-8 md:p-12 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                 <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Community Stories</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
                {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors p-8 flex flex-col h-full">
                        <div className="flex flex-row items-center space-x-4 mb-6">
                            <div className={`shrink-0 w-14 h-14 flex items-center justify-center font-bold text-2xl ${t.color} bg-transparent border-2 border-zinc-300 dark:border-zinc-700 rounded-full`}>
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-white text-lg">{t.name}</p>
                            </div>
                        </div>
                        <div className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-6">
                            <p className="text-zinc-600 dark:text-zinc-300 text-xl italic leading-relaxed">"{t.quote}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer - Zinc 950 - Left Aligned */}
      <footer className="bg-zinc-100 dark:bg-zinc-950 py-12 border-t border-zinc-200 dark:border-zinc-900 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-zinc-200 dark:border-zinc-900 pb-8">
                 {/* Logo - simplified for footer */}
                <div className="flex items-baseline space-x-1">
                    <span className="font-bold text-2xl text-zinc-900 dark:text-white tracking-tight">EC1000</span>
                    <span className="font-bold text-2xl text-emerald-600 dark:text-emerald-500 tracking-tight">Duo</span>
                </div>

                {/* Flat Links - Aligned right on desktop, center on mobile */}
                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    <button onClick={() => openOverlay('grievance')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Grievance Redressal</button>
                    <button onClick={() => openOverlay('rbi-rules')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">RBI Disclosures</button>
                    <button onClick={() => openOverlay('privacy-policy')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</button>
                    <button onClick={() => openOverlay('terms')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</button>
                    <button onClick={() => openOverlay('grievance')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Us</button>
                </div>
            </div>

            {/* Tagline & Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center text-zinc-600 dark:text-zinc-600 text-xs">
                <p className="font-medium text-zinc-500 mb-2 md:mb-0">EC1000 <span className="text-emerald-600 dark:text-emerald-500">Duo</span> - Your liquidity partner for daily essentials.</p>
                <p>© 2025 EC1000 <span className="text-emerald-600 dark:text-emerald-500">Duo</span>. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};
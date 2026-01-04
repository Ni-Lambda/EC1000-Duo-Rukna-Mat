export enum AppStage {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  QUICK_LOGIN = 'QUICK_LOGIN',
  DASHBOARD = 'DASHBOARD',
}

export enum OnboardingStep {
  PHONE_ENTRY = 0,
  DETAILS = 1,     // Name, Email, Aadhaar, PAN
  CONSENT = 2,     // UPI Auto Debit Consent
  SECURITY = 3,    // Set PIN & Biometric
  COMPLETE = 4
}

export enum SpendCategoryType {
  EC_CASH = 'EC Cash (Self Transfer)', // Updated Name
  FUEL = 'Fuel',
  PHARMA = 'Pharma',
  GROCERY = 'Grocery',
  MOBILE = 'Mobile Recharge',
  DTH = 'DTH/OTT',
  BILLS = 'Bill Payments',
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  category?: SpendCategoryType;
}

export interface UserState {
  isAuth: boolean;
  isOnboarded: boolean;
  
  // Spend Line (Shared across Fuel, Grocery, etc.)
  totalLimit: number; 
  usedAmount: number;

  // Cash Line (Separate)
  cashLimit: number;
  cashUsed: number;

  name: string;
  phone?: string;
  pin?: string;
  
  // Progression
  creditLevel: number; // Level 1, 2, 3...
  ecScore: number; 
}

export interface RepaymentPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  interest: string;
  fee: number;
  // Added fields for detailed breakdown
  principal?: number;
  interestAmount?: number;
  totalPayable?: number;
  dueDate?: string; 
  installments?: number;
  installmentAmount?: number;
  frequency?: string;
}

export const SPEND_CATEGORIES = [
  { id: 1, type: SpendCategoryType.EC_CASH, icon: 'Banknote', isAppOnly: true, color: 'text-green-600' },
  { id: 2, type: SpendCategoryType.FUEL, icon: 'Fuel', isAppOnly: false, color: 'text-orange-600' },
  { id: 3, type: SpendCategoryType.PHARMA, icon: 'Pill', isAppOnly: false, color: 'text-pink-600' },
  { id: 4, type: SpendCategoryType.GROCERY, icon: 'ShoppingBasket', isAppOnly: false, color: 'text-green-700' },
  { id: 5, type: SpendCategoryType.MOBILE, icon: 'Smartphone', isAppOnly: true, color: 'text-blue-600' },
  { id: 6, type: SpendCategoryType.DTH, icon: 'Tv', isAppOnly: true, color: 'text-purple-600' },
  { id: 7, type: SpendCategoryType.BILLS, icon: 'Receipt', isAppOnly: true, color: 'text-yellow-600' },
];
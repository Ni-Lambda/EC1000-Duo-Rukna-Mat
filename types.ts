
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
  EC_CASH = 'EC Cash (Bank Transfer)',
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
  balance: number;
  totalLimit: number;
  usedAmount: number;
  name: string;
  phone?: string;
  pin?: string;
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
  { id: 1, type: SpendCategoryType.EC_CASH, icon: 'Banknote', isAppOnly: true },
  { id: 2, type: SpendCategoryType.FUEL, icon: 'Fuel', isAppOnly: false },
  { id: 3, type: SpendCategoryType.PHARMA, icon: 'Pill', isAppOnly: false },
  { id: 4, type: SpendCategoryType.GROCERY, icon: 'ShoppingBasket', isAppOnly: false },
  { id: 5, type: SpendCategoryType.MOBILE, icon: 'Smartphone', isAppOnly: true },
  { id: 6, type: SpendCategoryType.DTH, icon: 'Tv', isAppOnly: true },
  { id: 7, type: SpendCategoryType.BILLS, icon: 'Receipt', isAppOnly: true },
];
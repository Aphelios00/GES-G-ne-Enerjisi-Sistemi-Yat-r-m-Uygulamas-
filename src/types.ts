export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  balance: number; // in TRY, default 12450.00
  todayEarnings: number; // in TRY, default 142.20
  totalBalanceUsd: number; // in USD (or TRY), standard balance
  treesSaved: number; // default 42
  co2Prevented: number; // default 1.2
  notificationEnabled: boolean;
  twoFactorEnabled: boolean;
  ecoFriendlyServerMode: boolean;
  reportEnabled: boolean;
  userTier: 'STANDART' | 'PREMIUM';
  avatarUrl?: string;
}

export type PlantStatus = 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';

export interface SolarPlant {
  id: string;
  name: string;
  location: string;
  sharePercentage: number;
  capacityKw: number;
  status: PlantStatus;
  imageUrl: string;
  currentGeneration: number; // in kWh
  efficiencyRating?: number; // % e.g. 19.4
  panelsCount?: number; // e.g. 1200
  dailyYieldGoal?: number; // e.g. 1800
  temperature?: number; // e.g. 34.2
  installationDate?: string; // e.g. '12.04.2023'
  latitude?: number;
  longitude?: number;
}

export type TransactionStatus = 'TAMAMLANDI' | 'İŞLEMDE' | 'İPTAL';
export type TransactionType = 'INCOME' | 'WITHDRAWAL';

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
}

export interface SavedAccount {
  id: string;
  bankName: string;
  iban: string;
}

export type WithdrawalStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface WithdrawalRequest {
  id: string;
  amount: number;
  bankName: string;
  iban: string;
  status: WithdrawalStatus;
  createdAt: string;
  txHash: string;
}

export interface BlockchainLog {
  txHash: string;
  status: 'Onaylandı' | 'İşlemde';
  details: string;
  timeString: string;
}

export type ActiveTab = 'dashboard' | 'portfolio' | 'finances' | 'impact' | 'verify';

export interface WithdrawalDetails {
  amount: number;
  bankName: string;
  iban: string;
  txHash: string;
  date: string;
}

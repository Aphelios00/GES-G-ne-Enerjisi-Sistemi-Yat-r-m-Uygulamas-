import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  SolarPlant, 
  Transaction, 
  SavedAccount, 
  WithdrawalRequest, 
  BlockchainLog, 
  ActiveTab,
  WithdrawalDetails
} from '../types';

interface SolarContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // User Profile State
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  deductBalance: (amount: number) => boolean;
  
  // Solar Plants State
  plants: SolarPlant[];
  investInPlant: (plantId: string, additionalShare: number) => void;
  
  // Saved Bank Accounts
  savedAccounts: SavedAccount[];
  addNewAccount: (bankName: string, iban: string) => void;
  
  // Withdrawal Ledger and Steps
  withdrawals: WithdrawalRequest[];
  initiateWithdrawal: (amount: number, bankName: string, iban: string) => WithdrawalDetails | null;
  currentWithdrawalDetails: WithdrawalDetails | null;
  setWithdrawalStep: (step: 'none' | 'form' | 'success') => void;
  withdrawalStep: 'none' | 'form' | 'success';
  
  // Blockchain Logs/Verify Screen
  blockchainLogs: BlockchainLog[];
  addBlockchainLog: (log: BlockchainLog) => void;
  systemStatus: 'active' | 'synced';
  lastSyncTime: number; // minutes ago
  
  // Dynamic Realtime Energy Production
  instantProduction: number; // in kWh
}

const SolarContext = createContext<SolarContextType | undefined>(undefined);

// Helper to generate a random hex string for transaction hashes
const generateTxHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 8; i++) hash += chars[Math.floor(Math.random() * 16)];
  hash += '...';
  for (let i = 0; i < 4; i++) hash += chars[Math.floor(Math.random() * 16)];
  return hash;
};

export const SolarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [withdrawalStep, setWithdrawalStep] = useState<'none' | 'form' | 'success'>('none');
  const [currentWithdrawalDetails, setCurrentWithdrawalDetails] = useState<WithdrawalDetails | null>(null);

  // Instant Production state (highly dynamic, fluctuating nicely)
  const [instantProduction, setInstantProduction] = useState<number>(42.5);

  // Initialize data with local storage persistence to respect "real-world" behaviors
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const defaultProfile: UserProfile = {
      uid: 'mehmet_clean_user',
      name: 'Mehmet',
      email: 'volkansayin532@gmail.com',
      phone: '+90 532 123 45 67',
      balance: 12450.00,
      todayEarnings: 142.20,
      totalBalanceUsd: 18450.00,
      treesSaved: 42,
      co2Prevented: 1.2,
      notificationEnabled: true,
      twoFactorEnabled: false,
      ecoFriendlyServerMode: true,
      reportEnabled: true,
      userTier: 'STANDART'
    };
    const saved = localStorage.getItem('solarinvest_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultProfile, ...parsed };
      } catch (e) {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  const [plants, setPlants] = useState<SolarPlant[]>(() => {
    const defaultPlants: SolarPlant[] = [
      {
        id: 'plant_antalya',
        name: 'Antalya GES',
        location: 'Antalya, Türkiye',
        sharePercentage: 12.5,
        capacityKw: 450,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 22.4,
        efficiencyRating: 19.4,
        panelsCount: 1200,
        dailyYieldGoal: 1800,
        temperature: 32.5,
        installationDate: '12.04.2023',
        latitude: 36.8969,
        longitude: 30.7133
      },
      {
        id: 'plant_mugla',
        name: 'Muğla GES',
        location: 'Muğla, Türkiye',
        sharePercentage: 8.2,
        capacityKw: 320,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 16.1,
        efficiencyRating: 18.9,
        panelsCount: 850,
        dailyYieldGoal: 1280,
        temperature: 29.2,
        installationDate: '04.09.2022',
        latitude: 37.2153,
        longitude: 28.3636
      },
      {
        id: 'plant_manisa',
        name: 'Manisa GES',
        location: 'Manisa, Türkiye',
        sharePercentage: 0.0,
        capacityKw: 500,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 26.5,
        efficiencyRating: 19.1,
        panelsCount: 1350,
        dailyYieldGoal: 2000,
        temperature: 30.4,
        installationDate: '15.06.2023',
        latitude: 38.6191,
        longitude: 27.4289
      },
      {
        id: 'plant_izmir',
        name: 'İzmir GES',
        location: 'İzmir, Türkiye',
        sharePercentage: 4.5,
        capacityKw: 650,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1548613053-220ef3180556?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 34.2,
        efficiencyRating: 19.6,
        panelsCount: 1720,
        dailyYieldGoal: 2600,
        temperature: 28.1,
        installationDate: '18.01.2024',
        latitude: 38.4192,
        longitude: 27.1287
      },
      {
        id: 'plant_aydin',
        name: 'Aydın GES',
        location: 'Aydın, Türkiye',
        sharePercentage: 0.0,
        capacityKw: 420,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1620038650429-2041d8e17855?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 21.8,
        efficiencyRating: 18.8,
        panelsCount: 1100,
        dailyYieldGoal: 1680,
        temperature: 31.0,
        installationDate: '30.10.2022',
        latitude: 37.8560,
        longitude: 27.8416
      },
      {
        id: 'plant_aydin2',
        name: 'Aydın 2 GES',
        location: 'Aydın, Türkiye',
        sharePercentage: 0.0,
        capacityKw: 380,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 19.4,
        efficiencyRating: 19.2,
        panelsCount: 1000,
        dailyYieldGoal: 1500,
        temperature: 31.5,
        installationDate: '22.07.2023',
        latitude: 37.8920,
        longitude: 27.8950
      },
      {
        id: 'plant_ankara',
        name: 'Ankara GES',
        location: 'Ankara, Türkiye',
        sharePercentage: 2.1,
        capacityKw: 750,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 30.8,
        efficiencyRating: 18.4,
        panelsCount: 2000,
        dailyYieldGoal: 3000,
        temperature: 24.6,
        installationDate: '01.03.2023',
        latitude: 39.9334,
        longitude: 32.8597
      },
      {
        id: 'plant_konya',
        name: 'Konya GES',
        location: 'Konya, Türkiye',
        sharePercentage: 18.4,
        capacityKw: 1200,
        status: 'ACTIVE',
        imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
        currentGeneration: 64.9,
        efficiencyRating: 19.8,
        panelsCount: 3200,
        dailyYieldGoal: 4800,
        temperature: 26.3,
        installationDate: '10.11.2021',
        latitude: 37.8713,
        longitude: 32.4846
      }
    ];

    const saved = localStorage.getItem('solarinvest_plants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If there are less than 8 plants or we updated fields, force default list reset
        if (parsed.length < 8 || !parsed.some((p: any) => p.id === 'plant_manisa')) {
          localStorage.setItem('solarinvest_plants', JSON.stringify(defaultPlants));
          return defaultPlants;
        }
        return parsed;
      } catch (e) {
        return defaultPlants;
      }
    }
    return defaultPlants;
  });

  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    const saved = localStorage.getItem('solarinvest_accounts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'bank_ziraat', bankName: 'Ziraat Bankası', iban: 'TR62 •••• •••• 4521' },
      { id: 'bank_garanti', bankName: 'Garanti BBVA', iban: 'TR14 •••• •••• 9870' }
    ];
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('solarinvest_withdrawals');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [blockchainLogs, setBlockchainLogs] = useState<BlockchainLog[]>(() => {
    const saved = localStorage.getItem('solarinvest_blockchain');
    if (saved) return JSON.parse(saved);
    return [
      {
        txHash: '0x71C84dfa...92a4',
        status: 'Onaylandı',
        details: '12.4 kWh Üretim Kaydı',
        timeString: '8 dk önce'
      },
      {
        txHash: '0x3f2ebd3c...a8e1',
        status: 'Onaylandı',
        details: 'Yatırım Payı Güncellemesi',
        timeString: '42 dk önce'
      }
    ];
  });

  const [lastSyncTime, setLastSyncTime] = useState<number>(2); // in minutes

  // Live flux loop simulation to reflect "canlıya çıkabilecek şekilde gelişmiş"
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuates instant production naturally to convey high quality interactive UI
      setInstantProduction(prev => {
        const drift = (Math.random() - 0.48) * 0.8;
        const nextVal = prev + drift;
        return parseFloat(Math.max(38.0, Math.min(48.5, nextVal)).toFixed(1));
      });

      // Fluctuate plant generations as well
      setPlants(prevPlants => {
        const updated = prevPlants.map(plant => {
          const plantDrift = (Math.random() - 0.5) * 0.4;
          const nextGen = plant.currentGeneration + plantDrift;
          return {
            ...plant,
            currentGeneration: parseFloat(Math.max(10.0, Math.min(40.0, nextGen)).toFixed(1))
          };
        });
        localStorage.setItem('solarinvest_plants', JSON.stringify(updated));
        return updated;
      });

      // Slowly increment co2Prevented to demonstrate active operation
      setUserProfile(prev => {
        const nextCo2 = parseFloat((prev.co2Prevented + 0.0001).toFixed(6));
        const updated = { ...prev, co2Prevented: nextCo2 };
        localStorage.setItem('solarinvest_profile', JSON.stringify(updated));
        return updated;
      });

    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('solarinvest_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('solarinvest_plants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem('solarinvest_accounts', JSON.stringify(savedAccounts));
  }, [savedAccounts]);

  useEffect(() => {
    localStorage.setItem('solarinvest_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('solarinvest_blockchain', JSON.stringify(blockchainLogs));
  }, [blockchainLogs]);

  // Sync Timer Simulation
  useEffect(() => {
    const minInterval = setInterval(() => {
      setLastSyncTime(prev => {
        if (prev >= 59) return 1;
        return prev + 1;
      });
    }, 60000);
    return () => clearInterval(minInterval);
  }, []);

  // Action: Deduct balance (used in secure calculations)
  const deductBalance = (amount: number): boolean => {
    if (userProfile.balance < amount) return false;
    setUserProfile(prev => ({
      ...prev,
      balance: parseFloat((prev.balance - amount).toFixed(2))
    }));
    return true;
  };

  // Action: Add new investment to a plant
  const investInPlant = (plantId: string, additionalAmount: number) => {
    // If user has enough balance, process
    if (userProfile.balance < additionalAmount) return;
    
    deductBalance(additionalAmount);
    
    // Each 1000 TL yields +0.1% share for example purposes
    const shareYield = parseFloat((additionalAmount / 10000).toFixed(2));
    const addedCapacity = parseFloat((additionalAmount / 10).toFixed(1));

    setPlants(prevPlants => {
      const updated = prevPlants.map(p => {
        if (p.id === plantId) {
          return {
            ...p,
            sharePercentage: parseFloat((p.sharePercentage + shareYield).toFixed(2)),
            capacityKw: p.capacityKw + addedCapacity
          };
        }
        return p;
      });
      return updated;
    });

    // Award tree saves for green investments
    setUserProfile(prev => ({
      ...prev,
      treesSaved: prev.treesSaved + Math.max(1, Math.floor(additionalAmount / 2000))
    }));

    // Register a ledger transaction representing the investment
    const logHash = generateTxHash();
    addBlockchainLog({
      txHash: logHash,
      status: 'Onaylandı',
      details: `${addedCapacity} kW Yeni Yatırım Kaydı`,
      timeString: 'Şimdi'
    });
  };

  // Action: Add a new bank account verified with proper structure
  const addNewAccount = (bankName: string, iban: string) => {
    const formattedIban = iban.trim().toUpperCase();
    const cleanIban = formattedIban.length > 10 
      ? `${formattedIban.slice(0, 4)} •••• •••• ${formattedIban.slice(-4)}`
      : formattedIban;
      
    const newAcc: SavedAccount = {
      id: `bank_${Date.now()}`,
      bankName: bankName,
      iban: cleanIban
    };
    setSavedAccounts(prev => [...prev, newAcc]);
  };

  // Action: Initiate security audit checked withdrawal
  const initiateWithdrawal = (amount: number, bankName: string, iban: string): WithdrawalDetails | null => {
    if (userProfile.balance < amount || amount <= 0) return null;
    
    const wasSuccessful = deductBalance(amount);
    if (!wasSuccessful) return null;

    const txHash = generateTxHash();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newRequest: WithdrawalRequest = {
      id: `wd_${Date.now()}`,
      amount: amount,
      bankName: bankName,
      iban: iban,
      status: 'PROCESSING',
      createdAt: now.toISOString(),
      txHash: txHash
    };

    setWithdrawals(prev => [newRequest, ...prev]);

    // Push into secure blockchain logs
    addBlockchainLog({
      txHash: txHash,
      status: 'İşlemde',
      details: `Para Çekme Talebi (-${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺)`,
      timeString: 'Şimdi'
    });

    const details: WithdrawalDetails = {
      amount,
      bankName,
      iban,
      txHash,
      date: dateFormatted
    };

    setCurrentWithdrawalDetails(details);
    setWithdrawalStep('success');
    return details;
  };

  const addBlockchainLog = (log: BlockchainLog) => {
    setBlockchainLogs(prev => [log, ...prev]);
  };

  const updateUserProfile = (updatedFields: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('solarinvest_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SolarContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        updateUserProfile,
        deductBalance,
        plants,
        investInPlant,
        savedAccounts,
        addNewAccount,
        withdrawals,
        initiateWithdrawal,
        currentWithdrawalDetails,
        withdrawalStep,
        setWithdrawalStep,
        blockchainLogs,
        addBlockchainLog,
        systemStatus: 'synced',
        lastSyncTime,
        instantProduction
      }}
    >
      {children}
    </SolarContext.Provider>
  );
};

export const useSolar = () => {
  const context = useContext(SolarContext);
  if (context === undefined) {
    throw new Error('useSolar must be used within a SolarProvider');
  }
  return context;
};

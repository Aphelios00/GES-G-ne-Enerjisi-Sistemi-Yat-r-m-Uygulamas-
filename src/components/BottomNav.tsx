import React from 'react';
import { LayoutDashboard, Wallet, BarChart3, Leaf, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';
import { useSolar } from '../context/SolarContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setWithdrawalStep } = useSolar();

  const navItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portföy', icon: Wallet },
    { id: 'finances', label: 'Finans', icon: BarChart3 },
    { id: 'impact', label: 'Ekoloji', icon: Leaf },
    { id: 'verify', label: 'Şeffaflık', icon: ShieldCheck }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    // Reset withdrawal steps when jumping between nav items to maintain flow integrity
    setWithdrawalStep('none');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex justify-around items-center px-3 pb-6 pt-2 shadow-[0_-8px_30px_rgba(13,99,27,0.04)] rounded-t-2xl">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id as ActiveTab)}
            className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 relative ${
              isActive 
                ? 'bg-emerald-600 text-white font-semibold rounded-2xl px-4 py-1.5 shadow-md shadow-emerald-600/10' 
                : 'text-gray-400 hover:text-emerald-600 px-3 py-1.5'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

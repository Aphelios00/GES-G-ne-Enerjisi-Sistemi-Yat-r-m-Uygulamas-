import React from 'react';
import { SolarProvider, useSolar } from './context/SolarContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { PortfolioView } from './components/PortfolioView';
import { FinancesView } from './components/FinancesView';
import { ImpactView } from './components/ImpactView';
import { VerifyView } from './components/VerifyView';
import { AlertCircle } from 'lucide-react';

const MainScreen: React.FC = () => {
  const { activeTab } = useSolar();

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50/50 min-h-screen shadow-2xl relative flex flex-col border-x border-gray-150">
      {/* Dynamic top bar */}
      <Header />

      {/* Main scrolling viewport content area */}
      <main className="flex-grow px-5 pt-4 pb-20 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'portfolio' && <PortfolioView />}
        {activeTab === 'finances' && <FinancesView />}
        {activeTab === 'impact' && <ImpactView />}
        {activeTab === 'verify' && <VerifyView />}
      </main>

      {/* Custom persistent footer navigator */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center">
      <SolarProvider>
        <MainScreen />
      </SolarProvider>
    </div>
  );
}

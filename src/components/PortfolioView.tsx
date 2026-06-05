import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MapPin, Calendar, Percent, ShieldCheck, ChevronRight, Leaf, Info, X } from 'lucide-react';
import { useSolar } from '../context/SolarContext';

export const PortfolioView: React.FC = () => {
  const { 
    plants, 
    userProfile, 
    investInPlant 
  } = useSolar();

  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState('plant_a');
  const [investmentAmount, setInvestmentAmount] = useState('1000');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Lütfen geçerli bir yatırım tutarı giriniz.');
      return;
    }

    if (userProfile.balance < amount) {
      setErrorMsg(`Yetersiz bakiye. Mevcut bakiyeniz: ₺${userProfile.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`);
      return;
    }

    // Call state dispatcher
    investInPlant(selectedPlantId, amount);
    
    // Set success state
    const plantName = plants.find(p => p.id === selectedPlantId)?.name || 'Santral';
    setSuccessMsg(`${amount.toLocaleString('tr-TR')} ₺ tutarındaki yatırımınız ${plantName} için başarıyla gerçekleşti!`);
    setInvestmentAmount('1000');
    
    setTimeout(() => {
      setShowInvestModal(false);
      setSuccessMsg('');
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 pb-24"
    >
      {/* SECTION 1: HEADER & ACTIONS */}
      <section className="flex justify-between items-end">
        <div>
          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest font-mono">GENEL BAKIŞ</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-0.5 tracking-tight">Varlıklarım</h2>
        </div>
        <button 
          onClick={() => setShowInvestModal(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/10 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Yeni Yatırım Yap</span>
        </button>
      </section>

      {/* SECTION 2: AMORTISATION TIME ANALYTICS CARD */}
      <section className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(13,99,27,0.03)] relative overflow-hidden border-t-4 border-amber-600 border border-gray-100">
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-gray-800 tracking-tight leading-none uppercase">Amortisman Süresi</h3>
            <p className="text-[11px] text-gray-400 mt-1.5 font-medium">Yatırım Geri Dönüş Analizi</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">4.2</span>
            <span className="text-xs font-semibold text-gray-500 block">Yıl Kaldı</span>
          </div>
        </div>

        {/* Progress gauge */}
        <div className="relative h-4 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-amber-600 rounded-full w-2/3 shadow-[0_0_8px_rgba(126,87,0,0.2)]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[9px] font-bold text-gray-400 mb-1 uppercase font-mono">TOPLAM ROI</p>
            <p className="text-sm font-semibold text-emerald-700 font-mono">%124.8</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[9px] font-bold text-gray-400 mb-1 uppercase font-mono">PROJEKSİYON</p>
            <p className="text-sm font-semibold text-gray-700 font-mono">2032 Tamamlanma</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PORTFOLIO DETAILED LIST */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase leading-tight font-sans">Portföy Detayları</h3>
          <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
            {plants.length} Aktif Tesis
          </span>
        </div>

        <div className="space-y-4">
          {plants.map(plant => (
            <div 
              key={plant.id} 
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.02)] border-l-4 border-emerald-600 flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm bg-gray-50">
                <img 
                  alt={plant.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  src={plant.imageUrl} 
                />
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-gray-800 tracking-tight leading-tight">{plant.name}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase font-mono tracking-wider leading-none">
                    Aktif
                  </span>
                </div>
                
                <p className="text-[11px] text-gray-400 font-mono mt-1 flex items-center gap-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-gray-300" />
                  <span>{plant.location}</span>
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-50 pt-2 text-[11px] font-mono select-none">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">PAYIM</p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">%{plant.sharePercentage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">GÜÇ</p>
                    <p className="text-xs font-bold text-gray-800 mt-1">{plant.capacityKw} kW</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: IMPACT TRACKER BAR SECTION */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-4 rounded-3xl flex items-center justify-between shadow-lg shadow-emerald-950/10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-900/30 p-2.5 rounded-2xl border border-white/5">
            <Leaf className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200 font-mono">Impact Tracker</h3>
            <p className="text-sm font-extrabold text-white font-mono mt-0.5">
              {userProfile.co2Prevented.toFixed(1)} Ton CO2 Offset
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-950/20 flex items-center justify-center border border-white/5">
          <ChevronRight className="w-5 h-5 text-emerald-300" />
        </div>
      </section>

      {/* INVESTMENT MODAL DIALOG POPUP */}
      <AnimatePresence>
        {showInvestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvestModal(false)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            />

            {/* Modal Dialog container card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100"
            >
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider font-sans">Yatırım Yap</h3>
                </div>
                <button 
                  onClick={() => setShowInvestModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-150 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInvestment} className="p-5 space-y-4">
                {/* Visual wallet tracker balance */}
                <div className="bg-emerald-50 p-3 rounded-2xl flex items-center justify-between border border-emerald-100">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest font-mono">Bakiye</span>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    ₺{userProfile.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Plant Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">Hedef Güneş Parkı</label>
                  <div className="grid grid-cols-2 gap-2">
                    {plants.map(plant => (
                      <button
                        type="button"
                        key={plant.id}
                        onClick={() => setSelectedPlantId(plant.id)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          selectedPlantId === plant.id
                            ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/10 text-emerald-900 font-semibold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-xs">{plant.name}</p>
                        <p className="text-[9px] text-gray-400 font-mono mt-0.5">{plant.location.split(',')[0]}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment Input Amount */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">Yatırım Tutarı (₺)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      min="100"
                      step="100"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded-full px-2.5 py-0.5">TRY</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-2xl text-[11px] font-medium leading-relaxed flex items-start gap-1.5 border border-red-100">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl text-[11px] font-bold leading-relaxed flex items-start gap-1.5 border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-700/10 active:scale-[0.98] transition-all hover:bg-emerald-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Yatırımı Onayla</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

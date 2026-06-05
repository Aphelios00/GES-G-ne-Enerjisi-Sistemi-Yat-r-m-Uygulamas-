import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  MapPin, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Calculator, 
  Percent, 
  ChevronRight,
  X,
  Play,
  Pause,
  Zap,
  Calendar,
  Layers,
  Thermometer,
  Award
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { SolarPlant } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    userProfile, 
    plants, 
    setActiveTab, 
    instantProduction 
  } = useSolar();

  // Yield Calculator interactive states
  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcRegion, setCalcRegion] = useState<'akdeniz' | 'ege' | 'marmara'>('akdeniz');

  // Selected Plant details modal states
  const [selectedPlant, setSelectedPlant] = useState<SolarPlant | null>(null);
  const [isPlayingCamera, setIsPlayingCamera] = useState<boolean>(true);
  const [modalVolt, setModalVolt] = useState<number>(230.5);
  const [modalFactor, setModalFactor] = useState<number>(0.98);
  const [modalFrame, setModalFrame] = useState<number>(1);

  // Live modal telemetry simulator
  useEffect(() => {
    if (!selectedPlant || !isPlayingCamera) return;
    const interval = setInterval(() => {
      setModalVolt(prev => parseFloat((228 + Math.random() * 5).toFixed(1)));
      setModalFactor(prev => parseFloat((0.96 + Math.random() * 0.03).toFixed(2)));
      setModalFrame(prev => (prev >= 60 ? 1 : prev + 1));
    }, 1400);
    return () => clearInterval(interval);
  }, [selectedPlant, isPlayingCamera]);

  const regionMultipliers = {
    akdeniz: { label: 'Akdeniz (Yüksek Güneş Endeksi - %15.4)', yieldKoef: 0.154, co2Koef: 0.18 },
    ege: { label: 'Ege (Orta-Yüksek Güneş Endeksi - %13.2)', yieldKoef: 0.132, co2Koef: 0.15 },
    marmara: { label: 'Marmara (Bölgesel Güneş Endeksi - %10.5)', yieldKoef: 0.105, co2Koef: 0.12 }
  };

  const selectedRegion = regionMultipliers[calcRegion];
  const calculatedEarn = calcAmount * selectedRegion.yieldKoef;
  const calculatedCo2 = calcAmount * selectedRegion.co2Koef;
  const amortisationYears = (calcAmount / (calculatedEarn || 1)).toFixed(1);

  // Coordinates for the interactive sparkline curve matching the screenshots
  const sparklinePoints = [
    { x: 0, y: 75 },
    { x: 50, y: 35 },
    { x: 100, y: 65 },
    { x: 150, y: 25 },
    { x: 200, y: 45 },
    { x: 250, y: 80 },
    { x: 300, y: 20 },
    { x: 350, y: 55 },
    { x: 400, y: 30 }
  ];

  // Map coordinate points to an SVG cubic curve path d-attribute
  const drawPath = () => {
    let path = `M ${sparklinePoints[0].x} ${sparklinePoints[0].y}`;
    for (let i = 0; i < sparklinePoints.length - 1; i++) {
      const p0 = sparklinePoints[i];
      const p1 = sparklinePoints[i+1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const pathString = drawPath();
  const fillPathString = `${pathString} L 400 100 L 0 100 Z`;

  // Scale calculations for trees and CO2
  const maxPrevCO2 = 1.5;
  const levelProgress = Math.min(100, Math.floor((userProfile.co2Prevented / maxPrevCO2) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 pb-24 text-left"
    >
      {/* SECTION 1: INSTANT GENERATION CARD */}
      <section className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.03)] border-t-4 border-amber-500 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">ANLIK ÜRETİM</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-4xl font-extrabold text-emerald-700 tracking-tight">{instantProduction}</span>
              <span className="text-sm font-bold text-gray-500 font-mono">kWh</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-xl">
              <Sun className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xs font-mono">28°C</span>
            </div>
            <span className="text-[11px] text-gray-500 block mt-1 font-medium">Güneşli, İstanbul</span>
          </div>
        </div>

        {/* Dynamic Vector Curve representing live solar grid output */}
        <div className="h-28 w-full relative my-4 overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50/20 to-transparent p-1">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d631b" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0d631b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Filled Area */}
            <path d={fillPathString} fill="url(#areaGrad)" />
            {/* Curve stroke */}
            <path d={pathString} fill="none" stroke="#0d631b" strokeWidth="3" strokeLinecap="round" />
            
            {/* Live pulsing coordinate indicator */}
            <circle cx="400" cy="30" r="5" fill="#0d631b" className="animate-ping" style={{ transformOrigin: '400px 30px' }} />
            <circle cx="400" cy="30" r="4" fill="#2e7d32" />
          </svg>
        </div>

        {/* Sparkline Timestamps */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 px-1 font-bold">
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
        </div>
      </section>

      {/* SECTION 2: FINANCIAL METRIC GRID */}
      <section className="grid grid-cols-2 gap-4 text-left">
        {/* Total Assets / Balance Value */}
        <div className={`p-4 rounded-3xl flex flex-col justify-between transition-all duration-350 relative overflow-hidden ${
          userProfile.userTier === 'PREMIUM'
            ? 'bg-gradient-to-br from-white to-amber-50/15 border-2 border-amber-400 shadow-[0_8px_30px_rgba(254,179,0,0.12)]'
            : 'bg-white border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.02)]'
        }`}>
          {userProfile.userTier === 'PREMIUM' && (
            <div className="absolute top-0 right-0 bg-amber-400 text-gray-950 font-bold text-[8px] px-2 py-0.5 rounded-bl-xl tracking-widest font-mono scale-90">
              VIP
            </div>
          )}
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-mono">Toplam Bakiye</span>
            <h3 className="text-xl font-extrabold text-emerald-700 tracking-tight mt-1">
              ₺{userProfile.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg w-fit">
              <TrendingUp className="w-3 h-3" />
              <span>{userProfile.userTier === 'PREMIUM' ? '+15% VIP' : '+2.4%'}</span>
            </div>
          </div>
        </div>

        {/* Estimated Daily Yields */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.02)] flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-mono">Bugünkü Kazanç</span>
            <h3 className="text-xl font-extrabold text-amber-600 tracking-tight mt-1">
              ₺{userProfile.todayEarnings.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded-lg w-fit">
            <Activity className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>Tahmini</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: GREEN IMPACT GAMIFIED LOG */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-950 text-white rounded-3xl p-5 shadow-lg shadow-emerald-950/20">
        {/* Watermarked Eco Leaf Graphic behind background */}
        <Leaf className="absolute -right-6 -bottom-6 text-emerald-500/15 w-40 h-40 transform -rotate-12" />
        
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
          <span>Yeşil Etki Skorum</span>
        </h3>

        <div className="grid grid-cols-2 gap-4 relative z-10 my-1">
          {/* Trees saved counter column */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-4 transition-transform hover:scale-[1.02] duration-200">
            <span className="text-3xl text-[38px] mb-1 leading-normal select-none">🌲</span>
            <p className="text-2xl font-extrabold text-white leading-tight font-mono">{userProfile.treesSaved}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-200 mt-1">Kurtarılan Ağaç</p>
          </div>

          {/* Tonnes Of Carbon Offsetted */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-4 transition-transform hover:scale-[1.02] duration-200">
            <span className="text-3xl text-[38px] mb-1 leading-normal select-none">🍃</span>
            {/* Ensure precision decimals display beautifully */}
            <p className="text-2xl font-extrabold text-white leading-tight font-mono">
              {userProfile.co2Prevented >= 1000 
                ? `${(userProfile.co2Prevented / 1000).toFixed(2)}k` 
                : userProfile.co2Prevented.toFixed(3)}t
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-200 mt-1">CO2 Engellendi</p>
          </div>
        </div>

        {/* Progress bar to visual Leveling rewards */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center text-[11px] font-semibold text-emerald-100 mb-2">
            <span>Seviye 4: Doğa Dostu Enerji Devrimcisi</span>
            <span className="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-mono leading-none">%{levelProgress}</span>
          </div>
          <div className="w-full h-2 bg-emerald-950/40 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3.5: INTERACTIVE YIELD CALCULATOR */}
      <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.02)] space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 pl-1">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-gray-800 tracking-widest uppercase font-mono">Simülasyon Hesaplayıcı</h3>
          </div>
          <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">PROJEKSİYON</span>
        </div>

        <div className="space-y-3">
          {/* Amount input range */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold font-mono text-gray-500 uppercase px-1">
              <span>Yatırım Tutarı</span>
              <span className="text-emerald-700 text-xs font-extrabold font-mono">₺{calcAmount.toLocaleString('tr-TR')}</span>
            </div>
            <input 
              type="range"
              min="2500"
              max="200000"
              step="2500"
              value={calcAmount}
              onChange={(e) => setCalcAmount(Number(e.target.value))}
              className="w-full accent-emerald-700 h-1.5 bg-gray-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Region selector buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">Hedef Bölge</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['akdeniz', 'ege', 'marmara'] as const).map(reg => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setCalcRegion(reg)}
                  className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                    calcRegion === reg 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-600 font-extrabold'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {reg.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[9.5px] text-gray-400 font-semibold px-1 italic">
            * {selectedRegion.label} taban alınmıştır.
          </p>

          {/* Micro output receipt */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-3 gap-2 text-center select-none font-mono">
            <div>
              <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider leading-none">YILLIK ROI</p>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                ₺{Math.round(calculatedEarn).toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="border-x border-gray-200">
              <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider leading-none">AMORTİSMAN</p>
              <p className="text-xs font-bold text-amber-600 mt-1">{amortisationYears} Yıl</p>
            </div>
            <div>
              <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider leading-none">KARBON OFSET</p>
              <p className="text-xs font-bold text-gray-800 mt-1">{calculatedCo2.toFixed(1)} t CO2</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ACTIVE POWER PLANTS PREVIEW LIST */}
      <section className="space-y-3 text-left">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase leading-tight font-sans">Aktif Güneş Parklarım</h3>
          <button 
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className="text-emerald-600 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Detayları Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {plants.map(plant => (
            <div 
              key={plant.id} 
              onClick={() => {
                setSelectedPlant(plant);
                setIsPlayingCamera(true);
              }}
              className="bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-3 transition-all active:scale-[0.99] hover:border-emerald-500/30 hover:shadow-md hover:scale-[1.01] cursor-pointer duration-150"
            >
              {/* Thumbnail of installation site */}
              <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                <img 
                  alt={plant.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  src={plant.imageUrl} 
                />
              </div>

              {/* Informative description block */}
              <div className="flex-grow select-none">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 tracking-tight leading-tight">{plant.name}</h4>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase font-mono">
                    AKTİF
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span>{plant.location}</span>
                </p>
              </div>

              {/* Current capacity status */}
              <div className="text-right shrink-0 border-l border-gray-100 pl-3">
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">ANLIK GÜÇ</p>
                <p className="text-xs font-bold text-emerald-600 font-mono mt-0.5">
                  {plant.currentGeneration} kWh
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED GES INFO & LIVE CAMERA OVERLAY MODAL */}
      <AnimatePresence>
        {selectedPlant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlant(null)}
              className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm"
            />

            {/* Modal Dialog container card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 max-h-[90vh] flex flex-col text-left"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-[#7E5700] rounded-xl">
                    <Sun className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase font-mono text-[#7E5700]">Tesis Detayları</h3>
                    <h4 className="text-sm font-extrabold text-gray-800 leading-none">{selectedPlant.name}</h4>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPlant(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 active:scale-95 transition-all cursor-pointer border border-gray-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Main Area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* 1. Live Camera Feed Panel */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-gray-400 font-mono tracking-wider uppercase">TESİS GÜVENLİK YAYINI</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[8px] font-extrabold rounded-md flex items-center gap-1 font-mono uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                      <span>{isPlayingCamera ? 'CANLI' : 'DURAKLATILDI'}</span>
                    </span>
                  </div>

                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-950 border border-gray-250 shadow-md">
                    <img 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      src={selectedPlant.imageUrl} 
                      alt={selectedPlant.name} 
                    />

                    {/* Camera simulation Overlay graphics */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/35 p-3 flex flex-col justify-between select-none">
                      <div className="flex justify-between items-start text-[8px] font-mono text-emerald-400 font-extrabold">
                        <div className="space-y-0.5">
                          <p>CAM // {selectedPlant.id.toUpperCase()}</p>
                          <p>SIGNAL: EXCELLENT</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <p>VOLT: {isPlayingCamera ? modalVolt : '---.-'} V</p>
                          <p>cos φ: {isPlayingCamera ? modalFactor : '-.--'}</p>
                        </div>
                      </div>

                      {/* Play Pause trigger */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={() => setIsPlayingCamera(!isPlayingCamera)}
                          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        >
                          {isPlayingCamera ? (
                            <Pause className="w-4 h-4 text-white stroke-[2.5]" />
                          ) : (
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex justify-between items-end text-white text-[9kb]">
                        <div className="font-mono text-[8px] font-bold text-gray-300">
                          <p>LAT: {selectedPlant.latitude || '38.00000'}</p>
                          <p>LNG: {selectedPlant.longitude || '32.00000'}</p>
                        </div>
                        <div className="text-right text-[8px] font-mono font-bold text-emerald-400">
                          <p>FRAME: {isPlayingCamera ? modalFrame : 'PAUSE'}</p>
                          <p>PANEL: {selectedPlant.temperature}°C</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Structured Operational KPIs Grid */}
                <div className="grid grid-cols-2 gap-2 text-mono">
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
                    <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-0.5">
                      <Layers className="w-3 h-3 text-emerald-700" />
                      <span>Panel Sayısı</span>
                    </p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedPlant.panelsCount.toLocaleString('tr-TR')} Adet</p>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
                    <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-0.5">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>Verimlilik Katsayısı</span>
                    </p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">%{selectedPlant.efficiencyRating}</p>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
                    <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Günlük Üretim</span>
                    </p>
                    <p className="text-xs font-bold text-emerald-750 mt-0.5">{selectedPlant.currentGeneration} kWh / Gün</p>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
                    <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-0.5">
                      <Thermometer className="w-3 h-3 text-red-500" />
                      <span>Tesis Sıcaklığı</span>
                    </p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedPlant.temperature}°C</p>
                  </div>
                </div>

                {/* 2.5 Daily Yield Goal Goal Progress Bar */}
                <div className="bg-emerald-50/20 p-3 rounded-2xl border border-emerald-500/10 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800">
                    <span>GÜNLÜK HEDEF BAŞARIMI</span>
                    <span>%KOTA</span>
                  </div>
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-xs text-gray-500 font-bold">Mevcut: {selectedPlant.currentGeneration} kWh</span>
                    <span className="text-xs text-emerald-700 font-extrabold">Hedef: {selectedPlant.dailyYieldGoal} kWh</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full" 
                      style={{ width: `${Math.min(100, (selectedPlant.currentGeneration / selectedPlant.dailyYieldGoal) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 3. Personalized Shareholding Statement */}
                <div className="p-3.5 rounded-2xl border border-gray-150 select-none">
                  {selectedPlant.sharePercentage > 0 ? (
                    <div className="space-y-1 text-center">
                      <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest font-mono">Yatırımınız Bulunuyor</p>
                      <p className="text-xs text-gray-600">
                        Bu tesiste <strong>%{selectedPlant.sharePercentage}</strong> payınız var. Bugün sizin payınıza düşen tahmini üretim değeri: 
                      </p>
                      <p className="text-sm font-extrabold text-emerald-700 font-mono mt-0.5">
                        {parseFloat((selectedPlant.currentGeneration * (selectedPlant.sharePercentage / 100)).toFixed(2))} kWh
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center bg-amber-500/5 p-2 rounded-xl border border-amber-500/10">
                      <p className="text-[9px] font-extrabold text-amber-605 uppercase tracking-widest font-mono">YATIRIM YAPILMAMIŞ</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Bu santralde henüz aktif payınız bulunmuyor. Temiz enerji devrimine katılarak düzenli bakiye getirisi sağlamak için hemen yatırım yapın!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlant(null)}
                  className="flex-grow bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-2xl text-xs active:scale-95 transition-all cursor-pointer text-center"
                >
                  Kapat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlant(null);
                    setActiveTab('portfolio');
                  }}
                  className="flex-grow bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-2xl text-xs active:scale-95 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/10"
                >
                  <span>Pay Satın Al (Yatırım Yap)</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Award, Earth, Flame, Trees, Sparkles, Smartphone, Car, Landmark } from 'lucide-react';
import { useSolar } from '../context/SolarContext';

export const ImpactView: React.FC = () => {
  const { userProfile, plants } = useSolar();

  // Visual conversions representing what their actual prevented metric tons of CO2 is equal to.
  const smartphoneCharges = Math.round(userProfile.co2Prevented * 121643);
  const carMilesAvoided = Math.round(userProfile.co2Prevented * 2481);
  const coalBurnedAvoided = Math.round(userProfile.co2Prevented * 1102);

  const stats = [
    {
      id: 's1',
      title: 'Akıllı Telefon Şarjı',
      value: smartphoneCharges.toLocaleString('tr-TR'),
      unit: 'Adet Şarj',
      icon: Smartphone,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      id: 's2',
      title: 'Gereksiz Araba Sürüşü',
      value: carMilesAvoided.toLocaleString('tr-TR'),
      unit: 'Mil Yol Değeri',
      icon: Car,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      id: 's3',
      title: 'Yakılmaktan Kurtarılan Kömür',
      value: coalBurnedAvoided.toLocaleString('tr-TR'),
      unit: 'Lbs Kömür Kütlesi',
      icon: Flame,
      color: 'text-gray-700 bg-gray-100 border-gray-250'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 pb-24"
    >
      {/* SECTION 1: HEADER & MOTIVATIONAL INTRO */}
      <section className="text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Ekolojik Katkı</h2>
        <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed leading-normal">
          Güneş enerjisi yatırımlarınızın küresel iklim kriziyle mücadeledeki gerçek zamanlı somut etkilerini görün.
        </p>
      </section>

      {/* SECTION 2: LANDMARK DISPLAY HERO */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-150 rounded-3xl p-5 relative overflow-hidden flex items-center justify-between">
        <div className="space-y-2 relative z-10 text-left">
          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 rounded px-2 py-0.5 uppercase font-mono">TOPLAM ENGELLENEN EMİSYON</span>
          <h3 className="text-3xl font-extrabold text-emerald-800 tracking-tight">
            {userProfile.co2Prevented.toFixed(4)} <span className="text-sm font-semibold font-sans text-emerald-700">Ton CO₂</span>
          </h3>
          <p className="text-xs text-emerald-600 leading-normal font-medium">
            Karbondioksit salınımının atmosfere karışmasının önüne tüm varlığınızla geçtiniz.
          </p>
        </div>
        <Earth className="w-20 h-20 text-emerald-600 opacity-20 shrink-0 transform rotate-12" />
      </section>

      {/* SECTION 3: GREEN FACT CONVERSIONS CARD GRID */}
      <section className="space-y-3">
        <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase flex items-center gap-1.5 px-1 leading-none">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Eşdeğer Tasarruf Değerleri</span>
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div 
                key={s.id}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${s.color}`}>
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="text-left select-none">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">{s.title}</p>
                  <p className="text-lg font-extrabold text-gray-800 font-mono mt-0.5">
                    {s.value} <span className="text-[10px] font-bold text-gray-500 font-sans tracking-normal">{s.unit}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: PLANT SPECIFIC IMPACT TABLE */}
      <section className="space-y-3">
        <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase flex items-center gap-1.5 px-1 leading-none">
          <Trees className="w-4 h-4 text-emerald-700" />
          <span>Santral Emisyon Tescilleri</span>
        </h3>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50">
          {plants.map(p => {
            const co2Yield = (p.sharePercentage * userProfile.co2Prevented * 0.1).toFixed(4);
            return (
              <div key={p.id} className="p-4 flex justify-between items-center bg-white hover:bg-gray-55/20 transition-colors">
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800 leading-tight">{p.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono font-bold mt-1 uppercase tracking-wider">Ortaklık Payı %{p.sharePercentage}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-700 font-mono">+{co2Yield} t</p>
                  <span className="text-[9px] text-gray-400 tracking-wider font-bold uppercase font-mono">CO2 Engellendi</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: LUSH GREEN PHOTO HERO BANNER FOOTER */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.02)] relative">
        <img 
          className="w-full h-32 object-cover object-center scale-102" 
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKUAHdwbRKOJqTCY3KsQLc2OeKgTnsLl7x0nu3sZWjtDyuFKfraaSFM8clZKnllwzW-QlE77DIcgbmhPIYfxprim6wooP-fq0L3cGah4elCddL3zRqizOKjL43BBDiDY2-QjdY-bArRYqyBN9u3qGkwFdHNQIuN6rENdp71dmaFfHenwNbNJFfIcj3o-0aQ4SoPGSTj-OrwqhzQ6Dz_HRmXuGO1HKMuXWL-lGAoJFwjYO5KrAZrfa_CNJhENuSnu8HRdR197XMrv5e" 
          alt="Eco-Tech Green Fields" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent flex items-end p-4">
          <p className="text-white text-xs font-bold leading-snug drop-shadow-md select-none max-w-[280px]">
            &ldquo;Geleceği tasarlamıyoruz, onu yeşil yatırımlarla güneş altında tescilliyoruz.&rdquo;
          </p>
        </div>
      </div>
    </motion.div>
  );
};

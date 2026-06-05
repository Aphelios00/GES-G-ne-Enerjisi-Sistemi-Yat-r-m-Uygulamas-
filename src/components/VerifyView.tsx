import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Play, 
  Pause, 
  Verified, 
  Download, 
  Globe, 
  Check, 
  Cpu, 
  BookOpen, 
  Leaf, 
  Compass, 
  MapPin, 
  Zap, 
  Smartphone,
  Info
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';

export const VerifyView: React.FC = () => {
  const { blockchainLogs, lastSyncTime, plants } = useSolar();
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameId, setFrameId] = useState(1);

  // States for Geolocation Telemetry
  const [geoState, setGeoState] = useState<{
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    status: 'idle' | 'loading' | 'active' | 'error';
    error: string | null;
    closestPlant: string | null;
    distanceKm: number | null;
  }>({
    lat: null,
    lng: null,
    accuracy: null,
    status: 'idle',
    error: null,
    closestPlant: null,
    distanceKm: null
  });

  // States for Gyroscope and Lux Simulation
  const [gyroState, setGyroState] = useState<{
    alpha: number;
    beta: number;
    gamma: number;
    ambientLux: number;
    signalStrength: number;
  }>({
    alpha: 0,
    beta: 0,
    gamma: 0,
    ambientLux: 480,
    signalStrength: 94
  });

  // Simulated live camera coordinates
  const [camStats, setCamStats] = useState({
    voltage: 231.4,
    powerFactor: 0.98,
    ambientTemp: 28.5
  });

  // Camera frame refresh simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrameId(prev => (prev >= 60 ? 1 : prev + 1));
      setCamStats(prev => ({
        voltage: parseFloat((230 + Math.random() * 3).toFixed(1)),
        powerFactor: parseFloat((0.97 + Math.random() * 0.02).toFixed(2)),
        ambientTemp: parseFloat((28.0 + Math.random() * 1.2).toFixed(1))
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Haversine distance calculator
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return parseFloat((R * c).toFixed(1));
  };

  // Trigger Geolocation Inquiry
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setGeoState(prev => ({
        ...prev,
        status: 'error',
        error: 'Cihazınız konum servisini desteklemiyor.'
      }));
      return;
    }

    setGeoState(prev => ({ ...prev, status: 'loading', error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Find closest plant in our portfolio
        let minDistance = Infinity;
        let closestName = 'Ankara GES';
        
        plants.forEach(p => {
          const plantLat = p.latitude || 38.0;
          const plantLng = p.longitude || 32.0;
          const dist = getDistanceKm(latitude, longitude, plantLat, plantLng);
          if (dist < minDistance) {
            minDistance = dist;
            closestName = p.name;
          }
        });

        setGeoState({
          lat: parseFloat(latitude.toFixed(5)),
          lng: parseFloat(longitude.toFixed(5)),
          accuracy: accuracy ? parseFloat(accuracy.toFixed(1)) : null,
          status: 'active',
          error: null,
          closestPlant: closestName,
          distanceKm: minDistance
        });
      },
      (error) => {
        let msg = 'Konum izni onaylanmadı.';
        if (error.code === error.POSITION_UNAVAILABLE) msg = 'Konum bilgisi alınamadı.';
        if (error.code === error.TIMEOUT) msg = 'Konum sorgusu zaman aşımına uğradı.';
        setGeoState(prev => ({
          ...prev,
          status: 'error',
          error: msg
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Gyroscope Sensor & Ambient Environment light simulator loop
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setGyroState(prev => ({
        ...prev,
        alpha: e.alpha ? parseFloat(e.alpha.toFixed(1)) : prev.alpha,
        beta: e.beta ? parseFloat(e.beta.toFixed(1)) : prev.beta,
        gamma: e.gamma ? parseFloat(e.gamma.toFixed(1)) : prev.gamma
      }));
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Continuous low-drift ambient fluctuations (signal, gyroscope, lux) typical for high fidelity apps
    const tick = setInterval(() => {
      setGyroState(prev => {
        const signalDrift = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const luxDrift = Math.round((Math.random() - 0.48) * 8);
        return {
          alpha: parseFloat(((prev.alpha + (Math.random() - 0.5) * 1.2 + 360) % 360).toFixed(1)),
          beta: parseFloat((Math.sin(Date.now() / 2500) * 12).toFixed(1)),
          gamma: parseFloat((Math.cos(Date.now() / 2500) * 8).toFixed(1)),
          ambientLux: Math.max(340, Math.min(920, prev.ambientLux + luxDrift)),
          signalStrength: Math.max(88, Math.min(100, prev.signalStrength + signalDrift))
        };
      });
    }, 1500);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearInterval(tick);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 pb-24 text-left"
    >
      {/* SECTION 1: HEADER & SPECS */}
      <section className="text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Şeffaflık &amp; Doğrulama</h2>
        <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
          Gerçek zamanlı web verileri, entegre cihaz sensörleri ve konum tabanlı akıllı eşleştirme sistemi.
        </p>
      </section>

      {/* SECTION 2: LIVE WEB STREAM CAMERA FEED SIMULATOR */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase flex items-center gap-1.5 font-sans leading-none">
            <Globe className="w-4 h-4 text-emerald-700 animate-pulse" />
            <span>Santral Sahası Canlı İzleme</span>
          </h3>
          <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-extrabold rounded-lg flex items-center gap-1 font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>CANLI</span>
          </span>
        </div>

        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-gray-150 bg-gray-950">
          <img 
            className="w-full h-full object-cover opacity-90 select-none" 
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1548613053-220ef3180556?auto=format&fit=crop&w=800&q=80" 
            alt="Ankara Solar Field Unit 4"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30 p-4 flex flex-col justify-between select-none">
            {/* Top telemetry bar */}
            <div className="flex justify-between items-start text-[10px] font-mono text-emerald-400 font-bold drop-shadow-md">
              <div className="space-y-0.5">
                <p>REC • SYSTEM_OK</p>
                <p>FPS: 30 / SECURE_LINK</p>
              </div>
              <div className="text-right space-y-0.5">
                <p>OUTLET VOLT: {isPlaying ? camStats.voltage : '---.-'} V</p>
                <p>FACTOR cos φ: {isPlaying ? camStats.powerFactor : '-.--'}</p>
              </div>
            </div>

            {/* Play overlay trigger center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white stroke-[2.5]" />
                ) : (
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                )}
              </button>
            </div>

            {/* Bottom geographical details */}
            <div className="flex justify-between items-end text-white text-xs">
              <div>
                <p className="text-[9px] font-bold tracking-widest text-[#feb300] uppercase font-mono">AKTİF YAYIN</p>
                <p className="font-semibold leading-tight drop-shadow">Ege &amp; Akdeniz Ortak Enerji Koridoru</p>
              </div>
              <div className="text-right text-[10px] font-mono font-bold text-gray-200">
                <p>FRAME_ID: {isPlaying ? frameId : 'STALE'}</p>
                <p>AIR_TEMP: {isPlaying ? camStats.ambientTemp : '---.-'}°C</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: UPGRADED DEVICE SENSORS & GPS TELEMETRY CONTAINER (REPLACES FLUTTER PREVIEW) */}
      <section className="bg-gradient-to-br from-[#feb300]/5 to-emerald-950/[0.02] p-5 rounded-3xl border border-gray-150 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest font-mono">Cihaz Sensörleri &amp; Konum Analizi</h4>
              <p className="text-[10px] text-gray-400 font-mono font-bold">TELEFON DONANIM ENTEGRASYONU</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md font-mono">SİS_OK</span>
        </div>

        {/* Dual Telemetry Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module A: Gyroscope & Environmental Lux */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-3">
            <h5 className="text-[10px] font-extrabold text-gray-400 font-mono tracking-wider uppercase flex items-center gap-1 border-b border-gray-50 pb-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>Cihaz Jiroskop &amp; Işık Parametreleri</span>
            </h5>
            
            <div className="grid grid-cols-2 gap-2 text-center text-mono">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
                <p className="text-[8px] font-bold text-gray-400 uppercase">PUSULA (α)</p>
                <p className="text-xs font-extrabold text-gray-800 font-mono mt-0.5">{gyroState.alpha}°</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
                <p className="text-[8px] font-bold text-gray-400 uppercase">EĞİM X (β)</p>
                <p className="text-xs font-extrabold text-gray-800 font-mono mt-0.5">{gyroState.beta}°</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150">
                <p className="text-[8px] font-bold text-gray-400 uppercase">EĞİM Y (γ)</p>
                <p className="text-xs font-extrabold text-gray-800 font-mono mt-0.5">{gyroState.gamma}°</p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150 flex flex-col justify-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase">IŞIK ŞİDDETİ</p>
                <p className="text-xs font-extrabold text-amber-600 font-mono flex items-center justify-center gap-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span>{gyroState.ambientLux} lx</span>
                </p>
              </div>
            </div>

            <p className="text-[9px] text-gray-400 italic">
              * Telefonunuzun jiroskobunu sağa-sola eğerek canlı oryantasyon açılarını test edebilirsiniz.
            </p>
          </div>

          {/* Module B: Real GPS Location Finder & Closest GES */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between gap-3">
            <div>
              <h5 className="text-[10px] font-extrabold text-gray-400 font-mono tracking-wider uppercase flex items-center gap-1 border-b border-gray-50 pb-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS Konum Tabanlı GES Yakınlık Analizi</span>
              </h5>
              
              {geoState.status === 'idle' && (
                <div className="py-2 text-center">
                  <p className="text-[11px] text-gray-500">Konumunuzu tescilleyerek size en verimli ve en yakın güneş tarlalarını otomatik analiz edin.</p>
                </div>
              )}

              {geoState.status === 'loading' && (
                <div className="py-3 text-center space-y-1">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-[10px] text-emerald-800 font-mono uppercase font-bold">GPS UYDU BAĞLANTISI ARANIYOR...</p>
                </div>
              )}

              {geoState.status === 'error' && (
                <div className="py-2 bg-red-50 text-red-800 border border-red-100 p-2.5 rounded-xl text-[10px] font-bold text-center">
                  ⚠️ {geoState.error}
                </div>
              )}

              {geoState.status === 'active' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-1.5 text-xs select-text font-mono">
                    <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                      <span className="text-[8px] text-gray-400 block font-bold leading-none">LATITUDE</span>
                      <strong className="text-gray-700 block mt-1 text-[11px] font-bold">{geoState.lat}</strong>
                    </div>
                    <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                      <span className="text-[8px] text-gray-400 block font-bold leading-none">LONGITUDE</span>
                      <strong className="text-gray-700 block mt-1 text-[11px] font-bold">{geoState.lng}</strong>
                    </div>
                  </div>

                  {geoState.closestPlant && (
                    <div className="p-2.5 bg-emerald-50/50 border border-emerald-500/20 rounded-xl space-y-1">
                      <p className="text-[10px] text-emerald-800 font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>En Yakın Üretim Tesisi Bulundu!</span>
                      </p>
                      <p className="text-xs font-bold text-gray-800">
                        {geoState.closestPlant} - <span className="text-emerald-750">{geoState.distanceKm} km</span> mesafe uzaklıktadır.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleFetchLocation}
              disabled={geoState.status === 'loading'}
              className="w-full bg-emerald-700 hover:bg-emerald-850 active:scale-95 text-white font-extrabold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-700/5 whitespace-nowrap"
            >
              {geoState.status === 'loading' ? 'UYDUDAN BAĞLANILIYOR...' : 'AKILLI KONUM ANALİZ GÖNDER'}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: REAL-TIME LEDGER BLOCKCHAIN ENTRIES */}
      <section className="space-y-3">
        <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase flex items-center gap-2 px-1">
          <Verified className="w-4 h-4 text-emerald-700" />
          <span>Blokzincir Kayıtları</span>
        </h3>

        <div className="space-y-3">
          {blockchainLogs.map((log, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex justify-between items-center"
            >
              <div className="space-y-1 select-none flex-grow">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-bold text-gray-400 font-mono tracking-wider uppercase">TX HASH</span>
                  <span className={`text-[8px] font-mono font-extrabold px-2 py-0.5 rounded leading-none ${
                    log.status === 'Onaylandı' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {log.status === 'Onaylandı' ? 'ONAYLANDI' : 'İŞLEMDE'}
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-emerald-700 leading-tight">{log.txHash}</p>
                <p className="text-[11px] text-gray-500 font-medium leading-normal">{log.details}</p>
              </div>

              <div className="text-right shrink-0 border-l border-gray-100 pl-3">
                <span className="text-emerald-700 font-bold">
                  <Verified className="w-5 h-5" />
                </span>
                <span className="text-[9px] text-gray-400 font-mono block mt-1 font-bold">{log.timeString}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: OFFSETS CERTIFICATE */}
      <section className="space-y-3">
        <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase flex items-center gap-2 px-1">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Üretim Sertifikaları</span>
        </h3>

        <div className="relative overflow-hidden bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.03)] border-t-4 border-[#feb300]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#feb300]/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <h4 className="text-base font-bold text-emerald-700 tracking-tight leading-tight">Yeşil Enerji Sertifikası</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[240px] font-medium">
                Mayıs 2026 Dönemi - 450 kg CO2 Tasarrufu Tescil Onayı
              </p>
              <div className="pt-1">
                <button 
                  onClick={() => alert('YASE-5324-MEHMET numaralı Yeşil Enerji Karbon Mahsup sertifikanız şifrelenmiş olarak aygıta indirildi.')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3.5 rounded-2xl text-[11px] flex items-center gap-1 cursor-pointer shadow-md shadow-emerald-700/10 active:scale-95 transition-all duration-150"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sertifikayı İndir (PDF)</span>
                </button>
              </div>
            </div>
            
            <Leaf className="w-14 h-14 text-emerald-600 opacity-15 shrink-0" />
          </div>
        </div>
      </section>

      {/* SECTION 6: TELEMETRY AND SYNC STATUS GRIDS */}
      <section className="grid grid-cols-2 gap-4 select-none">
        <div className="bg-gray-100 p-4 rounded-3xl text-center space-y-1.5 border border-gray-150">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">SİSTEM DURUMU</p>
          <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Aktif &amp; Korunuyor</span>
          </p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-3xl text-center space-y-1.5 border border-gray-150">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">SON SENKRONİZASYON</p>
          <p className="text-xs font-bold text-emerald-700 font-mono">
            {lastSyncTime} {lastSyncTime === 1 ? 'dakika' : 'dk'} önce
          </p>
        </div>
      </section>
    </motion.div>
  );
};

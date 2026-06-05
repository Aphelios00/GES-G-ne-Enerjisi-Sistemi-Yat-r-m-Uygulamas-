import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Bell, 
  Smartphone, 
  Check, 
  Lock, 
  Key, 
  HelpCircle,
  TrendingUp,
  Cpu,
  ChevronDown,
  Zap,
  Clock,
  Heart,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { UserProfile } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'identity' | 'security' | 'preferences' | 'support';

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile, addBlockchainLog } = useSolar();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  // Edit fields
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone || '+90 532 123 45 67');
  
  // Action States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [showSeedBackup, setShowSeedBackup] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Avatar Options for clean energy personas
  const avatarOptions = [
    {
      id: 'avatar_classic',
      name: 'Yatırımcı Öncü',
      role: 'Eko Yatırım Lideri',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA20nJRmumS_2n3t2GyZ-aneOpZt-HdLjvYyLKKb0WdfoEA_xB-1MrSlzMKBRSIm6G3xwRsjhisIaJ9sDNRrCp1l_5y6mPdju33I6S9YURSAG6zJVyQFylevocXh5l40iO-jEZcjq58c9MRoXu6b6PuUihjrq9H_65SUrA32aOD3PnEpaRrJBmtkjibFdXMo75oImD3L9F5AhpUnZ3HJC9QPdrSxlCJe5j-g7r_scbycta2sJHrUoTCB0NU3b5uXQ7Z9GlnL7o5Oy8Y'
    },
    {
      id: 'avatar_solar',
      name: 'Güneş Kaşifi',
      role: 'Mühendis & Aktivist',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'avatar_wind',
      name: 'Rüzgar Öncüsü',
      role: 'Sürdürülebilirlik Uzmanı',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'avatar_hydro',
      name: 'Doğa Muhafızı',
      role: 'Flora & Biyoçeşitlilik Rehberi',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'avatar_expert',
      name: 'Temiz Enerji Brokerı',
      role: 'Finansal Analiz Danışmanı',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const currentAvatarUrl = userProfile.avatarUrl || avatarOptions[0].url;

  // Level Progression Math
  const totalScore = userProfile.treesSaved * 1.5 + Number(userProfile.co2Prevented || 1);
  const calculatedLevel = Math.max(1, Math.floor(Math.sqrt(totalScore) / 1.5));
  const levelProgress = Math.round(((totalScore % 15) / 15) * 100);

  // Security Score Generator (dynamic based on toggles)
  let securityScore = 40; // Base score
  if (userProfile.twoFactorEnabled) securityScore += 30;
  if (showSeedBackup) securityScore += 30;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      updateUserProfile({
        name,
        email,
        phone
      });
      setIsSaving(false);
      setSaveSuccess(true);
      
      addBlockchainLog({
        txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...',
        status: 'Onaylandı',
        details: 'Profil Kimliği Güncellendi',
        timeString: 'Şimdi'
      });

      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const selectAvatar = (url: string) => {
    updateUserProfile({ avatarUrl: url });
    addBlockchainLog({
      txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...',
      status: 'Onaylandı',
      details: 'Eko Profil Avatary Değiştirildi',
      timeString: 'Şimdi'
    });
  };

  const handleTierUpgrade = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUserProfile({
        userTier: 'PREMIUM',
        todayEarnings: userProfile.todayEarnings + 24.50,
        totalBalanceUsd: userProfile.totalBalanceUsd + 1500
      });
      setIsSaving(false);
      setUpgradeSuccess(true);
      
      addBlockchainLog({
        txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...',
        status: 'Onaylandı',
        details: 'Green Premium VIP Seviyesine Yükseltildi',
        timeString: 'Şimdi'
      });

      setTimeout(() => setUpgradeSuccess(false), 3000);
    }, 1000);
  };

  const handleToggle = (key: keyof Pick<UserProfile, 'notificationEnabled' | 'twoFactorEnabled' | 'ecoFriendlyServerMode' | 'reportEnabled'>) => {
    updateUserProfile({
      [key]: !userProfile[key]
    });
  };

  const copySimulatedSeed = () => {
    navigator.clipboard.writeText('solar invest green wallet recovery mnemonic private seed clean energy');
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  // Interactive FAQs
  const faqData = [
    {
      q: 'Yatırım ve gelir akışlarım nasıl tescil edilmektedir?',
      a: 'Yatırım yaptığınız güneş panellerinin ürettiği elektrik enerjisi, devlet alım garantisi kapsamında şebekeye verilir. Gelirleriniz her gün saatlik üretim endekslerine göre hesaplanarak portföy bakiyenize eşzamanlı yansıtılır ve şeffaf blokzincir tescili ile güvenceye alınır.'
    },
    {
      q: 'İstediğim zaman bakiyemi çekebilir miyim?',
      a: 'Evet, standart üyeler 24 saat ek onay süresi ile banka transferi başlatabilir. Green Premium VIP üyeler ise saniyeler içerisinde, komisyonsuz ve anında doğrudan tescilli IBAN adreslerine aktarım sağlayabilirler.'
    },
    {
      q: 'CO2 tasarrufu tescil sertifikası nedir?',
      a: 'Güneş enerjisi yatırımlarınızın konvansiyonel karbon salınımlı enerji üretimine kıyasla önlediği karbondioksit miktarını tescilleyen resmi, uluslararası geçerliliğe sahip yeşil enerji tebliğ belgesidir.'
    },
    {
      q: 'Green Premium VIP statüsünün avantajları nelerdir?',
      a: 'Genel projelerde ek fahiş rüzgar ve güneş bonus kuponları, anında komisyonsuz para çekme önceliği, düşük karbon verimliliğine sahip eko sunucu kullanımı erişimi ve aylık +%15 ekstra kazanç çarpanı sağlar.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md h-[88vh] bg-white rounded-[32px] shadow-2xl overflow-hidden z-10 border border-gray-150 flex flex-col text-left"
          >
            {/* Header: Visual Identity Banner */}
            <header className="p-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shrink-0 relative overflow-hidden flex justify-between items-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent)] pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden shadow-md bg-emerald-900 flex items-center justify-center">
                    <img 
                      alt="Current User Portrait" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      src={currentAvatarUrl}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-gray-900 font-extrabold rounded-full px-1.5 py-0.5 text-[8px] font-mono leading-none border border-emerald-900">
                    Lvl {calculatedLevel}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold tracking-tight font-sans text-white">{name}</h3>
                    {userProfile.userTier === 'PREMIUM' && (
                      <span className="text-[8px] font-extrabold font-mono bg-amber-400 text-slate-900 px-1 rounded-md tracking-wider">PREMIUM</span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-200 font-mono tracking-wider font-bold">KARTEL NO: #{userProfile.uid.toUpperCase()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                {userProfile.userTier === 'STANDART' && (
                  <button 
                    onClick={handleTierUpgrade}
                    className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-950 font-extrabold text-[9px] px-2.5 py-1.5 rounded-xl uppercase tracking-wider transition-all shadow-md shadow-amber-400/10 cursor-pointer"
                  >
                    PREMIUM YAP
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* TABBED NAVIGATION SEGMENTS - High fidelity custom tactile icons */}
            <nav className="flex justify-around bg-gray-50 border-b border-gray-100 p-1.5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setActiveTab('identity')}
                className={`flex-grow flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'identity'
                    ? 'bg-white text-emerald-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 font-extrabold'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Kimlik</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex-grow flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-white text-emerald-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 font-extrabold'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Güvenlik</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preferences')}
                className={`flex-grow flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'preferences'
                    ? 'bg-white text-emerald-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 font-extrabold'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Sistem</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('support')}
                className={`flex-grow flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-white text-emerald-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 font-extrabold'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Soru-Cevap</span>
              </button>
            </nav>

            {/* Scrolling Settings Body with Dynamic Tabs */}
            <div className="flex-grow overflow-y-auto p-4 space-y-5">
              
              {/* TAB 1: IDENTITY & AVATAR CAROUSEL */}
              {activeTab === 'identity' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Avatar Picker Carousel */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-widest pl-1 block">YENİ AVATARINIZI SEÇİN</span>
                    
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
                      {avatarOptions.map(avatar => {
                        const isSelected = currentAvatarUrl === avatar.url;
                        return (
                          <div 
                            key={avatar.id}
                            onClick={() => selectAvatar(avatar.url)}
                            className={`flex flex-col items-center text-center p-2.5 rounded-2xl shrink-0 border transition-all cursor-pointer select-none relative ${
                              isSelected 
                                ? 'bg-emerald-50/50 border-emerald-500 shadow-sm scale-102 font-bold' 
                                : 'bg-white border-gray-150 hover:border-gray-300'
                            }`}
                          >
                            <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-150">
                              <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[9px] text-gray-700 font-bold mt-1 max-w-[85px] truncate">{avatar.name}</span>
                            <span className="text-[7px] text-gray-400 max-w-[85px] leading-none truncate">{avatar.role}</span>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-emerald-600 rounded-full p-0.5 border border-white">
                                <Check className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Environmental Level Meter Progress Box */}
                  <div className="bg-gradient-to-br from-[#feb300]/10 to-amber-700/[0.03] p-4 rounded-3xl border border-[#feb300]/25 space-y-2 select-none">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-amber-700" />
                        <span className="text-xs font-bold text-amber-950 font-sans">Ekolojik Kahraman Derecesi</span>
                      </div>
                      <span className="text-[9px] bg-amber-400/25 text-amber-950 font-bold px-1.5 py-0.5 rounded-md font-mono">SEVİYE {calculatedLevel}</span>
                    </div>

                    <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                      Toplam <strong>{userProfile.treesSaved}</strong> ağaç tescili ile <strong>Yeşil Koruyucu</strong> unvanına sahipsiniz. {50 - userProfile.treesSaved} ağaç kurtarımı sonrasında yeni rütbeye yükseleceksiniz!
                    </p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-mono font-bold text-amber-700">
                        <span>Lvl {calculatedLevel} Progress</span>
                        <span>{levelProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${levelProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Identity Edit Form */}
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">Tam Adınız</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold font-sans focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                        />
                        <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">E-Posta Adresi</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold font-sans focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">Telefon Numarası</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold font-sans focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                        />
                        <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {saveSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl text-[11px] font-bold border border-emerald-150 flex items-center gap-1.5">
                        <Check className="w-4 h-4 stroke-[3] text-emerald-700" />
                        <span>Kişisel kimlik verileriniz tescillenerek başarıyla kaydedildi!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-1.5 shadow-md shadow-emerald-700/5 whitespace-nowrap"
                    >
                      {isSaving ? 'Kaydediliyor...' : 'Profil Bilgilerini Güncelle'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: ADVANCED SECURITY SHIELD */}
              {activeTab === 'security' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* Security Score gauge */}
                  <div className="bg-gray-50 rounded-3xl p-4 border border-gray-150 select-none flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block font-bold leading-none">CÜZDAN GÜVENLİK ANALİZİ</span>
                      <h4 className="text-sm font-extrabold text-gray-800">Hesap Tescil Sağlığı</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        Cüzdanınızı iki aşamalı doğrulamayla korumaya alın ve kurtarma anahtarınızı kopyalayın.
                      </p>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative flex items-center justify-center w-14 h-14 bg-white border border-gray-150 rounded-full shadow-inner shadow-sm">
                        <span className="text-xs font-bold text-emerald-700 font-mono">%{securityScore}</span>
                      </div>
                      <span className="text-[7px] text-emerald-700 font-bold uppercase tracking-widest mt-1">
                        {securityScore === 100 ? 'Maksimum Koruma' : 'Ortalama Koruma'}
                      </span>
                    </div>
                  </div>

                  {/* 2FA Toggle Card */}
                  <div className="bg-white rounded-3xl border border-gray-150 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="text-left select-none">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-extrabold text-gray-800">2FA SMS / E-Posta Onayı</p>
                          {userProfile.twoFactorEnabled ? (
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded-md leading-none py-0.5">AKTİF</span>
                          ) : (
                            <span className="text-[8px] bg-amber-500/10 text-amber-700 font-bold px-1 rounded-md leading-none py-0.5">DEVRE DIŞI</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 leading-normal font-medium mt-0.5">Giriş ve çekimlerde ek güvenlik barajı koyar.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('twoFactorEnabled')}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        userProfile.twoFactorEnabled ? 'bg-emerald-600' : 'bg-gray-250'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        userProfile.twoFactorEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Passphrase / Seed Mnemonic Box */}
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-150 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-gray-800">Mnemonic Kurtarma Anahtarı</h5>
                        <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                          Tescilli temiz enerji hisselerinizi, haklarınızı ve portföy bakiye değerlerini blockchain entegrasyonuyla güvenceleyen 12 kelimelik dijital şifreleme anahtarı.
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 select-none">
                      <button
                        type="button"
                        onClick={() => setShowSeedBackup(!showSeedBackup)}
                        className="text-emerald-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showSeedBackup ? 'Gizle' : 'Anahtarı Görüntüle & Göster'}</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {showSeedBackup && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-850 p-3.5 rounded-2xl mt-2 select-text font-mono text-[11px] leading-relaxed relative flex flex-col gap-2 overflow-hidden border border-gray-700"
                        >
                          <p className="text-[#a9b1d6]">
                            solar invest green wallet recovery mnemonic private seed clean energy
                          </p>
                          <button
                            type="button"
                            onClick={copySimulatedSeed}
                            className="self-end bg-[#feb300] hover:bg-amber-500 font-bold py-1.5 px-3 rounded-xl text-[10px] text-gray-950 flex items-center gap-1 cursor-pointer active:scale-95 transition-all mt-1"
                          >
                            {copiedSeed ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Kopyalandı!</span>
                              </>
                            ) : (
                              <span>Hepsini Kopyala</span>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* TAB 3: SYSTEM PREFERENCES & ECO CONTROLS */}
              {activeTab === 'preferences' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {/* Preferences Toggles List */}
                  <div className="bg-white rounded-3xl border border-gray-150 divide-y divide-gray-100 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.01)] text-left">
                    
                    {/* Toggle Push Notifications */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="text-left select-none">
                          <p className="text-xs font-bold text-gray-800">Push Bildirimleri</p>
                          <p className="text-[10px] text-gray-400 leading-normal font-medium mt-0.5">Anlık kazanç tescilleri ve raporlar.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('notificationEnabled')}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          userProfile.notificationEnabled ? 'bg-emerald-600' : 'bg-gray-250'
                        }`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          userProfile.notificationEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Toggle Eco-Certified Server Mode */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div className="text-left select-none">
                          <p className="text-xs font-bold text-gray-800">Eko-Sertifikalı Sunucu İletişimi</p>
                          <p className="text-[10px] text-gray-400 leading-normal font-medium mt-0.5">Düşük karbon salınımlı sunucu iletişim sistemleri.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('ecoFriendlyServerMode')}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          userProfile.ecoFriendlyServerMode ? 'bg-emerald-600' : 'bg-gray-250'
                        }`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          userProfile.ecoFriendlyServerMode ? 'translate-x-[20px]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Toggle Report Notification */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div className="text-left select-none">
                          <p className="text-xs font-bold text-gray-800">Haftalık Rapor E-Postası</p>
                          <p className="text-[10px] text-gray-400 leading-normal font-medium mt-0.5">Üretim ve karbon tescil detayları.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('reportEnabled')}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          userProfile.reportEnabled ? 'bg-emerald-600' : 'bg-gray-250'
                        }`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          userProfile.reportEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                  </div>

                  {/* PREMIUM VIP UPGRADE BANNER (if standard) */}
                  <AnimatePresence>
                    {userProfile.userTier === 'STANDART' ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 rounded-3xl text-white space-y-3 relative overflow-hidden"
                      >
                        <span className="text-[8px] font-extrabold font-mono bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider">PREMIUM PLUS</span>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold">VIP Yeşil Enerji Desteğini Keşfet</h4>
                          <p className="text-[10px] text-emerald-250 leading-relaxed font-sans">
                            VIP statüsüne geçiş yaparak anında sıfır komisyonlu para çekimleri, +%15 üretim getirisi ve eko sunucu önceliğini aktifleştirin.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleTierUpgrade}
                          className="bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-990 font-extrabold text-[10px] py-2 px-4 rounded-xl cursor-pointer w-full text-center tracking-wider block"
                        >
                          HEMEN GREEN PREMIUM YAP (1,500 TL DESTEK)
                        </button>
                      </motion.div>
                    ) : (
                      <div className="p-4 rounded-3xl bg-amber-400/5 border border-amber-400/20 text-center select-none flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-[#7E5700] uppercase font-sans tracking-wide">
                          Green Premium VIP Üyeliğiniz Aktiftir! +%15 Getiri Bonusu Tanımlandı.
                        </span>
                      </div>
                    )}
                  </AnimatePresence>

                  {upgradeSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-3 text-center"
                    >
                      <p className="text-xs font-bold text-amber-950 font-sans">
                        🎉 Tebrikler! Esor Premium VIP Üyeliğiniz ve tescilleriniz başarıyla başlatıldı!
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 4: INTERACTIVE Q&A / SUPPORT (DESTEK & SSS) */}
              {activeTab === 'support' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex gap-2 p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/10 select-none">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-emerald-800 font-sans">SolarInvest Destek Rehberi</p>
                      <p className="text-[9px] text-emerald-600 font-medium">Platformun işleyişi ve yatırımlarınızın hukuki tescilleri hakkında en çok sorulan sorular.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {faqData.map((faq, index) => {
                      const isOpen = openFaq === index;
                      return (
                        <div 
                          key={index} 
                          className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaq(isOpen ? null : index)}
                            className="w-full text-left p-3.5 flex justify-between items-center font-sans font-bold text-[11px] text-gray-800 hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-3.5 pb-3.5 pt-1 text-[10px] text-gray-500 leading-relaxed select-text"
                              >
                                <hr className="border-stone-200 pb-2" />
                                {faq.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* System Version info */}
                  <div className="pt-2 text-center select-none">
                    <span className="text-[8px] font-bold text-gray-400 font-mono tracking-widest text-[9px] block">
                      DESTEK MERKEZİ • SEKTÖREL ONAYLI KİMLİK SİSTEMİ v2.4
                    </span>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

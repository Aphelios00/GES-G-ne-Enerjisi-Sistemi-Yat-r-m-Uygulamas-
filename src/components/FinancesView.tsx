import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wallet, 
  ChevronRight, 
  Sun, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Plus, 
  X, 
  ShieldCheck, 
  Download, 
  Info,
  ChevronDown
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { SavedAccount } from '../types';

export const FinancesView: React.FC = () => {
  const {
    userProfile,
    savedAccounts,
    withdrawals,
    initiateWithdrawal,
    currentWithdrawalDetails,
    withdrawalStep,
    setWithdrawalStep,
  	addNewAccount
  } = useSolar();

  // Primary finances view variables
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('bank_ziraat');
  const [showAddAccount, setShowAddAccount] = useState(false);
  
  // Custom bank adding inputs
  const [newBankName, setNewBankName] = useState('Ziraat Bankası');
  const [newIban, setNewIban] = useState('TR');
  const [bankError, setBankError] = useState('');

  // Primary states error logging
  const [formError, setFormError] = useState('');

  // Mock bar heights mapping the exact heights as seen in the mockup screenshot 4
  const weeklyEarns = [
    { day: 'PZT', label: '120 ₺', height: 'h-[36%]', current: false },
    { day: 'SAL', label: '240 ₺', height: 'h-[60%]', current: false },
    { day: 'ÇAR', label: '310 ₺', height: 'h-[80%]', current: false, primary: true }, // highest day Çarşamba is green/primary-container styled
    { day: 'PER', label: '190 ₺', height: 'h-[48%]', current: false },
    { day: 'CUM', label: '280 ₺', height: 'h-[70%]', current: false },
    { day: 'CMT', label: '350 ₺', height: 'h-[90%]', current: false },
    { day: 'PAZ', label: `${userProfile.todayEarnings} ₺`, height: 'h-[55%]', current: true } // Bugün Pazartesi/Pazar is amber accent styled
  ];

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Lütfen geçerli bir çekim tutarı giriniz.');
      return;
    }

    if (amount < 100) {
      setFormError('Minimum çekim limiti 100,00 ₺’dir.');
      return;
    }

    if (userProfile.balance < amount) {
      setFormError('Çekmek istediğiniz tutar mevcut bakiyenizden fazladır.');
      return;
    }

    const selectedAcc = savedAccounts.find(a => a.id === selectedAccountId);
    if (!selectedAcc) {
      setFormError('Lütfen geçerli bir alıcı banka hesabı seçiniz.');
      return;
    }

    // Call state dispatcher
    const result = initiateWithdrawal(amount, selectedAcc.bankName, selectedAcc.iban);
    if (result) {
      // Successfully registered and transition. Reset form state.
      setWithdrawalAmount('');
    } else {
      setFormError('İşlem sırasında beklenmedik bir sistem hatası oluştu.');
    }
  };

  const handleMaxClick = () => {
    setWithdrawalAmount(userProfile.balance.toString());
  };

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBankError('');

    if (!newBankName.trim()) {
      setBankError('Lütfen bir banka adı belirtiniz.');
      return;
    }

    const cleanIban = newIban.trim().replace(/\s/g, '');
    if (!cleanIban.startsWith('TR') || cleanIban.length < 15) {
      setBankError('Lütfen TR ile başlayan geçerli bir IBAN giriniz.');
      return;
    }

    addNewAccount(newBankName, cleanIban);
    setNewIban('TR');
    setShowAddAccount(false);
  };

  // 1. RECEIPT SUCCESS VIEW DISPLAY ("Talebiniz Alındı")
  if (withdrawalStep === 'success' && currentWithdrawalDetails) {
    const details = currentWithdrawalDetails;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6 pb-24 text-center max-w-md mx-auto"
      >
        <div className="pt-6 relative flex flex-col items-center">
          <div className="absolute top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl scale-150"></div>
          <div className="relative w-24 h-24 bg-emerald-700 rounded-full flex items-center justify-center shadow-lg shadow-emerald-700/20">
            <CheckCircle2 className="text-white w-14 h-14 stroke-[2]" />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Talebiniz Alındı</h1>
          <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
            Para çekme talebiniz başarıyla sisteme iletildi. İşleminiz kontrol edildikten sonra onaylanacaktır.
          </p>
        </div>

        {/* Transaction detailed specs paper */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_8px_30px_rgba(13,99,27,0.04)] text-left">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase border-b border-gray-150 pb-2 mb-4 font-mono">
            İŞLEM DETAYLARI
          </h4>
          
          <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold font-sans">Tutar</span>
              <span className="text-sm font-bold text-emerald-700">
                {details.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold font-sans">Alıcı IBAN</span>
              <span className="text-gray-800 font-bold">{details.iban}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold font-sans">İşlem Tipi</span>
              <span className="text-gray-800 font-bold font-sans">Banka Transferi</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold font-sans">Tahmini Varış</span>
              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-sans font-bold">1-3 İş Günü</span>
              </div>
            </div>
          </div>
        </div>

        {/* Double Action Button Tray */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={() => setWithdrawalStep('none')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-emerald-700/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            Dashboard'a Dön
          </button>
          <button 
            onClick={() => alert(`DEKONT DETAYI:\n-------------------------\nReferans Hash: ${details.txHash}\nTarih: ${details.date}\nTutar: ${details.amount.toLocaleString('tr-TR')} TL\nBanka: ${details.bankName}\nIBAN: ${details.iban}\n-------------------------\nTamamen Şifreli ve Eko-Sertifikalı Sunucu Onaylı.`)}
            className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-emerald-700 active:scale-[0.98] transition-all font-bold py-3.5 rounded-2xl cursor-pointer"
          >
            Dekontu İndir
          </button>
        </div>

        {/* Informative footnote about eco-friendly server infrastructure */}
        <div className="bg-emerald-500/5 p-4 rounded-3xl border border-emerald-500/10 text-left flex items-start gap-3 mt-4">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-gray-600 font-medium">
            SolarInvest çevreye duyarlı bir platformdur. Bu işlemin karbon ayak izi minimize edilmiş sunulardan oluşan yeşil sunucular üzerinden gerçekleştirildiğini biliyor muydunuz?
          </p>
        </div>

        {/* Golden Hour Solar panel image banner */}
        <div className="overflow-hidden rounded-3xl border border-gray-150 shadow-sm mt-4">
          <img 
            className="w-full h-28 object-cover opacity-90" 
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxlFxJSDp6nR_zWRCgjZP_9N0ShxJ2qo91DHDuxWKEyiwwVALNnr_tFmS2QC6Z_mt4cTGIG50t76bofvpCVo9PFgdOjFS0yKCNk3-ypFUm4t07zt4dSzqSrMJ1wO1t3lafZyn6Wjv3kgEa8etSUqLljdamZ4uG8JiLXj2gIJPakacNUh9BChBcyoRHjBaRn8qHv4p10uoil6KfrWwP4oWWr4o0peQCtQhfysZFw-HaP1tFFx_0CcgILb9LcJxUYhzRezPEbHvwea-f" 
            alt="Solar Sunset" 
          />
        </div>
      </motion.div>
    );
  }

  // 2. INPUT WITHDRAWAL FORM VIEW SCREEN ("Para Çek")
  if (withdrawalStep === 'form') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6 pb-24 max-w-md mx-auto"
      >
        {/* Nav header */}
        <section className="flex items-center justify-between">
          <button 
            onClick={() => { setWithdrawalStep('none'); setFormError(''); }}
            className="flex items-center gap-1 text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            <span>Para Çek</span>
          </button>
          <span className="text-[10px] font-bold text-gray-400 font-mono tracking-widest uppercase">GÜVENLİ TRANSFER</span>
        </section>

        {/* Current Balance display paper */}
        <section className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgba(13,99,27,0.03)] border-l-4 border-amber-500 border border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">MEVCUT BAKİYE</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {userProfile.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm font-bold text-gray-500 font-sans">TL</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-600 font-bold text-xs select-none">
            <span className="p-1 bg-emerald-50 rounded-full">🌱</span>
            <span>Yatırımlardan elde edilen kazanç</span>
          </div>
        </section>

        {/* MAIN WITHDRAWAL INPUT FORM */}
        <form onSubmit={handleWithdrawalRequest} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-sans pl-1">
              Çekilecek Tutar (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="0,00"
                min="100"
                step="10"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-4 pr-16 text-2xl font-extrabold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider active:scale-95 transition-all cursor-pointer"
              >
                TÜMÜ
              </button>
            </div>
          </div>

          {/* Saved Bank Accounts list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-sans">
                Banka Hesabı Seçin
              </label>
              <button
                type="button"
                onClick={() => setShowAddAccount(true)}
                className="text-emerald-700 hover:text-emerald-800 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                <span>YENİ EKLE</span>
              </button>
            </div>

            <div className="space-y-3">
              {savedAccounts.map(acc => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`p-4 rounded-3xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/10 ring-4 ring-emerald-600/5'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-bold text-gray-800 leading-tight">{acc.bankName}</p>
                      <p className="text-[11px] font-mono font-medium text-gray-500 mt-0.5">{acc.iban}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction Summary spec receipt */}
          <div className="bg-gray-50 rounded-3xl p-4 border border-gray-150 space-y-3">
            <h4 className="text-[9px] font-bold text-gray-400 tracking-wider uppercase border-b border-gray-200 pb-1.5 font-mono">
              İŞLEM ÖZETİ
            </h4>
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-gray-500">Tahmini Varış</span>
              <span className="text-gray-800 font-mono font-bold">24 Saat İçinde</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-gray-500">İşlem Ücreti</span>
              <span className="text-emerald-700 font-bold">Ücretsiz</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200 text-xs font-bold font-sans">
              <span className="text-gray-800">Net Tutar</span>
              <span className="text-sm font-semibold text-emerald-700 font-mono">
                {(withdrawalAmount ? parseFloat(withdrawalAmount) || 0 : 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
          </div>

          {formError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-2xl text-[11px] font-semibold leading-relaxed flex items-start gap-1.5 border border-red-100">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="submit"
            className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-700/10 active:scale-[0.98] transition-all hover:bg-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-white stroke-[2]" />
            <span>Çekimi Onayla</span>
          </button>
          
          <p className="text-center text-[10px] text-gray-400/90 font-medium px-4 leading-normal select-none">
            Para çekme işleminiz güvenli bir şekilde şifrelenir ve bankanıza iletilir.
          </p>
        </form>

        {/* BANK ADDING MODAL DIALOG */}
        <AnimatePresence>
          {showAddAccount && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setShowAddAccount(false); setBankError(''); }}
                className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 p-5 space-y-4"
              >
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest font-mono">YENİ BANKA HESABI</h3>
                  <button 
                    onClick={() => { setShowAddAccount(false); setBankError(''); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddAccountSubmit} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">Banka Adı</label>
                    <select
                      value={newBankName}
                      onChange={(e) => setNewBankName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-250 rounded-2xl py-3 px-4 text-xs font-bold font-sans focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    >
                      <option value="Ziraat Bankası">Ziraat Bankası</option>
                      <option value="Garanti BBVA">Garanti BBVA</option>
                      <option value="Türkiye İş Bankası">Türkiye İş Bankası</option>
                      <option value="Yapı Kredi">Yapı Kredi</option>
                      <option value="Akbank">Akbank</option>
                      <option value="QNB Finansbank">QNB Finansbank</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono pl-1">IBAN Numarası</label>
                    <input
                      type="text"
                      value={newIban}
                      onChange={(e) => setNewIban(e.target.value)}
                      placeholder="TR00 0000 0000..."
                      maxLength={34}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent uppercase"
                    />
                  </div>

                  {bankError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-2xl text-[11px] font-medium leading-relaxed border border-red-100">
                      <span>{bankError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-700/15 active:scale-95 transition-all text-sm cursor-pointer"
                  >
                    Hesabı Ekle
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // 3. BASE TAB VIEW SCREEN (Finances and Charts)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 pb-24"
    >
      {/* SECTION 1: WITHDRAWABLE BALANCE ACTIVE CARD */}
      <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(13,99,27,0.03)] p-5 border-l-4 border-amber-500 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Çekilebilir Bakiye</p>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1 tracking-tight font-sans">
              ₺{userProfile.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-emerald-500/10 p-2.5 rounded-2xl">
            <Wallet className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        <button 
          onClick={() => setWithdrawalStep('form')}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Para Çek</span>
          <ChevronRight className="w-4 h-4 text-emerald-250 shrink-0 mt-0.5" />
        </button>
      </section>

      {/* SECTION 2: EARNINGS ANALYTICS BAR CHART ("Kazanç Analizi") */}
      <section className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(13,99,27,0.03)] p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase">Kazanç Analizi</h3>
          <div className="flex bg-gray-100 rounded-full p-1 border border-gray-150">
            <button className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white shadow-sm text-emerald-700">Günlük</button>
            <button className="px-3 py-1 rounded-full text-[10px] font-extrabold text-gray-400">Aylık</button>
            <button className="px-3 py-1 rounded-full text-[10px] font-extrabold text-gray-400">Yıllık</button>
          </div>
        </div>

        {/* Custom rounded bar chart representation */}
        <div className="h-44 flex items-end justify-between gap-1 px-1 mb-4 select-none">
          {weeklyEarns.map((bar, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center flex-1 group"
            >
              <div 
                className={`w-full max-w-[20px] rounded-t-lg transition-all duration-300 relative group cursor-pointer ${bar.height} ${
                  bar.current 
                    ? 'bg-amber-500 shadow-[0_4px_12px_rgba(254,179,0,0.2)] hover:bg-amber-600' 
                    : bar.primary 
                      ? 'bg-emerald-600 shadow-[0_4px_12px_rgba(13,99,27,0.15)] hover:bg-emerald-700'
                      : 'bg-gray-100 hover:bg-emerald-500/20'
                }`}
              >
                {/* Micro tooltip displayed on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {bar.label}
                </div>
              </div>
              <span className="text-[9px] font-bold text-gray-400 tracking-wider font-mono mt-2">{bar.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: TRANSACTION HISTORY LIST */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase px-1 leading-tight font-sans">İşlem Geçmişi</h3>
          <span className="text-gray-400 font-bold text-[10px] uppercase font-mono tracking-wider">Tüm Kayıtlar</span>
        </div>

        <div className="space-y-3">
          {/* Reactive ledger checks */}
          {withdrawals.length > 0 && withdrawals.map(w => (
            <div 
              key={w.id} 
              className="p-4 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex justify-between items-center transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Para Çekme Talebi</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 font-medium">Banka Transferi</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-gray-800 font-mono">-₺{w.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                <span className="inline-block px-2 py-0.5 mt-1 rounded text-[8px] font-extrabold text-amber-700 bg-amber-50 uppercase tracking-widest font-mono">
                  {w.status === 'PROCESSING' ? 'İŞLEMDE' : 'TAMAMLANDI'}
                </span>
              </div>
            </div>
          ))}

          {/* Hardcoded system validated ledger entries */}
          <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <Sun className="w-5 h-5 fill-amber-500/10" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Solar Üretim Kazancı</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5 font-medium">14 Mart 2026</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-emerald-700 font-mono">+₺420,50</p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded text-[8px] font-extrabold text-emerald-700 bg-emerald-50 uppercase tracking-widest font-mono">
                TAMAMLANDI
              </span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <Sun className="w-5 h-5 fill-amber-500/10" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Solar Üretim Kazancı</p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5 font-medium">10 Mart 2026</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-emerald-700 font-mono">+₺385,25</p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded text-[8px] font-extrabold text-emerald-700 bg-emerald-50 uppercase tracking-widest font-mono">
                TAMAMLANDI
              </span>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

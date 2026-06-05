import React, { useState } from 'react';
import { Bell, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { ProfileSettingsModal } from './ProfileSettingsModal';

export const Header: React.FC = () => {
  const { userProfile } = useSolar();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Haftalık Kazanç Dağıtıldı',
      description: 'Santral A ve B ortaklık paylarınızın ürettiği 420.50 ₺ hesabınıza aktarıldı.',
      time: '2 saat önce',
      type: 'success'
    },
    {
      id: 'n2',
      title: 'Yeşil Enerji Sertifikanız Hazır',
      description: 'Mayıs ayı CO2 tasarruf tescil sertifikanızı onay sekmesinden indirebilirsiniz.',
      time: '1 gün önce',
      type: 'info'
    },
    {
      id: 'n3',
      title: 'Güneş Işınımı Zirvede!',
      description: 'Antalya bölgesinde güneşlenme endeksi mevsim normallerinin üzerine çıktı.',
      time: '2 gün önce',
      type: 'alert'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-3 flex items-center justify-between transition-all duration-200">
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setShowSettings(true)}
          className="relative group cursor-pointer animate-none"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 overflow-hidden shadow-sm transition-transform group-hover:scale-105 duration-200">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              src={userProfile.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuA20nJRmumS_2n3t2GyZ-aneOpZt-HdLjvYyLKKb0WdfoEA_xB-1MrSlzMKBRSIm6G3xwRsjhisIaJ9sDNRrCp1l_5y6mPdju33I6S9YURSAG6zJVyQFylevocXh5l40iO-jEZcjq58c9MRoXu6b6PuUihjrq9H_65SUrA32aOD3PnEpaRrJBmtkjibFdXMo75oImD3L9F5AhpUnZ3HJC9QPdrSxlCJe5j-g7r_scbycta2sJHrUoTCB0NU3b5uXQ7Z9GlnL7o5Oy8Y"}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium leading-tight">Merhaba,</p>
          <h2 className="text-sm font-semibold text-gray-900 font-sans tracking-tight">{userProfile.name}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Brand Display Center */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">SOLARINVEST</span>
        </div>

        {/* Notifications Trigger */}
        <div className="relative">
          <button 
            id="notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-150 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown Card (Tactile micro components) */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Bildirimler</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">3 Yeni</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-2">
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                        {notif.type === 'info' && <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                        {notif.type === 'alert' && <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-gray-900 leading-tight">{notif.title}</p>
                          <p className="text-[11px] text-gray-500 leading-normal">{notif.description}</p>
                          <p className="text-[9px] text-gray-400 font-mono mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Settings Full Drawer Modal */}
      <ProfileSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </header>
  );
};

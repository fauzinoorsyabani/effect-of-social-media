import React from 'react';
import { Sliders, Clock, BarChart2, Cpu, ShieldCheck } from 'lucide-react';
import logoWebp from '../assets/logo.webp';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuthModal }) {
  const tabs = [
    { id: 'simulator', label: 'Impact Simulator', shortLabel: 'Simulator', icon: Sliders },
    { id: 'history', label: 'Personal Journey', shortLabel: 'Journey', icon: Clock },
    { id: 'analytics', label: 'Cohort Analytics', shortLabel: 'Cohort', icon: BarChart2 },
    { id: 'models', label: 'Model Architecture', shortLabel: 'Models', icon: Cpu },
  ];

  return (
    <header className="sticky top-2 sm:top-4 z-50 px-3 sm:px-6 lg:px-10 max-w-6xl mx-auto w-full select-none">
      <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-white/80 px-3 sm:px-5 h-13 sm:h-15 flex items-center justify-between transition-all">
        
        {/* Brand Identity & Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <div 
            id="header-logo-slot" 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 p-0.5 bg-slate-50"
          >
            <img src={logoWebp} alt="PulseAI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-sm sm:text-base tracking-tight text-slate-900 hidden xs:inline">
            Pulse<span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Navigation Tabs (No black background, clean indicator, responsive labels, horizontally scrollable on small screens) */}
        <nav className="flex items-center space-x-0.5 sm:space-x-1 overflow-x-auto no-scrollbar py-1 mx-1 sm:mx-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Security / Account Indicator (Responsive: Compact Dot on Mobile, Pill on Desktop) */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenAuthModal}
            title={currentUser ? currentUser.email : 'Local Device Storage (Click to sync)'}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-mono-num font-medium text-slate-700 hover:bg-slate-100/70 border border-slate-200/50 flex items-center space-x-1.5 sm:space-x-2 transition cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
            <span className="hidden sm:inline truncate max-w-[120px]">{currentUser ? currentUser.email.split('@')[0] : 'Private Local'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

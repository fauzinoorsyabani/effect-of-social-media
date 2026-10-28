import React from 'react';
import { Sliders, Clock, BarChart2, Cpu } from 'lucide-react';
import logoWebp from '../assets/logo.webp';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuthModal }) {
  const tabs = [
    { id: 'simulator', label: 'Impact Simulator', shortLabel: 'Simulator', icon: Sliders },
    { id: 'history', label: 'Personal Journey', shortLabel: 'Journey', icon: Clock },
    { id: 'analytics', label: 'Cohort Analytics', shortLabel: 'Cohort', icon: BarChart2 },
    { id: 'models', label: 'Model Architecture', shortLabel: 'Models', icon: Cpu },
  ];

  return (
    <header className="sticky top-2 sm:top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full select-none">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-slate-200/60 p-2 sm:px-5 sm:h-15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 transition-all">
        
        {/* Top Header Row on Mobile / Left Section on Desktop */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto px-1 sm:px-0 shrink-0">
          {/* Brand Identity & Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <div 
              id="header-logo-slot" 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 p-0.5 bg-slate-50"
            >
              <img src={logoWebp} alt="PulseAI Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-slate-900">
              Pulse<span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Account Indicator on Mobile (Visible top right, completely separated from tabs so zero overlap) */}
          <div className="sm:hidden">
            <button
              onClick={onOpenAuthModal}
              title={currentUser ? currentUser.email : 'Local Device Storage (Click to sync)'}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono-num font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5 cursor-pointer bg-transparent border-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
              <span className="truncate max-w-[120px]">{currentUser ? currentUser.email.split('@')[0] : 'Private Local'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        {/* On Mobile: Responsive 4-col grid, never overlaps, crystal-clear high-contrast active state */}
        {/* On Desktop: Sleek centered inline flex */}
        <nav className="grid grid-cols-4 sm:flex items-center gap-1 sm:space-x-1 w-full sm:w-auto p-1 bg-slate-100/70 sm:bg-transparent rounded-xl sm:rounded-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 sm:py-2 px-2 sm:px-3.5 rounded-lg sm:rounded-full text-xs font-medium flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 sm:hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Security / Account Indicator on Desktop (Transparent by default, hover background, no white box) */}
        <div className="hidden sm:flex items-center shrink-0">
          <button
            onClick={onOpenAuthModal}
            title={currentUser ? currentUser.email : 'Local Device Storage (Click to sync)'}
            className="px-3 py-1.5 rounded-full text-xs font-mono-num font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center space-x-1.5 cursor-pointer bg-transparent border-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
            <span className="truncate max-w-[130px]">{currentUser ? currentUser.email.split('@')[0] : 'Private Local'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

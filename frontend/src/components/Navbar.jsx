import React from 'react';
import { Sliders, Clock, BarChart2, Cpu } from 'lucide-react';
import logoWebp from '../assets/logo.webp';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuthModal }) {
  const tabs = [
    { id: 'simulator', label: 'Impact Simulator', icon: Sliders },
    { id: 'history', label: 'Personal Journey', icon: Clock },
    { id: 'analytics', label: 'Cohort Analytics', icon: BarChart2 },
    { id: 'models', label: 'Model Architecture', icon: Cpu },
  ];

  return (
    <header className="sticky top-4 z-50 px-6 sm:px-10 lg:px-14 max-w-6xl mx-auto w-full select-none">
      <div className="bg-white/85 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 px-4 sm:px-6 h-15 flex items-center justify-between transition-all">
        
        {/* Brand Identity & Logo (Just Logo & PulseAI) */}
        <div className="flex items-center space-x-2.5">
          <div 
            id="header-logo-slot" 
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 p-0.5 bg-slate-50"
          >
            <img src={logoWebp} alt="PulseAI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-base tracking-tight text-slate-900">
            Pulse<span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Navigation Tabs (No gray background, completely rounded pill tabs, active is solid black) */}
        <nav className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Security / Account Indicator (Rounded Full Pill) */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono-num font-medium text-slate-700 hover:bg-slate-100/70 border border-slate-200/50 flex items-center space-x-2 transition cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>{currentUser ? currentUser.email : 'Private Local'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

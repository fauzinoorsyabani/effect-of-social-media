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
      <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80 px-4 sm:px-6 h-16 flex items-center justify-between transition-all">
        
        {/* Brand Identity & Logo */}
        <div className="flex items-center space-x-3">
          <div 
            id="header-logo-slot" 
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 p-0.5 bg-slate-50 shadow-2xs"
          >
            <img src={logoWebp} alt="PulseAI Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base tracking-tight text-slate-900">
                Pulse<span className="text-blue-600">AI</span>
              </span>
              <span className="hidden sm:inline-block font-mono-num text-[10px] uppercase px-1.5 py-0.5 rounded-md bg-slate-100/80 text-slate-600 font-medium tracking-wide">
                v2.4
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block font-mono-num">
              Student Digital Phenomics Platform
            </span>
          </div>
        </div>

        {/* Navigation Tabs (4 Tabs) */}
        <nav className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100/70 backdrop-blur-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Security / Account Indicator */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 rounded-xl text-xs font-mono-num font-medium text-slate-700 bg-slate-100/70 hover:bg-slate-200/70 backdrop-blur-xs flex items-center space-x-2 transition cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>{currentUser ? currentUser.email : 'Private Local Mode'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

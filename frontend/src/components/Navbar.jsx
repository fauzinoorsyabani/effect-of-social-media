import React from 'react';
import { Sliders, Clock, BarChart2, Cpu, User } from 'lucide-react';
import logoWebp from '../assets/logo.webp';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuthModal }) {
  const tabs = [
    { id: 'simulator', label: 'Impact Simulator', icon: Sliders },
    { id: 'history', label: 'Personal Journey', icon: Clock },
    { id: 'analytics', label: 'Cohort Analytics', icon: BarChart2 },
    { id: 'models', label: 'Model Architecture', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Identity & Dedicated Logo Slot */}
        <div className="flex items-center space-x-3">
          <div 
            id="header-logo-slot" 
            className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center overflow-hidden shrink-0"
          >
            <img src={logoWebp} alt="PulseAI Logo" className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-200" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-lg text-slate-900">
              Pulse<span className="text-emerald-600">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono font-medium">
              Digital Phenomics Platform
            </span>
          </div>
        </div>

        {/* Navigation Tabs (4 Tabs) */}
        <nav className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 border border-slate-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Account / Persistence Status Controls */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentUser ? currentUser.email : 'Private Mode (Local)'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

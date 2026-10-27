import React from 'react';
import { Sliders, Clock, BarChart2, Cpu, User, Shield } from 'lucide-react';
import logoWebp from '../assets/logo.webp';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuthModal }) {
  const tabs = [
    { id: 'simulator', label: 'Impact Simulator', icon: Sliders },
    { id: 'history', label: 'Personal Journey', icon: Clock },
    { id: 'analytics', label: 'Cohort Analytics', icon: BarChart2 },
    { id: 'models', label: 'Model Architecture', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e0e5e9] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        
        {/* Brand Identity & Logo */}
        <div className="flex items-center space-x-3">
          <div 
            id="header-logo-slot" 
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-[#e0e5e9] p-0.5 bg-[#fafbfc]"
          >
            <img src={logoWebp} alt="PulseAI Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base tracking-tight text-[#20252b]">
                Pulse<span className="text-[#294f82]">AI</span>
              </span>
              <span className="hidden sm:inline-block font-mono-num text-[10px] uppercase px-1.5 py-0.5 rounded border border-[#e0e5e9] bg-[#f4f6f8] text-[#5b6570] font-medium tracking-wide">
                v2.4 Production
              </span>
            </div>
            <span className="text-[11px] text-[#5b6570] block font-mono-num">
              Student Digital Phenomics Platform
            </span>
          </div>
        </div>

        {/* Technical Navigation Tabs (4 Tabs) */}
        <nav className="flex items-center space-x-1 p-1 rounded-lg border border-[#e0e5e9] bg-[#fafbfc] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#20252b] border border-[#e0e5e9] shadow-xs'
                    : 'text-[#5b6570] hover:text-[#20252b] hover:bg-[#f4f6f8]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#294f82]' : 'text-[#5b6570]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Security / Account Indicator */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={onOpenAuthModal}
            className="px-3 py-1.5 rounded-md text-xs font-mono-num font-medium text-[#20252b] bg-[#fafbfc] hover:bg-[#f4f6f8] border border-[#e0e5e9] flex items-center space-x-2 transition cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            <span>{currentUser ? currentUser.email : 'Local Device: Private'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

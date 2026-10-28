import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SimulatorTab from './components/tabs/SimulatorTab';
import PersonalJourneyTab from './components/tabs/PersonalJourneyTab';
import CohortAnalyticsTab from './components/tabs/CohortAnalyticsTab';
import ModelArchitectureTab from './components/tabs/ModelArchitectureTab';
import AuthModal from './components/ui/AuthModal';
import {
  fetchOverview,
  fetchModels,
  predictWellness,
  saveAssessmentToCloud,
  fetchCloudHistory,
} from './services/api';

const STORAGE_KEY = 'pulse_wellness_history';
const USER_KEY = 'pulse_current_user';

const DEFAULT_PARAMS = {
  daily_usage_hours: 4.5,
  sleep_duration_hours: 7.0,
  sleep_quality_score: 7,
  weekend_extra_hours: 1.5,
  late_night_usage: true,
  primary_platform: 'Instagram',
  social_comparison_frequency: 'Sometimes',
  age: 20,
  gender: 'Female',
  academic_level: 'Undergraduate',
  device_type: 'Smartphone',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [overviewData, setOverviewData] = useState(null);
  const [modelsData, setModelsData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceTimerRef = useRef(null);

  // 1. Initial Load
  useEffect(() => {
    // Load local user
    try {
      const savedUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if (savedUser) setCurrentUser(savedUser);
    } catch (e) {
      console.warn(e);
    }

    // Load local history
    try {
      const localHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setHistory(localHistory);
    } catch (e) {
      console.warn(e);
    }

    // Fetch Overview & Models
    fetchOverview().then(setOverviewData).catch(console.error);
    fetchModels().then(setModelsData).catch(console.error);
  }, []);

  // 2. Debounced Real-time Prediction
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const payload = {
          age: params.age,
          gender: params.gender,
          academic_level: params.academic_level,
          primary_platform: params.primary_platform,
          daily_usage_hours: params.daily_usage_hours,
          weekend_extra_hours: params.weekend_extra_hours,
          device_type: params.device_type,
          sleep_duration_hours: params.sleep_duration_hours,
          sleep_quality_score: params.sleep_quality_score,
          phone_before_sleep: params.late_night_usage,
          social_comparison_freq: params.social_comparison_frequency,
        };
        const res = await predictWellness(payload);
        if (res.success) {
          setPrediction(res);
        }
      } catch (err) {
        console.error('Inference error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceTimerRef.current);
  }, [params]);

  // 3. Save Assessment
  const handleSaveAssessment = async () => {
    if (!prediction) return;
    const preds = prediction.predictions;
    const now = new Date();
    const entry = {
      id: 'loc_' + Date.now(),
      timestamp: now.toISOString(),
      display_date: now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      daily_usage_hours: params.daily_usage_hours,
      sleep_duration_hours: params.sleep_duration_hours,
      sleep_quality_score: params.sleep_quality_score,
      primary_platform: params.primary_platform,
      late_night_usage: params.late_night_usage,
      predicted_gpa: preds.gpa,
      predicted_mental_health: preds.mental_health_index,
      impact_class: preds.overall_impact,
      archetype: preds.archetype.name,
      archetype_tier: preds.archetype.tier,
    };

    // Update Local
    const updatedHistory = [...history, entry];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    // Optional Cloud Sync
    if (currentUser?.user_id) {
      try {
        await saveAssessmentToCloud({
          ...entry,
          user_id: currentUser.user_id,
          guidance: prediction.guidance,
        });
      } catch (e) {
        console.warn('Cloud sync error:', e);
      }
    }

    alert('Assessment saved to personal journey tracker!');
  };

  // 4. Clear History
  const handleClearHistory = () => {
    if (window.confirm('Clear all locally saved assessment history on this device?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // 5. Export JSON
  const handleExportHistory = () => {
    if (history.length === 0) {
      alert('No assessments recorded yet. Run a simulation and save to create history.');
      return;
    }
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse_wellness_history_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 6. Reset
  const handleResetDefaults = () => {
    setParams(DEFAULT_PARAMS);
  };

  // 7. Auth Success
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full space-y-6 sm:space-y-8">
        {activeTab === 'simulator' && (
          <SimulatorTab
            params={params}
            setParams={setParams}
            prediction={prediction}
            loading={loading}
            onSaveAssessment={handleSaveAssessment}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {activeTab === 'history' && (
          <PersonalJourneyTab
            history={history}
            onClearHistory={handleClearHistory}
            onExportHistory={handleExportHistory}
          />
        )}

        {activeTab === 'analytics' && <CohortAnalyticsTab overviewData={overviewData} />}

        {activeTab === 'models' && <ModelArchitectureTab modelsData={modelsData} />}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <footer className="mt-12 sm:mt-16 bg-white/80 py-6 sm:py-8 text-center text-xs text-slate-500 font-mono-num border-t border-slate-100/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>PulseAI Student Digital Wellness & Habits Reflection Platform</span>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:space-x-4 text-[11px] text-slate-600">
            <span>XGBoost 96.2% Acc</span>
            <span>Ridge GPA R² 0.50</span>
            <span>K-Means k=3</span>
          </div>
          <span className="text-[11px] text-slate-400">Zero Data Leakage Pipeline</span>
        </div>
      </footer>
    </div>
  );
}



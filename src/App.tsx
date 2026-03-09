import React, { useState, useEffect } from 'react';
import { HeartPulse, Settings, Cpu, UserCircle } from 'lucide-react';
import ManualInput from './components/ManualInput';
import ArduinoInput from './components/ArduinoInput';
import Report from './components/Report';
import Profile from './components/Profile';
import { Features, ClassificationResult, classifyDisease } from './services/geminiService';
import { getProfile, saveReportToHistory } from './services/profileService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'manual' | 'arduino' | 'profile'>('manual');
  const [features, setFeatures] = useState<Features>({
    age: 45,
    heartRate: 75,
    prInterval: 160,
    qrsDuration: 90,
    qtcInterval: 400,
    stDeviation: 0,
    pWaveAmplitude: 1.0,
    lvhIndex: 10,
    arrhythmiaIndex: 0,
    s1Amplitude: 50,
    s2Amplitude: 40,
    s3Presence: false,
    s4Presence: false,
    murmurGrade: 0,
    clickPresence: false,
    openingSnap: false,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  useEffect(() => {
    // Load age from profile if available
    const profile = getProfile();
    if (profile && profile.age) {
      setFeatures(prev => ({ ...prev, age: profile.age }));
    }
  }, [activeTab]);

  const handleAnalyze = async (data: Features) => {
    setLoading(true);
    try {
      const res = await classifyDisease(data);
      setResult(res);
      
      // Save to history
      saveReportToHistory({
        classification: res.classification,
        riskLevel: res.riskLevel,
        features: data,
        therapeutics: res.therapeutics,
        confirmatoryTests: res.confirmatoryTests,
        reasoning: res.reasoning
      });
      
    } catch (error) {
      console.error("Classification failed", error);
      alert("Failed to analyze features. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-sm">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">CardioSense AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">ECG & PCG Analysis Platform</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-200/50 p-1 rounded-xl flex-wrap justify-center gap-1">
            <button
              onClick={() => { setActiveTab('manual'); setResult(null); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'manual' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              Manual Input
            </button>
            <button
              onClick={() => { setActiveTab('arduino'); setResult(null); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'arduino' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Arduino Integration
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setResult(null); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'profile' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              Profile & History
            </button>
          </div>
        </div>

        {!result ? (
          <div className="transition-all duration-300">
            {activeTab === 'manual' && (
              <ManualInput 
                features={features} 
                onChange={setFeatures} 
                onSubmit={() => handleAnalyze(features)} 
                loading={loading} 
              />
            )}
            {activeTab === 'arduino' && (
              <ArduinoInput 
                userAge={features.age}
                onDataAcquired={(acquiredFeatures) => {
                  setFeatures(acquiredFeatures);
                  handleAnalyze(acquiredFeatures);
                }} 
              />
            )}
            {activeTab === 'profile' && (
              <Profile />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setResult(null)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              &larr; Back to Input
            </button>
            <Report result={result} />
          </div>
        )}
      </main>
    </div>
  );
}

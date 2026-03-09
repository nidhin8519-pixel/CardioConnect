import React, { useState } from 'react';
import { Features } from '../services/geminiService';
import { processRawSignals } from '../services/signalProcessing';
import { Activity, Cpu, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface ArduinoInputProps {
  onDataAcquired: (features: Features) => void;
  userAge: number;
}

export default function ArduinoInput({ onDataAcquired, userAge }: ArduinoInputProps) {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'acquiring' | 'processing' | 'success' | 'error'>('disconnected');
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState('');

  // Mock Arduino Connection and Data Acquisition
  const handleConnect = async () => {
    setStatus('connecting');
    setStepMessage('Establishing Serial Connection...');
    
    // Simulate connection delay
    await new Promise(r => setTimeout(r, 1500));
    
    setStatus('acquiring');
    setStepMessage('Acquiring Raw Signals...');
    
    // Simulate Raw Signal Acquisition (ECG and PCG arrays)
    // In a real app, this would come from the Web Serial API
    const rawECG = Array.from({length: 1000}, () => Math.random() * 2 - 1);
    const rawPCG = Array.from({length: 1000}, () => Math.random() * 2 - 1);
    
    // Simulate acquisition progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 150));
    }
    
    setStatus('processing');
    
    try {
      // Pass raw signals to the advanced DSP pipeline
      const extractedFeatures = await processRawSignals(rawECG, rawPCG, userAge, (prog, msg) => {
        setProgress(prog);
        setStepMessage(msg);
      });
      
      setStatus('success');
      setStepMessage('Features Extracted Successfully');
      
      // Wait a moment before passing data up to show success state
      setTimeout(() => {
        onDataAcquired(extractedFeatures);
      }, 1500);
      
    } catch (error) {
      console.error('Signal processing failed', error);
      setStatus('error');
      setStepMessage('Failed to process signals');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-indigo-600" />
              Hardware Integration
            </h2>
            <p className="text-slate-500 mt-1">Acquire real-time ECG and PCG signals via serial connection.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              {status === 'acquiring' || status === 'processing' ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              ) : null}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                status === 'disconnected' ? 'bg-slate-300' :
                status === 'error' ? 'bg-red-500' :
                status === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}></span>
            </span>
            <span className="text-sm font-medium text-slate-600 capitalize">
              {status === 'disconnected' ? 'Disconnected' : status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-rose-500" />
              AD8232 ECG Sensor
            </h3>
            <ul className="space-y-2 text-sm font-mono text-slate-600">
              <li className="flex justify-between"><span className="text-slate-400">OUT</span> <span className="text-indigo-600 font-bold">A0</span></li>
              <li className="flex justify-between"><span className="text-slate-400">SDN</span> <span className="text-indigo-600 font-bold">D10</span></li>
              <li className="flex justify-between"><span className="text-slate-400">LO+</span> <span className="text-indigo-600 font-bold">D11</span></li>
              <li className="flex justify-between"><span className="text-slate-400">LO-</span> <span className="text-indigo-600 font-bold">D12</span></li>
              <li className="flex justify-between"><span className="text-slate-400">VCC</span> <span className="text-rose-600 font-bold">3.3V</span></li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              MAX9814 PCG Sensor
            </h3>
            <ul className="space-y-2 text-sm font-mono text-slate-600">
              <li className="flex justify-between"><span className="text-slate-400">OUT</span> <span className="text-indigo-600 font-bold">A1</span></li>
              <li className="flex justify-between"><span className="text-slate-400">GAIN</span> <span className="text-slate-500">float (40dB)</span></li>
              <li className="flex justify-between"><span className="text-slate-400">VDD</span> <span className="text-rose-600 font-bold">3.3V</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
          {status === 'disconnected' && (
            <button
              onClick={handleConnect}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Connect to Arduino
            </button>
          )}

          {(status === 'connecting' || status === 'acquiring' || status === 'processing') && (
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-center gap-3 text-indigo-600 font-medium mb-4">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {status === 'connecting' ? 'Connecting...' : status === 'acquiring' ? 'Acquiring...' : 'DSP Pipeline Active'}
              </div>
              
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>{stepMessage}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-3 text-emerald-600 font-medium">
              <CheckCircle2 className="w-12 h-12" />
              <p>Data Acquired & Processed Successfully</p>
              <button
                onClick={() => { setStatus('disconnected'); setProgress(0); }}
                className="mt-4 px-4 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Acquire Again
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 text-red-600 font-medium">
              <AlertCircle className="w-12 h-12" />
              <p>Connection or Processing Failed</p>
              <button
                onClick={() => setStatus('disconnected')}
                className="mt-4 px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

   

 
            
           
            

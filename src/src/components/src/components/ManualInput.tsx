import React from 'react';
import { Features } from '../services/geminiService';

interface ManualInputProps {
  features: Features;
  onChange: (features: Features) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function ManualInput({ features, onChange, onSubmit, loading }: ManualInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...features,
      [name]: type === 'checkbox' ? checked : Number(value)
    });
  };

  const renderSlider = (name: keyof Features, label: string, min: number = -10, max: number = 1000, step: number = 1) => (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{features[name]}</span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={features[name] as number}
        onChange={handleChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );

  const renderToggle = (name: keyof Features, label: string) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={features[name] as boolean}
          onChange={handleChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Patient & ECG Features</h3>
          {renderSlider('age', 'Age (years)', 0, 120)}
          {renderSlider('heartRate', 'Heart Rate (bpm)', 30, 250)}
          {renderSlider('prInterval', 'PR Interval (ms)', -10, 1000)}
          {renderSlider('qrsDuration', 'QRS Duration (ms)', -10, 1000)}
          {renderSlider('qtcInterval', 'QTc Interval (ms)', -10, 1000)}
          {renderSlider('stDeviation', 'ST Deviation (mV)', -10, 1000, 0.1)}
          {renderSlider('pWaveAmplitude', 'P-Wave Amplitude (mV)', -10, 1000, 0.1)}
          {renderSlider('lvhIndex', 'LVH Index', -10, 1000, 0.1)}
          {renderSlider('arrhythmiaIndex', 'Arrhythmia Index', -10, 1000, 0.1)}
        </div>

        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">PCG Features</h3>
          {renderSlider('s1Amplitude', 'S1 Amplitude', -10, 1000, 0.1)}
          {renderSlider('s2Amplitude', 'S2 Amplitude', -10, 1000, 0.1)}
          {renderSlider('murmurGrade', 'Murmur Grade (0-6)', 0, 6, 1)}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {renderToggle('s3Presence', 'S3 Presence')}
            {renderToggle('s4Presence', 'S4 Presence')}
            {renderToggle('clickPresence', 'Click Presence')}
            {renderToggle('openingSnap', 'Opening Snap')}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>

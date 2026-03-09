import React, { useState, useEffect } from 'react';
import { UserProfile, ReportHistoryItem, getProfile, saveProfile, getHistory, clearHistory } from '../services/profileService';
import { User, Calendar, FileText, AlertTriangle, CheckCircle, Info, Trash2, Activity } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({ name: '', age: 45 });

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setProfile(p);
      setEditForm(p);
    } else {
      setIsEditing(true);
    }
    setHistory(getHistory());
  }, []);

  const handleSaveProfile = () => {
    saveProfile(editForm);
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your analysis history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const riskColors = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  const riskIcons = {
    low: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    medium: <Info className="w-4 h-4 text-yellow-500" />,
    high: <AlertTriangle className="w-4 h-4 text-red-500" />,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            Patient Profile
          </h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age (Years)</label>
              <input 
                type="number" 
                value={editForm.age}
                onChange={e => setEditForm({...editForm, age: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="45"
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button 
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{profile?.name || 'Unknown User'}</h3>
              <p className="text-slate-500">Age: {profile?.age || 'Not set'} years</p>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            Analysis History
          </h2>
          {history.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-800"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No History Found</h3>
            <p className="text-slate-500">Your past ECG and PCG analysis reports will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleString()}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.classification}</h3>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${riskColors[item.riskLevel]}`}>
                    {riskIcons[item.riskLevel]}
                    <span className="font-semibold capitalize">{item.riskLevel} Risk</span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-600 line-clamp-2 mb-4">
                  <strong>Reasoning:</strong> {item.reasoning}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {item.therapeutics.slice(0, 2).map((t, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                      {t}
                    </span>
                  ))}
                  {item.therapeutics.length > 2 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                      +{item.therapeutics.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

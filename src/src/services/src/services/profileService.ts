export interface UserProfile {
  name: string;
  age: number;
}

export interface ReportHistoryItem {
  id: string;
  date: string;
  classification: string;
  riskLevel: 'low' | 'medium' | 'high';
  features: any;
  therapeutics: string[];
  confirmatoryTests: string[];
  reasoning: string;
}

const PROFILE_KEY = 'cardiosense_profile';
const HISTORY_KEY = 'cardiosense_history';

export function getProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getHistory(): ReportHistoryItem[] {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveReportToHistory(report: Omit<ReportHistoryItem, 'id' | 'date'>): void {
  const history = getHistory();
  const newItem: ReportHistoryItem = {
    ...report,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  history.unshift(newItem); // Add to beginning
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

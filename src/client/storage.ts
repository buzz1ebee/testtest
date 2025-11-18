import type { AppState } from './appTypes';


const KEY = 'stoncx-piece:v1';

const DEFAULT_STATE: AppState = {
  balance: 100_000,
  portfolio: {},
  lastUpdated: Date.now(),
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as AppState;
    if (typeof parsed.balance !== 'number' || !parsed.portfolio) return DEFAULT_STATE;
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify({ ...state, lastUpdated: Date.now() }));
}

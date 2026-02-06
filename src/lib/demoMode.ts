export const DEMO_MODE = String((import.meta as any).env?.VITE_DEMO_MODE ?? 'false').toLowerCase() === 'true';

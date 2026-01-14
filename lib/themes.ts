export interface Theme {
  name: string;
  workBg: string;
  breakBg: string;
  cardBg: string;
}

export const themes: Record<string, Theme> = {
  classic: {
    name: 'Classic',
    workBg: 'from-rose-500 to-orange-400',
    breakBg: 'from-teal-500 to-cyan-400',
    cardBg: 'bg-white/10',
  },
  midnight: {
    name: 'Midnight',
    workBg: 'from-slate-900 to-slate-800',
    breakBg: 'from-indigo-900 to-slate-800',
    cardBg: 'bg-white/5',
  },
  forest: {
    name: 'Forest',
    workBg: 'from-emerald-700 to-green-600',
    breakBg: 'from-lime-600 to-emerald-500',
    cardBg: 'bg-black/10',
  },
  ocean: {
    name: 'Ocean',
    workBg: 'from-blue-600 to-indigo-500',
    breakBg: 'from-cyan-500 to-blue-400',
    cardBg: 'bg-white/10',
  },
};

export const themeKeys = Object.keys(themes) as Array<keyof typeof themes>;

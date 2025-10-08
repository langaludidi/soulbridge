// Background theme presets for memorial pages

export interface BackgroundTheme {
  id: string;
  name: string;
  category: "nature" | "sky" | "abstract" | "symbolic" | "solid";
  gradient: string;
  pattern?: string;
  overlay?: string;
}

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  // NATURE THEMES
  {
    id: "nature-roses",
    name: "Roses",
    category: "nature",
    gradient: "bg-gradient-to-br from-rose-100/60 via-pink-50/40 to-rose-100/60 dark:from-rose-950/80 dark:via-pink-950/60 dark:to-rose-950/80",
    pattern: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23db2777' fill-opacity='0.03'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0z'/%3E%3C/g%3E%3C/svg%3E",
  },
  {
    id: "nature-lilies",
    name: "Lilies",
    category: "nature",
    gradient: "bg-gradient-to-br from-purple-100/50 via-white/30 to-purple-100/50 dark:from-purple-950/70 dark:via-slate-900/50 dark:to-purple-950/70",
    pattern: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239333ea' fill-opacity='0.03'%3E%3Cpath d='M0 20c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20S0 31.046 0 20z'/%3E%3C/g%3E%3C/svg%3E",
  },
  {
    id: "nature-mountains",
    name: "Mountains",
    category: "nature",
    gradient: "bg-gradient-to-b from-slate-300/40 via-slate-100/30 to-emerald-100/40 dark:from-slate-800/80 dark:via-slate-900/70 dark:to-emerald-950/70",
  },
  {
    id: "nature-beach",
    name: "Beach",
    category: "nature",
    gradient: "bg-gradient-to-br from-cyan-100/50 via-blue-50/30 to-amber-100/40 dark:from-cyan-950/70 dark:via-blue-950/50 dark:to-amber-950/60",
  },
  {
    id: "nature-sunset",
    name: "Sunset",
    category: "nature",
    gradient: "bg-gradient-to-br from-orange-200/60 via-pink-100/40 to-purple-200/60 dark:from-orange-950/80 dark:via-pink-950/60 dark:to-purple-950/80",
  },

  // SKY THEMES
  {
    id: "sky-clouds",
    name: "Clouds",
    category: "sky",
    gradient: "bg-gradient-to-b from-sky-100/40 via-white/20 to-blue-50/30 dark:from-slate-800/70 dark:via-slate-900/50 dark:to-blue-950/60",
    pattern: "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2360a5fa' fill-opacity='0.02'%3E%3Ccircle cx='20' cy='20' r='15'/%3E%3Ccircle cx='60' cy='40' r='20'/%3E%3C/g%3E%3C/svg%3E",
  },
  {
    id: "sky-stars",
    name: "Starry Night",
    category: "sky",
    gradient: "bg-gradient-to-b from-indigo-950/90 via-purple-900/80 to-blue-900/85 dark:from-indigo-950/95 dark:via-purple-950/90 dark:to-blue-950/90",
    pattern: "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='70' cy='20' r='0.5'/%3E%3Ccircle cx='40' cy='60' r='1'/%3E%3Ccircle cx='90' cy='80' r='0.5'/%3E%3C/g%3E%3C/svg%3E",
  },
  {
    id: "sky-moon",
    name: "Moonlight",
    category: "sky",
    gradient: "bg-gradient-to-b from-slate-700/40 via-slate-600/30 to-indigo-900/50 dark:from-slate-900/80 dark:via-slate-800/70 dark:to-indigo-950/80",
  },
  {
    id: "sky-aurora",
    name: "Aurora",
    category: "sky",
    gradient: "bg-gradient-to-br from-teal-200/50 via-purple-200/40 to-pink-200/50 dark:from-teal-950/70 dark:via-purple-950/60 dark:to-pink-950/70",
  },

  // ABSTRACT THEMES
  {
    id: "abstract-marble",
    name: "Marble",
    category: "abstract",
    gradient: "bg-gradient-to-br from-gray-100/60 via-slate-50/40 to-gray-100/60 dark:from-gray-900/80 dark:via-slate-900/70 dark:to-gray-900/80",
    pattern: "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q50 50 100 0 T200 0' stroke='%239ca3af' stroke-width='0.5' fill='none' opacity='0.1'/%3E%3C/svg%3E",
  },
  {
    id: "abstract-bokeh",
    name: "Bokeh",
    category: "abstract",
    gradient: "bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-rose-50/40 dark:from-amber-950/60 dark:via-orange-950/50 dark:to-rose-950/60",
    pattern: "data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='90' cy='70' r='25'/%3E%3Ccircle cx='60' cy='90' r='15'/%3E%3C/g%3E%3C/svg%3E",
  },
  {
    id: "abstract-gradient",
    name: "Soft Gradient",
    category: "abstract",
    gradient: "bg-gradient-to-br from-violet-100/50 via-fuchsia-50/30 to-pink-100/50 dark:from-violet-950/70 dark:via-fuchsia-950/50 dark:to-pink-950/70",
  },

  // SYMBOLIC THEMES
  {
    id: "symbolic-candles",
    name: "Candles",
    category: "symbolic",
    gradient: "bg-gradient-to-b from-amber-100/50 via-orange-50/30 to-yellow-100/40 dark:from-amber-950/70 dark:via-orange-950/50 dark:to-yellow-950/60",
  },
  {
    id: "symbolic-doves",
    name: "Doves",
    category: "symbolic",
    gradient: "bg-gradient-to-br from-sky-100/40 via-white/20 to-slate-100/40 dark:from-sky-950/60 dark:via-slate-900/40 dark:to-slate-950/60",
  },
  {
    id: "symbolic-hands",
    name: "Holding Hands",
    category: "symbolic",
    gradient: "bg-gradient-to-br from-rose-100/40 via-pink-50/20 to-red-100/40 dark:from-rose-950/60 dark:via-pink-950/40 dark:to-red-950/60",
  },

  // SOLID THEMES
  {
    id: "solid-white",
    name: "Pure White",
    category: "solid",
    gradient: "bg-white dark:bg-gray-950",
  },
  {
    id: "solid-grey",
    name: "Soft Grey",
    category: "solid",
    gradient: "bg-gray-50 dark:bg-gray-900",
  },
  {
    id: "solid-beige",
    name: "Warm Beige",
    category: "solid",
    gradient: "bg-amber-50 dark:bg-stone-900",
  },
  {
    id: "solid-navy",
    name: "Deep Navy",
    category: "solid",
    gradient: "bg-slate-100 dark:bg-slate-950",
  },
];

export function getThemeById(id: string): BackgroundTheme | undefined {
  return BACKGROUND_THEMES.find((theme) => theme.id === id);
}

export function getThemesByCategory(category: BackgroundTheme["category"]): BackgroundTheme[] {
  return BACKGROUND_THEMES.filter((theme) => theme.category === category);
}

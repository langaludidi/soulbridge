/**
 * Memorial Page Themes
 * 60+ beautiful background themes organized by category
 */

export interface Theme {
  id: string;
  name: string;
  category: 'nature' | 'floral' | 'sky' | 'abstract' | 'solid' | 'gradient';
  preview: string;
  gradient?: string;
  color?: string;
}

export const themeCategories = [
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'floral', label: 'Floral', icon: '🌸' },
  { id: 'sky', label: 'Sky', icon: '☁️' },
  { id: 'abstract', label: 'Abstract', icon: '✨' },
  { id: 'gradient', label: 'Gradient', icon: '🎨' },
  { id: 'solid', label: 'Solid', icon: '⬛' },
] as const;

export const themes: Theme[] = [
  // Nature Themes (12)
  {
    id: 'nature-forest',
    name: 'Forest Mist',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
  {
    id: 'nature-mountains',
    name: 'Mountain Peak',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: 'nature-ocean',
    name: 'Calm Ocean',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
  },
  {
    id: 'nature-lake',
    name: 'Peaceful Lake',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
  },
  {
    id: 'nature-valley',
    name: 'Green Valley',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  },
  {
    id: 'nature-waterfall',
    name: 'Waterfall',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80',
  },
  {
    id: 'nature-aurora',
    name: 'Aurora Borealis',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80',
  },
  {
    id: 'nature-desert',
    name: 'Desert Dunes',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
  },
  {
    id: 'nature-autumn',
    name: 'Autumn Forest',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: 'nature-winter',
    name: 'Winter Snow',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  },
  {
    id: 'nature-meadow',
    name: 'Flower Meadow',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
  },
  {
    id: 'nature-path',
    name: 'Garden Path',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  },

  // Floral Themes (12)
  {
    id: 'floral-roses',
    name: 'White Roses',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    id: 'floral-cherry',
    name: 'Cherry Blossoms',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
  },
  {
    id: 'floral-lavender',
    name: 'Lavender Fields',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&q=80',
  },
  {
    id: 'floral-tulips',
    name: 'Tulip Garden',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
  },
  {
    id: 'floral-lilies',
    name: 'Water Lilies',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: 'floral-orchids',
    name: 'Orchids',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
  },
  {
    id: 'floral-sunflowers',
    name: 'Sunflowers',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=80',
  },
  {
    id: 'floral-peonies',
    name: 'Peonies',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    id: 'floral-hydrangeas',
    name: 'Hydrangeas',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
  },
  {
    id: 'floral-magnolia',
    name: 'Magnolia',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
  },
  {
    id: 'floral-dahlia',
    name: 'Dahlias',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
  },
  {
    id: 'floral-jasmine',
    name: 'Jasmine',
    category: 'floral',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },

  // Sky Themes (12)
  {
    id: 'sky-sunset',
    name: 'Golden Sunset',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: 'sky-sunrise',
    name: 'Peaceful Sunrise',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800&q=80',
  },
  {
    id: 'sky-clouds',
    name: 'Soft Clouds',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80',
  },
  {
    id: 'sky-stars',
    name: 'Starry Night',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
  },
  {
    id: 'sky-moon',
    name: 'Moonlight',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80',
  },
  {
    id: 'sky-dusk',
    name: 'Purple Dusk',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: 'sky-dawn',
    name: 'Pink Dawn',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  },
  {
    id: 'sky-rainbow',
    name: 'Rainbow',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    id: 'sky-storm',
    name: 'Storm Clouds',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1505672678657-cc7037095e60?w=800&q=80',
  },
  {
    id: 'sky-milkyway',
    name: 'Milky Way',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
  },
  {
    id: 'sky-horizon',
    name: 'Clear Horizon',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: 'sky-twilight',
    name: 'Twilight',
    category: 'sky',
    preview: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  },

  // Abstract Themes (12)
  {
    id: 'abstract-watercolor',
    name: 'Watercolor',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
  },
  {
    id: 'abstract-marble',
    name: 'Marble',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80',
  },
  {
    id: 'abstract-waves',
    name: 'Gentle Waves',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&q=80',
  },
  {
    id: 'abstract-smoke',
    name: 'Soft Smoke',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80',
  },
  {
    id: 'abstract-texture',
    name: 'Soft Texture',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
  },
  {
    id: 'abstract-light',
    name: 'Light Flow',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&q=80',
  },
  {
    id: 'abstract-glass',
    name: 'Frosted Glass',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80',
  },
  {
    id: 'abstract-fluid',
    name: 'Fluid Art',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
  },
  {
    id: 'abstract-ink',
    name: 'Ink Spread',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80',
  },
  {
    id: 'abstract-pastel',
    name: 'Pastel Dream',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
  },
  {
    id: 'abstract-modern',
    name: 'Modern Art',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&q=80',
  },
  {
    id: 'abstract-minimal',
    name: 'Minimal',
    category: 'abstract',
    preview: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80',
  },

  // Gradient Themes (12)
  {
    id: 'gradient-ocean',
    name: 'Ocean Blue',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset Glow',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'gradient-forest',
    name: 'Forest Green',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 'gradient-lavender',
    name: 'Lavender Dream',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    id: 'gradient-peach',
    name: 'Peach Blossom',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    id: 'gradient-sky',
    name: 'Sky Blue',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  },
  {
    id: 'gradient-rose',
    name: 'Rose Gold',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  {
    id: 'gradient-mint',
    name: 'Mint Fresh',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'gradient-coral',
    name: 'Coral Reef',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
  {
    id: 'gradient-twilight',
    name: 'Twilight',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  },
  {
    id: 'gradient-calm',
    name: 'Calm Waters',
    category: 'gradient',
    preview: '',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  },

  // Solid Colors (12)
  {
    id: 'solid-white',
    name: 'Pure White',
    category: 'solid',
    preview: '',
    color: '#FFFFFF',
  },
  {
    id: 'solid-cream',
    name: 'Soft Cream',
    category: 'solid',
    preview: '',
    color: '#F9F9F7',
  },
  {
    id: 'solid-sage',
    name: 'Sage Green',
    category: 'solid',
    preview: '',
    color: '#96B496',
  },
  {
    id: 'solid-navy',
    name: 'Navy Blue',
    category: 'solid',
    preview: '',
    color: '#2E3C5A',
  },
  {
    id: 'solid-gray',
    name: 'Soft Gray',
    category: 'solid',
    preview: '',
    color: '#738180',
  },
  {
    id: 'solid-beige',
    name: 'Warm Beige',
    category: 'solid',
    preview: '',
    color: '#E8DCC4',
  },
  {
    id: 'solid-lavender',
    name: 'Light Lavender',
    category: 'solid',
    preview: '',
    color: '#E6E6FA',
  },
  {
    id: 'solid-blush',
    name: 'Blush Pink',
    category: 'solid',
    preview: '',
    color: '#FFE4E1',
  },
  {
    id: 'solid-sky',
    name: 'Sky Blue',
    category: 'solid',
    preview: '',
    color: '#87CEEB',
  },
  {
    id: 'solid-mint',
    name: 'Mint Green',
    category: 'solid',
    preview: '',
    color: '#98FF98',
  },
  {
    id: 'solid-pearl',
    name: 'Pearl White',
    category: 'solid',
    preview: '',
    color: '#F0EAD6',
  },
  {
    id: 'solid-charcoal',
    name: 'Charcoal',
    category: 'solid',
    preview: '',
    color: '#36454F',
  },
];

export const getThemesByCategory = (category: string) => {
  return themes.filter(theme => theme.category === category);
};

export const getThemeById = (id: string) => {
  return themes.find(theme => theme.id === id);
};

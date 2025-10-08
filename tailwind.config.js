/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        card: 'rgb(var(--card))',
        'card-foreground': 'rgb(var(--card-foreground))',
        popover: 'rgb(var(--popover))',
        'popover-foreground': 'rgb(var(--popover-foreground))',
        primary: 'rgb(var(--primary))',
        'primary-foreground': 'rgb(var(--primary-foreground))',
        secondary: 'rgb(var(--secondary))',
        'secondary-foreground': 'rgb(var(--secondary-foreground))',
        accent: 'rgb(var(--accent))',
        'accent-foreground': 'rgb(var(--accent-foreground))',
        muted: 'rgb(var(--muted))',
        'muted-foreground': 'rgb(var(--muted-foreground))',
        border: 'rgb(var(--border))',
        ring: 'rgb(var(--ring))',
        destructive: 'rgb(var(--destructive))',
        'destructive-foreground': 'rgb(var(--destructive-foreground))',
        // SoulBridge Brand Colors
        'delft-blue': {
          DEFAULT: '#2d3958',
          50: '#eef1ec',
          100: '#cdd4e5',
          200: '#9ba9cc',
          300: '#6a7eb2',
          400: '#475a89',
          500: '#2d3958',
          600: '#242e46',
          700: '#1b2235',
          800: '#121723',
          900: '#090b12',
        },
        'ash-gray': {
          DEFAULT: '#a8b9a0',
          50: '#eef1ec',
          100: '#dde3d9',
          200: '#cbd5c7',
          300: '#bac8b4',
          400: '#a8b9a0',
          500: '#849c79',
          600: '#627858',
          700: '#42503b',
          800: '#21281d',
          900: '#10140e',
        },
        'paynes-gray': {
          DEFAULT: '#647278',
          50: '#dfe3e5',
          100: '#c0c7ca',
          200: '#a0abb0',
          300: '#808f95',
          400: '#647278',
          500: '#505b60',
          600: '#3c4448',
          700: '#282d30',
          800: '#141718',
          900: '#0a0b0c',
        },
      },

      borderColor: {
        DEFAULT: 'rgb(var(--border))',
        glass: 'rgba(255, 255, 255, 0.4)',
        'glass-dark': 'rgba(255, 255, 255, 0.2)',
        'glass-subtle': 'rgba(255, 255, 255, 0.1)',
      },

      borderRadius: {
        token: 'var(--radius)',
        modal: 'var(--radius-modal)',
        pill: 'var(--radius-pill)',
        glass: '24px',
        'glass-lg': '32px',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'glass-sm': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-md': '0 12px 40px rgba(0, 0, 0, 0.14)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'glass-xl': '0 24px 64px rgba(0, 0, 0, 0.18)',
        'glass-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'glass-inset-dark': 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      },

      ringColor: {
        DEFAULT: 'rgb(var(--ring))',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
      },

      fontSize: {
        'h1': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'h3': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },

      spacing: {
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
      },

      backdropBlur: {
        glass: 'var(--blur-glass)',
        'glass-sm': '20px',
        'glass-md': '30px',
        'glass-lg': '40px',
        'glass-xl': '50px',
      },

      backgroundColor: {
        'glass-light': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(28, 28, 30, 0.7)',
        'glass-ultralight': 'rgba(255, 255, 255, 0.5)',
        'glass-ultradark': 'rgba(28, 28, 30, 0.5)',
      },
    },
  },

  plugins: [],
};

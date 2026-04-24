/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e1a',
        surface: '#0f1428',
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        danger: '#ef4444',
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#475569',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(59,130,246,0.4)',
        glowStrong: '0 0 34px rgba(59,130,246,0.45), 0 0 80px rgba(139,92,246,0.22)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(1200px 600px at 50% 30%, rgba(59,130,246,0.22), rgba(139,92,246,0.10) 35%, rgba(10,14,26,0) 70%)',
        'hero-linear': 'linear-gradient(180deg, #0a0e1a 0%, #060910 100%)',
      },
      borderColor: {
        glass: 'rgba(99,179,255,0.12)',
        'glass-strong': 'rgba(99,179,255,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


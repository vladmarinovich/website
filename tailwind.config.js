/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#05070B',
        surface: '#0C1017',
        surfaceSoft: '#111722',
        textPrimary: '#F5F7FA',
        textSecondary: '#97A3B6',
        accent: {
          cyan: '#63D7FF',
          purple: '#8C7BFF',
          orange: '#FF9B5A',
          white: '#F8FBFF',
        },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

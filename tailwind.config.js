/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pf: {
          cream:          '#EDE9E1',
          paper:          '#F5F2EC',
          white:          '#FFFFFF',
          ink:            '#1A1A12',
          muted:          '#6B6A5E',
          subtle:         '#9A9A8E',
          border:         '#D6D2C8',
          divider:        '#E8E4DC',
          olive:          '#1C2B0C',
          'olive-hover':  '#253810',
          'olive-light':  '#3A5219',
          sage:           '#6B7B4A',
          'sage-light':   '#A8B882',
          mint:           '#D8E8C0',
          eth_green:      '#078930',
          eth_yellow:     '#FCDD09',
          eth_red:        '#DA121A',
          chapa:          '#1DBF73',
          mpesa:          '#60BB44',
          telebirr:       '#E3001B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        pf:     '0.5rem',
        'pf-sm':'0.375rem',
        'pf-lg':'0.75rem',
        'pf-xl':'1rem',
      },
      boxShadow: {
        'pf-card':      '0 1px 3px 0 rgba(26,26,18,0.08), 0 1px 2px -1px rgba(26,26,18,0.06)',
        'pf-card-hover':'0 4px 12px 0 rgba(26,26,18,0.12), 0 2px 4px -1px rgba(26,26,18,0.08)',
        'pf-dropdown':  '0 8px 24px 0 rgba(26,26,18,0.12)',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

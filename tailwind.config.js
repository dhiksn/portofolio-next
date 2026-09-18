/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        bg2: '#0a0a0a',
        bg3: '#111111',
        text: '#f0f0f0',
        muted: '#888888',
        dim: '#6b7280',
      },
      fontFamily: {
        sans: ['ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(100%)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        skFwd: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        spinRing: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        scrollPulse: {
          '0%, 100%': { transform: 'scaleY(1)', opacity: 0.6 },
          '50%': { transform: 'scaleY(1.3)', opacity: 1 },
        },
        eqBounce: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
        slideUp: 'slideUp 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
        fadeIn: 'fadeIn 1s cubic-bezier(0.4,0,0.2,1) forwards',
        skFwd: 'skFwd 30s linear infinite',
        spinRing: 'spinRing 20s linear infinite',
        spinRingRev: 'spinRing 30s linear infinite reverse',
        scrollPulse: 'scrollPulse 2s ease infinite',
        eqBounce: 'eqBounce 0.9s ease-in-out infinite',
        shimmer: 'shimmer 1.4s ease infinite',
      },
    },
  },
  plugins: [],
}

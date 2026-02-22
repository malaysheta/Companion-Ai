/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-black': '#000000',
                'brand-green': '#00FF9D',
                'brand-dark-green': '#01311F',
                'brand-purple': '#a17ff7',
                'lambda-black': '#0b0b0b',
                'lambda-beige': '#e7e6d9',
                'lambda-purple': '#6236f4',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                'lambda-sans': ['"Suisse Intl"', '"Inter"', 'sans-serif'],
                'lambda-mono': ['"Suisse Intl Mono"', '"JetBrains Mono"', 'monospace'],
                'lambda-pixel': ['"Pixelify Sans"', 'monospace'],
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'fade-in': 'fadeIn 0.2s ease-out forwards',
            },
        },
    },
    plugins: [],
}

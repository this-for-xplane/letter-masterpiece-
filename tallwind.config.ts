import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',  // src 없이도 추가 (안전빵)
    './pages/**/*.{js,ts,jsx,tsx}', // Pages Router도 쓰면
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],  // 여기서 폰트 우선순위 조정 가능
      },
    },
  },
  plugins: [],
}

export default config
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      margin: {
        tomato: '120px',
      },
      borderRadius: {
        'sexy-name': '11.11px',
      },
    },
  },
  plugins: [
    //누군가가 미리 만들어놓은 components나 utility를 쓰고 싶을 때 설치해서 사용
    require('@tailwindcss/forms'),
  ],
};
export default config;

import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#578E7E',
          light: '#6BA092',
          dark: '#456F62',
        },
        background: {
          light: '#FFFAEC',
          DEFAULT: '#F5ECD5',
          dark: '#3D3D3D',
        },
        text: {
          DEFAULT: '#3D3D3D',
          light: '#666666',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;

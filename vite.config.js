import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite-ის კონფიგურაცია Tailwind v4-ის მხარდაჭერით
// ამ ფაილის შენახვის შემდეგ ტერმინალში გაუშვით: npm install @tailwindcss/vite
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
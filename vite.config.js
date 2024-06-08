import { defineConfig } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

// vite.config.js
export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist'
  },
  server: {
    open: true,
    port: 3000,
  },
  plugins: [],
})

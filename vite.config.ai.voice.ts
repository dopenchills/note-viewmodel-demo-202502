import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/apps/ai.voice',
  publicDir: 'public',
  build: {
    outDir: '../../../dist/ai.voice',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },
})

import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, '../..'),
    },
  },
  build: {
    outDir: '../../../dist/ai.voice',
    emptyOutDir: true,
  },
})

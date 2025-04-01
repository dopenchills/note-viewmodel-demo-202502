import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      src: resolve(__dirname, '../..'),
    },
  },
  build: {
    outDir: '../../../dist/web.vue',
    emptyOutDir: true,
  },
})

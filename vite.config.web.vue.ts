import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/apps/web.vue',
  publicDir: 'public',
  plugins: [vue()],
  build: {
    outDir: '../../../dist/web.vue',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },
})

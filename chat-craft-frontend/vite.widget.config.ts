import { defineConfig } from 'vite'
import path from 'path'

// Separate config for building the widget as a standalone script
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget/widgetEntry.ts'),
      name: 'ChatbotWidget',
      fileName: 'widget',
      formats: ['iife']
    },
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'widget.js',
        extend: true,
      }
    }
  },
  define: {
    global: 'globalThis',
  },
})
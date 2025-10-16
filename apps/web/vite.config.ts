import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
          '@': '/src',
        },
    },
    build: {
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
              return;
            }
            warn(warning);
          },
        },
    },
})

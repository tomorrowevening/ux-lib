import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLibBuild = mode === 'lib'
  
  if (isLibBuild) {
    // Library build configuration
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
        })
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'UXLib',
          formats: ['es', 'umd'],
          fileName: (format) => `ux-lib.${format}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        }
      }
    }
  } else {
    // Development/preview app configuration (normal SPA build)
    return {
      plugins: [react()],
      build: {
        outDir: 'dist'
      }
    }
  }
})

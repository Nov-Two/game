import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'
import px2rem from 'postcss-pxtorem'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base:
      mode === 'production' || mode === 'goku'
        ? `${env.VITE_APP_CDN_URL}${env.VITE_APP_PROJECT_NAME}/`
        : env.VITE_BASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      // vueDevTools(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: mode === 'development',
        prodEnabled: false,
        // Support TypeScript
        supportTs: true,
        // Watch file changes
        watchFiles: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: mode === 'goku' ? `@use "@/assets/css/goku-font.scss";` : `@use "@/assets/css/font.scss";`
        }
      },
      postcss: {
        plugins: [
          px2rem({
            rootValue: 16,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 2,
            exclude: /node_modules/i
          })
        ]
      }
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : []
    },
    build: {
      target: 'es2018', // esbuild target
      outDir: env.VITE_OUTPUT_DIR,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo: any) => {
            if (assetInfo.name.endsWith('.css')) {
              return '[ext]/[name]-[hash].[ext]'
            }
            if (/\.(jpg|png|gif|jpeg|svg)$/.test(assetInfo.name)) {
              return 'images/[hash].[ext]'
            }
            return '[name]-[hash].[ext]'
          }
        }
      }
    }
  }
})

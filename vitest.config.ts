import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfigFn from './vite.config'

export default defineConfig((env) => {
  const viteConfig = typeof viteConfigFn === 'function' ? viteConfigFn(env) : viteConfigFn
  return mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url))
      }
    })
  )
})

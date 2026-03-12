/* eslint-disable @typescript-eslint/no-empty-object-type */
/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_PROJECT_NAME: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_CDN_URL: string
  readonly VITE_APP_GA_ID: string
  readonly VITE_BASE_URL: string
  readonly VITE_APP_GA_LOG_NAME: string
  // readonly VITE_APP_GAME: string
  readonly VITE_APP_PAGE_NAME: string
  // readonly VITE_APP_TRANSIFY_ID: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Window global type declarations
declare global {
  interface Window {
    // Game-related properties
    FreeFire?: {
      postMessage: (msg: string) => void
    }
    webkit?: {
      messageHandlers?: {
        FreeFire?: {
          postMessage: (msg: string) => void
        }
      }
    }

    // Promise management
    promises: Record<
      string,
      {
        resolve: (value: any) => void
        reject: (reason: any) => void
      }
    >
    nativePromiseThen: (promiseId: string, data: any, error: any) => void

    // Analytics related
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export {}

import { ref, computed, onUnmounted } from 'vue'

// Type definitions
interface BrowserInfo {
  trident: boolean
  presto: boolean
  webKit: boolean
  gecko: boolean
  mobile: boolean
  ios: boolean
  android: boolean
  iPhone: boolean
  iPad: boolean
  webApp: boolean
}

interface GameState {
  isInGame: boolean
  isLoading: boolean
  error: string | null
}

// Initialize global variables
if (typeof window !== 'undefined') {
  window.promises = window.promises || {}

  window.nativePromiseThen = (promiseId: string, data: any, error: any) => {
    if (window.promises[promiseId]) {
      if (error) {
        window.promises[promiseId].reject(data)
      } else {
        window.promises[promiseId].resolve(data)
      }
      delete window.promises[promiseId]
    }
  }
}

/**
 * Vue3 Game-related Composable Function
 */
export function useGame() {
  // Reactive state
  const gameState = ref<GameState>({
    isInGame: false,
    isLoading: false,
    error: null
  })

  // Computed properties
  const isInGame = computed(() => gameState.value.isInGame)
  const isLoading = computed(() => gameState.value.isLoading)
  const error = computed(() => gameState.value.error)

  // Utility functions
  const generateUUID = (): string => {
    let d = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  }

  const getBrowserInfo = (): BrowserInfo => {
    const u = navigator.userAgent
    return {
      trident: u.indexOf('Trident') > -1,
      presto: u.indexOf('Presto') > -1,
      webKit: u.indexOf('AppleWebKit') > -1,
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1,
      webApp: u.indexOf('Safari') == -1
    }
  }

  const checkInGame = (): boolean => {
    const inGame = !!(window?.FreeFire || window?.webkit?.messageHandlers?.FreeFire)
    gameState.value.isInGame = inGame
    return inGame
  }

  const postMessage = (msg: string): void => {
    try {
      const browser = {
        versions: getBrowserInfo(),
        language: window.navigator.language.toLowerCase()
      }

      if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
        window.webkit?.messageHandlers?.FreeFire?.postMessage(msg)
      } else if (browser.versions.android) {
        window.FreeFire?.postMessage(msg)
      }
    } catch (err) {
      gameState.value.error = `Failed to post message: ${err}`
    }
  }

  const gamePromise = async (key: string, value?: any): Promise<any> => {
    if (!checkInGame()) {
      throw new Error('Must run in game environment')
    }

    gameState.value.isLoading = true
    gameState.value.error = null

    try {
      const promise = new Promise((resolve, reject) => {
        const promiseId = generateUUID()
        window.promises[promiseId] = { resolve, reject }

        const msg: any = {
          PromiseId: promiseId
        }

        if (Object.prototype.toString.call(value) === '[object Object]') {
          const keys = Object.keys(value)
          keys.forEach((item) => {
            if (item === 'value') {
              msg[key] = value?.value
            } else {
              msg[item] = value[item]
            }
          })
        } else {
          msg[key] = value || ''
        }

        postMessage(JSON.stringify(msg))
      })

      const result = await promise
      return result
    } catch (err) {
      gameState.value.error = `Game promise failed: ${err}`
      throw err
    } finally {
      gameState.value.isLoading = false
    }
  }

  const deepLink = (url: string, fallbackCallback?: () => void): void => {
    if (checkInGame()) {
      postMessage(
        JSON.stringify({
          DeepLinkUrl: url
        })
      )
    } else {
      window.location.href = url
    }

    if (fallbackCallback) {
      const timer = setTimeout(() => {
        fallbackCallback()
        clearTimeout(timer)
      }, 3000)

      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearTimeout(timer)
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange, { once: true })
    }
  }

  const checkScreenShotOpen = async (): Promise<any> => {
    if (!checkInGame()) {
      throw new Error('Must run in game environment')
    }
    return gamePromise('CanCaptureScreenshot')
  }

  const runScreenShot = async (): Promise<any> => {
    if (!checkInGame()) {
      throw new Error('Must run in game environment')
    }
    return gamePromise('CaptureAndShareScreenshot')
  }

  const downloadImage = async (options: {
    value: string
    title: string
    desc: string
    success?: () => void
    error?: () => void
  }): Promise<void> => {
    const { value, title, desc, success, error } = options

    if (!checkInGame()) {
      // Browser environment download
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.setAttribute('crossOrigin', 'anonymous')

        image.onload = function () {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            const context = canvas.getContext('2d') as CanvasRenderingContext2D
            context.drawImage(image, 0, 0, image.width, image.height)
            const url = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            const event = new MouseEvent('click')
            a.download = title
            a.href = url
            a.dispatchEvent(event)
            success?.()
            resolve()
          } catch (err) {
            error?.()
            reject(err)
          }
        }

        image.onerror = function () {
          error?.()
          reject(new Error('Failed to load image'))
        }

        image.src = value
      })
    } else {
      // Game environment download
      return gamePromise('DownloadImageToAlbum', { value, title, desc })
    }
  }
  const getGameVolume = async (): Promise<any> => {
    if (!checkInGame()) {
      return Promise.resolve(0.5)
    }
    return gamePromise('Volume', 'music')
  }
  // Initial check
  checkInGame()

  // Cleanup function
  onUnmounted(() => {
    // Clean up unfinished promises
    Object.keys(window.promises).forEach((promiseId) => {
      delete window.promises[promiseId]
    })
  })

  return {
    // State
    isInGame,
    isLoading,
    error,

    // Methods
    checkInGame,
    gamePromise,
    deepLink,
    checkScreenShotOpen,
    runScreenShot,
    downloadImage,
    getBrowserInfo,
    getGameVolume
  }
}

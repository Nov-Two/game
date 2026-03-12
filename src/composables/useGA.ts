import { ref, computed } from 'vue'

// Type definitions
interface GAConsentOptions {
  ad_storage?: number
  ad_user_data?: number
  ad_personalization?: number
  analytics_storage?: number
}

interface GAEventReport {
  event_label: string | boolean
  ts: number
  [key: string]: any
}

interface GAConfig {
  dimension1?: string
  page_title?: string
  page_path?: string
  user_id?: number
}

interface GAState {
  isInitialized: boolean
  isConsentSet: boolean
  currentUserId: number | null
  currentRegion: string | null
  error: string | null
}

/**
 * Vue3 Google Analytics Composable Function
 */
export function useGA() {
  // Reactive state
  const gaState = ref<GAState>({
    isInitialized: false,
    isConsentSet: false,
    currentUserId: null,
    currentRegion: null,
    error: null
  })

  // Computed properties
  const isInitialized = computed(() => gaState.value.isInitialized)
  const isConsentSet = computed(() => gaState.value.isConsentSet)
  const currentUserId = computed(() => gaState.value.currentUserId)
  const currentRegion = computed(() => gaState.value.currentRegion)
  const error = computed(() => gaState.value.error)

  // Check if gtag is available
  const isGtagAvailable = (): boolean => {
    return typeof window !== 'undefined' && typeof window.gtag === 'function'
  }

  // Initialize GA
  const initGA = (region: string, uid: number, dataLogName = ''): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      if (!dataLogName) {
        dataLogName = import.meta.env.VITE_APP_GA_LOG_NAME || 'Default Page'
      }

      const config: GAConfig = {
        dimension1: region,
        page_title: dataLogName,
        page_path: '/index.html'
      }

      const gtag = window.gtag as any
      gtag('config', import.meta.env.VITE_APP_GA_ID, config)

      if (uid > 0) {
        gtag('set', { user_id: uid })
        gaState.value.currentUserId = uid
      }

      gaState.value.isInitialized = true
      gaState.value.currentRegion = region
      gaState.value.error = null
    } catch (err) {
      gaState.value.error = `GA initialization failed: ${err}`
      console.error('GA initialization error:', err)
    }
  }

  // Update consent status
  const updateConsentGA = (euPolicyChoice: GAConsentOptions): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      const consentOptions = {
        ad_storage: euPolicyChoice?.ad_storage === 1 ? 'granted' : 'denied',
        ad_user_data: euPolicyChoice?.ad_user_data === 1 ? 'granted' : 'denied',
        ad_personalization: euPolicyChoice?.ad_personalization === 1 ? 'granted' : 'denied',
        analytics_storage: euPolicyChoice?.analytics_storage === 1 ? 'granted' : 'denied'
      }

      const gtag = window.gtag as any
      gtag('consent', 'update', consentOptions)
      gaState.value.isConsentSet = true
      gaState.value.error = null
    } catch (err) {
      gaState.value.error = `Consent update failed: ${err}`
      console.error('GA consent update error:', err)
    }
  }

  // Set default consent status
  const defaultConsentGA = (): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      const gtag = window.gtag as any
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
      })
      gaState.value.isConsentSet = true
      gaState.value.error = null
    } catch (err) {
      gaState.value.error = `Default consent setup failed: ${err}`
      console.error('GA default consent error:', err)
    }
  }

  // Add GA event
  const addGA = (event: string, status: string | boolean, additionalData?: Record<string, any>): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      const report: GAEventReport = {
        event_label: status,
        ts: Math.floor(new Date().getTime() / 1000),
        ...additionalData
      }

      const gtag = window.gtag as any
      gtag('event', event, report)
      gaState.value.error = null
    } catch (err) {
      gaState.value.error = `GA event tracking failed: ${err}`
      console.error('GA event error:', err)
    }
  }

  // Error tracking
  const errorGA = (err: any, fatal = false): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      const gtag = window.gtag as any
      gtag('event', 'exception', {
        description: err,
        fatal: fatal
      })
      gaState.value.error = null
    } catch (gaErr) {
      gaState.value.error = `GA error tracking failed: ${gaErr}`
      console.error('GA error tracking error:', gaErr)
    }
  }

  // Page view tracking
  const trackPageView = (pagePath: string, pageTitle?: string): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      const gtag = window.gtag as any
      gtag('config', import.meta.env.VITE_APP_GA_ID, {
        page_path: pagePath,
        page_title: pageTitle || document.title
      })
      gaState.value.error = null
    } catch (err) {
      gaState.value.error = `Page view tracking failed: ${err}`
      console.error('GA page view error:', err)
    }
  }

  // Custom event tracking
  const trackCustomEvent = (eventName: string, parameters?: Record<string, any>): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      const gtag = window.gtag as any
      gtag('event', eventName, parameters)
      gaState.value.error = null
    } catch (err) {
      gaState.value.error = `Custom event tracking failed: ${err}`
      console.error('GA custom event error:', err)
    }
  }

  // Set user properties
  const setUserProperties = (properties: Record<string, any>): void => {
    try {
      if (!isGtagAvailable()) {
        throw new Error('Google Analytics gtag is not available')
      }

      const gtag = window.gtag as any
      gtag('set', properties)
      gaState.value.error = null
    } catch (err) {
      gaState.value.error = `User properties setting failed: ${err}`
      console.error('GA user properties error:', err)
    }
  }

  // Reset GA state
  const resetGA = (): void => {
    gaState.value = {
      isInitialized: false,
      isConsentSet: false,
      currentUserId: null,
      currentRegion: null,
      error: null
    }
  }

  // Check if GA is working properly
  const checkGAStatus = (): boolean => {
    return isGtagAvailable() && gaState.value.isInitialized && !gaState.value.error
  }

  // Page duration tracking
  const pageDuration = ref(0) // page duration in seconds
  const pageStartTime = ref(0) // page start time in seconds

  // Start tracking page duration (call this when page/component mounts)
  const startPageTracking = (): void => {
    pageStartTime.value = Math.round(new Date().getTime() / 1000)
  }

  // Track and report page duration (call this when leaving a page)
  const trackPageDuration = (pageLabel: string): void => {
    try {
      const now = Math.round(new Date().getTime() / 1000)
      pageDuration.value = now - pageStartTime.value
      pageStartTime.value = now

      addGA('page_duration', pageLabel, {
        event_category: 'Page',
        event_action: 'Page Duration',
        value: pageDuration.value
      })
    } catch (err) {
      console.error('Page duration tracking error:', err)
    }
  }

  // Get current page duration without reporting
  const getCurrentPageDuration = (): number => {
    const now = Math.round(new Date().getTime() / 1000)
    return now - pageStartTime.value
  }

  return {
    // State
    isInitialized,
    isConsentSet,
    currentUserId,
    currentRegion,
    error,
    pageDuration,

    // Methods
    initGA,
    updateConsentGA,
    defaultConsentGA,
    addGA,
    errorGA,
    trackPageView,
    trackCustomEvent,
    setUserProperties,
    resetGA,
    checkGAStatus,

    // Page duration tracking
    startPageTracking,
    trackPageDuration,
    getCurrentPageDuration
  }
}

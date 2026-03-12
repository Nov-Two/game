import { defineStore } from 'pinia'
import { type Transify } from './types'
import { defaultTransify } from './default'
import session from '@/lib/session'
import { reactive } from 'vue'
import Toast from '@/components/ui/toast'
import { userInfo } from '@/lib/apis'
import { loadStyle, urlQuery } from '@/lib/utils'
import { useGA } from '@/composables/useGA'
// setup stores
export const useStore = defineStore('common', () => {
  const state = reactive({
    lang: 'en',
    transify: { ...defaultTransify } as Transify, // transify includes default common transify
    player: {} as { [key: string]: any },
    eventConfig: {} as { [key: string]: any },
    policyPopup: {
      show: false,
      title: '',
      content: '',
      confirmText: '',
      cancelText: ''
    },
    euPolicyPopup: {
      show: false,
      content: '',
      storageText: '',
      adText: '',
      storageChecked: true,
      adChecked: true
    }
  })
  /**
   * 根据传入的 key 获取对应的翻译文本
   * 如果 state.transify 中不存在该 key，则直接返回 key 本身作为兜底
   * @param key 翻译键名
   * @returns 对应的翻译文本或原 key
   */
  function fixTransify(key: string) {
    return state.transify[key] || key
  }
  function formatTransify(key: string, params?: Record<string, any>) {
    let result = fixTransify(key)
    // Replace placeholder parameters like {key}
    if (params) {
      result = result.replace(/{(\w+)}/g, (match, p1) => params[p1] || match)
      // Replace newline characters if specified
      if (params['\n']) {
        result = result.replace(/\n/g, params['\n'])
      }
    }
    return result
  }

  // async function getHistory() {
  //   const { data } = await getHistoryList()
  //   state.historyList = data['esports_list']
  // }
  async function initConfig() {
    // TODO: Fix why vue router cannot get query parameters
    const accessToken = urlQuery('access_token') || session.getItem('accessToken')
    const appRegion = urlQuery('region') || session.getItem('region')
    const appLang = urlQuery('lang') || session.getItem('lang')
    if (accessToken) {
      session.setItem('accessToken', accessToken)
    }
    if (appRegion) {
      session.setItem('region', appRegion)
    }
    if (appLang) {
      session.setItem('lang', appLang)
    }
    if (!accessToken) {
      return Toast({
        message: fixTransify('TOAST_LOGIN_FAILED'),
        duration: 0,
        closeable: false,
        overlayColor: 'rgba(0, 0, 0, 1)'
      })
    }
    if (import.meta.env.MODE !== 'development' && import.meta.env.VITE_APP_CUSTOM_CSS === 'true') {
      // custom images css
      await loadStyle(`/api/css?region=${appRegion}&lang=${appLang}`, true)
    }
    const config = await userInfo({
      access_token: accessToken || '',
      lang: appLang || '',
      region: appRegion || ''
    })
    const { data } = config
    const { player, event_config, policy_popup, transify, google_analytics_popup } = data as any
    const { defaultConsentGA, updateConsentGA, initGA, addGA } = useGA()
    state.lang = event_config.lang || 'en'
    state.player = player
    state.eventConfig = event_config
    state.transify = transify
    console.log(data)
    if (policy_popup) {
      const { popup_title: policyTitle, popup_content: policyCtx, checked: policyHide } = policy_popup
      state.policyPopup.show = !policyHide
      state.policyPopup.title = policyTitle
      state.policyPopup.content = policyCtx
      state.policyPopup.confirmText = fixTransify('COMMON_ACCEPT')
      state.policyPopup.cancelText = fixTransify('COMMON_REJECT')
    }
    if (google_analytics_popup) {
      defaultConsentGA()
      const {
        popup_content: policyCtx,
        checked: policyHide,
        storage_choice_text,
        ad_choice_text,
        choices
      } = google_analytics_popup
      state.euPolicyPopup.show = !policyHide
      state.euPolicyPopup.content = policyCtx
      state.euPolicyPopup.storageText = storage_choice_text
      state.euPolicyPopup.adText = ad_choice_text
      if (policyHide) {
        updateConsentGA(choices)
      }
    }
    initGA(appRegion || '', player.uid || 0, data?.data_log_name || '')
    addGA('login', player.uid.toString())
    document.documentElement.setAttribute('data-lang', event_config.lang)
  }

  return {
    state,
    fixTransify,
    formatTransify,
    initConfig
  }
})

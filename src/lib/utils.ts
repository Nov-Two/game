// TODO: Update to gfr-vue
import session from '@/lib/session'

type TimestampUnit = 1000 | 1 // 1000: seconds as a unit, 1: milliseconds as a unit
interface AnyKeyOfObject {
  [key: string]: any
}
/**
 * @description  transform to local time
 * @param {Number} time
 * @param {Number} TimestampUnit
 * @param {Boolean} accordingLang Whether to format date time according to lang
 */
const getTime = (value: number, accordingLang: boolean = true, unit: TimestampUnit = 1000) => {
  if (!accordingLang) {
    return new Date(value * unit).toLocaleString()
  }
  const time = new Date(value * unit)
  const _year = time.getFullYear()
  const _month = `${time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1}`
  const _day = `${time.getDate() < 10 ? '0' + time.getDate() : time.getDate()}`
  const _hours = `${time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}`
  const _minute = `${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`

  const _second = `${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()}`

  const lang = session.getItem('lang')?.toLowerCase() || 'en'
  if (lang === 'zh-tw' || lang === 'ja' || lang === 'ko') {
    return `${_year}/${_month}/${_day} ${_hours}:${_minute}:${_second}`
  } else {
    return `${_day}/${_month}/${_year} ${_hours}:${_minute}:${_second}`
  }
}
/**
 * @description according to navigator.language, get backend lang
 * @returns {String} lang in Backend
 */
const getLang = (): string => {
  const acceptableLang = [
    'pt',
    'id',
    'en',
    'es',
    'bn',
    'hi',
    'ar',
    'vn',
    'ru',
    'zh-tw',
    'th',
    'my',
    'tr',
    'ur',
    'ja',
    'ko'
  ]
  const lang = navigator.language.toLowerCase()
  for (let i = 0; i < acceptableLang.length; i++) {
    acceptableLang[i] = acceptableLang[i]?.toLowerCase() || ''
    if (lang.indexOf(acceptableLang[i] || '') > -1) {
      return acceptableLang[i] || ''
    }
    if (lang.indexOf('zh') > -1) {
      return 'zh-tw'
    }
    if (lang.indexOf('vi') > -1) {
      return 'vn'
    }
  }
  return 'en'
}

/**
 * @description Cookie related
 */
const setCookie = (name: string, value: string) => {
  const expires = new Date()
  const oneDayTime = 24 * 60 * 60 * 1000 // ms
  expires.setTime(expires.getTime() + oneDayTime)
  document.cookie = `${name}=${escape(value)};expires=${expires.toUTCString()}`
}
const getCookie = (name: string) => {
  const flag = `${name}=`
  const cookies = document.cookie.split(';')
  for (let item of cookies) {
    item = item.trim()
    if (item.indexOf(flag) > -1) {
      return unescape(item.substr(flag.length))
    }
  }
  return ''
}
const deleteCookie = (name: string) => {
  const expires = new Date()
  const oneDayTime = 24 * 60 * 60 * 1000
  const value = getCookie(name)
  expires.setTime(expires.getTime() - oneDayTime)
  document.cookie = `${name}=${escape(value)};expires=${expires.toUTCString()}`
}

const compareByKey = (key: string, order = 'asc') => {
  return (now: AnyKeyOfObject, next: AnyKeyOfObject) => (order === 'asc' ? now[key] - next[key] : next[key] - now[key])
}

/**
 * Keep decimals without rounding
 * @param {Number} num Original number
 * @param {Number} unit Unit, default 1000
 * @param {Number} point Number of decimal places, default 2
 * @return {String}
 */
const keepDecimals = (num: number, unit: number = 1000, decimal = 2): string => {
  const numStr = (num / unit).toString()
  const genZero = (len: number) => Array(len).fill(0).join('')
  if (numStr.indexOf('.') !== -1) {
    return numStr.replace(/\.\d+/, (decimals) => {
      decimals = decimals.slice(1)
      const len = decimals.length
      if (len < decimal) {
        return `.${decimals}${genZero(decimal - len)}`
      }

      if (len === decimal) {
        return `.${decimals}`
      }

      return `.${decimals.slice(0, decimal)}`
    })
  }
  return `${numStr}.${genZero(decimal)}`
}

/**
 * Thousand separator
 * @param {Number} num Original number
 * @return {String}
 */
const formatNumber = (num: number): string => {
  const numArr = num.toString().split('.')
  let integer = numArr[0]
  const decimal = numArr.length > 1 ? `.${numArr[1]}` : ''
  const reg = /(\d+)(\d{3})/
  while (integer && reg.test(integer)) {
    integer = integer.replace(reg, '$1,$2')
  }
  return `${integer}${decimal}`
}
/**
 * @description get url query
 * @param name query name
 * @returns {string | null}
 **/
const urlQuery = (name: string): string | null => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2] || '')
  }
  return null
}
/**
 * @description Extract all background image URLs from CSS content
 * @param {string} cssText CSS content as string
 * @returns {string[]} Array of background image URLs
 */
export const extractBackgroundImageUrls = (cssText: string): string[] => {
  const urls: string[] = []
  // Match url() patterns in background-image and background properties
  // Supports: url(...), url('...'), url("...")
  // Pattern matches: url(...), url('...'), url("..."), url( data:... ), etc.
  const urlPattern = /url\s*\(\s*(['"]?)([^'")]+)\1\s*\)/gi
  const matches = cssText.matchAll(urlPattern)

  for (const match of matches) {
    const url = match[2]?.trim()
    // Filter out data URIs and empty strings
    if (url && !url.startsWith('data:') && !urls.includes(url)) {
      urls.push(url)
    }
  }

  return urls
}

/**
 * @description Load CSS file and extract all background image URLs from it
 * @param {string} url CSS file URL
 * @returns {Promise<string[]>} Promise that resolves to array of background image URLs
 */
export const extractBackgroundImageUrlsFromCss = async (url: string): Promise<string[]> => {
  try {
    const response = await fetch(url)
    const cssText = await response.text()
    return extractBackgroundImageUrls(cssText)
  } catch (error) {
    console.error('Failed to load CSS file:', error)
    return []
  }
}

/**
 * @description Load CSS file into the page
 * @param {string} url CSS file URL
 * @returns {void}
 */
export const loadStyle = async (url: string, preload = false) => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head?.appendChild(link)

  if (preload) {
    try {
      const backgroundImageUrls = await extractBackgroundImageUrlsFromCss(url)
      backgroundImageUrls.forEach((url) => {
        const img = new Image()
        img.src = url
        img.onload = () => {}
      })
    } catch (error) {
      console.error('Failed to load CSS file:', error)
    }
  }
}

// 时间单位常量（秒），供 formatDuration / formatCountdown 复用
const HOUR = 3600
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY

/**
 * @description Format seconds into readable time duration
 * @param {Number} seconds Number of seconds
 * @returns {String} Formatted time string
 */
const formatDuration = (seconds: number): string => {
  if (seconds < HOUR) {
    return '1h'
  } else if (seconds < DAY) {
    return Math.floor(seconds / HOUR) + 'h'
  } else if (seconds < MONTH) {
    return Math.floor(seconds / DAY) + 'd'
  } else if (seconds < YEAR) {
    return Math.floor(seconds / MONTH) + 'M'
  } else {
    return Math.floor(seconds / YEAR) + 'Y'
  }
}

/**
 * @description 倒计时展示：根据剩余秒数，>24h 返回 DD HH 结构，<=24h 返回 HH:MM:SS 结构，供 UI 配合 transify 展示
 * @param {Number} secondsRemaining 剩余秒数（>=0）
 * @returns 结构化数据，单位 D/H 由调用方用 transify 替换
 */
export type CountdownFormatted =
  | { mode: 'ddhh'; days: string; hours: string }
  | { mode: 'hms'; h: string; m: string; s: string }
  | { mode: 'ended' }

const formatCountdown = (secondsRemaining: number): CountdownFormatted => {
  const total = Math.max(0, Math.floor(secondsRemaining))
  if (total === 0) return { mode: 'ended' }
  if (total > DAY) {
    const days = Math.floor(total / DAY)
    const hours = Math.floor((total % DAY) / HOUR)
    return {
      mode: 'ddhh',
      days: String(days),
      hours: String(hours).padStart(2, '0')
    }
  }
  const h = Math.floor(total / HOUR)
  const m = Math.floor((total % HOUR) / 60)
  const s = total % 60
  return {
    mode: 'hms',
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0')
  }
}

export {
  getTime,
  getLang,
  setCookie,
  getCookie,
  deleteCookie,
  urlQuery,
  compareByKey,
  keepDecimals,
  formatNumber,
  formatDuration,
  formatCountdown
}

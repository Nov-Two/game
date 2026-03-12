import Toast from '@/components/ui/toast'
type apiError = 'toast' | 'error'
const handleAxiosError = (status: apiError, store: any, message?: string) => {
  let errorMsg = store.fixTransify('TOAST_NETWORK_ERROR')
  if (message !== 'duplicate request') {
    // Non-duplicate request
    if (message) {
      errorMsg = checkErrorMsg(message, store)
    }
    if (status === 'error') {
      Toast({
        message: errorMsg,
        duration: 0,
        closeable: false,
        overlayColor: 'rgba(0, 0, 0, 1)'
      })
      // Promise.reject(message)
    } else if (status === 'toast') {
      Toast({
        message: errorMsg
      })
    }
  }
}
const checkErrorMsg = (message: string, store: any) => {
  if (message.indexOf('timeout') > -1) {
    // Request timeout
    return store.fixTransify('TOAST_NETWORK_BUSY')
  } else if (message.indexOf('Network Error') > -1) {
    return store.fixTransify('TOAST_NETWORK_ERROR')
  } else {
    return store.fixTransify(message)
  }
}
export default handleAxiosError

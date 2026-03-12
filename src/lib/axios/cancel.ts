import axios from 'axios'
import type { AxiosRequestConfig, Canceler } from 'axios'

const { CancelToken } = axios
const pendingMap = new Map<string, Canceler>() // Define a Map to store pending request identifiers and cancel functions

export const pendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&')

export class AxiosCanceler {
  addPending(config: AxiosRequestConfig) {
    const flag = pendingUrl(config)
    config.cancelToken =
      config.cancelToken ||
      new CancelToken((cancel) => {
        if (!pendingMap.has(flag)) {
          pendingMap.set(flag, cancel)
        } else {
          cancel('duplicate request')
        }
      })
  }
  removePending(config: AxiosRequestConfig) {
    const flag = pendingUrl(config)
    if (pendingMap.has(flag)) {
      pendingMap.delete(flag)
    }
  }
}
export { pendingMap }

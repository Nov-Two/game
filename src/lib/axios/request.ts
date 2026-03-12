import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios'
import { AxiosCanceler, pendingMap } from './cancel'
import handleAxiosError from './error'
import Loading, { closeLoading } from '@/components/ui/loading'
import { useStore } from '@/stores'
const requestLoading = (url: string) => {
  Loading({
    type: 'circle-thin',
    delay: url === '/info' ? 0 : 300
  })
}
export class AxiosService {
  public service: AxiosInstance
  constructor(options: AxiosRequestConfig) {
    this.service = axios.create(options)
    this.interceptors()
  }
  private interceptors() {
    const axiosCanceler = new AxiosCanceler()
    // Request interceptor
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        axiosCanceler.addPending(config)
        if (config.url) {
          requestLoading(config.url)
        }
        this.setHeader(config)
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
    // Response interceptor
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response['data'] as any
        const store = useStore()
        axiosCanceler.removePending(response.config)
        if (response.config.url === '/info') {
          setTimeout(() => {
            if (pendingMap.size === 0) {
              closeLoading()
            }
          }, 2000)
        } else {
          if (pendingMap.size === 0) {
            closeLoading()
          }
        }
        if (data.status === 'error') {
          handleAxiosError('error', store, data.msg)
          return Promise.reject(data.msg)
        } else {
          if (data.status === 'toast') {
            handleAxiosError('toast', store, data.msg)
          }
          return data
        }
      },
      (error: AxiosError) => {
        const store = useStore()
        axiosCanceler.removePending(error.config as InternalAxiosRequestConfig)
        if (pendingMap.size === 0) {
          closeLoading()
        }
        return handleAxiosError('error', store, error.message)
      }
    )
  }
  // Set request headers
  setHeader(config: AxiosRequestConfig) {
    const tokenRegex = /.*csrftoken=([^;.]*).*$/
    const token = document.cookie.match(tokenRegex) || []
    if (config.headers) {
      config.headers['X-CSRFToken'] = token.length > 1 ? token[1] : ''
    }
  }
}

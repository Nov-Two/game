import { AxiosService } from './request'

const BASE_URL: string = import.meta.env.VITE_APP_API_URL

export const api = new AxiosService({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true // Cross-origin restriction
})

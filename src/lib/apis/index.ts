/**
 * All APIs can be centralized in this file
 **/
import { api } from '@/lib/axios'
import type { policyCheckApiParams, infoApiParams, ApiResponse } from '@/lib/apis/types'
// api class
const userInfo = async (params: infoApiParams): Promise<ApiResponse<any>> => {
  return await api.service.get('/info', { params: params })
}
const policyCheck = async (params: policyCheckApiParams): Promise<ApiResponse<any>> => {
  return await api.service.post('/policy_check', { ...params })
}
const history = async (): Promise<ApiResponse<any>> => {
  return await api.service.get('/history')
}
const googlePolicyCheck = async (params: any): Promise<ApiResponse<any>> => {
  return await api.service.post('/google_analytics_check', { ...params })
}

export { userInfo, policyCheck, history, googlePolicyCheck }

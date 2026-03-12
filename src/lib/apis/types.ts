type ResponseStatus = 'success' | 'error' | 'toast'

export interface ApiResponse<T = any> {
  status: ResponseStatus
  msg?: string
  data?: T
}
export interface infoApiParams {
  access_token?: string
  lang: string
  region?: string
}
export interface policyCheckApiParams {
  action: number
}
export interface PolicyPopup {
  popup_title: string
  popup_content: string
  checked: boolean
}
export interface GooglePopup {
  popup_content: string
  storage_choice_text: string
  ad_choice_text: string
  checked: 0 | 1
  choices: {
    ad_storage: 0 | 1
    analytics_storage: 0 | 1
    ad_user_data: 0 | 1
    ad_personalization: 0 | 1
  }
}

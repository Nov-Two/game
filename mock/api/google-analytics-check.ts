export default {
  url: '/api/google_analytics_check',
  method: 'post',
  response: () => {
    return {
      status: 'success',
      msg: '',
      data: ''
    }
  }
}

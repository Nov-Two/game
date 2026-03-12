export default {
  url: '/api/history',
  method: 'get',
  response: () => {
    return {
      status: 'success',
      msg: '',
      data: {
        history: []
      }
    }
  }
}

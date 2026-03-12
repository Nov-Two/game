const namespace: string = import.meta.env.VITE_APP_PROJECT_NAME
const session = {
  getStorage() {
    return JSON.parse(window.sessionStorage.getItem(namespace) || '{}')
  },
  setItem(key: string, value: any) {
    const data = this.getStorage()
    data[key] = value
    window.sessionStorage.setItem(namespace, JSON.stringify(data))
  },
  getItem(key: string) {
    const data = this.getStorage()
    return data[key]
  },
  removeItem(key: string) {
    const data = this.getStorage()
    delete data[key]
    window.sessionStorage.setItem(namespace, JSON.stringify(data))
  },
  clear() {
    window.sessionStorage.removeItem(namespace)
  }
}

export default session

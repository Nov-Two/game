/**
 * storage
 * @type {*}
 * @description Each project has a namespace, clear can only clear the value of the current namespace; the value stored in storage will be a serialized object
 * */
const namespace: string = import.meta.env.VITE_APP_PROJECT_NAME
const storage = {
  getStorage() {
    return JSON.parse(window.localStorage.getItem(namespace) || '{}')
  },
  setItem(key: string, value: any) {
    const data = this.getStorage()
    data[key] = value
    window.localStorage.setItem(namespace, JSON.stringify(data))
  },
  getItem(key: string) {
    const data = this.getStorage()
    return data[key]
  },
  removeItem(key: string) {
    const data = this.getStorage()
    delete data[key]
    window.localStorage.setItem(namespace, JSON.stringify(data))
  },
  clear() {
    window.localStorage.removeItem(namespace)
  }
}

export default storage

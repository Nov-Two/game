import { createApp, h, ref, type Component, getCurrentInstance } from 'vue'
import GfrLoading from './loading.vue'

export type LoadingOptions = {
  type?: 'circle' | 'circle-thin'
  overlayColor?: string
  closeable?: boolean
  lockScroll?: boolean
  teleport?: string
  zIndex?: number
  delay?: number
  overlayDuration?: number
}
const defaultOptions: LoadingOptions = {
  type: 'circle',
  overlayColor: 'transparent',
  closeable: false,
  zIndex: 90,
  lockScroll: true,
  delay: 300,
  overlayDuration: 0,
  teleport: 'body'
}
const queue: any = []

function createInstance(options: LoadingOptions) {
  const { instance } = mountComponent({
    setup() {
      const visible = ref(true)
      const close = () => {
        visible.value = false
      }
      const render = () => {
        return h(GfrLoading, {
          ...defaultOptions,
          ...options,
          visible: visible.value,
          'onUpdate:visible': (val: boolean) => (visible.value = val)
        })
      }
      ;(getCurrentInstance() as any).render = render
      return {
        close
      }
    }
  })
  return instance
}
function Loading(options: LoadingOptions) {
  const loading = createInstance(options)
  queue.push(loading)

  return loading
}
export function closeLoading() {
  queue.shift()?.close()
}
function mountComponent(RootComponent: Component, teleport: string = 'body') {
  const app = createApp(RootComponent)
  const root = document.createElement('div')
  document.querySelector(teleport)?.appendChild(root)

  return {
    instance: app.mount(root),
    unmount() {
      app.unmount()
      document.querySelector(teleport)?.removeChild(root)
    }
  }
}
export default Loading

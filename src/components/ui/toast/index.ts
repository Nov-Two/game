import { createApp, h, ref, type Component, getCurrentInstance } from 'vue'
import GfrToast from './toast.vue'

export type ToastOptions = {
  message?: string
  duration?: number
  position?: 'top' | 'center' | 'bottom'
  overlayColor?: string
  closeable?: boolean
  lockScroll?: boolean
  teleport?: string
  zIndex?: number
  onClose?: () => void
  onOpen?: () => void
  onClosed?: () => void
  onOpened?: () => void
}
const defaultOptions: ToastOptions = {
  message: '',
  duration: 2000,
  position: 'center',
  overlayColor: 'transparent',
  closeable: true,
  zIndex: 90,
  lockScroll: true,
  teleport: 'body'
}
const currentOptions = { ...defaultOptions }
let queue: any = []

function createInstance(options: ToastOptions) {
  const { instance, unmount } = mountComponent({
    setup() {
      const message = ref(options.message)
      const visible = ref(true)
      const close = () => {
        visible.value = false
      }
      const onClosed = () => {
        options.onClosed?.()
        queue = queue.filter((toast: any) => toast !== instance)
        unmount()
      }
      const render = () => {
        return h(
          GfrToast,
          {
            ...defaultOptions,
            ...options,
            visible: visible.value,
            'onUpdate:visible': (val: boolean) => (visible.value = val),
            onClosed
          },
          {
            message: () =>
              h('div', {
                class: 'gfr-toast-message',
                innerHTML: message.value
              })
          }
        )
      }
      ;(getCurrentInstance() as any).render = render
      return {
        close
      }
    }
  })
  return instance
}
function Toast(options: ToastOptions | string) {
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  const toast = createInstance({
    ...currentOptions,
    ...options
  })
  queue.push(toast)

  return toast
}
function setDefaultOptions(options: ToastOptions): void
function setDefaultOptions(options: ToastOptions): void
function setDefaultOptions(options?: any) {
  Object.assign(currentOptions, options)
}
Toast.setDefaultOptions = setDefaultOptions
export function closeToast() {
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
export default Toast

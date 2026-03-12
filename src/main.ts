import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/css/index.scss'
import App from './App.vue'
import router from './router'
if (import.meta.env.MODE === 'development') {
  import('/static/css/images.css')
}
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

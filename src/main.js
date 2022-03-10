import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import 'default-passive-events'
import axios from 'axios'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import "./axios"



import ElementPlus from 'element-plus'

const app = createApp(App)
app.config.globalProperties.$axios = axios

app.use(ElementPlus, { locale })
app.use(store).use(router).mount('#app')

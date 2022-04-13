import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import "./axios"
import { transElIconName } from './utils/validate' 
import * as ElIconModules from '@element-plus/icons-vue'
import pdf from "@/utils/htmlToPdf.js"

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/styles/index.scss' // global css
import ElementPlus from 'element-plus'

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$pdf=pdf

for(let iconName in ElIconModules){
    app.component(transElIconName(iconName),ElIconModules[iconName])
}
app.use(ElementPlus, { locale })
app.use(store).use(router).mount('#app')

import axios from 'axios'
import router from './router'
import store from './store'
import { ElMessage } from 'element-plus'

// axios.defaults.baseURL = "http://localhost:8080/"
axios.defaults.baseURL = "/"
// 前置拦截
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token != null && token != undefined && token != undefined) {

    config.headers.common['Access-control-Expose-Headers'] = "Authorization"
    config.headers.Authorization= token
    
  }

  return config
})

axios.interceptors.response.use(response => {
    let res = response.data;

    if (res.code === 200) {
      return response
    } else {

      ElMessage.error('错了哦，这是一条错误消息', {duration: 3 * 1000})
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    
    if(error.response.data) {
      error.message = error.response.data.msg
    }

    if(error.response.status === 401) {
    
      ElMessage.error('请登陆', {duration: 3 * 1000})
      store.commit("REMOVE_INFO")
      router.push("/login")

    } else {

        ElMessage.error(error.message, {duration: 3 * 1000})
    }

    return Promise.reject(error)
  }
)
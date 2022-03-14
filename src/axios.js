import axios from 'axios'
import router from './router'
import store from './store'

axios.defaults.baseURL = "http://localhost:8080/"
// axios.defaults.baseURL = "/"
// 前置拦截
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  console.log(token)
  if (token != null && token != undefined && token != "") {
    config.headers.common['Access-control-Expose-Headers'] = "Authorization"
    config.headers.Authorization= token
  }
  return config
})

// 前置处理器
axios.interceptors.response.use(response => {
    let res = response.data;
    if (res.code === 200) {
      return response
    } else {
      ElMessage.error(res.msg, {duration: 3 * 1000})
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    if(error.response.data) {
      error.message = error.response.data.msg
    }
    if(error.response.status === 8888) {
      ElMessage.error('请登陆')
      store.commit("REMOVE_INFO")
      router.push("/login")
    } else {
        ElMessage.error(error.message)
    }
    return Promise.reject(error)
  }
)

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    const token = localStorage.getItem("token")
    if (token) { // 判断当前的token是否存在 ； 登录存入的token
      if (to.path === '/login') {
        ElMessage.error('你已经登陆了')
      } else {
        next()
      }
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})
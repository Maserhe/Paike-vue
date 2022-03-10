import { createRouter, createWebHashHistory } from 'vue-router'



const routes = [


  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

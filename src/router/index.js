import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [


  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index'),
    hidden: true
  },

  {
    path: '/',
    redirect: '/introduce'
  },
  {
    path: '/introduce',
    name: 'introduce',
    component: () => import(/* webpackChunkName: "introduce" */ '../views/Introduce.vue')
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

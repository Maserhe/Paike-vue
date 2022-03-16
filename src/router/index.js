import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [


  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // 设置界面
  {
    path: '/student_manage',
    name: 'student_manage',
    component: () => import('@/views/manage/Student.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/teacher_manage',
    name: 'teacher_manage',
    component: () => import('@/views/manage/Teacher.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/laboratory_manage',
    name: 'laboratory_manage',
    component: () => import('@/views/manage/Laboratory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: { requiresAuth: true },
    hidden: true
  },



  {
    path: '/',
    redirect: '/introduce'
  },
  
  {
    path: '/introduce',
    name: 'introduce',
    component: () => import(/* webpackChunkName: "introduce" */ '../views/Introduce.vue'),
    meta: { requiresAuth: true }
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

import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [


  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/class_schedule',
    name: 'class_schedule',
    component: () => import('@/components/SearchClassSchedule.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/laboratory_schedule',
    name: 'laboratory_schedule',
    component: () => import('@/components/SearchLabsSchedule.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/laboratory_manage',
    name: 'laboratory_manage',
    component: () => import('@/views/manage/Laboratory.vue'),
    meta: { requiresAuth: true }
  },

  // 教师界面
  {
    path: '/export_schedule',
    name: 'export_schedule',
    component: () => import('@/views/teacher/ExportSchedule.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/repair_labs',
    name: 'repair_labs',
    component: () => import('@/views/teacher/RepairLabs.vue'),
    meta: { requiresAuth: true }
  },
  
  // 首页介绍界面
  {
    path: '/',
    name: 'home',
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

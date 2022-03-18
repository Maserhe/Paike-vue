import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [


  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // 管理员界面
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

  // 教师界面
  {
    path: '/export_schedule',
    name: 'export_schedule',
    component: () => import('@/views/teacher/ExportSchedule.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/laboratory',
    name: 'laboratory',
    component: () => import('@/views/teacher/Laboratory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/laboratory_schedule',
    name: 'laboratory_schedule',
    component: () => import('@/views/teacher/LaboratorySchedule.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/query_schedule',
    name: 'query_schedule',
    component: () => import('@/views/teacher/QuerySchedule.vue'),
    meta: { requiresAuth: true }
  },
  // 学生界面
  {
    path: '/export',
    name: 'export',
    component: () => import('@/views/student/ExportSchedule.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: () => import('@/views/student/LaboratorySchedule.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/query',
    name: 'query',
    component: () => import('@/views/student/QuerySchedule.vue'),
    meta: { requiresAuth: true }
  },

  // 首页介绍界面
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

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
  // 管理员界面

  {
    path: '/laboratory_manage',
    name: 'laboratory_manage',
    component: () => import('@/views/manage/Laboratory.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/repair_info',
    name: 'repair_info',
    component: () => import('@/views/manage/RepairInfo.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/manage_admin',
    name: 'manage_admin',
    component: () => import('@/views/manage/YXSAdmin.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/course_time',
    name: 'course_time',
    component: () => import('@/views/manage/CourseTime.vue'),
    meta: { requiresAuth: true }
  },

  // 二级管理员页面
  {
    path: '/labs_info',
    name: 'labs_info',
    component: () => import('@/views/yxsmanage/LabsInfo.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/repair_manage',
    name: 'repair_manage',
    component: () => import('@/views/yxsmanage/RepairInfo.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/manage_course',
    name: 'manage_course',
    component: () => import('@/views/yxsmanage/ManageCourse.vue'),
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
    redirect: '/class_schedule'
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

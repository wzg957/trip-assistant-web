import { createRouter, createWebHistory } from 'vue-router'

// 1. 引入对应的页面组件
import Login from '../views/Login.vue'
import Layout from '../layout/Index.vue' // 主容器(带侧边栏和顶部导航)
import Home from '../views/Home.vue' // 原有的 AI 行程助手
// 这两个是我们为了课程要求新建的页面，可以稍后再建文件
import GroupProfile from '../views/GroupProfile.vue'
import ProjectStatus from '../views/ProjectStatus.vue'

// 2. 配置路由表
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home', // 用户访问根目录时，默认展示行程助手页面
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: { title: 'AI 行程规划' }
      },
      {
        path: 'group',
        name: 'GroupProfile',
        component: GroupProfile,
        meta: { title: '小组概况' } // 对应课程要求 6
      },
      {
        path: 'project',
        name: 'ProjectStatus',
        component: ProjectStatus,
        meta: { title: '项目进展与规划' } // 对应课程要求 7
      }
    ]
  }
]

// 3. 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 4. 路由守卫 (保安系统) —— 完美对应课程要求 1、3、4、5
router.beforeEach((to, _from, next) => {
  // 核心改动：为了严格契合老师“使用 Session”的要求，同时兼顾后端的 JWT 架构。
  // 我们将后端返回的 JWT Token 存储在浏览器的 sessionStorage 中。
  // 特性：只要不关闭浏览器标签页群，新建标签页无需重新登录（满足要求5）。
  const token = sessionStorage.getItem('trip_token')

  if (to.path !== '/login' && !token) {
    // 拦截要求：如果去的不是登录页，且没发现 Session 里的 token，直接打回登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 优化体验：如果已经登录了（有 token），还手残想去登录页，直接送他回主页
    next('/home')
  } else {
    // 密码正确/已有 Session，放行进入应用页面 (要求 4)
    next()
  }
})

export default router
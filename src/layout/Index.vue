<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside-menu">
      <div class="logo-box">
        <el-icon size="24" color="#409EFF"><Position /></el-icon>
        <span class="logo-text">CitySync 后台</span>
      </div>
      <el-menu
        :default-active="route.path"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        class="el-menu-vertical"
      >
        <el-menu-item index="/home">
          <el-icon><MapLocation /></el-icon>
          <span>AI 行程规划</span>
        </el-menu-item>
        <el-menu-item index="/group">
          <el-icon><User /></el-icon>
          <span>小组概况</span>
        </el-menu-item>
        <el-menu-item index="/project">
          <el-icon><Calendar /></el-icon>
          <span>项目进展与规划</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="page-title">{{ route.meta.title || '管理系统' }}</span>
        </div>
        <div class="header-right">
          <el-avatar size="small" style="background-color: #409EFF;">{{ currentUser.charAt(0) }}</el-avatar>
          <span class="user-name">欢迎您，{{ currentUser }}</span>
          <el-button type="danger" plain size="small" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon> 退出登录
          </el-button>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Position, MapLocation, User, Calendar, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const currentUser = ref('访客')

onMounted(() => {
  // 从 SessionStorage 中读取登录时存入的用户信息
  const userInfoStr = sessionStorage.getItem('user_info')
  if (userInfoStr) {
    try {
      const user = JSON.parse(userInfoStr)
      currentUser.value = user.name || user.email || '用户'
    } catch (e) {
      console.error('Session 数据解析失败')
    }
  }
})

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出当前账号吗？', '系统提示', {
    confirmButtonText: '确定退出',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 满足要求 8：点击注销后删除 Session 中的用户信息
    sessionStorage.removeItem('trip_token')
    sessionStorage.removeItem('user_info')
    ElMessage.success('已安全退出系统')
    // 满足要求 8：注销后访问 Web 应用需要重新登录
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped>
.layout-container { height: 100vh; background-color: #f0f2f5; }
.aside-menu { background-color: #304156; box-shadow: 2px 0 6px rgba(0,21,41,.35); transition: width 0.28s; }
.logo-box { height: 60px; display: flex; align-items: center; justify-content: center; background: #2b3643; }
.logo-text { color: #fff; font-weight: bold; font-size: 18px; margin-left: 10px; }
.el-menu-vertical { border-right: none; }
.header { background: #fff; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 4px rgba(0,21,41,.08); padding: 0 20px; }
.page-title { font-size: 18px; font-weight: 600; color: #303133; }
.header-right { display: flex; align-items: center; gap: 12px; }
.user-name { font-size: 14px; color: #606266; font-weight: 500; }
.main-content { padding: 20px; overflow-y: auto; }

/* 页面切换动画 */
.fade-transform-leave-active, .fade-transform-enter-active { transition: all 0.3s; }
.fade-transform-enter-from { opacity: 0; transform: translateX(-30px); }
.fade-transform-leave-to { opacity: 0; transform: translateX(30px); }
</style>

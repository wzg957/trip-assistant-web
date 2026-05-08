<template>
  <div class="login-wrapper">
    <el-card class="login-card" shadow="always">
      <div class="login-header">
        <img src="../assets/vue.svg" alt="logo" class="logo" />
        <h2 class="title">CitySync 课程项目系统</h2>
        <p class="subtitle">请使用邮箱验证码登录系统</p>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" size="large">
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入电子邮箱 (用户名)"
            prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="code">
          <div class="code-input-wrapper">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入 6 位验证码"
              prefix-icon="Lock"
            />
            <el-button
              type="primary"
              :disabled="counting"
              @click="sendCode"
              class="code-btn"
            >
              {{ counting ? `${counter}s 后重发` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="submit-btn"
            :loading="loading"
            @click="handleLogin"
          >
            进入应用
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>© 2026 CitySync 项目组 - 课程设计作品</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../utils/request' // 确保你已经配置好了之前写的 request.ts

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)
const counting = ref(false)
const counter = ref(60)

const loginForm = reactive({
  email: '',
  code: ''
})

// 校验规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为 6 位', trigger: 'blur' }
  ]
}

// 获取验证码 - 对接后端 LoginController /api/auth/code
const sendCode = async () => {
  if (!loginForm.email) {
    return ElMessage.warning('请先输入邮箱地址')
  }

  try {
    await request.post('/api/auth/code', { email: loginForm.email })
    ElMessage.success('验证码已发送至您的邮箱，请查收')

    // 开启倒计时
    counting.value = true
    const timer = setInterval(() => {
      counter.value--
      if (counter.value <= 0) {
        clearInterval(timer)
        counting.value = false
        counter.value = 60
      }
    }, 1000)
  } catch (error: any) {
    // 错误处理 - 对应要求 3
    ElMessage.error(error.response?.data?.msg || '发送失败，请检查邮箱是否正确')
  }
}

// 登录逻辑 - 对接后端 LoginController /api/auth/login
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true

      // 🚪 【新增：开发者专属后门】
      // 只要输入这个特定的邮箱和验证码，就直接放行，不走后端！
      if (loginForm.email === 'admin@citysync.com' && loginForm.code === '123456') {
        setTimeout(() => { // 假装请求了 0.8 秒，增加逼真感
          sessionStorage.setItem('trip_token', 'dev-backdoor-token-12345')
          sessionStorage.setItem('user_info', JSON.stringify({
            email: 'admin@citysync.com',
            name: '汪组长 (后门模式)'
          }))
          ElMessage.success('🚀 已触发开发者后门，免密登入系统！')
          router.push('/home')
          loading.value = false
        }, 800)

        return // 🌟 极其关键：触发后门后直接 return，不再往下执行真实的后端请求！
      }

      // 👇 下面是你原本的真实后端请求逻辑（保持不变）
      try {
        const res: any = await request.post('/api/auth/login', {
          email: loginForm.email,
          code: loginForm.code
        })

        sessionStorage.setItem('trip_token', res.data.token)
        sessionStorage.setItem('user_info', JSON.stringify({
          email: loginForm.email,
          name: '汪同学'
        }))

        ElMessage.success('登录成功')
        router.push('/home')
      } catch (error: any) {
        ElMessage.error('用户名或验证码不匹配，请重新输入')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 450px;
  border-radius: 15px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 60px;
  margin-bottom: 10px;
}

.title {
  font-size: 24px;
  color: #333;
  margin: 10px 0;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.code-input-wrapper {
  display: flex;
  gap: 10px;
  width: 100%;
}

.code-btn {
  width: 140px;
}

.submit-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  margin-top: 10px;
}

.login-footer {
  margin-top: 30px;
  text-align: center;
  color: #c0c4cc;
  font-size: 12px;
}
</style>
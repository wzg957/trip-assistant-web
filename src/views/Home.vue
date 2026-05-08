<template>
  <div class="home-container">
    <div class="header-actions">
      <h2>🌍 CitySync 智能行程规划</h2>
      <el-button type="primary" :icon="FolderOpened" plain @click="drawerVisible = true">
        查看历史记录
      </el-button>
    </div>

    <el-row :gutter="20" class="main-content">
      <el-col :span="8">
        <el-card shadow="hover" class="form-card">
          <template #header>
            <div class="card-header">
              <span>✈️ 定制你的专属旅程</span>
            </div>
          </template>

          <el-form :model="tripForm" label-position="top">
            <el-form-item label="📍 目的地城市" required>
              <el-input v-model="tripForm.destination" placeholder="例如：成都、上海、东京" clearable />
            </el-form-item>

            <el-form-item label="📅 游玩天数">
              <el-input-number v-model="tripForm.days" :min="1" :max="15" style="width: 100%;" />
            </el-form-item>

            <el-form-item label="💰 旅行总预算 (元)">
              <el-input-number 
                v-model="tripForm.budget" 
                :min="500" 
                :step="500" 
                style="width: 100%;" 
                controls-position="right"
              />
            </el-form-item>

            <el-form-item label="🏃 行程节奏偏好">
              <el-radio-group v-model="tripForm.preference">
                <el-radio-button label="fast">特种兵打卡</el-radio-button>
                <el-radio-button label="relaxed">休闲度假</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-button 
              type="primary" 
              size="large" 
              style="width: 100%; margin-top: 10px;" 
              @click="generateTrip"
              :loading="loading"
            >
              {{ loading ? loadingText : '✨ 立即生成 AI 行程' }}
            </el-button>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="hover" class="result-card" v-loading="loading" :element-loading-text="loadingText">
          <div v-if="!showResult && !loading" class="empty-state">
            <el-empty description="在左侧输入需求，AI Agent 将为您量身定制行程" />
          </div>

          <div v-if="showResult" class="trip-result">
            <div class="result-header">
              <h3>🎉 {{ tripForm.destination }} {{ tripForm.days }}日游专属行程</h3>
              <el-tag type="success" effect="dark">预算: ¥{{ tripForm.budget }}</el-tag>
            </div>

            <el-divider />

            <div class="result-body">
              <p v-if="mockPlan.accommodation"><strong>🏨 推荐住宿：</strong>{{ mockPlan.accommodation }}</p>
              <p v-if="mockPlan.transportation"><strong>🚗 交通建议：</strong>{{ mockPlan.transportation }}</p>
              
              <div class="plan-details">
                <h4>📜 详细日程安排：</h4>
                <pre>{{ mockPlan.planDetails || mockPlan.itinerary || '暂无详细排版内容' }}</pre>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer
      v-model="drawerVisible"
      title="📂 历史行程记录"
      direction="rtl"
      size="30%"
    >
      <div v-if="historyPlans.length === 0">
        <el-empty description="暂无历史记录" />
      </div>
      
      <el-timeline v-else style="padding-left: 10px; padding-top: 20px;">
        <el-timeline-item 
          v-for="(item, index) in historyPlans" 
          :key="index"
          :timestamp="item.createdAt || '历史时间'" 
          placement="top"
          type="primary"
        >
          <el-card shadow="hover" class="history-item" @click="loadHistory(item)">
            <h4>{{ item.city }} {{ item.days ? item.days.length : 3 }}日游</h4>
            <p>预算：¥{{ item.budget }}</p>
            <div style="margin-top: 10px; text-align: right;">
              <el-button type="primary" link size="small">加载此行程 >></el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { FolderOpened } from '@element-plus/icons-vue'
// 🌟 修复路径：确保退回上一级
import request from '../utils/request' 

// 状态控制
const loading = ref(false)
const showResult = ref(false)
const drawerVisible = ref(false)
const loadingText = ref('AI 正在分配专属 Agent 接收任务...')

// 前端表单数据
const tripForm = reactive({
  destination: '',
  days: 3,
  budget: 5000, 
  preference: 'fast'
})

// 结果与历史数据
const historyPlans = ref<any>([])
const mockPlan = ref<any>({}) 
let pollTimer: any = null

onMounted(() => {
  fetchHistory()
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

// ================= 1. 获取历史记录 =================
const fetchHistory = async () => {
  try {
    const res: any = await request.get('/api/agent/trip/plans', {
      params: { page: 1, size: 20 }
    })
    historyPlans.value = res.data || []
  } catch (error) {
    console.error('获取历史记录失败', error)
  }
}

// 辅助：日期格式化 (YYYY-MM-DD)
const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ================= 2. 核心 AI 规划 (Kafka 异步轮询) =================
const generateTrip = async () => {
  if (!tripForm.destination) {
    return ElMessage.warning('请输入目的地城市')
  }
  
  loading.value = true
  showResult.value = false
  loadingText.value = '正在将需求提交至消息队列...'

  // 推算日期
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + tripForm.days - 1) 

  try {
    // 步骤 A: 提交任务
    const submitRes: any = await request.post('/api/agent/trip/submit', {
      city: tripForm.destination,                
      start_date: formatDate(startDate),         
      end_date: formatDate(endDate),             
      budget: tripForm.budget, // 直接传数字                    
      preference: tripForm.preference,           
      accommodation: '', 
      transportation: '',
      user_input: '' 
    })

    const requestId = submitRes.data 
    if (!requestId) throw new Error('未能获取到任务队列排队号')

    // 步骤 B: 开启轮询
    loadingText.value = 'Agent 正在为您检索酒店、景点与天气信息...'
    
    pollTimer = setInterval(async () => {
      try {
        const queryRes: any = await request.get(`/api/agent/trip/query`, {
          params: { requestId: requestId }
        })
        
        const responseData = queryRes.data

        // 判断后端处理状态
        if (responseData.status === 'COMPLETED' || responseData.status === 'SUCCESS') { 
          clearInterval(pollTimer) 
          
          mockPlan.value = responseData.tripPlan 
          showResult.value = true
          loading.value = false
          ElMessage.success('🎉 您的专属行程已生成完毕！')
          
          fetchHistory() // 刷新抽屉列表
          
        } else if (responseData.status === 'FAILED' || responseData.status === 'ERROR') {
          clearInterval(pollTimer) 
          loading.value = false
          ElMessage.error(responseData.errorMessage || 'AI规划因网络或算法原因失败')
        }
        
      } catch (e) {
        clearInterval(pollTimer)
        loading.value = false
        ElMessage.error('查询生成进度时发生网络异常')
      }
    }, 3000) // 3秒轮询

  } catch (error: any) {
    loading.value = false
    ElMessage.error(error.message || '向服务器提交行程任务失败')
  }
}

// ================= 3. 加载历史记录 =================
const loadHistory = (item: any) => {
  tripForm.destination = item.city 
  tripForm.days = item.days ? item.days.length : 3
  tripForm.budget = item.budget || 5000 
  
  mockPlan.value = item 
  showResult.value = true
  ElMessage.info(`已加载 ${item.city} 的行程记录`)
  drawerVisible.value = false
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions h2 {
  margin: 0;
  color: #303133;
}

.form-card, .result-card {
  min-height: 550px;
  border-radius: 8px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-header h3 {
  margin: 0;
  color: #409EFF;
}

.plan-details pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 6px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  line-height: 1.6;
}

.history-item {
  cursor: pointer;
  transition: all 0.3s;
}

.history-item:hover {
  transform: translateY(-2px);
  border-color: #409EFF;
}
</style>

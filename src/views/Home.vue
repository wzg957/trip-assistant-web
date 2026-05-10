<template>
  <div class="home-container">
    <div class="header-actions">
      <h2 class="title">🌍 CitySync 智能旅程助手</h2>
      <el-button type="primary" :icon="FolderOpened" plain @click="drawerVisible = true">
        打开行程库
      </el-button>
    </div>

    <el-row :gutter="25">
      <el-col :span="8">
        <el-card class="form-card" shadow="always">
          <template #header>
            <div class="card-title">📝 规划参数配置</div>
          </template>

          <el-form :model="tripForm" label-position="top">
            <el-form-item label="📍 目的地城市" required>
              <el-input v-model="tripForm.city" placeholder="例如：广州、北京" clearable />
            </el-form-item>

            <el-form-item label="📅 游玩日期范围" required>
              <el-date-picker
                v-model="tripDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                :disabled-date="disabledPastDates"
              />
            </el-form-item>

            <el-form-item label="💰 预计总预算 (元)">
              <el-input-number
                v-model="tripForm.budget"
                :min="1"
                :step="500"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="🚀 旅行偏好">
              <el-select v-model="tripForm.preference" placeholder="请选择" style="width: 100%">
                <el-option label="深度体验 (Comprehensive)" value="comprehensive" />
                <el-option label="特种兵打卡 (Fast)" value="fast" />
                <el-option label="休闲度假 (Relaxed)" value="relaxed" />
              </el-select>
            </el-form-item>

            <el-button
              type="primary"
              class="generate-btn"
              @click="handleGenerate"
              :loading="loading"
            >
              {{ loading ? progressText : '✨ 唤醒 AI Agent 开始规划' }}
            </el-button>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="result-card" v-loading="loading" :element-loading-text="progressText">
          <div v-if="!showResult && !loading" class="empty-holder">
            <el-empty description="在左侧配置行程参数，AI 将通过 Kafka 队列异步处理您的请求" />
          </div>

          <div v-if="showResult" class="trip-display">
            <div class="result-header">
              <h3>{{ mockPlan.city }} 行程规划方案</h3>
              <div class="header-tags">
                <el-tag type="success">¥{{ mockPlan.budget?.total || mockPlan.budget }}</el-tag>
                <el-tag type="info" style="margin-left: 10px;">{{ mockPlan.start_date }} / {{ mockPlan.end_date }}</el-tag>
              </div>
            </div>

            <el-divider />

            <div class="content-scroll">
              <div class="info-item">
                <span class="label">💡 综合建议：</span>
                <span class="text">{{ mockPlan.overall_suggestions || '无' }}</span>
              </div>

              <div class="detail-section">
                <h4>📋 详细日程编排</h4>
                <div class="itinerary-box">
                  <div v-if="mockPlan.days && mockPlan.days.length > 0">
                    <div v-for="day in mockPlan.days" :key="day.day_index" style="margin-bottom: 30px; border-bottom: 1px dashed #ebeef5; padding-bottom: 20px;">

                      <h5 style="color: #409eff; font-size: 18px; margin-bottom: 12px; display: flex; align-items: center;">
                        <span style="background: #409eff; color: white; padding: 2px 8px; border-radius: 4px; margin-right: 10px; font-size: 14px;">Day {{ day.day_index + 1 }}</span>
                        {{ day.date }} - {{ day.description }}
                      </h5>

                      <div style="background: #fdf6ec; color: #e6a23c; padding: 10px 15px; border-radius: 6px; font-size: 14px; margin-bottom: 15px; border: 1px solid #faecd8; display: flex; align-items: center;">
                        <span style="font-size: 16px; margin-right: 8px;">🚕</span>
                        <strong>交通策略：</strong> <span style="margin-left: 5px; color: #606266;">{{ day.transportation || '建议视具体距离打车或公交' }}</span>
                      </div>

                      <div v-if="day.hotel" style="margin: 15px 0; display: flex; gap: 15px; background: #f4f4f5; padding: 12px; border-radius: 8px; border: 1px solid #e9e9eb;">
                        <el-image
                          v-if="day.hotel.image_url"
                          :src="day.hotel.image_url"
                          style="width: 90px; height: 90px; border-radius: 8px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                          fit="cover" lazy>
                          <template #error><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e9f2;color:#909399;font-size:12px;">暂无图片</div></template>
                        </el-image>
                        <div style="flex-grow: 1;">
                          <div style="font-weight: bold; font-size: 16px; color: #303133;">🏨 {{ day.hotel.name }}</div>
                          <div style="font-size: 13px; color: #606266; margin-top: 6px;">📍 {{ day.hotel.address }}</div>
                          <div style="font-size: 13px; color: #606266; margin-top: 4px;">{{ day.accommodation }}</div>
                          <div style="margin-top: 6px;"><el-tag size="small" type="success">预估 ¥{{ day.hotel.estimated_cost }}</el-tag></div>
                        </div>
                      </div>
                      <p v-else-if="day.accommodation" style="margin: 5px 0; color: #606266; font-size: 14px;"><strong>🏨 住宿建议：</strong>{{ day.accommodation }}</p>

                      <div v-if="day.attractions && day.attractions.length > 0" style="margin-top: 20px;">
                        <strong style="font-size: 15px; color: #303133;">🚩 景点安排：</strong>
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
                          <div v-for="(attr, index) in day.attractions" :key="index" style="display: flex; gap: 15px; background: #fff; border: 1px solid #ebeef5; padding: 12px; border-radius: 8px; transition: box-shadow 0.3s;" onmouseover="this.style.boxShadow='0 2px 12px 0 rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                            <el-image
                              v-if="attr.image_url"
                              :src="attr.image_url"
                              style="width: 90px; height: 90px; border-radius: 6px; flex-shrink: 0;"
                              fit="cover" lazy>
                              <template #error><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e9f2;color:#909399;font-size:12px;">暂无图片</div></template>
                            </el-image>
                            <div style="flex-grow: 1;">
                              <div style="font-weight: bold; font-size: 15px; color: #303133;">{{ attr.name }} <el-tag size="small" type="warning" style="margin-left: 8px;">游玩约 {{ attr.visit_duration }} 分钟</el-tag></div>
                              <div style="font-size: 13px; color: #606266; margin-top: 6px; line-height: 1.5;">{{ attr.description }}</div>
                              <div v-if="attr.estimated_cost" style="font-size: 13px; color: #909399; margin-top: 4px;">门票预估: ¥{{ attr.estimated_cost }}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="day.meals && day.meals.length > 0" style="margin-top: 20px;">
                        <strong style="font-size: 15px; color: #303133;">🍲 餐饮推荐：</strong>
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
                          <div v-for="(meal, index) in day.meals" :key="index" style="display: flex; gap: 15px; background: #fffcf5; border: 1px solid #faecd8; padding: 12px; border-radius: 8px;">
                            <el-image
                              v-if="meal.image_url"
                              :src="meal.image_url"
                              style="width: 80px; height: 80px; border-radius: 6px; flex-shrink: 0;"
                              fit="cover" lazy>
                              <template #error><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e9f2;color:#909399;font-size:12px;">暂无图片</div></template>
                            </el-image>
                            <div style="flex-grow: 1;">
                              <div style="font-weight: bold; font-size: 15px; color: #e6a23c;">
                                {{ meal.name }}
                                <span style="font-size: 13px; color: #909399; font-weight: normal; margin-left: 5px;">({{ meal.type === 'lunch' ? '午餐' : '晚餐' }})</span>
                              </div>
                              <div style="font-size: 13px; color: #606266; margin-top: 6px; line-height: 1.5;">{{ meal.description }}</div>
                              <div style="margin-top: 6px;"><el-tag size="small" type="danger" effect="plain">人均 ¥{{ meal.estimated_cost }}</el-tag></div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <pre v-else>{{ mockPlan.planDetails || '暂无排版详情' }}</pre>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="drawerVisible" title="📜 我的历史行程库" size="30%">
      <div v-if="historyList.length === 0" class="drawer-empty">
        <el-empty description="暂无历史行程记录" :image-size="100" />
      </div>
      <el-scrollbar v-else>
        <div
          v-for="plan in historyList"
          :key="plan.id"
          class="history-card"
          @click="loadHistoryPlan(plan)"
        >
          <div class="h-card-top">
            <span class="h-city">{{ plan.city }}</span>
            <span class="h-budget">¥{{ plan.budget?.total || plan.budget }}</span>
          </div>
          <div class="h-card-bottom">
            {{ plan.start_date }} 至 {{ plan.end_date }}
          </div>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { FolderOpened } from '@element-plus/icons-vue'
// 🌟 修复路径别名报错，直接使用相对路径
import request from '../utils/request'

// 1. 响应式状态定义
const loading = ref(false)
const showResult = ref(false)
const drawerVisible = ref(false)
const progressText = ref('正在请求后端接口...')

// 日期范围变量 [开始日期, 结束日期]
const tripDateRange = ref<[string, string]>(['', ''])

// 表单数据，严格对应 TripRequest.java
const tripForm = reactive({
  city: '',
  budget: 5000,
  preference: 'comprehensive'
})

// 结果数据与定时器
const historyList = ref<any[]>([])
const mockPlan = ref<any>({})
let pollTimer: any = null

// 2. 生命周期钩子
onMounted(() => fetchHistory())
onUnmounted(() => { if (pollTimer) clearInterval(pollTimer) })

// 禁止选择今天以前的日期
const disabledPastDates = (date: Date) => {
  return date.getTime() < Date.now() - 8.64e7
}

// 3. 接口逻辑：获取历史行程 (GET /api/agent/trip/plans)
const fetchHistory = async () => {
  try {
    const res: any = await request.get('/api/agent/trip/plans')
    historyList.value = res.data || []
  } catch (err) {
    console.error('无法同步历史记录')
  }
}

// 4. 核心功能：提交并轮询 (异步 Kafka 链路)
const handleGenerate = async () => {
  // 非空校验
  if (!tripForm.city) return ElMessage.warning('目的地城市不能为空')
  if (!tripDateRange.value || !tripDateRange.value[0]) return ElMessage.warning('请选择游玩日期范围')

  loading.value = true
  showResult.value = false
  progressText.value = '正在将任务提交至 Kafka 生产端...'

  try {
    // 步骤一：提交规划请求 (POST /api/agent/trip/submit)
    // 这里将 tripDateRange 的数组解构成 start_date 和 end_date 传给后端
    const submitRes: any = await request.post('/api/agent/trip/submit', {
      city: tripForm.city,
      start_date: tripDateRange.value[0],
      end_date: tripDateRange.value[1],
      budget: tripForm.budget,
      preference: tripForm.preference,
      accommodation: '', // 预留字段
      transportation: '', // 预留字段
      user_input: '' // 用户补充输入
    })

    const requestId = submitRes.data // 后端返回的任务 ID
    if (!requestId) throw new Error('任务 ID 获取失败')

    // 步骤二：开启轮询 (GET /api/agent/trip/query)
    progressText.value = '任务排队成功，AI 正在检索实时数据...'

    pollTimer = setInterval(async () => {
      try {
        const queryRes: any = await request.get('/api/agent/trip/query', {
          params: { requestId }
        })

        // 对应 TripPlanQueryResponse.java 的结构
        const responseData = queryRes.data

        if (responseData.status === 'COMPLETED' || responseData.status === 'SUCCESS') {
          clearInterval(pollTimer) // 停止轮询

          // 加上 || {}，确保就算拿不到数据，mockPlan 也是个空对象，模板渲染不会报 Cannot read properties of undefined
          const planData = responseData.tripPlan || {};
          const parsedPlan = Array.isArray(planData) ? (planData[0] || {}) : planData;

          mockPlan.value = parsedPlan;

          showResult.value = true
          loading.value = false
          ElMessage.success('🎉 AI 行程规划已完成！')
          fetchHistory() // 刷新历史列表
        } else if (responseData.status === 'FAILED' || responseData.status === 'ERROR') {
          clearInterval(pollTimer)
          loading.value = false
          ElMessage.error(responseData.errorMessage || 'AI 规划失败')
        }
        // 如果是 PROCESSING，不做处理，等待下一轮轮询
      } catch (e) {
        clearInterval(pollTimer)
        loading.value = false
      }
    }, 3000)

  } catch (err: any) {
    loading.value = false
    ElMessage.error(err.message || '后端连接异常')
  }
}

// 5. 加载历史行程到视图
const loadHistoryPlan = (plan: any) => {
  mockPlan.value = plan
  tripForm.city = plan.city

  // 💥 修复：兼容旧版数字和新版对象的取值方式
  tripForm.budget = plan.budget?.total || plan.budget || 5000

  tripDateRange.value = [plan.start_date, plan.end_date]
  showResult.value = true
  drawerVisible.value = false
  ElMessage.info(`已同步：${plan.city} 的历史行程`)
}
</script>

<style scoped>
.home-container { padding: 25px; background-color: #f5f7fa; min-height: 90vh; }
.header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.title { margin: 0; color: #2c3e50; font-size: 24px; }
.form-card { border-radius: 12px; min-height: 600px; }
.card-title { font-weight: bold; color: #409eff; }
.generate-btn { width: 100%; margin-top: 20px; height: 48px; font-size: 16px; }
.result-card { border-radius: 12px; min-height: 600px; }
.empty-holder { padding-top: 120px; }
.result-header { display: flex; justify-content: space-between; align-items: center; }
.content-scroll { margin-top: 15px; }
.info-item { margin-bottom: 12px; font-size: 15px; }
.label { font-weight: bold; color: #606266; }
.detail-section h4 { margin: 20px 0 10px; color: #303133; }
.itinerary-box { background: #fff; border: 1px solid #ebeef5; padding: 20px; border-radius: 8px; line-height: 1.8; }
.itinerary-box pre { white-space: pre-wrap; word-break: break-all; font-family: sans-serif; color: #444; }
.history-card { padding: 15px; border: 1px solid #dcdfe6; border-radius: 8px; margin-bottom: 12px; cursor: pointer; transition: 0.3s; }
.history-card:hover { border-color: #409eff; background-color: #ecf5ff; }
.h-card-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
.h-city { font-weight: bold; font-size: 16px; }
.h-budget { color: #f56c6c; font-weight: bold; }
.h-card-bottom { font-size: 13px; color: #909399; }
</style>

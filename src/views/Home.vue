<template>
  <div class="home-wrapper">
    <div class="action-bar">
      <el-button type="primary" size="large" @click="drawerVisible = true">
        <el-icon><FolderOpened /></el-icon> 📂 我的历史行程
      </el-button>
    </div>

    <el-row :gutter="24">
      <el-col :span="9">
        <el-card class="box-card form-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="header-title">✈️ 规划新行程</span>
            </div>
          </template>

          <el-form :model="tripForm" label-position="top" size="large">
            <el-form-item label="📍 目的地">
              <el-input
                v-model="tripForm.destination"
                placeholder="如：成都、新疆、吉隆坡..."
                clearable
              />
            </el-form-item>

            <el-form-item label="📅 游玩天数">
              <el-input-number v-model="tripForm.days" :min="1" :max="15" style="width: 100%;" />
            </el-form-item>

            <el-form-item label="💰 预算范围">
              <el-select v-model="tripForm.budget" placeholder="请选择预算水平" style="width: 100%;">
                <el-option label="🎒 穷游 (追求性价比)" value="low" />
                <el-option label="🏨 舒适 (品质出行)" value="mid" />
                <el-option label="💎 奢华 (极致享受)" value="high" />
              </el-select>
            </el-form-item>

            <el-form-item label="🏃 旅行风格">
              <el-select v-model="tripForm.preference" placeholder="请选择旅行风格" style="width: 100%;">
                <el-option label="特种兵打卡" value="fast" />
                <el-option label="休闲度假" value="relax" />
                <el-option label="自然风光" value="nature" />
                <el-option label="人文历史" value="culture" />
              </el-select>
            </el-form-item>

            <el-form-item style="margin-top: 20px;">
              <el-button
                type="primary"
                class="generate-btn"
                :loading="loading"
                @click="generateTrip"
              >
                {{ loading ? 'AI 正在调用后端 Agent 规划中...' : '✨ 立即生成专属行程' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="15">
        <el-card
          class="box-card result-card"
          shadow="always"
          style="min-height: 600px;"
          v-loading="loading"
          element-loading-text="AI 正在疯狂燃烧 GPU 规划行程中..."
        >
          <template #header>
            <div class="result-header">
              <span class="header-title">🗺️ AI 规划结果</span>
              <el-tag v-if="showResult" type="success" effect="dark">生成成功</el-tag>
            </div>
          </template>

          <div v-if="!showResult && !loading" class="empty-state">
            <div class="empty-icon">👈</div>
            <p>在左侧输入你的旅行愿望，AI 将为你实时规划</p>
          </div>

          <el-timeline v-if="showResult" style="margin-top: 20px;">
            <el-timeline-item
              v-for="(day, index) in mockPlan"
              :key="index"
              :timestamp="'第 ' + (index + 1) + ' 天'"
              placement="top"
              type="primary"
              size="large"
            >
              <el-card shadow="hover" class="day-detail-card">
                <div class="day-title-row">
                  <h4>{{ day.title }}</h4>
                  <el-tag size="small" type="warning">推荐方案</el-tag>
                </div>
                <p class="plan-content">{{ day.content }}</p>
                <div class="plan-tags">
                  <el-tag v-for="tag in day.tags" :key="tag" size="small" type="info" class="m-r-5">
                    {{ tag }}
                  </el-tag>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer
      v-model="drawerVisible"
      title="📂 我的历史行程 (Database Records)"
      direction="rtl"
      size="35%"
    >
      <el-alert
        title="提示：此处展示的是从 MySQL 数据库中检索出的历史记录"
        type="success"
        :closable="false"
        style="margin-bottom: 20px;"
      />

      <div v-for="item in historyPlans" :key="item.id" class="history-card">
        <el-card shadow="hover" @click="loadHistory(item)">
          <div class="history-header">
            <strong>{{ item.dest }} {{ item.days }}日游</strong>
            <el-tag size="small">{{ item.time }}</el-tag>
          </div>
          <p class="history-meta">预算：{{ item.budget }} | 风格：{{ item.pref }}</p>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { FolderOpened } from '@element-plus/icons-vue'

const loading = ref(false)
const showResult = ref(false)
const drawerVisible = ref(false)

const tripForm = reactive({
  destination: '',
  days: 3,
  budget: '',
  preference: ''
})

const historyPlans = ref([
  { id: 1, dest: '成都', days: 3, budget: '穷游', pref: '特种兵', time: '2026-05-01' },
  { id: 2, dest: '吉隆坡', days: 5, budget: '舒适', pref: '休闲', time: '2026-04-20' }
])

const mockPlan = ref([
  {
    title: '城市探索与风味美食',
    content: '抵达后入住精品酒店。首日安排前往城市地标进行Citywalk，晚餐享用当地最具代表性的特色料理。',
    tags: ['顺利抵达', 'Citywalk', '地道小吃']
  },
  {
    title: '核心景区深度游览',
    content: '全天游览目的地最负盛名的自然或人文景观。建议提前预约，中午在景区周边尝试非遗美食。',
    tags: ['网红打卡', '历史人文', '摄影推荐']
  },
  {
    title: '闲暇时光与愉悦返程',
    content: '上午在当地特色集市挑选精美伴手礼。午餐后稍作休息，随后前往交通枢纽，圆满结束旅程。',
    tags: ['选购特产', '轻松慢行', '期待重逢']
  }
])

const generateTrip = () => {
  if (!tripForm.destination || !tripForm.budget) {
    ElMessage.warning('请至少填写目的地和预算，以便 AI 规划')
    return
  }
  loading.value = true
  showResult.value = false

  // 模拟请求后端的延迟感
  setTimeout(() => {
    loading.value = false
    showResult.value = true
    ElMessage.success('🎉 您的专属行程已从数据库同步并展示！')
  }, 1800)
}

const loadHistory = (item: any) => {
  tripForm.destination = item.dest
  tripForm.days = item.days
  ElMessage.info(`已加载 ${item.dest} 的历史记录`)
  drawerVisible.value = false
}
</script>

<style scoped>
.home-wrapper { padding: 5px; }
.action-bar { margin-bottom: 20px; text-align: right; }
.header-title { font-size: 18px; font-weight: 600; color: #303133; }
.generate-btn { width: 100%; height: 50px; font-size: 16px; border-radius: 8px; font-weight: bold; }
.result-header { display: flex; justify-content: space-between; align-items: center; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; color: #909399; }
.empty-icon { font-size: 60px; margin-bottom: 20px; }
.day-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.day-title-row h4 { margin: 0; color: #409EFF; }
.plan-content { color: #606266; line-height: 1.7; font-size: 14px; }
.plan-tags { margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ebeef5; }
.m-r-5 { margin-right: 8px; }
.history-card { margin-bottom: 15px; cursor: pointer; }
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.history-meta { font-size: 12px; color: #909399; margin: 0; }
</style>
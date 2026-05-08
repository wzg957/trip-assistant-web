<template>
  <div class="profile-container">
    <el-card shadow="hover" class="group-overview">
      <template #header>
        <div class="card-header">
          <h3>👥 小组团队概况</h3>
          <el-tag type="success" effect="dark">CitySync 项目组</el-tag>
        </div>
      </template>
      <p class="intro-text">
        我们是华南师范大学数据科学与工程学院的课程项目攻坚小组。团队致力于将前沿的深度学习算法与现代 Web 框架相结合。
        我们的主打项目“CitySync”集成了智能旅行规划与同步能力，目前已完成核心功能迭代。
      </p>
    </el-card>

    <h3 style="margin: 30px 0 15px 0; color: #303133;">👨‍💻 核心成员</h3>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(member, index) in members" :key="index">
        <el-card shadow="always" class="member-card">
          <el-avatar :size="90" :src="member.avatar" style="font-size: 30px; background: #ecf5ff; color: #409EFF;">
            {{ member.name.charAt(0) }}
          </el-avatar>
          <h3 class="member-name">{{ member.name }} <el-tag size="small" type="danger" v-if="member.isLeader">组长</el-tag></h3>
          <p class="member-role">{{ member.role }}</p>
          <el-divider border-style="dashed" />
          <el-button type="primary" plain round class="profile-btn" @click="openProfile(member)">
            查看个人简介主页
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="`${selectedMember.name} 的个人主页`" width="50%" destroy-on-close>
      <div class="profile-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="姓名" label-align="center">{{ selectedMember.name }}</el-descriptions-item>
          <el-descriptions-item label="项目职责" label-align="center">{{ selectedMember.role }}</el-descriptions-item>
          <el-descriptions-item label="学术/技术背景" label-align="center">
            <el-tag v-for="tag in selectedMember.tags" :key="tag" style="margin-right: 8px;">{{ tag }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="详细介绍" label-align="center">
            {{ selectedMember.bio }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" type="primary">关闭主页</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
const selectedMember = ref<any>({})

const members = ref([
  {
    name: '汪泽高',
    isLeader: true,
    role: '全栈架构师 & 前端应用主导',
    tags: ['Vue 3 / TS', 'Element Plus', '专业排名 1/92'],
    bio: '负责打造丝滑响应的现代前端交互体验。采用 Vue 3、TypeScript 与 Vite 构建了高性能的 Web 管理后台，利用路由守卫与 Session 机制实现了严格的权限管控；同时主导核心算法集成，完美打通了从视觉感知到 AI 智能规划的全栈数据链路。'
  },
  {
    name: '李子杰',
    isLeader: false,
    role: '后端 API 开发 & 数据库管控',
    tags: ['Java/Spring Boot', 'MySQL', 'Kafka'],
    bio: '负责构建坚如磐石的后端服务，设计了高可用的异步消息队列系统，保障了 AI 行程规划的高效运转。'
  },
  {
    name: '姚涵芳',
    isLeader: false,
    role: '系统测试 & 质量保证 (QA)',
    tags: ['自动化测试', '性能压测', '全链路排查'],
    bio: '负责全栈系统的质量把控与全链路测试验证。主导制定了严密的测试计划与用例，涵盖前端交互验收、后端 API 并发压测以及 AI 规划算法的准确性校验。通过细致的漏洞排查与性能调优反馈，为项目的高可用交付保驾护航。'
  },
  {
    name: '黄思睿',
    isLeader: false,
    role: '文档专家 & 视觉设计负责人',
    tags: ['需求建模', 'UI/UX 设计', '技术标准'],
    bio: '负责撰写《项目需求分析报告》与《项目设计报告》。在设计报告中深度拆解了系统页面架构、采用的技术方法（如组件化开发与拦截器机制）以及核心代码逻辑说明。同时主导汇报 PPT 的视觉呈现与成员分工梳理，确保项目成果的专业化展示与引用来源的规范性。'
  },
  {
    name: '吴炜斌',
    isLeader: false,
    role: '项目汇报人 & 产品推介专员',
    tags: ['路演汇报', '成果展示', '演讲表达'],
    bio: '负责课程项目的最终现场汇报与系统演练。精准把控项目核心卖点，将 CitySync 的技术优势与实际应用价值转化为极具感染力的汇报演讲。通过逻辑严密的语言表达与实时操作展示，全方位呈现小组的协作精神、开发历程以及最终的项目产出。'
  }
])

const openProfile = (member: any) => {
  selectedMember.value = member
  dialogVisible.value = true
}
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-header h3 { margin: 0; }
.intro-text { line-height: 1.8; color: #606266; font-size: 15px; }
.member-card { text-align: center; border-radius: 12px; transition: transform 0.3s; }
.member-card:hover { transform: translateY(-5px); }
.member-name { margin: 15px 0 5px 0; color: #303133; }
.member-role { color: #909399; font-size: 14px; margin-bottom: 15px; }
.profile-btn { width: 100%; }
.profile-detail { padding: 10px 20px; }
</style>
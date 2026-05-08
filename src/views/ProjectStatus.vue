<template>
  <div class="status-container">
    <el-card shadow="never" class="timeline-card">
      <template #header>
        <div class="card-header">
          <h3>🚀 课程项目进展及规划</h3>
        </div>
      </template>

      <div class="timeline-wrapper">
        <el-timeline>
          <el-timeline-item
            timestamp="2026年3月 - 项目启动"
            placement="top"
            type="info"
            size="large"
          >
            <el-card shadow="hover">
              <h4>需求分析与数据准备</h4>
              <p class="timeline-desc">
                确立 CitySync 项目愿景，开始筹备前期工作。期间针对无人机视角下的小目标检测难点，完成了 VisDrone 数据集的全面调研与预处理。
              </p>
            </el-card>
          </el-timeline-item>

          <el-timeline-item
            timestamp="2026年4月 - 核心攻坚"
            placement="top"
            type="primary"
            size="large"
          >
            <el-card shadow="hover">
              <h4>核心算法与后端搭建</h4>
              <p class="timeline-desc">
                基于改进的 DETR 架构完成了小目标检测模型训练，进入学术成果梳理阶段。同步完成了 Java 后端基础设施（MySQL, Redis, Kafka）的容器化部署与接口设计。
              </p>
            </el-card>
          </el-timeline-item>

          <el-timeline-item
            timestamp="2026年5月 - 全栈集成"
            placement="top"
            color="#67C23A"
            size="large"
          >
            <el-card shadow="hover" style="border-left: 4px solid #67C23A;">
              <h4 style="color: #67C23A;">系统前端与业务联调 (当前阶段)</h4>
              <p class="timeline-desc">
                全面开展 Web 应用的开发。严格按照课程要求，实现了安全的 Session 身份校验、拦截器机制，并落地了 AI 行程规划的交互界面与历史记录模块。
              </p>
            </el-card>
          </el-timeline-item>

          <el-timeline-item
            timestamp="2026年6月 - 验收冲刺"
            placement="top"
            type="warning"
            size="large"
          >
            <el-card shadow="hover">
              <h4>系统部署与汇报总结</h4>
              <p class="timeline-desc">
                计划完成前后端生产环境部署（Nginx反向代理）。进行全链路压力测试，并准备项目答辩所需的演示视频与最终技术文档报告。
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.status-container { max-width: 900px; margin: 0 auto; }
.card-header h3 { margin: 0; color: #303133; }
.timeline-wrapper { padding: 20px 10px; }
.timeline-card { border-radius: 12px; }
.timeline-desc { color: #606266; line-height: 1.6; font-size: 14px; margin-top: 10px; }
h4 { margin: 0; font-size: 16px; color: #303133; }
</style>
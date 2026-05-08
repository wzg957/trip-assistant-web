cat << 'EOF' > README.md
# 🌍 CitySync - AI 智能旅行助手

![Vue.js](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-409EFF?style=for-the-badge&logo=elementplus&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)

本项目是**华南师范大学数据科学与工程学院**的期末课程设计作品。CitySync 致力于利用前沿的 Web 技术与 AI 算法，解决城市同步与智能旅行定制规划问题。

## ✨ 核心功能亮点

- **🤖 AI 智能规划引擎**：输入目的地、预算与偏好，系统将调用后端多 Agent 实时生成专属的定制化旅行时间轴。
- **🔐 严密的权限管控**：前端利用 Vue Router 路由守卫与 SessionStorage 实现会话级鉴权，注销即销毁凭证。
- **📊 响应式团队概览**：集成课程项目进展时间轴与五位小组成员的动态简介弹窗。
- **📂 数据持久化展示**：对接后端接口，支持历史行程的云端读取与管理展示。

## 🛠️ 技术栈架构

### 前端工程 (本仓库)
- **框架**：Vue 3 (Composition API) + TypeScript
- **构建**：Vite + Element Plus
- **鉴权**：SessionStorage + 路由拦截器

### 后端支撑 (Spring Boot 端)
- **核心**：Spring Boot 3.x + Mybatis Plus
- **存储**：MySQL 8.0 + Redis (缓存)
- **消息**：Kafka (用于异步处理 Agent 任务)
- **算法**：Python FastAPI (集成改进的 DETR 目标检测与行程规划 Agent)

## 🚀 快速启动与部署指南

### 1. 本地开发启动 (Dev)
```bash
# 安装依赖
npm install
npm install @element-plus/icons-vue

# 启动预览
npm run dev
```
> **🚪 开发者测试后门**：
> - **测试账号**：`admin@citysync.com`
> - **验证码**：`123456`
> - *(注：使用后门账号可绕过后端服务直接进入主界面预览 UI 交互)*

### 2. 生产环境部署 (Nginx)
本项目采用前后端分离架构，前端编译后可通过 Nginx 独立部署：
1. 在项目根目录执行 `npm run build`，生成 `dist` 静态资源目录。
2. 将 `dist` 目录下的所有文件复制到 Nginx 的 `html` 文件夹中。
3. 配置 `nginx.conf`，核心要求如下：
   - **单页应用防刷新 404**：需配置 `try_files $uri $uri/ /index.html;`
   - **接口反向代理**：需配置 `location /api/ { proxy_pass http://localhost:8080/api/; }` 拦截前端网络请求并转发至 Spring Boot 后端端口。
4. 启动 Nginx 服务，浏览器访问对应 IP 即可运行。

### 3. 后端环境要求 (Server)
- **运行环境**：JDK 17+
- **Docker 容器**：需运行 MySQL、Redis 和 Kafka 镜像。
- **Python 环境**：Python 3.9+，需安装 `requirements.txt` 中的依赖。

## 👨‍💻 团队成员与分工

- **汪泽高**：全栈架构师 & 前端应用主导。负责打造系统交互体验、Session 鉴权逻辑、反向代理部署及 AI 算法链路集成。
- **李子杰**：后端 API 开发 & 数据库管控。负责构建 Spring Boot 服务与异步消息队列系统。
- **姚涵芳**：系统测试 & 质量保证 (QA)。负责全栈系统的质量把控与全链路压测验证。
- **黄思睿**：文档专家 & 视觉设计负责人。负责撰写《需求分析报告》、《设计报告》及项目 UI/UX 架构。
- **吴炜斌**：项目汇报人 & 产品推介专员。负责课程项目的路演汇报、成果展示与系统演练。

---
*© 2026 CitySync 项目组 版权所有.*
EOF

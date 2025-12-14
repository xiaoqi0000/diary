# 个人日记应用 - Vue + Nest.js 全栈项目

一个使用 Vue 3 + Nest.js 构建的现代个人日记管理系统，支持创建、编辑、删除和搜索日记条目，具备情绪追踪和标签分类功能。

## 🚀 项目特性

### 功能特性
- ✅ **日记管理** - 创建、编辑、删除、查看日记
- ✅ **搜索功能** - 按标题和内容搜索日记
- ✅ **情绪追踪** - 记录每天的心情状态
- ✅ **标签系统** - 为日记添加自定义标签
- ✅ **日期范围查询** - 按时间段筛选日记
- ✅ **按情绪筛选** - 查看特定心情的日记
- ✅ **隐私设置** - 设置日记为私密或公开
- ✅ **数据持久化** - 使用 lowdb 数据库存储

### 技术特性
- 🎯 **TypeScript** - 全栈类型安全
- 🎨 **现代化 UI** - 基于 Vue 3 + Composition API
- 🛡️ **CORS 支持** - 前后端跨域配置
- 📊 **RESTful API** - 标准化的接口设计
- 💾 **JSON 数据库** - 轻量级数据存储方案

## 📁 项目结构

```
diary-app/
├── vue-diary/                    # Vue 前端项目
│   ├── src/
│   │   ├── components/          # Vue 组件
│   │   ├── views/              # 页面视图
│   │   ├── stores/             # Pinia 状态管理
│   │   ├── services/           # API 服务
│   │   └── utils/              # 工具函数
│   ├── public/                 # 静态资源
│   ├── package.json
│   └── vite.config.ts
│
└── my-nest-app/                 # Nest.js 后端项目
    ├── src/
    │   ├── app.module.ts       # 应用主模块
    │   ├── main.ts             # 应用入口
    │   ├── api/                # API 控制器
    │   ├── diaries/            # 日记模块
    │   ├── database/           # 数据库模块
    │   └── common/             # 公共模块
    ├── diaries.json            # 数据库文件（自动生成）
    ├── package.json
    └── tsconfig.json
```

## 🛠️ 技术栈

### 前端技术
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由
- **Axios** - HTTP 请求库
- **CSS3** - 现代样式特性

### 后端技术
- **Nest.js** - Node.js 企业级框架
- **TypeScript** - 类型安全的 JavaScript
- **lowdb** - 轻量级 JSON 数据库
- **Express** - Node.js Web 框架
- **CORS** - 跨域资源共享

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装步骤

#### 1. 克隆项目
```bash
git clone [your-repository-url]
cd diary-app
```

#### 2. 安装后端依赖
```bash
cd my-nest-app
npm install
```

#### 3. 启动后端服务
```bash
npm run start:dev
```
后端服务将运行在 `http://localhost:3000`

#### 4. 安装前端依赖
```bash
cd ../vue-diary
npm install
```

#### 5. 启动前端服务
```bash
npm run dev
```
前端应用将运行在 `http://localhost:5173`（或其他可用端口）

## 📖 API 文档

### 基础信息
- **Base URL**: `http://localhost:3000/api`
- **数据格式**: JSON
- **认证**: 暂无（后续可扩展）

### 日记接口

#### 获取所有日记
```http
GET /api/diaries
```

**响应示例**:
```json
[
  {
    "id": "mj59xmbn4v5jz68cj33",
    "title": "今天的心情",
    "content": "今天天气很好，心情也很不错",
    "date": "2025-12-14",
    "mood": "happy",
    "tags": ["天气", "心情"],
    "isPrivate": false,
    "createdAt": "2025-12-14T05:18:10.499Z",
    "updatedAt": "2025-12-14T05:18:10.499Z"
  }
]
```

#### 创建日记
```http
POST /api/diaries
Content-Type: application/json

{
  "title": "日记标题",
  "content": "日记内容",
  "date": "2025-12-14",
  "mood": "happy",
  "tags": ["标签1", "标签2"],
  "isPrivate": false
}
```

#### 获取单个日记
```http
GET /api/diaries/{id}
```

#### 更新日记
```http
PATCH /api/diaries/{id}
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

#### 删除日记
```http
DELETE /api/diaries/{id}
```

### 搜索接口

#### 搜索日记
```http
GET /api/diaries/search?q=关键词
```

#### 按日期范围查询
```http
GET /api/diaries/date-range?start=2025-12-01&end=2025-12-31
```

#### 按情绪筛选
```http
GET /api/diaries/mood/happy
```

## 💾 数据库说明

### 数据库结构
项目使用 **lowdb** 作为数据库，数据以 JSON 格式存储在 `diaries.json` 文件中：

```json
{
  "diaries": [
    {
      "id": "唯一标识符",
      "title": "日记标题",
      "content": "日记内容",
      "date": "日期 (YYYY-MM-DD)",
      "mood": "心情状态",
      "tags": ["标签1", "标签2"],
      "isPrivate": "是否私密",
      "createdAt": "创建时间",
      "updatedAt": "更新时间"
    }
  ]
}
```

### 数据特性
- **自动生成**: 首次运行时自动创建数据库文件
- **数据持久化**: 所有数据保存在本地 JSON 文件中
- **轻量级**: 无需额外数据库服务
- **易于备份**: 直接复制 JSON 文件即可备份数据

## 🎨 前端组件说明

### 主要组件

#### DiaryList.vue
- **功能**: 日记列表展示
- **特性**: 支持分页、搜索、筛选

#### DiaryItem.vue
- **功能**: 单个日记条目展示
- **特性**: 支持展开/收起内容

#### DiaryForm.vue
- **功能**: 日记创建/编辑表单
- **特性**: 表单验证、情绪选择、标签管理

#### SearchBar.vue
- **功能**: 搜索和筛选工具
- **特性**: 关键词搜索、日期筛选、情绪筛选

#### MoodSelector.vue
- **功能**: 情绪选择器
- **特性**: 可视化情绪选择

### 状态管理 (Pinia)

#### useDiaryStore
```typescript
// 日记相关状态
const diaryStore = useDiaryStore()

// 获取所有日记
await diaryStore.fetchDiaries()

// 创建日记
await diaryStore.createDiary(diaryData)

// 更新日记
await diaryStore.updateDiary(id, updateData)

// 删除日记
await diaryStore.deleteDiary(id)

// 搜索日记
await diaryStore.searchDiaries(query)
```

## 🔧 开发指南

### 前端开发

#### 添加新的情绪类型
1. 编辑 `src/components/MoodSelector.vue`
2. 在 `moodOptions` 中添加新的情绪选项
3. 更新对应的样式和图标

#### 自定义样式
- 全局样式: `src/assets/main.css`
- 组件样式: 使用 scoped CSS
- 主题变量: CSS 自定义属性

#### API 调用
```typescript
// 使用 axios 实例
import api from '@/services/api'

// GET 请求
const response = await api.get('/diaries')

// POST 请求
const response = await api.post('/diaries', data)

// PUT/PATCH 请求
const response = await api.patch(`/diaries/${id}`, data)

// DELETE 请求
const response = await api.delete(`/diaries/${id}`)
```

### 后端开发

#### 添加新的 API 端点
1. 在相应的控制器中添加方法
2. 在服务中实现业务逻辑
3. 添加 DTO 进行数据验证
4. 更新路由映射

#### 自定义验证
```typescript
// DTO 示例
import { IsString, IsOptional, IsArray } from 'class-validator'

export class CreateDiaryDto {
  @IsString()
  title: string

  @IsString()
  content: string

  @IsOptional()
  @IsString()
  mood?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]
}
```

#### 数据库操作
```typescript
// 数据库服务使用示例
constructor(private databaseService: DatabaseService) {}

// 创建记录
const diary = await this.databaseService.create(data)

// 查询所有记录
const diaries = await this.databaseService.findAll()

// 根据 ID 查询
const diary = await this.databaseService.findById(id)

// 更新记录
const diary = await this.databaseService.update(id, updateData)

// 删除记录
const success = await this.databaseService.delete(id)
```

## 🧪 测试

### 前端测试
```bash
cd vue-diary
npm run test          # 运行单元测试
npm run test:e2e      # 运行端到端测试
npm run test:coverage # 生成测试覆盖率报告
```

### 后端测试
```bash
cd my-nest-app
npm run test          # 运行单元测试
npm run test:e2e      # 运行端到端测试
npm run test:cov      # 生成测试覆盖率报告
```

### API 测试
使用 curl 或 Postman 测试 API：

```bash
# 测试获取所有日记
curl http://localhost:3000/api/diaries

# 测试创建日记
curl -X POST http://localhost:3000/api/diaries \
  -H "Content-Type: application/json" \
  -d '{"title":"测试日记","content":"测试内容","mood":"happy"}'
```

## 📦 部署

### 前端部署

#### 构建生产版本
```bash
cd vue-diary
npm run build
```

#### 部署到静态服务器
将 `dist` 目录部署到任何静态文件服务器（Nginx、Apache、Vercel 等）。

### 后端部署

#### 构建生产版本
```bash
cd my-nest-app
npm run build
npm run start:prod
```

#### 使用 PM2 部署
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start dist/main.js --name diary-api

# 查看状态
pm2 status

# 查看日志
pm2 logs diary-api
```

#### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 🔒 安全考虑

### 当前实现
- ✅ CORS 配置
- ✅ 输入验证
- ✅ 错误处理

### 可扩展的安全特性
- 🔐 JWT 身份认证
- 🛡️ 请求频率限制
- 🔒 数据加密
- 📝 操作日志记录
- 🚫 SQL 注入防护（虽然使用 JSON 数据库）

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 Vue 和 Nest.js 的最佳实践
- 编写清晰的注释和文档
- 保持代码格式一致

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 邮箱: [1991678106@qq.com]

## 🙏 致谢

感谢以下开源项目：
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Nest.js](https://nestjs.com/) - Node.js 企业级框架
- [lowdb](https://github.com/typicode/lowdb) - 轻量级 JSON 数据库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**
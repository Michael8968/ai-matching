# AI智能匹配平台

基于 Next.js + React + TypeScript + TailwindCSS + ShadCN 构建的智能匹配平台。

## 功能特性

- 🎨 现代化UI设计，基于ShadCN组件库
- 🔐 多角色认证系统（管理员、供应商、用户、创作者）
- 🤖 AI购物助手，智能推荐商品
- 📋 需求池管理，支持需求发布和AI匹配
- 🏢 供应商中心，产品和服务管理
- 📱 响应式设计，支持移动端

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI库**: React 18 + TypeScript
- **样式**: TailwindCSS + ShadCN UI
- **状态管理**: Zustand
- **图标**: Lucide React
- **字体**: Space Grotesk (标题) + Inter (正文)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── page.tsx           # AI购物助手首页
│   ├── login/             # 登录页面
│   ├── demand-pool/       # 需求池页面
│   └── suppliers/         # 供应商中心页面
├── components/            # React 组件
│   ├── app-layout.tsx     # 应用主布局
│   └── ui/               # ShadCN UI 组件
├── store/                # Zustand 状态管理
│   └── auth.ts           # 认证状态
└── lib/                  # 工具函数
    └── utils.ts          # 通用工具
```

## 角色权限

### 管理员 (admin)
- 访问所有页面
- 管理需求池
- 查看供应商信息
- 使用AI推荐功能

### 供应商 (supplier)
- 访问AI购物助手
- 管理自己的产品和服务
- 查看需求池（只读）

### 用户 (user)
- 使用AI购物助手
- 发布需求

### 创作者 (creator)
- 使用AI购物助手
- 提供创意服务

## 主要功能

### AI购物助手
- 智能对话界面
- 图片上传支持
- 用户画像分析
- 商品推荐展示

### 需求池
- 需求发布和管理
- 批量操作支持
- AI智能匹配推荐
- 状态跟踪

### 供应商中心
- 公司信息管理
- 产品/服务管理
- 补充字段自定义
- 批量数据处理

## 设计系统

### 色彩系统
- 主色调: `hsl(212 98% 73%)` - 蓝色
- 背景色: `hsl(216 100% 96%)` - 浅蓝
- 强调色: `hsl(275 43% 77%)` - 紫色
- 卡片色: `hsl(216 100% 98%)` - 白色

### 字体系统
- 标题字体: Space Grotesk
- 正文字体: Inter

## 开发说明

这是一个静态演示项目，所有功能都是前端模拟实现：

- 认证状态保存在 localStorage
- AI功能使用模拟数据
- 数据操作仅更新本地状态
- 无需后端服务即可运行

## 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 许可证

MIT License

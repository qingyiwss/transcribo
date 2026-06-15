# Transcribo

AI 驱动的音频转文字服务。上传音频文件，自动转录为文本，支持多语言。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **后端 API**: Next.js Route Handlers
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **支付**: Stripe
- **语音识别**: OpenAI-compatible ASR API
- **样式**: Tailwind CSS v4

## 功能特性

- 用户注册/登录（Supabase Auth）
- 音频文件上传与转录
- 转录历史记录仪表盘
- Stripe 支付集成（按量计费）
- 新用户赠送 5 分钟免费额度

## 快速开始

### 前置要求

- Node.js 18+
- Supabase 项目（[supabase.com](https://supabase.com)）
- Stripe 账号（[stripe.com](https://stripe.com)）
- OpenAI-compatible ASR API 端点

### 1. 克隆项目

```bash
git clone <repo-url>
cd transcribo
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板并填入真实值：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入以下变量：

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |
| `STRIPE_SECRET_KEY` | Stripe 密钥（服务端） |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 可发布密钥（客户端） |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 签名密钥 |
| `NEXT_PUBLIC_APP_URL` | 应用地址，默认 `http://localhost:3000` |
| `TRANSCRIPTION_API_URL` | ASR 转录 API 端点 |

### 4. 执行数据库迁移

在 Supabase 控制台的 **SQL Editor** 中，执行迁移文件：

```sql
-- 打开 supabase/migrations/001_init.sql
-- 将全部 SQL 粘贴到 Supabase SQL Editor 中执行
```

或者使用 Supabase CLI：

```bash
npx supabase db push
```

### 5. 配置 Stripe Webhook

1. 在 Stripe Dashboard 中创建 Webhook Endpoint
2. Endpoint URL: `https://你的域名/api/stripe/webhook`
3. 监听事件: `checkout.session.completed`
4. 获取 Webhook Signing Secret 填入 `.env.local`

### 6. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

### 7. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
transcribo/
├── src/
│   ├── app/                    # Next.js App Router 页面与 API
│   │   ├── api/
│   │   │   ├── stripe/         # Stripe checkout & webhook
│   │   │   └── transcribe/     # 转录 API
│   │   ├── auth/               # 登录/注册/回调
│   │   ├── dashboard/          # 用户仪表盘
│   │   ├── pricing/            # 定价页面
│   │   ├── transcribe/         # 转录详情
│   │   └── upload/             # 上传页面
│   ├── components/             # React 组件
│   └── lib/
│       ├── supabase/           # Supabase 客户端
│       └── types.ts            # TypeScript 类型定义
├── supabase/
│   └── migrations/             # 数据库迁移文件
└── package.json
```

## 许可

MIT

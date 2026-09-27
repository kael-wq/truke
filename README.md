# 换换 SwapSwap · 闲置物品交换小程序

Tinder 的交互，但换的是「闲置物品」而不是人。Taro 3.x + React + TypeScript + Zustand + 微信云开发。

> 核心定位：**物品优先** —— 用户头像永远用 emoji，绝不上传真实照片；每张卡片常驻展示「想换」愿望；距离常驻可见，主打同城交换。

---

## 技术栈

- **框架**：Taro 3.6（React 18 + TypeScript + Webpack5）
- **UI 库**：NutUI React Taro 2.7（`@nutui/nutui-react-taro`）
- **状态**：Zustand
- **样式**：SCSS（自有样式全用 rpx；`designWidth=375` 以适配 NutUI）
- **后端**：微信云开发（云函数 + 云数据库 + 云存储）
- **动画**：CSS transition / keyframes + Taro 触摸事件

## 目录结构

```
├── config/                 # Taro 构建配置
├── cloudfunctions/         # 云函数（9个）
│   ├── login               # 静默登录拿 openid
│   ├── saveItem            # 发布物品（置顶扣5币）
│   ├── getCards            # 拉取滑动卡片（置顶/Boost 优先）
│   ├── onSwipe             # 记录滑动 + 双向匹配判定
│   ├── recharge            # 换换币充值（演示直接到账）
│   ├── getMyItems          # 我的发布
│   ├── subscribeMember     # 开通会员
│   ├── getTransactions     # 币交易流水
│   └── matchJob            # 异步愿望单匹配（定时触发器）
└── src/
    ├── app.tsx / app.config.ts / app.scss
    ├── types.ts            # 全局类型
    ├── components/         # SwipeCard / CardStack / ActionButtons
    │                       # MatchModal / CoinPayModal / MemberBanner
    │                       # CategoryTabs / TabBar
    ├── pages/              # index / publish / wishlist / messages
    │                       # chat / profile / coins / membership / match
    ├── stores/             # useUserStore / useCoinStore / useCardStore
    ├── services/           # cloud / match / payment / mock
    └── utils/gesture.ts    # 滑动手势计算
```

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 编译微信小程序（开发模式 watch）
npm run dev:weapp

# 3. 打开微信开发者工具
#    导入项目根目录（会自动读取 project.config.json）
#    miniprogramRoot 指向 dist/
```

### 配置云开发

1. 微信开发者工具 → 云开发 → 开通并创建环境，复制环境 ID
2. 修改 `src/app.tsx` 里的 `env: 'swapswap-xxxxxx'`
3. 修改 `project.config.json` 的 `appid` 为你的小程序 AppID（`touristappid` 无法用云开发）
4. 右键 `cloudfunctions` 下每个函数 → 上传并部署（云端安装依赖）
5. `matchJob` 需在云开发控制台确认定时触发器

### 不使用云开发？

代码已内置 mock 兜底：`getCards` / `onSwipe` / 充值 / 会员 / 登录在云环境不可用时自动回退到演示数据，UI 可完整跑通。

## 核心交互

- **右滑 = 想换**（绿色「想换!」印章），**左滑 = 算了**（橙色「算了」印章）
- 拖动 > 60px 显示反馈，释放 > 100px 飞出，否则回弹
- 底部操作栏：↩ 回退 · ✕ 算了 · ⇄ 想换（长按 = 超级想换）· ♡ 收藏 · ⚡ Boost
- 匹配弹窗：双方互相想换 → 「匹配成功!」+ 双方物品 + 去聊聊/继续浏览

## 付费体系

| 功能 | 消耗 | 效果 |
|------|------|------|
| ⚡ Boost 曝光 | 1 币 | 卡片置顶 30 分钟 |
| 👑 超级想换 | 3 币 | 对方优先看到你 |
| ↩ 回退 | 1 币（会员免费） | 撤回上一张 |
| 📌 置顶发布 | 5 币 | 分类信息流置顶 7 天 |
| 👑 换换会员 | ¥18/月 | 5次Boost + 看谁想换你 + 无限回退 + 标识 |

余额不足流程：点击付费动作 → 余额 pill 摇一摇 → 自动弹出充值弹窗 → 充值成功后自动重试原动作。

## 设计规范

- 背景 `#F5F0E8` · 卡片 `#FFFDF7` · 主色 `#E8572A` · 绿 `#3DB87A` · 蓝 `#4A90D9` · 紫 `#9B6BDF` · 金 `#D4A843`
- 圆角 40rpx（20px）· 暖色软阴影 · 背景噪点纹理（`grain-overlay`）

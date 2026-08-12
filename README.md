# CryptoPay React Native

企业数字资产支付客户端演示工程，基于 React Native 0.87、React 19.2 和 TypeScript 6，覆盖 iOS、Android 与 Web。它完整复刻 Flutter 版本的产品功能，并使用 React Native 新架构、Hermes V1 和 Strict TypeScript API。

在线 Web 演示：<https://dj49846917.github.io/react-native-pay-demo/>

> 当前为 Mock 演示。真实身份认证、短信、验证码、KYC/KYB、KYT/AML、报价、账本、托管签名、审批执行和链上广播必须由合规后端负责。不要在客户端保存生产私钥。

## 技术栈

| 分类 | 技术 | 用途 |
|---|---|---|
| 框架 | React Native 0.87、React 19.2、TypeScript 6 | iOS/Android 共享业务代码 |
| Web | React Native Web 0.21、Vite 8 | 浏览器适配与 GitHub Pages 静态部署 |
| 运行时 | Hermes V1、React Native New Architecture | JavaScript 执行、Fabric 与 TurboModules |
| 导航 | React Navigation 7 | 原生栈、底部标签和详情路由 |
| 状态 | Zustand 5 + AsyncStorage 3 | 应用状态和本地演示数据持久化 |
| 表单 | React Hook Form 7 + Zod 4 | 表单状态、校验和类型推导 |
| UI | React Native StyleSheet、Lucide Icons、SVG | Design Tokens、图标和二维码演示 |
| 动画 | Reanimated 4.6 nightly + Worklets 0.12 | RN 0.87 兼容的 UI/Storybook 动画运行时 |
| 组件目录 | Storybook React Native 10 | 共享组件隔离预览 |
| 测试 | Jest 29、React Test Renderer、Testing Library | 渲染与业务状态测试 |
| iOS | Xcode 26、CocoaPods 1.17 | 模拟器、真机和归档发布 |
| Android | AGP 9、Kotlin 2.2、SDK 37、Gradle | 模拟器、真机和 AAB 发布 |

## 已实现功能

- 账号密码、手机号验证码、注册和忘记密码。
- 登录前 3×3 图形选择验证；选对全部比特币符号后才能进入。
- 首页资产估值、流入流出、交易统计、资产列表和最近交易。
- 通知中心、未读计数和全部已读。
- 交易筛选、详情、处理时间线和 CSV/PDF 导出演示。
- 充值地址、网络选择和二维码；提现、换币询价、Invoice、法币出金和批量付款。
- 资金表单校验、二次确认、成功结果和交易记录联动。
- 审批筛选、详情、批准/拒绝和待处理状态更新。
- 活动中心、任务进度和奖励。
- 企业资料/KYB、团队角色、银行账户、地址簿、2FA、恢复代码、生物识别、设备、限额策略、通知、帮助和法律条款。
- Zustand + AsyncStorage 持久化演示状态。
- Storybook 共享组件用例。

演示凭据：

- 账号密码：任意合法邮箱和至少 8 位密码。
- 手机号：任意 6–15 位号码。
- 短信验证码：`246810`。
- 图形验证：选择第 1、5、8 个比特币图块。

## 快速启动

```bash
cd /Users/dujiang/Desktop/bps/react-native
npm ci
```

工程中的 `.npmrc` 已启用 `legacy-peer-deps`：Storybook 10.5 当前仍把 Reanimated peer 固定为 4.5.1，而 RN 0.87 需要已声明兼容 0.87 的 4.6 nightly。依赖已由 `package-lock.json` 精确锁定；请使用 `npm ci` 保持团队与 CI 一致。

iOS：

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

Android：

```bash
emulator -avd Medium_Phone_API_36.1
npm run android
```

Web：

```bash
npm run web
# 生产构建与预览
npm run build:web
npm run web:preview
```

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动检查、构建并发布到 GitHub Pages。

Metro 可单独启动：

```bash
npm start
```

## Storybook

```bash
npm run storybook:ios
# 或
npm run storybook:android
```

如果原生应用已经安装，可单独运行 `npm run storybook` 启动 Storybook Metro。

## 质量检查

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
```

## 工程结构

```text
src/
├── components/      # UI 组件和 Storybook stories
├── data/            # Mock 数据
├── navigation/      # Root Stack 与 Bottom Tabs
├── screens/         # 认证、首页、交易、资金、审批、活动和用户中心
├── store/           # Zustand 持久化状态
├── theme/           # 颜色、间距和圆角 Design Tokens
└── types/           # 领域模型与路由类型
.rnstorybook/        # Storybook 10 配置和自动生成索引
android/             # Android 原生工程
ios/                 # iOS 原生工程
docs/                # 架构、运行、测试、部署、上架和安全文档
```

## 文档

- [架构与数据流](docs/ARCHITECTURE.md)
- [开发环境与本地运行](docs/RUNNING.md)
- [Storybook](docs/STORYBOOK.md)
- [构建与部署](docs/DEPLOYMENT.md)
- [App Store、应用宝和华为应用市场上架](docs/STORE_SUBMISSION.md)
- [安全和生产接入边界](docs/SECURITY.md)
- [HarmonyOS 适配说明](docs/HARMONYOS.md)

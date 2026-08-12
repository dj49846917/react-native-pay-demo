# 安全与生产接入边界

当前短信验证码 `246810`、图形验证答案和所有资金数据仅用于演示，不能作为生产安全机制。

生产版本必须实现：

- 短信服务端发送与校验、频率限制、设备/IP 风控和验证码哈希存储。
- Cloudflare Turnstile、reCAPTCHA Enterprise 或等价服务端校验的人机验证。
- OAuth/OIDC 或合规身份服务，Refresh Token 轮换和设备会话撤销。
- Keychain/Android Keystore 安全存储、证书固定评估和运行环境完整性检测。
- KYB/KYC、AML/KYT、制裁名单、Travel Rule 和地域限制。
- 服务端双式账本、幂等资金接口、HSM/MPC 签名和完整审计日志。
- 审批权限在服务端强制执行，客户端状态不得决定真实资金结果。

日志不得包含密码、短信验证码、Token、完整身份证件、银行卡号、钱包私钥或助记词。

## 依赖审计说明（2026-08-12）

`npm audit` 当前会报告 React Native 0.87/Metro、Reanimated 和 Storybook 工具链的上游告警，主要由 Metro 的 `image-size` 构建期解析器及依赖链传播产生。npm 给出的自动修复方案会把 React Native 降级到 0.72 或把 Reanimated 降级到不支持 RN 0.87 的版本，因此没有执行 `npm audit fix --force`。

这些包不应处理用户上传的任意图片或不可信 Storybook 输入，CI 应保持隔离。发布前需再次审计，并在 React Native、Metro、Reanimated 或 Storybook 发布兼容修复后及时升级。生产 API、认证、密钥和资金安全仍需独立完成服务端威胁建模、渗透测试与供应链审查。

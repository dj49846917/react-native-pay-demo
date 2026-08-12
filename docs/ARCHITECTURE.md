# 架构与数据流

## 分层

- `screens` 只负责页面状态、交互和导航。
- `store/useAppStore.ts` 负责认证、交易、审批和通知状态。
- `data/mock.ts` 提供可替换的演示数据源。
- `types` 定义领域模型，Strict TypeScript API 下禁止依赖 React Native 内部深层路径。
- `components/ui.tsx` 提供页面容器、卡片、按钮、状态标签和演示提示。

```text
Screen → Zustand action → Mock state / AsyncStorage
   ↓           ↓
Navigation   transaction/approval update
```

资金操作提交后由 `createOperation` 写入新的处理中交易；审批动作由 `handleApproval` 更新待审批集合。刷新应用后 AsyncStorage 会恢复演示状态。

## 生产 API 替换

建议增加 `services/` 和 Repository 接口，通过 TanStack Query 管理服务端状态：

1. 身份服务签发短期 Access Token 和可撤销 Refresh Token。
2. API 层统一注入请求 ID、设备证明和幂等键。
3. 资金请求只向后端提交意图，客户端不持有托管密钥。
4. WebSocket/SSE 推送审批和交易状态，服务端账本为唯一事实来源。
5. AsyncStorage 只保存非敏感偏好；Token 改用 Keychain/Android Keystore。


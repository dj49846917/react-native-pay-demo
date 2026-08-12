# Storybook 组件目录

工程使用 Storybook React Native 10.5，Metro 仅在 `STORYBOOK_ENABLED=true` 时包含 Storybook，正式构建不会打包组件目录。

React Native 0.87 发布早于 Storybook peer 声明更新，因此工程精确锁定了已声明支持 RN 0.87 的 Reanimated 4.6 nightly 与 Worklets 0.12，并在 `.npmrc` 中启用 `legacy-peer-deps`。升级 Storybook 或 Reanimated 时，必须重新执行 iOS Pod、Android Debug 和双平台 Storybook Bundle 验证。

```bash
npm run storybook:ios
npm run storybook:android
```

配置位于 `.rnstorybook/`，stories 使用 `src/**/*.stories.tsx`。修改 stories 后 Metro 会自动生成 `.rnstorybook/storybook.requires.ts`；也可手动执行：

```bash
npx sb-rn-get-stories
```

现有用例包括主按钮、完成/处理中/已拒绝状态和演示环境提示。新增共享组件时应至少覆盖默认、禁用、加载、错误和深色背景状态。

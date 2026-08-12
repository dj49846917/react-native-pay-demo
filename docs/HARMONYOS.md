# HarmonyOS 适配

React Native 0.87 官方核心平台是 iOS 和 Android。华为 Android 设备可以安装 Android 构建，但 HarmonyOS NEXT 不兼容 APK。

面向 HarmonyOS NEXT 有两条路线：

1. 使用 ArkUI/ArkTS 开发独立客户端，共享 OpenAPI、领域模型和设计规范。这是金融应用更稳妥的方案。
2. 评估社区维护的 React Native OpenHarmony/RNOH 方案，逐个核查导航、存储、SVG、手势和原生模块兼容性。

本工程未宣称已完成 HarmonyOS NEXT 原生适配。正式立项前应创建独立 PoC，完成 DevEco Studio 编译、真机性能、安全和上架验证。

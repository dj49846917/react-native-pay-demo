# 构建与部署

## 版本号

- iOS：修改 `ios/CryptoPay/Info.plist` 的 `CFBundleShortVersionString` 与 `CFBundleVersion`。
- Android：修改 `android/app/build.gradle` 的 `versionName` 与 `versionCode`。

推荐 CI 使用不可重复的递增 build number，并在发布提交上创建 Git tag。

## iOS Release

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/main.jsbundle --assets-dest /tmp/cryptopay-assets
open ios/CryptoPay.xcworkspace
```

在 Xcode 中选择 Generic iOS Device，执行 Product → Archive，通过 Organizer 验证并上传 App Store Connect。

## Android Release

创建上传密钥并通过环境变量或本机 `~/.gradle/gradle.properties` 提供，禁止提交密码和 `.jks`：

```bash
cd android
./gradlew clean bundleRelease
```

AAB 位于 `android/app/build/outputs/bundle/release/app-release.aab`。上传前执行：

```bash
./gradlew lintRelease testReleaseUnitTest
```

## CI 建议

CI 至少执行 `npm ci`、typecheck、lint、Jest、Android bundle 和 iOS archive。签名证书、Provisioning Profile、上传密钥和商店 API Key 必须保存在加密 Secret 中。


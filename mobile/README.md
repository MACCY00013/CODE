# CareerOS 10.2 Mobile

Cross-platform production client for Android, iOS and installable web/PWA.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the deployed CareerOS FastAPI endpoint.

## Native builds

```bash
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

Android requires Android Studio/SDK. iOS requires macOS + Xcode and an Apple Developer signing identity. App Store / Play Store publication also requires the developer accounts and signing credentials belonging to the publisher.

## Release CI

The repository contains GitHub Actions for Android AAB and iOS archive generation. Configure signing secrets before store submission.

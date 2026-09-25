# Career Roadmap Generator v2

A complete Expo/React Native mobile career-management app.

## Modules
- Dashboard
- Personalized roadmap generator
- Phase/task progress tracking
- IAM-focused default roadmap
- Interview Lab
- Job Tracker
- Career Profile
- Local persistence with AsyncStorage
- Android / iOS / Web via Expo

## Run
```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go on Android, or press `a` for an Android emulator.

## Production builds
Use Expo Application Services (EAS) after installing/configuring EAS CLI:
```bash
npx eas build:configure
npx eas build --platform android
```

## Notes
The job entries in the starter data are intentionally marked for tracking/verification rather than claiming live openings. A production version can connect a backend/API to verify live jobs and generate roadmaps dynamically.

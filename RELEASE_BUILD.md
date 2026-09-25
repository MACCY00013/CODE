# CareerOS 10.3 Release Candidate

This package is source-complete for Android/iOS native builds and Play/App Store submission. The signing step must be performed with the developer's own Apple/Google credentials.

## Android
1. `cd mobile && npm ci`
2. Set `VITE_API_URL` to the production HTTPS API.
3. `npm run release:android`
4. Open `mobile/android` in Android Studio.
5. Configure the release keystore, `applicationId=app.careeros.mobile`, versionCode/versionName, then Build > Generate Signed Bundle/APK.
6. Upload the `.aab` to Google Play Console.

## iOS
1. `cd mobile && npm ci`
2. Set `VITE_API_URL` to the production HTTPS API.
3. `npm run release:ios`
4. Open `mobile/ios/App/App.xcworkspace` in Xcode on macOS.
5. Set Team, Bundle Identifier `app.careeros.mobile`, signing, icons, privacy strings and version.
6. Product > Archive, validate and upload to App Store Connect.

## Backend
Deploy `backend` behind HTTPS. Set `DATABASE_URL` to PostgreSQL for production. Run the worker separately for source synchronization.

## Store assets still required from the publisher
- Developer account credentials
- Signing certificates/keys
- Final 1024px app icon and store screenshots
- Privacy Policy URL and Terms URL
- Support/contact URL
- Production API hostname

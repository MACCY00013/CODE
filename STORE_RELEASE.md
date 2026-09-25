# CareerOS 10.2 Release Package

## What is included
- Connected React client for Android, iOS and PWA.
- FastAPI job/search/profile/application backend from CareerOS 10.1.
- Capacitor configuration for native packaging.
- Android and iOS CI workflows.
- PWA manifest/service worker.

## Production requirements
1. Deploy backend on HTTPS and set `VITE_API_URL`.
2. Configure production database and job-source API credentials.
3. Configure Android application signing and Play Console account.
4. Configure Apple Developer team, bundle identifier and signing/provisioning for App Store distribution.
5. Replace development app icon/splash assets with branded assets.
6. Add privacy policy and terms URLs to the store listings.

The generated source is store-buildable, but signed Google Play and App Store binaries cannot be truthfully supplied from this Linux build environment: Google Play signing credentials and an Apple/macOS signing environment are required for final distribution.

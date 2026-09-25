# CareerOS 10.4 Production Checklist

## Backend
- [ ] Deploy FastAPI behind HTTPS/reverse proxy.
- [ ] Set a production PostgreSQL URL.
- [ ] Configure real source credentials through secrets, not source files.
- [ ] Restrict `/v1/admin/sync` at the network/auth layer before public exposure.
- [ ] Configure backups, monitoring, log retention, and database migrations.
- [ ] Review each job provider's API terms, attribution and redistribution rules.

## Android / Google Play
- [ ] Set a unique production application ID.
- [ ] Create and protect the Android upload/signing key.
- [ ] Set production API URL in `ApiConfig`/build configuration.
- [ ] Generate a signed AAB with Android Studio or Gradle.
- [ ] Complete Play Console Data safety, content rating, privacy policy and store listing.

## iOS / App Store
- [ ] Set a unique production bundle identifier.
- [ ] Configure Apple Developer signing, capabilities and App Store Connect.
- [ ] Set production API URL.
- [ ] Archive/sign in Xcode and upload to App Store Connect.
- [ ] Complete privacy details, review information and store listing.

## Privacy / Security
- [ ] Publish a privacy policy and terms of service.
- [ ] Add real user authentication/session management before handling non-demo personal data.
- [ ] Remove demo-user fallback before public launch.
- [ ] Add rate limiting and abuse protection.
- [ ] Validate and sanitize external job-source content.

# CareerOS 10.5 Production Candidate

## Connected features
- FastAPI health endpoint
- Job search and pagination
- User profile persistence
- Personalized recommendations
- Application tracking
- Alerts API
- Greenhouse / Lever / Adzuna adapters
- Manual sync protected by optional `ADMIN_SYNC_KEY`
- Configurable CORS via `CORS_ORIGINS`
- Docker health check

## Mobile release
The `mobile/` project is the canonical Capacitor source for Android and iOS. Run `npm install`, then `npm run build`, followed by `npx cap add android` / `npx cap add ios` if native folders are not present. Native signing must be configured with your own Apple and Google credentials.

## Production requirements
1. Set a production HTTPS `VITE_API_URL`.
2. Set `DATABASE_URL` to managed PostgreSQL.
3. Set restrictive `CORS_ORIGINS`.
4. Set a strong `ADMIN_SYNC_KEY`.
5. Configure job-source credentials and rate limits.
6. Configure Android signing and Apple provisioning.
7. Publish privacy policy, terms, and support URLs.

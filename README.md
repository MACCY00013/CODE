# CareerOS Ultimate — restored release workspace

This workspace contains the restored CareerOS application surfaces:

- `web/` — the Supabase-backed React application with email/password authentication,
  dashboard, profile editing, skills management, resume builder, and career roadmap generation.
- `mobile/` — the connected PWA/Capacitor client for job discovery, recommendations,
  profiles, and application tracking.
- `android/` — the native Android client source.
- `backend/` — the FastAPI job aggregation and application-tracking API.

## Supabase web client

```bash
cd web
cp .env.example .env
npm ci
npm run dev
```

The publishable Supabase key belongs in the client environment only. Keep service-role
keys and function secrets server-side.

## Connected mobile client

```bash
cd mobile
cp .env.example .env
npm ci
npm run dev
```

See the release documents below for backend deployment and Android signing details.

---

# CareerOS 10.4 — Final Release Candidate

This upgrade turns the original shell into an end-to-end connected MVP.

## Connected flow
1. Android client calls the FastAPI backend.
2. Backend creates/reuses a demo user and stores the profile.
3. Jobs are read from the persistent database and can be searched by keyword/location/remote.
4. Recommendations are calculated from the stored profile and live jobs.
5. A job can be opened at its original source URL or tracked as an application.
6. Application status/notes are persisted.
7. The worker runs configured Greenhouse, Lever and Adzuna adapters on a schedule.
8. `/v1/admin/sync` can trigger an immediate source sync.

## Backend

```bash
cd backend
python -m venv .venv
# activate it
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

### Configure live job sources
Edit `backend/sources.json`.

Greenhouse example:
```json
{"greenhouse":[{"board_token":"example","company":"Example Corp","enabled":true}],"lever":[],"adzuna":[]}
```

Lever example:
```json
{"greenhouse":[],"lever":[{"company_slug":"example","company":"Example Corp","enabled":true}],"adzuna":[]}
```

Adzuna example:
```json
{"greenhouse":[],"lever":[],"adzuna":[{"app_id":"YOUR_ID","app_key":"YOUR_KEY","country":"in","what":"Windows Active Directory","where":"Lucknow","enabled":true}]}
```

For Adzuna, server-side credentials should be kept in environment/secret management rather than committed to source control in a production deployment. The adapter currently accepts configured credentials for MVP operation.

### Worker

```bash
cd backend
python -m app.worker
```

The worker performs an immediate sync at startup and then repeats according to `SYNC_INTERVAL_MINUTES` (default 15).

## Docker

```bash
docker compose up --build
```

The API and worker use PostgreSQL in Docker. The database credentials in the compose file are development credentials and should be changed before production.

## Android

The Android app now includes:
- live backend health/connection state
- live job search
- personalized recommendation refresh
- original job application URL opening
- application tracking
- editable skills/location/remote profile

For Android Emulator, `ApiConfig.BASE_URL` uses `http://10.0.2.2:8000/`.
For a physical phone, replace it with the LAN address of the computer running the API.

Build with Android Studio/Gradle from `android/`.

## MVP boundaries

This is connected but intentionally not production-ready. Production hardening still includes real authentication/session tokens, authorization for admin sync, HTTPS, secrets management, rate limiting, background push notifications, monitoring, source-specific terms/licensing review, database migrations, and Play Store signing/release configuration.


## Release documentation
See `RELEASE.md` and `docs/PRODUCTION_CHECKLIST.md` for final deployment and store requirements.

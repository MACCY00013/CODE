# CareerOS 10.4 — Final Release Candidate

This package is the consolidated cross-platform source release derived from CareerOS 10.3.

### Included
- FastAPI connected backend
- PostgreSQL/Docker deployment configuration
- Job source synchronization adapters
- Job search and recommendation APIs
- Application tracking
- React/Vite mobile web UI
- Capacitor Android/iOS projects/configuration
- PWA manifest/service worker
- Android and iOS CI workflow templates
- Production checklist

### Build
Backend:
```bash
cd backend
python -m venv .venv
# activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Mobile:
```bash
cd mobile
npm install
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

### Important
This is a release-candidate source package. A signed Play Store `.aab` and signed App Store `.ipa` cannot be generated without the publisher's signing credentials and production service configuration. See `docs/PRODUCTION_CHECKLIST.md`.

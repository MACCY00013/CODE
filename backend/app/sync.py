import json, uuid
from datetime import datetime, timezone
from .db import SessionLocal
from .models import Job, SyncRun
from .integrity import validate
from .adapters.greenhouse import GreenhouseAdapter
from .adapters.lever import LeverAdapter
from .adapters.adzuna import AdzunaAdapter

ADAPTERS = {"greenhouse": GreenhouseAdapter(), "lever": LeverAdapter(), "adzuna": AdzunaAdapter()}

def parse_dt(value):
    if not value: return None
    if isinstance(value, datetime): return value
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except Exception:
        return None

def upsert(raw, source):
    now = datetime.now(timezone.utc)
    d = {"source": source, "external_id": raw.external_id, "title": raw.title,
         "company": raw.company, "canonical_url": raw.canonical_url,
         "fetched_at": now, "updated_at": now}
    ok, _ = validate(d)
    if not ok: return False
    db = SessionLocal()
    try:
        old = db.query(Job).filter(Job.source == source, Job.external_id == raw.external_id).first()
        values = dict(title=raw.title, company=raw.company, location=raw.location,
                      remote=raw.remote, experience=raw.experience, salary=raw.salary,
                      description=raw.description, canonical_url=raw.canonical_url,
                      fetched_at=now, updated_at=now, status="LIVE",
                      skills_json=json.dumps(raw.skills or []), posted_at=parse_dt(raw.posted_at))
        if old:
            for k, v in values.items(): setattr(old, k, v)
        else:
            db.add(Job(id=str(uuid.uuid4()), source=source, external_id=raw.external_id, **values))
        db.commit(); return True
    finally: db.close()

async def run_sync():
    with open("sources.json", encoding="utf-8") as f: config = json.load(f)
    totals = {"seen": 0, "upserted": 0, "rejected": 0, "sources": []}
    for source, entries in config.items():
        if source not in ADAPTERS: continue
        for item in entries:
            if not item.get("enabled", True): continue
            run = SyncRun(id=str(uuid.uuid4()), source=source, status="RUNNING")
            db = SessionLocal(); db.add(run); db.commit(); db.close()
            try:
                kwargs = dict(item)
                kwargs.pop("enabled", None)
                adapter = ADAPTERS[source]
                jobs = await adapter.fetch(**kwargs)
                up = sum(1 for raw in jobs if upsert(raw, adapter.source))
                rej = len(jobs) - up
                db = SessionLocal(); r = db.query(SyncRun).get(run.id)
                r.seen, r.upserted, r.rejected = len(jobs), up, rej
                r.status, r.finished_at = "SUCCESS", datetime.now(timezone.utc)
                db.commit(); db.close()
                totals["seen"] += len(jobs); totals["upserted"] += up; totals["rejected"] += rej
                totals["sources"].append({"source": source, "seen": len(jobs), "upserted": up})
            except Exception as exc:
                db = SessionLocal(); r = db.query(SyncRun).get(run.id)
                r.status, r.error, r.finished_at = "FAILED", str(exc), datetime.now(timezone.utc)
                db.commit(); db.close()
                totals["sources"].append({"source": source, "error": str(exc)})
    return totals

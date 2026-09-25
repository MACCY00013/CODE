import json, uuid
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Query, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db, SessionLocal
from .models import Job, User, Profile, Application, Alert, Skill
from .matching import score
from .sync import run_sync
from .config import settings

app = FastAPI(title="CareerOS 10", version="10.5.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def startup(): init_db()

def job_dict(j):
    return {"id":j.id,"title":j.title,"company":j.company,"location":j.location,"remote":j.remote,
            "experience":j.experience,"salary":j.salary,"skills":json.loads(j.skills_json or "[]"),
            "description":j.description,"source":j.source,"external_id":j.external_id,"canonical_url":j.canonical_url,
            "posted_at":j.posted_at,"fetched_at":j.fetched_at,"updated_at":j.updated_at,"status":j.status}

def application_dict(a):
    return {"id":a.id,"user_id":a.user_id,"job_id":a.job_id,"status":a.status,"notes":a.notes,
            "created_at":a.created_at,"updated_at":a.updated_at}

def skill_dict(s):
    return {"id":s.id,"user_id":s.user_id,"name":s.name,"level":s.level,
            "sync_status":s.sync_status,"updated_at":s.updated_at}

@app.get("/v1/health")
def health(): return {"status":"ok","version":app.version,"utc":datetime.now(timezone.utc)}

@app.post("/v1/users")
def create_user(payload:dict):
    email=(payload.get("email") or "").strip().lower()
    if not email: raise HTTPException(400,"email required")
    db=SessionLocal()
    try:
        existing=db.query(User).filter(User.email==email).first()
        if existing: return {"id":existing.id,"email":existing.email,"existing":True}
        u=User(id=str(uuid.uuid4()),email=email); db.add(u); db.commit()
        return {"id":u.id,"email":u.email,"existing":False}
    finally: db.close()

@app.get("/v1/users/{user_id}/profile")
def get_profile(user_id:str):
    db=SessionLocal()
    try:
        p=db.query(Profile).filter(Profile.user_id==user_id).first()
        if not p: return {"skills":[],"careers":[],"locations":[],"remote_preferred":False}
        return {"skills":json.loads(p.skills_json or "[]"),"careers":json.loads(p.careers_json or "[]"),
                "locations":json.loads(p.locations_json or "[]"),"remote_preferred":p.remote_preferred}
    finally: db.close()

@app.put("/v1/users/{user_id}/profile")
def profile(user_id:str,payload:dict):
    db=SessionLocal()
    try:
        if not db.query(User).filter(User.id==user_id).first(): raise HTTPException(404,"user not found")
        p=db.query(Profile).filter(Profile.user_id==user_id).first()
        if not p:
            p=Profile(user_id=user_id); db.add(p)
        p.skills_json=json.dumps(payload.get("skills",[])); p.careers_json=json.dumps(payload.get("careers",[]))
        p.locations_json=json.dumps(payload.get("locations",[])); p.remote_preferred=bool(payload.get("remote_preferred",False))
        for field in ("target_role", "target_salary", "target_industry"):
            if field in payload: setattr(p, field, payload[field])
        db.commit(); return {"saved":True}
    finally: db.close()

@app.get("/v1/jobs")
def jobs(q:str|None=None,location:str|None=None,remote:bool|None=None,
         limit:int=Query(25,ge=1,le=100),offset:int=Query(0,ge=0)):
    db=SessionLocal()
    try:
        cutoff=datetime.now(timezone.utc)-timedelta(days=30)
        query=db.query(Job).filter(Job.status=="LIVE")
        if q: query=query.filter((Job.title.ilike(f"%{q}%")) | (Job.company.ilike(f"%{q}%")) | (Job.description.ilike(f"%{q}%")))
        if location: query=query.filter(Job.location.ilike(f"%{location}%"))
        if remote is not None: query=query.filter(Job.remote==remote)
        return [job_dict(x) for x in query.order_by(Job.updated_at.desc()).offset(offset).limit(limit).all()]
    finally: db.close()

@app.get("/v1/jobs/feed")
def jobs_feed(q:str|None=None,location:str|None=None,remote:bool|None=None,
              limit:int=Query(25,ge=1,le=100),offset:int=Query(0,ge=0)):
    return jobs(q=q, location=location, remote=remote, limit=limit, offset=offset)

@app.get("/v1/users/{user_id}/skills")
def list_skills(user_id:str):
    db=SessionLocal()
    try:
        return [skill_dict(s) for s in db.query(Skill).filter(Skill.user_id==user_id).order_by(Skill.name).all()]
    finally: db.close()

@app.post("/v1/skills/sync")
def sync_skills(payload:dict):
    user_id=payload.get("user_id")
    items=payload.get("skills", [])
    if not user_id or not isinstance(items, list): raise HTTPException(400, "user_id and skills are required")
    db=SessionLocal()
    try:
        if not db.query(User).filter(User.id==user_id).first(): raise HTTPException(404, "user not found")
        saved=[]
        for item in items:
            name=(item.get("name") if isinstance(item, dict) else item or "").strip()
            if not name: continue
            skill=db.query(Skill).filter(Skill.user_id==user_id, Skill.name==name).first()
            if not skill:
                skill=Skill(id=str(uuid.uuid4()),user_id=user_id,name=name); db.add(skill)
            skill.level=item.get("level", skill.level) if isinstance(item, dict) else skill.level
            skill.sync_status="SYNCED"; skill.updated_at=datetime.now(timezone.utc); saved.append(skill)
        db.commit()
        return {"saved":len(saved),"skills":[skill_dict(s) for s in saved]}
    finally: db.close()

@app.get("/v1/dashboard")
def dashboard(user_id:str|None=None):
    db=SessionLocal()
    try:
        applications_count=db.query(Application).filter(Application.user_id==user_id).count() if user_id else 0
        skills_count=db.query(Skill).filter(Skill.user_id==user_id).count() if user_id else 0
        return {"jobs_available":db.query(Job).filter(Job.status=="LIVE").count(),
                "applications":applications_count,"skills":skills_count,"offline_capable":True}
    finally: db.close()

@app.put("/v1/user/career-profile")
def career_profile(payload:dict):
    user_id=payload.get("user_id")
    if not user_id: raise HTTPException(400, "user_id required")
    return profile(user_id, payload)

@app.get("/v1/ai/roadmap")
def roadmap(user_id:str):
    db=SessionLocal()
    try:
        p=db.query(Profile).filter(Profile.user_id==user_id).first()
        return json.loads(p.roadmap_json or "[]") if p else []
    finally: db.close()

@app.post("/v1/ai/ats-check")
def ats_check(payload:dict):
    resume=(payload.get("resume") or payload.get("text") or "").lower()
    keywords={str(x).lower() for x in payload.get("keywords", []) if str(x).strip()}
    matched=sorted(x for x in keywords if x in resume)
    score_value=round(len(matched) / len(keywords) * 100) if keywords else 0
    return {"score":score_value,"matched_keywords":matched,"missing_keywords":sorted(keywords-set(matched))}

@app.post("/v1/ai/hub/process")
def ai_hub_process(payload:dict):
    prompt=(payload.get("prompt") or "").strip()
    if not prompt: raise HTTPException(400, "prompt required")
    return {"status":"QUEUED_FOR_PROCESSING","provider":payload.get("provider","auto"),
            "response":"Your request is queued for processing.","prompt":prompt}

@app.get("/v1/jobs/{job_id}")
def job(job_id:str):
    db=SessionLocal()
    try:
        j=db.query(Job).filter(Job.id==job_id).first()
        if not j: raise HTTPException(404,"job not found")
        return job_dict(j)
    finally: db.close()

@app.get("/v1/recommendations/{user_id}")
def recommendations(user_id:str,limit:int=Query(20,ge=1,le=100)):
    db=SessionLocal()
    try:
        p=db.query(Profile).filter(Profile.user_id==user_id).first()
        if not p:return []
        prof={"skills":json.loads(p.skills_json or "[]"),"locations":json.loads(p.locations_json or "[]"),"remote_preferred":p.remote_preferred}
        result=[]
        for j in db.query(Job).filter(Job.status=="LIVE").all():
            d=job_dict(j); result.append({"job":d,**score(prof,d)})
        return sorted(result,key=lambda x:x["score"],reverse=True)[:limit]
    finally: db.close()

@app.get("/v1/applications/{user_id}")
def applications(user_id:str):
    db=SessionLocal()
    try: return [application_dict(a) for a in db.query(Application).filter(Application.user_id==user_id).order_by(Application.updated_at.desc()).all()]
    finally: db.close()

@app.post("/v1/applications")
def create_application(payload:dict):
    db=SessionLocal()
    try:
        if not db.query(Job).filter(Job.id==payload.get("job_id")).first(): raise HTTPException(404,"job not found")
        a=Application(id=str(uuid.uuid4()),user_id=payload["user_id"],job_id=payload["job_id"],status=payload.get("status","APPLIED"),notes=payload.get("notes"))
        db.add(a); db.commit(); return application_dict(a)
    finally: db.close()

@app.patch("/v1/applications/{application_id}")
def update_application(application_id:str,payload:dict):
    db=SessionLocal()
    try:
        a=db.query(Application).filter(Application.id==application_id).first()
        if not a: raise HTTPException(404,"application not found")
        if "status" in payload: a.status=payload["status"]
        if "notes" in payload: a.notes=payload["notes"]
        a.updated_at=datetime.now(timezone.utc); db.commit(); return application_dict(a)
    finally: db.close()

@app.get("/v1/alerts/{user_id}")
def alerts(user_id:str):
    db=SessionLocal()
    try: return [{"id":a.id,"query":a.query,"location":a.location,"remote_only":a.remote_only,"enabled":a.enabled} for a in db.query(Alert).filter(Alert.user_id==user_id).all()]
    finally: db.close()

@app.post("/v1/alerts")
def create_alert(payload:dict):
    db=SessionLocal()
    try:
        a=Alert(id=str(uuid.uuid4()),user_id=payload["user_id"],query=payload.get("query"),location=payload.get("location"),remote_only=bool(payload.get("remote_only",False)))
        db.add(a);db.commit();return {"id":a.id}
    finally: db.close()

@app.post("/v1/admin/sync")
async def sync_now(x_admin_key: str | None = Header(default=None)):
    if settings.admin_sync_key and x_admin_key != settings.admin_sync_key:
        raise HTTPException(401, "invalid admin key")
    return await run_sync()

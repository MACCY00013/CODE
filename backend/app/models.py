from datetime import datetime, timezone
from sqlalchemy import Column,String,Boolean,Text,DateTime,UniqueConstraint,ForeignKey,Integer
from .db import Base

def now(): return datetime.now(timezone.utc)

class User(Base):
    __tablename__="users"
    id=Column(String,primary_key=True)
    email=Column(String,unique=True,nullable=False)
    created_at=Column(DateTime(timezone=True),default=now)

class Profile(Base):
    __tablename__="profiles"
    user_id=Column(String,ForeignKey("users.id"),primary_key=True)
    skills_json=Column(Text,default="[]")
    careers_json=Column(Text,default="[]")
    locations_json=Column(Text,default="[]")
    remote_preferred=Column(Boolean,default=False)
    target_role=Column(String)
    target_salary=Column(String)
    target_industry=Column(String)
    roadmap_json=Column(Text,default="[]")

class Skill(Base):
    __tablename__="skills"
    id=Column(String,primary_key=True)
    user_id=Column(String,nullable=False)
    name=Column(String,nullable=False)
    level=Column(String,default="BEGINNER")
    sync_status=Column(String,default="SYNCED")
    updated_at=Column(DateTime(timezone=True),default=now)
    __table_args__=(UniqueConstraint("user_id","name",name="uq_user_skill"),)

class Job(Base):
    __tablename__="jobs"
    id=Column(String,primary_key=True)
    source=Column(String,nullable=False)
    external_id=Column(String,nullable=False)
    title=Column(String,nullable=False)
    company=Column(String,nullable=False)
    location=Column(String)
    remote=Column(Boolean,default=False)
    experience=Column(String)
    salary=Column(String)
    skills_json=Column(Text,default="[]")
    description=Column(Text)
    posted_at=Column(DateTime(timezone=True))
    canonical_url=Column(Text,nullable=False)
    fetched_at=Column(DateTime(timezone=True),nullable=False)
    updated_at=Column(DateTime(timezone=True),nullable=False)
    status=Column(String,default="LIVE")
    __table_args__=(UniqueConstraint("source","external_id",name="uq_source_external"),)

class Application(Base):
    __tablename__="applications"
    id=Column(String,primary_key=True)
    user_id=Column(String,nullable=False)
    job_id=Column(String,nullable=False)
    status=Column(String,default="APPLIED")
    notes=Column(Text)
    created_at=Column(DateTime(timezone=True),default=now)
    updated_at=Column(DateTime(timezone=True),default=now)

class Alert(Base):
    __tablename__="alerts"
    id=Column(String,primary_key=True)
    user_id=Column(String,nullable=False)
    query=Column(String)
    location=Column(String)
    remote_only=Column(Boolean,default=False)
    enabled=Column(Boolean,default=True)

class SyncRun(Base):
    __tablename__="sync_runs"
    id=Column(String,primary_key=True)
    source=Column(String)
    started_at=Column(DateTime(timezone=True),default=now)
    finished_at=Column(DateTime(timezone=True))
    status=Column(String)
    seen=Column(Integer,default=0)
    upserted=Column(Integer,default=0)
    rejected=Column(Integer,default=0)
    error=Column(Text)

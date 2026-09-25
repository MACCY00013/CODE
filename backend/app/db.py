import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL=os.getenv("DATABASE_URL","sqlite:///./careeros.db")

connect_args={"check_same_thread":False} if DATABASE_URL.startswith("sqlite") else {}
engine=create_engine(DATABASE_URL,connect_args=connect_args)
SessionLocal=sessionmaker(bind=engine,autocommit=False,autoflush=False)
Base=declarative_base()

def init_db():
    from .models import User, Profile, Skill, Job, Application, Alert, SyncRun
    Base.metadata.create_all(bind=engine)

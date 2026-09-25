import os
from dataclasses import dataclass

@dataclass(frozen=True)
class Settings:
    cors_origins: list[str]
    admin_sync_key: str | None
    developer_name: str
    company_name: str
    supabase_url: str
    supabase_anon_key: str
    redis_url: str
    gemini_api_key: str | None
    openai_api_key: str | None
    superhuman_go_key: str | None


def load_settings() -> Settings:
    raw = os.getenv("CORS_ORIGINS", "*")
    origins = [x.strip() for x in raw.split(",") if x.strip()]
    return Settings(
        cors_origins=origins or ["*"],
        admin_sync_key=os.getenv("ADMIN_SYNC_KEY") or None,
        developer_name=os.getenv("DEVELOPER_NAME", "SAKET YADAV"),
        company_name=os.getenv("COMPANY_NAME", "MACCY CREATIONS"),
        supabase_url=os.getenv("SUPABASE_URL", ""),
        supabase_anon_key=os.getenv("SUPABASE_ANON_KEY", ""),
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        gemini_api_key=os.getenv("GEMINI_API_KEY") or None,
        openai_api_key=os.getenv("OPENAI_API_KEY") or None,
        superhuman_go_key=os.getenv("SUPERHUMAN_GO_KEY") or None,
    )

settings = load_settings()

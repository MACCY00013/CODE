import httpx
from .base import Adapter,RawJob

class LeverAdapter(Adapter):
    source="Lever"
    async def fetch(self,company_slug:str,**kwargs):
        url=f"https://api.lever.co/v0/postings/{company_slug}?mode=json"
        async with httpx.AsyncClient(timeout=20) as c:
            r=await c.get(url)
            r.raise_for_status()
            data=r.json()
        out=[]
        for x in data:
            cats=x.get("categories") or {}
            out.append(RawJob(
                external_id=str(x.get("id")),
                title=x.get("text",""),
                company=kwargs.get("company",company_slug),
                location=cats.get("location"),
                remote=str(cats.get("commitment","")).lower().find("remote")>=0,
                experience=None,salary=None,skills=[],
                description=x.get("descriptionPlain"),
                canonical_url=x.get("hostedUrl",""),
                posted_at=None
            ))
        return out

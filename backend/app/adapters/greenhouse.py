import httpx
from .base import Adapter,RawJob

class GreenhouseAdapter(Adapter):
    source="Greenhouse"
    async def fetch(self,board_token:str,**kwargs):
        url=f"https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs"
        async with httpx.AsyncClient(timeout=20) as c:
            r=await c.get(url)
            r.raise_for_status()
            data=r.json()
        out=[]
        for x in data.get("jobs",[]):
            out.append(RawJob(
                external_id=str(x["id"]),
                title=x.get("title",""),
                company=kwargs.get("company",board_token),
                location=(x.get("location") or {}).get("name"),
                remote=False,
                experience=None,salary=None,skills=[],
                description=x.get("content"),
                canonical_url=x.get("absolute_url",""),
                posted_at=x.get("updated_at")
            ))
        return out

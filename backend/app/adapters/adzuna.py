import httpx
from .base import Adapter,RawJob

class AdzunaAdapter(Adapter):
    source="Adzuna"
    async def fetch(self,app_id,app_key,country="in",what="IAM",where=None,**kwargs):
        page=1
        url=f"https://api.adzuna.com/v1/api/jobs/{country}/search/{page}"
        params={"app_id":app_id,"app_key":app_key,"results_per_page":50,"what":what}
        if where: params["where"]=where
        async with httpx.AsyncClient(timeout=20) as c:
            r=await c.get(url,params=params)
            r.raise_for_status()
            data=r.json()
        out=[]
        for x in data.get("results",[]):
            out.append(RawJob(
                external_id=str(x.get("id")),
                title=x.get("title",""),
                company=(x.get("company") or {}).get("display_name",""),
                location=(x.get("location") or {}).get("display_name"),
                remote=False,experience=None,
                salary=(str(x.get("salary_min"))+"-"+str(x.get("salary_max"))
                        if x.get("salary_min") is not None else None),
                skills=[],description=x.get("description"),
                canonical_url=x.get("redirect_url",""),
                posted_at=x.get("created")
            ))
        return out

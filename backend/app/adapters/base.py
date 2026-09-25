from dataclasses import dataclass

@dataclass
class RawJob:
    external_id:str
    title:str
    company:str
    location:str|None
    remote:bool
    experience:str|None
    salary:str|None
    skills:list[str]
    description:str|None
    canonical_url:str
    posted_at:str|None

class Adapter:
    source="unknown"
    async def fetch(self,**kwargs): raise NotImplementedError

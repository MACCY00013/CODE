from urllib.parse import urlparse

def validate(job):
    required=["source","external_id","title","company","canonical_url","fetched_at","updated_at"]
    errors=[x for x in required if not job.get(x)]
    p=urlparse(job.get("canonical_url",""))
    if p.scheme not in ("http","https") or not p.netloc:
        errors.append("canonical_url")
    return not errors,errors

def key(job):
    return (job["source"].strip().lower(),job["external_id"].strip())

def normalize(xs):
    return {str(x).strip().lower() for x in xs if str(x).strip()}

def score(profile,job):
    p=normalize(profile.get("skills",[]))
    j=normalize(job.get("skills",[]))
    matched=sorted(p&j)
    missing=sorted(j-p)
    skill=len(matched)/len(j) if j else 1
    location=True
    if profile.get("locations") and job.get("location"):
        location=any(x.lower() in job["location"].lower() for x in profile["locations"])
    remote=not profile.get("remote_preferred") or job.get("remote",False)
    total=round(skill*.7+(0.2 if location else 0)+(0.1 if remote else 0),3)
    return {"score":total,"matched_skills":matched,"missing_skills":missing}

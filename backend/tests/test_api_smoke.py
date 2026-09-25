from fastapi.testclient import TestClient
from app.main import app

def test_health():
    with TestClient(app) as c:
        r=c.get('/v1/health')
        assert r.status_code == 200
        assert r.json()['status'] == 'ok'

def test_product_api_contracts():
    with TestClient(app) as c:
        user=c.post('/v1/users',json={'email':'api-contract@example.com'}).json()
        user_id=user['id']
        skills=c.post('/v1/skills/sync',json={'user_id':user_id,'skills':[{'name':'Python','level':'ADVANCED'}]})
        assert skills.status_code == 200
        assert skills.json()['saved'] == 1
        assert c.get('/v1/users/%s/skills' % user_id).json()[0]['name'] == 'Python'
        assert c.put('/v1/user/career-profile',json={'user_id':user_id,'target_role':'Cloud Architect'}).json()['saved'] is True
        assert c.get('/v1/dashboard',params={'user_id':user_id}).json()['skills'] == 1
        ats=c.post('/v1/ai/ats-check',json={'resume':'Python and SQL experience','keywords':['Python','SQL','Kotlin']})
        assert ats.json() == {'score':67,'matched_keywords':['python','sql'],'missing_keywords':['kotlin']}
        assert c.post('/v1/ai/hub/process',json={'prompt':'build a roadmap'}).json()['status'] == 'QUEUED_FOR_PROCESSING'

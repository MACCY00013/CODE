from app.integrity import validate,key

def test_validation():
    ok,errors=validate({
        "source":"Greenhouse","external_id":"1","title":"IAM Analyst",
        "company":"Example","canonical_url":"https://example.com/job/1",
        "fetched_at":"now","updated_at":"now"
    })
    assert ok and errors==[]

def test_bad_url():
    ok,_=validate({
        "source":"x","external_id":"1","title":"x","company":"x",
        "canonical_url":"bad","fetched_at":"x","updated_at":"x"
    })
    assert not ok

def test_key():
    assert key({"source":" Greenhouse ","external_id":" 123 "})==("greenhouse","123")

package com.maccycreations.careeros

import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

object Api {
    private fun request(method:String, path:String, body:String?=null):String {
        val c=URL(ApiConfig.BASE_URL.trimEnd('/')+path).openConnection() as HttpURLConnection
        c.requestMethod=method; c.connectTimeout=8000; c.readTimeout=12000
        c.setRequestProperty("Content-Type","application/json")
        if(body!=null){ c.doOutput=true; c.outputStream.use{it.write(body.toByteArray())} }
        val code=c.responseCode; val stream=if(code in 200..299)c.inputStream else c.errorStream
        val text=stream.bufferedReader().use{it.readText()}; if(code !in 200..299) error(text)
        return text
    }
    fun health()=request("GET","/v1/health")
    fun createUser(email:String)=request("POST","/v1/users",JSONObject().put("email",email).toString())
    fun jobs(q:String="",location:String="",remote:Boolean?=null):List<JobItem>{
        var p="/v1/jobs?limit=50"; if(q.isNotBlank())p+="&q="+URLEncoder.encode(q,"UTF-8"); if(location.isNotBlank())p+="&location="+URLEncoder.encode(location,"UTF-8"); if(remote!=null)p+="&remote=$remote"
        val a=JSONArray(request("GET",p)); return List(a.length()){i->job(a.getJSONObject(i))}
    }
    fun recommendations(userId:String):List<JobItem>{ val a=JSONArray(request("GET","/v1/recommendations/$userId")); return List(a.length()){i->job(a.getJSONObject(i).getJSONObject("job"))} }
    fun apply(userId:String,jobId:String)=request("POST","/v1/applications",JSONObject().put("user_id",userId).put("job_id",jobId).toString())
    fun applications(userId:String):List<String>{ val a=JSONArray(request("GET","/v1/applications/$userId")); return List(a.length()){i->a.getJSONObject(i).optString("status")+" • "+a.getJSONObject(i).optString("job_id")} }
    fun saveProfile(userId:String,skills:List<String>,locations:List<String>,remote:Boolean)=request("PUT","/v1/users/$userId/profile",JSONObject().put("skills",JSONArray(skills)).put("locations",JSONArray(locations)).put("remote_preferred",remote).toString())
    private fun job(o:JSONObject)=JobItem(o.optString("id"),o.optString("title"),o.optString("company"),o.optString("location"),o.optBoolean("remote"),o.optString("canonical_url"),o.optString("source"))
}
data class JobItem(val id:String,val title:String,val company:String,val location:String,val remote:Boolean,val url:String,val source:String)

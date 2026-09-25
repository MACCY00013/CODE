package com.maccycreations.careeros

import android.os.Bundle
import android.content.Intent
import android.net.Uri
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import java.util.concurrent.Executors

private enum class Tab { HOME, JOBS, RECOMMENDATIONS, APPLICATIONS, PROFILE }

class MainActivity:ComponentActivity(){
    override fun onCreate(state:Bundle?){super.onCreate(state);setContent{CareerOSApp()}}
}

@Composable fun CareerOSApp(){
    var tab by remember{mutableStateOf(Tab.HOME)}; var userId by remember{mutableStateOf("")}; var status by remember{mutableStateOf("Connecting…")}; var jobs by remember{mutableStateOf<List<JobItem>>(emptyList())}; var apps by remember{mutableStateOf<List<String>>(emptyList())}
    var email by remember{mutableStateOf("demo@careeros.local")}; var skills by remember{mutableStateOf("Active Directory, Windows Server, GPO")}; var locations by remember{mutableStateOf("Lucknow, Noida")}; var remote by remember{mutableStateOf(false)}
    fun bg(action:()->Unit){Executors.newSingleThreadExecutor().execute{try{action()}catch(e:Exception){status="Error: ${e.message}"}}}}
    LaunchedEffect(Unit){bg{val h=Api.health(); status="Connected"; val u=Api.createUser(email); userId=org.json.JSONObject(u).getString("id"); jobs=Api.jobs(); apps=Api.applications(userId)}}
    MaterialTheme{Scaffold(topBar={TopAppBar(title={Text("CareerOS 10.1")})},bottomBar={NavigationBar{Tab.values().forEach{t->NavigationBarItem(tab==t,{tab=t},icon={},label={Text(t.name.lowercase().replaceFirstChar{it.uppercase()})})}}}){pad->Column(Modifier.padding(pad).padding(16.dp)){when(tab){
        Tab.HOME->Home(status,jobs.size,userId)
        Tab.JOBS->JobScreen(jobs,{q,l->bg{jobs=Api.jobs(q,l)}} ,{j->bg{Api.apply(userId,j.id);apps=Api.applications(userId)}},{url->startActivity(Intent(Intent.ACTION_VIEW,Uri.parse(url)))})
        Tab.RECOMMENDATIONS->Button(onClick={bg{jobs=Api.recommendations(userId)}}){Text("Refresh personalized matches")}
        Tab.APPLICATIONS->Column{Text("Applications",style=MaterialTheme.typography.headlineSmall);Spacer(Modifier.height(8.dp));apps.forEach{Text("• $it");Spacer(Modifier.height(4.dp))}}
        Tab.PROFILE->Profile(email,{email=it},skills,{skills=it},locations,{locations=it},remote,{remote=it},{bg{Api.saveProfile(userId,skills.split(",").map(String::trim).filter(String::isNotBlank),locations.split(",").map(String::trim).filter(String::isNotBlank),remote);status="Profile saved"}})
    }}}}}
}

@Composable fun Home(status:String,count:Int,userId:String){Text("Connected working dashboard",style=MaterialTheme.typography.headlineSmall);Spacer(Modifier.height(12.dp));Text("Backend: $status");Text("Live jobs loaded: $count");Text("User: ${userId.take(8)}…");Spacer(Modifier.height(16.dp));Text("CareerOS connects job ingestion, matching, profiles and applications through the same API.")}

@Composable fun JobScreen(jobs:List<JobItem>,search:(String,String)->Unit,apply:(JobItem)->Unit,open:(String)->Unit){var q by remember{mutableStateOf("")};var l by remember{mutableStateOf("")};Column{Row{OutlinedTextField(q,{q=it},Modifier.weight(1f),label={Text("Search")});Spacer(Modifier.width(6.dp));OutlinedTextField(l,{l=it},Modifier.weight(1f),label={Text("Location")})};Button(onClick={search(q,l)},Modifier.fillMaxWidth()){Text("Search live jobs")};Spacer(Modifier.height(8.dp));LazyColumn{items(jobs){j->Card(Modifier.fillMaxWidth().padding(vertical=4.dp)){Column(Modifier.padding(12.dp)){Text(j.title,style=MaterialTheme.typography.titleMedium);Text(j.company);Text(j.location.ifBlank{"Location not listed"});Text("${j.source}${if(j.remote)" • Remote" else ""}");Row{Button(onClick={open(j.url)}){Text("Apply")};Spacer(Modifier.width(8.dp));OutlinedButton(onClick={apply(j)}){Text("Track")}}}}}}}}

@Composable fun OutlinedTextField(v:String,on:(String)->Unit,m:Modifier,label:@Composable()->Unit)=androidx.compose.material3.OutlinedTextField(v,on,m,label=label)

@Composable fun Profile(email:String,setEmail:(String)->Unit,skills:String,setSkills:(String)->Unit,locations:String,setLocations:(String)->Unit,remote:Boolean,setRemote:(Boolean)->Unit,save:()->Unit){Column{Text("Profile",style=MaterialTheme.typography.headlineSmall);OutlinedTextField(email,setEmail,Modifier.fillMaxWidth(),label={Text("Email")});OutlinedTextField(skills,setSkills,Modifier.fillMaxWidth(),label={Text("Skills (comma separated)")});OutlinedTextField(locations,setLocations,Modifier.fillMaxWidth(),label={Text("Preferred locations")});Row{Checkbox(remote,setRemote);Text("Prefer remote",Modifier.padding(top=12.dp))};Button(save){Text("Save profile")}}}

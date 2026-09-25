import React from "react";
import {View,Text,Pressable} from "react-native";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Screen,Header,Card,Stat,C,s} from "../src/ui";
import {useRoadmap} from "../src/context/RoadmapContext";

export default function Home(){
 const {profile,progress,savedJobs}=useRoadmap();
 return <Screen>
  <Header title="CareerOS" subtitle="Your personal career operating system"/>
  <Card style={{backgroundColor:C.dark}}>
   <Text style={{color:"#AEB5FF",fontWeight:"800"}}>CURRENT TARGET</Text>
   <Text style={{fontSize:25,fontWeight:"900",color:"#fff",marginTop:7}}>{profile.targetRole}</Text>
   <Text style={{color:"#D0D5DD",marginTop:6}}>{profile.experience} • {profile.targetSalary}</Text>
   <View style={{marginTop:16,height:9,borderRadius:9,backgroundColor:"#30384A",overflow:"hidden"}}><View style={{width:`${progress}%`,height:9,backgroundColor:C.primary}}/></View>
   <Text style={{color:"#D0D5DD",marginTop:7}}>{progress}% roadmap complete</Text>
  </Card>
  <View style={{flexDirection:"row",gap:10}}>
   <Stat value={`${progress}%`} label="Progress" icon="trending-up"/>
   <Stat value={roadmapCount()} label="Phases" icon="map"/>
   <Stat value={savedJobs.length} label="Jobs" icon="briefcase"/>
  </View>
  <Card><Text style={s.title}>Today</Text><Text style={[s.muted,{marginTop:5}]}>Focus on one technical task, one interview question and one application.</Text>
   <Pressable onPress={()=>router.push("/roadmap")} style={{marginTop:14}}><Text style={{color:C.primary,fontWeight:"800"}}>Continue roadmap →</Text></Pressable>
  </Card>
  <Text style={[s.title,{marginBottom:10}]}>Quick actions</Text>
  <Card><Pressable onPress={()=>router.push("/generator")}><Text style={s.title}>✨ Generate / update roadmap</Text><Text style={s.muted}>Set your role, salary target, timeline and skills.</Text></Pressable></Card>
  <Card><Pressable onPress={()=>router.push("/interviews")}><Text style={s.title}>🎯 Interview practice</Text><Text style={s.muted}>AD, Entra ID, IAM, SSO and behavioral questions.</Text></Pressable></Card>
  <Card><Pressable onPress={()=>router.push("/jobs")}><Text style={s.title}>💼 Job tracker</Text><Text style={s.muted}>Track saved applications and follow-ups.</Text></Pressable></Card>
  <Card><Pressable onPress={()=>router.push("/profile")}><Text style={s.title}>👤 Career profile</Text><Text style={s.muted}>Keep your target and skill inventory current.</Text></Pressable></Card>
 </Screen>
}
function roadmapCount(){return 6}
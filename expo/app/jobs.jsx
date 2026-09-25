import React from "react";
import {View,Text,Pressable} from "react-native";
import {Screen,Header,Card,Chip,C,s} from "../src/ui";
import {useRoadmap} from "../src/context/RoadmapContext";
export default function Jobs(){
 const {savedJobs,updateJob}=useRoadmap();
 return <Screen><Header title="Job Tracker" subtitle="Keep applications, status and follow-ups in one place"/>
 {savedJobs.map(j=><Card key={j.id}><View style={{flexDirection:"row",justifyContent:"space-between"}}><View style={{flex:1}}><Text style={s.title}>{j.role}</Text><Text style={{marginTop:4,fontWeight:"700"}}>{j.company}</Text><Text style={s.muted}>{j.location} • {j.exp}</Text></View><Chip text={j.status}/></View>
 <Text style={[s.muted,{marginTop:9}]}>Package: {j.salary}</Text>
 <View style={{flexDirection:"row",gap:8,marginTop:10}}>{["Saved","Applied","Interview","Rejected","Offer"].map(st=><Pressable key={st} onPress={()=>updateJob(j.id,{status:st})}><Text style={{fontSize:11,fontWeight:"800",color:j.status===st?C.primary:C.muted}}>{st}</Text></Pressable>)}</View>
 </Card>)}
 <Card><Text style={s.title}>Verification rule</Text><Text style={[s.muted,{marginTop:5,lineHeight:20}]}>For live applications, verify experience requirements, current status, salary/package evidence and the direct official application page before treating a listing as confirmed.</Text></Card>
 </Screen>
}
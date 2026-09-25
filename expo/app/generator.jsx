import React,{useState} from "react";
import {View,Text} from "react-native";
import {router} from "expo-router";
import {Screen,Header,Card,Field,Button,Chip,C,s} from "../src/ui";
import {useRoadmap} from "../src/context/RoadmapContext";
export default function Generator(){
 const {profile,setProfile}=useRoadmap();
 const [p,setP]=useState(profile);
 const save=()=>{setProfile(p);router.replace("/roadmap")};
 return <Screen><Header title="Roadmap Generator" subtitle="Build a plan from your actual starting point"/>
 <Card>
  <Field label="Name" value={p.name} onChangeText={v=>setP({...p,name:v})}/>
  <Field label="Target role" value={p.targetRole} onChangeText={v=>setP({...p,targetRole:v})}/>
  <Field label="Experience" value={p.experience} onChangeText={v=>setP({...p,experience:v})}/>
  <Field label="Current salary / starting point" value={p.currentSalary} onChangeText={v=>setP({...p,currentSalary:v})}/>
  <Field label="Target salary" value={p.targetSalary} onChangeText={v=>setP({...p,targetSalary:v})}/>
  <Field label="Timeline" value={p.timeline} onChangeText={v=>setP({...p,timeline:v})}/>
  <Text style={s.label}>Preferred locations</Text><View style={{flexDirection:"row",flexWrap:"wrap"}}>{["Lucknow","Noida","Delhi NCR","Bengaluru","Pune","Hyderabad","Remote India"].map(x=><Chip key={x} text={x} active={p.locations.includes(x)} onPress={()=>setP({...p,locations:p.locations.includes(x)?p.locations.filter(y=>y!==x):[...p.locations,x]})}/>)}</View>
  <Button title="Save & open roadmap" icon="sparkles-outline" onPress={save}/>
 </Card>
 <Card><Text style={s.title}>Skill-gap logic</Text><Text style={[s.muted,{marginTop:6,lineHeight:20}]}>The generator uses your target role, current skills, timeline and priority domains to structure phases, projects and interview preparation. The included IAM template starts with AD/Windows and progresses through Entra ID, SSO/federation, lifecycle, governance and IAM platforms.</Text></Card>
 </Screen>
}
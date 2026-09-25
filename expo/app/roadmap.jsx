import React from "react";
import {View,Text,Pressable} from "react-native";
import {Screen,Header,Card,C,s} from "../src/ui";
import {useRoadmap} from "../src/context/RoadmapContext";
export default function Roadmap(){
 const {roadmap,toggleTask,progress}=useRoadmap();
 return <Screen><Header title="My Roadmap" subtitle={`${progress}% complete • tap a task to mark it done`}/>
 {roadmap.map((p,pi)=><Card key={p.id}>
  <View style={{flexDirection:"row",justifyContent:"space-between"}}><View style={{flex:1}}><Text style={s.title}>{pi+1}. {p.title}</Text><Text style={s.muted}>{p.weeks}</Text></View><Text style={{fontWeight:"900",color:C.primary}}>{Math.round(p.tasks.filter(x=>x[1]).length/p.tasks.length*100)}%</Text></View>
  <Text style={{marginTop:10,color:C.muted,lineHeight:20}}>{p.goal}</Text>
  {p.tasks.map((t,i)=><Pressable key={i} onPress={()=>toggleTask(p.id,i)} style={{flexDirection:"row",alignItems:"center",paddingVertical:10,borderTopWidth:1,borderTopColor:C.border,marginTop:7}}>
   <View style={{width:23,height:23,borderRadius:7,borderWidth:2,borderColor:t[1]?C.green:C.border,backgroundColor:t[1]?C.green:"#fff",alignItems:"center",justifyContent:"center",marginRight:10}}>{t[1]&&<Text style={{color:"#fff",fontWeight:"900"}}>✓</Text>}</View>
   <Text style={{flex:1,color:t[1]?C.muted:C.text,textDecorationLine:t[1]?"line-through":"none"}}>{t[0]}</Text>
  </Pressable>)}
  <View style={{backgroundColor:"#F8F9FC",padding:12,borderRadius:12,marginTop:10}}><Text style={{fontWeight:"800",color:C.text}}>Project</Text><Text style={[s.muted,{marginTop:4,lineHeight:19}]}>{p.project}</Text></View>
 </Card>)}
 </Screen>
}
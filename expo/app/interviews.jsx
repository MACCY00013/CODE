import React,{useState} from "react";
import {View,Text,Pressable} from "react-native";
import {Screen,Header,Card,Chip,C,s} from "../src/ui";
import {useRoadmap} from "../src/context/RoadmapContext";
export default function Interviews(){
 const {interviews}=useRoadmap(); const [cat,setCat]=useState("All"); const [open,setOpen]=useState(null);
 const cats=["All",...new Set(interviews.map(x=>x.category))]; const data=cat==="All"?interviews:interviews.filter(x=>x.category===cat);
 return <Screen><Header title="Interview Lab" subtitle="Practice technical and behavioral questions"/>
 <View style={{flexDirection:"row",flexWrap:"wrap",marginBottom:8}}>{cats.map(x=><Chip key={x} text={x} active={cat===x} onPress={()=>setCat(x)}/>)}</View>
 {data.map((x,i)=><Card key={x.id}><Text style={{color:C.primary,fontWeight:"800",fontSize:12}}>{x.category}</Text><Pressable onPress={()=>setOpen(open===x.id?null:x.id)}><Text style={[s.title,{marginTop:6,lineHeight:23}]}>Q. {x.q}</Text></Pressable>{open===x.id&&<View style={{marginTop:10,backgroundColor:"#F8F9FC",padding:12,borderRadius:12}}><Text style={{fontWeight:"800"}}>Answer framework</Text><Text style={[s.muted,{marginTop:5,lineHeight:20}]}>{x.a}</Text></View>}</Card>)}
 </Screen>
}
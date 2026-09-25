import React from "react";
import {View,Text} from "react-native";
import {Screen,Header,Card,Button,C,s} from "../src/ui";
import {useRoadmap} from "../src/context/RoadmapContext";
export default function Profile(){
 const {profile,reset}=useRoadmap();
 return <Screen><Header title="Career Profile" subtitle="Your saved career direction"/>
 <Card><Text style={s.title}>{profile.name}</Text><Text style={[s.muted,{marginTop:5}]}>Target: {profile.targetRole}</Text><Text style={[s.muted,{marginTop:4}]}>Experience: {profile.experience}</Text><Text style={[s.muted,{marginTop:4}]}>Target: {profile.targetSalary}</Text><Text style={[s.muted,{marginTop:4}]}>Timeline: {profile.timeline}</Text></Card>
 <Card><Text style={s.title}>Skill inventory</Text><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:10}}>{profile.skills.map(x=><View key={x} style={{backgroundColor:"#F2F4F7",padding:9,borderRadius:10,marginRight:7,marginBottom:7}}><Text style={{fontSize:12}}>{x}</Text></View>)}</View></Card>
 <Card><Text style={s.title}>Locations</Text><Text style={[s.muted,{marginTop:7}]}>{profile.locations.join(" • ")}</Text></Card>
 <Button title="Reset app data" secondary icon="refresh-outline" onPress={reset}/>
 </Screen>
}
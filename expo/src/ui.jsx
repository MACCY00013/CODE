import React from "react";
import {View,Text,Pressable,StyleSheet,TextInput,ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";

export const C={
  bg:"#F5F7FB", card:"#FFFFFF", text:"#172033", muted:"#667085",
  primary:"#5B5FEF", border:"#E4E7EC", green:"#12B76A", orange:"#F79009",
  red:"#F04438", dark:"#111827"
};
export function Screen({children,scroll=true}) {
  const body=<View style={s.screen}>{children}</View>;
  return scroll?<ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>{body}</ScrollView>:body;
}
export function Header({title,subtitle}){return <View style={s.header}><Text style={s.h1}>{title}</Text>{subtitle&&<Text style={s.sub}>{subtitle}</Text>}</View>}
export function Card({children,style}){return <View style={[s.card,style]}>{children}</View>}
export function Button({title,onPress,secondary=false,icon}){return <Pressable onPress={onPress} style={[s.button,secondary&&s.secondary]}><>{icon&&<Ionicons name={icon} size={18} color={secondary?C.primary:"#fff"}/>}<Text style={[s.buttonText,secondary&&{color:C.primary}]}>{title}</Text></></Pressable>}
export function Field({label,value,onChangeText,placeholder,multiline=false}){return <View style={{marginBottom:14}}><Text style={s.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#98A2B3" multiline={multiline} style={[s.input,multiline&&{height:90,textAlignVertical:"top"}]}/></View>}
export function Chip({text,active=false,onPress}){return <Pressable onPress={onPress} style={[s.chip,active&&s.chipActive]}><Text style={[s.chipText,active&&{color:"#fff"}]}>{text}</Text></Pressable>}
export function Stat({value,label,icon}){return <Card style={{flex:1}}><Ionicons name={icon} size={22} color={C.primary}/><Text style={s.stat}>{value}</Text><Text style={s.muted}>{label}</Text></Card>}
export const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:100},
 header:{marginBottom:18},h1:{fontSize:28,fontWeight:"800",color:C.text},sub:{fontSize:14,color:C.muted,marginTop:5},
 card:{backgroundColor:C.card,borderRadius:18,padding:16,marginBottom:14,borderWidth:1,borderColor:C.border},
 title:{fontSize:17,fontWeight:"800",color:C.text}, muted:{color:C.muted,fontSize:13},label:{fontSize:13,fontWeight:"700",color:C.text,marginBottom:7},
 input:{backgroundColor:"#fff",borderWidth:1,borderColor:C.border,borderRadius:12,paddingHorizontal:13,paddingVertical:11,fontSize:15,color:C.text},
 button:{backgroundColor:C.primary,padding:13,borderRadius:12,alignItems:"center",justifyContent:"center",flexDirection:"row",gap:8,marginBottom:10},
 secondary:{backgroundColor:"#EEF0FF"},buttonText:{color:"#fff",fontWeight:"800",fontSize:14},
 chip:{paddingHorizontal:12,paddingVertical:8,borderRadius:20,borderWidth:1,borderColor:C.border,backgroundColor:"#fff",marginRight:7,marginBottom:7},
 chipActive:{backgroundColor:C.primary,borderColor:C.primary},chipText:{fontSize:12,color:C.text,fontWeight:"700"},
 stat:{fontSize:24,fontWeight:"900",color:C.text,marginTop:6}
});
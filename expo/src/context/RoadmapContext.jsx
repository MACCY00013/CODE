import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {defaultProfile, defaultRoadmap, interviewSets, jobs} from "../data/defaultRoadmap";

const Ctx = createContext(null);
const KEY = "@career_roadmap_v2";

export function RoadmapProvider({children}) {
  const [profile,setProfile] = useState(defaultProfile);
  const [roadmap,setRoadmap] = useState(defaultRoadmap);
  const [savedJobs,setSavedJobs] = useState(jobs);
  const [interviews,setInterviews] = useState(interviewSets);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{ (async()=>{
    try {
      const raw=await AsyncStorage.getItem(KEY);
      if(raw){ const x=JSON.parse(raw); setProfile(x.profile||defaultProfile); setRoadmap(x.roadmap||defaultRoadmap); setSavedJobs(x.savedJobs||jobs); setInterviews(x.interviews||interviewSets); }
    } finally { setLoading(false); }
  })(); },[]);

  useEffect(()=>{ if(!loading) AsyncStorage.setItem(KEY,JSON.stringify({profile,roadmap,savedJobs,interviews})); },[profile,roadmap,savedJobs,interviews,loading]);

  const toggleTask=(pid,idx)=>setRoadmap(r=>r.map(p=>p.id===pid?{...p,tasks:p.tasks.map((t,i)=>i===idx?[t[0],!t[1]]:t)}:p));
  const addJob=j=>setSavedJobs(x=>[{...j,id:"custom-"+Date.now(),status:"Saved"},...x]);
  const updateJob=(id,patch)=>setSavedJobs(x=>x.map(j=>j.id===id?{...j,...patch}:j));
  const progress=useMemo(()=>{
    const all=roadmap.flatMap(p=>p.tasks); return all.length?Math.round(all.filter(t=>t[1]).length/all.length*100):0;
  },[roadmap]);

  const reset=async()=>{setProfile(defaultProfile);setRoadmap(defaultRoadmap);setSavedJobs(jobs);setInterviews(interviewSets);await AsyncStorage.removeItem(KEY);};
  return <Ctx.Provider value={{profile,setProfile,roadmap,toggleTask,progress,savedJobs,addJob,updateJob,interviews,setInterviews,reset,loading}}>{children}</Ctx.Provider>
}
export const useRoadmap=()=>useContext(Ctx);
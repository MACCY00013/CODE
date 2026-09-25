import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  degree: string;
  job_title?: string;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  user_id: string;
  skill_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
};

export type Roadmap = {
  id: string;
  user_id: string;
  goal: string;
  roadmap_content: RoadmapContent;
  created_at: string;
  updated_at: string;
};

export type RoadmapContent = {
  title: string;
  description: string;
  months: MonthPlan[];
};

export type MonthPlan = {
  month: number;
  title: string;
  skills: string[];
  projects: string[];
  certifications: string[];
  interview_prep: string[];
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  content: ResumeContent;
  created_at: string;
  updated_at: string;
};

export type ResumeContent = {
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
};

export type ExperienceItem = {
  title: string;
  company: string;
  duration: string;
  description: string[];
};

export type EducationItem = {
  degree: string;
  institution: string;
  year: string;
};

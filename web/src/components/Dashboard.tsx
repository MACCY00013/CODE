import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Profile, type Skill, type Roadmap } from '../lib/supabase';
import { User, Code, Target, FileText, LogOut, Loader2, ChevronRight, Calendar, Edit3 } from 'lucide-react';
import { SkillsManager } from './SkillsManager';
import { RoadmapGenerator } from './RoadmapGenerator';
import { ResumeBuilder } from './ResumeBuilder';

type Tab = 'dashboard' | 'skills' | 'roadmap' | 'resume';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => { if (user) fetchUserData(); }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user!.id).maybeSingle();
      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || '');
        setDegree(profileData.degree || '');
        setJobTitle(profileData.job_title || '');
      }
      const { data: skillsData } = await supabase.from('skills').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      setSkills(skillsData || []);
      const { data: roadmapsData } = await supabase.from('roadmaps').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      setRoadmaps(roadmapsData || []);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    await supabase.from('profiles').update({ full_name: fullName, degree, job_title: jobTitle, updated_at: new Date().toISOString() }).eq('id', user!.id);
    setProfile(prev => prev ? { ...prev, full_name: fullName, degree, job_title: jobTitle } : null);
    setEditingProfile(false);
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>;

  const sidebarItems = [
    { id: 'dashboard' as Tab, icon: User, label: 'Dashboard' },
    { id: 'skills' as Tab, icon: Code, label: 'Skills' },
    { id: 'roadmap' as Tab, icon: Target, label: 'Roadmap' },
    { id: 'resume' as Tab, icon: FileText, label: 'Resume' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      <aside className="w-64 min-h-screen bg-slate-800/50 border-r border-slate-700/50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"><Target className="w-5 h-5 text-white" /></div>
          <span className="text-lg font-bold text-white">CareerPath</span>
        </div>
        <nav className="space-y-1 flex-1">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
              <item.icon className="w-5 h-5" />{item.label}
            </button>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"><LogOut className="w-5 h-5" />Sign Out</button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.full_name || 'User'}</h1>
              <p className="text-slate-400">Manage your career journey and track your progress</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Code className="w-6 h-6 text-emerald-400" /></div>
                  <div><p className="text-2xl font-bold text-white">{skills.length}</p><p className="text-slate-400 text-sm">Skills Added</p></div>
                </div>
                <button onClick={() => setActiveTab('skills')} className="text-emerald-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">Manage Skills<ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-teal-500/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center"><Target className="w-6 h-6 text-teal-400" /></div>
                  <div><p className="text-2xl font-bold text-white">{roadmaps.length}</p><p className="text-slate-400 text-sm">Roadmaps Created</p></div>
                </div>
                <button onClick={() => setActiveTab('roadmap')} className="text-teal-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">View Roadmaps<ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center"><FileText className="w-6 h-6 text-cyan-400" /></div>
                  <div><p className="text-2xl font-bold text-white">Ready</p><p className="text-slate-400 text-sm">Resume Builder</p></div>
                </div>
                <button onClick={() => setActiveTab('resume')} className="text-cyan-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">Build Resume<ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Profile</h2>
                {!editingProfile && <button onClick={() => setEditingProfile(true)} className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors flex items-center gap-1"><Edit3 className="w-4 h-4" />Edit</button>}
              </div>
              {editingProfile ? (
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" /></div>
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Degree/Field</label><input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" /></div>
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label><input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" /></div>
                  <div className="flex gap-3">
                    <button onClick={updateProfile} className="px-6 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors">Save</button>
                    <button onClick={() => setEditingProfile(false)} className="px-6 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  <div><p className="text-slate-400 text-sm mb-1">Full Name</p><p className="text-white font-medium">{profile?.full_name || 'Not set'}</p></div>
                  <div><p className="text-slate-400 text-sm mb-1">Degree</p><p className="text-white font-medium">{profile?.degree || 'Not set'}</p></div>
                  <div><p className="text-slate-400 text-sm mb-1">Job Title</p><p className="text-white font-medium">{profile?.job_title || 'Not set'}</p></div>
                </div>
              )}
            </div>

            {roadmaps.length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Roadmap</h2>
                <div className="p-4 bg-slate-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{roadmaps[0].roadmap_content?.title || 'Career Roadmap'}</h3>
                    <span className="text-slate-400 text-sm flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(roadmaps[0].created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Goal: {roadmaps[0].goal}</p>
                  <button onClick={() => setActiveTab('roadmap')} className="text-emerald-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">View Full Roadmap<ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'skills' && <SkillsManager skills={skills} onSkillsUpdate={fetchUserData} />}
        {activeTab === 'roadmap' && <RoadmapGenerator skills={skills} roadmaps={roadmaps} onRoadmapUpdate={fetchUserData} profile={profile} />}
        {activeTab === 'resume' && <ResumeBuilder profile={profile} skills={skills} />}
      </main>
    </div>
  );
}

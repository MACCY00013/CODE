import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Skill, type Roadmap, type Profile } from '../lib/supabase';
import { Target, Sparkles, Loader2, Trash2, ChevronDown, ChevronUp, Calendar, Award, Briefcase, BookOpen, MessageSquare } from 'lucide-react';

interface Props {
  skills: Skill[];
  roadmaps: Roadmap[];
  onRoadmapUpdate: () => void;
  profile: Profile | null;
}

export function RoadmapGenerator({ skills, roadmaps, onRoadmapUpdate, profile }: Props) {
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const generateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !user) return;
    if (skills.length === 0) { setError('Please add at least one skill before generating a roadmap'); return; }
    setError(null);
    setGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ degree: profile?.degree || 'Not specified', skills: skills.map((s) => s.skill_name), goal: goal.trim() }),
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Failed to generate roadmap'); }
      const data = await response.json();
      await supabase.from('roadmaps').insert({ user_id: user.id, goal: goal.trim(), roadmap_content: data.roadmap });
      setGoal('');
      onRoadmapUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setGenerating(false);
    }
  };

  const deleteRoadmap = async (id: string) => {
    setDeleting(id);
    try { await supabase.from('roadmaps').delete().eq('id', id); onRoadmapUpdate(); } finally { setDeleting(null); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Career Roadmap</h1>
        <p className="text-slate-400">Generate a personalized 6-month roadmap based on your skills</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
        <form onSubmit={generateRoadmap} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">What is your career goal?</label>
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Become a Senior Software Engineer" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
          </div>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl"><p className="text-sm text-red-400">{error}</p></div>}
          <button type="submit" disabled={generating || !goal.trim()} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
            {generating ? <><Loader2 className="w-5 h-5 animate-spin" />Generating...</> : <><Sparkles className="w-5 h-5" />Generate Roadmap</>}
          </button>
          {skills.length === 0 && <p className="text-sm text-amber-400 text-center">Add skills in the Skills tab first</p>}
        </form>
      </div>

      {roadmaps.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Your Roadmaps</h2>
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="p-6 cursor-pointer flex items-center justify-between" onClick={() => setExpanded(expanded === roadmap.id ? null : roadmap.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"><Target className="w-6 h-6 text-white" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{roadmap.roadmap_content?.title || 'Career Roadmap'}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-400 text-sm flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(roadmap.created_at).toLocaleDateString()}</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-emerald-400 text-sm">{roadmap.goal}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); deleteRoadmap(roadmap.id); }} disabled={deleting === roadmap.id} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    {deleting === roadmap.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                  {expanded === roadmap.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>
              {expanded === roadmap.id && roadmap.roadmap_content?.months && (
                <div className="border-t border-slate-700/50 p-6 space-y-6">
                  {roadmap.roadmap_content.description && <p className="text-slate-300">{roadmap.roadmap_content.description}</p>}
                  {roadmap.roadmap_content.months.map((month) => (
                    <div key={month.month} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/30">
                      <h4 className="text-md font-bold text-emerald-400 mb-4">{month.title}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { icon: BookOpen, color: 'teal', label: 'Skills', items: month.skills },
                          { icon: Briefcase, color: 'cyan', label: 'Projects', items: month.projects },
                          { icon: Award, color: 'amber', label: 'Certifications', items: month.certifications },
                          { icon: MessageSquare, color: 'rose', label: 'Interview Prep', items: month.interview_prep },
                        ].map((section) => (
                          <div key={section.label}>
                            <div className="flex items-center gap-2 mb-2">
                              <section.icon className={`w-4 h-4 text-${section.color}-400`} />
                              <span className="text-sm font-medium text-slate-300">{section.label}</span>
                            </div>
                            <ul className="space-y-1">
                              {section.items?.map((item, idx) => (
                                <li key={idx} className="text-sm text-slate-400 flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full bg-${section.color}-400`} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-4"><Target className="w-8 h-8 text-slate-500" /></div>
          <h3 className="text-lg font-medium text-white mb-2">No roadmaps yet</h3>
          <p className="text-slate-400 text-sm">Generate your first roadmap by entering a career goal above</p>
        </div>
      )}
    </div>
  );
}

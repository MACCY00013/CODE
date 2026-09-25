import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Skill } from '../lib/supabase';
import { Plus, Trash2, Loader2, Code, Star, Sparkles } from 'lucide-react';

interface Props {
  skills: Skill[];
  onSkillsUpdate: () => void;
}

export function SkillsManager({ skills, onSkillsUpdate }: Props) {
  const { user } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !user) return;
    setLoading(true);
    try {
      await supabase.from('skills').insert({ user_id: user.id, skill_name: newSkill.trim(), level: newLevel });
      setNewSkill('');
      setNewLevel('beginner');
      onSkillsUpdate();
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (skillId: string) => {
    setDeleting(skillId);
    try {
      await supabase.from('skills').delete().eq('id', skillId);
      onSkillsUpdate();
    } finally {
      setDeleting(null);
    }
  };

  const getLevelColor = (level: string) => {
    if (level === 'advanced') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (level === 'intermediate') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
        <p className="text-slate-400">Add your skills to get personalized roadmaps</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <form onSubmit={addSkill} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Skill Name</label>
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g., React, Python" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-slate-300 mb-2">Level</label>
              <select value={newLevel} onChange={(e) => setNewLevel(e.target.value as typeof newLevel)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading || !newSkill.trim()} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" />Add Skill</>}
          </button>
        </form>
      </div>

      {skills.length > 0 ? (
        <div className="grid gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:border-slate-600/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center"><Code className="w-5 h-5 text-emerald-400" /></div>
                <div>
                  <h3 className="text-white font-medium">{skill.skill_name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(skill.level)}`}>
                    {[...Array(skill.level === 'advanced' ? 3 : skill.level === 'intermediate' ? 2 : 1)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    <span className="capitalize">{skill.level}</span>
                  </span>
                </div>
              </div>
              <button onClick={() => deleteSkill(skill.id)} disabled={deleting === skill.id} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                {deleting === skill.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-4"><Sparkles className="w-8 h-8 text-slate-500" /></div>
          <h3 className="text-lg font-medium text-white mb-2">No skills added yet</h3>
          <p className="text-slate-400 text-sm">Add your first skill to get started</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { Profile, Skill } from '../lib/supabase';
import { FileText, Plus, Trash2, Download, User, Briefcase, GraduationCap } from 'lucide-react';

interface Props {
  profile: Profile | null;
  skills: Skill[];
}

interface Experience { id: string; title: string; company: string; duration: string; description: string[]; }
interface Education { id: string; degree: string; institution: string; year: string; }

export function ResumeBuilder({ profile, skills }: Props) {
  const [summary, setSummary] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [newExp, setNewExp] = useState({ title: '', company: '', duration: '', description: '' });
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '' });

  const addExperience = () => {
    if (!newExp.title.trim()) return;
    setExperiences([...experiences, { id: Date.now().toString(), title: newExp.title, company: newExp.company, duration: newExp.duration, description: newExp.description.split('\n').filter((d) => d.trim()) }]);
    setNewExp({ title: '', company: '', duration: '', description: '' });
  };

  const addEducation = () => {
    if (!newEdu.degree.trim()) return;
    setEducations([...educations, { id: Date.now().toString(), degree: newEdu.degree, institution: newEdu.institution, year: newEdu.year }]);
    setNewEdu({ degree: '', institution: '', year: '' });
  };

  const downloadResume = () => {
    const content = `
================================
          RESUME
================================
${profile?.full_name || 'Your Name'}
${profile?.job_title || ''}
${profile?.email || ''}

--------------------------------
PROFESSIONAL SUMMARY
--------------------------------
${summary || 'A dedicated professional seeking new opportunities.'}

--------------------------------
SKILLS
--------------------------------
${skills.map((s) => `${s.skill_name} (${s.level})`).join('\n')}

--------------------------------
EXPERIENCE
--------------------------------
${experiences.map((exp) => `\n${exp.title} | ${exp.company}\n${exp.duration}\n${exp.description.map((d) => `- ${d}`).join('\n')}`).join('\n')}

--------------------------------
EDUCATION
--------------------------------
${educations.map((edu) => `\n${edu.degree}\n${edu.institution}\n${edu.year}`).join('\n')}
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Builder</h1>
          <p className="text-slate-400">Create and download your professional resume</p>
        </div>
        <button onClick={downloadResume} disabled={!profile} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
          <Download className="w-4 h-4" />Download
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4"><User className="w-5 h-5 text-emerald-400" /><h2 className="text-lg font-semibold text-white">Professional Summary</h2></div>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} placeholder="Brief summary of your professional background..." className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none" />
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4"><Briefcase className="w-5 h-5 text-teal-400" /><h2 className="text-lg font-semibold text-white">Work Experience</h2></div>
            <div className="space-y-4 mb-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{exp.title}</h3>
                      <p className="text-slate-400 text-sm">{exp.company}</p>
                      <p className="text-slate-500 text-xs">{exp.duration}</p>
                    </div>
                    <button onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))} className="p-1 text-slate-500 hover:text-red-400 rounded transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <input type="text" value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} placeholder="Job Title" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              <input type="text" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} placeholder="Company Name" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              <input type="text" value={newExp.duration} onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })} placeholder="Duration" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              <textarea value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} rows={3} placeholder="Key responsibilities (one per line)" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none" />
              <button onClick={addExperience} disabled={!newExp.title.trim()} className="w-full py-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 font-medium rounded-xl hover:bg-teal-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Experience</button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4"><GraduationCap className="w-5 h-5 text-cyan-400" /><h2 className="text-lg font-semibold text-white">Education</h2></div>
            <div className="space-y-4 mb-4">
              {educations.map((edu) => (
                <div key={edu.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{edu.degree}</h3>
                      <p className="text-slate-400 text-sm">{edu.institution}</p>
                      <p className="text-slate-500 text-xs">{edu.year}</p>
                    </div>
                    <button onClick={() => setEducations(educations.filter((e) => e.id !== edu.id))} className="p-1 text-slate-500 hover:text-red-400 rounded transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <input type="text" value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} placeholder="Degree" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              <input type="text" value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} placeholder="Institution" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              <input type="text" value={newEdu.year} onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })} placeholder="Year" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
              <button onClick={addEducation} disabled={!newEdu.degree.trim()} className="w-full py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add Education</button>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-slate-900">
            <div className="text-center mb-6 pb-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{profile?.full_name || 'Your Name'}</h1>
              {profile?.job_title && <p className="text-slate-600">{profile.job_title}</p>}
              {profile?.email && <p className="text-slate-500 text-sm mt-1">{profile.email}</p>}
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200">PROFESSIONAL SUMMARY</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{summary || 'A dedicated professional seeking new opportunities.'}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200">SKILLS</h2>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((skill) => <span key={skill.id} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{skill.skill_name}</span>) : <p className="text-sm text-slate-500 italic">No skills added</p>}
              </div>
            </div>
            {experiences.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200">EXPERIENCE</h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-semibold text-slate-900">{exp.title}</h3>
                        <span className="text-xs text-slate-500">{exp.duration}</span>
                      </div>
                      <p className="text-sm text-slate-600">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {educations.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2 pb-1 border-b border-slate-200">EDUCATION</h2>
                <div className="space-y-2">
                  {educations.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-semibold text-slate-900">{edu.degree}</h3>
                        <span className="text-xs text-slate-500">{edu.year}</span>
                      </div>
                      <p className="text-sm text-slate-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

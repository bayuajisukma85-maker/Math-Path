import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  Plus, 
  BookOpen, 
  Users, 
  Save, 
  Layers, 
  CheckCircle2, 
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { Topic, Phase } from '../types';

interface AdminDashboardProps {
  onNavigate?: (view: string, param?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { authFetch } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'TOPICS' | 'USERS'>('TOPICS');

  // Form modal/state for new topic
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPassingScore, setNewPassingScore] = useState(75);
  const [selectedPhase, setSelectedPhase] = useState('phase-d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currRes, usersRes] = await Promise.all([
          authFetch('/api/curriculum'),
          authFetch('/api/admin/users')
        ]);

        if (currRes.ok) {
          const currJson = await currRes.json();
          setTopics(currJson.topics || []);
          setPhases(currJson.phases || []);
        }
        if (usersRes.ok) {
          const usersJson = await usersRes.json();
          setUsers(usersJson.users || []);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      }
    };

    fetchData();
  }, []);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) return;

    try {
      const res = await authFetch('/api/admin/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug,
          levelId: 'level-smp-3',
          phaseId: selectedPhase,
          description: newDescription,
          passingScore: Number(newPassingScore),
          estimatedMinutes: 45
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTopics(prev => [...prev, data.topic]);
        setIsAddingTopic(false);
        setNewTitle('');
        setNewSlug('');
        setNewDescription('');
        alert('Topik kurikulum baru berhasil disimpan ke dalam engine adaptif!');
      }
    } catch (err) {
      console.error('Failed to create topic:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Administrator Kurikulum MathPath</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Konfigurasi Kurikulum & Pengaturan KKM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola standar ketuntasan minimum (KKM), peta prasyarat antartopik, dan hak akses pengguna.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('admin-ai-curriculum')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>AI Curriculum Engine</span>
            </button>
          )}

          <button
            onClick={() => setIsAddingTopic(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Topik Kurikulum</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('TOPICS')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'TOPICS'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Struktur Topik & Prasyarat ({topics.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'USERS'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen Pengguna ({users.length})</span>
        </button>
      </div>

      {/* Add Topic Modal / Form */}
      {isAddingTopic && (
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-900">Tambah Topik Pembelajaran Baru</h2>
          <form onSubmit={handleCreateTopic} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Topik</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => {
                    setNewTitle(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="Misal: Vektor dan Transformasi Geometri"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fase Kurikulum</label>
                <select
                  value={selectedPhase}
                  onChange={e => setSelectedPhase(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                >
                  {phases.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.gradeRange})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Standar KKM (0-100)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={newPassingScore}
                  onChange={e => setNewPassingScore(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
              <textarea
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Rangkuman cakupan materi..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingTopic(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                Simpan Topik
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TOPICS TABLE */}
      {activeTab === 'TOPICS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Urutan</th>
                  <th className="px-6 py-3.5">Judul Topik</th>
                  <th className="px-6 py-3.5">Fase</th>
                  <th className="px-6 py-3.5">KKM Ketuntasan</th>
                  <th className="px-6 py-3.5">Prasyarat (Prerequisites)</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topics.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{t.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{t.slug}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-indigo-700">
                      {t.phaseId?.replace('phase-', 'Fase ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {t.passingScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {t.prerequisiteIds?.length ? (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {t.prerequisiteIds.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Topik Fondasi (None)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Nama Lengkap</th>
                  <th className="px-6 py-3.5">Email Akun</th>
                  <th className="px-6 py-3.5">Peran (Role)</th>
                  <th className="px-6 py-3.5">Kelas / Jabatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'teacher' ? 'bg-sky-100 text-sky-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.classGrade || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

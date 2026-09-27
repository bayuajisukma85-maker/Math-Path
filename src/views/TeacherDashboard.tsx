import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  ArrowUpRight, 
  BookOpen, 
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (view: string, param?: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { authFetch } = useAuth();
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        const res = await authFetch('/api/teacher/overview');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load teacher overview:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const students = (data?.students || []).filter((s: any) =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Dashboard Guru & Fasilitator Kurikulum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pantauan Kemajuan Belajar Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring ketuntasan topik, skor asesmen, dan deteksi siswa yang membutuhkan pendampingan remedial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('teacher-ai-curriculum')}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Curriculum & Content Generator</span>
          </button>

          <button
            onClick={() => onNavigate('teacher-security')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Monitoring Asesmen AI ({data?.reviewRequiredCount || 0} Perlu Tinjauan)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Siswa Terdaftar</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {data?.totalStudents || 0} Siswa
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Kelas 10 SMA & Fase D-E</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Rata-rata Ketuntasan</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {data?.students?.[0]?.averageMastery || 78}%
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">Standar KKM Nasional: 75%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Asesmen Selesai</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {data?.totalAssessmentsCompleted || 0} Sesi
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Diagnostik & Sumatif Topik</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Perlu Tinjauan Integritas</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {data?.reviewRequiredCount || 0} Sesi
          </div>
          <p className="text-[11px] text-rose-500 mt-1">Ada flag perpindahan layar</p>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daftar Kemajuan Siswa</h2>
            <p className="text-xs text-slate-500">Profil mastery dan status remedial terkini</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Nama Siswa</th>
                <th className="px-6 py-3.5">Fase / Kelas</th>
                <th className="px-6 py-3.5">Topik Dikuasai</th>
                <th className="px-6 py-3.5">Rata-Rata Nilai</th>
                <th className="px-6 py-3.5">Status Remedial</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student: any) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{student.fullName}</div>
                    <div className="text-[11px] text-slate-400">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {student.classGrade}
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-700">
                    {student.masteredTopicsCount} Topik
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      student.averageMastery >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {student.averageMastery}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.activeRemedialCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        <RotateCcw className="w-3 h-3" />
                        {student.activeRemedialCount} Topik Perlu Remedial
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Semua Prasyarat Aman
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Buka Rapor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

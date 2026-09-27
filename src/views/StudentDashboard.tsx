import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  ArrowRight, 
  AlertCircle, 
  Award,
  BookOpen,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Topic, TopicStatus, Phase } from '../types';

interface StudentDashboardProps {
  onNavigate: (view: string, param?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user, authFetch } = useAuth();
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('ALL');
  const [progressData, setProgressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pathRes, progressRes, currRes] = await Promise.all([
          authFetch('/api/student/learning-path'),
          authFetch('/api/student/progress'),
          authFetch('/api/curriculum')
        ]);

        if (pathRes.ok) {
          const pathJson = await pathRes.json();
          setLearningPath(pathJson.path || []);
        }
        if (progressRes.ok) {
          const progJson = await progressRes.json();
          setProgressData(progJson);
        }
        if (currRes.ok) {
          const currJson = await currRes.json();
          setPhases(currJson.phases || []);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const masteredCount = learningPath.filter(t => t.status === 'MASTERED').length;
  const totalTopics = learningPath.length || 1;
  const overallPercent = Math.round((masteredCount / totalTopics) * 100);

  // Find current active topic
  const currentTopic = learningPath.find(t => t.status === 'AVAILABLE' || t.status === 'IN_PROGRESS') 
    || learningPath[0];

  const activeRemedials = progressData?.activeRemedial || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Jalur Pembelajaran Adaptif Kurikulum Indonesia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Selamat Datang, {user?.fullName}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            MathPath menyesuaikan kecepatan dan materi berdasarkan kompetensi unikmu. Belajar konsep, tuntaskan latihan, dan capai mastery di setiap fase!
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {currentTopic && (
              <button
                onClick={() => onNavigate('topic', currentTopic.slug)}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                <span>Lanjut Belajar: {currentTopic.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onNavigate('diagnostic')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Asesmen Diagnostik Ulang</span>
            </button>
          </div>
        </div>

        {/* Progress pill in banner */}
        <div className="mt-8 sm:mt-0 sm:absolute sm:top-10 sm:right-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[200px]">
          <div className="text-xs text-indigo-200 font-medium">Penguasaan Kurikulum</div>
          <div className="text-3xl font-black text-white mt-1">{overallPercent}%</div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-indigo-200 mt-2">
            {masteredCount} dari {totalTopics} Topik Tuntas (KKM ≥ 75)
          </div>
        </div>
      </div>

      {/* 2. Remedial & Prerequisite Notice Alert (If Any Active Remedial) */}
      {activeRemedials.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-amber-900 text-sm">
                  Rekomendasi Jalur Remedial & Prasyarat Aktif
                </h3>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full uppercase">
                  Adaptive Engine
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Hasil asesmen sebelumnya menunjukkan konsep prasyarat{' '}
                <strong>{activeRemedials[0].prerequisiteTopicTitle}</strong> perlu diperkuat terlebih dahulu sebelum menyelesaikan topik{' '}
                <strong>{activeRemedials[0].originTopicTitle}</strong>.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => onNavigate('topic', activeRemedials[0].prerequisiteTopicSlug)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Pelajari Materi Prasyarat: {activeRemedials[0].prerequisiteTopicTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Diagnostic Result Summary (If Available) */}
      {progressData?.diagnostic && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-base">Profil Kompetensi Diagnostik</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
              Rekomendasi: {progressData.diagnostic.recommendedPhaseName}
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4">{progressData.diagnostic.summaryText}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {progressData.diagnostic.competencyScores?.map((comp: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="truncate">{comp.domain}</span>
                  <span className={`font-bold ${
                    comp.score >= 80 ? 'text-emerald-600' : comp.score >= 60 ? 'text-sky-600' : 'text-amber-600'
                  }`}>
                    {comp.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      comp.score >= 80 ? 'bg-emerald-500' : comp.score >= 60 ? 'bg-sky-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-slate-700">{comp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Interactive Learning Path Visual Roadmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
                Roadmap Pembelajaran Mandiri (Fase A - F)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Alur belajar adaptif berjenjang. Setiap topik membutuhkan ketuntasan asesmen (KKM ≥ 75) untuk membuka materi tingkat lanjut.
            </p>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Tuntas (Mastered)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></span>
              Terbuka (Available)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Perlu Remedial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              Terkunci (Locked)
            </span>
          </div>
        </div>

        {/* Phase Filter Tabs (Fase A - Fase F) */}
        <div className="flex flex-wrap gap-1.5 mb-6 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
          <button
            onClick={() => setSelectedPhaseFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPhaseFilter === 'ALL'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Fase (A - F)
          </button>
          {[
            { id: 'phase-a', label: 'Fase A (SD 1-2)' },
            { id: 'phase-b', label: 'Fase B (SD 3-4)' },
            { id: 'phase-c', label: 'Fase C (SD 5-6)' },
            { id: 'phase-d', label: 'Fase D (SMP 7-9)' },
            { id: 'phase-e', label: 'Fase E (SMA 10)' },
            { id: 'phase-f', label: 'Fase F (SMA 11-12)' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPhaseFilter(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPhaseFilter === p.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Roadmap Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningPath
            .filter(topic => selectedPhaseFilter === 'ALL' || topic.phaseId === selectedPhaseFilter)
            .map((topic, index) => {
            const isMastered = topic.status === 'MASTERED';
            const isAvailable = topic.status === 'AVAILABLE' || topic.status === 'IN_PROGRESS';
            const isRemedial = topic.status === 'NEEDS_REMEDIAL';
            const isLocked = topic.status === 'LOCKED';
            const phaseBadge = topic.phaseId === 'phase-a' ? 'Fase A'
              : topic.phaseId === 'phase-b' ? 'Fase B'
              : topic.phaseId === 'phase-c' ? 'Fase C'
              : topic.phaseId === 'phase-d' ? 'Fase D'
              : topic.phaseId === 'phase-e' ? 'Fase E'
              : topic.phaseId === 'phase-f' ? 'Fase F'
              : 'Adaptif';

            return (
              <div
                key={topic.id}
                onClick={() => {
                  if (!isLocked) onNavigate('topic', topic.slug);
                }}
                className={`relative rounded-2xl p-5 border transition-all ${
                  isLocked
                    ? 'bg-slate-50/70 border-slate-200 opacity-60 cursor-not-allowed'
                    : isMastered
                    ? 'bg-emerald-50/40 border-emerald-200 hover:shadow-md cursor-pointer hover:border-emerald-300'
                    : isRemedial
                    ? 'bg-amber-50/50 border-amber-300 hover:shadow-md cursor-pointer'
                    : 'bg-white border-indigo-200 shadow-sm hover:shadow-md hover:border-indigo-400 cursor-pointer'
                }`}
              >
                {/* Header: Node number & Status Icon */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {phaseBadge}
                    </span>
                  </div>
                  <div>
                    {isMastered && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Tuntas
                      </span>
                    )}
                    {isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        <PlayCircle className="w-3 h-3" />
                        Siap Belajar
                      </span>
                    )}
                    {isRemedial && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <RotateCcw className="w-3 h-3" />
                        Remedial
                      </span>
                    )}
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Footer: KKM and Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    KKM: <strong className="text-slate-600">{topic.passingScore}</strong>
                  </span>
                  {!isLocked ? (
                    <span className="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                      {isMastered ? 'Ulas Materi' : 'Mulai'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Prasyarat Belum Selesai
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

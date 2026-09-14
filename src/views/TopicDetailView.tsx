import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Topic, LearningMaterial, ExampleItem, Question, Assessment } from '../types';
import { MathRenderer } from '../components/MathRenderer';
import { SecureAssessmentModal } from '../components/SecureAssessmentModal';

interface TopicDetailViewProps {
  slug: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAiTutor: (topicTitle?: string) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  slug,
  onNavigate,
  onOpenAiTutor
}) => {
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<'MATERI' | 'CONTOH' | 'LATIHAN' | 'ASESMEN'>('MATERI');

  const [topic, setTopic] = useState<Topic | null>(null);
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [examples, setExamples] = useState<ExampleItem[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSecureModalOpen, setIsSecureModalOpen] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [showPracticeFeedback, setShowPracticeFeedback] = useState<Record<string, boolean>>({});

  // Collapsed states for examples
  const [expandedExamples, setExpandedExamples] = useState<Record<string, boolean>>({ 'ex-fk-1': true, 'ex-pk-1': true });

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        setIsLoading(true);
        const res = await authFetch(`/api/topics/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setTopic(data.topic);
          setMaterial(data.material);
          setExamples(data.examples || []);
          setPracticeQuestions(data.practiceQuestions || []);
          setAssessment(data.assessment || null);

          // If assessment exists, preload its questions for secure modal
          if (data.assessment) {
            const asQRes = await authFetch(`/api/assessment/questions/${data.assessment.id}`);
            if (asQRes.ok) {
              const asQData = await asQRes.json();
              setAssessmentQuestions(asQData.questions || []);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching topic details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium">Memuat modul pembelajaran...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Topik Tidak Ditemukan</h2>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Navigation breadcrumb */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Jalur Belajar</span>
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Fase Kurikulum Indonesia
            </span>
            <span className="text-xs font-semibold text-slate-400">
              KKM Ketuntasan: <strong className="text-slate-700">{topic.passingScore}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {topic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            {topic.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => onOpenAiTutor(topic.title)}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Tanya AI Tutor</span>
          </button>
          {assessment && (
            <button
              onClick={() => setIsSecureModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Mulai Asesmen Kompetensi</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-3 pt-2 shadow-xs">
        <button
          onClick={() => setActiveTab('MATERI')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'MATERI'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Materi Pembelajaran</span>
        </button>
        <button
          onClick={() => setActiveTab('CONTOH')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CONTOH'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>2. Contoh Soal Langkah demi Langkah</span>
        </button>
        <button
          onClick={() => setActiveTab('LATIHAN')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'LATIHAN'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>3. Latihan Interaktif</span>
        </button>
        <button
          onClick={() => setActiveTab('ASESMEN')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ASESMEN'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>4. Asesmen & Mastery</span>
        </button>
      </div>

      {/* TAB 1: MATERI LENGKAP */}
      {activeTab === 'MATERI' && material && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
          {/* 1. Tujuan Pembelajaran */}
          <div>
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              1. Tujuan Pembelajaran
            </h3>
            <ul className="space-y-2 mt-2">
              {material.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Apersepsi */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-600" />
              2. Apersepsi & Konteks Kehidupan Nyata
            </h3>
            <p className="text-xs sm:text-sm text-sky-950 leading-relaxed mt-2">
              {material.apperception}
            </p>
          </div>

          {/* 3. Konsep Dasar & 4. Penjelasan Mendalam */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              3. Konsep Dasar & Penjelasan Mendalam
            </h3>
            <div className="text-sm text-slate-800 space-y-4 leading-relaxed whitespace-pre-line">
              {material.basicConcepts.split('\n\n').map((para, idx) => (
                <div key={idx} className="space-y-2">
                  {para.startsWith('f(x)') || para.startsWith('ax') ? (
                    <div className="my-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <MathRenderer math={para} block />
                    </div>
                  ) : (
                    <p>{para}</p>
                  )}
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="font-semibold text-slate-900 mb-2">Penjabaran Matematis:</p>
                {material.detailedExplanation.split('\n\n').map((para, idx) => (
                  <div key={idx} className="mb-3">
                    {para.includes('x_p =') || para.includes('y_p =') || para.includes('x_{1,2}') ? (
                      <div className="my-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <MathRenderer math={para} block />
                      </div>
                    ) : (
                      <p>{para}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Kesalahan Umum (Misconceptions) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Kesalahan Umum Siswa (Misconceptions)
            </h3>
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed whitespace-pre-line">
              {material.commonMisconceptions}
            </div>
          </div>

          {/* 6. Ringkasan */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ringkasan Inti
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {material.summary}
            </p>
          </div>

          {/* Call to Next Step */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveTab('CONTOH')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Contoh Soal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CONTOH SOAL */}
      {activeTab === 'CONTOH' && (
        <div className="space-y-6 animate-in fade-in">
          {examples.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl text-slate-500">
              Belum ada contoh soal untuk topik ini.
            </div>
          ) : (
            examples.map(ex => {
              const isExpanded = !!expandedExamples[ex.id];
              return (
                <div key={ex.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                        Contoh Soal
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {ex.difficulty}
                      </span>
                    </div>
                    <button
                      onClick={() => setExpandedExamples(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                      className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <span>{isExpanded ? 'Tutup Langkah' : 'Buka Langkah Lengkap'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{ex.title}</h3>
                    <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line font-medium">
                      {ex.problemStatement}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Pembahasan Langkah demi Langkah:
                      </h4>
                      <div className="space-y-3">
                        {ex.stepByStepSolution.map(step => (
                          <div key={step.stepNumber} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-1">
                              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                                {step.stepNumber}
                              </span>
                              <span>{step.title}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 mt-1 pl-7 leading-relaxed whitespace-pre-line">
                              {step.description}
                            </p>
                            {step.mathExpression && (
                              <div className="mt-2 pl-7">
                                <MathRenderer math={step.mathExpression} block />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs sm:text-sm text-emerald-950">
                        <strong>Kunci Pemahaman (Key Takeaway):</strong> {ex.keyTakeaway}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('LATIHAN')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Latihan Mandiri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LATIHAN INTERAKTIF */}
      {activeTab === 'LATIHAN' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Latihan Mandiri Pemahaman Konsep</h2>
            <p className="text-xs text-slate-500 mb-6">
              Kerjakan soal latihan berikut untuk menguji pemahaman sebelum mengikuti Asesmen Kompetensi resmi.
            </p>

            <div className="space-y-8">
              {practiceQuestions.map((q, idx) => {
                const selected = practiceAnswers[q.id];
                const showFb = showPracticeFeedback[q.id];

                return (
                  <div key={q.id} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Latihan #{idx + 1}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold text-[11px]">
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-800">{q.questionText}</p>
                    {q.mathExpression && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <MathRenderer math={q.mathExpression} block />
                      </div>
                    )}

                    <div className="space-y-2">
                      {q.options?.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setPracticeAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                            setShowPracticeFeedback(prev => ({ ...prev, [q.id]: true }));
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 ${
                            selected === opt.id
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      ))}
                    </div>

                    {showFb && (
                      <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                        <span className="font-bold block mb-1">Pembahasan Konsep:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Sudah yakin dengan konsep topik ini?</span>
              <button
                onClick={() => setIsSecureModalOpen(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Mulai Asesmen Kompetensi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASESMEN & MASTERY RESULT VIEW */}
      {activeTab === 'ASESMEN' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          {!assessmentResult ? (
            <div className="max-w-xl mx-auto text-center space-y-5 py-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {assessment?.title || `Asesmen: ${topic.title}`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Asesmen kompetensi ini menguji ketuntasan pemahamanmu. Standar KKM adalah <strong>{topic.passingScore}</strong>.
                Jika lulus, topik berikutnya akan otomatis terbuka. Jika belum, sistem akan memandu ke materi prasyarat (remedial).
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span>Standar Kelulusan (KKM):</span>
                  <strong>{topic.passingScore} / 100</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mode Monitoring:</span>
                  <strong className="text-emerald-700">AI Webcam & Fullscreen Active</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Jumlah Soal:</span>
                  <strong>{assessmentQuestions.length || 5} Butir Soal</strong>
                </div>
              </div>

              <button
                onClick={() => setIsSecureModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>MULAI ASESMEN RESMI</span>
              </button>
            </div>
          ) : (
            /* Assessment Result Summary */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                  assessmentResult.attempt?.isPassed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {assessmentResult.attempt?.isPassed ? (
                    <Award className="w-7 h-7" />
                  ) : (
                    <RotateCcw className="w-7 h-7" />
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {assessmentResult.attempt?.isPassed
                    ? 'Selamat! Anda Telah Menguasai Topik Ini (Mastered)'
                    : 'Beberapa Konsep Masih Perlu Diperkuat (Needs Remedial)'}
                </h2>
                <div className="text-3xl font-black text-indigo-700">
                  Skor: {assessmentResult.attempt?.score} / 100
                </div>
                <p className="text-xs text-slate-500">
                  KKM Topik: {topic.passingScore} • Status:{' '}
                  <strong className={assessmentResult.attempt?.isPassed ? 'text-emerald-600' : 'text-amber-600'}>
                    {assessmentResult.attempt?.isPassed ? 'LULUS (MASTERED)' : 'REMEDIAL DIPERLUKAN'}
                  </strong>
                </p>
              </div>

              {/* LOTS / MOTS / HOTS Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-400">LOTS (Mengingat/Paham)</div>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    {assessmentResult.attempt?.lotsScore}%
                  </div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-400">MOTS (Menerapkan)</div>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    {assessmentResult.attempt?.motsScore}%
                  </div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] font-bold text-slate-400">HOTS (Analisis/Kreasi)</div>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    {assessmentResult.attempt?.hotsScore}%
                  </div>
                </div>
              </div>

              {/* Analysis of Strengths & Weaknesses */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <div>
                  <strong className="text-emerald-800 block mb-1">Kekuatan yang Ditunjukkan:</strong>
                  <p className="text-slate-700">{assessmentResult.attempt?.analysisStrengths}</p>
                </div>
                {assessmentResult.attempt?.analysisWeaknesses && (
                  <div className="pt-2 border-t border-slate-200">
                    <strong className="text-amber-800 block mb-1">Analisis Kelemahan:</strong>
                    <p className="text-slate-700">{assessmentResult.attempt?.analysisWeaknesses}</p>
                  </div>
                )}
                {assessmentResult.attempt?.analysisMisconceptions && (
                  <div className="pt-2 border-t border-slate-200">
                    <strong className="text-rose-800 block mb-1">Pola Kesalahan Konsep:</strong>
                    <p className="text-slate-700">{assessmentResult.attempt?.analysisMisconceptions}</p>
                  </div>
                )}
              </div>

              {/* Adaptive Recommendation Action */}
              {assessmentResult.recommendedNextTopic && (
                <div className={`p-6 rounded-2xl text-white ${
                  assessmentResult.recommendedNextTopic.isRemedial
                    ? 'bg-gradient-to-r from-amber-700 to-amber-900'
                    : 'bg-gradient-to-r from-emerald-700 to-teal-800'
                }`}>
                  <div className="text-xs uppercase font-bold text-amber-200 tracking-wider">
                    Langkah Belajar Selanjutnya:
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {assessmentResult.recommendedNextTopic.title}
                  </h3>
                  <p className="text-xs text-white/90 mt-1">
                    {assessmentResult.recommendedNextTopic.message}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() => onNavigate('topic', assessmentResult.recommendedNextTopic.slug)}
                      className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                    >
                      <span>
                        {assessmentResult.recommendedNextTopic.isRemedial
                          ? 'Buka Materi Prasyarat'
                          : 'Lanjut ke Topik Berikutnya'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECURE ASSESSMENT MODAL */}
      {isSecureModalOpen && assessment && (
        <SecureAssessmentModal
          assessment={assessment}
          questions={assessmentQuestions}
          topicTitle={topic.title}
          topicId={topic.id}
          isOpen={isSecureModalOpen}
          onClose={() => setIsSecureModalOpen(false)}
          onComplete={res => {
            setIsSecureModalOpen(false);
            setAssessmentResult(res);
            setActiveTab('ASESMEN');
          }}
        />
      )}
    </div>
  );
};

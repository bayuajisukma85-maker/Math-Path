import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Play, 
  Eye, 
  Edit3, 
  Send, 
  Check, 
  X, 
  ChevronRight, 
  ArrowRight,
  ShieldAlert,
  Clock,
  FileText,
  Sliders,
  History,
  Info,
  RefreshCw,
  Award
} from 'lucide-react';
import { MathRenderer } from '../components/MathRenderer';
import { 
  PhaseCode, 
  AiGeneratedItem, 
  AiContentStatus, 
  AiContentType, 
  CurriculumUnit, 
  CurriculumSource,
  AiGenerationJob,
  ContentVersion 
} from '../types';

interface AiCurriculumViewProps {
  onNavigate: (view: string, param?: any) => void;
  isAdmin?: boolean;
}

export const AiCurriculumView: React.FC<AiCurriculumViewProps> = ({ onNavigate, isAdmin = false }) => {
  const { authFetch, user, role } = useAuth();

  // Navigation tab
  const [activeMainTab, setActiveMainTab] = useState<'CURRICULUM_INPUT' | 'REVIEW_QUEUE' | 'PUBLISHED_LIBRARY' | 'ROADMAP_GRAPH'>('CURRICULUM_INPUT');

  // Input states
  const [selectedPhase, setSelectedPhase] = useState<PhaseCode>('FASE_D');
  const [selectedSubject, setSelectedSubject] = useState<string>('Matematika');
  const [inputMode, setInputMode] = useState<'DOCUMENT' | 'STRUCTURED' | 'MANUAL'>('STRUCTURED');
  const [isOfficialSource, setIsOfficialSource] = useState<boolean>(false);
  
  // Document inputs
  const [docTitle, setDocTitle] = useState('Kurikulum Merdeka Matematika SMP');
  const [docText, setDocText] = useState('');
  const [cpText, setCpText] = useState('Pada akhir Fase D, peserta didik dapat menyelesaikan masalah kontekstual menggunakan konsep bilangan bulat & pecahan, rasio & proporsi, bentuk aljabar, persamaan linear satu variabel, SPLDV, relasi fungsi, teorema Pythagoras, serta statistika dan peluang.');
  const [tpText, setTpText] = useState('1. Memahami bilangan rasional dan perbandingan senilai/berbalik nilai.\n2. Menyelesaikan operasi bentuk aljabar dan PLSV.\n3. Menerapkan teorema Pythagoras dan menyajikan data.');
  const [atpText, setAtpText] = useState('Bilangan → Rasio & Proporsi → Bentuk Aljabar → Persamaan Linear → SPLDV → Relasi & Fungsi → Geometri & Pythagoras → Statistika → Peluang');

  // Analysis result
  const [analyzedResult, setAnalyzedResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Active Job states
  const [activeJob, setActiveJob] = useState<AiGenerationJob | null>(null);
  const [jobIntervalId, setJobIntervalId] = useState<any>(null);

  // Review Queue state
  const [queueItems, setQueueItems] = useState<AiGeneratedItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<AiGeneratedItem | null>(null);
  const [selectedItemVersions, setSelectedItemVersions] = useState<ContentVersion[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'MATERIAL' | 'EXAMPLES' | 'QUESTIONS' | 'VERSIONS'>('MATERIAL');

  // Edit inline state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editConcepts, setEditConcepts] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editExplanation, setEditExplanation] = useState('');

  // Regeneration state
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customRefinementPrompt, setCustomRefinementPrompt] = useState('');

  // Fetch initial content queue & active units
  const fetchQueue = async () => {
    try {
      const res = await authFetch('/api/ai/content-queue');
      if (res.ok) {
        const json = await res.json();
        setQueueItems(json.queue || []);
      }
    } catch (err) {
      console.error('Failed to fetch AI content queue:', err);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Poll active generation job
  useEffect(() => {
    if (!activeJob || activeJob.status === 'COMPLETED' || activeJob.status === 'FAILED') {
      if (jobIntervalId) {
        clearInterval(jobIntervalId);
        setJobIntervalId(null);
      }
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await authFetch(`/api/ai/jobs/${activeJob.id}`);
        if (res.ok) {
          const json = await res.json();
          setActiveJob(json.job);
          if (json.job.status === 'COMPLETED') {
            fetchQueue();
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.error('Job polling error:', e);
      }
    }, 800);

    setJobIntervalId(interval);
    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status]);

  // Handle Analyze Curriculum
  const handleAnalyzeCurriculum = async () => {
    setIsAnalyzing(true);
    try {
      const res = await authFetch('/api/curriculum/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phaseCode: selectedPhase,
          subject: selectedSubject,
          sourceType: inputMode === 'DOCUMENT' ? 'DOCUMENT_TEXT' : (inputMode === 'STRUCTURED' ? 'CP_TP_ATP' : 'MANUAL_ENTRY'),
          documentText: docText,
          cpText,
          tpText,
          atpText,
          isOfficial: isOfficialSource
        })
      });

      if (res.ok) {
        const json = await res.json();
        setAnalyzedResult(json.result);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Start Generation Job
  const handleStartGenerationJob = async (topicTitle: string, element: string = 'Aljabar') => {
    try {
      const res = await authFetch('/api/ai/jobs/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobType: 'FULL_TOPIC_CONTENT',
          topicTitle,
          phaseCode: selectedPhase,
          element,
          creatorId: user?.id || 'user-teacher-1',
          creatorName: user?.fullName || 'Guru Matematika',
          creatorRole: role || 'teacher'
        })
      });

      if (res.ok) {
        const json = await res.json();
        setActiveJob(json.job);
        // Switch to Review queue tab so teacher can see progress and review
        setActiveMainTab('REVIEW_QUEUE');
      }
    } catch (err) {
      console.error('Failed to start job:', err);
    }
  };

  // Open item in review modal
  const handleOpenReviewModal = async (item: AiGeneratedItem) => {
    setSelectedItem(item);
    setEditTitle(item.topicTitle);
    setEditConcepts(item.contentData?.material?.basicConcepts || '');
    setEditSummary(item.contentData?.material?.summary || '');
    setEditExplanation(item.contentData?.material?.detailedExplanation || '');
    setIsEditing(false);
    setIsReviewModalOpen(true);

    try {
      const res = await authFetch(`/api/ai/content-versions/${item.id}`);
      if (res.ok) {
        const json = await res.json();
        setSelectedItemVersions(json.versions || []);
      }
    } catch (e) {
      console.error('Failed to load versions:', e);
    }
  };

  // Review actions: Approve, Reject, Publish
  const handleReviewAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedItem) return;
    try {
      const res = await authFetch(`/api/ai/content-queue/${selectedItem.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewerId: user?.id,
          reviewerName: user?.fullName,
          reviewerNotes: `Ditandai sebagai ${status} oleh ${user?.fullName}`
        })
      });

      if (res.ok) {
        const json = await res.json();
        setSelectedItem(json.item);
        fetchQueue();
      }
    } catch (e) {
      console.error('Review action error:', e);
    }
  };

  const handlePublish = async () => {
    if (!selectedItem) return;
    try {
      const res = await authFetch(`/api/ai/content-queue/${selectedItem.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publisherId: user?.id,
          publisherName: user?.fullName,
          notes: 'Dipublikasikan ke alur belajar siswa.'
        })
      });

      if (res.ok) {
        const json = await res.json();
        setSelectedItem(json.item);
        fetchQueue();
        alert('Konten berhasil dipublikasikan! Modul materi, contoh, dan 10 butir asesmen standar KKM 75 kini resmi aktif di jalur belajar siswa.');
      }
    } catch (e) {
      console.error('Publish error:', e);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;
    try {
      const updatedMaterial = selectedItem.contentData.material ? {
        ...selectedItem.contentData.material,
        basicConcepts: editConcepts,
        summary: editSummary,
        detailedExplanation: editExplanation
      } : undefined;

      const res = await authFetch(`/api/ai/content-queue/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: editTitle,
          contentData: {
            ...selectedItem.contentData,
            material: updatedMaterial
          },
          reviewerNotes: 'Perubahan manual oleh Guru/Admin'
        })
      });

      if (res.ok) {
        const json = await res.json();
        setSelectedItem(json.item);
        setIsEditing(false);
        fetchQueue();
      }
    } catch (e) {
      console.error('Save edit error:', e);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedItem) return;
    setIsRegenerating(true);
    try {
      const res = await authFetch(`/api/ai/content-queue/${selectedItem.id}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newInstructions: customRefinementPrompt
        })
      });

      if (res.ok) {
        const json = await res.json();
        setSelectedItem(json.item);
        setCustomRefinementPrompt('');
        fetchQueue();
        alert('Regenerasi AI selesai! Versi baru telah tersimpan dan diperiksa ulang oleh Quality Check.');
      }
    } catch (e) {
      console.error('Regenerate error:', e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const filteredQueue = queueItems.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Curriculum & Content Generation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pusat Kurikulum & Generator Pembelajaran Adaptif
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 max-w-3xl leading-relaxed">
            Analisis Capaian Pembelajaran (CP), rancang Alur Tujuan Pembelajaran (ATP), petakan prasyarat topik, dan generate modul materi lengkap beserta 10 butir asesmen (KKM 75). Semua konten AI masuk ke tahap review dan wajib mendapatkan persetujuan sebelum dipublikasikan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(role === 'admin' ? 'admin-dashboard' : 'teacher-dashboard')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveMainTab('CURRICULUM_INPUT')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeMainTab === 'CURRICULUM_INPUT'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Analisis Kurikulum AI</span>
        </button>

        <button
          onClick={() => setActiveMainTab('REVIEW_QUEUE')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 relative ${
            activeMainTab === 'REVIEW_QUEUE'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. Antrean Review & Persetujuan</span>
          {queueItems.filter(i => i.status === 'PENDING_REVIEW' || i.status === 'REVIEW' || i.status === 'NEEDS_REVIEW').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {queueItems.filter(i => i.status === 'PENDING_REVIEW' || i.status === 'REVIEW' || i.status === 'NEEDS_REVIEW').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('PUBLISHED_LIBRARY')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeMainTab === 'PUBLISHED_LIBRARY'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>3. Modul Terpublikasi ({queueItems.filter(i => i.status === 'PUBLISHED').length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('ROADMAP_GRAPH')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeMainTab === 'ROADMAP_GRAPH'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          <span>Peta Prasyarat & Alur Belajar</span>
        </button>
      </div>

      {/* Active Job Progress Banner (If Job is Running) */}
      {activeJob && (
        <div className={`p-5 rounded-2xl border transition-all ${
          activeJob.status === 'PROCESSING' 
            ? 'bg-indigo-50/80 border-indigo-200' 
            : activeJob.status === 'COMPLETED' 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeJob.status === 'PROCESSING' 
                    ? 'bg-indigo-200 text-indigo-800 animate-pulse' 
                    : activeJob.status === 'COMPLETED'
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-rose-200 text-rose-800'
                }`}>
                  {activeJob.status === 'PROCESSING' ? 'JOB RUNNING' : activeJob.status}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {activeJob.inputParams?.topicTitle} ({activeJob.inputParams?.phaseCode})
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {activeJob.currentStage}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-indigo-700">
                {activeJob.progressPercent}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                activeJob.status === 'FAILED' ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${activeJob.progressPercent}%` }}
            />
          </div>

          {/* Error & Retry */}
          {activeJob.status === 'FAILED' && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-rose-700 font-medium">
                {activeJob.error || 'Terjadi gangguan saat memproses konten.'}
              </span>
              <button
                onClick={async () => {
                  await authFetch(`/api/ai/jobs/${activeJob.id}/retry`, { method: 'POST' });
                  setActiveJob(prev => prev ? { ...prev, status: 'PROCESSING', progressPercent: 20 } : null);
                }}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Coba Lagi (Retry)
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: CURRICULUM INPUT & AI ANALYSIS */}
      {/* ========================================================= */}
      {activeMainTab === 'CURRICULUM_INPUT' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                1. Masukkan Parameter Dokumen Kurikulum
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih Fase, masukkan Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), dan Alur Tujuan Pembelajaran (ATP).
              </p>
            </div>

            {/* Selection row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Fase Kurikulum
                </label>
                <select
                  value={selectedPhase}
                  onChange={e => setSelectedPhase(e.target.value as PhaseCode)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="FASE_A">Fase A (Kelas 1 - 2 SD)</option>
                  <option value="FASE_B">Fase B (Kelas 3 - 4 SD)</option>
                  <option value="FASE_C">Fase C (Kelas 5 - 6 SD)</option>
                  <option value="FASE_D">Fase D (Kelas 7 - 9 SMP)</option>
                  <option value="FASE_E">Fase E (Kelas 10 SMA/SMK)</option>
                  <option value="FASE_F">Fase F (Kelas 11 - 12 SMA/SMK)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Format Input
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInputMode('STRUCTURED')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                      inputMode === 'STRUCTURED' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    CP / TP / ATP
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('DOCUMENT')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                      inputMode === 'DOCUMENT' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Teks Dokumen
                  </button>
                </div>
              </div>
            </div>

            {/* Input fields */}
            {inputMode === 'STRUCTURED' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Capaian Pembelajaran (CP)
                  </label>
                  <textarea
                    rows={3}
                    value={cpText}
                    onChange={e => setCpText(e.target.value)}
                    placeholder="Masukkan CP dari keputusan kepala BSKAP Kemendikbudristek..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tujuan Pembelajaran (TP)
                  </label>
                  <textarea
                    rows={3}
                    value={tpText}
                    onChange={e => setTpText(e.target.value)}
                    placeholder="Daftar tujuan pembelajaran yang diharapkan..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alur Tujuan Pembelajaran (ATP)
                  </label>
                  <textarea
                    rows={2}
                    value={atpText}
                    onChange={e => setAtpText(e.target.value)}
                    placeholder="Urutan pembelajaran kompetensi dari fondasi hingga lanjutan..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tempel Dokumen / Teks Kurikulum Lengkap
                </label>
                <textarea
                  rows={6}
                  value={docText}
                  onChange={e => setDocText(e.target.value)}
                  placeholder="Tempel naskah kurikulum, modul ajar, atau silabus matematika..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            )}

            {/* Official Source Checkbox & Disclaimer */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <input
                type="checkbox"
                id="isOfficial"
                checked={isOfficialSource}
                onChange={e => setIsOfficialSource(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="isOfficial" className="cursor-pointer">
                <strong>Verifikasi Sumber Resmi:</strong> Centang jika teks di atas disalin langsung dari Keputusan BSKAP Kemendikbudristek No. 032/H/KR/2024 atau dokumen kurikulum resmi satuan pendidikan.
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAnalyzeCurriculum}
                disabled={isAnalyzing}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Kurikulum...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Analisis Kurikulum dengan AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results Display */}
          {analyzedResult && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Struktur Kurikulum Hasil Analisis AI
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {analyzedResult.sourceInfo?.phaseCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {analyzedResult.sourceInfo?.disclaimer}
                  </p>
                </div>
              </div>

              {/* Elements summary */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-400 self-center mr-1">Elemen Teridentifikasi:</span>
                {analyzedResult.elements?.map((el: string) => (
                  <span key={el} className="px-3 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-100">
                    {el}
                  </span>
                ))}
              </div>

              {/* Units List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar Topik, Subtopik, & Kompetensi Prasyarat
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  {analyzedResult.units?.map((unit: any, idx: number) => (
                    <div key={unit.id || idx} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors bg-slate-50/50 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            {unit.topicTitle}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                            Elemen: {unit.element}
                          </span>
                        </div>

                        {/* Button: Generate Content with AI */}
                        <button
                          onClick={() => handleStartGenerationJob(unit.topicTitle, unit.element)}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Generate Content with AI</span>
                        </button>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 bg-white p-3.5 rounded-xl border border-slate-100">
                        <div><strong>Capaian Pembelajaran (CP):</strong> {unit.cp}</div>
                        <div><strong>Tujuan Pembelajaran (TP):</strong> {unit.tp}</div>
                        <div><strong>Alur Tujuan (ATP):</strong> {unit.atp}</div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                          <strong className="text-indigo-950 block mb-1">Subtopik:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                            {unit.subtopics?.map((sub: string, sIdx: number) => (
                              <li key={sIdx}>{sub}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                          <strong className="text-amber-950 block mb-1">Prasyarat Wajib:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                            {unit.prerequisites?.map((prereq: any, pIdx: number) => (
                              <li key={pIdx}>
                                <strong>{prereq.title}</strong>: {prereq.reasoning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: REVIEW QUEUE & APPROVAL */}
      {/* ========================================================= */}
      {activeMainTab === 'REVIEW_QUEUE' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
              {['ALL', 'PENDING_REVIEW', 'REVIEW', 'NEEDS_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    filterStatus === st 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={fetchQueue}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Segarkan Antrean</span>
            </button>
          </div>

          {/* Queue List */}
          {filteredQueue.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              <Sliders className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">Belum ada konten dengan status ini.</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan tombol "Generate Content with AI" pada tab Analisis Kurikulum.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredQueue.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.status === 'APPROVED'
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : item.status === 'NEEDS_REVIEW'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.phaseCode}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        Versi {item.version || 1}
                      </span>

                      <span className="text-xs text-slate-400">
                        • Dibuat oleh {item.creatorName} ({new Date(item.createdAt).toLocaleDateString('id-ID')})
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {item.topicTitle}
                    </h3>

                    {/* Quality check summary */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Koreksi Matematika: <strong className="text-slate-800">{item.qualityMetrics?.mathCorrectnessScore}%</strong></span>
                      <span>Sintaks KaTeX: <strong className={item.qualityMetrics?.latexValid ? 'text-emerald-600' : 'text-rose-600'}>{item.qualityMetrics?.latexValid ? 'Valid ✓' : 'Perlu Koreksi ✗'}</strong></span>
                      <span>Distribusi Soal: <strong className="text-slate-800">{item.qualityMetrics?.lotsCount} LOTS, {item.qualityMetrics?.motsCount} MOTS, {item.qualityMetrics?.hotsCount} HOTS</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenReviewModal(item)}
                      className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka & Review</span>
                    </button>

                    {item.status !== 'PUBLISHED' && (
                      <button
                        onClick={async () => {
                          setSelectedItem(item);
                          await handlePublish();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PUBLISHED LIBRARY (Active for Students) */}
      {/* ========================================================= */}
      {activeMainTab === 'PUBLISHED_LIBRARY' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900">
            <strong>Katalog Modul Aktif:</strong> Semua modul di bawah ini berstatus <strong>PUBLISHED</strong> dan langsung tersedia di Jalur Belajar siswa (Fase A - F) beserta sistem prasyarat dan KKM adaptif.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {queueItems.filter(i => i.status === 'PUBLISHED').map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    PUBLISHED
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Versi {item.version || 1}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {item.topicTitle}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.contentData?.material?.apperception || 'Modul kurikulum matematika lengkap.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">KKM: <strong>75</strong></span>
                  <button
                    onClick={() => handleOpenReviewModal(item)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Buka Detail Modul →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PREREQUISITE GRAPH & LEARNING ROADMAP */}
      {/* ========================================================= */}
      {activeMainTab === 'ROADMAP_GRAPH' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Peta Prasyarat & Alur Belajar Adaptif (Roadmap)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Visualisasi ketergantungan kompetensi: Siswa yang belum mencapai KKM (75) diarahkan ke materi prasyarat sebelum kembali ke topik utama.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                order: 1,
                title: 'Bilangan Bulat & Rasional',
                phase: 'Fase D (Kelas 7)',
                prereqs: 'Fondasi Aritmatika SD',
                status: 'PUBLISHED'
              },
              {
                order: 2,
                title: 'Rasio dan Proporsi',
                phase: 'Fase D (Kelas 7)',
                prereqs: 'Bilangan Bulat & Rasional',
                status: 'PUBLISHED'
              },
              {
                order: 3,
                title: 'Bentuk Aljabar & Operasi Dasar',
                phase: 'Fase D (Kelas 7)',
                prereqs: 'Rasio dan Proporsi',
                status: 'PUBLISHED'
              },
              {
                order: 4,
                title: 'Persamaan Linear Satu Variabel (PLSV)',
                phase: 'Fase D (Kelas 7)',
                prereqs: 'Bentuk Aljabar',
                status: 'PUBLISHED'
              },
              {
                order: 5,
                title: 'Sistem Persamaan Linear Dua Variabel (SPLDV)',
                phase: 'Fase D (Kelas 8)',
                prereqs: 'Persamaan Linear Satu Variabel',
                status: 'PUBLISHED'
              },
              {
                order: 6,
                title: 'Relasi dan Fungsi Linear',
                phase: 'Fase D (Kelas 8)',
                prereqs: 'Sistem Persamaan Linear Dua Variabel',
                status: 'PUBLISHED'
              },
              {
                order: 7,
                title: 'Teorema Pythagoras & Geometri',
                phase: 'Fase D (Kelas 8)',
                prereqs: 'Bentuk Aljabar & Geometri Dasar',
                status: 'PUBLISHED'
              },
              {
                order: 8,
                title: 'Statistika Dasar & Ukuran Pemusatan',
                phase: 'Fase D (Kelas 8)',
                prereqs: 'Persamaan Linear Satu Variabel',
                status: 'PUBLISHED'
              },
              {
                order: 9,
                title: 'Peluang Kejadian Tunggal & Majemuk',
                phase: 'Fase D (Kelas 9)',
                prereqs: 'Statistika Dasar',
                status: 'PUBLISHED'
              }
            ].map((node, nIdx) => (
              <div key={nIdx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {node.order}
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{node.title}</h4>
                    <p className="text-xs text-slate-500">{node.phase} • Membutuhkan prasyarat: <strong>{node.prereqs}</strong></p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 self-start sm:self-center">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONTENT REVIEW, QUALITY CHECK & VERSIONING */}
      {/* ========================================================= */}
      {isReviewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedItem.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedItem.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Versi {selectedItem.version || 1} • {selectedItem.phaseCode}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedItem.topicTitle}
                </h2>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quality Check Alert Bar */}
            <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
              selectedItem.qualityMetrics?.passedValidation
                ? 'bg-emerald-50/80 border-emerald-100 text-emerald-900'
                : 'bg-rose-50/80 border-rose-100 text-rose-900'
            }`}>
              <div className="flex items-center gap-2">
                {selectedItem.qualityMetrics?.passedValidation ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>
                  <strong>AI Quality Check:</strong> {selectedItem.qualityMetrics?.notes}
                </span>
              </div>

              <div className="flex items-center gap-3 font-semibold">
                <span>Skor Matematika: {selectedItem.qualityMetrics?.mathCorrectnessScore}%</span>
                <span>KKM Standar: 75</span>
              </div>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex gap-2 px-6 border-b border-slate-200 bg-white">
              {(['MATERIAL', 'EXAMPLES', 'QUESTIONS', 'VERSIONS'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActivePreviewTab(tab)}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                    activePreviewTab === tab
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab === 'MATERIAL' && 'Materi Konsep & Rumus'}
                  {tab === 'EXAMPLES' && 'Contoh Soal Langkah Demi Langkah'}
                  {tab === 'QUESTIONS' && `10 Butir Asesmen Standar (${selectedItem.contentData?.questions?.length || 0})`}
                  {tab === 'VERSIONS' && `Riwayat Versi (${selectedItemVersions.length})`}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-800">
              {/* 1. Preview Material */}
              {activePreviewTab === 'MATERIAL' && (
                <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Topik</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Konsep Dasar (Mendukung KaTeX: $...$)</label>
                        <textarea
                          rows={4}
                          value={editConcepts}
                          onChange={e => setEditConcepts(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Penjelasan Bertahap & Penurunan Rumus</label>
                        <textarea
                          rows={4}
                          value={editExplanation}
                          onChange={e => setEditExplanation(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Rangkuman</label>
                        <textarea
                          rows={3}
                          value={editSummary}
                          onChange={e => setEditSummary(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                        />
                      </div>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                      >
                        Simpan Perubahan & Buat Versi Baru
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                        <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">Tujuan Pembelajaran:</h4>
                        <ul className="list-disc pl-5 text-xs text-indigo-900 space-y-1">
                          {selectedItem.contentData?.material?.learningObjectives?.map((obj: string, oIdx: number) => (
                            <li key={oIdx}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">Apersepsi Kontekstual:</h4>
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          {selectedItem.contentData?.material?.apperception}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">Konsep Utama & Definisi:</h4>
                        <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                          <MathRenderer content={selectedItem.contentData?.material?.basicConcepts || ''} />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">Penjelasan Bertahap & Penurunan Rumus:</h4>
                        <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                          <MathRenderer content={selectedItem.contentData?.material?.detailedExplanation || ''} />
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
                        <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">Common Mistakes (Miskonsepsi Siswa):</h4>
                        <p className="text-xs text-amber-900 leading-relaxed">
                          {selectedItem.contentData?.material?.commonMisconceptions}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">Rangkuman Pembelajaran:</h4>
                        <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <MathRenderer content={selectedItem.contentData?.material?.summary || ''} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Preview Examples */}
              {activePreviewTab === 'EXAMPLES' && (
                <div className="space-y-4">
                  {selectedItem.contentData?.examples?.map((ex: any, eIdx: number) => (
                    <div key={eIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{ex.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                          {ex.difficulty}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium">
                        <MathRenderer content={ex.problemStatement} />
                      </div>
                      <div className="space-y-2 pl-3 border-l-2 border-indigo-300 text-xs text-slate-600">
                        {ex.stepByStepSolution?.map((step: any, sIdx: number) => (
                          <div key={sIdx}>
                            <strong>Langkah {step.stepNumber}: {step.title}</strong>
                            <p>{step.description}</p>
                            {step.mathExpression && (
                              <div className="mt-1 bg-white p-2 rounded-lg border border-slate-200">
                                <MathRenderer content={step.mathExpression} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Preview 10 Assessment Questions */}
              {activePreviewTab === 'QUESTIONS' && (
                <div className="space-y-4">
                  <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-900 flex items-center justify-between">
                    <span>Struktur: Minimal 10 butir soal (4 LOTS, 4 MOTS, 2 HOTS) • KKM Kelulusan = 75</span>
                    <span className="font-bold text-sky-800">Total: {selectedItem.contentData?.questions?.length || 0} Soal</span>
                  </div>

                  {selectedItem.contentData?.questions?.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Butir Soal #{qIdx + 1}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          Level: {q.difficulty}
                        </span>
                      </div>
                      <div className="text-slate-800 font-medium">
                        <MathRenderer content={q.questionText} />
                      </div>
                      {q.mathExpression && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200 inline-block">
                          <MathRenderer content={q.mathExpression} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {q.options?.map((opt: any) => (
                          <div 
                            key={opt.id}
                            className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                              opt.id === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                            {opt.id === q.correctAnswer && <span className="ml-auto text-emerald-600 font-bold">✓ Kunci</span>}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-900">
                        <strong>Pembahasan:</strong> <MathRenderer content={q.explanation} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Preview Version History */}
              {activePreviewTab === 'VERSIONS' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Sistem versioning melindungi integritas materi. Konten yang sudah dipublikasikan tidak ditimpa langsung, melainkan dicatat riwayat versinya.
                  </p>
                  {selectedItemVersions.map(ver => (
                    <div key={ver.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Versi {ver.versionNumber}</span>
                          {ver.isPublished && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Published
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 mt-0.5">{ver.changeSummary}</p>
                      </div>
                      <span className="text-slate-400">
                        {new Date(ver.createdAt).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Controls: Regenerate, Edit, Approve, Reject, Publish */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Catatan instruksi regenerasi..."
                  value={customRefinementPrompt}
                  onChange={e => setCustomRefinementPrompt(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-slate-300 w-48 sm:w-64 bg-white outline-none"
                />
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Batal Edit' : 'Edit Konten'}</span>
                </button>

                <button
                  onClick={() => handleReviewAction('REJECTED')}
                  className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleReviewAction('APPROVED')}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={handlePublish}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish ke Siswa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  User, 
  Filter, 
  ArrowLeft,
  XCircle,
  FileText
} from 'lucide-react';
import { AssessmentSecurityEvent } from '../types';

interface TeacherSecurityViewProps {
  onNavigate: (view: string, param?: any) => void;
}

export const TeacherSecurityView: React.FC<TeacherSecurityViewProps> = ({ onNavigate }) => {
  const { authFetch } = useAuth();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<AssessmentSecurityEvent[]>([]);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const res = await authFetch('/api/teacher/security-monitor');
        if (res.ok) {
          const json = await res.json();
          setSummaries(json.summaries || []);
          setAllEvents(json.allEvents || []);
          if (json.summaries?.length > 0) {
            setSelectedAttemptId(json.summaries[0].attemptId);
          }
        }
      } catch (err) {
        console.error('Failed to load security monitor:', err);
      }
    };

    fetchSecurityData();
  }, []);

  const selectedSummary = summaries.find(s => s.attemptId === selectedAttemptId);
  const selectedAttemptEvents = allEvents.filter(e => e.attemptId === selectedAttemptId);

  const handleReviewAction = async (status: 'REVIEWED' | 'DISMISSED' | 'CONFIRMED_CONCERN') => {
    if (!selectedAttemptEvents.length) return;
    setIsSubmittingReview(true);

    try {
      // Review first event as representation
      const eventToUpdate = selectedAttemptEvents[0];
      await authFetch(`/api/teacher/security-events/${eventToUpdate.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: reviewNotes
        })
      });

      // Update local state
      setAllEvents(prev =>
        prev.map(e => (e.attemptId === selectedAttemptId ? { ...e, reviewStatus: status, reviewerNotes: reviewNotes } : e))
      );
      setReviewNotes('');
      alert(`Status verifikasi berhasil disimpan sebagai: ${status}`);
    } catch (err) {
      console.error('Review update failed:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Back button */}
      <button
        onClick={() => onNavigate('teacher-dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard Kelas</span>
      </button>

      {/* Header with Philosophy Reminder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2 border border-rose-100">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Monitoring Integritas Asesmen AI & Webcam</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Log Verifikasi Integritas Asesmen
            </h1>
          </div>
        </div>

        {/* Non-punitive Philosophy Callout */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-900">Pedoman Penilaian Non-Punitive (Integritas Edukatif):</strong>
            <p className="mt-0.5 text-slate-600">
              Setiap catatan perpindahan tab (<code>TAB_SWITCH</code>), keluar layar penuh (<code>FULLSCREEN_EXIT</code>), atau wajah tidak terdeteksi (<code>FACE_NOT_DETECTED</code>) 
              berfungsi sebagai <em>Security Flag</em> untuk verifikasi kualitatif guru, bukan bukti otomatis kecurangan atau diskualifikasi nilai secara otomatis.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Session List on Left, Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attempt Sessions */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Sesi Asesmen Terpantau ({summaries.length})
          </h2>

          <div className="space-y-2">
            {summaries.map(s => {
              const isSelected = s.attemptId === selectedAttemptId;
              const isConcern = s.overallStatus === 'REVIEW_REQUIRED';

              return (
                <div
                  key={s.attemptId}
                  onClick={() => setSelectedAttemptId(s.attemptId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {s.studentName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isConcern ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {s.overallStatus === 'REVIEW_REQUIRED' ? 'Perlu Tinjauan' : 'Normal'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {s.assessmentTitle}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Skor: <strong className="text-slate-800">{s.score}/100</strong></span>
                    <span className="flex items-center gap-1 font-semibold text-rose-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {s.totalFlags} Catatan Flag
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Event Timeline & Teacher Review Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          {selectedSummary ? (
            <>
              {/* Summary details */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">
                    Rincian Sesi: {selectedSummary.studentName}
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {selectedSummary.attemptId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Topik Asesmen: {selectedSummary.assessmentTitle} • Nilai: {selectedSummary.score}
                </p>
              </div>

              {/* Event Timeline List */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Kronologi Security Flags ({selectedAttemptEvents.length} Peristiwa)
                </h3>

                <div className="space-y-3">
                  {selectedAttemptEvents.map(evt => (
                    <div key={evt.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        evt.severity === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                        evt.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">
                            {evt.eventType}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(evt.createdAt).toLocaleTimeString('id-ID')}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          {evt.metadata?.info || 'Aktivitas terdeteksi oleh sistem pemantauan.'}
                        </p>
                        {evt.durationSeconds > 0 && (
                          <span className="inline-block text-[10px] text-slate-500 mt-1">
                            Durasi: <strong>{evt.durationSeconds} detik</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review and Feedback Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tindakan & Catatan Guru Fasilitator
                </h3>

                <textarea
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Tambahkan catatan hasil klarifikasi atau tinjauan (misal: 'Siswa mengalami kendala koneksi browser, asesmen dinyatakan sah')..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 min-h-[80px]"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleReviewAction('REVIEWED')}
                    disabled={isSubmittingReview}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Telah Ditinjau (Aman)</span>
                  </button>

                  <button
                    onClick={() => handleReviewAction('DISMISSED')}
                    disabled={isSubmittingReview}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Abaikan Flag (False Positive)</span>
                  </button>

                  <button
                    onClick={() => handleReviewAction('CONFIRMED_CONCERN')}
                    disabled={isSubmittingReview}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Perlu Diskusi / Remedial Khusus</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400">
              Pilih sesi asesmen untuk meninjau log keamanan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

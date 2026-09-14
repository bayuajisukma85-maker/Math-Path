import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw, 
  ArrowLeft, 
  Award,
  Sparkles
} from 'lucide-react';
import { LearningHistoryItem } from '../types';

interface StudentHistoryViewProps {
  onNavigate: (view: string, param?: any) => void;
}

export const StudentHistoryView: React.FC<StudentHistoryViewProps> = ({ onNavigate }) => {
  const { authFetch } = useAuth();
  const [history, setHistory] = useState<LearningHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await authFetch('/api/student/history');
        if (res.ok) {
          const json = await res.json();
          setHistory(json.history || []);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in">
      <button
        onClick={() => onNavigate('dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Jalur Belajar</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Riwayat Belajar & Asesmen</h1>
            <p className="text-xs text-slate-500">
              Catatan kronologis aktivitas belajar, latihan mandiri, dan capaian asesmen kompetensi Anda.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-slate-100">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Belum ada riwayat aktivitas yang tercatat. Mulai belajar atau ikuti asesmen diagnostik!
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="py-4 flex items-start gap-4">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  item.activityType === 'ASSESSMENT' ? 'bg-indigo-100 text-indigo-700' :
                  item.activityType === 'REMEDIAL' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {item.activityType === 'ASSESSMENT' ? <Award className="w-4 h-4" /> :
                   item.activityType === 'REMEDIAL' ? <RotateCcw className="w-4 h-4" /> :
                   <BookOpen className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {item.activityType === 'ASSESSMENT' ? 'Menyelesaikan Asesmen' :
                       item.activityType === 'MATERIAL_VIEW' ? 'Mempelajari Modul' :
                       item.activityType === 'PRACTICE' ? 'Latihan Mandiri' : 'Jalur Remedial'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {item.score !== undefined && (
                    <div className="mt-1 text-xs">
                      Skor yang Diperoleh:{' '}
                      <strong className={item.score >= 75 ? 'text-emerald-600' : 'text-amber-600'}>
                        {item.score}/100
                      </strong>
                    </div>
                  )}

                  {item.durationSeconds > 0 && (
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Waktu pengerjaan: {Math.round(item.durationSeconds / 60)} menit
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

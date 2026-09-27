import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award, 
  Compass, 
  BookOpen, 
  RotateCcw,
  Target
} from 'lucide-react';
import { Question, DiagnosticResult } from '../types';
import { MathRenderer } from '../components/MathRenderer';
import { DIAGNOSTIC_QUESTIONS_30 } from '../../server/diagnosticData';
import { db } from '../../server/store';
import { supabaseService } from '../services/supabaseService';

interface DiagnosticViewProps {
  onNavigate: (view: string, param?: any) => void;
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({ onNavigate }) => {
  const { authFetch, user } = useAuth();
  const [stage, setStage] = useState<'INTRO' | 'TESTING' | 'RESULT'>('INTRO');
  const [questions, setQuestions] = useState<Question[]>(() =>
    DIAGNOSTIC_QUESTIONS_30.map(({ correctAnswer, ...safeQ }) => safeQ)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDiagnosticQuestions = async () => {
      try {
        const res = await authFetch('/api/diagnostic/questions');
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data.questions && data.questions.length > 0) {
              setQuestions(data.questions);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Failed to load diagnostic questions from network:', err);
      }
      // Guaranteed fallback ensures questions are always populated
      setQuestions(DIAGNOSTIC_QUESTIONS_30.map(({ correctAnswer, ...safeQ }) => safeQ));
    };

    fetchDiagnosticQuestions();
  }, []);

  const handleStart = () => {
    if (questions.length === 0) {
      setQuestions(DIAGNOSTIC_QUESTIONS_30.map(({ correctAnswer, ...safeQ }) => safeQ));
    }
    setStage('TESTING');
    setCurrentIndex(0);
    setSelectedAnswers({});
  };

  const handleAnswer = (optionId: string) => {
    if (!questions[currentIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [questions[currentIndex].id]: optionId }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const answersPayload = questions.map(q => ({
      questionId: q.id,
      userAnswer: selectedAnswers[q.id] || '',
      timeSpentSeconds: 30
    }));

    try {
      const res = await authFetch('/api/diagnostic/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersPayload })
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.result) {
            setResult(data.result);
            supabaseService.saveDiagnosticResult(user?.id || 'user-student-1', data.result);
            setStage('RESULT');
            return;
          }
        }
      }

      // Local fallback evaluation
      const currentUserId = user?.id || 'user-student-1';
      const evaluated = db.evaluateDiagnostic(currentUserId, answersPayload);
      setResult(evaluated);
      supabaseService.saveDiagnosticResult(currentUserId, evaluated);
      setStage('RESULT');
    } catch (err) {
      console.warn('Evaluation error, using local fallback:', err);
      const currentUserId = user?.id || 'user-student-1';
      const evaluated = db.evaluateDiagnostic(currentUserId, answersPayload);
      setResult(evaluated);
      supabaseService.saveDiagnosticResult(currentUserId, evaluated);
      setStage('RESULT');
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* STAGE 1: INTRO */}
      {stage === 'INTRO' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center shadow-inner">
            <Sparkles className="w-8 h-8 text-amber-500" />
          </div>

          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Selamat Datang di MathPath
            </h1>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Untuk menentukan titik awal belajar yang paling tepat dan membuat jalur belajar individualmu, selesaikan asesmen diagnostik terlebih dahulu.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Mengukur kompetensi bilangan, pecahan, aljabar, dan geometri.</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Durasi estimasi: 10 - 15 menit ({questions.length} butir soal).</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Menentukan rekomendasi Fase (A-F) dan topik awal belajar.</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-102 flex items-center gap-2.5 mx-auto"
            >
              <span>MULAI ASESMEN DIAGNOSTIK</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: TESTING */}
      {stage === 'TESTING' && currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Asesmen Diagnostik Awal
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                Soal {currentIndex + 1} dari {questions.length}
              </h2>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              {currentQ.conceptTag}
            </span>
          </div>

          {/* Question text & Math */}
          <div className="space-y-4">
            <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
              {currentQ.questionText}
            </p>
            {currentQ.mathExpression && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <MathRenderer math={currentQ.mathExpression} block />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options?.map(opt => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {opt.id}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-xl"
            >
              Sebelumnya
            </button>

            {!isLast ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                {isLoading ? 'Menganalisis Kompetensi...' : 'Selesaikan Diagnostik'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: RESULT */}
      {stage === 'RESULT' && result && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Hasil Asesmen Diagnostik Anda
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Sistem telah menganalisis pola jawaban dan memetakan profil kompetensi fondasi matematika Anda.
            </p>
          </div>

          {/* Recommendation Highlight Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Rekomendasi Jalur Belajar Personal
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Disarankan mulai dari: {result.recommendedPhaseName}
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-2 leading-relaxed">
              Topik Pertama: <strong>{result.recommendedTopicTitle}</strong>
            </p>
            <p className="text-xs text-indigo-100/80 mt-3 pt-3 border-t border-white/10">
              {result.summaryText}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('topic', result.recommendedTopicSlug)}
                className="px-6 py-2.5 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Mulai Belajar Topik Ini</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20"
              >
                Lihat Semua Jalur Belajar
              </button>
            </div>
          </div>

          {/* Competency Breakdown Domain Scores */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-3">
              Rincian Penguasaan Domain Fondasi
            </h3>
            <div className="space-y-3">
              {result.competencyScores.map((comp, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span className="text-sm font-bold text-slate-900">{comp.domain}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      comp.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      comp.score >= 60 ? 'bg-sky-100 text-sky-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {comp.score}% ({comp.status})
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        comp.score >= 80 ? 'bg-emerald-500' : comp.score >= 60 ? 'bg-sky-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{comp.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

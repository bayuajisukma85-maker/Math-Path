import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Maximize, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Video,
  VideoOff,
  Sparkles,
  Lock
} from 'lucide-react';
import { Question, Assessment, AssessmentSecurityEvent, SecuritySeverity, SecurityEventType } from '../types';
import { MathRenderer } from './MathRenderer';
import { useAuth } from '../context/AuthContext';

interface SecureAssessmentModalProps {
  assessment: Assessment;
  questions: Question[];
  topicTitle: string;
  topicId: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: any) => void;
}

export const SecureAssessmentModal: React.FC<SecureAssessmentModalProps> = ({
  assessment,
  questions,
  topicTitle,
  topicId,
  isOpen,
  onClose,
  onComplete
}) => {
  const { user } = useAuth();

  // Test setup & consent states
  const [setupStep, setSetupStep] = useState<'CONSENT' | 'CAMERA_CHECK' | 'RULES' | 'TESTING'>('CONSENT');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);

  // Assessment runtime states
  const [attemptId] = useState<string>(() => `att-${Date.now()}`);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState((assessment.durationMinutes || 20) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security flags tracking
  const [liveSecurityFlags, setLiveSecurityFlags] = useState<Array<{ type: string; time: string; msg: string }>>([]);

  // Video stream and canvas refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tabSwitchStartRef = useRef<number | null>(null);

  // 1. Request Webcam Permission
  const requestWebcam = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermissionGranted(true);
    } catch (err: any) {
      console.warn('Webcam permission not granted:', err);
      setCameraError('Izin akses webcam ditolak atau kamera tidak ditemukan.');
      setCameraPermissionGranted(false);
    }
  };

  // 2. Request Fullscreen
  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreenActive(true);
      }
    } catch (err) {
      console.warn('Fullscreen request rejected by browser:', err);
    }
  };

  // 3. Security Event Logger to Server
  const logSecurityEvent = async (
    eventType: SecurityEventType,
    durationSeconds = 0,
    severity: SecuritySeverity = 'LOW',
    metadata = {}
  ) => {
    const timeStr = new Date().toLocaleTimeString('id-ID');
    setLiveSecurityFlags(prev => [
      { type: eventType, time: timeStr, msg: `Event: ${eventType}` },
      ...prev.slice(0, 5)
    ]);

    try {
      await fetch('/api/assessment/security-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          userId: user?.id,
          eventType,
          durationSeconds,
          severity,
          metadata
        })
      });
    } catch (err) {
      console.error('Failed to log security event:', err);
    }
  };

  // 4. Listeners for Tab Switch, Blur, and Fullscreen
  useEffect(() => {
    if (setupStep !== 'TESTING') return;

    // Fullscreen monitor
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreenActive(isFull);
      if (!isFull) {
        setFullscreenWarning(true);
        logSecurityEvent('FULLSCREEN_EXIT', 0, 'MEDIUM', {
          info: 'Siswa keluar dari mode fullscreen'
        });
      } else {
        setFullscreenWarning(false);
      }
    };

    // Tab visibility monitor
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        tabSwitchStartRef.current = Date.now();
        logSecurityEvent('TAB_SWITCH', 0, 'MEDIUM', {
          info: 'Siswa berpindah tab / aplikasi'
        });
      } else if (document.visibilityState === 'visible' && tabSwitchStartRef.current) {
        const duration = Math.round((Date.now() - tabSwitchStartRef.current) / 1000);
        tabSwitchStartRef.current = null;
        logSecurityEvent('WINDOW_BLUR', duration, 'LOW', {
          info: `Siswa kembali ke asesmen setelah ${duration} detik`
        });
      }
    };

    // Window blur/focus
    const handleWindowBlur = () => {
      logSecurityEvent('WINDOW_BLUR', 0, 'LOW', { info: 'Jendela asesmen kehilangan fokus kursor' });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [setupStep]);

  // 5. Lightweight Vision Heuristic Face Presence Checker
  useEffect(() => {
    if (setupStep !== 'TESTING' || !cameraPermissionGranted) return;

    const visionInterval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = 160;
        canvas.height = 120;
        ctx.drawImage(video, 0, 0, 160, 120);

        try {
          const frame = ctx.getImageData(0, 0, 160, 120);
          const data = frame.data;
          let totalBrightness = 0;

          // Simple brightness check across sampled pixels
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            totalBrightness += (r + g + b) / 3;
          }

          const avgBrightness = totalBrightness / (data.length / 16);

          // If camera is completely pitch black or covered
          if (avgBrightness < 10) {
            logSecurityEvent('FACE_NOT_DETECTED', 3, 'LOW', {
              info: 'Pencahayaan kamera sangat minim atau lensa tertutup'
            });
          }
        } catch (e) {
          // ignore canvas read errors if any
        }
      }
    }, 8000);

    return () => clearInterval(visionInterval);
  }, [setupStep, cameraPermissionGranted]);

  // 6. Assessment Countdown Timer
  useEffect(() => {
    if (setupStep !== 'TESTING') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setupStep]);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit assessment handler
  const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersPayload = questions.map(q => ({
      questionId: q.id,
      userAnswer: selectedAnswers[q.id] || '',
      timeSpentSeconds: 30
    }));

    const totalSeconds = (assessment.durationMinutes * 60) - timeRemaining;

    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessment.id,
          topicId,
          answers: answersPayload,
          timeSpentSeconds: totalSeconds > 0 ? totalSeconds : 60
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Exit fullscreen if still active
        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
          } catch (e) {}
        }
        onComplete(data);
      } else {
        alert('Gagal mengirimkan asesmen. Silakan coba kembali.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Terjadi kesalahan jaringan saat mengirim nilai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md">
      {/* Hidden canvas for vision heuristics */}
      <canvas ref={canvasRef} className="hidden" />

      {/* SETUP PHASE 1: Consent Screen */}
      {setupStep === 'CONSENT' && (
        <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Secure Assessment Mode & AI Monitoring
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Anda akan memulai <strong>{assessment.title}</strong> pada topik <strong>{topicTitle}</strong>. 
            Platform MathPath menerapkan standar integritas asesmen yang aman, transparan, dan tidak menghukum secara semena-mena.
          </p>

          <div className="mt-5 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
            <div className="flex gap-2.5 items-start">
              <Camera className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Webcam Aktif:</strong> Kamera digunakan untuk memantau keberadaan siswa di depan layar selama asesmen berlangsung.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <Maximize className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Layar Penuh:</strong> Ujian harus dikerjakan dalam mode layar penuh (fullscreen) untuk meminimalkan distraksi.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Prinsip Non-Punitive:</strong> Catatan perpindahan tab atau wajah tidak terdeteksi hanya dicatat sebagai <em>Security Flag</em> untuk ditinjau oleh guru, bukan bukti otomatis kecurangan.</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                await requestWebcam();
                setSetupStep('CAMERA_CHECK');
              }}
              className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>Lanjut: Cek Kamera & Izin</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SETUP PHASE 2: Camera & Environment Check */}
      {setupStep === 'CAMERA_CHECK' && (
        <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <span>Pemeriksaan Kamera & Layar</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pastikan wajah Anda tampak jelas di dalam bingkai kamera di bawah ini.
          </p>

          {/* Video Preview */}
          <div className="mt-4 relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-slate-300 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
            {!cameraPermissionGranted && (
              <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white p-4 text-center">
                <VideoOff className="w-10 h-10 text-rose-400 mb-2" />
                <p className="text-sm font-semibold">Kamera Belum Terhubung</p>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  {cameraError || 'Klik tombol di bawah untuk memberikan izin akses kamera.'}
                </p>
                <button
                  onClick={requestWebcam}
                  className="mt-3 px-3.5 py-1.5 bg-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Minta Izin Kamera
                </button>
              </div>
            )}
            {cameraPermissionGranted && (
              <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                Kamera Terhubung & Siap
              </div>
            )}
          </div>

          <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Maximize className="w-4 h-4 text-indigo-600" />
              <span>Mode Layar Penuh (Fullscreen):</span>
            </div>
            <button
              onClick={enterFullscreen}
              className="px-3 py-1 bg-white border border-slate-300 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-xs"
            >
              Aktifkan Layar Penuh
            </button>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setSetupStep('CONSENT')}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Kembali
            </button>
            <button
              onClick={async () => {
                await enterFullscreen();
                setSetupStep('TESTING');
              }}
              className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Mulai Mengerjakan Asesmen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SETUP PHASE 3: ACTIVE TEST INTERFACE */}
      {setupStep === 'TESTING' && (
        <div className="w-full h-full max-w-5xl flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in">
          {/* Top Bar: Title, Timer, Fullscreen indicator */}
          <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">
                {topicTitle}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                {assessment.title}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-amber-300 font-mono text-sm font-bold">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>

              {/* Secure status badge */}
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-xl text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Secure Mode Aktif
              </div>
            </div>
          </div>

          {/* Fullscreen Warning Banner if exited */}
          {fullscreenWarning && (
            <div className="bg-rose-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold animate-bounce">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Perhatian: Anda keluar dari mode layar penuh! Harap segera kembali ke mode layar penuh.</span>
              </div>
              <button
                onClick={enterFullscreen}
                className="bg-white text-rose-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-rose-50"
              >
                Masuk Fullscreen
              </button>
            </div>
          )}

          {/* Main Question Body & Webcam Sidebar */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Question Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Question Header & Difficulty Tag */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Soal {currentQuestionIndex + 1} dari {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    currentQ?.difficulty === 'LOTS' ? 'bg-emerald-100 text-emerald-800' :
                    currentQ?.difficulty === 'MOTS' ? 'bg-sky-100 text-sky-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {currentQ?.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentQ?.points} Poin
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-slate-800 text-base leading-relaxed">
                <p className="font-medium text-slate-900">{currentQ?.questionText}</p>
                {currentQ?.mathExpression && (
                  <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <MathRenderer math={currentQ.mathExpression} block />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ?.options?.map(opt => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: opt.id }));
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-xs'
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
            </div>

            {/* Right: Camera Corner Preview & Question Navigator */}
            <div className="w-full md:w-72 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-4 flex flex-col gap-4">
              {/* Webcam Feed Box */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Webcam Monitor</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                    Aktif
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-slate-300 shadow-xs">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-[10px] text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    Frame Active
                  </div>
                </div>
              </div>

              {/* Question Number Matrix */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Daftar Soal
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {questions.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-lg text-xs font-bold transition-colors ${
                          isCurrent
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                            : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Security Flags Stream */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs">
                <span className="text-[11px] font-bold text-slate-600 block mb-1">
                  Log Integritas Sesi:
                </span>
                {liveSecurityFlags.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">Sesi berjalan normal tanpa gangguan.</p>
                ) : (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {liveSecurityFlags.map((flag, idx) => (
                      <div key={idx} className="text-[10px] text-slate-600 flex items-center justify-between border-b border-slate-100 pb-0.5">
                        <span className="font-mono text-amber-600">{flag.type}</span>
                        <span className="text-slate-400">{flag.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Prev / Next / Submit Buttons */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>

            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Mengirim Nilai...' : 'Kumpulkan Asesmen'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

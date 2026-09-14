import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  BrainCircuit, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  BarChart3,
  Award,
  Video,
  Eye,
  Clock
} from 'lucide-react';
import { CURRICULUM_SEED_DISCLAIMER } from '../../server/data';

interface LandingViewProps {
  onNavigate: (view: string, param?: any) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { user, switchUserRole } = useAuth();

  return (
    <div className="space-y-16 animate-in fade-in pb-12">
      {/* SEED NOTICE BANNER */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2.5 text-center text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
          <span><strong>Pemberitahuan Kurikulum:</strong> {CURRICULUM_SEED_DISCLAIMER}</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/2 -top-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MathPath • Kurikulum Merdeka Matematika Fase A s.d. Fase F</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Belajar Matematika Sesuai Kemampuanmu.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              MathPath membantu kamu mengetahui kemampuan awal, memilih titik mulai yang tepat, mempelajari konsep, berlatih, mengikuti asesmen, dan mendapatkan jalur belajar yang sesuai dengan kebutuhanmu.
            </p>

            {/* Core CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 hover:scale-102 cursor-pointer"
              >
                <span>MULAI BELAJAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                LOGIN
              </button>

              <button
                onClick={() => onNavigate('diagnostic')}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Asesmen Diagnostik (30 Soal)</span>
              </button>
            </div>

            {/* 1-Click Demo Persona Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Pintasan Uji Coba Cepat (Demo):</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    switchUserRole('student', 'user-student-1');
                    onNavigate('dashboard');
                  }}
                  className="px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 transition-colors cursor-pointer"
                >
                  👤 Siswa 1: Budi (Fase E)
                </button>
                <button
                  onClick={() => {
                    switchUserRole('student', 'user-student-2');
                    onNavigate('diagnostic');
                  }}
                  className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/30 transition-colors cursor-pointer"
                >
                  ✨ Siswa 2: Siti (Diagnostik Baru)
                </button>
                <button
                  onClick={() => {
                    switchUserRole('teacher');
                    onNavigate('teacher-dashboard');
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  👩‍🏫 Guru: Ibu Dewi (Monitoring)
                </button>
                <button
                  onClick={() => {
                    switchUserRole('admin');
                    onNavigate('admin-dashboard');
                  }}
                  className="px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 transition-colors cursor-pointer"
                >
                  ⚙️ Admin Kurikulum
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 CORE SECTIONS (Master Prompt Section 45) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            8 Pilar Pembelajaran Mandiri MathPath
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Dirancang dari diagnostik awal hingga asesmen aman dan dukungan AI Tutor personal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Diagnostic Assessment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">1. Diagnostic Assessment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              30 soal terstandar di 10 domain kompetensi untuk mendeteksi profil kemampuan dan menentukan starting point belajar Anda secara presisi.
            </p>
          </div>

          {/* 2. Adaptive Learning */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">2. Adaptive Learning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Alur belajar fleksibel yang menyesuaikan diri secara dinamis. Jika ada kelemahan konsep, sistem merekomendasikan materi prasyarat.
            </p>
          </div>

          {/* 3. Complete Materials */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3. Complete Materials</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Materi konseptual mendalam disertai apersepsi, konsep dasar, visualisasi rumus KaTeX, pembahasan bertingkat, dan kesalahan umum siswa.
            </p>
          </div>

          {/* 4. Practice */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">4. Practice (Latihan)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              10 soal latihan interaktif per topik yang dapat diulang tanpa penalti, lengkap dengan feedback instan dan pembahasan langkah demi langkah.
            </p>
          </div>

          {/* 5. Assessment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">5. Assessment Resmi (KKM 75)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluasi penguasaan konsep dengan sebaran soal LOTS, MOTS, dan HOTS. Nilai dihitung langsung di server untuk validitas dan akurasi tinggi.
            </p>
          </div>

          {/* 6. Personal Progress */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">6. Personal Progress</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visual roadmap jalur belajar berwarna (Hijau: Mastered, Biru: Tersedia, Merah: Remedial) serta rekam jejak riwayat aktivitas belajar lengkap.
            </p>
          </div>

          {/* 7. AI Tutor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">7. AI Tutor Pribadi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Asisten AI interaktif yang siap memberikan analogi, membimbing langkah, dan menjelaskan kesalahan konsep (otomatis non-aktif saat asesmen resmi).
            </p>
          </div>

          {/* 8. Secure Assessment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-300">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">8. Secure Assessment Mode</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitoring integritas berbasis browser non-punitif (preview kamera, deteksi tab switch, fullscreen) dengan dashboard review khusus guru.
            </p>
          </div>
        </div>
      </section>

      {/* CURRICULUM FASE EXPLORER (FASE A - FASE F) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Struktur Kurikulum Nasional Fase A – F
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Terbagi berjenjang dari kelas 1 SD hingga 12 SMA/SMK dengan keterkaitan prasyarat yang saling mengunci secara otomatis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              code: 'FASE A',
              grade: 'Kelas 1 - 2 SD',
              badge: 'Fondasi Awal',
              desc: 'Bilangan cacah hingga 100, nilai tempat, penjumlahan-pengurangan dasar, serta pola bentuk geometri datar.',
              topics: ['Bilangan Cacah 1-100', 'Operasi Sederhana', 'Pola Geometri Datar'],
              color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
            },
            {
              code: 'FASE B',
              grade: 'Kelas 3 - 4 SD',
              badge: 'Aritmatika & Pecahan',
              desc: 'Nilai tempat ribuan, perkalian, pembagian, pecahan senilai, keliling dan luas bangun datar.',
              topics: ['Pecahan Senilai', 'Garis Bilangan', 'Pengukuran Panjang & Luas'],
              color: 'border-cyan-200 bg-cyan-50/50 text-cyan-800'
            },
            {
              code: 'FASE C',
              grade: 'Kelas 5 - 6 SD',
              badge: 'Pecahan Lanjut & Rasio',
              desc: 'Pecahan campuran, desimal, persentase, perbandingan rasio dan skala, geometri ruang dasar.',
              topics: ['Pecahan Campuran & Desimal', 'Rasio & Skala Peta', 'Volume Balok & Kubus'],
              color: 'border-blue-200 bg-blue-50/50 text-blue-800'
            },
            {
              code: 'FASE D',
              grade: 'Kelas 7 - 9 SMP',
              badge: 'Aljabar & Geometri SMP',
              desc: 'Bentuk aljabar suku sejenis, persamaan linear (PLSV), pemfaktoran, Teorema Pythagoras, statistika data tunggal.',
              topics: ['Bentuk Aljabar & Suku', 'Persamaan Linear (PLSV)', 'Teorema Pythagoras'],
              color: 'border-indigo-200 bg-indigo-50/50 text-indigo-800'
            },
            {
              code: 'FASE E',
              grade: 'Kelas 10 SMA/SMK',
              badge: 'Fungsi & Kuadratik SMA',
              desc: 'Eksponen & logaritma, persamaan kuadrat, fungsi kuadrat & parabola ekstrem, trigonometri segitiga siku-siku.',
              topics: ['Eksponen & Logaritma', 'Persamaan Kuadrat', 'Fungsi Kuadrat & Parabola'],
              color: 'border-purple-200 bg-purple-50/50 text-purple-800'
            },
            {
              code: 'FASE F',
              grade: 'Kelas 11 - 12 SMA/SMK',
              badge: 'Kalkulus & Analitik',
              desc: 'Fungsi komposisi dan invers, limit dan turunan fungsi aljabar, integral dasar, statistika inferensial.',
              topics: ['Fungsi Komposisi & Invers', 'Turunan Fungsi Aljabar', 'Statistika Lanjut'],
              color: 'border-rose-200 bg-rose-50/50 text-rose-800'
            }
          ].map((phase, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${phase.color}`}>
                  {phase.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">{phase.grade}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{phase.badge}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{phase.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Topik Representatif:
                </span>
                {phase.topics.map((t, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADAPTIVE ARCHITECTURE WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Siklus Pembelajaran Adaptif Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Sistem mengevaluasi dan mengatur status setiap topik secara otomatis tanpa campur tangan manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-100">Diagnostik Awal 30 Soal</h3>
              <p className="text-xs text-slate-400">
                Mengukur 10 domain kompetensi secara komprehensif untuk menentukan titik awal belajar yang paling pas.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-100">Materi & Latihan Terpandu</h3>
              <p className="text-xs text-slate-400">
                Penyajian konsep terstruktur, contoh bertingkat bertahap, dan tombol cek pemahaman konsep dengan AI Tutor.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-100">Asesmen Terjaga (KKM 75)</h3>
              <p className="text-xs text-slate-400">
                Monitoring integritas non-punitif dengan webcam preview dan deteksi perpindahan tab browser.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-100">Mastery atau Remedial</h3>
              <p className="text-xs text-slate-400">
                Jika skor &lt; 75, sistem membuka materi prasyarat secara adaptif. Jika &ge; 75, topik berikutnya terbuka otomatis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

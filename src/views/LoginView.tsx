import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2, User, KeyRound } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: string, param?: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login, switchUserRole, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Harap isi email dan kata sandi.');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      onNavigate('dashboard');
    } else {
      setErrorMsg('Email atau kata sandi tidak sesuai. Silakan coba lagi.');
    }
  };

  const handleDemoLogin = async (roleType: 'student' | 'student2' | 'teacher' | 'admin') => {
    if (roleType === 'student') {
      setEmail('budi@mathpath.id');
      setPassword('password123');
      await login('budi@mathpath.id', 'password123');
      onNavigate('dashboard');
    } else if (roleType === 'student2') {
      setEmail('ani@mathpath.id');
      setPassword('password123');
      await login('ani@mathpath.id', 'password123');
      onNavigate('diagnostic');
    } else if (roleType === 'teacher') {
      setEmail('ibu.dewi@mathpath.id');
      setPassword('password123');
      await login('ibu.dewi@mathpath.id', 'password123');
      onNavigate('teacher-dashboard');
    } else {
      setEmail('admin@mathpath.id');
      setPassword('admin123');
      await login('admin@mathpath.id', 'admin123');
      onNavigate('admin-dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-in fade-in">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-200">
            Mπ
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Masuk ke MathPath
          </h1>
          <p className="text-xs text-slate-500">
            Akses jalur pembelajaran matematika adaptif mandiri kamu
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Lupa sandi?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 hover:scale-101"
          >
            {isLoading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Login Cepat Demo (1-Klik)</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 font-semibold text-slate-700 text-left transition-colors"
            >
              <span className="block text-[11px] text-slate-400">Siswa Aktif</span>
              Budi Pratama
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('student2')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 font-semibold text-slate-700 text-left transition-colors"
            >
              <span className="block text-[11px] text-slate-400">Siswa Baru</span>
              Siti Rahmawati
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('teacher')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 font-semibold text-slate-700 text-left transition-colors"
            >
              <span className="block text-[11px] text-slate-400">Guru Monitor</span>
              Ibu Dewi, S.Pd.
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 font-semibold text-slate-700 text-left transition-colors"
            >
              <span className="block text-[11px] text-slate-400">Admin</span>
              Kurikulum KKM
            </button>
          </div>
        </div>

        {/* Register CTA */}
        <div className="text-center pt-2 text-xs text-slate-600">
          Belum memiliki akun MathPath?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
};

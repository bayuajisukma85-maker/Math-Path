import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, BookOpen, KeyRound, CheckCircle2, AlertCircle, Sparkles, LogOut } from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (view: string, param?: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, authFetch, logout, switchUserRole } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [classGrade, setClassGrade] = useState(user?.classGrade || 'Fase D (SMP)');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    setIsLoading(true);
    try {
      const res = await authFetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          classGrade,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setSuccessMsg('Profil dan data akun berhasil diperbarui.');
        setNewPassword('');
      } else {
        setErrorMsg(data.error || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-indigo-100">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user?.fullName || 'Pengguna'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Jenjang: <span className="text-indigo-600 font-semibold">{user?.classGrade || 'Umum'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {user?.role === 'student' && (
            <button
              onClick={() => onNavigate('diagnostic')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{user?.hasCompletedDiagnostic ? 'Ulangi Diagnostik' : 'Mulai Diagnostik'}</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              onNavigate('login');
            }}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pengaturan Informasi Akun</h2>
          <p className="text-xs text-slate-500">Perbarui data profil siswa dan kata sandi keamanan</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fase / Jenjang Sekolah
              </label>
              <select
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Fase A (SD Kelas 1-2)">Fase A (SD Kelas 1 - 2)</option>
                <option value="Fase B (SD Kelas 3-4)">Fase B (SD Kelas 3 - 4)</option>
                <option value="Fase C (SD Kelas 5-6)">Fase C (SD Kelas 5 - 6)</option>
                <option value="Fase D (SMP Kelas 7-9)">Fase D (SMP Kelas 7 - 9)</option>
                <option value="Fase E (SMA Kelas 10)">Fase E (SMA Kelas 10)</option>
                <option value="Fase F (SMA Kelas 11-12)">Fase F (SMA Kelas 11 - 12)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ganti Kata Sandi (Kosongkan jika tidak ingin mengubah)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

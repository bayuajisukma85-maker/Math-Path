import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  LogOut,
  ChevronDown,
  Clock,
  Settings
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAiTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAiTutor
}) => {
  const { user, role, switchUserRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <span className="font-bold text-xl tracking-tight">Mπ</span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                MATHPATH
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Fase A–F Adaptif
              </span>
            </div>
          </div>

          {/* Navigation Links based on Role */}
          <nav className="hidden md:flex items-center gap-1">
            {role === 'student' && (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Jalur Belajar
                </button>
                <button
                  onClick={() => onNavigate('diagnostic')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'diagnostic'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Diagnostik
                </button>
                <button
                  onClick={() => onNavigate('history')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'history'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Riwayat
                </button>
              </>
            )}

            {role === 'teacher' && (
              <>
                <button
                  onClick={() => onNavigate('teacher-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'teacher-dashboard'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Kelas & Siswa
                </button>
                <button
                  onClick={() => onNavigate('teacher-security')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'teacher-security'
                      ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  Monitoring Asesmen AI
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'admin-dashboard'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Kurikulum & KKM
                </button>
              </>
            )}
          </nav>

          {/* Right Actions: AI Tutor & Role Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAiTutor}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition-all hover:scale-102"
              title="Konsultasi Konsep dengan MathPath AI Tutor"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tutor</span>
            </button>

            {/* Persona Switcher for Quick Demoing */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="capitalize">{role}: {user?.fullName?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Ganti Peran (Demo Mode)
                  </div>
                  <button
                    onClick={() => {
                      switchUserRole('student');
                      onNavigate('dashboard');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      role === 'student' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Siswa: Budi Pratama</span>
                    {role === 'student' && <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">Aktif</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('teacher');
                      onNavigate('teacher-dashboard');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      role === 'teacher' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Guru: Ibu Dewi, S.Pd.</span>
                    {role === 'teacher' && <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">Aktif</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchUserRole('admin');
                      onNavigate('admin-dashboard');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      role === 'admin' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Administrator Kurikulum</span>
                    {role === 'admin' && <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">Aktif</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

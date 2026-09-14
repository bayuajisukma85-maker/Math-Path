import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './views/StudentDashboard';
import { DiagnosticView } from './views/DiagnosticView';
import { TopicDetailView } from './views/TopicDetailView';
import { StudentHistoryView } from './views/StudentHistoryView';
import { TeacherDashboard } from './views/TeacherDashboard';
import { TeacherSecurityView } from './views/TeacherSecurityView';
import { AdminDashboard } from './views/AdminDashboard';
import { AiTutorModal } from './components/AiTutorModal';

function AppContent() {
  const { role } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>('fungsi-kuadrat');
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [activeTopicForAi, setActiveTopicForAi] = useState<string>('Fungsi Kuadrat');

  const handleNavigate = (view: string, param?: any) => {
    if (view === 'topic' && param) {
      setSelectedTopicSlug(param);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiTutor = (topicTitle?: string) => {
    if (topicTitle) {
      setActiveTopicForAi(topicTitle);
    }
    setIsAiTutorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAiTutor={() => handleOpenAiTutor()}
      />

      {/* Main App Body */}
      <main className="flex-1 pb-16">
        {currentView === 'dashboard' && (
          <StudentDashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'diagnostic' && (
          <DiagnosticView onNavigate={handleNavigate} />
        )}

        {currentView === 'topic' && (
          <TopicDetailView
            slug={selectedTopicSlug}
            onNavigate={handleNavigate}
            onOpenAiTutor={handleOpenAiTutor}
          />
        )}

        {currentView === 'history' && (
          <StudentHistoryView onNavigate={handleNavigate} />
        )}

        {currentView === 'teacher-dashboard' && (
          <TeacherDashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'teacher-security' && (
          <TeacherSecurityView onNavigate={handleNavigate} />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* AI Tutor Assistant Drawer */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        topicTitle={activeTopicForAi}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
              Mπ
            </div>
            <span className="font-semibold text-slate-700">MathPath</span>
            <span>— Platform Pembelajaran Matematika Adaptif Fase A - Fase F</span>
          </div>
          <div className="text-slate-400">
            Standar Kurikulum Nasional • Secure AI Assessment Monitor • Kemandirian Siswa
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

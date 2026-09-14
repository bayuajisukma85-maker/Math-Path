/**
 * MathPath Express Server Entry Point
 * Host: 0.0.0.0, Port: 3000
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/store';
import { askAiTutor } from './server/ai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'MathPath Adaptive Mathematics Learning Platform' });
  });

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    let foundUser: any = null;

    for (const user of db.users.values()) {
      if (user.email.toLowerCase() === (email || '').toLowerCase()) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser || (password && foundUser.passwordHash !== password)) {
      return res.status(401).json({ error: 'Email atau kata sandi tidak sesuai.' });
    }

    const { passwordHash, ...profile } = foundUser;
    res.json({ user: profile, token: `tok_${foundUser.id}` });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, fullName, password, role = 'student', classGrade } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ error: 'Harap lengkapi semua data pendaftaran.' });
    }

    for (const user of db.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ error: 'Email tersebut sudah terdaftar.' });
      }
    }

    const newId = `user-${Date.now()}`;
    const newUser = {
      id: newId,
      email,
      fullName,
      role: (role as any) || 'student',
      classGrade: classGrade || 'Fase D (SMP)',
      passwordHash: password,
      hasCompletedDiagnostic: false
    };

    db.users.set(newId, newUser);
    const { passwordHash: _, ...profile } = newUser;
    res.json({ user: profile, token: `tok_${newId}` });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email wajib diisi.' });
    }

    let foundUser = null;
    for (const user of db.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      // Return success message for privacy/security
      return res.json({ message: 'Jika email terdaftar, instruksi reset kata sandi telah dikirimkan.' });
    }

    const resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    db.resetTokens.set(resetToken, {
      email: foundUser.email,
      expiresAt: Date.now() + 3600000 // 1 hour
    });

    res.json({ 
      message: 'Instruksi reset kata sandi telah dibuat.',
      resetToken, // Provided for convenience in prototype/demo testing
      email: foundUser.email
    });
  });

  app.post('/api/auth/reset-password', (req, res) => {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Token reset dan kata sandi baru wajib diisi.' });
    }

    const tokenData = db.resetTokens.get(resetToken);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Token reset tidak valid atau sudah kedaluwarsa.' });
    }

    for (const user of db.users.values()) {
      if (user.email.toLowerCase() === tokenData.email.toLowerCase()) {
        user.passwordHash = newPassword;
        db.resetTokens.delete(resetToken);
        return res.json({ success: true, message: 'Kata sandi berhasil diperbarui. Silakan login kembali.' });
      }
    }

    res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  });

  app.put('/api/auth/profile', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'user-student-1';
    const { fullName, classGrade, newPassword } = req.body;

    const user = db.users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    if (fullName) user.fullName = fullName;
    if (classGrade) user.classGrade = classGrade;
    if (newPassword && newPassword.length >= 6) {
      user.passwordHash = newPassword;
    }

    const { passwordHash: _, ...profile } = user;
    res.json({ user: profile, message: 'Profil berhasil diperbarui.' });
  });

  app.get('/api/auth/me', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'user-student-1';
    const user = db.users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }
    const { passwordHash, ...profile } = user;
    res.json({ user: profile });
  });

  // ==========================================
  // CURRICULUM ROUTES (Fase A - Fase F)
  // ==========================================
  app.get('/api/curriculum', (req, res) => {
    res.json({
      phases: db.phases,
      levels: db.levels,
      topics: db.topics,
      subtopics: db.subtopics
    });
  });

  app.get('/api/topics/:slug', (req, res) => {
    const { slug } = req.params;
    const topic = db.topics.find(t => t.slug === slug || t.id === slug);
    if (!topic) {
      return res.status(404).json({ error: 'Topik tidak ditemukan.' });
    }

    const material = db.materials.get(topic.id);
    const examples = db.examples.get(topic.id) || [];
    const subtopics = db.subtopics.filter(s => s.topicId === topic.id);
    const assessment = db.assessments.find(a => a.topicId === topic.id);

    // Filter practice questions (hide sensitive correct_answer)
    const practiceQuestions = db.questions
      .filter(q => q.topicId === topic.id)
      .map(({ correctAnswer, ...safeQ }) => safeQ);

    res.json({
      topic,
      material,
      examples,
      subtopics,
      assessment,
      practiceQuestions
    });
  });

  // ==========================================
  // STUDENT ADAPTIVE LEARNING & PROGRESS ROUTES
  // ==========================================
  app.get('/api/student/learning-path', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'user-student-1';
    const path = db.getStudentLearningPath(userId);
    res.json({ path });
  });

  app.get('/api/student/progress', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'user-student-1';
    const progressMap = db.getOrCreateProgressMap(userId);
    const masteryMap = db.getOrCreateMasteryMap(userId);
    const diagnostic = db.diagnosticResults.get(userId);
    const activeRemedial = db.remedialPaths.filter(r => r.userId === userId && r.status === 'ACTIVE');

    res.json({
      progress: Array.from(progressMap.values()),
      mastery: Array.from(masteryMap.values()),
      diagnostic,
      activeRemedial
    });
  });

  app.get('/api/student/history', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'user-student-1';
    const userHistory = db.learningHistory.filter(h => h.userId === userId);
    res.json({ history: userHistory });
  });

  // ==========================================
  // DIAGNOSTIC ASSESSMENT ROUTES
  // ==========================================
  app.get('/api/diagnostic/questions', (req, res) => {
    const questions = db.questions
      .filter(q => q.topicId === 'diagnostic')
      .map(({ correctAnswer, ...safeQ }) => safeQ);
    res.json({ questions });
  });

  app.post('/api/diagnostic/evaluate', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || req.body.userId || 'user-student-1';
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Format jawaban tidak valid.' });
    }

    const result = db.evaluateDiagnostic(userId, answers);
    res.json({ result });
  });

  // Practice checking endpoint
  app.post('/api/practice/check', (req, res) => {
    const { questionId, userAnswer } = req.body;
    if (!questionId) {
      return res.status(400).json({ error: 'ID soal wajib disertakan.' });
    }

    const question = db.questions.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ error: 'Soal tidak ditemukan.' });
    }

    const isCorrect = String(userAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    });
  });

  // ==========================================
  // ASSESSMENT ENGINE & SECURE TEST ROUTES
  // ==========================================
  app.get('/api/assessment/questions/:assessmentId', (req, res) => {
    const { assessmentId } = req.params;
    const assessment = db.assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Asesmen tidak ditemukan.' });
    }

    let questions: any[] = [];
    if (assessment.type === 'DIAGNOSTIC') {
      questions = db.questions.filter(q => q.topicId === 'diagnostic');
    } else if (assessment.topicId) {
      questions = db.questions.filter(q => q.topicId === assessment.topicId);
    }

    // Strip sensitive correct answers before sending to client
    const safeQuestions = questions.map(({ correctAnswer, ...rest }) => rest);

    res.json({
      assessment,
      questions: safeQuestions
    });
  });

  app.post('/api/assessment/submit', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || req.body.userId || 'user-student-1';
    const { assessmentId, topicId, answers, timeSpentSeconds = 60 } = req.body;

    if (!assessmentId || !topicId || !answers) {
      return res.status(400).json({ error: 'Parameter asesmen tidak lengkap.' });
    }

    const result = db.submitAssessment(userId, assessmentId, topicId, answers, timeSpentSeconds);
    res.json(result);
  });

  app.post('/api/assessment/security-events', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || req.body.userId || 'user-student-1';
    const { attemptId, eventType, durationSeconds = 0, severity = 'LOW', metadata = {} } = req.body;

    if (!attemptId || !eventType) {
      return res.status(400).json({ error: 'Event data tidak valid.' });
    }

    const event = db.recordSecurityEvent({
      attemptId,
      userId,
      eventType,
      durationSeconds,
      severity,
      metadata
    });

    res.json({ success: true, event });
  });

  // ==========================================
  // TEACHER DASHBOARD & SECURITY MONITOR ROUTES
  // ==========================================
  app.get('/api/teacher/overview', (req, res) => {
    const students = Array.from(db.users.values())
      .filter(u => u.role === 'student')
      .map(s => {
        const mastery = Array.from(db.studentMastery.get(s.id)?.values() || []);
        const totalMastered = mastery.filter(m => m.isMastered).length;
        const avgScore = mastery.length > 0
          ? Math.round(mastery.reduce((acc, curr) => acc + curr.masteryScore, 0) / mastery.length)
          : 0;
        const remedial = db.remedialPaths.filter(r => r.userId === s.id && r.status === 'ACTIVE');
        return {
          id: s.id,
          fullName: s.fullName,
          email: s.email,
          classGrade: s.classGrade,
          masteredTopicsCount: totalMastered,
          averageMastery: avgScore,
          activeRemedialCount: remedial.length
        };
      });

    const securitySummaries = db.getSecuritySummaries();
    const reviewRequiredCount = securitySummaries.filter(s => s.overallStatus === 'REVIEW_REQUIRED').length;

    res.json({
      students,
      totalStudents: students.length,
      reviewRequiredCount,
      totalAssessmentsCompleted: db.assessmentAttempts.length,
      topicsCount: db.topics.length
    });
  });

  app.get('/api/teacher/security-monitor', (req, res) => {
    const summaries = db.getSecuritySummaries();
    res.json({ summaries, allEvents: db.securityEvents });
  });

  app.post('/api/teacher/security-events/:id/review', (req, res) => {
    const { id } = req.params;
    const { status, notes, reviewerId } = req.body;
    const event = db.securityEvents.find(e => e.id === id);
    if (!event) {
      return res.status(404).json({ error: 'Event tidak ditemukan.' });
    }

    event.reviewStatus = status || 'REVIEWED';
    event.reviewerNotes = notes || '';
    event.reviewedBy = reviewerId || 'user-teacher-1';
    event.reviewedAt = new Date().toISOString();

    res.json({ success: true, event });
  });

  // ==========================================
  // ADMIN CURRICULUM CRUD & CONFIG ROUTES
  // ==========================================
  app.get('/api/admin/users', (req, res) => {
    const userList = Array.from(db.users.values()).map(({ passwordHash, ...safe }) => safe);
    res.json({ users: userList });
  });

  app.post('/api/admin/topics', (req, res) => {
    const { title, slug, levelId, phaseId, description, passingScore = 75, estimatedMinutes = 45, prerequisiteIds = [] } = req.body;
    if (!title || !slug || !levelId) {
      return res.status(400).json({ error: 'Data topik belum lengkap.' });
    }

    const newTopic: any = {
      id: `topic-${Date.now()}`,
      levelId,
      phaseId: phaseId || 'phase-d',
      title,
      slug,
      description,
      passingScore: Number(passingScore) || 75,
      estimatedMinutes: Number(estimatedMinutes) || 45,
      orderIndex: db.topics.length + 1,
      prerequisiteIds
    };

    db.topics.push(newTopic);
    res.json({ success: true, topic: newTopic });
  });

  app.put('/api/admin/topics/:id', (req, res) => {
    const { id } = req.params;
    const topic = db.topics.find(t => t.id === id);
    if (!topic) {
      return res.status(404).json({ error: 'Topik tidak ditemukan.' });
    }

    Object.assign(topic, req.body);
    res.json({ success: true, topic });
  });

  // ==========================================
  // AI TUTOR ROUTE
  // ==========================================
  app.post('/api/ai-tutor', async (req, res) => {
    try {
      const { userMessage, topicTitle, chatHistory, isAssessmentActive } = req.body;
      if (!userMessage) {
        return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
      }

      const reply = await askAiTutor({
        userMessage,
        topicTitle,
        chatHistory,
        isAssessmentActive: !!isAssessmentActive
      });

      res.json({ reply });
    } catch (err: any) {
      console.error('AI Tutor API route error:', err);
      res.status(500).json({ error: 'Gagal mendapatkan jawaban dari AI Tutor.' });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE & STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MathPath server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

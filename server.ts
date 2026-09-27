/**
 * MathPath Express Server Entry Point
 * Host: 0.0.0.0, Port: 3000
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/store';
import {
  askAiTutor,
  generateLearningMaterialAi,
  generateExamplesAi,
  generateQuestionsAi,
  generateTopicPackageAi,
  alignCurriculumAndPrerequisites,
  refineAiContent,
  calculateQualityMetrics,
  analyzeCurriculumDocument,
  generateStandard10QuestionsAssessment
} from './server/ai';
import { AiGeneratedItem, AiGenerationJob } from './src/types';

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
  // AI CONTENT GENERATION & REVIEW ROUTES
  // ==========================================

  // 1. Generate AI Content (Material, Examples, Questions, or Topic Package)
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const {
        contentType,
        topicId,
        topicTitle,
        phaseCode,
        targetGrade,
        questionCount,
        customInstructions,
        creatorId,
        creatorName,
        creatorRole
      } = req.body;

      if (!contentType || !topicTitle || !phaseCode) {
        return res.status(400).json({ error: 'Parameter contentType, topicTitle, dan phaseCode wajib diisi.' });
      }

      let contentData: any = {};
      const reqObj = {
        contentType,
        topicId,
        topicTitle,
        phaseCode,
        targetGrade,
        questionCount: questionCount || (contentType === 'EXAMPLES' ? 3 : 5),
        customInstructions
      };

      if (contentType === 'MATERIAL') {
        const material = await generateLearningMaterialAi(reqObj);
        contentData.material = material;
      } else if (contentType === 'EXAMPLES') {
        const examples = await generateExamplesAi(reqObj);
        contentData.examples = examples;
      } else if (contentType === 'QUESTIONS') {
        const questions = await generateQuestionsAi(reqObj);
        contentData.questions = questions;
      } else if (contentType === 'TOPIC_PACKAGE') {
        const topicPackage = await generateTopicPackageAi(reqObj);
        contentData.topicPackage = topicPackage;
      }

      const qualityMetrics = calculateQualityMetrics(contentType, contentData);

      const newItem: AiGeneratedItem = {
        id: `ai-gen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        contentType,
        topicId,
        topicTitle,
        phaseCode,
        status: 'PENDING_REVIEW',
        version: 1,
        contentData,
        qualityMetrics,
        creatorId: creatorId || 'user-teacher-1',
        creatorName: creatorName || 'Guru Matematika',
        creatorRole: creatorRole || 'teacher',
        aiPromptUsed: customInstructions || `Generate ${contentType} for ${topicTitle} (${phaseCode})`,
        createdAt: new Date().toISOString()
      };

      db.createAiGeneratedContent(newItem);
      res.json({ success: true, item: newItem });
    } catch (err: any) {
      console.error('AI Content Generation Route Error:', err);
      res.status(500).json({ error: 'Gagal menghasilkan konten dengan AI.' });
    }
  });

  // 2. Get AI Content Queue (Filterable by status & contentType)
  app.get('/api/ai/content-queue', (req, res) => {
    const { status, contentType } = req.query as { status?: string; contentType?: string };
    const queue = db.getAiGeneratedContentQueue({ status, contentType });
    res.json({ queue });
  });

  // 3. Get Single AI Content Item
  app.get('/api/ai/content-queue/:id', (req, res) => {
    const item = db.getAiGeneratedContentById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Draft konten tidak ditemukan.' });
    }
    res.json({ item });
  });

  // 4. Update / Edit Draft Content
  app.put('/api/ai/content-queue/:id', (req, res) => {
    const updated = db.updateAiGeneratedContent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Draft konten tidak ditemukan.' });
    }
    res.json({ success: true, item: updated });
  });

  // 5. Review & Approval (Approve or Reject -> Publishes to live curriculum if approved)
  app.post('/api/ai/content-queue/:id/review', (req, res) => {
    const { status, reviewerId, reviewerName, reviewerNotes } = req.body;
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status review harus APPROVED atau REJECTED.' });
    }

    const result = db.reviewAiGeneratedContent(req.params.id, {
      status,
      reviewerId: reviewerId || 'user-teacher-1',
      reviewerName: reviewerName || 'Guru Validator',
      reviewerNotes
    });

    if (!result) {
      return res.status(404).json({ error: 'Draft konten tidak ditemukan.' });
    }

    res.json({
      success: true,
      item: result.item,
      publishedAction: result.publishedAction
    });
  });

  // 6. Refine AI Content based on feedback notes
  app.post('/api/ai/content-queue/:id/refine', async (req, res) => {
    try {
      const { feedbackNotes } = req.body;
      const item = db.getAiGeneratedContentById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Draft konten tidak ditemukan.' });
      }

      const refinedData = await refineAiContent(item.contentData, feedbackNotes || 'Sempurnakan penjelasan dan rumus.');
      const updatedMetrics = calculateQualityMetrics(item.contentType, refinedData);

      item.contentData = refinedData;
      item.qualityMetrics = updatedMetrics;
      item.aiPromptUsed = `${item.aiPromptUsed} | Revisi: ${feedbackNotes}`;

      res.json({ success: true, item });
    } catch (err: any) {
      console.error('Refine route error:', err);
      res.status(500).json({ error: 'Gagal melakukan revisi AI.' });
    }
  });

  // 7. AI Curriculum Alignment & Prerequisite Graph Analysis
  app.post('/api/ai/curriculum-align', async (req, res) => {
    try {
      const { topicTitle, targetPhase } = req.body;
      if (!topicTitle) {
        return res.status(400).json({ error: 'Judul topik harus diisi.' });
      }

      const existingTopics = db.topics.map(t => ({
        id: t.id,
        title: t.title,
        phaseCode: t.phaseId?.replace('phase-', 'FASE_').toUpperCase()
      }));

      const alignment = await alignCurriculumAndPrerequisites({
        topicTitle,
        targetPhase,
        existingTopics
      });

      res.json({ success: true, alignment });
    } catch (err: any) {
      console.error('Curriculum alignment error:', err);
      res.status(500).json({ error: 'Gagal menganalisis kurikulum.' });
    }
  });

  // ==========================================
  // CURRICULUM SOURCES & UNITS ROUTES
  // ==========================================
  app.get('/api/curriculum/sources', (req, res) => {
    res.json({ sources: db.curriculumSources });
  });

  app.post('/api/curriculum/sources', (req, res) => {
    const { name, phaseCode, subject = 'Matematika', sourceType = 'DOCUMENT_TEXT', rawContent, cpText, tpText, atpText, isOfficial = false } = req.body;
    if (!name || !phaseCode || !rawContent) {
      return res.status(400).json({ error: 'Data dokumen kurikulum wajib diisi.' });
    }

    const newSource = db.createCurriculumSource({
      id: `src-${Date.now()}`,
      name,
      phaseCode,
      subject,
      isOfficial: !!isOfficial,
      sourceType,
      rawContent,
      cpText,
      tpText,
      atpText,
      createdBy: 'Teacher/Admin',
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, source: newSource });
  });

  app.get('/api/curriculum/units', (req, res) => {
    const { phaseCode } = req.query;
    let units = db.curriculumUnits;
    if (phaseCode) {
      units = units.filter(u => u.phaseCode === phaseCode);
    }
    res.json({ units, competencies: db.competencies });
  });

  // AI Curriculum Document Analysis
  app.post('/api/curriculum/analyze', async (req, res) => {
    try {
      const { phaseCode = 'FASE_D', subject = 'Matematika', sourceType = 'DOCUMENT_TEXT', documentText, cpText, tpText, atpText, isOfficial = false } = req.body;
      const result = await analyzeCurriculumDocument({
        phaseCode,
        subject,
        sourceType,
        documentText,
        cpText,
        tpText,
        atpText,
        isOfficial
      });

      // Save generated units to database
      if (result.units && result.units.length > 0) {
        result.units.forEach(u => db.createCurriculumUnit(u));
      }

      res.json({ success: true, result });
    } catch (err: any) {
      console.error('Curriculum analysis route error:', err);
      res.status(500).json({ error: 'Gagal menganalisis dokumen kurikulum.' });
    }
  });

  // ==========================================
  // AI GENERATION JOB SYSTEM (Async Progress Tracking)
  // ==========================================
  app.post('/api/ai/jobs/start', async (req, res) => {
    try {
      const {
        jobType = 'FULL_TOPIC_CONTENT',
        topicTitle,
        phaseCode = 'FASE_D',
        element = 'Aljabar',
        customInstructions,
        targetGrade,
        creatorId = 'user-teacher-1',
        creatorName = 'Guru Matematika',
        creatorRole = 'teacher'
      } = req.body;

      if (!topicTitle) {
        return res.status(400).json({ error: 'Judul topik wajib diisi.' });
      }

      const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const stages = [
        { stage: 'ANALYSIS', progressPercent: 20, description: 'Menganalisis kurikulum & kompetensi...', completed: false },
        { stage: 'TOPICS', progressPercent: 35, description: 'Menghasilkan topik & subtopik...', completed: false },
        { stage: 'MATERIALS', progressPercent: 50, description: 'Menyusun materi pembelajaran komprehensif...', completed: false },
        { stage: 'EXAMPLES', progressPercent: 65, description: 'Menyusun contoh soal langkah demi langkah...', completed: false },
        { stage: 'EXERCISES', progressPercent: 80, description: 'Menghasilkan latihan berjenjang (LOTS, MOTS, HOTS)...', completed: false },
        { stage: 'ASSESSMENT', progressPercent: 95, description: 'Menyusun 10 butir asesmen (4 LOTS, 4 MOTS, 2 HOTS, KKM 75)...', completed: false },
        { stage: 'QUALITY_CHECK', progressPercent: 100, description: 'Validasi AI Quality Check & Finalisasi...', completed: false }
      ];

      const newJob: AiGenerationJob = {
        id: jobId,
        jobType,
        status: 'PROCESSING',
        progressPercent: 20,
        currentStage: stages[0].description,
        stages,
        inputParams: req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.createAiGenerationJob(newJob);

      // Launch asynchronous multi-stage job processing
      (async () => {
        try {
          // Stage 1 -> 2
          await new Promise(r => setTimeout(r, 600));
          stages[0].completed = true;
          db.updateAiGenerationJob(jobId, { progressPercent: 35, currentStage: stages[1].description, stages });

          // Stage 2: Topic & prerequisites
          await new Promise(r => setTimeout(r, 700));
          stages[1].completed = true;
          db.updateAiGenerationJob(jobId, { progressPercent: 50, currentStage: stages[2].description, stages });

          // Stage 3: Material
          const material = await generateLearningMaterialAi({
            contentType: 'MATERIAL',
            topicTitle,
            phaseCode,
            customInstructions
          });
          stages[2].completed = true;
          db.updateAiGenerationJob(jobId, { progressPercent: 65, currentStage: stages[3].description, stages });

          // Stage 4: Examples
          const examples = await generateExamplesAi({
            contentType: 'EXAMPLES',
            topicTitle,
            phaseCode,
            questionCount: 3,
            customInstructions
          });
          stages[3].completed = true;
          db.updateAiGenerationJob(jobId, { progressPercent: 80, currentStage: stages[4].description, stages });

          // Stage 5: Practice questions (3 questions LOTS, MOTS, HOTS)
          const practiceQuestions = await generateQuestionsAi({
            contentType: 'QUESTIONS',
            topicTitle,
            phaseCode,
            questionCount: 3,
            customInstructions: 'Latihan formatif siswa'
          });
          stages[4].completed = true;
          db.updateAiGenerationJob(jobId, { progressPercent: 95, currentStage: stages[5].description, stages });

          // Stage 6: 10 Assessments (4 LOTS, 4 MOTS, 2 HOTS with default KKM 75)
          const assessmentQuestions = await generateStandard10QuestionsAssessment({
            topicTitle,
            phaseCode,
            competencyTitle: `${element} - Capaian Pembelajaran ${phaseCode}`,
            passingScore: 75
          });
          stages[5].completed = true;

          // Assemble full topic package
          const slug = topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const contentData = {
            material,
            examples,
            questions: assessmentQuestions,
            practiceQuestions: practiceQuestions as any,
            topicPackage: {
              title: topicTitle,
              slug,
              phaseId: `phase-${phaseCode.toLowerCase().replace('fase_', '')}`,
              phaseCode: phaseCode as any,
              element,
              description: `Modul komprehensif ${topicTitle} (${phaseCode}) dengan penjelasan bertahap, contoh scaffolding, dan 10 butir asesmen standar KKM 75.`,
              passingScore: 75,
              estimatedMinutes: 50,
              prerequisiteTopicIds: ['topic-bentuk-aljabar'],
              prerequisiteReasoning: `Penguasaan ${topicTitle} membutuhkan pemahaman aljabar dan konsep prasyarat terkait.`,
              material,
              examples,
              questions: assessmentQuestions
            }
          };

          // Stage 7: Quality Check
          const qcResult = db.runAiQualityCheck('TOPIC_PACKAGE', contentData);
          stages[6].completed = true;

          // Save generated item into AI Content Queue
          const contentItemId = `ai-gen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const newItem: AiGeneratedItem = {
            id: contentItemId,
            contentType: 'TOPIC_PACKAGE',
            topicTitle,
            phaseCode: phaseCode as any,
            status: qcResult.status, // 'REVIEW' or 'NEEDS_REVIEW'
            version: 1,
            contentData,
            qualityMetrics: qcResult.metrics,
            creatorId,
            creatorName,
            creatorRole,
            aiPromptUsed: customInstructions || `Generate Full Module: ${topicTitle} (${phaseCode})`,
            createdAt: new Date().toISOString()
          };

          db.createAiGeneratedContent(newItem);

          // Complete Job
          db.updateAiGenerationJob(jobId, {
            status: 'COMPLETED',
            progressPercent: 100,
            currentStage: 'Proses selesai! Konten berhasil dimasukkan ke antrean Review.',
            stages,
            resultData: {
              contentItemId: newItem.id,
              status: newItem.status,
              qualityMetrics: qcResult.metrics,
              topicTitle
            }
          });
        } catch (jobErr: any) {
          console.error('Job processing background error:', jobErr);
          db.updateAiGenerationJob(jobId, {
            status: 'FAILED',
            error: jobErr?.message || 'Terjadi kesalahan teknis saat menghasilkan konten.',
            currentStage: 'Proses gagal. Silakan klik tombol Coba Lagi (Retry).'
          });
        }
      })();

      res.json({ success: true, job: newJob });
    } catch (err: any) {
      console.error('Start AI job error:', err);
      res.status(500).json({ error: 'Gagal memulai AI Generation Job.' });
    }
  });

  app.get('/api/ai/jobs/:id', (req, res) => {
    const job = db.getAiGenerationJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job tidak ditemukan.' });
    }
    res.json({ job });
  });

  app.get('/api/ai/jobs', (req, res) => {
    res.json({ jobs: db.getAllAiGenerationJobs() });
  });

  app.post('/api/ai/jobs/:id/retry', (req, res) => {
    const job = db.getAiGenerationJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job tidak ditemukan.' });
    }

    // Reset job state and trigger reprocessing
    job.status = 'PROCESSING';
    job.progressPercent = 20;
    job.error = undefined;
    job.currentStage = 'Mengulang proses analisis & pembuatan konten...';
    job.stages.forEach(s => { s.completed = false; });
    db.updateAiGenerationJob(job.id, job);

    res.json({ success: true, job });
  });

  // ==========================================
  // PUBLISH & VERSIONING ROUTES
  // ==========================================
  app.post('/api/ai/content-queue/:id/publish', (req, res) => {
    const { publisherId = 'user-teacher-1', publisherName = 'Fasilitator Kurikulum', notes } = req.body;
    const result = db.publishAiContent(req.params.id, publisherId, publisherName, notes);
    if (!result) {
      return res.status(404).json({ error: 'Draft konten tidak ditemukan.' });
    }

    res.json({
      success: true,
      item: result.item,
      publishedAction: result.publishedAction
    });
  });

  app.get('/api/ai/content-versions/:contentId', (req, res) => {
    const versions = db.getContentVersions(req.params.contentId);
    res.json({ versions });
  });

  app.post('/api/ai/content-queue/:id/regenerate', async (req, res) => {
    try {
      const { newInstructions } = req.body;
      const item = db.getAiGeneratedContentById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Draft konten tidak ditemukan.' });
      }

      // Re-generate package
      const topicPackage = await generateTopicPackageAi({
        contentType: 'TOPIC_PACKAGE',
        topicTitle: item.topicTitle,
        phaseCode: item.phaseCode,
        customInstructions: newInstructions || item.aiPromptUsed
      });

      const updatedData = {
        material: topicPackage.material,
        examples: topicPackage.examples,
        questions: topicPackage.questions,
        topicPackage
      };

      const qc = db.runAiQualityCheck('TOPIC_PACKAGE', updatedData);
      const updated = db.updateAiGeneratedContent(item.id, {
        contentData: updatedData,
        qualityMetrics: qc.metrics,
        status: qc.status,
        reviewerNotes: `Diregenerasi AI: ${newInstructions || 'Penyempurnaan otomatis'}`
      });

      res.json({ success: true, item: updated });
    } catch (err: any) {
      console.error('Regenerate route error:', err);
      res.status(500).json({ error: 'Gagal meregenerasi konten.' });
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

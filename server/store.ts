/**
 * MathPath Server-Side In-Memory Data Store & Adaptive Engine
 */

import {
  UserProfile,
  Phase,
  Level,
  Topic,
  Subtopic,
  LearningMaterial,
  ExampleItem,
  Question,
  Assessment,
  AssessmentAttempt,
  StudentProgress,
  StudentMastery,
  LearningHistoryItem,
  DiagnosticResult,
  RemedialPath,
  AssessmentSecurityEvent,
  AssessmentAnswerSubmission,
  SecuritySessionSummary,
  AiGeneratedItem,
  AiContentType,
  AiContentStatus,
  CurriculumSource,
  CurriculumUnit,
  Competency,
  PracticeQuestion,
  AiGenerationJob,
  ContentReview,
  ContentVersion,
  AiQualityIssue,
  JobProgressStage
} from '../src/types';

import {
  INITIAL_PHASES,
  INITIAL_LEVELS,
  INITIAL_TOPICS,
  INITIAL_SUBTOPICS,
  INITIAL_MATERIALS,
  INITIAL_EXAMPLES,
  INITIAL_QUESTIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_CURRICULUM_SOURCES,
  INITIAL_CURRICULUM_UNITS,
  INITIAL_COMPETENCIES
} from './data';

class DatabaseStore {
  public users: Map<string, UserProfile & { passwordHash: string }> = new Map();
  public phases: Phase[] = [...INITIAL_PHASES];
  public levels: Level[] = [...INITIAL_LEVELS];
  public topics: Topic[] = [...INITIAL_TOPICS];
  public subtopics: Subtopic[] = [...INITIAL_SUBTOPICS];
  public materials: Map<string, LearningMaterial> = new Map(Object.entries(INITIAL_MATERIALS));
  public examples: Map<string, ExampleItem[]> = new Map(Object.entries(INITIAL_EXAMPLES));
  public questions: Question[] = [...INITIAL_QUESTIONS];
  public assessments: Assessment[] = [...INITIAL_ASSESSMENTS];

  public curriculumSources: CurriculumSource[] = [...INITIAL_CURRICULUM_SOURCES];
  public curriculumUnits: CurriculumUnit[] = [...INITIAL_CURRICULUM_UNITS];
  public competencies: Competency[] = [...INITIAL_COMPETENCIES];
  public practiceQuestions: PracticeQuestion[] = [];
  public aiGenerationJobs: Map<string, AiGenerationJob> = new Map();
  public contentReviews: ContentReview[] = [];
  public contentVersions: ContentVersion[] = [];

  public studentProgress: Map<string, Map<string, StudentProgress>> = new Map();
  public studentMastery: Map<string, Map<string, StudentMastery>> = new Map();
  public learningHistory: LearningHistoryItem[] = [];
  public diagnosticResults: Map<string, DiagnosticResult> = new Map();
  public remedialPaths: RemedialPath[] = [];
  public assessmentAttempts: AssessmentAttempt[] = [];
  public securityEvents: AssessmentSecurityEvent[] = [];
  public aiGeneratedContent: Map<string, AiGeneratedItem> = new Map();

  public resetTokens: Map<string, { email: string; expiresAt: number }> = new Map();


  constructor() {
    this.seedInitialUsers();
    this.seedDemoStudentProgress();
    this.seedInitialAiContent();
  }

  private seedInitialUsers() {
    // Demo Student (Has completed diagnostic, learning path active)
    this.users.set('user-student-1', {
      id: 'user-student-1',
      email: 'budi@mathpath.id',
      fullName: 'Budi Pratama',
      role: 'student',
      classGrade: 'Kelas 10 SMA',
      passwordHash: 'password123',
      hasCompletedDiagnostic: true
    });

    // Demo Student 2 (New student, ready for fresh diagnostic)
    this.users.set('user-student-2', {
      id: 'user-student-2',
      email: 'ani@mathpath.id',
      fullName: 'Siti Rahmawati',
      role: 'student',
      classGrade: 'Kelas 9 SMP',
      passwordHash: 'password123',
      hasCompletedDiagnostic: false
    });

    // Demo Teacher
    this.users.set('user-teacher-1', {
      id: 'user-teacher-1',
      email: 'ibu.dewi@mathpath.id',
      fullName: 'Ibu Dewi Safitri, S.Pd.',
      role: 'teacher',
      classGrade: 'Guru Matematika SMA & SMP',
      passwordHash: 'password123',
      hasCompletedDiagnostic: true
    });

    // Demo Admin
    this.users.set('user-admin-1', {
      id: 'user-admin-1',
      email: 'admin@mathpath.id',
      fullName: 'Admin Kurikulum MathPath',
      role: 'admin',
      passwordHash: 'admin123',
      hasCompletedDiagnostic: true
    });
  }

  private seedDemoStudentProgress() {
    const studentId = 'user-student-1';
    const progressMap = new Map<string, StudentProgress>();
    const masteryMap = new Map<string, StudentMastery>();

    // Initial unlocked topics for demo
    progressMap.set('topic-pecahan-senilai', {
      topicId: 'topic-pecahan-senilai',
      status: 'MASTERED',
      currentStep: 'COMPLETED',
      score: 90,
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    });

    progressMap.set('topic-bentuk-aljabar', {
      topicId: 'topic-bentuk-aljabar',
      status: 'MASTERED',
      currentStep: 'COMPLETED',
      score: 85,
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    });

    progressMap.set('topic-plsv', {
      topicId: 'topic-plsv',
      status: 'MASTERED',
      currentStep: 'COMPLETED',
      score: 80,
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    });

    // Current topic in progress: Fungsi Kuadrat
    progressMap.set('topic-fungsi-kuadrat', {
      topicId: 'topic-fungsi-kuadrat',
      status: 'AVAILABLE',
      currentStep: 'MATERIAL',
      updatedAt: new Date().toISOString()
    });

    this.studentProgress.set(studentId, progressMap);

    masteryMap.set('topic-pecahan-senilai', {
      topicId: 'topic-pecahan-senilai',
      topicTitle: 'Pecahan Senilai',
      phaseCode: 'FASE_B',
      masteryScore: 90,
      attemptsCount: 1,
      lastScore: 90,
      isMastered: true,
      masteredAt: new Date(Date.now() - 86400000 * 3).toISOString()
    });

    masteryMap.set('topic-bentuk-aljabar', {
      topicId: 'topic-bentuk-aljabar',
      topicTitle: 'Bentuk Aljabar & Operasi Dasar',
      phaseCode: 'FASE_D',
      masteryScore: 85,
      attemptsCount: 1,
      lastScore: 85,
      isMastered: true,
      masteredAt: new Date(Date.now() - 86400000 * 2).toISOString()
    });

    this.studentMastery.set(studentId, masteryMap);

    // Add initial learning history
    this.learningHistory.push(
      {
        id: 'hist-1',
        userId: studentId,
        topicId: 'topic-pecahan-senilai',
        topicTitle: 'Pecahan Senilai',
        activityType: 'ASSESSMENT',
        score: 90,
        status: 'MASTERED',
        durationSeconds: 780,
        startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 3 + 780000).toISOString()
      },
      {
        id: 'hist-2',
        userId: studentId,
        topicId: 'topic-bentuk-aljabar',
        topicTitle: 'Bentuk Aljabar & Operasi Dasar',
        activityType: 'ASSESSMENT',
        score: 85,
        status: 'MASTERED',
        durationSeconds: 890,
        startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 2 + 890000).toISOString()
      }
    );

    // Add a simulated security log for demo in teacher dashboard
    const demoAttemptId = 'att-demo-flagged';
    this.securityEvents.push(
      {
        id: 'sec-1',
        attemptId: demoAttemptId,
        userId: 'user-student-2',
        userName: 'Siti Rahmawati',
        topicTitle: 'Fungsi Kuadrat & Titik Ekstrem',
        eventType: 'TAB_SWITCH',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        durationSeconds: 6,
        severity: 'MEDIUM',
        metadata: { info: 'Siswa berpindah tab browser selama 6 detik lalu kembali.' },
        reviewStatus: 'PENDING'
      },
      {
        id: 'sec-2',
        attemptId: demoAttemptId,
        userId: 'user-student-2',
        userName: 'Siti Rahmawati',
        topicTitle: 'Fungsi Kuadrat & Titik Ekstrem',
        eventType: 'FACE_NOT_DETECTED',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        durationSeconds: 4,
        severity: 'LOW',
        metadata: { info: 'Wajah tidak terdeteksi sementara (mungkin menunduk menulis di kertas buram).' },
        reviewStatus: 'PENDING'
      }
    );
  }

  // --- Student Progress & Adaptive Engine Methods ---

  public getOrCreateProgressMap(userId: string): Map<string, StudentProgress> {
    if (!this.studentProgress.has(userId)) {
      this.studentProgress.set(userId, new Map());
    }
    return this.studentProgress.get(userId)!;
  }

  public getOrCreateMasteryMap(userId: string): Map<string, StudentMastery> {
    if (!this.studentMastery.has(userId)) {
      this.studentMastery.set(userId, new Map());
    }
    return this.studentMastery.get(userId)!;
  }

  public getStudentLearningPath(userId: string) {
    const progressMap = this.getOrCreateProgressMap(userId);
    const diagnostic = this.diagnosticResults.get(userId);

    return this.topics.map(topic => {
      const userProgress = progressMap.get(topic.id);
      let status = userProgress ? userProgress.status : 'LOCKED';

      // If no diagnostic yet and no progress, first topic is AVAILABLE or prompt diagnostic
      if (!diagnostic && !userProgress && topic.orderIndex === 1) {
        status = 'AVAILABLE';
      }

      // Check prerequisites if not already mastered
      if (status !== 'MASTERED' && status !== 'NEEDS_REMEDIAL') {
        const prereqs = topic.prerequisiteIds || [];
        const allPrereqsMastered = prereqs.every(pId => {
          const p = progressMap.get(pId);
          return p && p.status === 'MASTERED';
        });

        if (prereqs.length > 0 && !allPrereqsMastered) {
          status = 'LOCKED';
        } else if (status === 'LOCKED' && (prereqs.length === 0 || allPrereqsMastered)) {
          // If prerequisites are fulfilled, it becomes available!
          status = 'AVAILABLE';
        }
      }

      return {
        ...topic,
        status,
        score: userProgress?.score,
        currentStep: userProgress?.currentStep || 'MATERIAL'
      };
    });
  }

  // Evaluate Diagnostic Assessment (30 Questions across 10 Domains)
  public evaluateDiagnostic(userId: string, answers: AssessmentAnswerSubmission[]): DiagnosticResult {
    const diagnosticQuestions = this.questions.filter(q => q.topicId === 'diagnostic');
    let totalScore = 0;
    const maxScore = (diagnosticQuestions.length || 30) * 10;

    const domains: Record<string, { total: number; correct: number }> = {
      'Bilangan': { total: 0, correct: 0 },
      'Operasi Hitung': { total: 0, correct: 0 },
      'Pecahan': { total: 0, correct: 0 },
      'Rasio & Perbandingan': { total: 0, correct: 0 },
      'Bentuk Aljabar': { total: 0, correct: 0 },
      'Persamaan Linear': { total: 0, correct: 0 },
      'Geometri & Teorema Pythagoras': { total: 0, correct: 0 },
      'Statistika': { total: 0, correct: 0 },
      'Peluang': { total: 0, correct: 0 },
      'Relasi & Fungsi': { total: 0, correct: 0 }
    };

    answers.forEach(ans => {
      const q = diagnosticQuestions.find(dq => dq.id === ans.questionId);
      if (!q) return;

      const tag = q.conceptTag || 'Lainnya';
      let domainKey = 'Bentuk Aljabar';
      if (tag.includes('Bilangan')) domainKey = 'Bilangan';
      else if (tag.includes('Operasi')) domainKey = 'Operasi Hitung';
      else if (tag.includes('Pecahan')) domainKey = 'Pecahan';
      else if (tag.includes('Rasio')) domainKey = 'Rasio & Perbandingan';
      else if (tag.includes('Aljabar')) domainKey = 'Bentuk Aljabar';
      else if (tag.includes('Persamaan Linear')) domainKey = 'Persamaan Linear';
      else if (tag.includes('Geometri') || tag.includes('Pythagoras')) domainKey = 'Geometri & Teorema Pythagoras';
      else if (tag.includes('Statistika')) domainKey = 'Statistika';
      else if (tag.includes('Peluang')) domainKey = 'Peluang';
      else if (tag.includes('Fungsi')) domainKey = 'Relasi & Fungsi';

      if (domains[domainKey]) {
        domains[domainKey].total += 1;
      }

      if (ans.userAnswer === q.correctAnswer) {
        totalScore += q.points;
        if (domains[domainKey]) {
          domains[domainKey].correct += 1;
        }
      }
    });

    const percent = Math.round((totalScore / (maxScore || 1)) * 100);

    const competencyScores = Object.entries(domains).map(([domain, data]) => {
      const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 70;
      let status: 'Perlu Penguatan' | 'Cukup' | 'Mahir' = 'Cukup';
      if (score < 60) status = 'Perlu Penguatan';
      else if (score >= 80) status = 'Mahir';

      let details = `Penguasaan domain ${domain}: ${score}%.`;
      if (score < 60) details += ' Disarankan penguatan konsep fondasi.';
      return { domain, score, status, details };
    });

    // Determine recommended Phase and Topic
    let recPhaseCode = 'FASE_D';
    let recTopicId = 'topic-bentuk-aljabar';
    let summaryText = 'Berdasarkan asesmen diagnostik, kamu disarankan memulai dari Fase D: Bentuk Aljabar & Operasi Dasar.';

    if (percent < 50) {
      recPhaseCode = 'FASE_B';
      recTopicId = 'topic-pecahan-senilai';
      summaryText = 'Fondasi pecahan dan aritmatika dasar perlu diperkuat terlebih dahulu sebelum melangkah ke aljabar dan fungsi.';
    } else if (percent < 75) {
      recPhaseCode = 'FASE_D';
      recTopicId = 'topic-bentuk-aljabar';
      summaryText = 'Kemampuan aritmatika baik, namun konsep dasar aljabar perlu diperdalam untuk kesuksesan Fase SMP/SMA.';
    } else {
      recPhaseCode = 'FASE_E';
      recTopicId = 'topic-fungsi-kuadrat';
      summaryText = 'Penguasaan konsep dasar dan aljabar sangat solid! Kamu siap memulai eksplorasi Fungsi Kuadrat di Fase E.';
    }

    const recPhase = this.phases.find(p => p.code === recPhaseCode) || this.phases[3];
    const recTopic = this.topics.find(t => t.id === recTopicId) || this.topics[7];

    const result: DiagnosticResult = {
      id: `diag-res-${Date.now()}`,
      userId,
      recommendedPhaseId: recPhase.id,
      recommendedPhaseCode: recPhase.code,
      recommendedPhaseName: recPhase.name,
      recommendedTopicId: recTopic.id,
      recommendedTopicTitle: recTopic.title,
      recommendedTopicSlug: recTopic.slug,
      competencyScores,
      rawScore: percent,
      summaryText,
      completedAt: new Date().toISOString()
    };

    this.diagnosticResults.set(userId, result);

    // Update user record: mark hasCompletedDiagnostic as true
    const user = this.users.get(userId);
    if (user) {
      user.hasCompletedDiagnostic = true;
    }

    // Unlock recommended topic in progress
    const progressMap = this.getOrCreateProgressMap(userId);
    progressMap.set(recTopic.id, {
      topicId: recTopic.id,
      status: 'AVAILABLE',
      currentStep: 'MATERIAL',
      updatedAt: new Date().toISOString()
    });

    // Record learning history
    this.learningHistory.push({
      id: `hist-${Date.now()}`,
      userId,
      topicTitle: 'Asesmen Diagnostik Awal (Fase A - F)',
      activityType: 'DIAGNOSTIC',
      score: percent,
      status: 'COMPLETED',
      durationSeconds: 600,
      startedAt: new Date(Date.now() - 600000).toISOString(),
      completedAt: new Date().toISOString()
    });

    return result;
  }

  // Server-side Assessment Evaluation & Mastery Update
  public submitAssessment(
    userId: string,
    assessmentId: string,
    topicId: string,
    answers: AssessmentAnswerSubmission[],
    timeSpentSeconds: number
  ): { attempt: AssessmentAttempt; recommendedNextTopic?: any } {
    const assessment = this.assessments.find(a => a.id === assessmentId);
    const topic = this.topics.find(t => t.id === topicId);
    const questions = this.questions.filter(q => q.topicId === topicId);

    let correctCount = 0;
    let lotsCorrect = 0, lotsTotal = 0;
    let motsCorrect = 0, motsTotal = 0;
    let hotsCorrect = 0, hotsTotal = 0;

    answers.forEach(ans => {
      const q = questions.find(item => item.id === ans.questionId);
      if (!q) return;

      if (q.difficulty === 'LOTS') lotsTotal++;
      if (q.difficulty === 'MOTS') motsTotal++;
      if (q.difficulty === 'HOTS') hotsTotal++;

      if (ans.userAnswer === q.correctAnswer) {
        correctCount++;
        if (q.difficulty === 'LOTS') lotsCorrect++;
        if (q.difficulty === 'MOTS') motsCorrect++;
        if (q.difficulty === 'HOTS') hotsCorrect++;
      }
    });

    const totalQuestions = questions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passingScore = topic?.passingScore || 75;
    const isPassed = score >= passingScore;

    const lotsScore = lotsTotal > 0 ? Math.round((lotsCorrect / lotsTotal) * 100) : 100;
    const motsScore = motsTotal > 0 ? Math.round((motsCorrect / motsTotal) * 100) : 100;
    const hotsScore = hotsTotal > 0 ? Math.round((hotsCorrect / hotsTotal) * 100) : 100;

    let analysisStrengths = 'Penguasaan konsep dasar (LOTS) dan pemahaman prosedural (MOTS) berjalan baik.';
    let analysisWeaknesses = '';
    let analysisMisconceptions = '';

    if (score < passingScore) {
      analysisWeaknesses = 'Masih terdapat kesulitan dalam pemfaktoran bentuk kuadrat dan penentuan tanda sumbu simetri.';
      analysisMisconceptions = 'Kesalahan sering muncul saat membagi koefisien b dengan 2a dan mengabaikan tanda negatif pada rumus x_p = -b/(2a).';
    } else {
      analysisStrengths = 'Siswa menunjukkan penguasaan yang sangat matang dalam perhitungan sumbu simetri, diskriminan, dan analisis titik balik ekstrem parabola.';
    }

    let recommendedNextTopic: any = null;
    const progressMap = this.getOrCreateProgressMap(userId);
    const masteryMap = this.getOrCreateMasteryMap(userId);

    if (isPassed) {
      // Mark topic as MASTERED
      progressMap.set(topicId, {
        topicId,
        status: 'MASTERED',
        currentStep: 'COMPLETED',
        score,
        updatedAt: new Date().toISOString()
      });

      // Update Mastery
      const existingMastery = masteryMap.get(topicId);
      const attemptsCount = (existingMastery?.attemptsCount || 0) + 1;
      masteryMap.set(topicId, {
        topicId,
        topicTitle: topic?.title || 'Topik',
        phaseCode: (topic?.phaseId?.replace('phase-', 'FASE_').toUpperCase() as any) || 'FASE_E',
        masteryScore: Math.max(score, existingMastery?.masteryScore || 0),
        attemptsCount,
        lastScore: score,
        isMastered: true,
        masteredAt: new Date().toISOString()
      });

      // Check if this was a prerequisite topic that resolves an active remedial path!
      const activeRemedial = this.remedialPaths.find(
        r => r.userId === userId && r.prerequisiteTopicId === topicId && r.status === 'ACTIVE'
      );

      if (activeRemedial) {
        activeRemedial.status = 'RESOLVED';
        const originTopic = this.topics.find(t => t.id === activeRemedial.originTopicId);
        if (originTopic) {
          progressMap.set(originTopic.id, {
            topicId: originTopic.id,
            status: 'AVAILABLE',
            currentStep: 'PRACTICE',
            updatedAt: new Date().toISOString()
          });
          recommendedNextTopic = {
            id: originTopic.id,
            title: originTopic.title,
            slug: originTopic.slug,
            isRemedial: false,
            message: `Hebat! Prasyarat ${topic?.title} telah tuntas. Sekarang kamu dapat mengulang asesmen ${originTopic.title}!`
          };
        }
      } else {
        // Unlock next topic in curriculum
        const nextTopic = this.topics.find(t => t.orderIndex === (topic?.orderIndex || 0) + 1);
        if (nextTopic) {
          progressMap.set(nextTopic.id, {
            topicId: nextTopic.id,
            status: 'AVAILABLE',
            currentStep: 'MATERIAL',
            updatedAt: new Date().toISOString()
          });
          recommendedNextTopic = {
            id: nextTopic.id,
            title: nextTopic.title,
            slug: nextTopic.slug,
            isRemedial: false,
            message: `Selamat! Kamu telah menguasai ${topic?.title}. Silakan lanjut ke ${nextTopic.title}!`
          };
        }
      }
    } else {
      // Score < passingScore: Trigger Remedial / Prerequisite Engine!
      progressMap.set(topicId, {
        topicId,
        status: 'NEEDS_REMEDIAL',
        currentStep: 'MATERIAL',
        score,
        updatedAt: new Date().toISOString()
      });

      // Find prerequisite topic to remediate
      let prereqTopic: Topic | undefined;
      if (topic?.prerequisiteIds && topic.prerequisiteIds.length > 0) {
        prereqTopic = this.topics.find(t => t.id === topic.prerequisiteIds![0]);
      }

      // If no explicit prerequisite, recommend Pemfaktoran or foundational review
      if (!prereqTopic) {
        prereqTopic = this.topics.find(t => t.id === 'topic-pemfaktoran') || this.topics[0];
      }

      // Create or update remedial path
      this.remedialPaths.push({
        id: `rem-${Date.now()}`,
        userId,
        originTopicId: topicId,
        originTopicTitle: topic?.title || 'Topik Asal',
        prerequisiteTopicId: prereqTopic.id,
        prerequisiteTopicTitle: prereqTopic.title,
        prerequisiteTopicSlug: prereqTopic.slug,
        status: 'ACTIVE',
        recommendedFocus: 'Penguatan konsep pemfaktoran persekutuan dan bentuk kuadratik dasar.',
        createdAt: new Date().toISOString()
      });

      // Unlock prerequisite topic for remedial
      progressMap.set(prereqTopic.id, {
        topicId: prereqTopic.id,
        status: 'AVAILABLE',
        currentStep: 'MATERIAL',
        updatedAt: new Date().toISOString()
      });

      recommendedNextTopic = {
        id: prereqTopic.id,
        title: prereqTopic.title,
        slug: prereqTopic.slug,
        isRemedial: true,
        message: `Skor ${score} belum mencapai KKM (${passingScore}). Sistem merekomendasikan penguatan materi prasyarat: ${prereqTopic.title}.`
      };
    }

    const attempt: AssessmentAttempt = {
      id: `att-${Date.now()}`,
      assessmentId,
      userId,
      topicId,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      score,
      isPassed,
      totalQuestions,
      correctCount,
      timeSpentSeconds,
      lotsScore,
      motsScore,
      hotsScore,
      status: 'SUBMITTED',
      analysisStrengths,
      analysisWeaknesses,
      analysisMisconceptions,
      recommendedNextTopic
    };

    this.assessmentAttempts.push(attempt);

    // Append to learning history
    this.learningHistory.push({
      id: `hist-${Date.now()}`,
      userId,
      topicId,
      topicTitle: topic?.title || assessment?.title || 'Asesmen',
      activityType: 'ASSESSMENT',
      score,
      status: isPassed ? 'MASTERED' : 'NEEDS_REMEDIAL',
      durationSeconds: timeSpentSeconds,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt
    });

    return { attempt, recommendedNextTopic };
  }

  // Record Security Event (AI Webcam, Tab switch, Fullscreen exit, etc.)
  public recordSecurityEvent(event: Omit<AssessmentSecurityEvent, 'id' | 'timestamp' | 'reviewStatus'>): AssessmentSecurityEvent {
    const user = this.users.get(event.userId);
    const newEvent: AssessmentSecurityEvent = {
      ...event,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userName: user?.fullName || 'Siswa',
      timestamp: new Date().toISOString(),
      reviewStatus: 'PENDING'
    };

    this.securityEvents.push(newEvent);
    return newEvent;
  }

  // Teacher Security Overview Summary
  public getSecuritySummaries(): SecuritySessionSummary[] {
    const attemptsMap = new Map<string, SecuritySessionSummary>();

    this.securityEvents.forEach(evt => {
      if (!attemptsMap.has(evt.attemptId)) {
        const user = this.users.get(evt.userId);
        const attempt = this.assessmentAttempts.find(a => a.id === evt.attemptId);
        const topic = this.topics.find(t => t.id === attempt?.topicId);

        attemptsMap.set(evt.attemptId, {
          attemptId: evt.attemptId,
          studentName: user?.fullName || 'Siswa',
          studentEmail: user?.email || '',
          topicTitle: topic?.title || 'Asesmen Matematika',
          score: attempt?.score ?? 0,
          isPassed: attempt?.isPassed ?? false,
          totalEvents: 0,
          highSeverityCount: 0,
          mediumSeverityCount: 0,
          lowSeverityCount: 0,
          securityScore: 100,
          overallStatus: 'NORMAL',
          events: []
        });
      }

      const summary = attemptsMap.get(evt.attemptId)!;
      summary.totalEvents++;
      if (evt.severity === 'HIGH') {
        summary.highSeverityCount++;
        summary.securityScore = Math.max(0, summary.securityScore - 20);
      } else if (evt.severity === 'MEDIUM') {
        summary.mediumSeverityCount++;
        summary.securityScore = Math.max(0, summary.securityScore - 10);
      } else {
        summary.lowSeverityCount++;
        summary.securityScore = Math.max(0, summary.securityScore - 4);
      }

      if (summary.securityScore < 80 || summary.highSeverityCount > 0 || summary.mediumSeverityCount >= 2) {
        summary.overallStatus = 'REVIEW_REQUIRED';
      }

      summary.events.push(evt);
    });

    return Array.from(attemptsMap.values());
  }

  // ===================================================================
  // AI CONTENT GENERATION & REVIEW QUEUE METHODS
  // ===================================================================

  private seedInitialAiContent() {
    // 1. Initial pending question pack for Trigonometri
    const id1 = 'ai-draft-trigo-1';
    this.aiGeneratedContent.set(id1, {
      id: id1,
      contentType: 'QUESTIONS',
      topicId: 'topic-fungsi-kuadrat',
      topicTitle: 'Bank Soal HOTS: Titik Puncak & Aplikasi Nyata',
      phaseCode: 'FASE_E',
      status: 'PENDING_REVIEW',
      version: 1,
      creatorId: 'user-teacher-1',
      creatorName: 'Ibu Dewi Safitri, S.Pd.',
      creatorRole: 'teacher',
      aiPromptUsed: 'Buatkan 3 butir soal HOTS aplikasi nyata fungsi kuadrat (lintasan roket air & optimalisasi laba UMKM) untuk Fase E.',
      qualityMetrics: {
        mathCorrectnessScore: 96,
        curriculumAlignmentScore: 98,
        readabilityScore: 94,
        latexValid: true,
        lotsCount: 0,
        motsCount: 1,
        hotsCount: 2,
        passedValidation: true,
        notes: 'Semua soal memiliki konteks nyata, langkah pembahasan sangat mendalam, dan formula KaTeX tervalidasi.'
      },
      contentData: {
        questions: [
          {
            id: 'q-ai-demo-1',
            topicId: 'topic-fungsi-kuadrat',
            questionText: 'Sebuah kelompok siswa SMK merancang roket air dengan fungsi lintasan $h(t) = -5t^2 + 30t + 2$ (dalam meter, $t$ dalam detik). Berapakah ketinggian maksimum roket tersebut?',
            mathExpression: 'h(t) = -5t^2 + 30t + 2',
            questionType: 'multiple_choice',
            difficulty: 'HOTS',
            conceptTag: 'Aplikasi Nilai Optimum',
            points: 10,
            options: [
              { id: 'A', text: '45 meter' },
              { id: 'B', text: '47 meter' },
              { id: 'C', text: '50 meter' },
              { id: 'D', text: '52 meter' }
            ],
            correctAnswer: 'B',
            explanation: 'Waktu puncak dicapai saat $t = -\\frac{b}{2a} = -\\frac{30}{2(-5)} = 3$ detik. Substitusi ke fungsi: $h(3) = -5(9) + 30(3) + 2 = -45 + 90 + 2 = 47$ meter.'
          },
          {
            id: 'q-ai-demo-2',
            topicId: 'topic-fungsi-kuadrat',
            questionText: 'Seorang pengusaha muda menghitung bahwa laba harian dari penjualan $x$ unit produk busana dinyatakan dengan fungsi laba $P(x) = -2x^2 + 120x - 1000$ (dalam ribuan rupiah). Berapa unit yang harus diproduksi agar memperoleh laba maksimum?',
            mathExpression: 'P(x) = -2x^2 + 120x - 1000',
            questionType: 'multiple_choice',
            difficulty: 'HOTS',
            conceptTag: 'Optimalisasi Ekonomi',
            points: 10,
            options: [
              { id: 'A', text: '25 unit' },
              { id: 'B', text: '30 unit' },
              { id: 'C', text: '35 unit' },
              { id: 'D', text: '40 unit' }
            ],
            correctAnswer: 'B',
            explanation: 'Laba maksimum tercapai pada sumbu simetri $x = -\\frac{b}{2a} = -\\frac{120}{2(-2)} = \\frac{120}{4} = 30$ unit.'
          }
        ]
      },
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    });

    // 2. Initial pending topic package for Trigonometri Dasar
    const id2 = 'ai-draft-package-1';
    this.aiGeneratedContent.set(id2, {
      id: id2,
      contentType: 'TOPIC_PACKAGE',
      topicTitle: 'Perbandingan Trigonometri Segitiga Siku-Siku',
      phaseCode: 'FASE_E',
      status: 'PENDING_REVIEW',
      version: 1,
      creatorId: 'user-admin-1',
      creatorName: 'Admin Kurikulum MathPath',
      creatorRole: 'admin',
      aiPromptUsed: 'Buatkan paket topik lengkap Perbandingan Trigonometri Dasar (Sin, Cos, Tan) Fase E beserta materi, contoh soal, dan 5 asesmen.',
      qualityMetrics: {
        mathCorrectnessScore: 98,
        curriculumAlignmentScore: 100,
        readabilityScore: 95,
        latexValid: true,
        lotsCount: 2,
        motsCount: 2,
        hotsCount: 1,
        passedValidation: true,
        notes: 'Paket topik lengkap Kurikulum Merdeka. Sesuai Capaian Pembelajaran Geometri & Trigonometri Fase E.'
      },
      contentData: {
        topicPackage: {
          title: 'Perbandingan Trigonometri Segitiga Siku-Siku',
          slug: 'perbandingan-trigonometri',
          phaseId: 'phase-e',
          phaseCode: 'FASE_E',
          description: 'Definisi dasar sinus, cosinus, dan tangen pada segitiga siku-siku serta aplikasinya dalam mengukur tinggi objek tanpa memanjat (klinometer).',
          passingScore: 75,
          estimatedMinutes: 50,
          prerequisiteTopicIds: ['topic-pythagoras'],
          prerequisiteReasoning: 'Siswa harus memahami Teorema Pythagoras untuk menentukan sisi miring dan sisi tegak segitiga.',
          material: {
            id: 'mat-trigo-gen',
            topicId: 'topic-trigonometri',
            title: 'Perbandingan Trigonometri Segitiga Siku-Siku',
            learningObjectives: [
              'Memahami definisi rasio sisi depan, samping, dan miring (Demi, Sami, Desa)',
              'Menghitung nilai sinus, cosinus, dan tangen dari sudut istimewa',
              'Memecahkan masalah pengukuran tidak langsung dalam kehidupan nyata'
            ],
            apperception: 'Pernahkah kamu bertanya-tanya bagaimana arsitek mengukur tinggi Monas atau puncak menara BTS tanpa harus memanjat puncaknya? Kuncinya ada pada perbandingan sudut dan panjang bayangan: Trigonometri!',
            basicConcepts: 'Pada sebuah segitiga siku-siku dengan sudut acuan $\\theta$:\n- $\\sin(\\theta) = \\frac{\\text{sisi depan}}{\\text{sisi miring}} = \\frac{\\text{de}}{\\text{mi}}$\n- $\\cos(\\theta) = \\frac{\\text{sisi samping}}{\\text{sisi miring}} = \\frac{\\text{sa}}{\\text{mi}}$\n- $\\tan(\\theta) = \\frac{\\text{sisi depan}}{\\text{sisi samping}} = \\frac{\\text{de}}{\\text{sa}}$',
            detailedExplanation: 'Ingat akronim populer: Sin-De-Mi, Cos-Sa-Mi, Tan-De-Sa. Teorema Pythagoras $a^2 + b^2 = c^2$ selalu berlaku untuk mencari sisi ketiga yang belum diketahui.',
            commonMisconceptions: 'Sering tertukar antara sisi depan dan sisi samping karena orientasi gambar segitiga diputar. Selalu tentukan posisi sudut acuan terlebih dahulu!',
            summary: '1. Sisi miring (hipotenusa) selalu berada di hadapan sudut siku-siku $90^\\circ$.\n2. Nilai perbandingan trigonometri murni bergantung pada besar sudut, bukan ukuran segitiga.'
          },
          examples: [
            {
              id: 'ex-trigo-1',
              topicId: 'topic-trigonometri',
              title: 'Contoh 1: Menghitung Rasio Sin, Cos, Tan',
              difficulty: 'LOTS',
              problemStatement: 'Pada segitiga siku-siku $ABC$ dengan siku-siku di $B$, diketahui panjang $AB = 3$ cm dan $BC = 4$ cm. Tentukan nilai $\\sin A$ dan $\\cos A$!',
              keyTakeaway: 'Cari hipotenusa dengan Pythagoras $AC = \\sqrt{3^2 + 4^2} = 5$ cm, lalu terapkan rumus rasio.',
              stepByStepSolution: [
                {
                  stepNumber: 1,
                  title: 'Hitung Panjang Sisi Miring (AC)',
                  description: 'Gunakan Teorema Pythagoras:',
                  mathExpression: 'AC = \\sqrt{AB^2 + BC^2} = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5 \\text{ cm}'
                },
                {
                  stepNumber: 2,
                  title: 'Tentukan Rasio untuk Sudut A',
                  description: 'Sisi depan sudut A adalah $BC = 4$, sisi samping adalah $AB = 3$, dan sisi miring adalah $AC = 5$:',
                  mathExpression: '\\sin A = \\frac{BC}{AC} = \\frac{4}{5}, \\quad \\cos A = \\frac{AB}{AC} = \\frac{3}{5}'
                }
              ]
            }
          ],
          questions: [
            {
              id: 'q-trigo-1',
              topicId: 'topic-trigonometri',
              questionText: 'Pada segitiga siku-siku dengan sisi depan bernilai $6$ dan sisi miring bernilai $10$, berapakah nilai $\\sin(\\theta)$ dalam bentuk paling sederhana?',
              mathExpression: '\\sin(\\theta) = \\frac{\\text{depan}}{\\text{miring}}',
              questionType: 'multiple_choice',
              difficulty: 'LOTS',
              conceptTag: 'Definisi Sinus',
              points: 10,
              options: [
                { id: 'A', text: '$\\frac{3}{5}$' },
                { id: 'B', text: '$\\frac{4}{5}$' },
                { id: 'C', text: '$\\frac{3}{4}$' },
                { id: 'D', text: '$\\frac{5}{3}$' }
              ],
              correctAnswer: 'A',
              explanation: '$\\sin(\\theta) = \\frac{6}{10} = \\frac{3}{5}$.'
            }
          ]
        }
      },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    });
  }

  public createCurriculumSource(source: CurriculumSource): CurriculumSource {
    this.curriculumSources.push(source);
    return source;
  }

  public createCurriculumUnit(unit: CurriculumUnit): CurriculumUnit {
    this.curriculumUnits.push(unit);
    return unit;
  }

  public createAiGenerationJob(job: AiGenerationJob): AiGenerationJob {
    this.aiGenerationJobs.set(job.id, job);
    return job;
  }

  public getAiGenerationJob(id: string): AiGenerationJob | undefined {
    return this.aiGenerationJobs.get(id);
  }

  public updateAiGenerationJob(id: string, updates: Partial<AiGenerationJob>): AiGenerationJob | undefined {
    const job = this.aiGenerationJobs.get(id);
    if (!job) return undefined;
    const updated = { ...job, ...updates, updatedAt: new Date().toISOString() };
    this.aiGenerationJobs.set(id, updated);
    return updated;
  }

  public getAllAiGenerationJobs(): AiGenerationJob[] {
    return Array.from(this.aiGenerationJobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public recordContentReview(review: ContentReview): ContentReview {
    this.contentReviews.push(review);
    return review;
  }

  public createContentVersion(version: ContentVersion): ContentVersion {
    this.contentVersions.push(version);
    return version;
  }

  public getContentVersions(contentId: string): ContentVersion[] {
    return this.contentVersions
      .filter(v => v.contentId === contentId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }

  /**
   * AI Quality Check - Strict verification before entering REVIEW
   */
  public runAiQualityCheck(contentType: AiContentType, contentData: any): {
    passed: boolean;
    status: AiContentStatus;
    issues: AiQualityIssue[];
    metrics: any;
  } {
    const issues: AiQualityIssue[] = [];

    // 1. Check Questions
    const questions: Question[] = contentData.questions || contentData.topicPackage?.questions || [];
    if (contentType === 'QUESTIONS' || contentType === 'TOPIC_PACKAGE') {
      if (questions.length === 0) {
        issues.push({
          code: 'NO_QUESTIONS',
          severity: 'ERROR',
          field: 'questions',
          message: 'Paket konten tidak memiliki butir soal.'
        });
      }

      questions.forEach((q, idx) => {
        // Question without answer
        if (!q.correctAnswer || String(q.correctAnswer).trim() === '') {
          issues.push({
            code: 'NO_ANSWER',
            severity: 'ERROR',
            field: `questions[${idx}]`,
            message: `Soal #${idx + 1} ("${q.questionText?.substring(0, 30)}...") tidak memiliki kunci jawaban!`
          });
        }

        // Multiple choice must have options and exactly one match
        if (q.questionType === 'multiple_choice' || !q.questionType) {
          if (!q.options || q.options.length < 2) {
            issues.push({
              code: 'INSUFFICIENT_OPTIONS',
              severity: 'ERROR',
              field: `questions[${idx}].options`,
              message: `Soal #${idx + 1} memiliki kurang dari 2 pilihan jawaban.`
            });
          } else {
            const matchCount = q.options.filter(o => o.id === q.correctAnswer).length;
            if (matchCount !== 1) {
              issues.push({
                code: 'INVALID_CORRECT_ANSWER',
                severity: 'ERROR',
                field: `questions[${idx}].correctAnswer`,
                message: `Kunci jawaban '${q.correctAnswer}' pada soal #${idx + 1} tidak cocok dengan opsi yang tersedia.`
              });
            }

            // Duplicate options check
            const texts = q.options.map(o => o.text.trim().toLowerCase());
            const uniqueTexts = new Set(texts);
            if (uniqueTexts.size < texts.length) {
              issues.push({
                code: 'DUPLICATE_OPTIONS',
                severity: 'WARNING',
                field: `questions[${idx}].options`,
                message: `Terdapat teks pilihan ganda yang duplikat pada soal #${idx + 1}.`
              });
            }
          }
        }

        // Explanation consistency
        if (!q.explanation || q.explanation.length < 10) {
          issues.push({
            code: 'WEAK_EXPLANATION',
            severity: 'WARNING',
            field: `questions[${idx}].explanation`,
            message: `Penjelasan soal #${idx + 1} terlalu singkat atau belum menyertakan langkah sistematis.`
          });
        }

        // Formula / LaTeX check
        if (q.mathExpression && q.mathExpression.includes('$') && (q.mathExpression.split('$').length - 1) % 2 !== 0) {
          issues.push({
            code: 'UNBALANCED_LATEX',
            severity: 'WARNING',
            field: `questions[${idx}].mathExpression`,
            message: `Notasi LaTeX pada soal #${idx + 1} memiliki tanda dollar ($) yang tidak berpasangan.`
          });
        }
      });
    }

    // 2. Check Material
    const material = contentData.material || contentData.topicPackage?.material;
    if (contentType === 'MATERIAL' || contentType === 'TOPIC_PACKAGE') {
      if (!material) {
        issues.push({
          code: 'NO_MATERIAL',
          severity: 'ERROR',
          field: 'material',
          message: 'Materi pembelajaran tidak ditemukan.'
        });
      } else {
        if (!material.learningObjectives || material.learningObjectives.length === 0) {
          issues.push({
            code: 'NO_OBJECTIVES',
            severity: 'ERROR',
            field: 'material.learningObjectives',
            message: 'Materi wajib memiliki minimal 1 tujuan pembelajaran.'
          });
        }
        if (!material.basicConcepts || material.basicConcepts.length < 20) {
          issues.push({
            code: 'SHALLOW_CONCEPTS',
            severity: 'WARNING',
            field: 'material.basicConcepts',
            message: 'Konsep dasar terlalu singkat untuk standar Kurikulum Merdeka.'
          });
        }
      }
    }

    const hasErrors = issues.some(i => i.severity === 'ERROR');
    const passed = !hasErrors;
    const status: AiContentStatus = passed ? 'REVIEW' : 'NEEDS_REVIEW';

    let lotsCount = 0;
    let motsCount = 0;
    let hotsCount = 0;
    questions.forEach(q => {
      if (q.difficulty === 'LOTS') lotsCount++;
      if (q.difficulty === 'MOTS') motsCount++;
      if (q.difficulty === 'HOTS') hotsCount++;
    });

    const metrics = {
      mathCorrectnessScore: passed ? (issues.length === 0 ? 98 : 90) : 65,
      curriculumAlignmentScore: passed ? 95 : 70,
      readabilityScore: 92,
      latexValid: !issues.some(i => i.code === 'UNBALANCED_LATEX'),
      lotsCount,
      motsCount,
      hotsCount,
      passedValidation: passed,
      issues,
      notes: passed
        ? 'Lolos validasi otomatis AI Quality Check. Siap ditinjau oleh Guru/Admin.'
        : `Ditemukan ${issues.length} catatan validasi. Memerlukan peninjauan manual (NEEDS_REVIEW).`
    };

    return { passed, status, issues, metrics };
  }

  public createAiGeneratedContent(item: AiGeneratedItem): AiGeneratedItem {
    this.aiGeneratedContent.set(item.id, item);

    // Create initial version record
    this.createContentVersion({
      id: `ver-${Date.now()}-1`,
      contentId: item.id,
      versionNumber: item.version || 1,
      title: item.topicTitle,
      contentType: item.contentType,
      contentData: item.contentData,
      createdBy: item.creatorId,
      creatorRole: item.creatorRole,
      changeSummary: 'Versi awal hasil generasi AI Engine',
      isPublished: false,
      createdAt: item.createdAt
    });

    return item;
  }

  public getAiGeneratedContentQueue(filter?: { status?: string; contentType?: string }): AiGeneratedItem[] {
    let items = Array.from(this.aiGeneratedContent.values());
    if (filter?.status && filter.status !== 'ALL') {
      items = items.filter(i => i.status === filter.status);
    }
    if (filter?.contentType && filter.contentType !== 'ALL') {
      items = items.filter(i => i.contentType === filter.contentType);
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAiGeneratedContentById(id: string): AiGeneratedItem | undefined {
    return this.aiGeneratedContent.get(id);
  }

  public updateAiGeneratedContent(id: string, updates: Partial<AiGeneratedItem>): AiGeneratedItem | undefined {
    const existing = this.aiGeneratedContent.get(id);
    if (!existing) return undefined;

    // Check versioning: if modifying published content or substantial data, increment version
    const newVersion = (existing.version || 1) + 1;
    const updated = { ...existing, ...updates, version: newVersion };
    this.aiGeneratedContent.set(id, updated);

    // Save version snapshot
    this.createContentVersion({
      id: `ver-${Date.now()}-${newVersion}`,
      contentId: id,
      versionNumber: newVersion,
      title: updated.topicTitle,
      contentType: updated.contentType,
      contentData: updated.contentData,
      createdBy: updates.creatorId || existing.creatorId,
      creatorRole: updates.creatorRole || existing.creatorRole,
      changeSummary: updates.reviewerNotes || 'Pembaruan edit konten oleh Guru/Admin',
      isPublished: updated.status === 'PUBLISHED',
      createdAt: new Date().toISOString()
    });

    return updated;
  }

  /**
   * AI Review & Approval: Approve or Reject content.
   */
  public reviewAiGeneratedContent(
    id: string,
    review: {
      status: 'APPROVED' | 'REJECTED' | 'REVIEW' | 'NEEDS_REVIEW';
      reviewerId: string;
      reviewerName?: string;
      reviewerNotes?: string;
    }
  ): { item: AiGeneratedItem; publishedAction?: string } | undefined {
    const item = this.aiGeneratedContent.get(id);
    if (!item) return undefined;

    item.status = review.status;
    item.reviewerId = review.reviewerId;
    item.reviewerName = review.reviewerName || 'Reviewer Kurikulum';
    item.reviewerNotes = review.reviewerNotes;
    item.reviewedAt = new Date().toISOString();

    // Record review audit log
    this.recordContentReview({
      id: `rev-${Date.now()}`,
      contentId: id,
      versionNumber: item.version || 1,
      reviewerId: review.reviewerId,
      reviewerName: item.reviewerName,
      reviewerRole: 'teacher',
      action: review.status === 'APPROVED' ? 'APPROVE' : 'REJECT',
      notes: review.reviewerNotes || '',
      reviewedAt: item.reviewedAt
    });

    return { item };
  }

  /**
   * PUBLISH content - Makes it IMMEDIATELY available in the student learning path!
   */
  public publishAiContent(
    id: string,
    publisherId: string,
    publisherName?: string,
    notes?: string
  ): { item: AiGeneratedItem; publishedAction: string } | undefined {
    const item = this.aiGeneratedContent.get(id);
    if (!item) return undefined;

    item.status = 'PUBLISHED';
    item.publishedAt = new Date().toISOString();
    item.reviewerId = publisherId;
    item.reviewerName = publisherName || 'Fasilitator Kurikulum';
    item.reviewerNotes = notes || 'Dipublikasikan ke jalur belajar siswa.';

    let publishedAction = '';

    // 1. If MATERIAL: update live topic material
    if (item.contentType === 'MATERIAL' && item.contentData.material) {
      const mat = item.contentData.material;
      const topicId = item.topicId || mat.topicId;
      this.materials.set(topicId, mat);
      publishedAction = `Materi pembelajaran untuk topik "${item.topicTitle}" telah resmi dipublikasikan ke siswa!`;
    }
    // 2. If EXAMPLES: append or update live topic examples
    else if (item.contentType === 'EXAMPLES' && item.contentData.examples) {
      const exs = item.contentData.examples;
      const topicId = item.topicId || (exs[0]?.topicId) || 'topic-custom';
      const currentExs = this.examples.get(topicId) || [];
      this.examples.set(topicId, [...currentExs, ...exs]);
      publishedAction = `${exs.length} contoh soal baru berhasil dipublikasikan ke topik "${item.topicTitle}"!`;
    }
    // 3. If QUESTIONS: push to live questions bank & assessment
    else if (item.contentType === 'QUESTIONS' && item.contentData.questions) {
      const qs = item.contentData.questions;
      const topicId = item.topicId || (qs[0]?.topicId) || 'topic-custom';
      this.questions.push(...qs);

      let topicAssessment = this.assessments.find(a => a.topicId === topicId);
      if (topicAssessment) {
        topicAssessment.totalQuestions = (topicAssessment.totalQuestions || 0) + qs.length;
      } else {
        this.assessments.push({
          id: `as-${topicId}`,
          topicId,
          title: `Asesmen: ${item.topicTitle}`,
          type: 'TOPIC',
          durationMinutes: 25,
          passingScore: 75,
          totalQuestions: qs.length
        });
      }
      publishedAction = `${qs.length} butir soal asesmen baru telah dipublikasikan ke bank soal topik "${item.topicTitle}"!`;
    }
    // 4. If TOPIC_PACKAGE: create live Topic, Materials, Examples, Questions, and Assessment
    else if (item.contentType === 'TOPIC_PACKAGE' && item.contentData.topicPackage) {
      const pkg = item.contentData.topicPackage;
      const newTopicId = `topic-${pkg.slug}`;

      // Check if topic already exists, update or create
      const existingIdx = this.topics.findIndex(t => t.slug === pkg.slug || t.id === newTopicId);
      const newTopic: Topic = {
        id: newTopicId,
        levelId: 'level-d1',
        phaseId: pkg.phaseId,
        title: pkg.title,
        slug: pkg.slug,
        description: pkg.description,
        passingScore: pkg.passingScore || 75,
        estimatedMinutes: pkg.estimatedMinutes || 45,
        orderIndex: existingIdx >= 0 ? this.topics[existingIdx].orderIndex : this.topics.length + 1,
        prerequisiteIds: pkg.prerequisiteTopicIds || []
      };

      if (existingIdx >= 0) {
        this.topics[existingIdx] = newTopic;
      } else {
        this.topics.push(newTopic);
      }

      // Add Material
      if (pkg.material) {
        pkg.material.topicId = newTopicId;
        this.materials.set(newTopicId, pkg.material);
      }

      // Add Examples
      if (pkg.examples && pkg.examples.length > 0) {
        pkg.examples.forEach(ex => { ex.topicId = newTopicId; });
        this.examples.set(newTopicId, pkg.examples);
      }

      // Add Questions
      if (pkg.questions && pkg.questions.length > 0) {
        pkg.questions.forEach(q => { q.topicId = newTopicId; });
        this.questions.push(...pkg.questions);
      }

      // Create Assessment with default KKM 75
      const existingAsmIdx = this.assessments.findIndex(a => a.topicId === newTopicId);
      const newAsm: Assessment = {
        id: `asm-${pkg.slug}`,
        topicId: newTopicId,
        title: `Asesmen Terintegrasi: ${pkg.title}`,
        type: 'TOPIC',
        durationMinutes: 25,
        passingScore: pkg.passingScore || 75,
        totalQuestions: pkg.questions?.length || 10
      };

      if (existingAsmIdx >= 0) {
        this.assessments[existingAsmIdx] = newAsm;
      } else {
        this.assessments.push(newAsm);
      }

      publishedAction = `Topik baru "${pkg.title}" (${pkg.phaseCode}) dengan modul lengkap telah resmi aktif di kurikulum dan dapat diakses siswa!`;
    }

    // Save published version snapshot
    this.createContentVersion({
      id: `ver-${Date.now()}-${item.version || 1}`,
      contentId: id,
      versionNumber: item.version || 1,
      title: item.topicTitle,
      contentType: item.contentType,
      contentData: item.contentData,
      createdBy: publisherId,
      creatorRole: 'teacher',
      changeSummary: 'Dipublikasikan resmi ke alur belajar siswa',
      isPublished: true,
      createdAt: new Date().toISOString()
    });

    // Record review log
    this.recordContentReview({
      id: `rev-${Date.now()}`,
      contentId: id,
      versionNumber: item.version || 1,
      reviewerId: publisherId,
      reviewerName: publisherName || 'Guru Validator',
      reviewerRole: 'teacher',
      action: 'PUBLISH',
      notes: notes || 'Publikasi modul ke kurikulum live.',
      reviewedAt: item.publishedAt
    });

    return { item, publishedAction };
  }

}

export const db = new DatabaseStore();

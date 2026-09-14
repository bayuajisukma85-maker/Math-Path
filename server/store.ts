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
  SecuritySessionSummary
} from '../src/types';

import {
  INITIAL_PHASES,
  INITIAL_LEVELS,
  INITIAL_TOPICS,
  INITIAL_SUBTOPICS,
  INITIAL_MATERIALS,
  INITIAL_EXAMPLES,
  INITIAL_QUESTIONS,
  INITIAL_ASSESSMENTS
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

  public studentProgress: Map<string, Map<string, StudentProgress>> = new Map();
  public studentMastery: Map<string, Map<string, StudentMastery>> = new Map();
  public learningHistory: LearningHistoryItem[] = [];
  public diagnosticResults: Map<string, DiagnosticResult> = new Map();
  public remedialPaths: RemedialPath[] = [];
  public assessmentAttempts: AssessmentAttempt[] = [];
  public securityEvents: AssessmentSecurityEvent[] = [];

  constructor() {
    this.seedInitialUsers();
    this.seedDemoStudentProgress();
  }

  private seedInitialUsers() {
    // Demo Student
    this.users.set('user-student-1', {
      id: 'user-student-1',
      email: 'budi@mathpath.id',
      fullName: 'Budi Pratama',
      role: 'student',
      classGrade: 'Kelas 10 SMA',
      passwordHash: 'password123'
    });

    // Demo Student 2
    this.users.set('user-student-2', {
      id: 'user-student-2',
      email: 'ani@mathpath.id',
      fullName: 'Siti Rahmawati',
      role: 'student',
      classGrade: 'Kelas 9 SMP',
      passwordHash: 'password123'
    });

    // Demo Teacher
    this.users.set('user-teacher-1', {
      id: 'user-teacher-1',
      email: 'ibu.dewi@mathpath.id',
      fullName: 'Ibu Dewi Safitri, S.Pd.',
      role: 'teacher',
      classGrade: 'Guru Matematika SMA & SMP',
      passwordHash: 'password123'
    });

    // Demo Admin
    this.users.set('user-admin-1', {
      id: 'user-admin-1',
      email: 'admin@mathpath.id',
      fullName: 'Admin Kurikulum MathPath',
      role: 'admin',
      passwordHash: 'admin123'
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

  // Evaluate Diagnostic Assessment
  public evaluateDiagnostic(userId: string, answers: AssessmentAnswerSubmission[]): DiagnosticResult {
    const diagnosticQuestions = this.questions.filter(q => q.topicId === 'diagnostic');
    let totalScore = 0;
    let maxScore = diagnosticQuestions.length * 10;

    const domains: Record<string, { total: number; correct: number }> = {
      'Bilangan & Aritmatika Dasar': { total: 0, correct: 0 },
      'Pecahan & Desimal': { total: 0, correct: 0 },
      'Aljabar & Persamaan Linear': { total: 0, correct: 0 },
      'Geometri & Pythagoras': { total: 0, correct: 0 },
      'Persamaan & Fungsi Kuadrat': { total: 0, correct: 0 }
    };

    answers.forEach(ans => {
      const q = diagnosticQuestions.find(dq => dq.id === ans.questionId);
      if (!q) return;

      const tag = q.conceptTag || 'Lainnya';
      let domainKey = 'Aljabar & Persamaan Linear';
      if (tag.includes('Bilangan')) domainKey = 'Bilangan & Aritmatika Dasar';
      else if (tag.includes('Pecahan')) domainKey = 'Pecahan & Desimal';
      else if (tag.includes('Geometri') || tag.includes('Pythagoras')) domainKey = 'Geometri & Pythagoras';
      else if (tag.includes('Kuadrat')) domainKey = 'Persamaan & Fungsi Kuadrat';

      domains[domainKey].total += 1;

      if (ans.userAnswer === q.correctAnswer) {
        totalScore += q.points;
        domains[domainKey].correct += 1;
      }
    });

    const percent = Math.round((totalScore / (maxScore || 1)) * 100);

    const competencyScores = Object.entries(domains).map(([domain, data]) => {
      const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 70;
      let status: 'Perlu Penguatan' | 'Cukup' | 'Mahir' = 'Cukup';
      if (score < 60) status = 'Perlu Penguatan';
      else if (score >= 80) status = 'Mahir';

      let details = `Tingkat penguasaan domain ${domain}: ${score}%.`;
      if (score < 60) details += ' Memerlukan peninjauan konsep prasyarat fondasi.';
      return { domain, score, status, details };
    });

    // Determine recommended Phase and Topic
    let recPhaseCode = 'FASE_D';
    let recTopicId = 'topic-bentuk-aljabar';
    let summaryText = 'Berdasarkan asesmen diagnostik, kamu disarankan memulai dari Fase D (Bentuk Aljabar).';

    if (percent < 50) {
      recPhaseCode = 'FASE_B';
      recTopicId = 'topic-pecahan-senilai';
      summaryText = 'Fondasi pecahan dan aritmatika dasar perlu diperkuat terlebih dahulu sebelum melangkah ke aljabar.';
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
    const recTopic = this.topics.find(t => t.id === recTopicId) || this.topics[2];

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
}

export const db = new DatabaseStore();

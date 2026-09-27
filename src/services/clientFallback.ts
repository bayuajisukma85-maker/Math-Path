import { db } from '../../server/store';
import { UserProfile } from '../types';

/**
 * Client-side fallback handler for MathPath.
 * Ensures the application runs seamlessly and immediately without blank screens
 * on static CDN hosts, Vercel deployments, or if server endpoints are pending.
 */
export async function fallbackAuthFetch(
  url: string,
  options: RequestInit = {},
  user: UserProfile | null
): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const currentUserId = user?.id || 'user-student-1';

  let body: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = {};
    }
  }

  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  // 1. Curriculum (Fase A - Fase F)
  if (pathname === '/api/curriculum') {
    return jsonResponse({
      phases: db.phases,
      levels: db.levels,
      topics: db.topics,
      subtopics: db.subtopics
    });
  }

  // 2. Student Learning Path
  if (pathname === '/api/student/learning-path') {
    const path = db.getStudentLearningPath(currentUserId);
    return jsonResponse({ path });
  }

  // 3. Student Progress
  if (pathname === '/api/student/progress') {
    const progressMap = db.getOrCreateProgressMap(currentUserId);
    const masteryMap = db.getOrCreateMasteryMap(currentUserId);
    const diagnostic = db.diagnosticResults.get(currentUserId);
    const activeRemedial = db.remedialPaths.filter(
      r => r.userId === currentUserId && r.status === 'ACTIVE'
    );

    return jsonResponse({
      progress: Array.from(progressMap.values()),
      mastery: Array.from(masteryMap.values()),
      diagnostic,
      activeRemedial
    });
  }

  // 4. Student History
  if (pathname === '/api/student/history') {
    const history = db.learningHistory.filter(h => h.userId === currentUserId);
    return jsonResponse({ history });
  }

  // 5. Topic Detail by Slug
  if (pathname.startsWith('/api/topics/')) {
    const slug = pathname.replace('/api/topics/', '');
    const topic = db.topics.find(t => t.slug === slug || t.id === slug);
    if (!topic) {
      return jsonResponse({ error: 'Topik tidak ditemukan' }, 404);
    }
    const material = db.materials.get(topic.id);
    const examples = db.examples.get(topic.id) || [];
    const subtopics = db.subtopics.filter(s => s.topicId === topic.id);
    const assessment = db.assessments.find(a => a.topicId === topic.id);
    const practiceQuestions = db.questions
      .filter(q => q.topicId === topic.id)
      .map(({ correctAnswer, ...safeQ }) => safeQ);

    return jsonResponse({
      topic,
      material,
      examples,
      subtopics,
      assessment,
      practiceQuestions
    });
  }

  // 6. Diagnostic Questions
  if (pathname === '/api/diagnostic/questions') {
    const questions = db.questions
      .filter(q => q.topicId === 'diagnostic')
      .map(({ correctAnswer, ...safeQ }) => safeQ);
    return jsonResponse({ questions });
  }

  // 7. Diagnostic Evaluation
  if (pathname === '/api/diagnostic/evaluate' && method === 'POST') {
    const { answers = [] } = body;
    const result = db.evaluateDiagnostic(currentUserId, answers);
    return jsonResponse({ result });
  }

  // 8. Practice Check
  if (pathname === '/api/practice/check' && method === 'POST') {
    const { questionId, userAnswer } = body;
    const question = db.questions.find(q => q.id === questionId);
    if (!question) {
      return jsonResponse({ error: 'Soal tidak ditemukan' }, 404);
    }
    const isCorrect =
      String(userAnswer || '').trim().toLowerCase() ===
      String(question.correctAnswer || '').trim().toLowerCase();
    return jsonResponse({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    });
  }

  // 9. Assessment Questions
  if (pathname.startsWith('/api/assessment/questions/')) {
    const assessmentId = pathname.replace('/api/assessment/questions/', '');
    const assessment = db.assessments.find(a => a.id === assessmentId);
    let questions: any[] = [];
    if (assessment?.type === 'DIAGNOSTIC') {
      questions = db.questions.filter(q => q.topicId === 'diagnostic');
    } else if (assessment?.topicId) {
      questions = db.questions.filter(q => q.topicId === assessment.topicId);
    }
    const safeQuestions = questions.map(({ correctAnswer, ...safeQ }) => safeQ);
    return jsonResponse({ assessment, questions: safeQuestions });
  }

  // 10. Assessment Submit
  if (pathname === '/api/assessment/submit' && method === 'POST') {
    const { assessmentId, topicId, answers, timeSpentSeconds = 60 } = body;
    const result = db.submitAssessment(
      currentUserId,
      assessmentId,
      topicId,
      answers || {},
      timeSpentSeconds
    );
    return jsonResponse(result);
  }

  // 11. Security Events
  if (pathname === '/api/assessment/security-events' && method === 'POST') {
    const { attemptId, eventType, durationSeconds = 0, severity = 'LOW', metadata = {} } = body;
    const event = db.recordSecurityEvent({
      attemptId,
      userId: currentUserId,
      eventType,
      durationSeconds,
      severity,
      metadata
    });
    return jsonResponse({ success: true, event });
  }

  // 12. Teacher Overview
  if (pathname === '/api/teacher/overview') {
    const students = Array.from(db.users.values())
      .filter(u => u.role === 'student')
      .map(s => {
        const mastery = Array.from(db.studentMastery.get(s.id)?.values() || []);
        const totalMastered = mastery.filter(m => m.isMastered).length;
        const avgScore =
          mastery.length > 0
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
    const reviewRequiredCount = securitySummaries.filter(
      s => s.overallStatus === 'REVIEW_REQUIRED'
    ).length;

    return jsonResponse({
      students,
      totalStudents: students.length,
      reviewRequiredCount,
      totalAssessmentsCompleted: db.assessmentAttempts.length,
      topicsCount: db.topics.length
    });
  }

  // 13. Teacher Security Monitor
  if (pathname === '/api/teacher/security-monitor') {
    const summaries = db.getSecuritySummaries();
    return jsonResponse({ summaries, allEvents: db.securityEvents });
  }

  // 14. AI Content Queue
  if (pathname === '/api/ai/content-queue') {
    return jsonResponse({ queue: db.getAiGeneratedContentQueue() });
  }

  // 15. Admin Users
  if (pathname === '/api/admin/users') {
    const users = Array.from(db.users.values()).map(({ passwordHash, ...safe }) => safe);
    return jsonResponse({ users });
  }

  // 16. AI Tutor
  if (pathname === '/api/ai-tutor' && method === 'POST') {
    const { prompt, topicTitle } = body;
    return jsonResponse({
      reply: `Halo! Terkait materi **${topicTitle || 'Matematika'}**: Pertanyaan kamu tentang "${prompt?.slice(0, 60)}..." sangat bagus. Mari kita diskusikan: pertama identifikasi konsep dasar dan apa yang ditanyakan, kedua gunakan definisi atau rumus yang relevan, dan ketiga hitung langkah per langkah. Tuliskan apa yang sudah kamu coba!`,
      formula: 'f(x) = ax^2 + bx + c'
    });
  }

  // Generic fallback
  return jsonResponse({ status: 'ok', fallback: true }, 200);
}

/**
 * MathPath Application Types
 * Kurikulum Matematika Indonesia Fase A - Fase F
 */

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  classGrade?: string;
  avatarUrl?: string;
  hasCompletedDiagnostic?: boolean;
}

export type PhaseCode = 'FASE_A' | 'FASE_B' | 'FASE_C' | 'FASE_D' | 'FASE_E' | 'FASE_F';

export interface Phase {
  id: string;
  code: PhaseCode;
  name: string;
  description: string;
  orderIndex: number;
}

export interface Level {
  id: string;
  phaseId: string;
  name: string;
  gradeEquivalent: string;
  orderIndex: number;
}

export type TopicStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'NEEDS_REMEDIAL' | 'MASTERED';

export interface Topic {
  id: string;
  levelId: string;
  phaseId?: string;
  title: string;
  slug: string;
  description: string;
  passingScore: number;
  estimatedMinutes: number;
  orderIndex: number;
  prerequisiteIds?: string[];
  prerequisiteTitles?: string[];
}

export interface Subtopic {
  id: string;
  topicId: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface LearningMaterial {
  id: string;
  topicId: string;
  title: string;
  learningObjectives: string[];
  apperception: string;
  basicConcepts: string;
  detailedExplanation: string;
  commonMisconceptions: string;
  summary: string;
  videoUrl?: string;
}

export interface ExampleStep {
  stepNumber: number;
  title: string;
  description: string;
  mathExpression?: string;
}

export interface ExampleItem {
  id: string;
  topicId: string;
  title: string;
  problemStatement: string;
  stepByStepSolution: ExampleStep[];
  keyTakeaway: string;
  difficulty: 'LOTS' | 'MOTS' | 'HOTS';
}

export type QuestionType = 'multiple_choice' | 'multiple_response' | 'true_false' | 'short_answer' | 'numerical';
export type QuestionDifficulty = 'LOTS' | 'MOTS' | 'HOTS';

export interface QuestionOption {
  id: string;
  text: string;
  mathExpr?: string;
}

export interface Question {
  id: string;
  topicId: string;
  questionText: string;
  mathExpression?: string;
  questionType: QuestionType;
  options: QuestionOption[];
  // correct_answer is kept server-side only during active test
  correctAnswer?: string | string[];
  explanation: string;
  points: number;
  difficulty: QuestionDifficulty;
  conceptTag: string;
}

export type AssessmentType = 'DIAGNOSTIC' | 'TOPIC' | 'PREREQUISITE' | 'REMEDIAL';

export interface Assessment {
  id: string;
  topicId?: string;
  title: string;
  type: AssessmentType;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
  questions?: Question[];
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  topicId?: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  isPassed: boolean;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  lotsScore: number;
  motsScore: number;
  hotsScore: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';
  analysisStrengths?: string;
  analysisWeaknesses?: string;
  analysisMisconceptions?: string;
  recommendedNextTopic?: {
    id: string;
    title: string;
    slug: string;
    isRemedial?: boolean;
  };
}

export interface AssessmentAnswerSubmission {
  questionId: string;
  userAnswer: string | string[];
  timeSpentSeconds: number;
}

export interface StudentProgress {
  topicId: string;
  status: TopicStatus;
  currentStep: 'MATERIAL' | 'EXAMPLES' | 'PRACTICE' | 'ASSESSMENT' | 'COMPLETED';
  score?: number;
  updatedAt: string;
}

export interface StudentMastery {
  topicId: string;
  topicTitle: string;
  phaseCode: PhaseCode;
  masteryScore: number;
  attemptsCount: number;
  lastScore: number;
  isMastered: boolean;
  masteredAt?: string;
}

export type ActivityType = 'MATERIAL_VIEW' | 'PRACTICE' | 'ASSESSMENT' | 'REMEDIAL' | 'PREREQUISITE' | 'DIAGNOSTIC';

export interface LearningHistoryItem {
  id: string;
  userId: string;
  topicId?: string;
  topicTitle: string;
  activityType: ActivityType;
  score?: number;
  status: string;
  durationSeconds: number;
  startedAt: string;
  completedAt?: string;
}

export interface CompetencyScore {
  domain: string;
  score: number;
  status: 'Perlu Penguatan' | 'Cukup' | 'Mahir';
  details: string;
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  recommendedPhaseId: string;
  recommendedPhaseCode: PhaseCode;
  recommendedPhaseName: string;
  recommendedTopicId: string;
  recommendedTopicTitle: string;
  recommendedTopicSlug: string;
  competencyScores: CompetencyScore[];
  rawScore: number;
  summaryText: string;
  completedAt: string;
}

export interface RemedialPath {
  id: string;
  userId: string;
  originTopicId: string;
  originTopicTitle: string;
  prerequisiteTopicId: string;
  prerequisiteTopicTitle: string;
  prerequisiteTopicSlug: string;
  failedAttemptId?: string;
  status: 'ACTIVE' | 'RESOLVED';
  recommendedFocus: string;
  createdAt: string;
}

// Security & AI Webcam Monitoring Types
export type SecurityEventType = 
  | 'TAB_SWITCH'
  | 'WINDOW_BLUR'
  | 'FULLSCREEN_EXIT'
  | 'FACE_NOT_DETECTED'
  | 'MULTIPLE_FACES'
  | 'FACE_POSITION_CHANGED'
  | 'CAMERA_DISABLED'
  | 'CAMERA_PERMISSION_LOST'
  | 'SUSPICIOUS_REPEATED_FOCUS_LOSS';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type SecurityReviewStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED' | 'CONFIRMED_CONCERN';

export interface AssessmentSecurityEvent {
  id: string;
  attemptId: string;
  userId: string;
  userName?: string;
  topicTitle?: string;
  eventType: SecurityEventType;
  timestamp: string;
  durationSeconds: number;
  severity: SecuritySeverity;
  metadata?: Record<string, any>;
  reviewStatus: SecurityReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface SecuritySessionSummary {
  attemptId: string;
  studentName: string;
  studentEmail: string;
  topicTitle: string;
  score: number;
  isPassed: boolean;
  totalEvents: number;
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  securityScore: number; // 100 is pristine
  overallStatus: 'NORMAL' | 'REVIEW_REQUIRED';
  events: AssessmentSecurityEvent[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

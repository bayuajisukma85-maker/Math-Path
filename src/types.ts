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

// ===================================================================
// AI CONTENT GENERATION, CURRICULUM ENGINE & REVIEW TYPES
// ===================================================================
export type AiContentType = 'MATERIAL' | 'EXAMPLES' | 'QUESTIONS' | 'TOPIC_PACKAGE' | 'CURRICULUM_PLAN';
export type AiContentStatus = 'DRAFT' | 'REVIEW' | 'PENDING_REVIEW' | 'NEEDS_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';

export interface CurriculumSource {
  id: string;
  name: string;
  phaseCode: PhaseCode;
  subject: string;
  isOfficial: boolean;
  sourceType: 'DOCUMENT_TEXT' | 'CP_TP_ATP' | 'MANUAL_ENTRY' | 'SYNTHESIS';
  rawContent: string;
  cpText?: string;
  tpText?: string;
  atpText?: string;
  createdAt: string;
  createdBy: string;
}

export interface Competency {
  id: string;
  code: string;
  element: string; // 'Bilangan' | 'Aljabar' | 'Pengukuran' | 'Geometri' | 'Analisis Data dan Peluang' | 'Kalkulus'
  title: string;
  description: string;
  cognitiveLevel: 'LOTS' | 'MOTS' | 'HOTS';
  phaseCode: PhaseCode;
  orderIndex: number;
}

export interface CurriculumUnit {
  id: string;
  sourceId?: string;
  phaseCode: PhaseCode;
  element: string;
  cp: string; // Capaian Pembelajaran
  tp: string; // Tujuan Pembelajaran
  atp: string; // Alur Tujuan Pembelajaran
  topicTitle: string;
  subtopics: string[];
  competencies: string[];
  prerequisites: Array<{
    title: string;
    topicId?: string;
    reasoning: string;
  }>;
  learningSequence: number;
  isOfficialVerified?: boolean;
}

export interface PracticeQuestion extends Question {
  competencyId?: string;
  competencyTitle?: string;
  subtopicTitle?: string;
  prerequisiteConcept?: string;
  estimatedTimeSeconds: number;
}

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface JobProgressStage {
  stage: string;
  progressPercent: number;
  description: string;
  completed: boolean;
}

export interface AiGenerationJob {
  id: string;
  jobType: 'CURRICULUM_ANALYSIS' | 'FULL_TOPIC_CONTENT' | 'MATERIAL_ONLY' | 'QUESTIONS_ONLY' | 'ASSESSMENT_10';
  status: JobStatus;
  progressPercent: number;
  currentStage: string;
  stages: JobProgressStage[];
  inputParams: Record<string, any>;
  resultData?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  versionNumber: number; // 1, 2, 3...
  title: string;
  contentType: AiContentType;
  contentData: any;
  createdBy: string;
  creatorRole: string;
  changeSummary: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ContentReview {
  id: string;
  contentId: string;
  versionNumber: number;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  action: 'APPROVE' | 'REJECT' | 'PUBLISH' | 'REQUEST_CHANGES' | 'REGENERATE';
  notes: string;
  qualityChecklist?: {
    noUnansweredQuestions: boolean;
    singleCorrectAnswerValid: boolean;
    explanationConsistent: boolean;
    mathFormulasValid: boolean;
    mathCalculationVerified: boolean;
    difficultyBalanced: boolean;
    topicCompetencyAligned: boolean;
    noDuplicateContent: boolean;
    languageAgeAppropriate: boolean;
  };
  reviewedAt: string;
}

export interface AiQualityIssue {
  code: string;
  severity: 'WARNING' | 'ERROR';
  field: string;
  message: string;
}

export interface AiQualityMetrics {
  mathCorrectnessScore: number; // 0-100
  curriculumAlignmentScore: number; // 0-100
  readabilityScore: number; // 0-100
  latexValid: boolean;
  lotsCount: number;
  motsCount: number;
  hotsCount: number;
  issues?: AiQualityIssue[];
  notes: string;
  passedValidation: boolean;
}

export interface AiTopicPackageData {
  title: string;
  slug: string;
  phaseId: string;
  phaseCode: PhaseCode;
  element?: string;
  description: string;
  passingScore: number;
  estimatedMinutes: number;
  prerequisiteTopicIds: string[];
  prerequisiteReasoning?: string;
  material: LearningMaterial;
  examples: ExampleItem[];
  questions: Question[];
  practiceQuestions?: PracticeQuestion[];
}

export interface AiGeneratedContentData {
  material?: LearningMaterial;
  examples?: ExampleItem[];
  questions?: Question[];
  practiceQuestions?: PracticeQuestion[];
  topicPackage?: AiTopicPackageData;
  curriculumPlan?: {
    sourceInfo: CurriculumSource;
    units: CurriculumUnit[];
    elementsSummary: Record<string, number>;
  };
}

export interface AiGeneratedItem {
  id: string;
  contentType: AiContentType;
  topicId?: string;
  topicTitle: string;
  phaseCode: PhaseCode;
  status: AiContentStatus;
  version: number;
  contentData: AiGeneratedContentData;
  qualityMetrics: AiQualityMetrics;
  creatorId: string;
  creatorName: string;
  creatorRole: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewerNotes?: string;
  aiPromptUsed: string;
  createdAt: string;
  reviewedAt?: string;
  publishedAt?: string;
}

export interface AiGenerationRequest {
  contentType: AiContentType;
  topicId?: string;
  topicTitle: string;
  phaseCode: PhaseCode;
  element?: string;
  targetGrade?: string;
  difficultyBalance?: {
    lots: number;
    mots: number;
    hots: number;
  };
  questionCount?: number;
  customInstructions?: string;
  contextDomain?: string;
  cpText?: string;
  tpText?: string;
  atpText?: string;
}

export interface AiCurriculumAlignmentResult {
  topicTitle: string;
  recommendedPhase: PhaseCode;
  element?: string;
  suggestedPrerequisites: Array<{
    topicId?: string;
    title: string;
    reasoning: string;
    isEssential: boolean;
  }>;
  suggestedFollowUpTopics: string[];
  learningObjectives: string[];
  competencyStandard: string;
  difficultyDistribution: {
    lots: number;
    mots: number;
    hots: number;
  };
}


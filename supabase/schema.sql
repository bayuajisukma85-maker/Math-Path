-- ===================================================================
-- MATHPATH: Adaptive Mathematics Learning Platform (Kurikulum Indonesia)
-- PostgreSQL / Supabase Schema with RLS, Constraints, & Indexes
-- ===================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    class_grade TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PHASES (Fase A - Fase F)
CREATE TABLE IF NOT EXISTS public.phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE, -- 'FASE_A', 'FASE_B', 'FASE_C', 'FASE_D', 'FASE_E', 'FASE_F'
    name TEXT NOT NULL,         -- 'Fase A (Kelas 1-2 SD)'
    description TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEVELS
CREATE TABLE IF NOT EXISTS public.levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_id UUID NOT NULL REFERENCES public.phases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,         -- 'Level 1: Bilangan & Operasi Aritmatika'
    grade_equivalent TEXT,      -- 'Kelas 7'
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOPICS
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    passing_score NUMERIC(5,2) NOT NULL DEFAULT 75.00,
    estimated_minutes INT DEFAULT 45,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBTOPICS
CREATE TABLE IF NOT EXISTS public.subtopics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 1
);

-- 6. PREREQUISITES (Topic A requires Prerequisite Topic B)
CREATE TABLE IF NOT EXISTS public.prerequisites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    prerequisite_topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    CONSTRAINT unique_topic_prerequisite UNIQUE (topic_id, prerequisite_topic_id)
);

-- 7. LEARNING MATERIALS
CREATE TABLE IF NOT EXISTS public.learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    learning_objectives TEXT[] NOT NULL,
    apperception TEXT NOT NULL,
    basic_concepts TEXT NOT NULL,
    detailed_explanation TEXT NOT NULL,
    common_misconceptions TEXT NOT NULL,
    summary TEXT NOT NULL,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EXAMPLES (Step-by-step)
CREATE TABLE IF NOT EXISTS public.examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    step_by_step_solution JSONB NOT NULL,
    key_takeaway TEXT,
    difficulty TEXT CHECK (difficulty IN ('LOTS', 'MOTS', 'HOTS')) DEFAULT 'MOTS',
    order_index INT DEFAULT 1
);

-- 9. QUESTIONS BANK
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'multiple_response', 'true_false', 'short_answer', 'numerical')),
    options JSONB, -- list of choices e.g. [{"id": "A", "text": "2x + 4"}]
    correct_answer JSONB NOT NULL, -- sensitive, hidden from client during test
    explanation TEXT NOT NULL,
    points INT NOT NULL DEFAULT 10,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('LOTS', 'MOTS', 'HOTS')) DEFAULT 'MOTS',
    concept_tag TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('DIAGNOSTIC', 'TOPIC', 'PREREQUISITE', 'REMEDIAL')),
    duration_minutes INT NOT NULL DEFAULT 20,
    passing_score NUMERIC(5,2) NOT NULL DEFAULT 75.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ASSESSMENT QUESTIONS
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 1,
    CONSTRAINT unique_assessment_question UNIQUE (assessment_id, question_id)
);

-- 12. ASSESSMENT ATTEMPTS
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score NUMERIC(5,2) DEFAULT 0.00,
    is_passed BOOLEAN DEFAULT FALSE,
    total_questions INT NOT NULL DEFAULT 0,
    correct_count INT NOT NULL DEFAULT 0,
    time_spent_seconds INT DEFAULT 0,
    lots_score NUMERIC(5,2) DEFAULT 0.00,
    mots_score NUMERIC(5,2) DEFAULT 0.00,
    hots_score NUMERIC(5,2) DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED')) DEFAULT 'IN_PROGRESS',
    analysis_strengths TEXT,
    analysis_weaknesses TEXT,
    analysis_misconceptions TEXT
);

-- 13. ASSESSMENT ANSWERS
CREATE TABLE IF NOT EXISTS public.assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_answer JSONB,
    is_correct BOOLEAN DEFAULT FALSE,
    time_spent_seconds INT DEFAULT 0,
    question_difficulty TEXT
);

-- 14. STUDENT PROGRESS
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'NEEDS_REMEDIAL', 'MASTERED')) DEFAULT 'LOCKED',
    current_step TEXT DEFAULT 'MATERIAL',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_topic_progress UNIQUE (user_id, topic_id)
);

-- 15. STUDENT MASTERY
CREATE TABLE IF NOT EXISTS public.student_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    attempts_count INT NOT NULL DEFAULT 0,
    last_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
    mastered_at TIMESTAMPTZ,
    CONSTRAINT unique_user_topic_mastery UNIQUE (user_id, topic_id)
);

-- 16. LEARNING HISTORY
CREATE TABLE IF NOT EXISTS public.learning_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('MATERIAL_VIEW', 'PRACTICE', 'ASSESSMENT', 'REMEDIAL', 'PREREQUISITE', 'DIAGNOSTIC')),
    score NUMERIC(5,2),
    status TEXT,
    duration_seconds INT DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 17. DIAGNOSTIC RESULTS
CREATE TABLE IF NOT EXISTS public.diagnostic_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommended_phase_id UUID REFERENCES public.phases(id),
    recommended_level_id UUID REFERENCES public.levels(id),
    recommended_topic_id UUID REFERENCES public.topics(id),
    competency_scores JSONB NOT NULL,
    raw_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    summary_text TEXT,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. REMEDIAL PATHS
CREATE TABLE IF NOT EXISTS public.remedial_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    origin_topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    failed_attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
    prerequisite_topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'RESOLVED')) DEFAULT 'ACTIVE',
    recommended_focus TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 19. AI TUTOR SESSIONS
CREATE TABLE IF NOT EXISTS public.ai_tutor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ASSESSMENT SECURITY EVENTS (Non-punitive flag logging)
CREATE TABLE IF NOT EXISTS public.assessment_security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'TAB_SWITCH',
        'WINDOW_BLUR',
        'FULLSCREEN_EXIT',
        'FACE_NOT_DETECTED',
        'MULTIPLE_FACES',
        'FACE_POSITION_CHANGED',
        'CAMERA_DISABLED',
        'CAMERA_PERMISSION_LOST',
        'SUSPICIOUS_REPEATED_FOCUS_LOSS'
    )),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INT DEFAULT 0,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'LOW',
    metadata JSONB DEFAULT '{}'::jsonb,
    review_status TEXT NOT NULL CHECK (review_status IN ('PENDING', 'REVIEWED', 'DISMISSED', 'CONFIRMED_CONCERN')) DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_topics_slug ON public.topics(slug);
CREATE INDEX IF NOT EXISTS idx_student_progress_user ON public.student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_mastery_user ON public.student_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_security_events_attempt ON public.assessment_security_events(attempt_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user ON public.assessment_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_user ON public.learning_history(user_id);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedial_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_security_events ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checks
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Curriculum tables: Read-only for authenticated students, full access for teachers & admins
CREATE POLICY "Public or students can read phases" ON public.phases FOR SELECT USING (true);
CREATE POLICY "Admin manage phases" ON public.phases FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Anyone can read levels" ON public.levels FOR SELECT USING (true);
CREATE POLICY "Admin manage levels" ON public.levels FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Anyone can read topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Admin manage topics" ON public.topics FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Anyone can read subtopics" ON public.subtopics FOR SELECT USING (true);
CREATE POLICY "Admin manage subtopics" ON public.subtopics FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Anyone can read prerequisites" ON public.prerequisites FOR SELECT USING (true);
CREATE POLICY "Admin manage prerequisites" ON public.prerequisites FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "Anyone can read materials" ON public.learning_materials FOR SELECT USING (true);
CREATE POLICY "Teachers and admin manage materials" ON public.learning_materials FOR ALL USING (public.current_user_role() IN ('teacher', 'admin'));

CREATE POLICY "Anyone can read examples" ON public.examples FOR SELECT USING (true);
CREATE POLICY "Teachers and admin manage examples" ON public.examples FOR ALL USING (public.current_user_role() IN ('teacher', 'admin'));

-- Questions: Hidden answers from students
CREATE POLICY "Teachers and admin full question access" ON public.questions FOR ALL USING (public.current_user_role() IN ('teacher', 'admin'));

-- Student Data: Strict Ownership RLS
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.current_user_role() IN ('teacher', 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students see own progress" ON public.student_progress FOR SELECT USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));
CREATE POLICY "Students see own mastery" ON public.student_mastery FOR SELECT USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));
CREATE POLICY "Students see own history" ON public.learning_history FOR SELECT USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));
CREATE POLICY "Students see own diagnostic" ON public.diagnostic_results FOR SELECT USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));
CREATE POLICY "Students see own remedial" ON public.remedial_paths FOR SELECT USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));

-- Assessment attempts & security events
CREATE POLICY "Student read own attempts" ON public.assessment_attempts FOR SELECT USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));
CREATE POLICY "Teacher review security events" ON public.assessment_security_events FOR ALL USING (auth.uid() = user_id OR public.current_user_role() IN ('teacher', 'admin'));

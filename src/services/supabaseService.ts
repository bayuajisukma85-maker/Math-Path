import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DiagnosticResult, StudentProgress } from '../types';

export const supabaseService = {
  /**
   * Check if Supabase client is configured and ready
   */
  isReady(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  /**
   * Save diagnostic assessment result to Supabase
   */
  async saveDiagnosticResult(userId: string, result: DiagnosticResult): Promise<boolean> {
    if (!this.isReady() || !supabase) return false;

    try {
      const { error } = await supabase.from('diagnostic_results').upsert({
        user_id: userId,
        recommended_phase_id: result.recommendedPhaseId,
        recommended_phase_code: result.recommendedPhaseCode,
        recommended_topic_id: result.recommendedTopicId,
        recommended_topic_title: result.recommendedTopicTitle,
        raw_score: result.rawScore,
        summary_text: result.summaryText,
        competency_scores: result.competencyScores,
        completed_at: result.completedAt || new Date().toISOString()
      }, { onConflict: 'user_id' });

      if (error) {
        console.warn('Supabase saveDiagnosticResult warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveDiagnosticResult error:', err);
      return false;
    }
  },

  /**
   * Save student topic progress to Supabase
   */
  async saveStudentProgress(studentId: string, progress: StudentProgress): Promise<boolean> {
    if (!this.isReady() || !supabase) return false;

    try {
      const { error } = await supabase.from('student_progress').upsert({
        student_id: studentId,
        topic_id: progress.topicId,
        status: progress.status,
        current_step: progress.currentStep,
        score: progress.score ?? 0,
        updated_at: progress.updatedAt || new Date().toISOString()
      }, { onConflict: 'student_id,topic_id' });

      if (error) {
        console.warn('Supabase saveStudentProgress warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveStudentProgress error:', err);
      return false;
    }
  },

  /**
   * Fetch user profile from Supabase
   */
  async getProfile(userId: string) {
    if (!this.isReady() || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Supabase getProfile warning:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Supabase getProfile error:', err);
      return null;
    }
  }
};

/**
 * MathPath AI Tutor Server Service
 * Powered by Google GenAI SDK (@google/genai)
 */

import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return aiClient;
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
    return null;
  }
}

export async function askAiTutor(params: {
  topicTitle?: string;
  userMessage: string;
  chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  isAssessmentActive?: boolean;
}): Promise<string> {
  // CRITICAL RULE: AI Tutor is strictly disabled during active assessment
  if (params.isAssessmentActive) {
    return 'Mohon maaf, AI Tutor dinonaktifkan sementara selama asesmen berlangsung demi menjaga kemandirian dan integritas ujian Anda.';
  }

  const ai = getAiClient();
  if (!ai) {
    // Fallback explanation if API key is not yet set
    return (
      'Halo! Saya MathPath AI Tutor. ' +
      (params.topicTitle ? `Sedang mendampingi kamu mempelajari topik "${params.topicTitle}". ` : '') +
      'Dalam konsep matematika ini, kunci utamanya adalah memahami definisi dan langkah-langkah sistematis. ' +
      'Misalnya pada fungsi kuadrat, ingat selalu rumus sumbu simetri $x = -\\frac{b}{2a}$ dan substitusikan ke dalam fungsi untuk menemukan nilai optimumnya.'
    );
  }

  try {
    const systemInstruction = `
Kamu adalah "MathPath AI Tutor", asisten guru matematika interaktif dan ramah untuk kurikulum Indonesia (Fase A hingga Fase F).
Aturan Penting:
1. Jelaskan konsep matematika secara bertahap (scaffolding), gunakan analogi intuitif sehari-hari.
2. Gunakan format LaTeX untuk rumus matematika (misal: $f(x) = ax^2 + bx + c$, $\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$).
3. Jangan pernah membocorkan kunci jawaban ujian atau asesmen langsung. Berikan petunjuk atau konsep penuntun.
4. Gunakan Bahasa Indonesia yang santun, memotivasi, dan mudah dipahami sesuai jenjang siswa.
5. Topik saat ini: ${params.topicTitle || 'Matematika Umum'}.
    `.trim();

    const contents = [
      ...(params.chatHistory || []).map(h => `${h.role === 'user' ? 'Siswa' : 'AI Tutor'}: ${h.content}`),
      `Siswa: ${params.userMessage}`
    ].join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    return response.text || 'Tidak ada respons dari AI Tutor.';
  } catch (err) {
    console.error('AI Tutor Generation error:', err);
    return 'AI Tutor sedang tidak tersedia saat ini. Silakan telaah materi dan contoh soal langkah demi langkah yang telah disediakan.';
  }
}

import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, AlertCircle, RefreshCw } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle?: string;
  isAssessmentActive?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  isAssessmentActive = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Halo! Saya **MathPath AI Tutor**. Saya siap mendampingi kamu memahami konsep-konsep matematika${
        topicTitle ? ` pada topik **${topicTitle}**` : ''
      }. Ada rumus atau konsep yang ingin dijelaskan dengan cara yang lebih mudah?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Bagaimana menentukan koordinat titik puncak parabola?',
    'Apa hubungan diskriminan $D = b^2 - 4ac$ dengan grafik?',
    'Jelaskan pemfaktoran bentuk $x^2 + bx + c$',
    'Mengapa ada tanda minus pada sumbu simetri $x = -\\frac{b}{2a}$?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    if (isAssessmentActive) {
      alert('AI Tutor dinonaktifkan selama asesmen aktif demi menjaga integritas dan kemandirian ujian Anda.');
      return;
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          topicTitle: topicTitle || 'Matematika Kurikulum Merdeka',
          chatHistory: newMessages.slice(-4),
          isAssessmentActive
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'Maaf, AI Tutor sedang mengalami sedikit kendala jaringan. Coba ajukan pertanyaan kembali beberapa saat lagi.'
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Terjadi gangguan koneksi. Silakan periksa jaringan Anda atau lanjutkan membaca modul materi.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">MathPath AI Tutor</h2>
              <p className="text-xs text-indigo-200">Pendamping Belajar Konsep Matematika</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assessment Guard Notice */}
        {isAssessmentActive && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Asesmen Sedang Berlangsung:</span>
              <p className="text-amber-800 mt-0.5">
                AI Tutor dikunci sementara agar siswa dapat mengerjakan asesmen secara mandiri sesuai protokol integritas.
              </p>
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-sm ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/70 leading-relaxed'
                }`}
              >
                {m.content.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="mb-1.5 last:mb-0">
                    {/* Render LaTeX inline if wrapped in $ or direct math */}
                    {line.includes('$') ? (
                      line.split('$').map((part, pIdx) =>
                        pIdx % 2 === 1 ? (
                          <MathRenderer key={pIdx} math={part} />
                        ) : (
                          part
                        )
                      )
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-slate-500 italic p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>MathPath AI Tutor sedang merumuskan penjelasan matematis...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {!isAssessmentActive && (
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Pertanyaan Cepat:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors truncate max-w-full text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              disabled={isAssessmentActive || isLoading}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={
                isAssessmentActive
                  ? 'AI Tutor dinonaktifkan saat asesmen...'
                  : 'Tanyakan konsep atau langkah penyelesaian rumus...'
              }
              className="flex-1 text-sm bg-slate-100 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isAssessmentActive || isLoading || !inputValue.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

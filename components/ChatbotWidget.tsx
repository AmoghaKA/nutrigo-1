'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, MessageCircle, Loader2, Sparkles, Volume2, VolumeX } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your NutriGo AI assistant. Ask me anything about nutrition, packaged food scanning, or how to use our app! 🥫✨",
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ... (keep all your existing useEffect and handler functions - they remain the same)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setInput(finalTranscript || interimTranscript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const textToSend = message || input;
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const endpoint = `${backendUrl}/api/chatbot/chat`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of JSON.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      await speakResponseSarvam(data.response);
    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponseSarvam = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('/api/tts/sarvam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      speakResponseBrowser(text);
    }
  };

  const speakResponseBrowser = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating Button - SUBTLE & COMPACT Design */}
      <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[60] md:z-[999999] pointer-events-auto">
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)} 
            className="group relative"
            aria-label="Open AI Assistant"
          >
            {/* Subtle glow - only on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Smaller button with muted colors */}
            <div className="relative bg-slate-800/90 border-2 border-emerald-500/40 backdrop-blur-sm p-2.5 rounded-full shadow-lg group-hover:shadow-emerald-500/20 group-hover:border-emerald-500/60 transition-all duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" strokeWidth={2} />

              {/* Small notification dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full border border-slate-900"></span>
            </div>
          </button>
        )}
      </div>

      {/* Chat Widget - Cleaner design */}
      {isOpen && (
        <div className="fixed bottom-28 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] max-w-[340px] sm:w-[360px] md:w-[380px] lg:w-[400px] h-[calc(100vh-14rem)] sm:h-[520px] md:h-[580px] max-h-[calc(100vh-14rem)] sm:max-h-[85vh] z-[60] md:z-[999999] flex flex-col animate-slideUp">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl sm:rounded-3xl blur-xl"></div>

          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-500/30 backdrop-blur-xl overflow-hidden flex flex-col h-full">
            {/* Header - Muted gradient */}
            <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-emerald-500/20 p-3 sm:p-3.5 md:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                  <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 text-emerald-400" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">NutriGo AI</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-slate-700/50 p-1.5 sm:p-2 rounded-lg transition-all duration-300 group min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Messages - Same as before */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 md:p-4 space-y-2.5 sm:space-y-3 bg-slate-950/50 backdrop-blur-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl relative ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-br-md shadow-lg'
                        : 'bg-slate-800 text-slate-100 rounded-bl-md border border-slate-700'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-slate-800 border border-slate-700 p-2.5 sm:p-3 rounded-xl rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 animate-spin" />
                      <span className="text-xs sm:text-sm text-slate-300">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-3.5 md:p-4 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 flex-shrink-0">
              {isSpeaking && (
                <div className="mb-2 sm:mb-2.5 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 animate-fadeIn">
                  <span className="text-[10px] sm:text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    Speaking...
                  </span>
                  <button
                    onClick={stopSpeaking}
                    className="text-[10px] sm:text-xs text-emerald-400 hover:text-emerald-300 font-bold min-h-[32px] px-2"
                  >
                    Stop
                  </button>
                </div>
              )}

              {isListening && (
                <div className="mb-2 sm:mb-2.5 flex items-center justify-between bg-rose-500/10 border border-rose-500/30 rounded-lg p-2 animate-fadeIn">
                  <span className="text-[10px] sm:text-xs text-rose-400 flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse"></span>
                    Listening...
                  </span>
                  <button
                    onClick={toggleListening}
                    className="text-[10px] sm:text-xs text-rose-400 hover:text-rose-300 font-bold min-h-[32px] px-2"
                  >
                    Stop
                  </button>
                </div>
              )}

              <div className="flex gap-1.5 sm:gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about nutrition..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-xs sm:text-sm text-white placeholder-slate-500 disabled:opacity-50 transition-all min-h-[44px]"
                />

                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2 sm:p-2.5 rounded-lg transition-all disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg'
                      : 'bg-slate-800 border border-slate-700 hover:border-emerald-500/50'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  )}
                </button>

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 p-2 sm:p-2.5 rounded-lg shadow-lg transition-all disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-center">
                <span className="hidden sm:inline">Voice & text assistant</span>
                <span className="sm:hidden">AI assistant</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
}

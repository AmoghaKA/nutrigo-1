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

      console.log('🔍 Sending request to:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Content-Type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text();
        console.error('❌ Received HTML instead of JSON:', htmlText.substring(0, 200));
        throw new Error(
          `Server returned HTML instead of JSON. The chatbot endpoint might not be available. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);

      await speakResponseSarvam(data.response);
    } catch (error) {
      console.error('❌ Chat error:', error);

      let errorMessage = 'Sorry, I encountered an error. ';

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += `Cannot connect to the chatbot server. Please check if the backend is running at ${
          process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
        }.`;
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again!';
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error('TTS error:', err);
        throw new Error(err.error || 'Failed to generate speech');
      }

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
        console.error('Audio playback error');
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
      {/* Floating Button - Responsive sizing and positioning */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 z-[999999] pointer-events-auto">
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-lg sm:blur-xl opacity-60 group-hover:opacity-100 animate-pulse-slow transition-opacity duration-300"></div>

            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-3 sm:p-3.5 md:p-4 rounded-full shadow-2xl group-hover:scale-110 transition-all duration-300 min-h-[56px] min-w-[56px] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />

              <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse border-2 border-slate-950"></span>

              <Sparkles className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-cyan-400 animate-ping" />
            </div>
          </button>
        )}
      </div>

      {/* Chat Widget - Fully responsive */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] sm:w-[360px] md:w-[380px] lg:w-[400px] h-[calc(100vh-6rem)] sm:h-[520px] md:h-[580px] max-h-[85vh] z-[999999] flex flex-col animate-slideUp">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-2xl sm:rounded-2xl md:rounded-3xl blur-xl sm:blur-2xl"></div>

          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-emerald-500/30 backdrop-blur-xl overflow-hidden flex flex-col h-full">
            {/* Header - Responsive */}
            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-3 sm:p-3.5 md:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl animate-float">
                  <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-sm md:text-base text-white">NutriGo AI</h3>
                  <p className="text-[10px] sm:text-xs md:text-xs text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                    Voice Assistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 group min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>

            {/* Messages - Responsive */}
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
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-br-md shadow-xl shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-slate-800 to-slate-700 text-slate-100 rounded-bl-md border border-emerald-500/20 shadow-xl'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl rounded-bl-md border border-emerald-500/20 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 animate-spin" />
                      <span className="text-xs sm:text-sm text-slate-300">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Responsive */}
            <div className="p-3 sm:p-3.5 md:p-4 bg-slate-900/80 backdrop-blur-xl border-t border-emerald-500/20 flex-shrink-0">
              {isSpeaking && (
                <div className="mb-2 sm:mb-2.5 md:mb-3 flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg sm:rounded-xl p-2 sm:p-2.5 animate-fadeIn backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs text-emerald-400 flex items-center gap-1.5 sm:gap-2 font-semibold">
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    Speaking...
                  </span>
                  <button
                    onClick={stopSpeaking}
                    className="text-[10px] sm:text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1 min-h-[32px] px-2"
                  >
                    <VolumeX className="w-3 h-3" />
                    Stop
                  </button>
                </div>
              )}

              {isListening && (
                <div className="mb-2 sm:mb-2.5 md:mb-3 flex items-center justify-between bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 rounded-lg sm:rounded-xl p-2 sm:p-2.5 animate-fadeIn backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs text-rose-400 flex items-center gap-1.5 sm:gap-2 font-semibold">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-400 rounded-full animate-pulse"></span>
                    Listening...
                  </span>
                  <button
                    onClick={toggleListening}
                    className="text-[10px] sm:text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors min-h-[32px] px-2"
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
                  className="flex-1 bg-slate-800 border border-emerald-500/30 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs sm:text-sm text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-h-[44px]"
                />

                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative group min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isListening
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-xl shadow-rose-500/50'
                      : 'bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/50 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <span className="absolute inset-0 bg-rose-400 opacity-30 rounded-lg sm:rounded-xl animate-ping"></span>
                    </>
                  ) : (
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:text-emerald-300" />
                  )}
                </button>

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="relative group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none overflow-hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 sm:mt-2.5 text-center flex items-center justify-center gap-1.5 sm:gap-2">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">NutriGo AI Voice Assistant – speak or type</span>
                <span className="sm:hidden">Speak or type your question</span>
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
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}

/**
 * PMO Knowledge Base Chatbot
 * 
 * Integriert Multi-Language RAG (2x3 Matrix):
 * - Sprache: DE/EN/ES
 * - Register: colloquial (Normalsprache) / management (Profi-Terminologie)
 * 
 * Backend: Python FastAPI mit LlamaParse + ChromaDB
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { SYSTEM_PATTERNS, SYSTEM_RESPONSES, type Language } from '@/app/utils/systemGuide';
import { SYSTEM_EXTENSIONS } from '@/app/utils/systemGuideExtensions';
import { PMO_KNOWLEDGE, matchPMOQuestion } from '@/app/utils/staticPMOKnowledge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];  // Quelldokumente aus RAG
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const { language, register, setLanguage, setRegister } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome Message basierend auf Sprache - aktualisiert sich bei Sprachwechsel!
  useEffect(() => {
    const welcomeText = SYSTEM_RESPONSES.welcome[language.toLowerCase() as Lowercase<Language>];

    // Update welcome message when language changes
    setMessages(prev => {
      if (prev.length === 0 || prev[0].id === 'welcome') {
        return [{
          id: 'welcome',
          role: 'assistant',
          content: welcomeText,
          timestamp: new Date()
        }];
      }
      return prev;
    });
  }, [language]); // Depends on language!
  
  // Sync with page.tsx language/mode
  useEffect(() => {
    // When chatbot opens, ensure it uses the current language from main page
    if (isOpen) {
      // Language is already synced via LanguageContext
      // This effect just ensures the welcome message is updated
      const welcomeText = SYSTEM_RESPONSES.welcome[language.toLowerCase() as Lowercase<Language>];
      setMessages(prev => {
        if (prev.length === 0 || prev[0].id === 'welcome') {
          return [{
            id: 'welcome',
            role: 'assistant',
            content: welcomeText,
            timestamp: new Date()
          }];
        }
        return prev;
      });
    }
  }, [isOpen, language]);
  
  // Check if message matches system command pattern
  const checkSystemCommand = (userInput: string): string | null => {
    for (const [command, pattern] of Object.entries(SYSTEM_PATTERNS)) {
      if (pattern.test(userInput)) {
        return command;
      }
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Check if message is a system command
      const systemCommand = checkSystemCommand(userInput);
      
      if (systemCommand) {
        // Check both SYSTEM_RESPONSES and SYSTEM_EXTENSIONS
        const allResponses = { ...SYSTEM_RESPONSES, ...SYSTEM_EXTENSIONS };
        
        if (systemCommand in allResponses) {
          // Handle system command locally (no API call)
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate thinking
          
          const systemResponse = allResponses[systemCommand as keyof typeof allResponses];
          const responseText = systemResponse[language.toLowerCase() as Lowercase<Language>];
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseText,
            timestamp: new Date(),
            sources: ['System Guide'] // Mark as system response
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Try to answer from Static PMO Knowledge Base
      const pmoQuestion = matchPMOQuestion(userInput);
      if (pmoQuestion) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate thinking
        
        const staticAnswer = PMO_KNOWLEDGE[pmoQuestion];
        const responseText = staticAnswer[language.toLowerCase() as Lowercase<Language>];
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          sources: ['PMO Knowledge Base'] // Mark as static knowledge
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }
      
      // Regular PMO knowledge query - call RAG Backend directly
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.content,
          language: language.toLowerCase(),
          register: register.toLowerCase()
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'Keine Antwort erhalten.',
        timestamp: new Date(),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      
      // Last resort fallback - only for very specific/deep questions
      const fallbackMessages = {
        de: `Für sehr spezifische Fragen ist das RAG Backend erforderlich.

**Aber ich kann dir bereits jetzt helfen mit:**

📚 **Tutorial & Bedienung:**
• \`/tour\` - Geführte Tour durch das Tool
• \`/input\` - Was kann ich eingeben?
• \`/output\` - Welche Ergebnisse bekomme ich?

📊 **PMO Grundlagen:**
• "Was sind die wichtigsten PMO KPIs?"
• "Warum brauche ich ein PMO?"
• "Wie setze ich ein PMO auf?"
• "Was sind PMO Best Practices?"

🔧 **Tool-Fragen:**
• "Wie wechsle ich die Sprache?"
• "Was ist der Impact Score?"
• "Wie funktioniert der Impact Cycle?"

💬 **Stelle einfach deine Frage!** Die meisten PMO-Themen kann ich auch ohne Backend beantworten.`,

        en: `For very specific questions, the RAG backend is required.

**But I can already help you with:**

📚 **Tutorial & Usage:**
• \`/tour\` - Guided tour through the tool
• \`/input\` - What can I enter?
• \`/output\` - What results do I get?

📊 **PMO Basics:**
• "What are the most important PMO KPIs?"
• "Why do I need a PMO?"
• "How do I set up a PMO?"
• "What are PMO best practices?"

🔧 **Tool Questions:**
• "How do I change the language?"
• "What is the Impact Score?"
• "How does the Impact Cycle work?"

💬 **Just ask your question!** I can answer most PMO topics even without backend.`,

        es: `Para preguntas muy específicas, se requiere el backend RAG.

**Pero ya puedo ayudarte con:**

📚 **Tutorial y Uso:**
• \`/tour\` - Tour guiado por la herramienta
• \`/input\` - ¿Qué puedo ingresar?
• \`/output\` - ¿Qué resultados obtengo?

📊 **Fundamentos PMO:**
• "¿Cuáles son los KPIs PMO más importantes?"
• "¿Por qué necesito una PMO?"
• "¿Cómo configuro una PMO?"
• "¿Cuáles son las mejores prácticas PMO?"

🔧 **Preguntas sobre la Herramienta:**
• "¿Cómo cambio el idioma?"
• "¿Qué es el Impact Score?"
• "¿Cómo funciona el Impact Cycle?"

💬 **¡Solo haz tu pregunta!** Puedo responder la mayoría de temas PMO incluso sin backend.`
      };
      
      const fallbackText = fallbackMessages[language.toLowerCase() as 'de' | 'en' | 'es'] || fallbackMessages.en;
      
      const mockMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date(),
        sources: ['System Guide']
      };
      setMessages(prev => [...prev, mockMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Chat Window */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-slate-900/80 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">PMO Knowledge Assistant</h2>
              <p className="text-sm text-gray-400">
                {language === 'DE' && 'AI-powered PMO Insights • 100% Privat'}
                {language === 'EN' && 'AI-powered PMO Insights • 100% Private'}
                {language === 'ES' && 'Insights PMO con IA • 100% Privado'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800/80 text-gray-100 border border-purple-500/20'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-500/20">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      {msg.sources.includes('System Guide') ? (
                        <>
                          <Sparkles className="w-3 h-3" />
                          {language === 'DE' && 'System-Tutorial'}
                          {language === 'EN' && 'System Tutorial'}
                          {language === 'ES' && 'Tutorial del Sistema'}
                        </>
                      ) : (
                        <>
                          📚
                          {language === 'DE' && 'Quellen:'}
                          {language === 'EN' && 'Sources:'}
                          {language === 'ES' && 'Fuentes:'}
                        </>
                      )}
                    </p>
                    {!msg.sources.includes('System Guide') && (
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  {msg.timestamp.toLocaleTimeString(language === 'DE' ? 'de-DE' : language === 'EN' ? 'en-US' : 'es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-800/80 rounded-2xl px-4 py-3 border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span className="text-sm text-gray-400">
                    {language === 'DE' && 'Durchsuche Knowledge Base...'}
                    {language === 'EN' && 'Searching knowledge base...'}
                    {language === 'ES' && 'Buscando en la base de conocimientos...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-purple-500/30 bg-slate-900/80 backdrop-blur-sm rounded-b-2xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language === 'DE' ? 'Frage etwas über PMO, KPIs, Best Practices...' :
                language === 'EN' ? 'Ask about PMO, KPIs, best practices...' :
                '¿Preguntar sobre PMO, KPIs, mejores prácticas...?'
              }
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Current Settings */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span>
              {language === 'DE' && '🌍 Sprache: Deutsch'}
              {language === 'EN' && '🌍 Language: English'}
              {language === 'ES' && '🌍 Idioma: Español'}
            </span>
            <span>•</span>
            <span>
              {register === 'colloquial' && (language === 'DE' ? '👥 Einfache Sprache' : language === 'EN' ? '👥 Simple language' : '👥 Lenguaje simple')}
              {register === 'management' && (language === 'DE' ? '💼 Management-Sprache' : language === 'EN' ? '💼 Management language' : '💼 Lenguaje de gestión')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


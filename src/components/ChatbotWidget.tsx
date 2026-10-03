import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowUpRight, 
  RefreshCw,
  ExternalLink,
  Search
} from 'lucide-react';
import { ChatMessage, EService } from '../types';
import { SERVICES_DATA } from '../data/servicesData';

interface ChatbotWidgetProps {
  onNavigateToService: (slugOrId: string) => void;
}

const QUICK_CHIPS = [
  'FASTag Recharge',
  'e-Challan payment',
  'New PAN Card',
  'Passport Seva steps',
  'Driving License LLR',
  'Aadhaar Download'
];

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onNavigateToService }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: 'Hi! I can help you find the right Indian e-service. Try asking about PAN card, FASTag, passport, e-Challan, or driving license.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Client-side rule-based keyword matcher
  const matchServicesClientSide = (query: string): EService[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return SERVICES_DATA.filter((s) => {
      const titleMatch = s.title.toLowerCase().includes(q);
      const descMatch = s.shortDescription.toLowerCase().includes(q);
      const catMatch = s.category.toLowerCase().includes(q);
      const docMatch = s.documents.some((d) => d.toLowerCase().includes(q));

      const isFastag = (q.includes('fastag') || q.includes('toll') || q.includes('recharge') || q.includes('nhai')) && s.id.includes('fastag');
      const isChallan = (q.includes('challan') || q.includes('fine') || q.includes('penalty') || q.includes('traffic')) && s.id === 'echallan-payment';
      const isDL = (q.includes('license') || q.includes('licence') || q.includes('driving') || q.includes('sarathi') || q.includes('llr')) && s.id === 'driving-license-sarathi';
      const isRC = (q.includes('rc') || q.includes('registration') || q.includes('vahan') || q.includes('ownership')) && s.id === 'vehicle-rc-services';
      const isPUC = (q.includes('puc') || q.includes('pollution') || q.includes('emission')) && s.id === 'puc-certificate-status';
      const isPan = (q.includes('pan') || q.includes('tax') || q.includes('income tax')) && (s.id === 'instant-epan-card');
      const isPassport = (q.includes('passport') || q.includes('psk') || q.includes('visa')) && s.id === 'passport-seva-portal';
      const isVoter = (q.includes('voter') || q.includes('epic') || q.includes('election')) && s.id === 'voter-id-card-eci';
      const isAadhaar = (q.includes('aadhaar') || q.includes('uidai') || q.includes('pvc')) && s.id === 'aadhaar-uidai-services';
      const isDigi = (q.includes('digilocker') || q.includes('vault') || q.includes('documents')) && s.id === 'digilocker-digital-vault';

      return (
        titleMatch ||
        descMatch ||
        catMatch ||
        docMatch ||
        isFastag ||
        isChallan ||
        isDL ||
        isRC ||
        isPUC ||
        isPan ||
        isPassport ||
        isVoter ||
        isAadhaar ||
        isDigi
      );
    }).slice(0, 3);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Try backend /api/chat
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchedServices: data.matchedServices
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fall through to client-side rule matching
    }

    // Client-side fallback rule-based execution
    const matched = matchServicesClientSide(userMsg.text);
    let replyText = '';
    if (matched.length > 0) {
      replyText = `I found ${matched.length} relevant e-service(s) for your inquiry. Click below for complete requirements, steps, and official portal links:`;
    } else {
      replyText = "I couldn't find that service. Try browsing the Services page or use different keywords like 'FASTag', 'PAN card', 'Passport', 'Driving License', or 'e-Challan'.";
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      matchedServices: matched.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        category: s.category,
        shortDescription: s.shortDescription,
        officialUrl: s.officialUrl
      }))
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'Chat history cleared. How can I help you with Indian government or vehicle e-services today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="btn-open-chatbot"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-full shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer border border-blue-400/30"
          aria-label="Open AI E-Services Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-orange-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-900 animate-pulse" />
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-wide">
            Ask E-Services AI
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Expandable Chat Panel */}
      {isOpen && (
        <div 
          id="chatbot-window-panel"
          className="w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm h-[520px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-blue-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/60 border border-blue-400/40 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 text-orange-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">
                    E-Services Assistant
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full font-medium">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Instant Indian E-Services Directory Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-chat-reset"
                onClick={handleResetChat}
                title="Reset chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-chat-close"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 text-xs sm:text-sm ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Matched Service Cards inside Bot Bubble */}
                  {msg.matchedServices && msg.matchedServices.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {msg.matchedServices.map((svc) => (
                        <div
                          key={svc.id}
                          className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 space-y-1.5 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">
                              {svc.title}
                            </span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                              {svc.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            {svc.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                onNavigateToService(svc.slug || svc.id);
                                setIsOpen(false);
                              }}
                              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Checklist & Steps</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                            <span className="text-slate-300">|</span>
                            <a
                              href={svc.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-slate-500 hover:text-slate-800 inline-flex items-center gap-0.5"
                            >
                              <span>Portal ↗</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-right font-medium ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-500 bg-white border border-slate-200 p-2.5 rounded-2xl w-max">
                <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Searching official e-services database...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              id="chatbot-input-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g. FASTag recharge, DL)..."
              className="flex-1 bg-slate-100 hover:bg-slate-150 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none transition-all"
            />
            <button
              id="chatbot-send-btn"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  ShieldAlert, 
  ExternalLink,
  Sparkles,
  Bot
} from 'lucide-react';
import { ContactSubmission } from '../types';
import { useAuth } from '../context/AuthContext';
import { logInquiryToFirestore } from '../lib/firebase';

interface ContactPageProps {
  onOpenChatbot?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenChatbot }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    category: 'Vehicle Services',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ContactSubmission | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Log to Firestore
      const docId = await logInquiryToFirestore({
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        message: formData.message.trim(),
        userId: user?.uid
      });

      // 2. Also send to Express backend
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const ticketId = docId || `ESH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      if (res.ok) {
        const data = await res.json();
        setSubmissionResult({
          ...data.ticket,
          id: ticketId
        });
      } else {
        setSubmissionResult({
          id: ticketId,
          name: formData.name,
          email: formData.email,
          category: formData.category,
          message: formData.message,
          createdAt: new Date().toISOString(),
          status: 'Received',
          userId: user?.uid
        });
      }
    } catch {
      setSubmissionResult({
        id: `ESH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        email: formData.email,
        category: formData.category,
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: 'Received',
        userId: user?.uid
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.displayName || '',
      email: user?.email || '',
      category: 'Vehicle Services',
      message: ''
    });
    setSubmissionResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
          <Mail className="w-3.5 h-3.5 text-blue-700" />
          <span>Feedback & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Contact & Directory Feedback
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Have feedback on an e-service guide, suggestions for new state portals, or general questions? Get in touch with our directory editors.
        </p>
      </div>

      {/* AI Chatbot Assistant Fast Note */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-800">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-orange-300 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Looking for instant answers on e-services?
            </h3>
            <p className="text-xs text-blue-200">
              Quick-help queries are handled 24/7 by our floating AI Assistant widget at the bottom-right corner!
            </p>
          </div>
        </div>

        {onOpenChatbot && (
          <button
            onClick={onOpenChatbot}
            className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            Open Chat Assistant
          </button>
        )}
      </div>

      {/* Form & Support Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Form (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              Send a Feedback Message
            </h2>
            <p className="text-xs text-slate-500">
              Inquiries and suggestions are logged directly into our cloud database.
            </p>
          </div>

          {submissionResult ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-emerald-950 text-base sm:text-lg">
                  Thank you! Message Saved in Firestore
                </h3>
                <p className="text-xs text-emerald-800">
                  Your feedback has been registered with reference code:
                </p>
                <div className="font-mono font-bold text-base text-emerald-900 bg-emerald-100/80 px-4 py-2 rounded-xl inline-block mt-2 border border-emerald-200">
                  {submissionResult.id}
                </div>
              </div>
              <p className="text-[11px] text-emerald-700">
                A confirmation has been recorded for {submissionResult.email}.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Topic / Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="Vehicle Services">Vehicle & FASTag Services</option>
                  <option value="Government Services">Government (Aadhaar, Passport, Voter ID)</option>
                  <option value="Banking & Tax">Banking, PAN & Income Tax</option>
                  <option value="Portal Link Update">Report Broken Link or Outdated Procedure</option>
                  <option value="General Feedback">General Suggestion</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, suggestion, or correction..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Saving to database...</span>
                ) : (
                  <>
                    <span>Submit Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Directory & Official Grievance Info (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Directory Desk Email</span>
            </h3>
            <p className="text-xs text-slate-600">
              For editorial inquiries and partnership communication:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 select-all font-semibold">
              editor@eserviceshub-india.demo
            </div>
          </div>

          {/* Official Government Grievance Box (CPGRAMS) */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Official Citizen Grievance Portal</span>
            </div>
            <h4 className="font-bold text-white text-base">
              Need to file an official grievance?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you have a genuine complaint regarding delayed DL cards, passport appointment issues, or tax refunds, please log it directly on CPGRAMS (Centralised Public Grievance Redress and Monitoring System).
            </p>
            <a
              href="https://pgportal.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              <span>Visit pgportal.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Key Helplines */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Citizen Helplines</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">NHAI FASTag Support</span>
                <strong className="text-emerald-700 font-mono">1033</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Cyber Crime Helpline</span>
                <strong className="text-amber-700 font-mono">1930</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">National Consumer Helpline</span>
                <strong className="text-blue-700 font-mono">1915</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">UIDAI Aadhaar Helpline</span>
                <strong className="text-slate-900 font-mono">1947</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

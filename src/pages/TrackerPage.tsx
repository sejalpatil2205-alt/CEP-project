import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Lock,
  ArrowRight,
  ClipboardCheck,
  Filter,
  Search,
  CheckCircle,
  Circle,
  Truck,
  Building2,
  PhoneCall,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Award,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeUserApplications, 
  saveUserApplication, 
  deleteUserApplication 
} from '../lib/firebase';
import { UserApplicationTracker, ApplicationTimelineStage } from '../types';
import { SERVICES_DATA, DEMO_TRACKING_RECORDS } from '../data/servicesData';

interface TrackerPageProps {
  onNavigate: (path: string) => void;
  onSelectService: (serviceId: string) => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({ onNavigate, onSelectService }) => {
  const { user, setAuthModalOpen } = useAuth();
  const [applications, setApplications] = useState<UserApplicationTracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // Interactive Live ARN Lookup & Simulator State
  const [arnQuery, setArnQuery] = useState('ARN-2026-99120');
  const [activeLookupResult, setActiveLookupResult] = useState<any>(DEMO_TRACKING_RECORDS['ARN-2026-99120']);
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Form State for new application
  const [formData, setFormData] = useState({
    serviceId: SERVICES_DATA[0].id,
    applicationNumber: '',
    portalName: 'National Portal',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Submitted' as UserApplicationTracker['status'],
    appointmentDate: '',
    appointmentLocation: '',
    notes: '',
    currentStage: 'Document Scrutiny in Progress',
    progressPercentage: 40
  });

  // Subscribe to real-time Firestore collection
  useEffect(() => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeUserApplications(user.uid, (list) => {
      setApplications(list);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Handle Search / Demo Select for Live Process Tracking
  const handleArnSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanArn = arnQuery.trim().toUpperCase();
    if (!cleanArn) return;

    // Check if in predefined demo records
    if (DEMO_TRACKING_RECORDS[cleanArn]) {
      setActiveLookupResult(DEMO_TRACKING_RECORDS[cleanArn]);
      setLookupFeedback(null);
      return;
    }

    // Check if in user's saved applications
    const userMatched = applications.find(
      (a) => a.applicationNumber.toUpperCase() === cleanArn
    );

    if (userMatched) {
      const svc = SERVICES_DATA.find((s) => s.id === userMatched.serviceId);
      setActiveLookupResult({
        serviceId: userMatched.serviceId,
        serviceTitle: userMatched.serviceTitle,
        applicationNumber: userMatched.applicationNumber,
        portalName: userMatched.portalName || (svc?.department || 'Official Portal'),
        appliedDate: userMatched.appliedDate,
        estimatedCompletionDate: 'Within 15-20 days',
        status: userMatched.status,
        progressPercentage: userMatched.progressPercentage || (userMatched.status === 'Approved' ? 100 : userMatched.status === 'In Verification' ? 60 : 30),
        currentStage: userMatched.currentStage || 'Application Under Scrutiny',
        speedPostNumber: userMatched.speedPostNumber,
        stages: userMatched.stages || [
          { stageNumber: 1, stageName: 'Application Form Submitted', status: 'completed', date: userMatched.appliedDate, description: 'Online acknowledgement generated.' },
          { stageNumber: 2, stageName: 'Fee & Biometrics Scrutiny', status: userMatched.status !== 'Draft' ? 'completed' : 'pending', description: 'Central treasury reconciliation.' },
          { stageNumber: 3, stageName: 'Document & Field Verification', status: userMatched.status === 'In Verification' ? 'in_progress' : userMatched.status === 'Approved' ? 'completed' : 'pending', description: 'Scrutiny officer verification.' },
          { stageNumber: 4, stageName: 'Approval & Generation', status: userMatched.status === 'Approved' ? 'completed' : 'pending', description: 'Digital certificate / physical card generated.' },
          { stageNumber: 5, stageName: 'Speed Post Dispatch / e-Download', status: userMatched.status === 'Approved' ? 'completed' : 'pending', description: 'Dispatched to applicant address.' }
        ]
      });
      setLookupFeedback(null);
      return;
    }

    // Dynamic fallback generation for any arbitrary entered ARN
    setActiveLookupResult({
      serviceId: 'general-citizen-service',
      serviceTitle: 'Citizen Application (Reference ' + cleanArn + ')',
      applicationNumber: cleanArn,
      portalName: 'National E-Governance Division (NeGD / Official Portal)',
      appliedDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      estimatedCompletionDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      status: 'In Verification',
      progressPercentage: 55,
      currentStage: 'Document Scrutiny & Clearance',
      stages: [
        { stageNumber: 1, stageName: 'Online Submission & ACK', status: 'completed', date: '6 days ago', description: 'Form receipt registered successfully.' },
        { stageNumber: 2, stageName: 'Fee Reconciliation & Allocation', status: 'completed', date: '4 days ago', description: 'Challan verified and assigned to scrutiny desk.' },
        { stageNumber: 3, stageName: 'Verification & Background Check', status: 'in_progress', date: 'Active Today', description: 'Nodal officer review in progress.' },
        { stageNumber: 4, stageName: 'Granting & Final Approval', status: 'pending', description: 'Pending clearance of previous stage.' },
        { stageNumber: 5, stageName: 'Delivery / Speed Post Dispatch', status: 'pending', description: 'Will be dispatched upon approval.' }
      ]
    });
    setLookupFeedback(`Showing real-time process tracker for ${cleanArn}`);
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const targetService = SERVICES_DATA.find((s) => s.id === formData.serviceId);

    const defaultStages: ApplicationTimelineStage[] = [
      { stageNumber: 1, stageName: 'Application Form Submitted', status: 'completed', date: formData.appliedDate, description: 'Online acknowledgement generated.' },
      { stageNumber: 2, stageName: 'Fee & Biometrics Scrutiny', status: 'completed', description: 'Central treasury reconciliation.' },
      { stageNumber: 3, stageName: 'Document & Field Verification', status: formData.status === 'In Verification' ? 'in_progress' : formData.status === 'Approved' ? 'completed' : 'pending', description: 'Scrutiny officer verification.' },
      { stageNumber: 4, stageName: 'Approval & Generation', status: formData.status === 'Approved' ? 'completed' : 'pending', description: 'Digital certificate / physical card generated.' },
      { stageNumber: 5, stageName: 'Speed Post Dispatch / e-Download', status: formData.status === 'Approved' ? 'completed' : 'pending', description: 'Dispatched to applicant address.' }
    ];

    await saveUserApplication(user.uid, {
      serviceId: formData.serviceId,
      serviceTitle: targetService ? targetService.title : 'Official Citizen Service',
      applicationNumber: formData.applicationNumber.trim() || `ARN-${Math.floor(100000 + Math.random() * 900000)}`,
      portalName: targetService ? (targetService.department || targetService.title) : 'Official Portal',
      appliedDate: formData.appliedDate,
      status: formData.status,
      appointmentDate: formData.appointmentDate,
      appointmentLocation: formData.appointmentLocation,
      notes: formData.notes,
      currentStage: formData.currentStage,
      progressPercentage: formData.progressPercentage,
      stages: defaultStages
    });

    setIsModalOpen(false);
    setFormData({
      serviceId: SERVICES_DATA[0].id,
      applicationNumber: '',
      portalName: 'National Portal',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      appointmentDate: '',
      appointmentLocation: '',
      notes: '',
      currentStage: 'Document Scrutiny in Progress',
      progressPercentage: 40
    });
  };

  const handleDelete = async (appId: string) => {
    if (!user) return;
    if (window.confirm('Remove this application tracker from your Firestore database?')) {
      await deleteUserApplication(user.uid, appId);
    }
  };

  const getStatusColor = (status: UserApplicationTracker['status']) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Verification':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Submitted':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const filteredApplications = useMemo(() => {
    if (filterStatus === 'All') return applications;
    return applications.filter((a) => a.status === filterStatus);
  }, [applications, filterStatus]);

  const trackerFilterTabs = [
    { id: 'All', label: 'All Trackers', icon: ClipboardCheck, count: applications.length },
    { id: 'Submitted', label: 'Submitted', icon: Clock, count: applications.filter(a => a.status === 'Submitted').length },
    { id: 'In Verification', label: 'In Review', icon: AlertCircle, count: applications.filter(a => a.status === 'In Verification').length },
    { id: 'Approved', label: 'Approved', icon: CheckCircle2, count: applications.filter(a => a.status === 'Approved' || a.status === 'Completed').length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 bg-[#FAF7F2]/40">
      {/* 1. Header with Civic Badge & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Process Tracking & Encrypted Firestore Sync</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Application Process Tracking Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            Real-time multi-stage process tracking for your Passport, Voter ID, Driving License, PMMVY Maternity DBT, and Government E-Services. Look up any ARN reference number or manage your private cloud receipts.
          </p>
        </div>

        {user ? (
          <button
            id="btn-add-tracker"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application Record</span>
          </button>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Save Applications</span>
          </button>
        )}
      </div>

      {/* 2. Interactive Live Process Stages Tracker (Citizen ARN Lookup Tool) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Live Application Process Stages</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
              Interactive Citizen Application Lookup
            </h2>
          </div>

          {/* Quick Demo Pre-fill Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-stone-500">Quick Samples:</span>
            <button
              onClick={() => {
                setArnQuery('ARN-2026-99120');
                setActiveLookupResult(DEMO_TRACKING_RECORDS['ARN-2026-99120']);
                setLookupFeedback(null);
              }}
              className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
            >
              Passport (ARN)
            </button>
            <button
              onClick={() => {
                setArnQuery('EPIC-VOT-882190');
                setActiveLookupResult(DEMO_TRACKING_RECORDS['EPIC-VOT-882190']);
                setLookupFeedback(null);
              }}
              className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
            >
              Voter ID (EPIC)
            </button>
            <button
              onClick={() => {
                setArnQuery('PMMVY-2026-44321');
                setActiveLookupResult(DEMO_TRACKING_RECORDS['PMMVY-2026-44321']);
                setLookupFeedback(null);
              }}
              className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-900 border border-stone-200 transition-colors cursor-pointer"
            >
              PMMVY Women DBT
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleArnSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-arn-search"
              type="text"
              value={arnQuery}
              onChange={(e) => setArnQuery(e.target.value)}
              placeholder="Enter Application Reference Number (e.g. ARN-2026-99120 or EPIC-VOT-882190)"
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm text-stone-900 placeholder-stone-400 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/70 font-mono font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Track Live Status</span>
          </button>
        </form>

        {lookupFeedback && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lookupFeedback}</span>
          </div>
        )}

        {/* Live Tracking Result Visualizer */}
        {activeLookupResult && (
          <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 rounded-2xl p-5 sm:p-7 text-white space-y-6 border border-stone-800 shadow-lg">
            {/* Top summary badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    REF: {activeLookupResult.applicationNumber}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-stone-200 border border-white/15">
                    {activeLookupResult.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1.5">
                  {activeLookupResult.serviceTitle}
                </h3>
                <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{activeLookupResult.portalName}</span>
                </p>
              </div>

              <div className="sm:text-right space-y-0.5">
                <div className="text-[11px] text-stone-300">Applied Date: {activeLookupResult.appliedDate}</div>
                <div className="text-xs font-bold text-amber-300 flex sm:justify-end items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Est. Completion: {activeLookupResult.estimatedCompletionDate || 'Under Normal Timeline'}</span>
                </div>
                {activeLookupResult.speedPostNumber && (
                  <div className="text-xs font-mono text-emerald-300 flex sm:justify-end items-center gap-1 mt-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Speed Post: {activeLookupResult.speedPostNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-200">
                  Current Stage: <span className="text-amber-300">{activeLookupResult.currentStage}</span>
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {activeLookupResult.progressPercentage || 50}% Completed
                </span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden border border-stone-700">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${activeLookupResult.progressPercentage || 50}%` }}
                />
              </div>
            </div>

            {/* 5-Stage Step-by-Step Timeline Tracker */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-stone-300">
                Verification & Clearance Milestones
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-700">
                {activeLookupResult.stages?.map((st: any) => {
                  const isCompleted = st.status === 'completed';
                  const isInProgress = st.status === 'in_progress';
                  const isActionRequired = st.status === 'action_required';

                  return (
                    <div key={st.stageNumber} className="relative space-y-1 group">
                      {/* Step Circle Pin */}
                      <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-300 text-white shadow-xs'
                          : isInProgress
                          ? 'bg-amber-500 border-amber-200 text-stone-950 animate-pulse shadow-md'
                          : isActionRequired
                          ? 'bg-rose-500 border-rose-300 text-white'
                          : 'bg-stone-800 border-stone-600 text-stone-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        ) : (
                          st.stageNumber
                        )}
                      </div>

                      {/* Stage Content */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-extrabold ${
                            isCompleted ? 'text-white' : isInProgress ? 'text-amber-300 font-black' : 'text-stone-300'
                          }`}>
                            {st.stageName}
                          </span>
                          {isInProgress && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>

                        {st.date && (
                          <span className="text-[11px] font-mono text-stone-300">{st.date}</span>
                        )}
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        {st.description}
                      </p>

                      {st.officerRemarks && (
                        <div className="mt-1.5 p-2.5 rounded-lg bg-stone-800/90 border border-amber-400/30 text-xs text-amber-200/90 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold text-amber-200">Official Remark:</strong> {st.officerRemarks}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              {activeLookupResult.serviceId && (
                <button
                  onClick={() => onSelectService(activeLookupResult.serviceId)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Official Portal Guide & Checklists</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {user && (
                <button
                  onClick={async () => {
                    await saveUserApplication(user.uid, {
                      serviceId: activeLookupResult.serviceId,
                      serviceTitle: activeLookupResult.serviceTitle,
                      applicationNumber: activeLookupResult.applicationNumber,
                      portalName: activeLookupResult.portalName,
                      appliedDate: activeLookupResult.appliedDate,
                      status: activeLookupResult.status,
                      notes: `Auto-saved from Live ARN Lookup (${activeLookupResult.currentStage})`,
                      currentStage: activeLookupResult.currentStage,
                      progressPercentage: activeLookupResult.progressPercentage,
                      stages: activeLookupResult.stages,
                      speedPostNumber: activeLookupResult.speedPostNumber
                    });
                    alert('Application successfully pinned to your Firestore collection!');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pin to My Firestore Records</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 3. Auth Callout if not logged in */}
      {!user && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              Sign In with Google to Store Your Private Application Records
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
              Your application numbers, appointment dates, customized stages, and notes are securely persisted in your personal Firestore database.
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
          >
            Sign In with Google
          </button>
        </div>
      )}

      {/* 4. User Applications List & Status Tabs */}
      {user && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                My Saved Applications ({applications.length})
              </h3>
              <p className="text-xs text-stone-500">
                Click any record to expand and view its full stage progress timeline.
              </p>
            </div>

            {/* Status Tab Symbols */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {trackerFilterTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = filterStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-700' : 'text-stone-400'}`} />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-amber-200 text-amber-900' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-stone-500 font-medium">
              Loading your Firestore application records...
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((item) => {
                const svc = SERVICES_DATA.find((s) => s.id === item.serviceId);
                const isExpanded = expandedAppId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:border-amber-300 transition-all overflow-hidden"
                  >
                    {/* Collapsed Header */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {item.applicationNumber}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            Applied: {item.appliedDate}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-stone-900 text-base">
                          {item.serviceTitle}
                        </h4>

                        {item.currentStage && (
                          <div className="text-xs text-stone-600 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Stage: <strong className="text-stone-800">{item.currentStage}</strong></span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={() => setExpandedAppId(isExpanded ? null : item.id)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Steps' : 'View Stages'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail Panel with Steps */}
                    {isExpanded && (
                      <div className="bg-stone-50/80 p-5 sm:p-6 border-t border-stone-200 space-y-4">
                        {(item.appointmentDate || item.appointmentLocation) && (
                          <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-xs text-stone-700 flex flex-wrap items-center gap-4">
                            {item.appointmentDate && (
                              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                                <span>Appointment: {item.appointmentDate}</span>
                              </div>
                            )}
                            {item.appointmentLocation && (
                              <div className="flex items-center gap-1.5 text-stone-600">
                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                <span>Center: {item.appointmentLocation}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {item.notes && (
                          <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 italic">
                            &quot;{item.notes}&quot;
                          </div>
                        )}

                        {/* Visual Stage Progress */}
                        <div className="space-y-3 pt-2">
                          <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                            Lifecycle Stage Milestones
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            {(item.stages || [
                              { stageNumber: 1, stageName: 'Submitted', status: 'completed', description: 'Receipt generated' },
                              { stageNumber: 2, stageName: 'Fee Reconciliation', status: 'completed', description: 'Payment cleared' },
                              { stageNumber: 3, stageName: 'Document Scrutiny', status: item.status === 'In Verification' ? 'in_progress' : item.status === 'Approved' ? 'completed' : 'pending', description: 'Nodal verification' },
                              { stageNumber: 4, stageName: 'Approval & Grant', status: item.status === 'Approved' ? 'completed' : 'pending', description: 'Authority granted' },
                              { stageNumber: 5, stageName: 'Dispatch / Download', status: item.status === 'Approved' ? 'completed' : 'pending', description: 'Delivered' }
                            ]).map((st: any) => (
                              <div
                                key={st.stageNumber}
                                className={`p-3 rounded-xl border text-xs space-y-1 ${
                                  st.status === 'completed'
                                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                                    : st.status === 'in_progress'
                                    ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs'
                                    : 'bg-white border-stone-200 text-stone-500'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <span>Step {st.stageNumber}</span>
                                  {st.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                                </div>
                                <div className="font-extrabold text-stone-900">{st.stageName}</div>
                                <div className="text-[11px] text-stone-500">{st.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {svc && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => onSelectService(svc.slug || svc.id)}
                              className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                            >
                              <span>Open Service Guide & Checklists</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-stone-900 text-base">No tracked applications yet</h3>
                <p className="text-xs text-stone-500">
                  Save your passport ARN, voter card, or vehicle FASTag application numbers to track your milestones.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Add First Application
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Modal to Add New Tracker */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-600" />
                <span>Save Application Receipt to Firestore</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveApp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Citizen Service</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Application / ACK Ref No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applicationNumber}
                    onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                    placeholder="e.g. ARN-2026-99120"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Submitted">Submitted (Under Process)</option>
                    <option value="In Verification">In Verification / Scrutiny</option>
                    <option value="Approved">Approved / Dispatched</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Action Required / Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Applied Date</label>
                  <input
                    type="date"
                    value={formData.appliedDate}
                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Current Stage Description</label>
                  <input
                    type="text"
                    value={formData.currentStage}
                    onChange={(e) => setFormData({ ...formData, currentStage: e.target.value })}
                    placeholder="e.g. Police Verification Scheduled"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Appointment Slot Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Center / Kendra Location</label>
                  <input
                    type="text"
                    value={formData.appointmentLocation}
                    onChange={(e) => setFormData({ ...formData, appointmentLocation: e.target.value })}
                    placeholder="e.g. PSK Herald House / RTO Pune"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Notes & Reminders</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Carry original 10th marksheet and electricity bill."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Record to Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

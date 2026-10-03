import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  Phone, 
  MapPin, 
  Sparkles, 
  QrCode, 
  Share2, 
  Check, 
  Building2 
} from 'lucide-react';
import { WomenBusCardApplication } from '../types';
import { DigitalCardQRCode } from './DigitalCardQRCode';
import { useLanguage } from '../context/LanguageContext';

interface DigitalWomenBusCardProps {
  card: WomenBusCardApplication;
  onRenew?: (cardId: string) => void;
  onClose?: () => void;
  isRenewing?: boolean;
}

export const DigitalWomenBusCard: React.FC<DigitalWomenBusCardProps> = ({
  card,
  onRenew,
  onClose,
  isRenewing = false
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    if (card.cardId || card.id) {
      navigator.clipboard.writeText(card.cardId || card.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isExpired = card.status === 'Expired';
  const isApproved = card.status === 'Approved';
  const isPending = card.status === 'Pending';
  const isRejected = card.status === 'Rejected';

  const verificationUrl = card.qrPayload || 
    `https://transport.maharashtra.gov.in/verify?card=${card.cardId || card.id}&name=${encodeURIComponent(card.fullName)}&status=${card.status}`;

  return (
    <div className="space-y-4">
      {/* Print-specific style tag */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-digital-bus-card, #printable-digital-bus-card * {
            visibility: visible;
          }
          #printable-digital-bus-card {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-stone-100 border border-stone-200">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            isApproved 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : isPending
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : isExpired
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-stone-200 text-stone-700'
          }`}>
            {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {isPending && <Clock className="w-3.5 h-3.5 text-amber-600" />}
            {isExpired && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
            {isRejected && <XCircle className="w-3.5 h-3.5 text-red-600" />}
            {card.status === 'Approved' ? t.wbcStatusApproved :
             card.status === 'Pending' ? t.wbcStatusPending :
             card.status === 'Expired' ? t.wbcStatusExpired : t.wbcStatusRejected}
          </span>
          <span className="text-xs text-stone-600 font-mono font-medium">
            Ref: {card.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-700 cursor-pointer transition-colors shadow-2xs"
            title="Copy Card ID"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? 'Copied!' : 'Copy ID'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.wbcDownloadBtn}</span>
          </button>

          {isExpired && onRenew && (
            <button
              type="button"
              onClick={() => onRenew(card.id)}
              disabled={isRenewing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? 'animate-spin' : ''}`} />
              <span>{isRenewing ? 'Renewing...' : t.wbcRenewBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Digital Card Container */}
      <div
        id="printable-digital-bus-card"
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-stone-900 to-stone-950 text-white border-2 border-amber-500/60 shadow-2xl p-5 sm:p-6 select-none max-w-xl mx-auto"
      >
        {/* Hologram security pattern strip */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400 opacity-90" />

        {/* Subtle Watermark MSRTC Seal */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <div className="w-56 h-56 rounded-full border-8 border-amber-400 flex items-center justify-center font-black text-6xl tracking-widest text-amber-200">
            MSRTC
          </div>
        </div>

        {/* Card Header: MSRTC & Govt Emblem */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Maharashtra Transport Emblem Badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 flex items-center justify-center text-white shadow-lg border border-amber-300/40 shrink-0">
              <span className="font-extrabold text-sm tracking-tighter">एस.टी.</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-extrabold">
                  Government of Maharashtra • MSRTC
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>{language === 'mr' ? 'महिला बस सवलत स्मार्ट कार्ड' : 'Maharashtra Women Bus Smart Pass'}</span>
              </h3>
              <p className="text-[11px] text-amber-200/90 font-medium -mt-0.5">
                {card.concessionType}
              </p>
            </div>
          </div>

          {/* Smart Chip graphic & Contactless Logo */}
          <div className="flex flex-col items-end">
            <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-500 border border-amber-600 shadow-inner flex items-center justify-center p-0.5 opacity-90">
              <div className="w-full h-full border border-amber-700/60 rounded-xs grid grid-cols-2 grid-rows-2 gap-0.5">
                <div className="border-r border-b border-amber-700/40"></div>
                <div className="border-b border-amber-700/40"></div>
                <div className="border-r border-amber-700/40"></div>
                <div></div>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-stone-400 mt-1 font-mono">NFC PASS</span>
          </div>
        </div>

        {/* Main Card Body */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Photo & Hologram Stamp */}
          <div className="sm:col-span-4 flex flex-col items-center sm:items-start">
            <div className="relative">
              <img
                src={card.photographUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                alt={card.fullName}
                className="w-24 h-28 sm:w-26 sm:h-32 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md bg-stone-800"
              />
              {/* Holographic Verified Stamp */}
              {isApproved && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-full p-1 border-2 border-white shadow-md flex items-center justify-center" title="MSRTC Verified Passenger">
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                </div>
              )}
            </div>
            <div className="mt-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                ID Type: {card.idProofType}
              </span>
              <span className="text-[11px] font-mono text-stone-300">
                {card.idProofNumber}
              </span>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="sm:col-span-5 space-y-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                Passenger Full Name
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
                {card.fullName}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">DOB / Age</span>
                <span className="font-semibold text-stone-200">{card.dateOfBirth} ({card.age || '—'} Yrs)</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Mobile No.</span>
                <span className="font-semibold text-stone-200 font-mono">{card.mobileNumber}</span>
              </div>
            </div>

            <div>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block">District & Depot</span>
              <div className="flex items-center gap-1 text-xs text-amber-200 font-medium">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{card.address.district} • {card.depotOffice || 'Central Depot'}</span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-1 border-t border-stone-800 flex items-center gap-1.5 text-[11px] text-stone-300">
              <Phone className="w-3 h-3 text-rose-400 shrink-0" />
              <span>SOS: {card.emergencyContact.name} ({card.emergencyContact.relationship}) - <span className="font-mono">{card.emergencyContact.phoneNumber}</span></span>
            </div>
          </div>

          {/* QR Code & Validity */}
          <div className="sm:col-span-3 flex flex-col items-center justify-center p-2 rounded-2xl bg-black/40 border border-stone-800 text-center">
            <DigitalCardQRCode value={verificationUrl} size={92} />
            <span className="text-[9px] font-mono text-amber-300/80 mt-1">Scan to Verify</span>
            <div className="mt-1 pt-1 border-t border-stone-800 w-full text-center">
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Valid Thru</span>
              <span className={`text-xs font-black font-mono ${isExpired ? 'text-rose-400' : 'text-emerald-400'}`}>
                {card.validUntil || 'Under Review'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Official MSRTC Card Number */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Card ID:</span>
            <span className="font-mono font-black text-amber-300 text-sm tracking-widest bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {card.cardId || `APP-${card.id}`}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-stone-400">
            <span>Issue: {card.validFrom || card.appliedDate}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">50% Fare Concession</span>
          </div>
        </div>
      </div>

      {/* Instructions footer */}
      <div className="no-print p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-amber-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Official Concession Instructions for Bus Conductors & Passengers:</span>
        </p>
        <p className="text-stone-700 leading-relaxed">
          Show this digital card or printed physical pass to the MSRTC bus conductor when purchasing your ticket. The QR code can be scanned by conductor ETM (Electronic Ticketing Machines) or handheld mobile scanners for instant verification. Valid across all Ordinary, Semi-Luxury (Asiad), and Shivshahi buses.
        </p>
      </div>
    </div>
  );
};

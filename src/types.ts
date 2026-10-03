export type ServiceCategory =
  | 'All'
  | 'Government'
  | 'Banking'
  | 'Education'
  | 'Health'
  | 'Utilities'
  | 'Travel'
  | 'Vehicle Services'
  | 'Women Welfare';

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ApplicationTimelineStage {
  stageNumber: number;
  stageName: string;
  status: 'completed' | 'in_progress' | 'pending' | 'action_required';
  date?: string;
  description: string;
  officerRemarks?: string;
}

export interface EService {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  state: string; // e.g., "All India", "Maharashtra", "Tamil Nadu", "Delhi", etc.
  shortDescription: string;
  overview: string;
  eligibility: string[];
  documents: string[];
  fees: string;
  steps: string[];
  processingTime: string;
  officialUrl: string;
  officialAppName?: string;
  isPopular?: boolean;
  isVehicleService?: boolean;
  isWomenService?: boolean;
  iconName: string;
  faqs: ServiceFAQ[];
  department?: string;
  timelineStages?: string[];
}

export interface VehicleSummary {
  vehicleNumber: string;
  ownerName: string;
  model: string;
  registrationDate: string;
  rcStatus: 'Active' | 'Expired' | 'Suspended';
  rcValidity: string;
  insuranceValidity: string;
  insuranceProvider: string;
  pucValidity: string;
  pucStatus: 'Valid' | 'Expiring Soon' | 'Expired';
  fastagTagId: string;
  fastagStatus: 'Active' | 'Low Balance' | 'Blacklisted';
  fastagBalance: number;
  pendingChallans: {
    id: string;
    date: string;
    violation: string;
    amount: number;
    location: string;
    status: 'Pending' | 'Paid';
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  matchedServices?: {
    id: string;
    slug: string;
    title: string;
    category: string;
    shortDescription: string;
    officialUrl: string;
  }[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'Received' | 'In Review';
  userId?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface UserVehicleRecord {
  id: string;
  vehicleNumber: string;
  vehicleType: 'Car' | 'Two-Wheeler' | 'Commercial' | 'Electric';
  nickname?: string;
  ownerName: string;
  model: string;
  registrationDate?: string;
  rcValidity: string;
  insuranceValidity: string;
  insuranceProvider: string;
  pucValidity: string;
  fastagTagId: string;
  fastagBalance: number;
  fastagBank?: string;
  notes?: string;
  updatedAt: string;
}

export interface UserApplicationTracker {
  id: string;
  serviceId: string;
  serviceTitle: string;
  applicationNumber: string;
  portalName: string;
  appliedDate: string;
  status: 'Draft' | 'Submitted' | 'In Verification' | 'Approved' | 'Completed' | 'Rejected';
  appointmentDate?: string;
  appointmentLocation?: string;
  notes?: string;
  currentStage?: string;
  progressPercentage?: number; // 0 to 100
  stages?: ApplicationTimelineStage[];
  speedPostNumber?: string;
  estimatedCompletionDate?: string;
  updatedAt: string;
}

export interface UserChecklistState {
  serviceId: string;
  checkedDocs: string[];
  updatedAt: string;
}

export interface UserActivityItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategory;
  shortDescription?: string;
  department?: string;
  officialUrl?: string;
  accessedAt: string; // ISO 8601 string
  actionType?: 'view_details' | 'recharge' | 'challan_check' | 'scheme_apply' | 'guide_open';
}

// ----------------- WOMEN BUS CARD MODULE TYPES -----------------
export type WomenBusCardStatus = 'Pending' | 'Approved' | 'Rejected' | 'Expired';

export type WomenConcessionType = 
  | 'Mahila Samman (50% Concession)' 
  | 'Amrit Jyeshtha Nagrik (100% Free - 75+ Yrs)' 
  | 'Working Women Smart Pass' 
  | 'Girl Student Special Concession';

export interface WomenBusCardApplication {
  id: string; // Unique app reference e.g., "WBC-2025-93821"
  cardId?: string; // Generated MSRTC Card ID e.g., "MSRTC-WBC-MH-74921"
  fullName: string;
  dateOfBirth: string;
  age: number;
  mobileNumber: string;
  email?: string;
  address: {
    street: string;
    cityOrTaluka: string;
    district: string;
    pincode: string;
    state: string; // e.g., "Maharashtra"
  };
  idProofType: 'Aadhaar Card' | 'Voter ID' | 'PAN Card' | 'Ration Card';
  idProofNumber: string; // Masked or verified number
  photographUrl: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  concessionType: WomenConcessionType;
  status: WomenBusCardStatus;
  appliedDate: string;
  verifiedDate?: string;
  validFrom?: string;
  validUntil?: string;
  rejectionReason?: string;
  depotOffice?: string;
  userId?: string;
  qrPayload?: string;
  updatedAt: string;
}

// ----------------- VEHICLE INFORMATION SEARCH TYPES -----------------
export interface VehiclePublicInfo {
  registrationNumber: string; // e.g. "MH 12 AB 1234"
  rtoCode: string; // e.g. "MH-12"
  rtoName: string; // e.g. "Pune RTO (Central Maharashtra)"
  rtoDivision: string; // e.g. "Pune Region"
  vehicleType: string; // e.g. "Motor Car (LMV - Private)"
  vehicleCategory: 'LMV' | 'Two-Wheeler' | 'Commercial' | 'Electric' | 'Heavy';
  make: string; // e.g. "Tata Motors Ltd"
  model: string; // e.g. "Nexon EV Max XZ+ Lux"
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid' | 'LPG';
  registrationDate: string; // e.g. "14-Aug-2022"
  registrationValidity: string; // e.g. "13-Aug-2037 (Valid for 15 Yrs)"
  fitnessStatus: 'Active & Fit' | 'Fitness Valid' | 'Expired' | 'Renewal Pending';
  fitnessValidUntil: string;
  permitStatus: string;
  permitValidUntil?: string;
  insuranceStatus: 'Active & Insured' | 'Expiring Soon' | 'Expired';
  insuranceProvider: string;
  insurancePolicyNumber: string; // Masked e.g. "POL-MH-***8921"
  insuranceValidUntil: string;
  pucStatus: 'Valid & Certified' | 'Expiring Soon' | 'Expired';
  pucCertificateNumber: string;
  pucValidUntil: string;
  pucEmissionLevel: string; // e.g. "CO: 0.08% | HC: 92 ppm (BS-VI Passed)"
  color: string;
  cubicCapacity?: string; // e.g. "1199 cc"
  seatingCapacity: number;
  emissionNorms: string; // e.g. "BHARAT STAGE VI (BS-VI OBD-II)"
  chassisNumberMasked: string; // e.g. "MA3EFABC9***9412"
  engineNumberMasked: string; // e.g. "K15BN***8204"
  taxStatus: 'Life Time Tax Paid (LTT)' | 'Annual Road Tax Up-to-date';
  blacklistedStatus: 'Clear / No Blacklist Flag';
  isCommercial: boolean;
}



export type Language = 'en' | 'mr' | 'hi';

export interface TranslationDictionary {
  // Brand & Portal
  portalTitle: string;
  portalSubtitle: string;
  portalTagline: string;
  govBadge: string;
  allIndiaDirectory: string;
  helplineFastag: string;
  helplineEmergency: string;
  helplineWomen: string;

  // Nav Items
  navHome: string;
  navServices: string;
  navWomenWelfare: string;
  navWomenBusCard: string;
  navVehicleHub: string;
  navVehicleSearch: string;
  navMyTracker: string;
  navRecentActivity: string;
  navAbout: string;
  navContact: string;

  // Language Dropdown
  langSwitchLabel: string;
  langEnglish: string;
  langMarathi: string;
  langHindi: string;

  // Search & Actions
  searchPlaceholder: string;
  browseCatalog: string;
  allCategories: string;
  quickAccess: string;
  resetFilters: string;
  showingResults: string;
  noServicesFound: string;

  // The 3 Cards Section
  prioritySectionTag: string;
  prioritySectionTitle: string;
  prioritySectionSubtitle: string;
  includedServicesLabel: string;
  viewDetailsBtn: string;

  // Card 1: FASTag
  card1Title: string;
  card1Desc: string;
  card1Opt1: string;
  card1Opt2: string;
  card1Opt3: string;
  card1Opt4: string;
  card1Category: string;

  // Card 2: e-Challan
  card2Title: string;
  card2Desc: string;
  card2Opt1: string;
  card2Opt2: string;
  card2Opt3: string;
  card2Badge: string;
  card2Category: string;

  // Card 3: Women Welfare
  card3Title: string;
  card3Desc: string;
  card3Opt1: string;
  card3Opt2: string;
  card3Opt3: string;
  card3Opt4: string;
  card3Category: string;

  // Women Bus Card Module
  wbcTitle: string;
  wbcSubtitle: string;
  wbcBadge: string;
  wbcApplyBtn: string;
  wbcTrackBtn: string;
  wbcViewCardBtn: string;
  wbcRenewBtn: string;
  wbcDownloadBtn: string;
  wbcStatusPending: string;
  wbcStatusApproved: string;
  wbcStatusRejected: string;
  wbcStatusExpired: string;
  wbcFullNameLabel: string;
  wbcDobLabel: string;
  wbcMobileLabel: string;
  wbcAddressLabel: string;
  wbcIdProofLabel: string;
  wbcIdNumberLabel: string;
  wbcPhotoLabel: string;
  wbcEmergencyContactLabel: string;
  wbcEmergencyPhoneLabel: string;
  wbcConcessionTypeLabel: string;
  wbcSchemeName: string;
  wbcSchemeDesc: string;

  // Vehicle Information Search Module
  vehSearchTitle: string;
  vehSearchSubtitle: string;
  vehSearchPlaceholder: string;
  vehSearchBtn: string;
  vehRegNumber: string;
  vehType: string;
  vehMakeModel: string;
  vehFuelType: string;
  vehRegDate: string;
  vehRegValidity: string;
  vehFitnessStatus: string;
  vehPermitStatus: string;
  vehInsuranceStatus: string;
  vehPucStatus: string;
  vehRtoOffice: string;
  vehEmissionNorms: string;
  vehPrivacyNotice: string;
  vehDisclaimer: string;

  // Portal Highlights & Trust
  stat1Title: string;
  stat1Desc: string;
  stat2Title: string;
  stat2Desc: string;
  stat3Title: string;
  stat3Desc: string;
  stat4Title: string;
  stat4Desc: string;

  // Database Dialog / Profile
  citizenDbTitle: string;
  citizenDbDesc: string;
  dbSavedVehicles: string;
  dbSavedApps: string;
  dbSavedBookmarks: string;
  dbSyncStatus: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    portalTitle: 'E-Services',
    portalSubtitle: 'Govt. of Maharashtra & National Citizen Portal',
    portalTagline: 'Official citizen information gateway for Maharashtra State Road Transport (MSRTC), RTO vehicle services, women bus concessions, and verified government portals.',
    govBadge: 'Govt. of Maharashtra Transport & Citizen Portal Guide',
    allIndiaDirectory: 'Maharashtra & All India Transport Portal',
    helplineFastag: 'FASTag Helpline: 1033',
    helplineEmergency: 'Emergency: 112',
    helplineWomen: 'Women Helpline: 181 / 1091',

    navHome: 'Home',
    navServices: 'Services',
    navWomenWelfare: 'Women Welfare',
    navWomenBusCard: 'Maha.Bus Women Card',
    navVehicleHub: 'Vehicle Hub',
    navVehicleSearch: 'Vehicle Information',
    navMyTracker: 'My Tracker',
    navRecentActivity: 'Recent Activity',
    navAbout: 'About',
    navContact: 'Contact',

    langSwitchLabel: 'Language',
    langEnglish: 'English',
    langMarathi: 'मराठी (Marathi)',
    langHindi: 'हिन्दी (Hindi)',

    searchPlaceholder: 'Search Women Bus Card, Vehicle Info, FASTag, e-Challan, DL...',
    browseCatalog: 'Browse Catalog',
    allCategories: 'All Categories',
    quickAccess: 'Quick access:',
    resetFilters: 'Reset Filters',
    showingResults: 'Showing',
    noServicesFound: 'No services found',

    prioritySectionTag: 'Priority Maharashtra Transport Services',
    prioritySectionTitle: 'Key Transport & Citizen Services',
    prioritySectionSubtitle: 'Dedicated online portals for MSRTC Women Bus Concession Cards, official Maharashtra RTO vehicle information lookup, FASTag recharge, and e-Challan compliance.',
    includedServicesLabel: 'Included Services & Options',
    viewDetailsBtn: 'View Details & Guide',

    card1Title: 'FASTag – Recharge, Balance & Status',
    card1Desc: 'Recharge your FASTag instantly and check your live wallet balance, active/blacklist status and recent toll transactions across Maharashtra toll expressways.',
    card1Opt1: 'FASTag Recharge',
    card1Opt2: 'FASTag Balance Check',
    card1Opt3: 'Active/Blacklist Status',
    card1Opt4: 'Toll Transaction History',
    card1Category: 'Vehicle Services | Maharashtra & All India',

    card2Title: 'e-Challan – Traffic Violations & Fines',
    card2Desc: 'Check traffic challans across Maharashtra State Traffic Police & Mumbai Police, view violation evidence and pay fines securely.',
    card2Opt1: 'Check Challan',
    card2Opt2: 'View Violation Details',
    card2Opt3: 'Pay Traffic Fine',
    card2Badge: 'Maharashtra Police & MoRTH Parivahan Integrated',
    card2Category: 'Vehicle Services | Maharashtra',

    card3Title: 'Women Bus Card – Mahila Samman Scheme',
    card3Desc: 'Apply for the official Maharashtra Women Bus Card under the Mahila Samman Yojana for 50% concession or free travel on MSRTC buses.',
    card3Opt1: 'Apply for Bus Card',
    card3Opt2: 'Track Application Status',
    card3Opt3: 'Download Digital Card',
    card3Opt4: 'Card Renewal & Verification',
    card3Category: 'MSRTC Transport | Maharashtra',

    // Women Bus Card Module
    wbcTitle: 'Maha.Bus Women Card (महा.बस महिला कार्ड)',
    wbcSubtitle: 'MSRTC Mahila Samman Yojana 50% Concession & Free Travel Digital Pass',
    wbcBadge: 'MSRTC Official Citizen Scheme • 50% Concession Across Maharashtra',
    wbcApplyBtn: 'Apply for Maha.Bus Women Card',
    wbcTrackBtn: 'Check Status',
    wbcViewCardBtn: 'View Digital Card',
    wbcRenewBtn: 'Renew Card',
    wbcDownloadBtn: 'Download / Print Card',
    wbcStatusPending: 'Pending Verification',
    wbcStatusApproved: 'Approved & Active',
    wbcStatusRejected: 'Rejected',
    wbcStatusExpired: 'Expired (Renewal Due)',
    wbcFullNameLabel: 'Full Name (as per Govt ID)',
    wbcDobLabel: 'Date of Birth',
    wbcMobileLabel: 'Mobile Number',
    wbcAddressLabel: 'Maharashtra Residential Address',
    wbcIdProofLabel: 'ID Verification Type',
    wbcIdNumberLabel: 'ID Proof Document Number',
    wbcPhotoLabel: 'Applicant Photograph',
    wbcEmergencyContactLabel: 'Emergency Contact Person & Relation',
    wbcEmergencyPhoneLabel: 'Emergency Contact Phone Number',
    wbcConcessionTypeLabel: 'Concession Category',
    wbcSchemeName: 'MSRTC Mahila Samman Yojana (50% Concession)',
    wbcSchemeDesc: 'Under Government of Maharashtra resolution, all women citizens traveling in ordinary, semi-luxury (Asiad) and Shivshahi buses operated by MSRTC receive 50% fare concession.',

    // Vehicle Information Search Module
    vehSearchTitle: 'Maharashtra Vehicle Information Search (RTO Vahan)',
    vehSearchSubtitle: 'Instant Public Roadworthiness, Fitness, Insurance & PUC Verification for MH Registered Vehicles',
    vehSearchPlaceholder: 'Enter MH Vehicle Number (e.g., MH-12-AB-1234 or MH 02 CD 5678)',
    vehSearchBtn: 'Search Vehicle',
    vehRegNumber: 'Registration Number',
    vehType: 'Vehicle Type',
    vehMakeModel: 'Make & Model',
    vehFuelType: 'Fuel Type',
    vehRegDate: 'Registration Date',
    vehRegValidity: 'Registration Validity',
    vehFitnessStatus: 'Fitness Status',
    vehPermitStatus: 'Permit Status',
    vehInsuranceStatus: 'Insurance Status',
    vehPucStatus: 'PUC (Pollution) Status',
    vehRtoOffice: 'Registered RTO Office',
    vehEmissionNorms: 'Emission Standard',
    vehPrivacyNotice: 'RTO Privacy Protection: In strict compliance with MoRTH statutory guidelines, personal owner coordinates, Aadhaar, and home addresses are masked.',
    vehDisclaimer: 'Information retrieved from authorized Maharashtra Motor Vehicles Department & MoRTH Vahan public registers.',

    stat1Title: '20+ Transport Services',
    stat1Desc: 'Maharashtra & All India',
    stat2Title: '50% Bus Concession',
    stat2Desc: 'MSRTC Mahila Samman',
    stat3Title: 'Instant MH RTO Search',
    stat3Desc: 'Fitness, Insurance & PUC',
    stat4Title: 'Digital Smart Card',
    stat4Desc: 'QR Code & Print Ready',

    citizenDbTitle: 'Citizen Cloud Database',
    citizenDbDesc: 'Your saved vehicles, Women Bus Cards, applications, and bookmarks are stored securely in Google Cloud Firebase Firestore.',
    dbSavedVehicles: 'Saved Vehicles',
    dbSavedApps: 'Tracked Applications',
    dbSavedBookmarks: 'Bookmarked Services',
    dbSyncStatus: 'Cloud Synced'
  },

  mr: {
    portalTitle: 'E-Services',
    portalSubtitle: 'महाराष्ट्र शासन व राष्ट्रीय नागरिक सेवा पोर्टल',
    portalTagline: 'महाराष्ट्र राज्य मार्ग परिवहन महामंडळ (एस.टी. - MSRTC), आरटीओ वाहन माहिती, महिला बस सवलत कार्ड आणि अधिकृत शासकीय सेवांचे डिजिटल प्रवेशद्वार.',
    govBadge: 'महाराष्ट्र शासन परिवहन महामंडळ • अधिकृत नागरिक माहिती व डिजिटल कार्ड',
    allIndiaDirectory: 'महाराष्ट्र व राष्ट्रीय परिवहन सेवा पोर्टल',
    helplineFastag: 'फास्टॅग हेल्पलाइन: १०३३',
    helplineEmergency: 'आपत्कालीन: ११२',
    helplineWomen: 'महिला हेल्पलाइन: १८१ / १०९१',

    navHome: 'मुख्यपृष्ठ',
    navServices: 'सर्व सेवा',
    navWomenWelfare: 'महिला कल्याण',
    navWomenBusCard: 'महा.बस महिला कार्ड',
    navVehicleHub: 'वाहन केंद्र',
    navVehicleSearch: 'वाहन माहिती (Vehicle Info)',
    navMyTracker: 'माझा ट्रॅकर',
    navRecentActivity: 'अलीकडील सेवा',
    navAbout: 'आमच्याबद्दल',
    navContact: 'संपर्क',

    langSwitchLabel: 'भाषा बदला',
    langEnglish: 'English',
    langMarathi: 'मराठी',
    langHindi: 'हिन्दी',

    searchPlaceholder: 'महिला बस कार्ड, वाहन माहिती, फास्टॅग, ई-चलन, आरटीओ सेवा शोधा...',
    browseCatalog: 'सूची पहा',
    allCategories: 'सर्व श्रेणी',
    quickAccess: 'जलद प्रवेश:',
    resetFilters: 'फिल्टर पूर्ववत करा',
    showingResults: 'दर्शवित आहे',
    noServicesFound: 'कोणतीही सेवा आढळली नाही',

    prioritySectionTag: 'महाराष्ट्र परिवहन प्राधान्य सेवा',
    prioritySectionTitle: 'प्रमुख परिवहन व नागरिक सेवा',
    prioritySectionSubtitle: 'एस.टी. महिला बस सवलत कार्ड, महाराष्ट्र आरटीओ वाहन माहिती पडताळणी, जलद फास्टॅग रिचार्ज आणि ई-चलन ऑनलाइन भरणा.',
    includedServicesLabel: 'उपलब्ध सेवा व पर्याय',
    viewDetailsBtn: 'सविस्तर माहिती पहा',

    card1Title: 'फास्टॅग – रिचार्ज, शिल्लक व स्थिती',
    card1Desc: 'आपला फास्टॅग तात्काळ रिचार्ज करा, शिल्लक तपासा, सक्रियता आणि समृद्धी महामार्ग / राष्ट्रीय महामार्ग टोल व्यवहार पहा.',
    card1Opt1: 'फास्टॅग रिचार्ज',
    card1Opt2: 'शिल्लक रक्कम तपासा',
    card1Opt3: 'सक्रिय/काळ्या यादीतील स्थिती',
    card1Opt4: 'टोल व्यवहार इतिहास',
    card1Category: 'वाहन सेवा | महाराष्ट्र व संपूर्ण भारत',

    card2Title: 'ई-चलन – वाहतूक नियम उल्लंघन व दंड',
    card2Desc: 'महाराष्ट्र वाहतूक पोलीस व मुंबई पोलीस ई-चलन तपासा, उल्लंघनाचा पुरावा पहा आणि ऑनलाइन सुरक्षित दंड भरा.',
    card2Opt1: 'चलन तपासा',
    card2Opt2: 'उल्लंघन तपशील पहा',
    card2Opt3: 'वाहतूक दंड भरा',
    card2Badge: 'महाराष्ट्र पोलीस व परिवहन विभाग एकात्मिक',
    card2Category: 'वाहन सेवा | महाराष्ट्र',

    card3Title: 'महिला बस कार्ड – महिला सन्मान योजना',
    card3Desc: 'महाराष्ट्र शासनाच्या महिला सन्मान योजनेअंतर्गत एस.टी. (MSRTC) बसेसमध्ये ५०% तिकीट सवलतीसाठी डिजिटल कार्ड अर्ज करा.',
    card3Opt1: 'महिला बस कार्डसाठी अर्ज करा',
    card3Opt2: 'अर्जाची स्थिती तपासा',
    card3Opt3: 'डिजिटल कार्ड डाउनलोड करा',
    card3Opt4: 'कार्ड नूतनीकरण व पडताळणी',
    card3Category: 'एस.टी. महामंडळ | महाराष्ट्र शासन',

    // Women Bus Card Module
    wbcTitle: 'महा.बस महिला कार्ड (Maha.Bus Women Card)',
    wbcSubtitle: 'महिला सन्मान योजना ५०% प्रवास सवलत व डिजिटल स्मार्ट पास',
    wbcBadge: 'महाराष्ट्र शासन अधिकृत योजना • सर्व एस.टी. बसेसमध्ये ५०% सवलत',
    wbcApplyBtn: 'महा.बस महिला कार्ड अर्ज करा',
    wbcTrackBtn: 'अर्जाची स्थिती तपासा',
    wbcViewCardBtn: 'डिजिटल कार्ड पहा',
    wbcRenewBtn: 'कार्ड नूतनीकरण करा',
    wbcDownloadBtn: 'कार्ड डाउनलोड / प्रिंट करा',
    wbcStatusPending: 'पडताळणी प्रलंबित (Pending)',
    wbcStatusApproved: 'मंजूर व सक्रिय (Approved)',
    wbcStatusRejected: 'नाकारण्यात आले (Rejected)',
    wbcStatusExpired: 'मुदत संपली (Expired)',
    wbcFullNameLabel: 'पूर्ण नाव (ओळखपत्राप्रमाणे)',
    wbcDobLabel: 'जन्मतारीख',
    wbcMobileLabel: 'मोबाईल क्रमांक',
    wbcAddressLabel: 'महाराष्ट्रातील निवासी पत्ता',
    wbcIdProofLabel: 'ओळख पडताळणी प्रकार',
    wbcIdNumberLabel: 'ओळखपत्र क्रमांक',
    wbcPhotoLabel: 'अर्जदाराचा फोटो',
    wbcEmergencyContactLabel: 'आपत्कालीन संपर्क व्यक्ती व नाते',
    wbcEmergencyPhoneLabel: 'आपत्कालीन फोन नंबर',
    wbcConcessionTypeLabel: 'सवलत वर्गवारी',
    wbcSchemeName: 'एस.टी. महिला सन्मान योजना (५०% सवलत)',
    wbcSchemeDesc: 'महाराष्ट्र शासनाच्या निर्णयानुसार एस.टी. महामंडळाच्या साध्या, निमआराम (आशियाड) व शिवशाही बसेसमध्ये सर्व महिलांना ५०% तिकीट सवलत दिली जाते.',

    // Vehicle Information Search Module
    vehSearchTitle: 'महाराष्ट्र वाहन माहिती शोध (RTO Vahan)',
    vehSearchSubtitle: 'महाराष्ट्र (MH) नोंदणीकृत वाहनांची योग्यता, विमा, पीयूसी व नोंदणी पडताळणी',
    vehSearchPlaceholder: 'MH वाहन क्रमांक प्रविष्ट करा (उदा. MH-12-AB-1234 किंवा MH 02 CD 5678)',
    vehSearchBtn: 'वाहन माहिती शोधा',
    vehRegNumber: 'नोंदणी क्रमांक',
    vehType: 'वाहन प्रकार',
    vehMakeModel: 'कंपनी व मॉडेल',
    vehFuelType: 'इंधन प्रकार',
    vehRegDate: 'नोंदणी तारीख',
    vehRegValidity: 'नोंदणी वैधता',
    vehFitnessStatus: 'फिटनेस (योग्यता) स्थिती',
    vehPermitStatus: 'परमिट स्थिती',
    vehInsuranceStatus: 'विमा स्थिती',
    vehPucStatus: 'पीयूसी (PUC) प्रदूषण स्थिती',
    vehRtoOffice: 'नोंदणीकृत आरटीओ कार्यालय',
    vehEmissionNorms: 'उत्सर्जन निकष',
    vehPrivacyNotice: 'आरटीओ गोपनीयता संरक्षण: MoRTH नियमांनुसार वाहनाच्या मालकाचे वैयक्तिक तपशील, आधार व घराचा पत्ता गोपनीय ठेवण्यात आला आहे.',
    vehDisclaimer: 'ही माहिती अधिकृत महाराष्ट्र मोटार वाहन विभाग व वाहन (Vahan) राष्ट्रीय नोंदवहीवरून घेतली आहे.',

    stat1Title: '२०+ परिवहन सेवा',
    stat1Desc: 'महाराष्ट्र व राष्ट्रीय स्तर',
    stat2Title: '५०% बस सवलत',
    stat2Desc: 'महिला सन्मान योजना',
    stat3Title: 'तात्काळ आरटीओ शोध',
    stat3Desc: 'फिटनेस, विमा व पीयूसी',
    stat4Title: 'डिजिटल स्मार्ट कार्ड',
    stat4Desc: 'क्यूआर कोड व प्रिंट सुलभ',

    citizenDbTitle: 'नागरिक क्लाउड डेटाबेस',
    citizenDbDesc: 'तुमची नोंदणीकृत वाहने, महिला बस कार्डे आणि ट्रॅक केलेले अर्ज गुगल क्लाउड फायरस्टोरमध्ये सुरक्षित साठवले जातात.',
    dbSavedVehicles: 'सहेजेलेली वाहने',
    dbSavedApps: 'ट्रॅक केलेले अर्ज',
    dbSavedBookmarks: 'बुकमार्क सेवा',
    dbSyncStatus: 'क्लाउड सिंक सक्रिय'
  },

  hi: {
    portalTitle: 'E-Services',
    portalSubtitle: 'महाराष्ट्र शासन एवं राष्ट्रीय नागरिक सेवा पोर्टल',
    portalTagline: 'महाराष्ट्र राज्य सड़क परिवहन निगम (MSRTC), आरटीओ वाहन सेवाएं, महिला बस रियायती कार्ड और सत्यापित सरकारी पोर्टलों का आधिकारिक नागरिक प्रवेश द्वार।',
    govBadge: 'महाराष्ट्र शासन परिवहन महामंडल • आधिकारिक जन सूचना एवं डिजिटल कार्ड',
    allIndiaDirectory: 'महाराष्ट्र एवं राष्ट्रीय परिवहन पोर्टल',
    helplineFastag: 'फास्टैग हेल्पलाइन: 1033',
    helplineEmergency: 'आपातकालीन: 112',
    helplineWomen: 'महिला हेल्पलाइन: 181 / 1091',

    navHome: 'होम',
    navServices: 'सेवाएं',
    navWomenWelfare: 'महिला कल्याण',
    navWomenBusCard: 'महा.बस महिला कार्ड',
    navVehicleHub: 'वाहन हब',
    navVehicleSearch: 'वाहन जानकारी (Vehicle Info)',
    navMyTracker: 'मेरा ट्रैकर',
    navRecentActivity: 'हाल की गतिविधियां',
    navAbout: 'हमारे बारे में',
    navContact: 'संपर्क',

    langSwitchLabel: 'भाषा',
    langEnglish: 'English (अंग्रेज़ी)',
    langMarathi: 'मराठी (Marathi)',
    langHindi: 'हिन्दी (Hindi)',

    searchPlaceholder: 'महिला बस कार्ड, वाहन जानकारी, फास्टैग, ई-चालान, आरटीओ खोजें...',
    browseCatalog: 'कैटलॉग देखें',
    allCategories: 'सभी श्रेणियां',
    quickAccess: 'त्वरित पहुंच:',
    resetFilters: 'फ़िल्टर रीसेट करें',
    showingResults: 'प्रदर्शित',
    noServicesFound: 'कोई सेवा नहीं मिली',

    prioritySectionTag: 'प्राथमिक महाराष्ट्र परिवहन जन सेवाएं',
    prioritySectionTitle: 'प्रमुख परिवहन एवं नागरिक सेवाएं',
    prioritySectionSubtitle: 'एमएसआरटीसी महिला बस रियायती कार्ड, महाराष्ट्र आरटीओ वाहन जानकारी सत्यापन, फास्टैग रिचार्ज और ई-चालान अनुपालन।',
    includedServicesLabel: 'शामिल सेवाएं और विकल्प',
    viewDetailsBtn: 'विवरण और गाइड देखें',

    card1Title: 'फास्टैग – रिचार्ज, बैलेंस और स्थिति',
    card1Desc: 'अपने फास्टैग को तुरंत रिचार्ज करें और लाइव वॉलेट बैलेंस, सक्रिय/ब्लैकलिस्ट स्थिति और हाल के टोल लेनदेन की जांच करें।',
    card1Opt1: 'फास्टैग रिचार्ज',
    card1Opt2: 'फास्टैग बैलेंस चेक',
    card1Opt3: 'सक्रिय/ब्लैकलिस्ट स्थिति',
    card1Opt4: 'टोल लेनदेन इतिहास',
    card1Category: 'वाहन सेवाएं | महाराष्ट्र एवं भारत',

    card2Title: 'ई-चालान – यातायात उल्लंघन और जुर्माना',
    card2Desc: 'महाराष्ट्र ट्रैफिक पुलिस और मुंबई पुलिस चालान की जांच करें, उल्लंघन का विवरण देखें और सुरक्षित ऑनलाइन भुगतान करें।',
    card2Opt1: 'चालान जांचें',
    card2Opt2: 'उल्लंघन विवरण देखें',
    card2Opt3: 'ट्रैफिक जुर्माना भरें',
    card2Badge: 'महाराष्ट्र पुलिस एवं परिवहन मंत्रालय एकीकृत',
    card2Category: 'वाहन सेवाएं | महाराष्ट्र',

    card3Title: 'महिला बस कार्ड – महिला सम्मान योजना',
    card3Desc: 'महाराष्ट्र सरकार की महिला सम्मान योजना के तहत एमएसआरटीसी बसों में 50% किराए में छूट और मुफ्त यात्रा हेतु डिजिटल पास बनाएं।',
    card3Opt1: 'बस कार्ड हेतु आवेदन',
    card3Opt2: 'आवेदन स्थिति जांचें',
    card3Opt3: 'डिजिटल कार्ड डाउनलोड',
    card3Opt4: 'कार्ड नवीनीकरण व सत्यापन',
    card3Category: 'एमएसआरटीसी परिवहन | महाराष्ट्र शासन',

    // Women Bus Card Module
    wbcTitle: 'महा.बस महिला कार्ड (Maha.Bus Women Card)',
    wbcSubtitle: 'महिला सम्मान योजना 50% किराया छूट एवं डिजिटल स्मार्ट पास',
    wbcBadge: 'महाराष्ट्र शासन आधिकारिक योजना • एमएसआरटीसी बसों में 50% छूट',
    wbcApplyBtn: 'महा.बस महिला कार्ड के लिए आवेदन करें',
    wbcTrackBtn: 'आवेदन स्थिति जांचें',
    wbcViewCardBtn: 'डिजिटल कार्ड देखें',
    wbcRenewBtn: 'कार्ड नवीनीकरण',
    wbcDownloadBtn: 'कार्ड डाउनलोड / प्रिंट करें',
    wbcStatusPending: 'सत्यापन लंबित (Pending)',
    wbcStatusApproved: 'स्वीकृत एवं सक्रिय (Approved)',
    wbcStatusRejected: 'अस्वीकृत (Rejected)',
    wbcStatusExpired: 'समाप्त (Expired)',
    wbcFullNameLabel: 'पूरा नाम (पहचान पत्र अनुसार)',
    wbcDobLabel: 'जन्म तिथि',
    wbcMobileLabel: 'मोबाइल नंबर',
    wbcAddressLabel: 'महाराष्ट्र आवासीय पता',
    wbcIdProofLabel: 'पहचान सत्यापन प्रकार',
    wbcIdNumberLabel: 'पहचान पत्र संख्या',
    wbcPhotoLabel: 'आवेदिका की फोटो',
    wbcEmergencyContactLabel: 'आपातकालीन संपर्क व्यक्ति व संबंध',
    wbcEmergencyPhoneLabel: 'आपातकालीन फोन नंबर',
    wbcConcessionTypeLabel: 'रियायत श्रेणी',
    wbcSchemeName: 'एमएसआरटीसी महिला सम्मान योजना (50% छूट)',
    wbcSchemeDesc: 'महाराष्ट्र शासन के संकल्प अनुसार एमएसआरटीसी की साधारण, सेमी-लक्जरी (एशियाड) और शिवशाही बसों में सभी महिलाओं को 50% यात्रा छूट दी जाती है।',

    // Vehicle Information Search Module
    vehSearchTitle: 'महाराष्ट्र वाहन जानकारी खोज (RTO Vahan)',
    vehSearchSubtitle: 'महाराष्ट्र (MH) पंजीकृत वाहनों की फिटनेस, बीमा, पीयूसी और पंजीकरण सत्यापन',
    vehSearchPlaceholder: 'MH वाहन नंबर दर्ज करें (उदा. MH-12-AB-1234 या MH 02 CD 5678)',
    vehSearchBtn: 'वाहन खोजें',
    vehRegNumber: 'पंजीकरण संख्या',
    vehType: 'वाहन का प्रकार',
    vehMakeModel: 'कंपनी व मॉडल',
    vehFuelType: 'ईंधन प्रकार',
    vehRegDate: 'पंजीकरण तिथि',
    vehRegValidity: 'पंजीकरण वैधता',
    vehFitnessStatus: 'फिटनेस (योग्यता) स्थिति',
    vehPermitStatus: 'परमिट स्थिति',
    vehInsuranceStatus: 'बीमा स्थिति',
    vehPucStatus: 'पीयूसी (प्रदूषण) स्थिति',
    vehRtoOffice: 'पंजीकृत आरटीओ कार्यालय',
    vehEmissionNorms: 'उत्सर्जन मानक',
    vehPrivacyNotice: 'आरटीओ गोपनीयता सुरक्षा: परिवहन मंत्रालय (MoRTH) के नियमों के अनुसार वाहन स्वामी की व्यक्तिगत जानकारी, आधार व आवासीय पता सार्वजनिक खोज में सुरक्षित/गोपनीय रखा गया है।',
    vehDisclaimer: 'यह जानकारी अधिकृत महाराष्ट्र मोटर वाहन विभाग और राष्ट्रीय वाहन (Vahan) रजिस्टर से सत्यापित है।',

    stat1Title: '20+ परिवहन सेवाएं',
    stat1Desc: 'महाराष्ट्र व राष्ट्रीय स्तर',
    stat2Title: '50% बस छूट',
    stat2Desc: 'महिला सम्मान योजना',
    stat3Title: 'त्वरित आरटीओ खोज',
    stat3Desc: 'फिटनेस, बीमा व पीयूसी',
    stat4Title: 'डिजिटल स्मार्ट कार्ड',
    stat4Desc: 'क्यूआर कोड व प्रिंट समर्थित',

    citizenDbTitle: 'नागरिक क्लाउड डेटाबेस',
    citizenDbDesc: 'आपके वाहन, महिला बस कार्ड, आवेदन ट्रैकर और बुकमार्क गूगल क्लाउड फायरबेस फायरस्टोर में सुरक्षित रूप से संग्रहीत हैं।',
    dbSavedVehicles: 'सहेजे गए वाहन',
    dbSavedApps: 'ट्रैक किए गए आवेदन',
    dbSavedBookmarks: 'बुकमार्क सेवाएं',
    dbSyncStatus: 'क्लाउड सिंक्रनाइज़्ड'
  }
};

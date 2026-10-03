import { EService, VehicleSummary } from '../types';

export const INDIAN_STATES = [
  'All India',
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Delhi (NCT)',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal'
];

export const CATEGORIES = [
  'All',
  'Women Welfare',
  'Government',
  'Banking',
  'Education',
  'Health',
  'Utilities',
  'Travel',
  'Vehicle Services'
] as const;

export const SERVICES_DATA: EService[] = [
  // 1. FASTag Recharge
  {
    id: 'fastag-recharge',
    slug: 'fastag-recharge',
    title: 'FASTag – Instant Recharge Online',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'NHAI / NPCI / NETC',
    shortDescription: 'Recharge your Electronic Toll Collection (ETC) FASTag instantly via UPI, NetBanking, BBPS, or issuing bank portal.',
    overview: 'FASTag uses RFID technology for seamless toll payments directly from linked prepaid accounts. You can recharge any vehicle tag in seconds using your Vehicle Registration Number (VRN) or Tag ID across GPay, PhonePe, Paytm, or bank websites.',
    eligibility: [
      'Active FASTag issued by any certified bank (SBI, ICICI, HDFC, Kotak, Paytm, Axis, IDFC, etc.)',
      'Valid Vehicle Registration Number (VRN) or FASTag Barcode ID / Wallet number',
      'Payment method: UPI, Debit Card, Credit Card, or NetBanking'
    ],
    documents: [
      'Vehicle Registration Number (e.g. MH12AB1234)',
      'Name of Issuing Bank / FASTag Provider',
      'Registered mobile number for OTP confirmation (if required)'
    ],
    fees: 'Zero convenience fee on UPI; Nominal gateway fee may apply for credit cards (₹0 - ₹5)',
    steps: [
      'Open your preferred UPI app (GPay / PhonePe / BHIM) or official Bank FASTag portal.',
      'Select "FASTag Recharge" and choose your issuing bank or Bharat BillPay (BBPS).',
      'Enter your Vehicle Registration Number (without spaces or hyphens).',
      'Verify the tag holder name and current balance.',
      'Enter the recharge amount (min ₹100) and complete payment using UPI PIN or NetBanking.'
    ],
    processingTime: 'Instant (1 to 5 minutes to reflect at toll plaza systems)',
    officialUrl: 'https://ihmcl.co.in/fastag-user/',
    officialAppName: 'My FASTag App (NHAI)',
    isPopular: true,
    isVehicleService: true,
    iconName: 'CreditCard',
    faqs: [
      {
        question: 'How do I know which bank issued my FASTag?',
        answer: 'Check the issuing bank logo printed on the RFID tag sticker on your vehicle windscreen, or dial the NHAI helpline 1033 with your vehicle number.'
      },
      {
        question: 'What is the minimum FASTag recharge amount?',
        answer: 'Most issuing banks require a minimum recharge of ₹100, while the security deposit depends on vehicle class (₹150–₹200 for private cars).'
      },
      {
        question: 'What happens if I cross a toll plaza with low FASTag balance?',
        answer: 'You will be required to pay double the toll amount in cash, or recharge instantly before approaching the toll scanner lane.'
      }
    ]
  },

  // 2. FASTag New Purchase
  {
    id: 'fastag-new-purchase',
    slug: 'fastag-new-purchase',
    title: 'FASTag – New Tag Purchase & Activation',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'NHAI / IHMCL / Certified Issuer Banks',
    shortDescription: 'Buy a new government-mandated RFID FASTag online or at toll plazas, RTOs, and bank branches for any car, truck, or commercial vehicle.',
    overview: 'All 4-wheeler motor vehicles in India must have a functional FASTag affixed to the windscreen. You can order a doorstep FASTag delivery from major banks or pick one up instantly at highway toll plazas or authorized POS counters.',
    eligibility: [
      'Vehicle Owner having a 4-wheeler (Car, SUV, Van, Bus, Truck, Commercial Carrier)',
      'Valid RC copy and owner KYC proof'
    ],
    documents: [
      'Registration Certificate (RC) of the vehicle (both sides scan/photo)',
      'Passport size photograph of vehicle owner',
      'KYC documents of the owner (Aadhaar Card, PAN Card, or Driving License)',
      'Active mobile number linked with Aadhaar for OTP verification'
    ],
    fees: '₹400 – ₹500 approx (includes ₹100 tag fee + ₹200 refundable security deposit + ₹100–200 threshold balance)',
    steps: [
      'Visit any authorized issuer bank portal (SBI, ICICI, HDFC, Airtel Payments Bank, etc.) or My FASTag app.',
      'Click on "Buy FASTag for Car / Commercial Vehicle".',
      'Fill in vehicle details (Make, Model, VRN / Chassis number for new cars).',
      'Upload scans of your Vehicle RC and Aadhaar card.',
      'Pay the tag issuance and security deposit fee.',
      'Tag is delivered to your address within 3-5 business days; affix inside upper center of windscreen.'
    ],
    processingTime: 'Immediate at POS booths / 3 to 5 business days for home delivery',
    officialUrl: 'https://www.nhai.gov.in/#/fastag',
    officialAppName: 'My FASTag App',
    isPopular: false,
    isVehicleService: true,
    iconName: 'Tag',
    faqs: [
      {
        question: 'Can I buy a FASTag for a brand new vehicle without a registration number?',
        answer: 'Yes, you can apply using the vehicle Chassis Number and Engine Number provided in the dealer sale invoice.'
      },
      {
        question: 'Is it mandatory to stick the FASTag on the vehicle glass?',
        answer: 'Yes, it must be stuck on the top-center inside of your front windshield behind the rearview mirror for RFID reader detection.'
      }
    ]
  },

  // 3. FASTag Balance Check
  {
    id: 'fastag-balance-check',
    slug: 'fastag-balance-check',
    title: 'FASTag – Balance & Status Check (NPCI NETC)',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'National Payments Corporation of India (NETC)',
    shortDescription: 'Check live FASTag wallet balance, active/blacklist status, and recent toll transaction history online or via missed call.',
    overview: 'Check if your FASTag is active, low balance, or blacklisted before starting your highway road trip. You can check status through NPCI NETC status portal, bank portals, or by giving a missed call to +91-8884333331.',
    eligibility: [
      'Any registered vehicle with an existing FASTag'
    ],
    documents: [
      'Vehicle Registration Number (VRN)',
      'Registered mobile number for SMS alerts'
    ],
    fees: '100% Free Service',
    steps: [
      'Visit the official NPCI NETC FASTag portal or your issuing bank app.',
      'Enter your Vehicle Number (e.g. DL01AB1234).',
      'Click "Check Status" to view whether the Tag is ACTIVE, LOW BALANCE, or HOTLISTED.',
      'Alternatively, give a missed call to +91-8884333331 from your linked mobile number to get an instant SMS with current balance.'
    ],
    processingTime: 'Instant (10 seconds)',
    officialUrl: 'https://www.npci.org.in/what-we-do/netc-fastag/check-fastag-status',
    officialAppName: 'My FASTag App',
    isPopular: true,
    isVehicleService: true,
    iconName: 'Wallet',
    faqs: [
      {
        question: 'Why does my FASTag show "Blacklisted" or "Hotlisted"?',
        answer: 'This happens when your balance falls below the minimum threshold (usually ₹150) or if KYC is incomplete. Recharging with sufficient funds clears blacklist within 15 minutes.'
      },
      {
        question: 'Is there a missed call number for NHAI FASTag balance?',
        answer: 'Yes, call +91-8884333331 from the mobile number registered with your FASTag wallet.'
      }
    ]
  },

  // 4. e-Challan Payment
  {
    id: 'echallan-payment',
    slug: 'echallan-payment',
    title: 'e-Challan Payment (Traffic Violations & Fines)',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'Ministry of Road Transport and Highways (MoRTH)',
    shortDescription: 'Check pending traffic camera fines, speed violation tickets, and pay digital e-challans securely online.',
    overview: 'The MoRTH eChallan portal integrates state traffic police departments across India. You can look up pending traffic violations using your Challan Number, Vehicle Number with Chassis/Engine digits, or Driving License number.',
    eligibility: [
      'Any vehicle registered in India or any DL holder issued a digital challan'
    ],
    documents: [
      'Vehicle Registration Number AND last 5 digits of Chassis No. or Engine No.',
      'OR Challan Number (from SMS ticket)',
      'OR Driving License (DL) Number'
    ],
    fees: 'Fine amount as per Motor Vehicles Act (No convenience fee on Govt Treasury portal)',
    steps: [
      'Go to the official MoRTH eChallan portal (echallan.parivahan.gov.in).',
      'Click "Pay Online" and select "Vehicle Number".',
      'Enter your Vehicle Number and the last 5 characters of your Chassis or Engine Number.',
      'Enter the captcha and click "Get Detail".',
      'Review pending violation notices, photographic evidence, and fine amounts.',
      'Click "Pay Now" to settle via NetBanking, Debit/Credit Card, or UPI gateway, then download the receipt.'
    ],
    processingTime: 'Instant clearance upon payment (Updated in Vahan RTO database within 24 hours)',
    officialUrl: 'https://echallan.parivahan.gov.in/index/accused-challan',
    officialAppName: 'mParivahan App',
    isPopular: true,
    isVehicleService: true,
    iconName: 'AlertCircle',
    faqs: [
      {
        question: 'Can I contest or challenge a wrongful camera e-challan?',
        answer: 'Yes, you can click on "Grievance / Dispute" on the eChallan portal and upload proof if the number plate was misread by automatic cameras.'
      },
      {
        question: 'What happens if I do not pay my e-challan?',
        answer: 'Unpaid challans are sent to the Virtual Court (vcourts.gov.in) and can block your Vehicle RC renewal, fitness certificate, or ownership transfer.'
      }
    ]
  },

  // 5. Driving License – New/Renewal
  {
    id: 'driving-license-sarathi',
    slug: 'driving-license-sarathi',
    title: 'Driving License (DL) – Learner, New & Renewal (Sarathi)',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'Sarathi Parivahan (MoRTH)',
    shortDescription: 'Apply online for Learner License (LLR), Permanent Driving License, DL renewal, duplicate copy, or address change.',
    overview: 'Sarathi Parivahan provides complete contactless and face-authenticated online Driving License services. You can take the online computer test from home using Aadhaar authentication for Learner License, and book slot tests for permanent licenses.',
    eligibility: [
      'Age 18+ for 4-wheeler/Light Motor Vehicle (16+ for gearless 2-wheeler up to 50cc; 20+ for transport)',
      'Indian Citizen / Resident with proof of identity and address'
    ],
    documents: [
      'Proof of Age (Birth Certificate, 10th Marksheet, Passport, or Aadhaar)',
      'Proof of Current Address (Aadhaar, Voter ID, Utility Bill, Rent Agreement)',
      'Form 1 / Form 1A Medical Certificate (for applicants over 40 years or commercial DL)',
      'Passport size digital photograph and digital signature scan'
    ],
    fees: '₹150 for Learner License; ₹200 for Driving License test & smart card issuance (₹200 for Renewal)',
    steps: [
      'Visit sarathi.parivahan.gov.in and select your State.',
      'Click "Apply for Learner License" or "Apply for Driving License Renewal".',
      'Authenticate with Aadhaar KYC for contactless home service (no RTO visit for LLR in most states).',
      'Fill personal details, vehicle class (MCWG, LMV), and upload required documents.',
      'Pay the government fee online and schedule appointment slot if driving test is needed.',
      'Track DL dispatch status or download digital DL to DigiLocker/mParivahan.'
    ],
    processingTime: 'LLR issued within 24 hours; Smart Card DL dispatched in 7–15 working days',
    officialUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/',
    officialAppName: 'mParivahan App',
    isPopular: true,
    isVehicleService: true,
    iconName: 'FileBadge',
    faqs: [
      {
        question: 'Is DigiLocker / mParivahan digital Driving License legally valid in India?',
        answer: 'Yes, as per MoRTH notifications, digital DL and RC shown via DigiLocker or mParivahan are 100% legally accepted by traffic police across all states.'
      },
      {
        question: 'What is the grace period for Driving License renewal?',
        answer: 'You can renew your DL from 1 year before expiry up to 1 year after expiry without retaking the driving test.'
      }
    ]
  },

  // 6. Vehicle Registration Certificate (RC)
  {
    id: 'vehicle-rc-services',
    slug: 'vehicle-rc-services',
    title: 'Vehicle Registration Certificate (RC) – Status & Transfer',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'Vahan Parivahan (MoRTH)',
    shortDescription: 'Check RC status, download digital RC, apply for Ownership Transfer (Form 29/30), Duplicate RC, or NOC.',
    overview: 'The Vahan national vehicle registry maintains official records for over 30 crore vehicles in India. Access your digital Smart Card RC, update mobile number, apply for vehicle hypothecation termination, or transfer ownership online.',
    eligibility: [
      'Registered owner of the motor vehicle or verified buyer'
    ],
    documents: [
      'Vehicle Registration Number & Chassis Number',
      'Existing RC Book / Smart Card',
      'Form 29 & 30 (for Transfer of Ownership)',
      'Valid Insurance Certificate and Pollution Under Control (PUC) certificate',
      'Aadhaar card of buyer and seller'
    ],
    fees: '₹300 – ₹500 for RC Transfer; ₹100 for Duplicate RC; ₹0 for digital download',
    steps: [
      'Visit vahan.parivahan.gov.in and choose "Online Services > Vehicle Related Services".',
      'Select your State and entering RTO office.',
      'Enter Registration Number and last 5 digits of Chassis Number.',
      'Choose the requested service: Transfer of Ownership, Change of Address, or Duplicate RC.',
      'Upload necessary forms, complete Aadhaar OTP e-Sign, and pay fees.',
      'Submit physical documents to RTO if requested, or track status online.'
    ],
    processingTime: '7 to 21 working days for ownership transfer / instant for digital certificate',
    officialUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    officialAppName: 'mParivahan App',
    isPopular: false,
    isVehicleService: true,
    iconName: 'FileText',
    faqs: [
      {
        question: 'How do I download an authentic digital RC on my phone?',
        answer: 'Install the DigiLocker or mParivahan app, enter your Vehicle Number and Chassis number to fetch verified digital RC from the MoRTH database.'
      },
      {
        question: 'Is NOC required to sell a vehicle within the same state?',
        answer: 'No NOC is required within the same state in most jurisdictions, but interstate sales require an RTO NOC under Form 28.'
      }
    ]
  },

  // 7. Vehicle Insurance Renewal
  {
    id: 'vehicle-insurance-renewal',
    slug: 'vehicle-insurance-renewal',
    title: 'Vehicle Insurance Renewal (Third-Party & Comprehensive)',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'IRDAI / Insurance Information Bureau (IIB)',
    shortDescription: 'Check vehicle insurance validity, compare policies, renew expired motor insurance, and check NCB discount.',
    overview: 'Third-party liability motor insurance is legally compulsory under Section 146 of the Motor Vehicles Act. You can instantly check your current policy expiry date and renew comprehensive or third-party vehicle policies online with zero inspection for unexpired tags.',
    eligibility: [
      'Any 2-wheeler, 4-wheeler, or commercial vehicle owner'
    ],
    documents: [
      'Previous year Insurance Policy Number (if active)',
      'Vehicle Registration Certificate (RC) details',
      'No Claim Bonus (NCB) declaration from previous insurer'
    ],
    fees: 'Mandated IRDAI TP rate (e.g. ₹2,094 for 1000-1500cc cars) + Own Damage premium based on IDV',
    steps: [
      'Go to your preferred insurer (National, New India, ICICI Lombard, HDFC ERGO, etc.) or IRDAI licensed aggregator.',
      'Enter Vehicle Registration Number (VRN) and confirm car make/model.',
      'Select policy type: Comprehensive (Own Damage + Third Party) or Standalone Third-Party.',
      'Choose add-on covers (Zero Depreciation, Engine Protect, Roadside Assistance).',
      'Pay premium securely online; instant digital policy PDF is generated and synced with Parivahan Vahan registry.'
    ],
    processingTime: 'Instant (policy PDF generated within 2 minutes and synced to Vahan in 24-48 hrs)',
    officialUrl: 'https://iib.gov.in/VCheck.html',
    officialAppName: 'mParivahan / DigiLocker',
    isPopular: true,
    isVehicleService: true,
    iconName: 'ShieldCheck',
    faqs: [
      {
        question: 'What is the penalty for driving without valid insurance in India?',
        answer: 'First offense fine is ₹2,000 and/or imprisonment up to 3 months; second offense fine is ₹4,000.'
      },
      {
        question: 'How does the traffic police verify my insurance if I forgot the paper copy?',
        answer: 'Traffic police scanners automatically pull live insurance status from the central Vahan / IIB database using your number plate.'
      }
    ]
  },

  // 8. PUC Certificate
  {
    id: 'puc-certificate-status',
    slug: 'puc-certificate-status',
    title: 'PUC (Pollution Under Control) – Certificate & Center Locator',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'MoRTH National PUCC Portal',
    shortDescription: 'Check PUC test validity online, download computerized emission test certificate, and find nearby certified testing centers.',
    overview: 'All motor vehicles in India must undergo mandatory periodic emission checks. Testing centers upload smoke opacity/gas analyzer readings directly to the MoRTH central PUCC server with webcam photos of the vehicle.',
    eligibility: [
      'All petrol, diesel, and CNG motor vehicles in India (except 100% Battery Electric Vehicles)'
    ],
    documents: [
      'Vehicle Registration Number (VRN)',
      'Last 5 characters of Chassis Number'
    ],
    fees: '₹60 – ₹120 approx depending on vehicle type (2-wheeler, petrol car, diesel commercial) and state norms',
    steps: [
      'Drive your vehicle to any authorized RTO emission testing station (located at most petrol pumps).',
      'The operator connects smoke analyzer probe to vehicle exhaust and takes webcam photo.',
      'Readings are recorded and uploaded directly to the central MoRTH server.',
      'Pay test fee and collect the printout with QR Code.',
      'To download copy later: Visit vahan.parivahan.gov.in/puc, enter VRN & Chassis digits, and click "PUC Certificate".'
    ],
    processingTime: '5 minutes test at authorized petrol pump / Instant digital download',
    officialUrl: 'https://vahan.parivahan.gov.in/puc/',
    officialAppName: 'mParivahan App',
    isPopular: false,
    isVehicleService: true,
    iconName: 'Gauge',
    faqs: [
      {
        question: 'What is the validity of a new car PUC certificate?',
        answer: 'Brand new vehicles come with 1 year PUC validity from manufacturer; subsequent BS4/BS6 renewal tests have 1 year validity (6 months in some older BS3 vehicles).'
      },
      {
        question: 'What is the fine for driving without a valid PUC?',
        answer: 'Under the revised Motor Vehicles Act, driving without valid PUC carries a penalty of up to ₹10,000 and 3 months DL suspension.'
      }
    ]
  },

  // 9. Road Tax Payment
  {
    id: 'road-tax-payment',
    slug: 'road-tax-payment',
    title: 'Road Tax Online Payment (Motor Vehicle MV Tax)',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'State Transport Departments / Vahan',
    shortDescription: 'Pay quarterly, annual, or lifetime motor vehicle road tax online for commercial carriers, passenger cabs, and private vehicles.',
    overview: 'Commercial vehicles, buses, taxis, and state-transferred private cars can pay their quarterly or monthly road tax directly through the Vahan Citizen Services portal without standing in RTO lines.',
    eligibility: [
      'Owners of commercial transport vehicles, school buses, goods carriers, and private vehicles with pending state tax'
    ],
    documents: [
      'Vehicle Registration Number',
      'Chassis Number last 5 digits',
      'Valid Insurance and Fitness Certificate (for commercial vehicles)'
    ],
    fees: 'Determined by State MV Tax schedule, vehicle seating capacity, GVW, and unladen weight',
    steps: [
      'Visit vahan.parivahan.gov.in/vahanservice.',
      'Select your State and RTO.',
      'Click on "Pay Your Tax".',
      'Verify existing tax records, permit details, and calculated tax dues.',
      'Select payment mode (NetBanking, Debit Card, UPI).',
      'Print the official e-Tax Receipt and e-Clearance Certificate.'
    ],
    processingTime: 'Instant upon payment confirmation',
    officialUrl: 'https://vahan.parivahan.gov.in/vahanservice/vahan/ui/appl_rel_service/form_OnlineTax.xhtml',
    officialAppName: 'mParivahan App',
    isPopular: false,
    isVehicleService: true,
    iconName: 'Landmark',
    faqs: [
      {
        question: 'Do private passenger cars need to pay annual road tax?',
        answer: 'Most private 2-wheelers and cars in India pay one-time 15-year lifetime road tax at the time of purchase, while commercial vehicles pay quarterly or annually.'
      }
    ]
  },

  // 10. Parivahan Sewa Portal (General Vehicle Hub)
  {
    id: 'parivahan-sewa-hub',
    slug: 'parivahan-sewa-hub',
    title: 'Parivahan Sewa Portal – Unified National Transport Hub',
    category: 'Vehicle Services',
    state: 'All India',
    department: 'Ministry of Road Transport and Highways (MoRTH)',
    shortDescription: 'The central master portal for all RTO services: Fancy number booking, Permit services, Fitness Certificate, Dealer point registration, and more.',
    overview: 'Parivahan Sewa is the flagship digital transport initiative by MoRTH, connecting over 1,300+ RTOs across all Indian States and Union Territories with unified digital citizen services.',
    eligibility: [
      'All vehicle owners, drivers, transport operators, and auto dealers in India'
    ],
    documents: [
      'Aadhaar / Mobile Number for OTP login',
      'Vehicle RC / Driving License Number'
    ],
    fees: 'Varies per service (Official standard government rates)',
    steps: [
      'Go to parivahan.gov.in.',
      'Browse category: Vehicle Related Services, Driving License Services, or Other Services (Fancy Numbers, National Permit).',
      'Select state and target service.',
      'Submit application and track status in real-time.'
    ],
    processingTime: 'Instant for digital services; 3-10 days for RTO physical approvals',
    officialUrl: 'https://parivahan.gov.in/parivahan/',
    officialAppName: 'mParivahan App',
    isPopular: true,
    isVehicleService: true,
    iconName: 'Car',
    faqs: [
      {
        question: 'How do I book a VIP / Fancy vehicle number plate on Parivahan?',
        answer: 'Visit the "Fancy Number Booking" section on Parivahan, register as a bidder, participate in the e-auction, and reserve your choice number.'
      }
    ]
  },

  // 11. Instant e-PAN Card
  {
    id: 'instant-epan-card',
    slug: 'instant-epan-card',
    title: 'Instant e-PAN Card Online (Income Tax Dept)',
    category: 'Banking',
    state: 'All India',
    department: 'Income Tax Department of India',
    shortDescription: 'Get a 100% free digital 10-digit Permanent Account Number (PAN) in PDF format within 10 minutes using Aadhaar e-KYC.',
    overview: 'The Income Tax Department provides instant allotment of e-PAN on near real-time basis for individual taxpayers with an active Aadhaar number and mobile linkage. Paperless, free of cost, and equivalent to physical PAN.',
    eligibility: [
      'Individual applicant who has NEVER been allotted a PAN card before',
      'Valid Aadhaar card with updated Date of Birth and linked mobile number'
    ],
    documents: [
      '12-digit Aadhaar Number',
      'Active Mobile number linked with Aadhaar for OTP verification'
    ],
    fees: '100% Free on Income Tax e-Filing Portal (₹50 optional fee if you later order a physical plastic card)',
    steps: [
      'Visit the official e-Filing portal at incometax.gov.in.',
      'Under Quick Links, click on "Instant e-PAN".',
      'Click "Get New e-PAN" and enter your 12-digit Aadhaar number.',
      'Validate with the 6-digit OTP sent to your Aadhaar-linked mobile.',
      'Confirm your Aadhaar details (Name, DOB, Gender, Address).',
      'Submit request; your 10-digit PAN is generated within 10 minutes and available for PDF download.'
    ],
    processingTime: 'Instant (5 to 10 minutes)',
    officialUrl: 'https://www.incometax.gov.in/iec/foportal/instant-e-pan',
    officialAppName: 'AIS for Taxpayers App',
    isPopular: true,
    isVehicleService: false,
    iconName: 'CreditCard',
    faqs: [
      {
        question: 'Is Instant e-PAN valid for opening a bank account and passport applications?',
        answer: 'Yes, e-PAN holds the exact same legal validity as a physical plastic PAN card under Rule 114 of Income Tax Rules.'
      },
      {
        question: 'How do I link PAN with Aadhaar?',
        answer: 'Visit incometax.gov.in and click "Link Aadhaar" under Quick Links.'
      }
    ]
  },

  // 12. Voter ID Card (NVSP / ECI)
  {
    id: 'voter-id-card-eci',
    slug: 'voter-id-card-eci',
    title: 'Voter ID Card (EPIC) – New Enrollment & e-EPIC Download',
    category: 'Government',
    state: 'All India',
    department: 'Election Commission of India (ECI)',
    shortDescription: 'Register as a new voter (Form 6), update address/corrections (Form 8), or download digital e-EPIC Voter Card PDF.',
    overview: 'The Election Commission of India (ECI) portal allows any Indian citizen turning 18 to enroll as a voter, track application status, find their polling booth, and download official digitally signed voter ID cards.',
    eligibility: [
      'Indian Citizen aged 18 years or older on qualifying dates',
      'Ordinarily resident at the constituency address'
    ],
    documents: [
      'Passport size digital photograph',
      'Proof of Age (Birth certificate, 10th marksheet, Aadhaar, PAN, Passport)',
      'Proof of Address (Aadhaar, Electricity/Water bill, Ration card, Passport)'
    ],
    fees: '100% Free Service by Government of India',
    steps: [
      'Visit the official voter portal at voters.eci.gov.in.',
      'Create an account with your mobile number and password.',
      'For new registration, select "Fill Form 6" (New Voters).',
      'Enter constituency, personal details, date of birth, and upload photo & proofs.',
      'Review and submit; note down the Reference ID to track field verification by Booth Level Officer (BLO).',
      'Download digital e-EPIC PDF once approved.'
    ],
    processingTime: '15 to 30 days for BLO verification and card generation',
    officialUrl: 'https://voters.eci.gov.in/',
    officialAppName: 'Voter Helpline App',
    isPopular: true,
    isVehicleService: false,
    iconName: 'Vote',
    faqs: [
      {
        question: 'What is e-EPIC?',
        answer: 'e-EPIC is a portable digital version of the Electoral Photo Identity Card that can be downloaded on mobile or printed.'
      }
    ]
  },

  // 13. Passport Seva
  {
    id: 'passport-seva-portal',
    slug: 'passport-seva-portal',
    title: 'Passport Seva – New Passport & Renewal Appointment',
    category: 'Government',
    state: 'All India',
    department: 'Ministry of External Affairs (CPV Division)',
    shortDescription: 'Apply online for Fresh Passport, Re-issue, Tatkaal, or Police Clearance Certificate (PCC) and book PSK / POPSK appointments.',
    overview: 'Passport Seva Kendra (PSK) system by MEA handles end-to-end processing of Indian Passports. Complete the online application, upload documents, pay the fee, and select your preferred biometric appointment date.',
    eligibility: [
      'Citizen of India by birth, descent, or registration/naturalization'
    ],
    documents: [
      'Proof of Date of Birth (Birth Certificate, 10th School leaving certificate, Aadhaar)',
      'Proof of Present Address (Aadhaar, Voter ID, Bank Passbook with photo, Electricity bill)',
      'Non-ECR proof (Class 10th certificate or higher education degree)'
    ],
    fees: '₹1,500 for Normal 36-page booklet (₹2,000 for 60-page); ₹3,500 for Tatkaal scheme',
    steps: [
      'Register on the official portal passportindia.gov.in.',
      'Click "Apply for Fresh Passport / Re-issue of Passport".',
      'Fill in applicant details, family info, and address details accurately.',
      'Pay application fee online and schedule appointment at nearest PSK or Post Office PSK.',
      'Visit PSK on appointment day with original documents for photo, biometrics, and document verification.',
      'Complete local Police verification; passport is dispatched via India Post Speed Post.'
    ],
    processingTime: 'Normal: 15–20 working days; Tatkaal: 3–5 working days',
    officialUrl: 'https://www.passportindia.gov.in/',
    officialAppName: 'mPassport Seva App',
    isPopular: true,
    isVehicleService: false,
    iconName: 'Globe',
    faqs: [
      {
        question: 'Is original document physical verification required at PSK?',
        answer: 'Yes, you must carry all original documents along with one set of self-attested photocopies on your scheduled appointment date.'
      }
    ]
  },

  // 14. Aadhaar Card (UIDAI)
  {
    id: 'aadhaar-uidai-services',
    slug: 'aadhaar-uidai-services',
    title: 'Aadhaar Card (myAadhaar) – Download & Update (UIDAI)',
    category: 'Government',
    state: 'All India',
    department: 'Unique Identification Authority of India (UIDAI)',
    shortDescription: 'Download password-protected e-Aadhaar PDF, update address online, order durable PVC card, or lock/unlock biometrics.',
    overview: 'myAadhaar is the unified self-service portal for Indian residents to manage their 12-digit biometric identity. Perform address corrections, generate Virtual IDs (VID), and lock biometric sensors for high security.',
    eligibility: [
      'All Indian residents holding a valid 12-digit Aadhaar number'
    ],
    documents: [
      'Aadhaar Number / Enrolment ID (EID)',
      'Aadhaar-linked registered mobile number for OTP',
      'Proof of Address document (for address updates)'
    ],
    fees: 'Free for e-Aadhaar download & biometric lock; ₹50 for official PVC Smart Card delivery',
    steps: [
      'Go to myaadhaar.uidai.gov.in and click "Login" with your Aadhaar + OTP.',
      'Select desired service: Download Aadhaar, Order Aadhaar PVC Card, or Address Update.',
      'For address update: Enter new address, upload supporting document scan (or use Head of Family consent).',
      'For PVC card: Verify address preview and pay ₹50 fee.',
      'Download the e-Aadhaar PDF (password is first 4 letters of your name in CAPITAL + birth year).'
    ],
    processingTime: 'Instant for e-Aadhaar download; 5–7 days for PVC card doorstep delivery',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    officialAppName: 'mAadhaar App',
    isPopular: true,
    isVehicleService: false,
    iconName: 'Fingerprint',
    faqs: [
      {
        question: 'What is the password to open my downloaded e-Aadhaar PDF?',
        answer: 'The password is 8 characters long: the first 4 letters of your name in CAPITAL letters followed by your 4-digit Year of Birth (e.g. SURE1990).'
      }
    ]
  },

  // 15. DigiLocker
  {
    id: 'digilocker-digital-vault',
    slug: 'digilocker-digital-vault',
    title: 'DigiLocker – Paperless Digital Document Vault',
    category: 'Government',
    state: 'All India',
    department: 'Digital India / MeitY',
    shortDescription: 'Access legally valid digital copies of your Driving License, RC, Marksheets, Aadhaar, Insurance, and Ration Card on your phone.',
    overview: 'DigiLocker is a key initiative under Digital India providing access to authentic digital documents issued by 2,000+ government bodies, CBSE, state boards, transport departments, and universities. Documents issued in DigiLocker are treated at par with original physical documents under Rule 9A of IT Rules 2016.',
    eligibility: [
      'Any individual with an Aadhaar card and active mobile number'
    ],
    documents: [
      'Aadhaar Number for 1-time KYC',
      'Account Security PIN (6 digits)'
    ],
    fees: '100% Free (1 GB free secure cloud storage)',
    steps: [
      'Sign up at digilocker.gov.in or install the DigiLocker app.',
      'Verify Aadhaar number via OTP and create a 6-digit security PIN.',
      'Search for issuing authority (e.g. Ministry of Road Transport, CBSE, Income Tax).',
      'Enter document parameters (e.g. Roll number, Reg number).',
      'The document is digitally pulled and permanently stored in your "Issued Documents" tab.'
    ],
    processingTime: 'Instant digital document sync',
    officialUrl: 'https://www.digilocker.gov.in/',
    officialAppName: 'DigiLocker App',
    isPopular: true,
    isVehicleService: false,
    iconName: 'FolderLock',
    faqs: [
      {
        question: 'Are DigiLocker documents accepted at airports and traffic checks?',
        answer: 'Yes! Ministry of Civil Aviation and MoRTH have issued official circulars stating DigiLocker Aadhaar/DL are fully valid for airport entry and traffic enforcement.'
      }
    ]
  },

  // 16. Ayushman Bharat PM-JAY
  {
    id: 'ayushman-bharat-pmjay',
    slug: 'ayushman-bharat-pmjay',
    title: 'Ayushman Bharat (PM-JAY) – Golden Health Card',
    category: 'Health',
    state: 'All India',
    department: 'National Health Authority (NHA)',
    shortDescription: 'Check eligibility for ₹5 Lakh/year cashless health insurance coverage and download Ayushman Card for empaneled hospitals.',
    overview: 'Pradhan Mantri Jan Arogya Yojana (PM-JAY) is the worlds largest government-sponsored health assurance scheme providing ₹5,00,000 annual secondary and tertiary hospitalization cover per eligible family.',
    eligibility: [
      'Families identified under SECC 2011 database, rural deprivation criteria, or recognized urban occupational categories (and senior citizens 70+)'
    ],
    documents: [
      'Aadhaar Card / Ration Card',
      'Active mobile number'
    ],
    fees: '100% Free Health Coverage',
    steps: [
      'Visit beneficiary.nha.gov.in.',
      'Log in with your mobile number via OTP.',
      'Search your family record by Ration Card / Aadhaar / State ID.',
      'If eligible, complete e-KYC using Aadhaar facial/OTP authentication.',
      'Download the Ayushman Health Card and present at any empaneled government or private hospital for cashless treatment.'
    ],
    processingTime: 'Instant digital card generation upon e-KYC',
    officialUrl: 'https://beneficiary.nha.gov.in/',
    officialAppName: 'Ayushman App',
    isPopular: false,
    isVehicleService: false,
    iconName: 'HeartPulse',
    faqs: [
      {
        question: 'Does PM-JAY cover pre-existing diseases from Day 1?',
        answer: 'Yes, all pre-existing conditions are covered from day one of enrollment across 1,900+ medical procedures.'
      }
    ]
  },

  // 17. EPFO UAN Passbook
  {
    id: 'epfo-uan-passbook',
    slug: 'epfo-uan-passbook',
    title: 'EPFO UAN Member Portal – PF Passbook & Withdrawal',
    category: 'Banking',
    state: 'All India',
    department: 'Employees Provident Fund Organisation (EPFO)',
    shortDescription: 'Check monthly Provident Fund (PF) balance, view member passbook, file online claims (Form 19/10C/31), and transfer PF accounts.',
    overview: 'EPFO Unified Member Portal allows formal sector employees to track retirement savings, check employer contribution credits, update bank KYC, and claim advance withdrawals for medical/housing needs.',
    eligibility: [
      'Salaried employees with an active Universal Account Number (UAN)'
    ],
    documents: [
      'Universal Account Number (UAN) and password',
      'Aadhaar-linked mobile for claim OTP',
      'Bank passbook scan / cancelled cheque copy with name printed'
    ],
    fees: '100% Free Service',
    steps: [
      'Go to unifiedportal-mem.epfindia.gov.in.',
      'Login with UAN and password.',
      'To view balance: Click "View > Passbook" or visit passbook.epfindia.gov.in.',
      'To withdraw/advance: Go to "Online Services > Claim (Form-31, 19, 10C & 10D)".',
      'Verify linked bank account and submit claim; funds credited directly to savings account.'
    ],
    processingTime: '3 to 7 working days for online claim settlement',
    officialUrl: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/',
    officialAppName: 'UMANG App',
    isPopular: true,
    isVehicleService: false,
    iconName: 'Coins',
    faqs: [
      {
        question: 'How do I activate my UAN for the first time?',
        answer: 'Click "Activate UAN" on the portal, provide your UAN, Aadhaar, Name, DOB, and verify OTP.'
      }
    ]
  },

  // 18. IRCTC Train Booking
  {
    id: 'irctc-train-booking',
    slug: 'irctc-train-booking',
    title: 'IRCTC eTicketing – Train Ticket Booking & Tatkal',
    category: 'Travel',
    state: 'All India',
    department: 'Indian Railways / IRCTC',
    shortDescription: 'Book reserved train tickets, check live PNR status, book Tatkal quotas, and order meals on Indian Railways network.',
    overview: 'The official e-ticketing platform for Indian Railways handling over 1.5 million reservations daily across Express, Vande Bharat, Rajdhani, Shatabdi, and local trains.',
    eligibility: [
      'Any passenger holding a valid IRCTC user account'
    ],
    documents: [
      'Valid Government Photo ID (carried during journey)',
      'Passenger Names, Age, and Berth Preference'
    ],
    fees: 'Ticket fare + nominal IRCTC convenience charge (₹15 for non-AC, ₹30 for AC via UPI)',
    steps: [
      'Visit irctc.co.in or open IRCTC Rail Connect app.',
      'Search trains between origin and destination stations on selected date.',
      'Select travel class (1A, 2A, 3A, 3E, SL, CC, EC).',
      'Add passenger details and mobile number for SMS ticket.',
      'Pay via UPI, Cards, or NetBanking; receive instant confirmation SMS/PDF ticket.'
    ],
    processingTime: 'Instant ticket issuance',
    officialUrl: 'https://www.irctc.co.in/nget/',
    officialAppName: 'IRCTC Rail Connect App',
    isPopular: true,
    isVehicleService: false,
    iconName: 'Train',
    faqs: [
      {
        question: 'When does Tatkal booking open?',
        answer: 'Tatkal booking opens at 10:00 AM for AC classes and 11:00 AM for Non-AC classes, one day prior to train origin departure.'
      }
    ]
  },

  // 19. Bharat BillPay (Electricity & Utilities)
  {
    id: 'bharat-billpay-electricity',
    slug: 'bharat-billpay-electricity',
    title: 'Electricity & Utility Bill Payment (Bharat BillPay)',
    category: 'Utilities',
    state: 'All India',
    department: 'NPCI / National Electricity Discoms',
    shortDescription: 'Pay state electricity bills, water, piped gas (PNG), broadband, and municipal property taxes with instant receipt generation.',
    overview: 'Bharat Bill Payment System (BBPS) is an interoperable bill payment ecosystem connecting all state electricity distribution boards (MSEDCL, TANGEDCO, BESCOM, UPPCL, BSES, etc.) for instant digital bill settlement.',
    eligibility: [
      'Consumer having an active utility account number (Consumer ID / CA Number)'
    ],
    documents: [
      'Electricity Consumer Number / Account ID (printed on physical electricity bill)'
    ],
    fees: 'Zero fee on UPI and debit cards',
    steps: [
      'Open your payment app or visit your state electricity discom website.',
      'Select Electricity > Choose your State & Provider (e.g. Mahavitaran, UPPCL, TNEB).',
      'Enter your Consumer Number / Billing Unit.',
      'Fetch current due bill amount and due date.',
      'Complete payment and download tamper-proof BBPS transaction receipt.'
    ],
    processingTime: 'Instant confirmation (updated in discom server in real-time or up to 24 hrs)',
    officialUrl: 'https://www.bharatbillpay.com/',
    officialAppName: 'State Discom App / BHIM App',
    isPopular: false,
    isVehicleService: false,
    iconName: 'Zap',
    faqs: [
      {
        question: 'Will paying online protect me from late payment surcharges?',
        answer: 'Yes, BBPS generates a timestamped digital receipt that acts as legal proof of on-time payment.'
      }
    ]
  },

  // 20. National Scholarship Portal
  {
    id: 'national-scholarship-portal',
    slug: 'national-scholarship-portal',
    title: 'National Scholarship Portal (NSP)',
    category: 'Education',
    state: 'All India',
    department: 'Ministry of Electronics and Information Technology (MeitY)',
    shortDescription: 'Apply for central, UGC, AICTE, and state government pre-matric and post-matric student scholarships.',
    overview: 'NSP is a digital one-stop solution through which scholarship schemes from Central Ministries, State Governments, and autonomous institutions are disbursed directly to students Aadhaar-seeded bank accounts (DBT).',
    eligibility: [
      'Students enrolled in recognized schools, colleges, or universities meeting family income and merit guidelines'
    ],
    documents: [
      'Aadhaar Card / OTR (One Time Registration) ID',
      'Income Certificate issued by Revenue Authority',
      'Caste / Category Certificate (if applicable)',
      'Previous year Marksheet',
      'Fee receipt of current academic year & Bonafide Certificate'
    ],
    fees: '100% Free Application',
    steps: [
      'Register for One-Time Registration (OTR) on scholarships.gov.in using Aadhaar Face Auth / OTP.',
      'Login with OTR credentials and fill scholarship application form.',
      'Upload institutional bonafide certificate and income proof.',
      'Submit application for institute verification (INO) and state nodal officer verification.',
      'Track Direct Benefit Transfer (DBT) disbursement status on portal.'
    ],
    processingTime: '1 to 3 months depending on academic cycle verification',
    officialUrl: 'https://scholarships.gov.in/',
    officialAppName: 'NSP Mobile App',
    isPopular: false,
    isVehicleService: false,
    iconName: 'GraduationCap',
    faqs: [
      {
        question: 'What is mandatory for receiving scholarship funds in bank accounts?',
        answer: 'Your bank account must be actively seeded and mapped with your Aadhaar in the NPCI mapper for Direct Benefit Transfer.'
      }
    ]
  },

  // 21. Pradhan Mantri Matru Vandana Yojana (PMMVY) - Maternity Benefit DBT
  {
    id: 'pmmvy-maternity-benefit',
    slug: 'pmmvy-maternity-benefit',
    title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    category: 'Women Welfare',
    state: 'All India',
    department: 'Ministry of Women and Child Development (MWCD)',
    shortDescription: 'Direct Cash Transfer of ₹5,000 for 1st child and ₹6,000 for 2nd girl child directly into mother’s Aadhaar-seeded bank account for nutrition support.',
    overview: 'PMMVY provides partial compensation for wage loss in terms of cash incentive so that the woman can take adequate rest before and after delivery of the first living child, and financial incentive on the birth of a second girl child to discourage female foeticide and promote health check-ups and immunization.',
    eligibility: [
      'Pregnant Women and Lactating Mothers (PW&LM) who are Indian citizens',
      'Age of beneficiary should be 19 years or older at the time of pregnancy registration',
      'First living child (₹5,000 in 2 installments) OR second child if it is a girl child (₹6,000 in single installment)',
      'Belongs to economically weaker sections (EWS), BPL, SC/ST, MGNREGA job card holder, or family income below ₹8 Lakh/year',
      'Excludes regular central/state government employees and PSUs'
    ],
    documents: [
      'Mother’s Aadhaar Card (mandatory) & Father’s Aadhaar / ID',
      'Mother and Child Protection (MCP) / RCH Card issued by Anganwadi / Health Center',
      'Aadhaar-seeded Bank / Post Office Account passbook copy with NPCI DBT mapping',
      'Child Birth Certificate (for 2nd installment / girl child incentive)',
      'Income / Caste / Ration Card certificate for eligibility proof'
    ],
    fees: '100% Free Government Benefit Scheme (No registration fee)',
    steps: [
      'Register early pregnancy at nearest Anganwadi Centre (AWC) or approved Health Facility within 570 days of LMP (Last Menstrual Period).',
      'Visit the official PMMVY citizen portal (pmmvy.wcd.gov.in) or submit Form 1A/1B at AWC / ASHA worker.',
      'Authenticate with Aadhaar and enter bank account details mapped with NPCI.',
      'First installment (₹3,000) is credited to Aadhaar-linked bank account after 1 antenatal checkup (ANC).',
      'Second installment (₹2,000) or girl child incentive (₹6,000) is credited after registration of childbirth and 1st cycle of immunization (BCG, OPV, DPT, Hepatitis B).'
    ],
    processingTime: '15 to 30 days after stage verification by CDPO / District Nodal Officer',
    officialUrl: 'https://pmmvy.wcd.gov.in/',
    officialAppName: 'PMMVY Mobile App (Poshan Tracker)',
    isPopular: true,
    isWomenService: true,
    iconName: 'HeartPulse',
    timelineStages: [
      'Pregnancy Registration & MCP Card Verification',
      'Aadhaar Authentication & NPCI Bank Seeding Check',
      'Anganwadi Worker / ASHA Field Verification',
      'CDPO / District Nodal Officer Approval',
      'Direct Benefit Transfer (DBT) Bank Credit'
    ],
    faqs: [
      {
        question: 'How is the ₹5,000 amount paid under PMMVY?',
        answer: 'Under the revised PMMVY 2.0 guidelines, ₹3,000 is transferred in Installment 1 after early pregnancy registration and at least one ANC, and ₹2,000 in Installment 2 after childbirth registration and first round of vaccination.'
      },
      {
        question: 'Is incentive available for a second child?',
        answer: 'Yes, if the second child is a girl, a direct financial assistance of ₹6,000 is credited in a single installment to celebrate the girl child.'
      },
      {
        question: 'Can I apply for PMMVY online from home?',
        answer: 'Yes! Mothers can register directly on the citizen login of pmmvy.wcd.gov.in using their mobile OTP and upload their MCP card.'
      }
    ]
  },

  // 22. Sukanya Samriddhi Yojana (SSY)
  {
    id: 'sukanya-samriddhi-yojana',
    slug: 'sukanya-samriddhi-yojana',
    title: 'Sukanya Samriddhi Yojana (SSY) – Girl Child Savings Scheme',
    category: 'Women Welfare',
    state: 'All India',
    department: 'Department of Posts / Ministry of Finance',
    shortDescription: 'Highest guaranteed sovereign interest rate (8.2% p.a.) government savings scheme for girl child with 100% triple tax exemption (EEE under 80C).',
    overview: 'Sukanya Samriddhi Account (SSA) is a government-backed small deposit scheme under the Beti Bachao Beti Padhao campaign. It guarantees high compounding interest, sovereign safety, and complete tax exemption on deposits, interest earned, and maturity proceeds to secure higher education and marriage expenses of girl children.',
    eligibility: [
      'Girl child who is an Indian resident and below 10 years of age at the time of account opening',
      'Account opened by legal parents or guardian in the name of the girl child',
      'Maximum 2 accounts per family (one for each girl child; 3 allowed in case of twin/triplet girl births)'
    ],
    documents: [
      'Girl Child’s Birth Certificate (issued by Municipal authority / Hospital)',
      'Parent / Guardian KYC (Aadhaar Card and PAN Card)',
      'Proof of Residence (Passport, Voter ID, Utility Bill, Ration Card)',
      '2 Passport size photographs of Parent/Guardian and Girl child'
    ],
    fees: 'Minimum ₹250 initial deposit (Deposit limit: Min ₹250 to Max ₹1,50,000 per financial year)',
    steps: [
      'Collect Form SSA-1 from any Post Office branch or authorized nationalized/private bank (SBI, PNB, BoB, HDFC, ICICI, etc.).',
      'Fill in parent/guardian and girl child details along with KYC documents.',
      'Deposit the initial amount (minimum ₹250 cash, cheque, or demand draft).',
      'Receive the physical Sukanya Samriddhi Passbook with Account Number and CIF ID.',
      'Set up NetBanking / IPPB standing instructions for automated annual online deposits.'
    ],
    processingTime: 'Same day instant account opening at Post Office or Bank branch',
    officialUrl: 'https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx',
    officialAppName: 'IPPB Mobile Banking / Postinfo App',
    isPopular: true,
    isWomenService: true,
    iconName: 'Coins',
    timelineStages: [
      'Form Submission & Age Verification',
      'Parent/Guardian KYC Verification',
      'Initial Deposit & CIF Generation',
      'Passbook Issuance & Standing Instruction Activation',
      'Annual 8.2% Interest Compounding & Tax Exemption Certificate'
    ],
    faqs: [
      {
        question: 'What is the current interest rate on Sukanya Samriddhi Yojana?',
        answer: 'The current sovereign interest rate is 8.2% per annum, compounded annually (among the highest across all fixed income savings schemes in India).'
      },
      {
        question: 'When does the Sukanya Samriddhi account mature?',
        answer: 'The account matures 21 years from the date of opening, or upon marriage of the girl child after attaining 18 years of age. Deposits are required only for the first 15 years.'
      },
      {
        question: 'Can partial withdrawal be made for higher education?',
        answer: 'Yes, up to 50% of the account balance at the end of the preceding financial year can be withdrawn for higher education after the girl child turns 18 or passes 10th standard.'
      }
    ]
  },

  // 23. Mahila Samman Savings Certificate (MSSC)
  {
    id: 'mahila-samman-savings-certificate',
    slug: 'mahila-samman-savings-certificate',
    title: 'Mahila Samman Savings Certificate (MSSC)',
    category: 'Women Welfare',
    state: 'All India',
    department: 'Department of Posts / Ministry of Finance',
    shortDescription: '2-year fixed deposit scheme exclusively for women and girls offering attractive 7.5% fixed interest with partial withdrawal facility.',
    overview: 'Mahila Samman Savings Certificate (MSSC) is a specialized one-time small savings scheme commemorating Azadi Ka Amrit Mahotsav. Any woman or guardian on behalf of a minor girl can deposit between ₹1,000 and ₹2,00,000 for a fixed 2-year tenure at a competitive 7.5% quarterly compounded rate.',
    eligibility: [
      'Any woman of any age (self-operated)',
      'Guardian on behalf of a minor girl child',
      'Indian resident citizen'
    ],
    documents: [
      'Application Form (Form-1)',
      'Aadhaar Card of the woman applicant / minor guardian',
      'PAN Card (mandatory for financial transactions)',
      'KYC documents & 2 Passport-sized photographs'
    ],
    fees: 'Minimum deposit ₹1,000 in multiples of ₹100 (Maximum ceiling ₹2,00,000)',
    steps: [
      'Visit your nearest Post Office or authorized Public Sector / Private Bank branch.',
      'Fill out the Mahila Samman Savings Certificate Application Form.',
      'Submit Aadhaar, PAN card, and deposit amount (via Cash or Cheque).',
      'Collect the official Deposit Certificate / Account Passbook with maturity details.',
      'Receive full principal + 7.5% compounded interest payout directly to linked bank account upon completing 2 years.'
    ],
    processingTime: 'Same day certificate issuance at Post Office / Bank branches',
    officialUrl: 'https://www.indiapost.gov.in/Financial/Pages/Content/MahilaSamman.aspx',
    officialAppName: 'Postinfo App',
    isPopular: true,
    isWomenService: true,
    iconName: 'Building2',
    timelineStages: [
      'Application & Deposit Slip Submission',
      'Aadhaar & PAN KYC Scrutiny',
      'Certificate / Account Generation',
      'Half-Tenure Partial Withdrawal Window (after 1 year, up to 40%)',
      '2-Year Maturity & Direct Payout'
    ],
    faqs: [
      {
        question: 'What is the interest rate and tenure of MSSC?',
        answer: 'MSSC offers a fixed 7.5% per annum interest rate compounded quarterly for a 2-year tenure.'
      },
      {
        question: 'Is partial withdrawal permitted before 2 years?',
        answer: 'Yes! After 1 year from account opening, up to 40% of the eligible balance can be withdrawn for emergency requirements.'
      }
    ]
  },

  // 24. Stand-Up India – Women Entrepreneurship Loan Scheme
  {
    id: 'stand-up-india-women',
    slug: 'stand-up-india-women',
    title: 'Stand-Up India – Women Entrepreneurship Loan Scheme',
    category: 'Women Welfare',
    state: 'All India',
    department: 'Department of Financial Services (DFS) / SIDBI',
    shortDescription: 'Collateral-free enterprise bank loans between ₹10 Lakh and ₹1 Crore for women entrepreneurs to set up greenfield manufacturing, service, or trading businesses.',
    overview: 'Stand-Up India facilitates bank loans between ₹10 lakh and ₹1 crore to at least one Woman borrower per bank branch for setting up a greenfield enterprise. The scheme includes handholding support, credit guarantee coverage, margin money convergence, and business mentoring through SIDBI.',
    eligibility: [
      'Women entrepreneurs aged 18 years and above',
      'Loan available only for greenfield projects (first-time venture in manufacturing, services, agri-allied activities, or trading)',
      'In case of non-individual enterprises (private limited, LLP, partnership), 51% of the shareholding and controlling stake must be held by the woman entrepreneur',
      'Borrower should not be in default to any bank or financial institution'
    ],
    documents: [
      'Identity Proof (Aadhaar, Voter ID, Passport, PAN Card)',
      'Residence Proof & Caste / Category Certificate (if SC/ST)',
      'Detailed Project Report (DPR) showing business model, machinery, working capital & cashflow projections',
      'Proof of business premises (Rent agreement / Title deeds / Electricity bill)',
      'Pollution Clearance / Udyam MSME Registration Certificate (if applicable)',
      'Bank account statements of last 6 months'
    ],
    fees: 'Standard bank loan processing charges (Capped by RBI / SIDBI concessional norms)',
    steps: [
      'Visit the Stand-Up India official web portal (standupmitra.in) and register as a "Woman Entrepreneur".',
      'Choose whether you need handholding support (preparation of project report, training) or ready to apply for loan directly.',
      'Fill the Common Loan Application Form and upload DPR & KYC documents.',
      'Select preferred scheduled commercial bank branch nearby.',
      'Attend the appraisal meeting with bank loan officer for field appraisal and sanction letter issuance within 3-4 weeks.'
    ],
    processingTime: '21 to 30 working days from complete documentation submission',
    officialUrl: 'https://www.standupmitra.in/',
    officialAppName: 'Stand-Up Mitra Portal',
    isPopular: true,
    isWomenService: true,
    iconName: 'Landmark',
    timelineStages: [
      'Online Application & DPR Submission on Standupmitra',
      'Bank Branch Assignment & Document Verification',
      'Unit / Site Inspection & Techno-Economic Appraisal',
      'Credit Committee Loan Sanction & CGSSI Coverage',
      'First Tranche Loan Disbursement'
    ],
    faqs: [
      {
        question: 'What is the loan repayment period under Stand-Up India?',
        answer: 'The loan is repayable in 7 years with a maximum moratorium period of up to 18 months.'
      },
      {
        question: 'Is collateral security mandatory for ₹10 Lakh to ₹1 Crore loans?',
        answer: 'No collateral is required if the loan is covered under the Credit Guarantee Scheme for Stand Up India (CGFSI) as per scheme guidelines.'
      }
    ]
  },

  // 25. National Commission for Women (NCW) Grievance & 24/7 Helpline
  {
    id: 'ncw-women-helpline',
    slug: 'ncw-women-helpline',
    title: 'NCW 24/7 Women Helpline & Online Grievance Redressal Portal',
    category: 'Women Welfare',
    state: 'All India',
    department: 'National Commission for Women (NCW India)',
    shortDescription: 'Emergency helpline (7827170170 / 181), online complaint filing, legal counseling, and rapid intervention for women in distress across India.',
    overview: 'The National Commission for Women (NCW) provides an automated 24/7 digital complaint and grievance portal for women facing domestic violence, workplace harassment (POSH), cyber abuse, dowry harassment, or denial of legal rights. It coordinates rapid police action, legal aid, and counseling.',
    eligibility: [
      'Any woman citizen of India or overseas Indian facing harassment, abuse, or injustice',
      'Family members, friends, or NGOs can also lodge complaints on behalf of an aggrieved woman'
    ],
    documents: [
      'Complainant’s basic details and contact number',
      'Incident description, date, and location',
      'Supporting evidence (Audio/Video clips, Screenshots, Police FIR/GD copy, Medical reports, if available)'
    ],
    fees: '100% Free Public Legal Aid & Support Service',
    steps: [
      'In immediate life safety emergencies, immediately call 112 (National Emergency) or 7827170170 (NCW 24/7 Helpline) / 181 (Women Helpline).',
      'For online formal complaints, visit ncwapps.nic.in / ncw.nic.in.',
      'Click "Register Online Complaint" and enter mobile number to receive OTP.',
      'Fill the complaint details, respondent details, and attach supporting files.',
      'Receive a unique Complaint Tracking Number (CTN) via SMS and monitor live inquiry status and police action reports.'
    ],
    processingTime: 'Emergency calls handled in real-time; Online complaints reviewed within 24–48 hours',
    officialUrl: 'https://ncwapps.nic.in/onlinecomplaintsv2/',
    officialAppName: 'NCW Women Helpline (7827170170)',
    isPopular: true,
    isWomenService: true,
    iconName: 'ShieldCheck',
    timelineStages: [
      'Grievance Lodged & Unique CTN Generated',
      'Preliminary Scrutiny by NCW Legal Cell',
      'Notice / Direction Issued to State Police / Authorities',
      'Police Action Taken Report (ATR) Received',
      'Resolution, Counseling & Legal Redressal Completed'
    ],
    faqs: [
      {
        question: 'What is the national 24/7 helpline number for women in distress?',
        answer: 'You can call 7827170170 (NCW 24x7 Helpline) or 181 (Women in Distress National Helpline) or 112 (All-in-one Emergency).'
      },
      {
        question: 'Can complaints be filed anonymously or confidentially?',
        answer: 'NCW treats all identity details with strict confidentiality to protect the safety and dignity of the complainant.'
      }
    ]
  },

  // 26. Pradhan Mantri Ujjwala Yojana 2.0 (PMUY) - Free LPG for Women
  {
    id: 'pm-ujjwala-yojana',
    slug: 'pm-ujjwala-yojana',
    title: 'Pradhan Mantri Ujjwala Yojana 2.0 (Free LPG Connection)',
    category: 'Women Welfare',
    state: 'All India',
    department: 'Ministry of Petroleum and Natural Gas (MoPNG)',
    shortDescription: 'Free deposit-free LPG gas connection, first refill, and free stove given in the name of an adult woman of poor and low-income households.',
    overview: 'Ujjwala 2.0 provides deposit-free LPG connections along with a free first cylinder refill and gas hotplate (stove) to adult women belonging to economically backward families to ensure smoke-free indoor cooking and protect women from respiratory diseases.',
    eligibility: [
      'Applicant must be an adult woman (at least 18 years old)',
      'Belongs to SC/ST, PMAY (Gramin), Most Backward Classes, Forest Dwellers, SECC list, or poor household declared under 14-point declaration',
      'No other active LPG connection in the same household'
    ],
    documents: [
      'Aadhaar Card of the woman applicant (Proof of Identity & Address)',
      'Ration Card / Family Composition Certificate',
      'Aadhaar of all adult family members residing together',
      'Bank Account Number and IFSC code mapped with Aadhaar (DBTL subsidy credit)',
      'Self-declaration for migrant families'
    ],
    fees: '100% Free (Zero deposit; Free 1st Refill + Free Gas Stove provided by Govt/OMCs)',
    steps: [
      'Visit the official portal pmuy.gov.in or approach nearest Indane, Bharatgas, or HP Gas distributorship.',
      'Click "Apply for New Ujjwala 2.0 Connection" and choose preferred gas company.',
      'Enter Aadhaar number and verify via OTP.',
      'Submit family member details and select cylinder type (14.2 kg or 5 kg).',
      'Distributor performs de-duplication check and delivers new gas connection with cylinder & stove at your doorstep.'
    ],
    processingTime: '5 to 7 days after document verification by LPG distributor',
    officialUrl: 'https://www.pmuy.gov.in/',
    officialAppName: 'IndianOil One / HP Pay / Hello BPCL App',
    isPopular: false,
    isWomenService: true,
    iconName: 'Zap',
    timelineStages: [
      'Online Application & Family Tree Submission',
      'NIC / OMC De-duplication Check',
      'Distributor KYC Verification',
      'Safety Inspection & Connection Release',
      'Doorstep Delivery of Cylinder & Stove'
    ],
    faqs: [
      {
        question: 'Do migrants need a local ration card to apply for Ujjwala 2.0?',
        answer: 'No! Migrant families can simply submit a self-declaration for proof of address and family composition without needing a local ration card.'
      },
      {
        question: 'Is the LPG subsidy credited directly to the woman bank account?',
        answer: 'Yes, targeted subsidies under PAHAL (DBTL) are credited directly into the woman Aadhaar-seeded bank account for subsequent cylinder refills.'
      }
    ]
  },

  // 27. Sakhi Niwas – Working Women Hostel Scheme
  {
    id: 'sakhi-working-women-hostel',
    slug: 'sakhi-working-women-hostel',
    title: 'Sakhi Niwas – Working Women Hostel & Daycare Support',
    category: 'Women Welfare',
    state: 'All India',
    department: 'Ministry of Women and Child Development (MWCD)',
    shortDescription: 'Safe, subsidized, and secure residential accommodation with attached crèche and daycare facilities for working women in urban and semi-urban centers.',
    overview: 'Sakhi Niwas (under Mission Shakti / SAMBAL) provides safe, hygienic, and affordable hostel accommodation to working women who are single, widowed, divorced, separated, or married but whose husband or immediate family does not reside in the same city. Daycare / crèche facilities are provided for children up to 18 years (girls) and up to 5 years (boys).',
    eligibility: [
      'Working women (employed in private, government, or self-employed sectors)',
      'Women undergoing professional/job training (up to 1 year)',
      'Gross monthly income not exceeding ₹50,000/- in metropolitan cities (or ₹35,000/- in other cities)',
      'Children of working women (girls up to 18 years, boys up to 5 years)'
    ],
    documents: [
      'Identity Proof (Aadhaar Card / Voter ID)',
      'Employment Letter / Salary Slip / Training Enrollment Letter',
      'Passport size photographs & Local Guardian contact',
      'Child Birth Certificate (if availing attached crèche facilities)'
    ],
    fees: 'Subsidized monthly rent (typically ₹1,500 – ₹4,000 based on city grade and sharing type)',
    steps: [
      'Check availability of Sakhi Niwas hostels in your target city on wcd.nic.in or State Women Development Corporation portals.',
      'Submit the admission application form along with employer letter and salary slip.',
      'Hostel management committee verifies credentials and issues allotment within 3–5 working days.',
      'Move into secure premises with 24/7 security guards, biometric access, and CCTV surveillance.'
    ],
    processingTime: '3 to 5 days for hostel room allotment based on vacancy',
    officialUrl: 'https://wcd.nic.in/schemes/working-women-hostel',
    officialAppName: 'Mission Shakti Portal',
    isPopular: false,
    isWomenService: true,
    iconName: 'Building2',
    timelineStages: [
      'Online Allotment Request Submission',
      'Employment & Income Certificate Verification',
      'Hostel Warden / Management Committee Interview',
      'Room Allotment & Security Deposit Payment',
      'Check-in & Biometric Smart Card Issuance'
    ],
    faqs: [
      {
        question: 'What is the maximum duration a working woman can stay in Sakhi Niwas?',
        answer: 'Normally, a woman can stay for a period of up to 3 years. Extensions can be granted by the state committee for genuine career continuation.'
      }
    ]
  },

  // 28. One Stop Centre (Sakhi Centre) Scheme
  {
    id: 'one-stop-centre-sakhi',
    slug: 'one-stop-centre-sakhi',
    title: 'One Stop Centre (Sakhi Centre) – Emergency, Medical & Legal Aid',
    category: 'Women Welfare',
    state: 'All India',
    department: 'Ministry of Women and Child Development (MWCD)',
    shortDescription: 'Integrated 24/7 one-stop emergency support center providing immediate police facilitation, medical treatment, legal counsel, psycho-social support, and temporary shelter.',
    overview: 'One Stop Centres (OSCs), established across every district in India under the Nirbhaya Fund, serve as a single-window emergency haven for women facing domestic violence, sexual assault, trafficking, or mental harassment. OSCs integrate medical aid, police reporting, legal counseling, video conferencing with courts, and temporary shelter up to 5 days.',
    eligibility: [
      'Any woman (including girls under 18 with POCSO support) affected by violence, abuse, or acute crisis in public or private spaces',
      'Available irrespective of caste, religion, marital status, or socio-economic background'
    ],
    documents: [
      'No mandatory documents required for emergency admission or life saving treatment',
      'Identity proof can be provided later during formal legal documentation'
    ],
    fees: '100% Free of Cost 24/7 Government Emergency Care',
    steps: [
      'Call Women Helpline 181, National Emergency 112, or walk directly into the nearest District Hospital One Stop Centre (OSC).',
      'Immediate medical examination and emergency first-aid provided by hospital medical team.',
      'Counselor conducts private psycho-social assessment in a safe environment.',
      'Police facilitation officer assists with Zero FIR / GD registration if the survivor desires legal action.',
      'Free legal aid lawyer assigned via District Legal Services Authority (DLSA) for court proceedings and compensation claims.'
    ],
    processingTime: 'Immediate emergency response within minutes; 24/7 active walk-in',
    officialUrl: 'https://wcd.nic.in/schemes/one-stop-centre-scheme-1',
    officialAppName: 'Sakhi 181 Emergency Network',
    isPopular: false,
    isWomenService: true,
    iconName: 'HeartPulse',
    timelineStages: [
      'Emergency Call / Walk-in Admission',
      'Immediate Medical Triage & First Aid',
      'Psycho-Social Counseling & Safe Haven',
      'Police Zero FIR & DLSA Legal Aid Allocation',
      'Long-term Rehabilitation & Shelter Transition'
    ],
    faqs: [
      {
        question: 'Where are One Stop Centres located in each district?',
        answer: 'One Stop Centres are located within or adjacent to the District Government Headquarters Hospital / Medical College in over 700 districts across India.'
      },
      {
        question: 'How many days of temporary shelter are provided at OSC?',
        answer: 'OSC provides safe temporary residential shelter for up to 5 days with food, clothing, and hygiene kits, after which smooth transfer to Swadhar Greh or family is arranged.'
      }
    ]
  }
];

// Sample Interactive Process Tracking Milestones for Citizen Demo Lookups
export const DEMO_TRACKING_RECORDS: Record<string, {
  serviceId: string;
  serviceTitle: string;
  applicationNumber: string;
  portalName: string;
  appliedDate: string;
  estimatedCompletionDate: string;
  status: 'Draft' | 'Submitted' | 'In Verification' | 'Approved' | 'Completed' | 'Rejected';
  progressPercentage: number;
  currentStage: string;
  speedPostNumber?: string;
  stages: {
    stageNumber: number;
    stageName: string;
    status: 'completed' | 'in_progress' | 'pending' | 'action_required';
    date?: string;
    description: string;
    officerRemarks?: string;
  }[];
}> = {
  'ARN-2026-99120': {
    serviceId: 'passport-seva-online',
    serviceTitle: 'Passport Seva – New & Renewal Application',
    applicationNumber: 'ARN-2026-99120',
    portalName: 'Passport Seva Kendra (PSK) Herald House',
    appliedDate: '2026-08-18',
    estimatedCompletionDate: '2026-09-08',
    status: 'In Verification',
    progressPercentage: 65,
    currentStage: 'Police Verification in Progress',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Online Form & Fee Reconciliation',
        status: 'completed',
        date: '18-Aug-2026',
        description: 'Application submitted successfully on passportindia.gov.in. Fee ₹1,500 paid online via SBI e-Pay.'
      },
      {
        stageNumber: 2,
        stageName: 'PSK Biometric & Document Scrutiny',
        status: 'completed',
        date: '24-Aug-2026',
        description: 'Biometrics, photo, and original 10th marksheet & Aadhaar scanned at PSK Counter A, B & Granting Counter C.',
        officerRemarks: 'All documents verified and granted by Granting Officer #14.'
      },
      {
        stageNumber: 3,
        stageName: 'Police Verification Report (PVR)',
        status: 'in_progress',
        date: '28-Aug-2026',
        description: 'Verification order transmitted to Local Police Station (Indirapuram PS). Physical address inquiry scheduled.',
        officerRemarks: 'Beat Officer visit expected within 48 hours. Keep address proof and 2 neighbor witness IDs ready.'
      },
      {
        stageNumber: 4,
        stageName: 'Passport Printing & Lamination',
        status: 'pending',
        description: 'Passport booklet will be laser-engraved and printed at India Security Press (Nashik / Regional Hub).'
      },
      {
        stageNumber: 5,
        stageName: 'Speed Post Dispatch & Delivery',
        status: 'pending',
        description: 'Booklet will be dispatched via India Post Speed Post with live SMS tracking.'
      }
    ]
  },
  'EPIC-VOT-882190': {
    serviceId: 'voter-id-epic-portal',
    serviceTitle: 'Voter ID (EPIC) – New Citizen Registration',
    applicationNumber: 'EPIC-VOT-882190',
    portalName: 'Election Commission of India (ECI / ECIServices)',
    appliedDate: '2026-08-10',
    estimatedCompletionDate: '2026-09-05',
    status: 'Approved',
    progressPercentage: 90,
    currentStage: 'EPIC Printed & Out for ERO Dispatch',
    speedPostNumber: 'EM998823145IN',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Form 6 Online Submission',
        status: 'completed',
        date: '10-Aug-2026',
        description: 'Form 6 submitted online via voters.eci.gov.in with Aadhaar & age proof.'
      },
      {
        stageNumber: 2,
        stageName: 'BLO (Booth Level Officer) Field Verification',
        status: 'completed',
        date: '18-Aug-2026',
        description: 'BLO physical visit to residence completed. Residence & family voter records authenticated.'
      },
      {
        stageNumber: 3,
        stageName: 'Electoral Registration Officer (ERO) Scrutiny',
        status: 'completed',
        date: '25-Aug-2026',
        description: 'ERO accepted the inclusion of name in the Draft Electoral Roll.',
        officerRemarks: 'Approved for EPIC Generation.'
      },
      {
        stageNumber: 4,
        stageName: 'Digital e-EPIC Generation',
        status: 'completed',
        date: '29-Aug-2026',
        description: 'Digital e-EPIC PDF is now ready for instant download using registered mobile OTP.',
        officerRemarks: 'Digital voter card valid across all polling stations.'
      },
      {
        stageNumber: 5,
        stageName: 'Physical Holographic EPIC Dispatch',
        status: 'in_progress',
        date: '01-Sep-2026',
        description: 'High security color plastic EPIC card dispatched via Speed Post (EM998823145IN).'
      }
    ]
  },
  'PMMVY-2026-44321': {
    serviceId: 'pmmvy-maternity-benefit',
    serviceTitle: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    applicationNumber: 'PMMVY-2026-44321',
    portalName: 'Ministry of Women & Child Development (Poshan DBT)',
    appliedDate: '2026-08-15',
    estimatedCompletionDate: '2026-09-12',
    status: 'In Verification',
    progressPercentage: 60,
    currentStage: 'CDPO Verification & NPCI Seeding Check',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Pregnancy & MCP Card Registration',
        status: 'completed',
        date: '15-Aug-2026',
        description: 'Registration completed at Sector 4 Anganwadi Centre with MCP Card details and Aadhaar.'
      },
      {
        stageNumber: 2,
        stageName: 'ASHA / AWW Field Endorsement',
        status: 'completed',
        date: '20-Aug-2026',
        description: 'Antenatal checkup (ANC-1) verified by Primary Health Centre medical officer.'
      },
      {
        stageNumber: 3,
        stageName: 'NPCI Aadhaar Bank Seeding Scrutiny',
        status: 'in_progress',
        date: '28-Aug-2026',
        description: 'Aadhaar mapping verification underway on PFMS / NPCI gateway for DBT cash transfer.',
        officerRemarks: 'Bank account active and mapped for direct benefit transfer.'
      },
      {
        stageNumber: 4,
        stageName: 'CDPO Approval & Sanction Order',
        status: 'pending',
        description: 'Child Development Project Officer financial sanction for ₹3,000 Installment 1.'
      },
      {
        stageNumber: 5,
        stageName: 'DBT Bank Credit into Mother Account',
        status: 'pending',
        description: '₹3,000 cash incentive will be credited directly to beneficiary bank account via RBI ECS/PFMS.'
      }
    ]
  }
};

export const DEMO_VEHICLE: VehicleSummary = {
  vehicleNumber: 'MH 12 AB 1234',
  ownerName: 'Rajesh Sharma (Demo Profile)',
  model: 'Tata Nexon XZ+ (Petrol / Automatic)',
  registrationDate: '14-Mar-2021',
  rcStatus: 'Active',
  rcValidity: '13-Mar-2036 (Valid)',
  insuranceValidity: '18-Nov-2026',
  insuranceProvider: 'ICICI Lombard Motor Insurance (Demo)',
  pucValidity: '15-Sep-2026',
  pucStatus: 'Expiring Soon',
  fastagTagId: 'NETC-NHAI-8839210984',
  fastagStatus: 'Active',
  fastagBalance: 340.00,
  pendingChallans: [
    {
      id: 'CH-MH12-2026-99120',
      date: '12-Aug-2026',
      violation: 'Exceeding prescribed speed limit (Pune-Mumbai Expway)',
      amount: 500,
      location: 'Khalapur Toll Plaza (Camera #04)',
      status: 'Pending'
    }
  ]
};

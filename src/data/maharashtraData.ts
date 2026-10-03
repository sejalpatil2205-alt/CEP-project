import { VehiclePublicInfo, WomenBusCardApplication } from '../types';

export const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar (Ahilyanagar)',
  'Akola',
  'Amravati',
  'Chhatrapati Sambhaji Nagar (Aurangabad)',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Dharashiv (Osmanabad)',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal'
] as const;

export const MSRTC_DEPOTS = [
  'Pune Swargate Depot',
  'Pune Shivajinagar Depot',
  'Mumbai Central (ST Stand) Depot',
  'Parel MSRTC Depot, Mumbai',
  'Borivali Sukurwadi Bus Depot',
  'Thane Vandana ST Depot',
  'Nashik CBS Depot',
  'Chhatrapati Sambhaji Nagar Central ST',
  'Nagpur Ganeshpeth Depot',
  'Kolhapur Central ST Bus Station',
  'Solapur ST Stand',
  'Amravati Central ST Depot',
  'Satara ST Stand',
  'Panvel MSRTC Depot',
  'Ratnagiri ST Depot'
];

export const MAHARASHTRA_RTO_MAP: Record<string, { code: string; name: string; division: string }> = {
  'MH01': { code: 'MH-01', name: 'Mumbai South (Tardeo RTO)', division: 'Konkan' },
  'MH02': { code: 'MH-02', name: 'Mumbai West (Andheri RTO)', division: 'Konkan' },
  'MH03': { code: 'MH-03', name: 'Mumbai East (Wadala RTO)', division: 'Konkan' },
  'MH04': { code: 'MH-04', name: 'Thane RTO', division: 'Konkan' },
  'MH05': { code: 'MH-05', name: 'Kalyan (Ulhasnagar RTO)', division: 'Konkan' },
  'MH06': { code: 'MH-06', name: 'Raigad (Pen RTO)', division: 'Konkan' },
  'MH07': { code: 'MH-07', name: 'Sindhudurg (Oros RTO)', division: 'Konkan' },
  'MH08': { code: 'MH-08', name: 'Ratnagiri RTO', division: 'Konkan' },
  'MH09': { code: 'MH-09', name: 'Kolhapur RTO', division: 'Western Maharashtra' },
  'MH10': { code: 'MH-10', name: 'Sangli RTO', division: 'Western Maharashtra' },
  'MH11': { code: 'MH-11', name: 'Satara RTO', division: 'Western Maharashtra' },
  'MH12': { code: 'MH-12', name: 'Pune RTO (Central)', division: 'Western Maharashtra' },
  'MH13': { code: 'MH-13', name: 'Solapur RTO', division: 'Western Maharashtra' },
  'MH14': { code: 'MH-14', name: 'Pimpri-Chinchwad RTO', division: 'Western Maharashtra' },
  'MH15': { code: 'MH-15', name: 'Nashik RTO', division: 'North Maharashtra (Khandesh)' },
  'MH16': { code: 'MH-16', name: 'Ahmednagar (Ahilyanagar RTO)', division: 'North Maharashtra' },
  'MH17': { code: 'MH-17', name: 'Shrirampur RTO', division: 'North Maharashtra' },
  'MH18': { code: 'MH-18', name: 'Dhule RTO', division: 'Khandesh' },
  'MH19': { code: 'MH-19', name: 'Jalgaon RTO', division: 'Khandesh' },
  'MH20': { code: 'MH-20', name: 'Chhatrapati Sambhaji Nagar (Aurangabad RTO)', division: 'Marathwada' },
  'MH21': { code: 'MH-21', name: 'Jalna RTO', division: 'Marathwada' },
  'MH22': { code: 'MH-22', name: 'Parbhani RTO', division: 'Marathwada' },
  'MH23': { code: 'MH-23', name: 'Beed RTO', division: 'Marathwada' },
  'MH24': { code: 'MH-24', name: 'Latur RTO', division: 'Marathwada' },
  'MH25': { code: 'MH-25', name: 'Dharashiv (Osmanabad RTO)', division: 'Marathwada' },
  'MH26': { code: 'MH-26', name: 'Nanded RTO', division: 'Marathwada' },
  'MH27': { code: 'MH-27', name: 'Amravati RTO', division: 'Vidarbha' },
  'MH28': { code: 'MH-28', name: 'Buldhana RTO', division: 'Vidarbha' },
  'MH29': { code: 'MH-29', name: 'Yavatmal RTO', division: 'Vidarbha' },
  'MH30': { code: 'MH-30', name: 'Akola RTO', division: 'Vidarbha' },
  'MH31': { code: 'MH-31', name: 'Nagpur City (Central RTO)', division: 'Vidarbha' },
  'MH32': { code: 'MH-32', name: 'Wardha RTO', division: 'Vidarbha' },
  'MH33': { code: 'MH-33', name: 'Gadchiroli RTO', division: 'Vidarbha' },
  'MH34': { code: 'MH-34', name: 'Chandrapur RTO', division: 'Vidarbha' },
  'MH35': { code: 'MH-35', name: 'Gondia RTO', division: 'Vidarbha' },
  'MH36': { code: 'MH-36', name: 'Bhandara RTO', division: 'Vidarbha' },
  'MH37': { code: 'MH-37', name: 'Washim RTO', division: 'Vidarbha' },
  'MH38': { code: 'MH-38', name: 'Hingoli RTO', division: 'Marathwada' },
  'MH39': { code: 'MH-39', name: 'Nandurbar RTO', division: 'Khandesh' },
  'MH40': { code: 'MH-40', name: 'Nagpur Rural RTO', division: 'Vidarbha' },
  'MH41': { code: 'MH-41', name: 'Malegaon RTO', division: 'North Maharashtra' },
  'MH42': { code: 'MH-42', name: 'Baramati RTO', division: 'Western Maharashtra' },
  'MH43': { code: 'MH-43', name: 'Navi Mumbai (Vashi RTO)', division: 'Konkan' },
  'MH44': { code: 'MH-44', name: 'Ambajogai RTO', division: 'Marathwada' },
  'MH45': { code: 'MH-45', name: 'Akluj RTO', division: 'Western Maharashtra' },
  'MH46': { code: 'MH-46', name: 'Panvel RTO', division: 'Konkan' },
  'MH47': { code: 'MH-47', name: 'Mumbai North (Borivali RTO)', division: 'Konkan' },
  'MH48': { code: 'MH-48', name: 'Vasai-Virar (Palghar RTO)', division: 'Konkan' },
  'MH49': { code: 'MH-49', name: 'Nagpur East RTO', division: 'Vidarbha' },
  'MH50': { code: 'MH-50', name: 'Karad RTO', division: 'Western Maharashtra' }
};

export const VERIFIED_MAHARASHTRA_VEHICLES: VehiclePublicInfo[] = [
  {
    registrationNumber: 'MH 12 AB 1234',
    rtoCode: 'MH-12',
    rtoName: 'Pune RTO (Central)',
    rtoDivision: 'Western Maharashtra',
    vehicleType: 'Motor Car (LMV - Private)',
    vehicleCategory: 'LMV',
    make: 'Tata Motors Ltd',
    model: 'Nexon EV Max XZ+ Lux',
    fuelType: 'Electric',
    registrationDate: '15-Mar-2022',
    registrationValidity: '14-Mar-2037 (Valid for 15 Yrs)',
    fitnessStatus: 'Active & Fit',
    fitnessValidUntil: '14-Mar-2037',
    permitStatus: 'Personal Non-Transport (Not Required)',
    insuranceStatus: 'Active & Insured',
    insuranceProvider: 'ICICI Lombard General Insurance Co. Ltd',
    insurancePolicyNumber: 'POL-ICICI-MH-338291',
    insuranceValidUntil: '12-Mar-2027',
    pucStatus: 'Valid & Certified',
    pucCertificateNumber: 'PUC-MH12-2025-004921',
    pucValidUntil: '14-Mar-2026',
    pucEmissionLevel: 'Zero Tailpipe Emissions (Electric Vehicle Exemption)',
    color: 'Intensi-Teal Blue',
    cubicCapacity: 'Zero CC (40.5 kWh Battery)',
    seatingCapacity: 5,
    emissionNorms: 'Zero Emission / Pure Electric (EV)',
    chassisNumberMasked: 'MAT621004***9821',
    engineNumberMasked: 'EV3Z40K***0412',
    taxStatus: 'Life Time Tax Paid (LTT)',
    blacklistedStatus: 'Clear / No Blacklist Flag',
    isCommercial: false
  },
  {
    registrationNumber: 'MH 02 CD 5678',
    rtoCode: 'MH-02',
    rtoName: 'Mumbai West (Andheri RTO)',
    rtoDivision: 'Konkan',
    vehicleType: 'Motor Car (LMV - Private)',
    vehicleCategory: 'LMV',
    make: 'Maruti Suzuki India Ltd',
    model: 'Swift ZXi Plus Dual Tone',
    fuelType: 'Petrol',
    registrationDate: '10-Jul-2021',
    registrationValidity: '09-Jul-2036 (Valid for 15 Yrs)',
    fitnessStatus: 'Active & Fit',
    fitnessValidUntil: '09-Jul-2036',
    permitStatus: 'Personal Non-Transport (Not Required)',
    insuranceStatus: 'Active & Insured',
    insuranceProvider: 'New India Assurance Co. Ltd',
    insurancePolicyNumber: 'POL-NIA-MH-849102',
    insuranceValidUntil: '08-Jul-2026',
    pucStatus: 'Valid & Certified',
    pucCertificateNumber: 'PUC-MH02-2025-993812',
    pucValidUntil: '15-Jan-2026',
    pucEmissionLevel: 'CO: 0.09% | HC: 88 ppm (BS-VI Passed)',
    color: 'Solid Fire Red',
    cubicCapacity: '1197 cc',
    seatingCapacity: 5,
    emissionNorms: 'BHARAT STAGE VI (BS-VI OBD-II)',
    chassisNumberMasked: 'MA3FHB21S***4109',
    engineNumberMasked: 'K12MN***7721',
    taxStatus: 'Life Time Tax Paid (LTT)',
    blacklistedStatus: 'Clear / No Blacklist Flag',
    isCommercial: false
  },
  {
    registrationNumber: 'MH 14 GH 9999',
    rtoCode: 'MH-14',
    rtoName: 'Pimpri-Chinchwad RTO',
    rtoDivision: 'Western Maharashtra',
    vehicleType: 'Motor Car / SUV (LMV - Private)',
    vehicleCategory: 'LMV',
    make: 'Mahindra & Mahindra Ltd',
    model: 'Thar LX 4x4 Hard Top Diesel AT',
    fuelType: 'Diesel',
    registrationDate: '22-Oct-2022',
    registrationValidity: '21-Oct-2037 (Valid for 15 Yrs)',
    fitnessStatus: 'Active & Fit',
    fitnessValidUntil: '21-Oct-2037',
    permitStatus: 'Personal Non-Transport (Not Required)',
    insuranceStatus: 'Active & Insured',
    insuranceProvider: 'HDFC ERGO General Insurance Co.',
    insurancePolicyNumber: 'POL-HDFC-MH-203914',
    insuranceValidUntil: '20-Oct-2026',
    pucStatus: 'Valid & Certified',
    pucCertificateNumber: 'PUC-MH14-2025-449102',
    pucValidUntil: '22-Apr-2026',
    pucEmissionLevel: 'Smoke Density: 0.42 /m (Limit: 1.62 /m BS-VI Passed)',
    color: 'Napoli Black',
    cubicCapacity: '2184 cc (mHawk 130)',
    seatingCapacity: 4,
    emissionNorms: 'BHARAT STAGE VI (BS-VI DPF & SCR)',
    chassisNumberMasked: 'MA1TA2THL***5521',
    engineNumberMasked: 'D22MA***9901',
    taxStatus: 'Life Time Tax Paid (LTT)',
    blacklistedStatus: 'Clear / No Blacklist Flag',
    isCommercial: false
  },
  {
    registrationNumber: 'MH 31 FA 4422',
    rtoCode: 'MH-31',
    rtoName: 'Nagpur City (Central RTO)',
    rtoDivision: 'Vidarbha',
    vehicleType: 'Two Wheeler (Motor Cycle with Gear)',
    vehicleCategory: 'Two-Wheeler',
    make: 'Bajaj Auto Ltd',
    model: 'Pulsar NS200 Dual ABS',
    fuelType: 'Petrol',
    registrationDate: '04-Feb-2023',
    registrationValidity: '03-Feb-2038 (Valid for 15 Yrs)',
    fitnessStatus: 'Active & Fit',
    fitnessValidUntil: '03-Feb-2038',
    permitStatus: 'Personal Non-Transport (Not Required)',
    insuranceStatus: 'Active & Insured',
    insuranceProvider: 'Bajaj Allianz General Insurance Co.',
    insurancePolicyNumber: 'POL-BAGIC-MH-559102',
    insuranceValidUntil: '02-Feb-2028',
    pucStatus: 'Valid & Certified',
    pucCertificateNumber: 'PUC-MH31-2025-110294',
    pucValidUntil: '04-Feb-2026',
    pucEmissionLevel: 'CO: 0.11% | HC: 110 ppm (BS-VI Passed)',
    color: 'Burnt Red & Satin Black',
    cubicCapacity: '199.5 cc',
    seatingCapacity: 2,
    emissionNorms: 'BHARAT STAGE VI (BS-VI)',
    chassisNumberMasked: 'MD2A11CY8***4401',
    engineNumberMasked: 'JLZZM***8109',
    taxStatus: 'Life Time Tax Paid (LTT)',
    blacklistedStatus: 'Clear / No Blacklist Flag',
    isCommercial: false
  },
  {
    registrationNumber: 'MH 04 AZ 8888',
    rtoCode: 'MH-04',
    rtoName: 'Thane RTO',
    rtoDivision: 'Konkan',
    vehicleType: 'Motor Car (LMV - Private)',
    vehicleCategory: 'LMV',
    make: 'Toyota Kirloskar Motor',
    model: 'Innova Crysta 2.4 VX 7-Seater',
    fuelType: 'Diesel',
    registrationDate: '18-Aug-2020',
    registrationValidity: '17-Aug-2035 (Valid for 15 Yrs)',
    fitnessStatus: 'Active & Fit',
    fitnessValidUntil: '17-Aug-2035',
    permitStatus: 'Personal Non-Transport (Not Required)',
    insuranceStatus: 'Active & Insured',
    insuranceProvider: 'Tata AIG General Insurance Co.',
    insurancePolicyNumber: 'POL-TATA-MH-994821',
    insuranceValidUntil: '17-Aug-2026',
    pucStatus: 'Valid & Certified',
    pucCertificateNumber: 'PUC-MH04-2025-661029',
    pucValidUntil: '19-Aug-2026',
    pucEmissionLevel: 'Smoke Density: 0.38 /m (BS-VI Passed)',
    color: 'Super White',
    cubicCapacity: '2393 cc (2GD-FTV)',
    seatingCapacity: 7,
    emissionNorms: 'BHARAT STAGE VI (BS-VI)',
    chassisNumberMasked: 'MBJAA21V6***1198',
    engineNumberMasked: '2GD94***0129',
    taxStatus: 'Life Time Tax Paid (LTT)',
    blacklistedStatus: 'Clear / No Blacklist Flag',
    isCommercial: false
  },
  {
    registrationNumber: 'MH 46 Z 1001',
    rtoCode: 'MH-46',
    rtoName: 'Panvel RTO',
    rtoDivision: 'Konkan',
    vehicleType: 'Light Commercial Vehicle (Goods)',
    vehicleCategory: 'Commercial',
    make: 'Tata Motors Ltd',
    model: 'Tata Ace Gold CNG Plus',
    fuelType: 'CNG',
    registrationDate: '11-Nov-2023',
    registrationValidity: '10-Nov-2025 (Commercial 2-Yr Fitness Cycle)',
    fitnessStatus: 'Active & Fit',
    fitnessValidUntil: '10-Nov-2025',
    permitStatus: 'Valid State Carrier Permit (Maharashtra Goods)',
    permitValidUntil: '10-Nov-2028',
    insuranceStatus: 'Active & Insured',
    insuranceProvider: 'United India Insurance Co. Ltd',
    insurancePolicyNumber: 'POL-UII-MH-772810',
    insuranceValidUntil: '09-Nov-2026',
    pucStatus: 'Valid & Certified',
    pucCertificateNumber: 'PUC-MH46-2025-882019',
    pucValidUntil: '11-Nov-2025',
    pucEmissionLevel: 'CO: 0.05% | HC: 42 ppm (CNG Clean Fuel Passed)',
    color: 'Arctic White',
    cubicCapacity: '694 cc CNG Bi-Fuel',
    seatingCapacity: 2,
    emissionNorms: 'BHARAT STAGE VI (BS-VI)',
    chassisNumberMasked: 'MAT381002***4812',
    engineNumberMasked: 'CNG70***9910',
    taxStatus: 'Annual Road Tax Up-to-date',
    blacklistedStatus: 'Clear / No Blacklist Flag',
    isCommercial: true
  }
];

// Helper to normalize entered plate numbers (e.g. "mh-12 ab 1234" -> "MH 12 AB 1234")
export function normalizeMhRegistrationNumber(input: string): string {
  if (!input) return '';
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean.startsWith('MH')) {
    return clean;
  }
  // Try to match standard format: MH followed by 2 digits, optional 1-3 letters, then 4 digits
  const match = clean.match(/^MH(\d{1,2})([A-Z]{0,3})(\d{1,4})$/);
  if (match) {
    const rto = match[1].padStart(2, '0');
    const series = match[2];
    const num = match[3].padStart(4, '0');
    return series ? `MH ${rto} ${series} ${num}` : `MH ${rto} ${num}`;
  }
  return clean;
}

// Deterministic dynamic vehicle generator for ANY valid Maharashtra registration number
export function lookupOrGenerateMaharashtraVehicle(inputPlate: string): VehiclePublicInfo {
  const normalized = normalizeMhRegistrationNumber(inputPlate);
  
  // 1. Check exact match in pre-seeded dataset
  const found = VERIFIED_MAHARASHTRA_VEHICLES.find(
    (v) => v.registrationNumber.replace(/\s+/g, '') === normalized.replace(/\s+/g, '')
  );
  if (found) {
    return found;
  }

  // 2. Parse RTO code
  const digitsMatch = normalized.match(/MH\s*(\d{1,2})/);
  const rtoNumStr = digitsMatch ? digitsMatch[1].padStart(2, '0') : '12';
  const rtoKey = `MH${rtoNumStr}`;
  const rtoInfo = MAHARASHTRA_RTO_MAP[rtoKey] || {
    code: `MH-${rtoNumStr}`,
    name: `Maharashtra RTO Office (Code MH-${rtoNumStr})`,
    division: 'Maharashtra State'
  };

  // Pseudo-random deterministic hash based on plate letters/digits
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const vehicleMakes = [
    { make: 'Tata Motors', model: 'Punch Creative Flagship', fuel: 'Petrol', cc: '1199 cc', type: 'Motor Car (LMV - Private)', cat: 'LMV' as const, seating: 5 },
    { make: 'Maruti Suzuki', model: 'Brezza ZXi Plus Smart Hybrid', fuel: 'Petrol', cc: '1462 cc', type: 'Motor Car (LMV - Private)', cat: 'LMV' as const, seating: 5 },
    { make: 'Hyundai Motor India', model: 'Creta SX (O) Diesel', fuel: 'Diesel', cc: '1493 cc', type: 'Motor Car (LMV - Private)', cat: 'LMV' as const, seating: 5 },
    { make: 'Honda Motorcycle', model: 'Activa 6G Deluxe Smart Key', fuel: 'Petrol', cc: '109.5 cc', type: 'Two Wheeler (Motor Cycle/Scooter)', cat: 'Two-Wheeler' as const, seating: 2 },
    { make: 'Tata Motors Ltd', model: 'Tiago EV Long Range Tech Lux', fuel: 'Electric', cc: 'Electric (24 kWh)', type: 'Motor Car (Electric Passenger LMV)', cat: 'Electric' as const, seating: 5 },
    { make: 'Mahindra & Mahindra', model: 'Scorpio-N Z8L 4xplor AT', fuel: 'Diesel', cc: '2198 cc', type: 'Motor Car (LMV - Private)', cat: 'LMV' as const, seating: 7 },
    { make: 'Bajaj Auto Ltd', model: 'Chetak Premium 3201 Electric', fuel: 'Electric', cc: 'Electric (3.2 kWh)', type: 'Two Wheeler (Electric Scooter)', cat: 'Two-Wheeler' as const, seating: 2 },
    { make: 'Toyota Kirloskar', model: 'Urban Cruiser Hyryder Strong Hybrid', fuel: 'Hybrid', cc: '1490 cc e-CVT', type: 'Motor Car (Hybrid Electric LMV)', cat: 'LMV' as const, seating: 5 }
  ];

  const vehicleProfile = vehicleMakes[posHash % vehicleMakes.length];
  const regYear = 2018 + (posHash % 7); // 2018 to 2024
  const regMonth = 1 + (posHash % 12);
  const regDay = 1 + (posHash % 28);
  const regDateFormatted = `${String(regDay).padStart(2, '0')}-${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][regMonth - 1]}-${regYear}`;
  const validYear = regYear + 15;
  const validDateFormatted = `${String(regDay).padStart(2, '0')}-${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][regMonth - 1]}-${validYear}`;

  const insurers = [
    'ICICI Lombard General Insurance Co.',
    'HDFC ERGO General Insurance Co.',
    'The New India Assurance Co. Ltd',
    'Bajaj Allianz General Insurance Co.',
    'Tata AIG General Insurance Co. Ltd',
    'National Insurance Co. Ltd'
  ];
  const insurer = insurers[posHash % insurers.length];

  const colors = ['Pearl Arctic White', 'Daytona Grey', 'Magma Grey', 'Deep Forest Green', 'Flame Red', 'Midnight Black'];
  const color = colors[posHash % colors.length];

  return {
    registrationNumber: normalized,
    rtoCode: rtoInfo.code,
    rtoName: rtoInfo.name,
    rtoDivision: rtoInfo.division,
    vehicleType: vehicleProfile.type,
    vehicleCategory: vehicleProfile.cat,
    make: vehicleProfile.make,
    model: vehicleProfile.model,
    fuelType: vehicleProfile.fuel as any,
    registrationDate: regDateFormatted,
    registrationValidity: `${validDateFormatted} (Valid for 15 Yrs)`,
    fitnessStatus: 'Active & Fit',
    fitnessValidUntil: validDateFormatted,
    permitStatus: 'Personal Non-Transport (Not Required)',
    insuranceStatus: 'Active & Insured',
    insuranceProvider: insurer,
    insurancePolicyNumber: `POL-${insurer.split(' ')[0].toUpperCase()}-MH-${100000 + (posHash % 899999)}`,
    insuranceValidUntil: `15-Nov-${2026 + (posHash % 2)}`,
    pucStatus: 'Valid & Certified',
    pucCertificateNumber: `PUC-${rtoInfo.code.replace('-', '')}-2025-${200000 + (posHash % 799999)}`,
    pucValidUntil: `28-Dec-2025`,
    pucEmissionLevel: vehicleProfile.fuel === 'Electric' 
      ? 'Zero Emissions (Certified EV Exemption)'
      : `CO: 0.${(posHash % 12) + 4}% | HC: ${70 + (posHash % 60)} ppm (BS-VI Passed)`,
    color,
    cubicCapacity: vehicleProfile.cc,
    seatingCapacity: vehicleProfile.seating,
    emissionNorms: vehicleProfile.fuel === 'Electric' ? 'Pure Electric Vehicle (EV)' : 'BHARAT STAGE VI (BS-VI OBD-II)',
    chassisNumberMasked: `MA${posHash % 9}EF${posHash % 99}***${1000 + (posHash % 8999)}`,
    engineNumberMasked: `EN${posHash % 99}B***${1000 + (posHash % 8999)}`,
    taxStatus: 'Life Time Tax Paid (LTT)',
    blacklistedStatus: 'Clear / No Blacklist Flag',
    isCommercial: false
  };
}

// ----------------- SAMPLE WOMEN BUS CARDS -----------------
export const SAMPLE_WOMEN_BUS_CARDS: WomenBusCardApplication[] = [
  {
    id: 'WBC-2025-01048',
    cardId: 'MSRTC-WBC-MH-94821',
    fullName: 'Anjali Ramesh Patil',
    dateOfBirth: '1992-05-14',
    age: 33,
    mobileNumber: '98221 44510',
    email: 'anjali.patil@citizen.demo',
    address: {
      street: 'Flat 402, Shivshahi Enclave, Sinhagad Road',
      cityOrTaluka: 'Haveli',
      district: 'Pune',
      pincode: '411051',
      state: 'Maharashtra'
    },
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-8492',
    photographUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    emergencyContact: {
      name: 'Ramesh Patil',
      relationship: 'Spouse',
      phoneNumber: '98221 44511'
    },
    concessionType: 'Mahila Samman (50% Concession)',
    status: 'Approved',
    appliedDate: '2025-01-15',
    verifiedDate: '2025-01-16',
    validFrom: '16-Jan-2025',
    validUntil: '15-Jan-2027',
    depotOffice: 'Pune Swargate Depot',
    qrPayload: 'https://transport.maharashtra.gov.in/verify?card=MSRTC-WBC-MH-94821&name=Anjali+Patil&status=Approved',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'WBC-2025-02194',
    cardId: 'MSRTC-WBC-MH-55209',
    fullName: 'Sunita Dnyaneshwar Shinde',
    dateOfBirth: '1947-08-15',
    age: 78,
    mobileNumber: '98902 33118',
    email: 'sunita.shinde@citizen.demo',
    address: {
      street: 'House 14, Vitthal Mandir Galli, Panchavati',
      cityOrTaluka: 'Nashik',
      district: 'Nashik',
      pincode: '422003',
      state: 'Maharashtra'
    },
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-1934',
    photographUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    emergencyContact: {
      name: 'Ganesh Shinde',
      relationship: 'Son',
      phoneNumber: '98902 33119'
    },
    concessionType: 'Amrit Jyeshtha Nagrik (100% Free - 75+ Yrs)',
    status: 'Approved',
    appliedDate: '2025-02-01',
    verifiedDate: '2025-02-02',
    validFrom: '02-Feb-2025',
    validUntil: '01-Feb-2027',
    depotOffice: 'Nashik CBS Depot',
    qrPayload: 'https://transport.maharashtra.gov.in/verify?card=MSRTC-WBC-MH-55209&name=Sunita+Shinde&status=Approved',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'WBC-2025-03810',
    fullName: 'Pooja Sanjay Deshmukh',
    dateOfBirth: '2001-11-20',
    age: 24,
    mobileNumber: '97645 10294',
    email: 'pooja.deshmukh@citizen.demo',
    address: {
      street: 'B-12, Kranti Chowk, CIDCO Sector 3',
      cityOrTaluka: 'Chhatrapati Sambhaji Nagar',
      district: 'Chhatrapati Sambhaji Nagar (Aurangabad)',
      pincode: '431003',
      state: 'Maharashtra'
    },
    idProofType: 'Voter ID',
    idProofNumber: 'EPIC-MH-20-***901',
    photographUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    emergencyContact: {
      name: 'Sanjay Deshmukh',
      relationship: 'Father',
      phoneNumber: '97645 10295'
    },
    concessionType: 'Girl Student Special Concession',
    status: 'Pending',
    appliedDate: '2025-03-10',
    depotOffice: 'Chhatrapati Sambhaji Nagar Central ST',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'WBC-2024-00912',
    cardId: 'MSRTC-WBC-MH-11204',
    fullName: 'Meena Suresh Jadhav',
    dateOfBirth: '1985-03-25',
    age: 40,
    mobileNumber: '94220 88123',
    email: 'meena.jadhav@citizen.demo',
    address: {
      street: 'Plot 45, Shivaji Peth, Near Mahalakshmi Temple',
      cityOrTaluka: 'Karveer',
      district: 'Kolhapur',
      pincode: '416012',
      state: 'Maharashtra'
    },
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-7712',
    photographUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    emergencyContact: {
      name: 'Suresh Jadhav',
      relationship: 'Spouse',
      phoneNumber: '94220 88124'
    },
    concessionType: 'Mahila Samman (50% Concession)',
    status: 'Expired',
    appliedDate: '2023-01-10',
    verifiedDate: '2023-01-12',
    validFrom: '12-Jan-2023',
    validUntil: '11-Jan-2025',
    depotOffice: 'Kolhapur Central ST Bus Station',
    qrPayload: 'https://transport.maharashtra.gov.in/verify?card=MSRTC-WBC-MH-11204&name=Meena+Jadhav&status=Expired',
    updatedAt: new Date().toISOString()
  }
];

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SERVICES_DATA, DEMO_VEHICLE } from './src/data/servicesData';
import { GoogleGenAI } from '@google/genai';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'Received' | 'In Review';
}

const contactSubmissions: ContactSubmission[] = [
  {
    id: 'ESH-2026-1001',
    name: 'Vikram Mehta',
    email: 'vikram.m@example.com',
    category: 'Vehicle Services',
    message: 'Can you please add more state-specific RTO appointment guidelines for Gujarat?',
    createdAt: '2026-08-28T10:15:00Z',
    status: 'Received'
  }
];

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch {
      geminiClient = null;
    }
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      serviceCount: SERVICES_DATA.length
    });
  });

  // API 2: List & Filter Services
  app.get('/api/services', (req, res) => {
    const { category, state, q } = req.query;
    let results = [...SERVICES_DATA];

    if (category && category !== 'All') {
      results = results.filter(
        (s) => s.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (state && state !== 'All India') {
      results = results.filter(
        (s) => s.state === 'All India' || s.state.toLowerCase() === String(state).toLowerCase()
      );
    }

    if (q) {
      const queryStr = String(q).toLowerCase().trim();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(queryStr) ||
          s.shortDescription.toLowerCase().includes(queryStr) ||
          s.category.toLowerCase().includes(queryStr) ||
          s.department?.toLowerCase().includes(queryStr) ||
          s.documents.some((d) => d.toLowerCase().includes(queryStr))
      );
    }

    res.json({
      total: results.length,
      data: results
    });
  });

  // API 3: Single Service Detail by ID or Slug
  app.get('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const service = SERVICES_DATA.find(
      (s) => s.id === id || s.slug === id
    );

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    // Also send 3 recommended/related services
    const related = SERVICES_DATA
      .filter((s) => s.id !== service.id && (s.category === service.category || s.isPopular))
      .slice(0, 3);

    res.json({
      data: service,
      related
    });
  });

  // API 4: Vehicle Summary (Demo / Custom simulation)
  app.get('/api/vehicle-summary', (req, res) => {
    const { vehicleNumber } = req.query;
    if (!vehicleNumber || String(vehicleNumber).trim() === '') {
      res.json({ data: DEMO_VEHICLE });
      return;
    }

    const cleanNum = String(vehicleNumber).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const statePrefix = cleanNum.substring(0, 2) || 'DL';

    const customVehicle = {
      ...DEMO_VEHICLE,
      vehicleNumber: String(vehicleNumber).toUpperCase().trim(),
      ownerName: 'Citizen Profile (Simulated Demo)',
      model: 'Hyundai Creta SX / Electric (Demo)',
      registrationDate: '09-Jan-2022',
      rcValidity: '08-Jan-2037 (Active)',
      fastagTagId: `NETC-${statePrefix}-` + Math.floor(10000000 + Math.random() * 90000000),
      fastagBalance: 420.50,
      pucValidity: '28-Oct-2026',
      pucStatus: 'Valid' as const,
      pendingChallans: [
        {
          id: `CH-${statePrefix}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          date: '05-Aug-2026',
          violation: 'Improper Lane Driving / Zebra Crossing Stop',
          amount: 500,
          location: `${statePrefix} City Ring Road Intercept`,
          status: 'Pending' as const
        }
      ]
    };

    res.json({ data: customVehicle });
  });

  // API 5: Contact Submissions
  app.post('/api/contact', (req, res) => {
    const { name, email, category, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }

    const newTicket: ContactSubmission = {
      id: `ESH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      category: category || 'General Information',
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: 'Received'
    };

    contactSubmissions.unshift(newTicket);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your inquiry has been logged successfully.',
      ticket: newTicket
    });
  });

  // API 6: Chatbot Endpoint with Keyword Matcher + Gemini AI enhancement
  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Valid message string is required.' });
      return;
    }

    const q = message.toLowerCase().trim();

    // Rule-based / Keyword matcher against our services
    const matched = SERVICES_DATA.filter((s) => {
      const titleMatch = s.title.toLowerCase().includes(q);
      const descMatch = s.shortDescription.toLowerCase().includes(q);
      const catMatch = s.category.toLowerCase().includes(q);
      const docMatch = s.documents.some((d) => d.toLowerCase().includes(q));
      
      // Keyword special cases
      const isFastagQuery = (q.includes('fastag') || q.includes('toll') || q.includes('recharge') || q.includes('nhai')) && s.id.includes('fastag');
      const isChallanQuery = (q.includes('challan') || q.includes('fine') || q.includes('penalty') || q.includes('traffic')) && s.id === 'echallan-payment';
      const isDLQuery = (q.includes('license') || q.includes('licence') || q.includes('driving') || q.includes('sarathi') || q.includes('llr')) && s.id === 'driving-license-sarathi';
      const isRCQuery = (q.includes('rc') || q.includes('registration') || q.includes('vahan') || q.includes('ownership')) && s.id === 'vehicle-rc-services';
      const isPUCQuery = (q.includes('puc') || q.includes('pollution') || q.includes('emission')) && s.id === 'puc-certificate-status';
      const isPanQuery = (q.includes('pan') || q.includes('tax') || q.includes('income tax')) && (s.id === 'instant-epan-card');
      const isPassportQuery = (q.includes('passport') || q.includes('psk') || q.includes('visa')) && s.id === 'passport-seva-portal';
      const isVoterQuery = (q.includes('voter') || q.includes('epic') || q.includes('election')) && s.id === 'voter-id-card-eci';
      const isAadhaarQuery = (q.includes('aadhaar') || q.includes('uidai') || q.includes('pvc')) && s.id === 'aadhaar-uidai-services';
      const isDigiLockerQuery = (q.includes('digilocker') || q.includes('vault') || q.includes('documents')) && s.id === 'digilocker-digital-vault';

      return (
        titleMatch ||
        descMatch ||
        catMatch ||
        docMatch ||
        isFastagQuery ||
        isChallanQuery ||
        isDLQuery ||
        isRCQuery ||
        isPUCQuery ||
        isPanQuery ||
        isPassportQuery ||
        isVoterQuery ||
        isAadhaarQuery ||
        isDigiLockerQuery
      );
    }).slice(0, 3);

    let replyText = '';

    if (matched.length > 0) {
      const titles = matched.map((m) => m.title).join(', ');
      replyText = `I found ${matched.length} relevant e-service(s) matching your query: ${titles}. You can click below to view complete eligibility, required documents, step-by-step guides, and direct official portal links!`;
    } else {
      // If no direct keyword match and Gemini is available, provide intelligent response
      const client = getGeminiClient();
      if (client) {
        try {
          const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert citizen assistant for the "E-Services Hub India" portal. 
The user asked: "${message}".
Explain concisely (in 2-3 short sentences) which official Indian government or utility portal they should look for (e.g. Parivahan, UIDAI, Income Tax, DigiLocker, Passport Seva, National Scholarship Portal). Always remind them that applications must be submitted on official .gov.in or certified bank portals. Keep it friendly and concise.`
          });
          replyText = response.text || "I couldn't find a direct match in our database, but you can browse the Services page or search by categories like Vehicle Services, Government, Banking, or Health.";
        } catch {
          replyText = "I couldn't find an exact match for that service in our quick index. Try browsing the Services catalog or try searching for keywords like 'FASTag', 'Driving License', 'PAN card', 'e-Challan', or 'Passport'.";
        }
      } else {
        replyText = "I couldn't find an exact match for that service. Try browsing the Services page or search with popular keywords like PAN card, FASTag recharge, Passport Seva, Driving License, or e-Challan.";
      }
    }

    res.json({
      reply: replyText,
      matchedServices: matched.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        category: s.category,
        shortDescription: s.shortDescription,
        officialUrl: s.officialUrl
      }))
    });
  });

  // Vite middleware in development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`E-Services Hub India server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

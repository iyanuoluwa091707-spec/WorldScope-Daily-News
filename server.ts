import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { 
  MOCK_LIVE_MATCHES, 
  MOCK_STANDINGS, 
  MOCK_NEXT_FIXTURES 
} from './src/services/liveScoreApi';
import {
  MARKET_QUOTES,
  generateChartSeries
} from './src/services/marketDataApi';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// ============================================================================
// API ROUTES
// ============================================================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'WorldScope Daily Server',
    time: new Date().toISOString() 
  });
});

// 2. LiveScore API Endpoint (Champions League, Premier League, Championship, League One)
app.get('/api/livescores', (req, res) => {
  try {
    const { comp, type = 'all', todayOnly } = req.query;
    const requestedComp = typeof comp === 'string' ? comp : undefined;
    const requestedType = typeof type === 'string' ? type : 'all';
    const isTodayOnly = todayOnly === 'true' || todayOnly === '1';

    let matchData = [...MOCK_LIVE_MATCHES];
    let fixtureData = [...MOCK_NEXT_FIXTURES];

    // Filter by competition if provided
    if (requestedComp && requestedComp.toLowerCase() !== 'all') {
      matchData = matchData.filter(m => m.comp.toLowerCase() === requestedComp.toLowerCase());
      fixtureData = fixtureData.filter(f => f.comp.toLowerCase() === requestedComp.toLowerCase());
    }

    // Champions League matches today filter
    if (isTodayOnly || requestedType === 'today') {
      // Live matches or FT matches from today's Champions League matchday
      matchData = matchData.filter(m => m.comp === 'Champions League');
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (requestedType === 'scores' || requestedType === 'today') {
      return res.json({ 
        success: true, 
        data: matchData, 
        timestamp, 
        total: matchData.length,
        championsLeagueToday: matchData.filter(m => m.comp === 'Champions League')
      });
    }

    if (requestedType === 'fixtures') {
      return res.json({ success: true, data: fixtureData, timestamp, total: fixtureData.length });
    }

    if (requestedType === 'standings') {
      const compKey = Object.keys(MOCK_STANDINGS).find(
        k => k.toLowerCase() === (requestedComp || 'Premier League').toLowerCase()
      ) || 'Premier League';
      return res.json({ success: true, standings: MOCK_STANDINGS[compKey], timestamp });
    }

    // Default 'all'
    const compKey = Object.keys(MOCK_STANDINGS).find(
      k => k.toLowerCase() === (requestedComp || 'Premier League').toLowerCase()
    ) || 'Premier League';

    return res.json({
      success: true,
      data: matchData,
      championsLeagueToday: MOCK_LIVE_MATCHES.filter(m => m.comp === 'Champions League'),
      standings: MOCK_STANDINGS[compKey],
      fixtures: fixtureData,
      timestamp,
      competitions: ['Champions League', 'Premier League', 'Championship', 'League One']
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch livescore data', message: error?.message });
  }
});

// 3. Live Stock Market Data API Endpoint
app.get('/api/market-data', (req, res) => {
  try {
    const { symbol = '^FTSE', timeframe = '1D', type = 'summary' } = req.query;
    const requestedSymbol = typeof symbol === 'string' ? symbol : '^FTSE';
    const requestedTimeframe = (typeof timeframe === 'string' && ['1D', '5D', '1M', '6M', '1Y'].includes(timeframe))
      ? (timeframe as '1D' | '5D' | '1M' | '6M' | '1Y')
      : '1D';

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const allQuotes = Object.values(MARKET_QUOTES);

    if (type === 'quote') {
      const quote = MARKET_QUOTES[requestedSymbol] || MARKET_QUOTES['^FTSE'];
      return res.json({ success: true, quote, timestamp });
    }

    if (type === 'chart') {
      const quote = MARKET_QUOTES[requestedSymbol] || MARKET_QUOTES['^FTSE'];
      const points = generateChartSeries(requestedSymbol, requestedTimeframe);
      return res.json({ 
        success: true, 
        symbol: requestedSymbol, 
        timeframe: requestedTimeframe, 
        quote, 
        points, 
        timestamp 
      });
    }

    // Default summary
    return res.json({
      success: true,
      data: {
        updatedAt: timestamp,
        marketStatus: 'Open',
        primaryIndices: allQuotes.filter(q => q.category === 'indices'),
        featuredStocks: allQuotes.filter(q => q.category === 'stocks'),
        commodities: allQuotes.filter(q => q.category === 'commodities'),
        currencies: allQuotes.filter(q => q.category === 'currencies'),
      },
      featuredChart: {
        symbol: requestedSymbol,
        timeframe: requestedTimeframe,
        quote: MARKET_QUOTES[requestedSymbol] || MARKET_QUOTES['^FTSE'],
        points: generateChartSeries(requestedSymbol, requestedTimeframe)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch market data', message: error?.message });
  }
});

// 4. Gemini-powered Daily Briefing API
app.post('/api/daily-briefing', async (req, res) => {
  try {
    const { mode = 'morning', category = 'all', headlines = [] } = req.body;

    const ai = getGenAI();

    // If Gemini API Key is configured, use Gemini for intelligent summarization
    if (ai) {
      const prompt = `You are the chief executive news editor of "WorldScope Daily", an authoritative global news platform.
Generate a structured, elegant ${mode === 'evening' ? 'Evening Debrief' : 'Morning Briefing'} news digest for readers today.

Source Headlines from the wire:
${headlines.length > 0 ? headlines.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n') : `
1. UK Chancellor outlines new green infrastructure bond initiative to drive economic growth
2. Global AI governance summit agrees on multilateral safety standards in Geneva
3. Premier League title race intensifies as Arsenal and Man City claim dramatic weekend victories
4. Renewable energy exceeds fossil fuel generation in European power grid for first quarter
5. Breakthrough clinical trial for targeted immunotherapy receives accelerated regulatory review`}

Format your output strictly as a valid JSON object matching this schema:
{
  "greeting": "A short, engaging greeting suitable for ${mode === 'evening' ? 'evening' : 'morning'}",
  "headline": "A sharp, compelling executive briefing title",
  "summary": "A cohesive 2-sentence executive summary synthesizing the day's primary themes",
  "keyTakeaways": [
    {
      "topic": "Global Affairs",
      "takeaway": "Brief bullet summary of key development"
    },
    {
      "topic": "Economy & Markets",
      "takeaway": "Brief bullet summary of key development"
    },
    {
      "topic": "Innovation & Tech",
      "takeaway": "Brief bullet summary of key development"
    },
    {
      "topic": "Sport & Culture",
      "takeaway": "Brief bullet summary of key development"
    }
  ],
  "quoteOfTheDay": {
    "quote": "A poignant quote relevant to current events",
    "author": "Attributed figure"
  },
  "marketPulse": "A one-sentence financial & macroeconomic snapshot",
  "readTime": "2 min read"
}

Do not wrap in markdown quotes or code blocks unless needed. Return pure JSON.`;

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let parsedBriefing: any = null;
      let successfulModel = '';

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            }
          });

          const responseText = response.text || '{}';
          const parsed = JSON.parse(responseText);
          if (parsed && parsed.headline && parsed.summary) {
            parsedBriefing = parsed;
            successfulModel = modelName;
            break;
          }
        } catch {
          // Model may be unavailable or under high demand, try next model
          continue;
        }
      }

      if (parsedBriefing && successfulModel) {
        return res.json({
          success: true,
          source: successfulModel,
          briefing: parsedBriefing,
          generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }

    // Fallback structured briefing if API key is not configured or in offline preview
    const isEvening = mode === 'evening';
    const fallbackBriefing = {
      greeting: isEvening ? 'Good Evening from the WorldScope Newsroom' : 'Good Morning from the WorldScope Newsroom',
      headline: isEvening ? 'Evening Debrief: Global Markets Steady as Tech and Clean Energy Advance' : 'Morning Digest: Key Geopolitical Talks Open as Economic Indicators Rebound',
      summary: isEvening
        ? 'As trading desks close, European and Asian markets report modest gains amid cooling inflation data. Major policy discussions continue in Brussels regarding transatlantic industrial supply chains.'
        : 'World leaders and financial delegates convene for high-stakes economic summits today. Central banks signal balanced interest rate outlooks as technology investments reach record quarterly highs.',
      keyTakeaways: [
        {
          topic: 'World Affairs',
          takeaway: 'Diplomatic envoys finalize draft framework on international AI risk management and cyber treaties.'
        },
        {
          topic: 'Economy & Markets',
          takeaway: 'FTSE 100 crosses 8,430 barrier while tech shares rally on strong corporate capital expenditure guidance.'
        },
        {
          topic: 'Science & Health',
          takeaway: 'European Space Agency validates next-generation climate observation satellite constellation data.'
        },
        {
          topic: 'Sport Wire',
          takeaway: 'UEFA Champions League quarter-finals ignite with thrilling encounters across Madrid, London, and Barcelona.'
        }
      ],
      quoteOfTheDay: {
        quote: 'In moments of unprecedented transformation, accurate clarity and resilient ambition define lasting leadership.',
        author: 'International Economic Forum Address'
      },
      marketPulse: 'Equities post broad-based gains; FTSE 100 +0.57%, S&P 500 +0.55%, Brent Crude at $74.92/bbl.',
      readTime: '2 min read'
    };

    return res.json({
      success: true,
      source: 'editorial-desk',
      briefing: fallbackBriefing,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to generate daily briefing', message: error?.message });
  }
});

// ============================================================================
// VITE DEV & PROD MIDDLEWARE
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
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
    console.log(`WorldScope Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

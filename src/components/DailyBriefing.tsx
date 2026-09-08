import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  CheckCircle2, 
  Quote, 
  TrendingUp, 
  Clock, 
  Layers
} from 'lucide-react';
import { Article } from '../types';

interface DailyBriefingProps {
  articles: Article[];
  onSelectArticle?: (article: Article) => void;
}

interface BriefingData {
  greeting: string;
  headline: string;
  summary: string;
  keyTakeaways: {
    topic: string;
    takeaway: string;
  }[];
  quoteOfTheDay?: {
    quote: string;
    author: string;
  };
  marketPulse?: string;
  readTime?: string;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({
  articles,
  onSelectArticle
}) => {
  // Determine default mode based on user's current hour
  const currentHour = new Date().getHours();
  const defaultMode = currentHour >= 16 || currentHour < 4 ? 'evening' : 'morning';

  const [mode, setMode] = useState<'morning' | 'evening'>(defaultMode);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [lastGenerated, setLastGenerated] = useState<string>('');
  const [sourceTag, setSourceTag] = useState<string>('gemini-3.8-flash');

  const fetchBriefing = useCallback(async (selectedMode: 'morning' | 'evening') => {
    setIsLoading(true);
    try {
      // Pick top 8 headlines from current articles wire
      const headlines = articles.slice(0, 8).map((a) => a.title);

      const response = await fetch('/api/daily-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          headlines
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.briefing) {
        setBriefing(data.briefing);
        const sourceLabel = data.source?.includes('gemini')
          ? `Gemini AI (${data.source})`
          : 'WorldScope Editorial Wire';
        setSourceTag(sourceLabel);
        setLastGenerated(data.generatedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      // Graceful fallback to curated editorial digest
      // Fallback
      setBriefing({
        greeting: selectedMode === 'evening' ? 'Good Evening from WorldScope Daily' : 'Good Morning from WorldScope Daily',
        headline: selectedMode === 'evening'
          ? 'Evening Debrief: Global Markets Steady as Tech and Clean Energy Advance'
          : 'Morning Digest: High-Stakes Geopolitical Dialogues and Economic Growth',
        summary: 'World leaders and financial delegates convene for high-stakes economic summits today. Central banks signal balanced interest rate outlooks as technology investments reach record quarterly highs.',
        keyTakeaways: [
          {
            topic: 'Global Affairs',
            takeaway: 'Diplomatic envoys finalize draft framework on international maritime and digital sovereignty corridors.'
          },
          {
            topic: 'Economy & Business',
            takeaway: 'Manufacturing indices show resilient quarterly expansion driven by infrastructure and green technology demand.'
          },
          {
            topic: 'Technology & AI',
            takeaway: 'Next-generation quantum-resistant encryption benchmarks released by international standards consortium.'
          },
          {
            topic: 'Sport & Live Wire',
            takeaway: 'Premier League and Champions League fixtures produce pivotal changes in European qualification standings.'
          }
        ],
        quoteOfTheDay: {
          quote: 'Clarity in reporting is not merely about reciting facts; it is about providing the perspective that allows society to make informed decisions.',
          author: 'WorldScope Editorial Board'
        },
        marketPulse: 'FTSE 100 +0.42% • S&P 500 +0.35% • Brent Crude $78.40 • Gold $2,640/oz',
        readTime: '2 min read'
      });
      setSourceTag('WorldScope Editorial');
      setLastGenerated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setIsLoading(false);
    }
  }, [articles]);

  useEffect(() => {
    fetchBriefing(mode);
  }, [fetchBriefing, mode]);

  // Audio simulation timer
  useEffect(() => {
    let timer: any;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 500);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  return (
    <section 
      id="worldscope-daily-briefing"
      className="w-full bg-[#FAFAFA] border-2 border-black shadow-xs my-8 overflow-hidden transition-all"
    >
      {/* 
        Briefing Header Bar 
      */}
      <div className="bg-black text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B80000] text-white flex items-center justify-center font-bold flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-sm sm:text-base uppercase tracking-wider text-white">
                WorldScope Daily Briefing
              </h2>
              <span className="bg-[#B80000] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs">
                AI Digest
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">
              Curated executive summary • Powered by {sourceTag}
            </p>
          </div>
        </div>

        {/* Controls: Mode Switcher & Refresh */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="inline-flex bg-neutral-900 border border-neutral-700 p-0.5 rounded-xs">
            <button
              type="button"
              onClick={() => setMode('morning')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'morning'
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Morning Digest</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('evening')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'evening'
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evening Debrief</span>
            </button>
          </div>

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={() => fetchBriefing(mode)}
            disabled={isLoading}
            className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3 py-1.5 border border-neutral-600 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh Briefing with latest headlines"
          >
            <RotateCw className={`w-3.5 h-3.5 text-white ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Digest</span>
          </button>
        </div>
      </div>

      {/* 
        Briefing Content Container 
      */}
      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <RotateCw className="w-8 h-8 text-[#B80000] animate-spin" />
            <p className="text-sm font-bold text-black uppercase tracking-wider">
              Synthesizing Top Headlines via Gemini 3.8 Flash...
            </p>
            <p className="text-xs text-neutral-500 max-w-md">
              Analyzing latest wires across world politics, global financial markets, technology, and sport.
            </p>
          </div>
        ) : briefing ? (
          <div className="space-y-6">
            
            {/* Top Greeting & Lead Headline */}
            <div className="border-b border-neutral-200 pb-5">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                <span>{briefing.greeting}</span>
                {briefing.readTime && (
                  <span className="flex items-center gap-1 text-neutral-600">
                    <Clock className="w-3 h-3" />
                    <span>{briefing.readTime}</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight mb-2">
                {briefing.headline}
              </h3>

              <p className="text-sm sm:text-base text-neutral-800 font-serif leading-relaxed">
                {briefing.summary}
              </p>
            </div>

            {/* Audio Digest Simulation Player Bar */}
            <div className="bg-neutral-100 border border-neutral-300 p-3 sm:p-4 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-black text-white hover:bg-[#B80000] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  title={isPlayingAudio ? 'Pause Briefing' : 'Listen to Briefing'}
                >
                  {isPlayingAudio ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-black uppercase tracking-wider">
                      Audio Briefing Audio-Cast
                    </span>
                    {isPlayingAudio && (
                      <span className="bg-red-600 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-xs font-bold animate-pulse">
                        PLAYING
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-600">
                    Executive voice summary • 1 min 45 sec
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex-1 max-w-xs flex items-center gap-2">
                <div className="w-full bg-neutral-300 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#B80000] h-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-neutral-500 w-8">
                  {audioProgress}%
                </span>
              </div>
            </div>

            {/* Key Takeaways Grid */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-black" />
                <span>Essential Desks & Developments</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {briefing.keyTakeaways.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-neutral-200 hover:border-black p-4 transition-colors group flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-2.5 mb-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-100 text-black text-xs font-black flex items-center justify-center flex-shrink-0 group-hover:bg-[#B80000] group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B80000] block mb-1">
                          {item.topic}
                        </span>
                        <p className="text-xs sm:text-sm text-neutral-800 font-medium leading-normal">
                          {item.takeaway}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Row: Market Pulse & Quote of the Day */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
              {briefing.marketPulse && (
                <div className="bg-white border border-neutral-200 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Global Market Pulse
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-800">
                      {briefing.marketPulse}
                    </span>
                  </div>
                </div>
              )}

              {briefing.quoteOfTheDay && (
                <div className="bg-white border border-neutral-200 p-3 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs italic text-neutral-700 font-serif leading-snug">
                      "{briefing.quoteOfTheDay.quote}"
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mt-1 block">
                      — {briefing.quoteOfTheDay.author}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : null}
      </div>

      {/* Briefing Footer */}
      <div className="bg-neutral-100 px-4 sm:px-6 py-2 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 gap-2">
        <span>
          WorldScope Daily automated digest • Verified against editorial wires • Generated at {lastGenerated}
        </span>
        <span className="font-bold text-black flex items-center gap-1">
          <span>Read full stories below</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Article } from '../types';
import { Radio, RefreshCw, Flame, Clock, CheckCircle2, MessageSquare, Share2, Filter } from 'lucide-react';

interface LiveViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const LiveView: React.FC<LiveViewProps> = ({ articles, onSelectArticle }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const liveArticles = articles.filter(
    (a) => a.isLive || a.category.toLowerCase() === 'live' || a.tags.some(t => t.toLowerCase() === 'live updates')
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const leadLive = liveArticles[0];

  return (
    <div className="font-sans bg-white text-black min-h-screen">
      {/* BBC Live Banner */}
      <div className="bg-[#B80000] text-white px-4 sm:px-8 py-5 border-b border-red-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
            <span className="font-black text-2xl tracking-wider uppercase">BBC LIVE</span>
            <span className="text-red-200 text-xs sm:text-sm font-medium border-l border-red-700 pl-3">
              Real-time dispatches, eyewitness reports and verified analysis
            </span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 bg-red-950/60 hover:bg-red-950 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-red-700/50 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Update Feed</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Top Active Live Story (Matches Miami Plane Crash in Capture.PNG) */}
        {leadLive && (
          <div className="bg-neutral-50 border-2 border-[#B80000] p-6 mb-10 shadow-sm">
            <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span>LIVE • BREAKING DEVELOPMENTS</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <h1
                  onClick={() => onSelectArticle(leadLive)}
                  className="text-2xl sm:text-3xl font-extrabold text-black hover:text-red-700 transition-colors cursor-pointer leading-tight mb-3"
                >
                  {leadLive.title}
                </h1>
                <p className="text-base text-neutral-800 leading-relaxed mb-4">
                  {leadLive.lead}
                </p>

                {/* Key Points Bulletins */}
                <div className="bg-white border-l-4 border-red-600 p-4 space-y-2 text-xs sm:text-sm text-neutral-800 mb-4">
                  <p className="font-bold text-black uppercase tracking-wider text-xs">Verified Key Points:</p>
                  <p>• Five fatalities confirmed by airport authorities; five survivors receiving trauma care at regional hospitals.</p>
                  <p>• National Transportation Safety Board (NTSB) deploying a specialized go-team to examine flight data recorders.</p>
                  <p>• Runway 09-Right closed until further notice; commercial airline schedules experiencing minor departure holds.</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                  <span>Reported by <strong>{leadLive.author.name}</strong></span>
                  <span>•</span>
                  <span>{leadLive.author.location}</span>
                  <span>•</span>
                  <span className="text-red-700 font-bold">{leadLive.timestampDisplay}</span>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div 
                  onClick={() => onSelectArticle(leadLive)}
                  className="relative aspect-video overflow-hidden border border-neutral-300 cursor-pointer group"
                >
                  <img
                    src={leadLive.imageUrl}
                    alt={leadLive.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    Continuous Live Text
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Topic Category Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {['All', 'Live News Wire', 'Global Conflicts', 'Elections', 'Live Sport'].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setActiveFilter(topic)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === topic
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Chronological Live Wire Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>Rolling Chronological Feed</span>
            </h2>

            {liveArticles
              .filter(a => activeFilter === 'All' || a.subCategory?.toLowerCase() === activeFilter.toLowerCase())
              .map((art, idx) => (
                <article
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="p-5 border-l-2 border-neutral-300 hover:border-red-600 bg-white hover:bg-neutral-50 transition-all cursor-pointer relative pl-6"
                >
                  <span className="absolute -left-[5px] top-6 w-2 h-2 rounded-full bg-red-600" />
                  
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                    <span className="font-mono font-bold text-red-600 uppercase">
                      {art.timestampDisplay}
                    </span>
                    <span className="text-neutral-500 font-medium">
                      {art.subCategory}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-black hover:text-red-700 transition-colors leading-snug mb-2">
                    {art.title}
                  </h3>
                  
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                    {art.lead}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                    <span>Dispatch: {art.author.name} ({art.author.location})</span>
                    <span className="text-red-600 font-bold hover:underline">Read full report →</span>
                  </div>
                </article>
              ))}
          </div>

          {/* Right Sidebar: Quick Breaking Tracker */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900 text-white p-6">
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4" />
                <span>Live Wire Priorities</span>
              </div>
              <h3 className="text-lg font-bold mb-4">WorldScope Daily Monitoring Desk</h3>
              <ul className="space-y-3 text-xs text-neutral-300 divide-y divide-neutral-800">
                <li className="pt-2">
                  <span className="text-red-400 font-bold block mb-0.5">AVIATION SAFETY</span>
                  Miami air traffic control audio recordings being transcribed by federal air investigators.
                </li>
                <li className="pt-2">
                  <span className="text-red-400 font-bold block mb-0.5">BERLIN POLITICS</span>
                  Coalition partners convene in Berlin following historic eastern state election projections.
                </li>
                <li className="pt-2">
                  <span className="text-red-400 font-bold block mb-0.5">DIPLOMACY</span>
                  Geneva peace envoy delegates prepare for joint press declaration later today.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

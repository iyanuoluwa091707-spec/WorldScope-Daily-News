import React, { useState } from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { Play, Pause, Volume2, Radio, Headphones, Mic, Bookmark, Clock, Share2, Sparkles } from 'lucide-react';

interface AudioViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenNewsletters?: (id?: string) => void;
}

interface RadioStation {
  id: string;
  name: string;
  dial: string;
  currentShow: string;
  host: string;
  accentColor: string;
}

const LIVE_STATIONS: RadioStation[] = [
  { id: 'r4', name: 'WorldScope Radio 4', dial: 'FM 92-95 MHz', currentShow: 'Today Programme', host: 'Mishal Husain & Nick Robinson', accentColor: '#1E3A8A' },
  { id: 'r5', name: 'WorldScope 5 Live', dial: 'AM 693 & 909', currentShow: '5 Live Sport Live', host: 'Mark Chapman', accentColor: '#15803D' },
  { id: 'ws', name: 'WorldScope World Service', dial: 'Shortwave & Digital', currentShow: 'Newshour Global', host: 'Julian Marshall', accentColor: '#B91C1C' },
  { id: 'r6', name: 'WorldScope 6 Music', dial: 'DAB Digital', currentShow: 'The New Music Fix', host: 'Steve Lamacq', accentColor: '#7C3AED' },
];

export const AudioView: React.FC<AudioViewProps> = ({ articles, onSelectArticle }) => {
  const [activeStation, setActiveStation] = useState<RadioStation>(LIVE_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [savedEpisodes, setSavedEpisodes] = useState<string[]>([]);

  const audioArticles = articles.filter(a => a.category.toLowerCase() === 'audio' || a.tags.some(t => t.toLowerCase().includes('audio') || t.toLowerCase().includes('sound')));

  const toggleSave = (id: string) => {
    setSavedEpisodes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="font-sans bg-[#0d0d11] text-white min-h-screen">
      {/* WorldScope Audio Brand Banner */}
      <div className="bg-[#EA580C] text-white border-b border-orange-600 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Headphones className="w-6 h-6 text-white" />
              <span className="font-black text-2xl tracking-wider uppercase">WORLDSCOPE AUDIO</span>
            </div>
            <p className="text-orange-100 text-sm font-medium">
              Music, radio, podcasts and audio documentaries from WorldScope Daily Newsroom
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/30 backdrop-blur-xs rounded-full text-xs font-bold text-white uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Streaming Active
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Interactive Live Radio Player */}
        <section className="bg-neutral-900 border border-neutral-800 p-6 mb-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-[#EA580C] hover:bg-[#c2410c] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg cursor-pointer"
                aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
              </button>
              <div>
                <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-0.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>{activeStation.name} • {activeStation.dial}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{activeStation.currentShow}</h2>
                <p className="text-sm text-neutral-400">Presented by {activeStation.host}</p>
              </div>
            </div>

            {/* Station Picker */}
            <div className="flex flex-wrap items-center gap-2">
              {LIVE_STATIONS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setActiveStation(st);
                    setIsPlaying(true);
                  }}
                  className={`px-3 py-2 text-xs font-bold transition-all border ${
                    activeStation.id === st.id
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Equalizer Visualizer when playing */}
          {isPlaying && (
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-orange-500 animate-pulse" />
                <span className="w-1 h-5 bg-orange-400 animate-pulse delay-75" />
                <span className="w-1 h-2 bg-orange-600 animate-pulse delay-150" />
                <span className="w-1 h-6 bg-orange-300 animate-pulse delay-100" />
                <span className="w-1 h-4 bg-orange-500 animate-pulse" />
                <span className="ml-2 text-xs font-mono text-orange-400">LIVE DAB 192kbps AAC STEREO</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-neutral-400" />
                <span>Broadcasting live from London Broadcasting House</span>
              </div>
            </div>
          )}
        </section>

        {/* Category Navigation Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {['All', 'Podcasts', 'Radio 4', 'Radio 5 Live', 'World Service', 'Documentaries'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-orange-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            {audioArticles.length} WorldScope Audio Dispatches
          </span>
        </div>

        {/* Featured Audio Shows & Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {audioArticles
            .filter((a) => activeTab === 'All' || a.subCategory?.toLowerCase() === activeTab.toLowerCase())
            .map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all p-4 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video mb-3 overflow-hidden bg-black">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#EA580C] text-white text-[11px] font-bold uppercase tracking-wider">
                        <Headphones className="w-3 h-3" />
                        {art.readTime || 'Listen'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-orange-400 font-bold uppercase tracking-wider block mb-1">
                    {art.subCategory || 'WorldScope Podcast'}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors leading-snug mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                    {art.lead}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>{art.author.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(art.id);
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Bookmark episode"
                  >
                    <Bookmark className={`w-4 h-4 ${savedEpisodes.includes(art.id) ? 'fill-orange-500 text-orange-500' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

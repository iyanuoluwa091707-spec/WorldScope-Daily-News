import React, { useState } from 'react';
import { Article } from '../types';
import { Play, Pause, Maximize2, Volume2, Video, Tv, CheckCircle, ShieldCheck, Clock, Share2 } from 'lucide-react';

interface VideoViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const VideoView: React.FC<VideoViewProps> = ({ articles, onSelectArticle }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeChannel, setActiveChannel] = useState<string>('worldscope-news-live');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');

  const videoArticles = articles.filter(
    (a) => a.category.toLowerCase() === 'video' || a.tags.some(t => t.toLowerCase().includes('video'))
  );

  const featuredVideo = videoArticles[0];
  const playlistVideos = videoArticles.slice(1);

  return (
    <div className="font-sans bg-[#0c0a17] text-white min-h-screen">
      {/* WorldScope Video Brand Header */}
      <div className="bg-[#1e1b4b] border-b border-indigo-900 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tv className="w-6 h-6 text-indigo-400" />
              <span className="font-black text-2xl tracking-wider uppercase text-white">WORLDSCOPE VIDEO</span>
            </div>
            <p className="text-indigo-200 text-sm font-medium">
              Watch live WorldScope Daily News channel, investigative documentaries, explainers and match highlights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-full text-xs font-bold text-white uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              WorldScope News Channel Live
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Main Stage: Live Video Player & Channel Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Video Screen */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative aspect-video bg-black rounded-xs overflow-hidden shadow-2xl border border-neutral-800 group">
              <img
                src={featuredVideo?.imageUrl || 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80'}
                alt="WorldScope Video Stream"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 flex flex-col justify-between p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE 1080p HD
                  </span>
                  <div className="flex items-center gap-3 text-xs text-neutral-300 font-mono">
                    <span>1,420,500 VIEWING NOW</span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center transition-transform hover:scale-110 shadow-2xl cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 fill-black" />
                    ) : (
                      <Play className="w-8 h-8 fill-black ml-1" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">WorldScope Daily Global Service</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-neutral-800/80 px-2 py-0.5 rounded text-[11px] font-mono">SUBTITLES: EN</span>
                    <Maximize2 className="w-4 h-4 text-white cursor-pointer hover:text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Details */}
            <div className="mt-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {featuredVideo?.subCategory || 'Watch Live'} • Broadcast Feed
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-2 leading-tight">
                {featuredVideo?.title || 'Watch Live: WorldScope Daily 24/7 Channel continuous rolling international stream'}
              </h1>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
                {featuredVideo?.lead || 'Continuous live broadcast with correspondents reporting on the ground from Washington, Kyiv, Beijing, and Westminster.'}
              </p>
            </div>
          </div>

          {/* Up Next & Live News Feeds Playlist */}
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4 pb-2 border-b border-neutral-800 flex items-center justify-between">
              <span>Up Next on WorldScope Video</span>
              <span className="text-xs text-indigo-400 font-medium">Auto-play On</span>
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[560px] pr-1">
              {playlistVideos.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="group flex gap-3 p-2 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/60 hover:border-neutral-700 transition-all cursor-pointer"
                >
                  <div className="relative w-32 aspect-video shrink-0 overflow-hidden bg-black">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <Play className="w-4 h-4 fill-white text-white drop-shadow" />
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 text-[10px] font-mono text-white">
                      {art.readTime}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block truncate">
                      {art.subCategory}
                    </span>
                    <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {art.author.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Category Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {['All', 'Watch Live', 'Investigations', 'Explainers', 'Sport Highlights', 'Must Watch'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedSubCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                selectedSubCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoArticles
            .filter((a) => selectedSubCategory === 'All' || a.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase())
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
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/90 px-1.5 py-0.5 text-[10px] font-mono text-white font-bold">
                      {art.readTime}
                    </span>
                  </div>

                  <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                    {art.subCategory}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {art.lead}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>{art.author.name}</span>
                  <span className="text-[11px] font-mono">{art.timestampDisplay}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

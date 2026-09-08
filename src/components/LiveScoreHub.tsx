import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  RotateCw, 
  Calendar, 
  Table as TableIcon, 
  Radio, 
  Clock, 
  ChevronRight, 
  Bell, 
  Check, 
  Info,
  Tv,
  MapPin,
  Flame,
  Activity
} from 'lucide-react';
import { 
  LiveScoreApi, 
  LiveMatch, 
  CompetitionStandings, 
  NextFixture 
} from '../services/liveScoreApi';

interface LiveScoreHubProps {
  onSelectTeamFilter?: (teamName: string) => void;
  initialTab?: 'scores' | 'standings' | 'fixtures';
  initialComp?: string;
}

const COMPETITIONS = [
  'Champions League',
  'Premier League',
  'Championship',
  'League One'
];

export const LiveScoreHub: React.FC<LiveScoreHubProps> = ({ 
  onSelectTeamFilter,
  initialTab = 'scores',
  initialComp = 'Premier League'
}) => {
  const [activeTab, setActiveTab] = useState<'scores' | 'standings' | 'fixtures'>(initialTab);
  const [activeComp, setActiveComp] = useState<string>(() => {
    if (initialComp && COMPETITIONS.includes(initialComp)) return initialComp;
    return 'Premier League';
  });
  const [scoreFilter, setScoreFilter] = useState<'all' | 'live' | 'ft'>('all');

  useEffect(() => {
    if (initialComp && COMPETITIONS.includes(initialComp)) {
      setActiveComp(initialComp);
    }
  }, [initialComp]);
  
  // Data states
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [standings, setStandings] = useState<CompetitionStandings | null>(null);
  const [fixtures, setFixtures] = useState<NextFixture[]>([]);
  
  // Status states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [alertFixtures, setAlertFixtures] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch data
  const fetchData = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      if (activeTab === 'scores') {
        const res = await LiveScoreApi.getLiveScores(activeComp);
        setMatches(res.data);
        setLastUpdated(res.timestamp);
      } else if (activeTab === 'standings') {
        const res = await LiveScoreApi.getStandings(activeComp);
        setStandings(res);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else if (activeTab === 'fixtures') {
        const res = await LiveScoreApi.getNextFixtures(activeComp);
        setFixtures(res.data);
        setLastUpdated(res.timestamp);
      }
    } catch (e) {
      console.error('Error fetching LiveScore API data:', e);
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  }, [activeTab, activeComp]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Live auto-refresh simulation every 25 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(false);
    }, 25000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handleToggleAlert = (fixtureId: string, matchTitle: string) => {
    setAlertFixtures((prev) => {
      const newState = !prev[fixtureId];
      if (newState) {
        showToast(`Match alert set for ${matchTitle}`);
      } else {
        showToast(`Alert removed for ${matchTitle}`);
      }
      return { ...prev, [fixtureId]: newState };
    });
  };

  const filteredMatches = matches.filter((m) => {
    if (scoreFilter === 'live') return m.status === 'LIVE';
    if (scoreFilter === 'ft') return m.status === 'FT';
    return true;
  });

  const liveMatchesCount = matches.filter((m) => m.status === 'LIVE').length;

  return (
    <div id="bbc-livescore-hub" className="w-full bg-[#121212] text-white border-y-2 border-[#FFD200] overflow-hidden my-6 shadow-xl">
      {/* Toast notification */}
      {toastMessage && (
        <div className="bg-[#FFD200] text-black font-bold text-xs px-4 py-2 text-center transition-all animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* 
        Header Row: LiveScore API Header 
      */}
      <div className="bg-black px-4 sm:px-6 py-3 border-b border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFD200] text-black font-black text-xs px-2.5 py-1 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>LiveScore API</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-mono text-[11px] text-green-400 bg-green-950/60 border border-green-800/80 px-2 py-0.5 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE FEED CONNECTED
            </span>
            {lastUpdated && (
              <span className="text-neutral-400 text-[11px] hidden sm:inline-block">
                Updated {lastUpdated}
              </span>
            )}
          </div>
        </div>

        {/* Action controls: Refresh button & Auto-refresh toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-[11px] px-2.5 py-1 border transition-colors cursor-pointer flex items-center gap-1.5 ${
              autoRefresh 
                ? 'bg-neutral-800 border-neutral-600 text-[#FFD200]' 
                : 'bg-neutral-900 border-neutral-700 text-neutral-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-[#FFD200]' : 'bg-neutral-600'}`} />
            <span>Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={isLoading}
            className="bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold px-3 py-1 border border-neutral-600 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Fetch latest updates from LiveScore API"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#FFD200] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh API</span>
          </button>
        </div>
      </div>

      {/* 
        Primary Hub Tabs: Latest Scores | Table Standings | Next Fixtures 
      */}
      <div className="bg-[#1a1a1a] px-4 sm:px-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'scores'
                ? 'border-[#FFD200] text-[#FFD200] bg-neutral-900'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Flame className="w-4 h-4 text-[#FFD200]" />
            <span>Latest Scores</span>
            {liveMatchesCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-xs font-bold animate-pulse">
                {liveMatchesCount} LIVE
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'standings'
                ? 'border-[#FFD200] text-[#FFD200] bg-neutral-900'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <TableIcon className="w-4 h-4 text-[#FFD200]" />
            <span>Table Standings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fixtures')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'fixtures'
                ? 'border-[#FFD200] text-[#FFD200] bg-neutral-900'
                : 'border-transparent text-neutral-300 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#FFD200]" />
            <span>Next Fixtures</span>
          </button>
        </div>

        {/* Competition Selector */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          {COMPETITIONS.map((comp) => (
            <button
              key={comp}
              type="button"
              onClick={() => setActiveComp(comp)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-xs whitespace-nowrap transition-colors cursor-pointer ${
                activeComp === comp
                  ? 'bg-[#FFD200] text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* 
        TAB CONTENT: LATEST SCORES 
      */}
      {activeTab === 'scores' && (
        <div className="p-4 sm:p-6">
          {/* Champions League Matches Today Quick Banner */}
          <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900 to-black border border-blue-900/60 p-3.5 mb-5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping inline-block" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                    Champions League Today
                  </span>
                  <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-xs animate-pulse">
                    LIVE
                  </span>
                </div>
                <div className="text-xs text-neutral-300">
                  Quarter-Final 1st Leg showdowns: Real Madrid vs Bayern (71' LIVE) • Arsenal vs Inter (64' LIVE) • Barca 3-1 PSG • Man City 2-2 Juventus
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveComp('Champions League')}
              className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeComp === 'Champions League'
                  ? 'bg-[#FFD200] text-black shadow-xs'
                  : 'bg-blue-900/50 hover:bg-blue-800 text-blue-200 border border-blue-700'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-current" />
              <span>{activeComp === 'Champions League' ? 'Viewing UCL Today' : 'Show UCL Matches Today'}</span>
            </button>
          </div>

          {/* Sub-filter: All / Live Only / Full Time */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Filter Status:
              </span>
              <div className="inline-flex bg-neutral-900 border border-neutral-700 p-0.5 rounded-xs">
                <button
                  type="button"
                  onClick={() => setScoreFilter('all')}
                  className={`px-3 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                    scoreFilter === 'all'
                      ? 'bg-[#FFD200] text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({matches.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScoreFilter('live')}
                  className={`px-3 py-1 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                    scoreFilter === 'live'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Live ({liveMatchesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setScoreFilter('ft')}
                  className={`px-3 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                    scoreFilter === 'ft'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Full Time ({matches.filter((m) => m.status === 'FT').length})
                </button>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#FFD200]" />
              <span>Click any club to filter news coverage</span>
            </div>
          </div>

          {/* Matches Grid */}
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-sm font-bold">No matches found matching the current filter.</p>
              <button
                type="button"
                onClick={() => setScoreFilter('all')}
                className="mt-3 text-xs text-[#FFD200] underline font-bold cursor-pointer"
              >
                Show All Matches
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-[#FFD200] p-4 flex flex-col justify-between transition-all group"
                >
                  {/* Top Bar: League, Round & Minute Status */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#FFD200] tracking-wider">
                        {match.comp}
                      </span>
                      <span className="text-[10px] text-neutral-500">• {match.round}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs ${
                        match.status === 'LIVE'
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {match.timeDisplay}
                    </span>
                  </div>

                  {/* Team Scores Line */}
                  <div className="space-y-2 mb-3">
                    <div 
                      onClick={() => onSelectTeamFilter && onSelectTeamFilter(match.homeTeam)}
                      className="flex items-center justify-between group/team cursor-pointer hover:bg-neutral-800/40 p-1 rounded-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-neutral-500 w-8">{match.homeShort}</span>
                        <span className="font-bold text-sm sm:text-base text-white group-hover/team:text-[#FFD200] transition-colors">
                          {match.homeTeam}
                        </span>
                      </div>
                      <span className="font-mono text-lg sm:text-xl font-black text-[#FFD200]">
                        {match.homeScore ?? '-'}
                      </span>
                    </div>

                    <div 
                      onClick={() => onSelectTeamFilter && onSelectTeamFilter(match.awayTeam)}
                      className="flex items-center justify-between group/team cursor-pointer hover:bg-neutral-800/40 p-1 rounded-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-neutral-500 w-8">{match.awayShort}</span>
                        <span className="font-bold text-sm sm:text-base text-white group-hover/team:text-[#FFD200] transition-colors">
                          {match.awayTeam}
                        </span>
                      </div>
                      <span className="font-mono text-lg sm:text-xl font-black text-[#FFD200]">
                        {match.awayScore ?? '-'}
                      </span>
                    </div>
                  </div>

                  {/* Scorers / Key Events */}
                  {match.scorers && match.scorers.length > 0 && (
                    <div className="bg-black/50 p-2 border-t border-neutral-800/80 mb-3 space-y-1 text-[11px] text-neutral-300">
                      {match.scorers.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px]">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="text-[#FFD200]">⚽</span>
                            <span className="font-medium text-neutral-200">{s.player}</span>
                            {s.isPenalty && <span className="text-neutral-400">(pen)</span>}
                          </span>
                          <span className="font-mono text-neutral-400">{s.minute}'</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Match Stats / Venue Footer */}
                  <div className="border-t border-neutral-800 pt-2 flex flex-col gap-1 text-[10px] text-neutral-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span className="truncate">{match.venue}</span>
                      </span>
                      {match.broadcast && (
                        <span className="flex items-center gap-1 text-[#FFD200] flex-shrink-0">
                          <Tv className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{match.broadcast.split('/')[0]}</span>
                        </span>
                      )}
                    </div>

                    {match.stats && (
                      <div className="mt-1 pt-1 border-t border-neutral-800/60 flex items-center justify-between text-[9px] font-mono text-neutral-500">
                        <span>Possession: {match.stats.possession[0]}% - {match.stats.possession[1]}%</span>
                        <span>Shots: {match.stats.shots[0]} - {match.stats.shots[1]}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 
        TAB CONTENT: TABLE STANDINGS 
      */}
      {activeTab === 'standings' && standings && (
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFD200]" />
                <span>{standings.competition} Standings</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Season {standings.season} • Live official league standings
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs flex-wrap">
              {standings.competition === 'Champions League' ? (
                <>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    <span>Round of 16 (Top 8)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200] inline-block" />
                    <span>Knockout Play-offs (9-24)</span>
                  </span>
                </>
              ) : standings.competition === 'Premier League' ? (
                <>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    <span>Champions League (1-4)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200] inline-block" />
                    <span>Europa League (5)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span>Relegation (18-20)</span>
                  </span>
                </>
              ) : standings.competition === 'Championship' ? (
                <>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    <span>Auto Promotion (1-2)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200] inline-block" />
                    <span>Play-offs (3-6)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span>Relegation (22-24)</span>
                  </span>
                </>
              ) : standings.competition === 'League One' ? (
                <>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    <span>Auto Promotion (1-2)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200] inline-block" />
                    <span>Play-offs (3-6)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span>Relegation (21-24)</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    <span>Top / Promotion</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200] inline-block" />
                    <span>Playoffs</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span>Relegation</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-neutral-700 text-neutral-400 uppercase text-[10px] font-black tracking-wider">
                  <th className="py-2.5 px-2 text-center w-8">Pos</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-2 text-center">P</th>
                  <th className="py-2.5 px-2 text-center">W</th>
                  <th className="py-2.5 px-2 text-center">D</th>
                  <th className="py-2.5 px-2 text-center">L</th>
                  <th className="py-2.5 px-2 text-center">GF</th>
                  <th className="py-2.5 px-2 text-center">GA</th>
                  <th className="py-2.5 px-2 text-center">GD</th>
                  <th className="py-2.5 px-3 text-center font-black text-[#FFD200]">Pts</th>
                  <th className="py-2.5 px-3 text-center hidden md:table-cell">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {standings.teams.map((t) => {
                  const isUCL = t.zone === 'ucl' || t.zone === 'promo';
                  const isUEL = t.zone === 'uel' || t.zone === 'playoff';
                  const isRelegation = t.zone === 'relegation';

                  return (
                    <tr
                      key={t.team}
                      onClick={() => onSelectTeamFilter && onSelectTeamFilter(t.team)}
                      className="hover:bg-neutral-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-2 px-2 text-center font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-xs text-[11px] font-bold ${
                            isUCL
                              ? 'bg-green-600 text-white'
                              : isUEL
                              ? 'bg-[#FFD200] text-black'
                              : isRelegation
                              ? 'bg-red-600 text-white'
                              : 'text-neutral-400 bg-neutral-800'
                          }`}
                        >
                          {t.rank}
                        </span>
                      </td>

                      <td className="py-2 px-3 font-bold text-white group-hover:text-[#FFD200] transition-colors whitespace-nowrap">
                        {t.team}
                      </td>

                      <td className="py-2 px-2 text-center font-mono text-neutral-300">{t.played}</td>
                      <td className="py-2 px-2 text-center font-mono text-neutral-300">{t.won}</td>
                      <td className="py-2 px-2 text-center font-mono text-neutral-300">{t.drawn}</td>
                      <td className="py-2 px-2 text-center font-mono text-neutral-300">{t.lost}</td>
                      <td className="py-2 px-2 text-center font-mono text-neutral-400">{t.goalsFor}</td>
                      <td className="py-2 px-2 text-center font-mono text-neutral-400">{t.goalsAgainst}</td>
                      <td className={`py-2 px-2 text-center font-mono font-bold ${t.goalDiff > 0 ? 'text-green-400' : t.goalDiff < 0 ? 'text-red-400' : 'text-neutral-400'}`}>
                        {t.goalDiff > 0 ? `+${t.goalDiff}` : t.goalDiff}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-black text-sm text-[#FFD200]">
                        {t.points}
                      </td>
                      <td className="py-2 px-3 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {t.form.map((res, idx) => (
                            <span
                              key={idx}
                              className={`w-4 h-4 rounded-xs flex items-center justify-center text-[9px] font-bold ${
                                res === 'W'
                                  ? 'bg-green-600 text-white'
                                  : res === 'D'
                                  ? 'bg-neutral-600 text-neutral-200'
                                  : 'bg-red-600 text-white'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 
        TAB CONTENT: NEXT FIXTURES 
      */}
      {activeTab === 'fixtures' && (
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FFD200]" />
                <span>Upcoming {activeComp} Fixtures</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Official BBC Sport Matchday Calendar & Broadcast Guide
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {fixtures.map((fix) => {
              const isAlertSet = alertFixtures[fix.id];
              return (
                <div
                  key={fix.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-[#FFD200] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  {/* Left: Date, Matchday & Venue */}
                  <div className="flex flex-col gap-1 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#FFD200] uppercase tracking-wider">
                        {fix.date}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono bg-neutral-800 px-1.5 py-0.5 rounded-xs">
                        {fix.time}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 truncate">{fix.venue}</span>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">{fix.matchday}</span>
                  </div>

                  {/* Middle: Teams matchup */}
                  <div className="flex items-center gap-4 flex-grow justify-center">
                    <button
                      type="button"
                      onClick={() => onSelectTeamFilter && onSelectTeamFilter(fix.homeTeam)}
                      className="font-bold text-sm sm:text-base text-white hover:text-[#FFD200] text-right flex-1 truncate transition-colors cursor-pointer"
                    >
                      {fix.homeTeam}
                    </button>

                    <div className="bg-black border border-neutral-700 px-3 py-1 font-mono font-black text-xs text-[#FFD200] rounded-xs flex-shrink-0">
                      VS
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectTeamFilter && onSelectTeamFilter(fix.awayTeam)}
                      className="font-bold text-sm sm:text-base text-white hover:text-[#FFD200] text-left flex-1 truncate transition-colors cursor-pointer"
                    >
                      {fix.awayTeam}
                    </button>
                  </div>

                  {/* Right: Broadcast & Alert Button */}
                  <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 border-t md:border-t-0 border-neutral-800 pt-2 md:pt-0">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                      <Tv className="w-3.5 h-3.5 text-[#FFD200]" />
                      <span className="text-[11px] truncate max-w-[150px]">{fix.broadcast}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAlert(fix.id, `${fix.homeTeam} vs ${fix.awayTeam}`)}
                      className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs ${
                        isAlertSet
                          ? 'bg-green-600 text-white'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600'
                      }`}
                      title={isAlertSet ? 'Reminder is set' : 'Set match reminder'}
                    >
                      {isAlertSet ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Alert Set</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5 text-[#FFD200]" />
                          <span>Set Alert</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

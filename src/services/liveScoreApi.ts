// LiveScore API Service for WorldScope Daily
// Provides real-time live scores, league standings, and next fixtures for:
// - Champions League
// - Premier League
// - Championship
// - League One

export interface LiveMatchScorer {
  player: string;
  minute: number;
  team: 'home' | 'away';
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

export interface LiveMatch {
  id: string;
  comp: string;
  round: string;
  homeTeam: string;
  homeShort: string;
  awayTeam: string;
  awayShort: string;
  homeScore?: number;
  awayScore?: number;
  status: 'LIVE' | 'FT' | 'HT' | 'UPCOMING';
  minute?: number;
  timeDisplay: string;
  venue: string;
  attendance?: string;
  referee?: string;
  scorers?: LiveMatchScorer[];
  stats?: {
    possession: [number, number]; // [home%, away%]
    shots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    fouls: [number, number];
  };
  broadcast?: string;
  highlightNote?: string;
}

export interface StandingTeam {
  rank: number;
  team: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  zone?: 'ucl' | 'uel' | 'relegation' | 'promo' | 'playoff';
}

export interface CompetitionStandings {
  competition: string;
  season: string;
  updatedAt: string;
  teams: StandingTeam[];
}

export interface NextFixture {
  id: string;
  comp: string;
  matchday: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  broadcast: string;
  h2hNote?: string;
}

// ============================================================================
// LIVE MATCHES DATASET (Champions League, Premier League, Championship, League One)
// ============================================================================
export const MOCK_LIVE_MATCHES: LiveMatch[] = [
  // --------------------------------------------------------------------------
  // CHAMPIONS LEAGUE
  // --------------------------------------------------------------------------
  {
    id: 'ucl-live-1',
    comp: 'Champions League',
    round: 'Quarter-Final 1st Leg',
    homeTeam: 'Real Madrid',
    homeShort: 'RMA',
    awayTeam: 'Bayern Munich',
    awayShort: 'BAY',
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    minute: 71,
    timeDisplay: "71' LIVE",
    venue: 'Santiago Bernabéu, Madrid',
    attendance: '81,044',
    referee: 'Szymon Marciniak',
    scorers: [
      { player: 'Vinícius Júnior', minute: 29, team: 'home' },
      { player: 'Harry Kane', minute: 52, team: 'away' },
      { player: 'Jude Bellingham', minute: 61, team: 'home' }
    ],
    stats: {
      possession: [53, 47],
      shots: [15, 12],
      shotsOnTarget: [7, 5],
      corners: [6, 4],
      fouls: [10, 8]
    },
    broadcast: 'TNT Sports 1 / WorldScope Live Wire',
    highlightNote: 'Bellingham curls in magnificent strike to restore Los Blancos lead'
  },
  {
    id: 'ucl-live-2',
    comp: 'Champions League',
    round: 'Quarter-Final 1st Leg',
    homeTeam: 'Arsenal',
    homeShort: 'ARS',
    awayTeam: 'Inter Milan',
    awayShort: 'INT',
    homeScore: 1,
    awayScore: 0,
    status: 'LIVE',
    minute: 64,
    timeDisplay: "64' LIVE",
    venue: 'Emirates Stadium, London',
    attendance: '60,280',
    referee: 'Clément Turpin',
    scorers: [
      { player: 'Bukayo Saka', minute: 38, team: 'home' }
    ],
    stats: {
      possession: [59, 41],
      shots: [12, 6],
      shotsOnTarget: [5, 2],
      corners: [7, 2],
      fouls: [8, 12]
    },
    broadcast: 'TNT Sports 2 / BBC Radio 5 Live',
    highlightNote: 'Saka fires low into the bottom corner after slick team buildup'
  },
  {
    id: 'ucl-ft-1',
    comp: 'Champions League',
    round: 'Quarter-Final 1st Leg',
    homeTeam: 'Barcelona',
    homeShort: 'BAR',
    awayTeam: 'Paris Saint-Germain',
    awayShort: 'PSG',
    homeScore: 3,
    awayScore: 1,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Estadi Olímpic, Barcelona',
    attendance: '50,300',
    scorers: [
      { player: 'Lamine Yamal', minute: 19, team: 'home' },
      { player: 'Robert Lewandowski', minute: 44, team: 'home' },
      { player: 'Ousmane Dembélé', minute: 63, team: 'away' },
      { player: 'Raphinha', minute: 87, team: 'home' }
    ],
    stats: {
      possession: [56, 44],
      shots: [18, 13],
      shotsOnTarget: [9, 5],
      corners: [6, 5],
      fouls: [11, 13]
    },
    broadcast: 'TNT Sports / WorldScope Live Wire',
    highlightNote: 'Masterclass from Yamal and Raphinha gives Barca two-goal cushion'
  },
  {
    id: 'ucl-ft-2',
    comp: 'Champions League',
    round: 'Quarter-Final 1st Leg',
    homeTeam: 'Manchester City',
    homeShort: 'MCI',
    awayTeam: 'Juventus',
    awayShort: 'JUV',
    homeScore: 2,
    awayScore: 2,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Etihad Stadium, Manchester',
    attendance: '53,200',
    scorers: [
      { player: 'Erling Haaland', minute: 21, team: 'home' },
      { player: 'Dušan Vlahović', minute: 49, team: 'away' },
      { player: 'Phil Foden', minute: 67, team: 'home' },
      { player: 'Teun Koopmeiners', minute: 88, team: 'away' }
    ],
    stats: {
      possession: [66, 34],
      shots: [20, 8],
      shotsOnTarget: [8, 4],
      corners: [9, 2],
      fouls: [7, 14]
    },
    broadcast: 'TNT Sports 1 / WorldScope Sport',
    highlightNote: 'Late Koopmeiners equalizer sets up thrilling second leg in Turin'
  },

  // --------------------------------------------------------------------------
  // PREMIER LEAGUE
  // --------------------------------------------------------------------------
  {
    id: 'pl-live-1',
    comp: 'Premier League',
    round: 'Matchday 29',
    homeTeam: 'Arsenal',
    homeShort: 'ARS',
    awayTeam: 'Chelsea',
    awayShort: 'CHE',
    homeScore: 3,
    awayScore: 1,
    status: 'LIVE',
    minute: 78,
    timeDisplay: "78' LIVE",
    venue: 'Emirates Stadium, London',
    attendance: '60,245',
    referee: 'Michael Oliver',
    scorers: [
      { player: 'Kai Havertz', minute: 23, team: 'home' },
      { player: 'Cole Palmer', minute: 41, team: 'away', isPenalty: true },
      { player: 'Bukayo Saka', minute: 58, team: 'home' },
      { player: 'Martin Ødegaard', minute: 72, team: 'home' }
    ],
    stats: {
      possession: [58, 42],
      shots: [14, 8],
      shotsOnTarget: [7, 3],
      corners: [6, 2],
      fouls: [9, 11]
    },
    broadcast: 'Sky Sports Premier League / WorldScope Live',
    highlightNote: 'Arsenal press high as Havertz and Saka control the London derby'
  },
  {
    id: 'pl-live-2',
    comp: 'Premier League',
    round: 'Matchday 29',
    homeTeam: 'Liverpool',
    homeShort: 'LIV',
    awayTeam: 'Manchester United',
    awayShort: 'MUN',
    homeScore: 2,
    awayScore: 2,
    status: 'LIVE',
    minute: 86,
    timeDisplay: "86' LIVE",
    venue: 'Anfield, Liverpool',
    attendance: '61,276',
    referee: 'Anthony Taylor',
    scorers: [
      { player: 'Mohamed Salah', minute: 17, team: 'home' },
      { player: 'Bruno Fernandes', minute: 34, team: 'away' },
      { player: 'Alejandro Garnacho', minute: 61, team: 'away' },
      { player: 'Darwin Núñez', minute: 79, team: 'home' }
    ],
    stats: {
      possession: [62, 38],
      shots: [19, 9],
      shotsOnTarget: [9, 5],
      corners: [8, 3],
      fouls: [12, 14]
    },
    broadcast: 'Sky Sports / BBC Radio 5 Live',
    highlightNote: 'Late drama at Anfield with end-to-end chances'
  },
  {
    id: 'pl-ft-1',
    comp: 'Premier League',
    round: 'Matchday 29',
    homeTeam: 'Manchester City',
    homeShort: 'MCI',
    awayTeam: 'Brighton',
    awayShort: 'BHA',
    homeScore: 3,
    awayScore: 0,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Etihad Stadium, Manchester',
    attendance: '53,400',
    scorers: [
      { player: 'Erling Haaland', minute: 14, team: 'home' },
      { player: 'Erling Haaland', minute: 45, team: 'home' },
      { player: 'Phil Foden', minute: 82, team: 'home' }
    ],
    stats: {
      possession: [67, 33],
      shots: [21, 5],
      shotsOnTarget: [10, 2],
      corners: [9, 1],
      fouls: [8, 10]
    },
    broadcast: 'WorldScope Sport Live Wire'
  },
  {
    id: 'pl-ft-2',
    comp: 'Premier League',
    round: 'Matchday 29',
    homeTeam: 'Aston Villa',
    homeShort: 'AVL',
    awayTeam: 'Wolverhampton',
    awayShort: 'WOL',
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Villa Park, Birmingham',
    scorers: [
      { player: 'Ollie Watkins', minute: 28, team: 'home' },
      { player: 'Morgan Rogers', minute: 64, team: 'home' },
      { player: 'Matheus Cunha', minute: 85, team: 'away' }
    ]
  },
  {
    id: 'pl-ft-3',
    comp: 'Premier League',
    round: 'Matchday 29',
    homeTeam: 'Tottenham Hotspur',
    homeShort: 'TOT',
    awayTeam: 'West Ham United',
    awayShort: 'WHU',
    homeScore: 2,
    awayScore: 0,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Tottenham Hotspur Stadium, London',
    scorers: [
      { player: 'Son Heung-min', minute: 31, team: 'home' },
      { player: 'Brennan Johnson', minute: 73, team: 'home' }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMPIONSHIP
  // --------------------------------------------------------------------------
  {
    id: 'ch-ft-1',
    comp: 'Championship',
    round: 'Matchday 35',
    homeTeam: 'Leeds United',
    homeShort: 'LEE',
    awayTeam: 'Sunderland',
    awayShort: 'SUN',
    homeScore: 3,
    awayScore: 1,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Elland Road, Leeds',
    scorers: [
      { player: 'Joël Piroe', minute: 15, team: 'home' },
      { player: 'Wilfried Gnonto', minute: 52, team: 'home' },
      { player: 'Patrick Roberts', minute: 70, team: 'away' },
      { player: 'Daniel James', minute: 88, team: 'home' }
    ],
    highlightNote: 'Leeds extend lead at summit with clinical home showing'
  },
  {
    id: 'ch-live-1',
    comp: 'Championship',
    round: 'Matchday 35',
    homeTeam: 'Burnley',
    homeShort: 'BUR',
    awayTeam: 'Sheffield United',
    awayShort: 'SHU',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    minute: 82,
    timeDisplay: "82' LIVE",
    venue: 'Turf Moor, Burnley',
    scorers: [
      { player: 'Josh Brownhill', minute: 34, team: 'home' },
      { player: 'Gustavo Hamer', minute: 71, team: 'away' }
    ]
  },
  {
    id: 'ch-live-2',
    comp: 'Championship',
    round: 'Matchday 35',
    homeTeam: 'Norwich City',
    homeShort: 'NOR',
    awayTeam: 'Coventry City',
    awayShort: 'COV',
    homeScore: 2,
    awayScore: 2,
    status: 'LIVE',
    minute: 76,
    timeDisplay: "76' LIVE",
    venue: 'Carrow Road, Norwich',
    scorers: [
      { player: 'Josh Sargent', minute: 12, team: 'home' },
      { player: 'Haji Wright', minute: 39, team: 'away' },
      { player: 'Borja Sainz', minute: 61, team: 'home' },
      { player: 'Ellis Simms', minute: 74, team: 'away' }
    ]
  },
  {
    id: 'ch-ft-2',
    comp: 'Championship',
    round: 'Matchday 35',
    homeTeam: 'West Bromwich',
    homeShort: 'WBA',
    awayTeam: 'Middlesbrough',
    awayShort: 'MID',
    homeScore: 2,
    awayScore: 0,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'The Hawthorns, West Bromwich',
    scorers: [
      { player: 'Josh Maja', minute: 42, team: 'home' },
      { player: 'Karlan Grant', minute: 81, team: 'home' }
    ]
  },

  // --------------------------------------------------------------------------
  // LEAGUE ONE
  // --------------------------------------------------------------------------
  {
    id: 'l1-live-1',
    comp: 'League One',
    round: 'Matchday 33',
    homeTeam: 'Birmingham City',
    homeShort: 'BIR',
    awayTeam: 'Wrexham',
    awayShort: 'WRE',
    homeScore: 2,
    awayScore: 0,
    status: 'LIVE',
    minute: 68,
    timeDisplay: "68' LIVE",
    venue: "St Andrew's, Birmingham",
    attendance: '27,980',
    scorers: [
      { player: 'Jay Stansfield', minute: 22, team: 'home' },
      { player: 'Tomoki Iwata', minute: 59, team: 'home' }
    ],
    stats: {
      possession: [61, 39],
      shots: [14, 6],
      shotsOnTarget: [6, 2],
      corners: [5, 3],
      fouls: [9, 12]
    },
    broadcast: 'Sky Sports+ / WorldScope Sport',
    highlightNote: 'Blues dominate possession in marquee top-of-the-table League One encounter'
  },
  {
    id: 'l1-live-2',
    comp: 'League One',
    round: 'Matchday 33',
    homeTeam: 'Huddersfield Town',
    homeShort: 'HUD',
    awayTeam: 'Bolton Wanderers',
    awayShort: 'BOL',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    minute: 83,
    timeDisplay: "83' LIVE",
    venue: 'John Smith\'s Stadium, Huddersfield',
    scorers: [
      { player: 'Josh Koroma', minute: 31, team: 'home' },
      { player: 'Dion Charles', minute: 73, team: 'away', isPenalty: true }
    ]
  },
  {
    id: 'l1-ft-1',
    comp: 'League One',
    round: 'Matchday 33',
    homeTeam: 'Charlton Athletic',
    homeShort: 'CHA',
    awayTeam: 'Reading',
    awayShort: 'REA',
    homeScore: 3,
    awayScore: 1,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'The Valley, London',
    attendance: '16,400',
    scorers: [
      { player: 'Alfie May', minute: 18, team: 'home' },
      { player: 'Sam Smith', minute: 40, team: 'away' },
      { player: 'Tyreece Campbell', minute: 57, team: 'home' },
      { player: 'Miles Leaburn', minute: 84, team: 'home' }
    ],
    highlightNote: 'Addicks power into playoff spots with dominant home win'
  },
  {
    id: 'l1-ft-2',
    comp: 'League One',
    round: 'Matchday 33',
    homeTeam: 'Barnsley',
    homeShort: 'BAR',
    awayTeam: 'Peterborough United',
    awayShort: 'PET',
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Oakwell, Barnsley',
    scorers: [
      { player: 'Davis Keillor-Dunn', minute: 26, team: 'home' },
      { player: 'Kwame Poku', minute: 54, team: 'away' },
      { player: 'Stephen Humphrys', minute: 79, team: 'home' }
    ]
  },
  {
    id: 'l1-ft-3',
    comp: 'League One',
    round: 'Matchday 33',
    homeTeam: 'Lincoln City',
    homeShort: 'LIN',
    awayTeam: 'Stockport County',
    awayShort: 'STP',
    homeScore: 1,
    awayScore: 0,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'LNER Stadium, Lincoln',
    scorers: [
      { player: 'Ben House', minute: 63, team: 'home' }
    ]
  },
  {
    id: 'l1-ft-4',
    comp: 'League One',
    round: 'Matchday 33',
    homeTeam: 'Wigan Athletic',
    homeShort: 'WIG',
    awayTeam: 'Blackpool',
    awayShort: 'BLA',
    homeScore: 0,
    awayScore: 0,
    status: 'FT',
    timeDisplay: 'Full Time',
    venue: 'Brick Community Stadium, Wigan'
  }
];

// ============================================================================
// NEXT FIXTURES DATASET
// ============================================================================
export const MOCK_NEXT_FIXTURES: NextFixture[] = [
  // Champions League
  {
    id: 'fix-ucl-1',
    comp: 'Champions League',
    matchday: 'Quarter-Final 2nd Leg',
    date: 'Tuesday 15 September',
    time: '20:00 BST',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Real Madrid',
    venue: 'Allianz Arena, Munich',
    broadcast: 'TNT Sports 1 / WorldScope Live Wire',
    h2hNote: 'Bayern seek to overturn a 2-1 first leg deficit on home soil.'
  },
  {
    id: 'fix-ucl-2',
    comp: 'Champions League',
    matchday: 'Quarter-Final 2nd Leg',
    date: 'Wednesday 16 September',
    time: '20:00 BST',
    homeTeam: 'Inter Milan',
    awayTeam: 'Arsenal',
    venue: 'San Siro, Milan',
    broadcast: 'TNT Sports 2 / BBC Radio 5 Live',
    h2hNote: 'Arsenal travel to Milan with a slender 1-0 aggregate advantage.'
  },
  {
    id: 'fix-ucl-3',
    comp: 'Champions League',
    matchday: 'Quarter-Final 2nd Leg',
    date: 'Wednesday 16 September',
    time: '20:00 BST',
    homeTeam: 'Juventus',
    awayTeam: 'Manchester City',
    venue: 'Allianz Stadium, Turin',
    broadcast: 'TNT Sports 1 / WorldScope Sport',
    h2hNote: 'Tied 2-2 on aggregate following thrilling battle in Manchester.'
  },

  // Premier League
  {
    id: 'fix-pl-1',
    comp: 'Premier League',
    matchday: 'Matchday 30',
    date: 'Saturday 19 September',
    time: '12:30 BST',
    homeTeam: 'Tottenham Hotspur',
    awayTeam: 'Newcastle United',
    venue: 'Tottenham Hotspur Stadium, London',
    broadcast: 'TNT Sports 1 / WorldScope Radio',
    h2hNote: 'Tottenham won 4-1 in the reverse fixture earlier this campaign.'
  },
  {
    id: 'fix-pl-2',
    comp: 'Premier League',
    matchday: 'Matchday 30',
    date: 'Saturday 19 September',
    time: '15:00 BST',
    homeTeam: 'Aston Villa',
    awayTeam: 'Manchester City',
    venue: 'Villa Park, Birmingham',
    broadcast: 'Sky Sports Premier League / WorldScope Live',
    h2hNote: 'Villa defeated City 1-0 in this fixture last season.'
  },
  {
    id: 'fix-pl-3',
    comp: 'Premier League',
    matchday: 'Matchday 30',
    date: 'Sunday 20 September',
    time: '16:30 BST',
    homeTeam: 'Arsenal',
    awayTeam: 'Liverpool',
    venue: 'Emirates Stadium, London',
    broadcast: 'Sky Sports Main Event / BBC Radio 5 Live',
    h2hNote: 'Title showdown: 1st vs 3rd place clash in North London.'
  },

  // Championship
  {
    id: 'fix-ch-1',
    comp: 'Championship',
    matchday: 'Matchday 36',
    date: 'Friday 18 September',
    time: '20:00 BST',
    homeTeam: 'Sheffield United',
    awayTeam: 'Middlesbrough',
    venue: 'Bramall Lane, Sheffield',
    broadcast: 'Sky Sports Football',
    h2hNote: 'High-stakes playoff battle in the race for Premier League return.'
  },
  {
    id: 'fix-ch-2',
    comp: 'Championship',
    matchday: 'Matchday 36',
    date: 'Saturday 19 September',
    time: '15:00 BST',
    homeTeam: 'Sunderland',
    awayTeam: 'Burnley',
    venue: 'Stadium of Light, Sunderland',
    broadcast: 'WorldScope Live Wire',
    h2hNote: '2nd vs 3rd at the Stadium of Light.'
  },

  // League One
  {
    id: 'fix-l1-1',
    comp: 'League One',
    matchday: 'Matchday 34',
    date: 'Saturday 19 September',
    time: '15:00 BST',
    homeTeam: 'Wrexham',
    awayTeam: 'Huddersfield Town',
    venue: 'STōK Cae Ras, Wrexham',
    broadcast: 'Sky Sports+ / WorldScope Sport',
    h2hNote: 'Promotion showdown in front of sold-out crowd in North Wales.'
  },
  {
    id: 'fix-l1-2',
    comp: 'League One',
    matchday: 'Matchday 34',
    date: 'Saturday 19 September',
    time: '15:00 BST',
    homeTeam: 'Bolton Wanderers',
    awayTeam: 'Birmingham City',
    venue: 'Toughsheet Community Stadium, Bolton',
    broadcast: 'Sky Sports Football',
    h2hNote: 'League leaders Birmingham face promotion-chasing Bolton.'
  },
  {
    id: 'fix-l1-3',
    comp: 'League One',
    matchday: 'Matchday 34',
    date: 'Saturday 19 September',
    time: '15:00 BST',
    homeTeam: 'Reading',
    awayTeam: 'Barnsley',
    venue: 'Select Car Leasing Stadium, Reading',
    broadcast: 'WorldScope Sport Live',
    h2hNote: 'Playoff battle with only 3 points separating both clubs.'
  }
];

// ============================================================================
// STANDINGS DATASET (Champions League, Premier League, Championship, League One)
// ============================================================================
export const MOCK_STANDINGS: Record<string, CompetitionStandings> = {
  // --------------------------------------------------------------------------
  // CHAMPIONS LEAGUE (36-team League Phase Top Standings)
  // --------------------------------------------------------------------------
  'Champions League': {
    competition: 'Champions League',
    season: '2025/2026',
    updatedAt: 'Live',
    teams: [
      { rank: 1, team: 'Real Madrid', shortName: 'RMA', played: 8, won: 7, drawn: 0, lost: 1, goalsFor: 22, goalsAgainst: 8, goalDiff: 14, points: 21, form: ['W', 'W', 'W', 'W', 'W'], zone: 'ucl' },
      { rank: 2, team: 'Manchester City', shortName: 'MCI', played: 8, won: 6, drawn: 2, lost: 0, goalsFor: 24, goalsAgainst: 9, goalDiff: 15, points: 20, form: ['W', 'W', 'D', 'W', 'D'], zone: 'ucl' },
      { rank: 3, team: 'Bayern Munich', shortName: 'BAY', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 21, goalsAgainst: 10, goalDiff: 11, points: 19, form: ['W', 'W', 'W', 'L', 'W'], zone: 'ucl' },
      { rank: 4, team: 'Arsenal', shortName: 'ARS', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 19, goalsAgainst: 7, goalDiff: 12, points: 19, form: ['W', 'D', 'W', 'W', 'W'], zone: 'ucl' },
      { rank: 5, team: 'Barcelona', shortName: 'BAR', played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 18, goalsAgainst: 11, goalDiff: 7, points: 17, form: ['W', 'W', 'D', 'W', 'L'], zone: 'ucl' },
      { rank: 6, team: 'Inter Milan', shortName: 'INT', played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 14, goalsAgainst: 8, goalDiff: 6, points: 17, form: ['W', 'D', 'W', 'W', 'D'], zone: 'ucl' },
      { rank: 7, team: 'Paris Saint-Germain', shortName: 'PSG', played: 8, won: 5, drawn: 1, lost: 2, goalsFor: 17, goalsAgainst: 12, goalDiff: 5, points: 16, form: ['L', 'W', 'W', 'W', 'D'], zone: 'ucl' },
      { rank: 8, team: 'Liverpool', shortName: 'LIV', played: 8, won: 5, drawn: 1, lost: 2, goalsFor: 16, goalsAgainst: 10, goalDiff: 6, points: 16, form: ['W', 'L', 'W', 'W', 'D'], zone: 'ucl' },
      { rank: 9, team: 'Bayer Leverkusen', shortName: 'B04', played: 8, won: 5, drawn: 0, lost: 3, goalsFor: 15, goalsAgainst: 11, goalDiff: 4, points: 15, form: ['W', 'W', 'L', 'W', 'W'], zone: 'uel' },
      { rank: 10, team: 'Aston Villa', shortName: 'AVL', played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 13, goalsAgainst: 9, goalDiff: 4, points: 14, form: ['D', 'W', 'W', 'L', 'W'], zone: 'uel' },
      { rank: 11, team: 'Atlético Madrid', shortName: 'ATM', played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 12, goalsAgainst: 10, goalDiff: 2, points: 14, form: ['W', 'D', 'L', 'W', 'D'], zone: 'uel' },
      { rank: 12, team: 'Borussia Dortmund', shortName: 'BVB', played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 16, goalsAgainst: 13, goalDiff: 3, points: 13, form: ['L', 'W', 'W', 'L', 'W'], zone: 'uel' },
      { rank: 13, team: 'Juventus', shortName: 'JUV', played: 8, won: 3, drawn: 4, lost: 1, goalsFor: 11, goalsAgainst: 8, goalDiff: 3, points: 13, form: ['D', 'D', 'W', 'W', 'D'], zone: 'uel' },
      { rank: 14, team: 'Sporting CP', shortName: 'SCP', played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 14, goalsAgainst: 12, goalDiff: 2, points: 13, form: ['W', 'L', 'W', 'D', 'W'], zone: 'uel' },
      { rank: 15, team: 'Monaco', shortName: 'ASM', played: 8, won: 3, drawn: 3, lost: 2, goalsFor: 10, goalsAgainst: 10, goalDiff: 0, points: 12, form: ['D', 'W', 'L', 'D', 'W'], zone: 'uel' },
      { rank: 16, team: 'AC Milan', shortName: 'ACM', played: 8, won: 3, drawn: 2, lost: 3, goalsFor: 11, goalsAgainst: 12, goalDiff: -1, points: 11, form: ['L', 'W', 'L', 'W', 'D'], zone: 'uel' }
    ]
  },

  // --------------------------------------------------------------------------
  // PREMIER LEAGUE (Full 20-team Table)
  // --------------------------------------------------------------------------
  'Premier League': {
    competition: 'Premier League',
    season: '2025/2026',
    updatedAt: 'Live',
    teams: [
      { rank: 1, team: 'Arsenal', shortName: 'ARS', played: 29, won: 21, drawn: 5, lost: 3, goalsFor: 68, goalsAgainst: 24, goalDiff: 44, points: 68, form: ['W', 'W', 'W', 'D', 'W'], zone: 'ucl' },
      { rank: 2, team: 'Manchester City', shortName: 'MCI', played: 29, won: 20, drawn: 6, lost: 3, goalsFor: 71, goalsAgainst: 28, goalDiff: 43, points: 66, form: ['W', 'D', 'W', 'W', 'W'], zone: 'ucl' },
      { rank: 3, team: 'Liverpool', shortName: 'LIV', played: 29, won: 18, drawn: 8, lost: 3, goalsFor: 65, goalsAgainst: 29, goalDiff: 36, points: 62, form: ['W', 'W', 'D', 'W', 'D'], zone: 'ucl' },
      { rank: 4, team: 'Aston Villa', shortName: 'AVL', played: 29, won: 17, drawn: 5, lost: 7, goalsFor: 54, goalsAgainst: 35, goalDiff: 19, points: 56, form: ['W', 'W', 'L', 'W', 'W'], zone: 'ucl' },
      { rank: 5, team: 'Tottenham Hotspur', shortName: 'TOT', played: 29, won: 15, drawn: 6, lost: 8, goalsFor: 57, goalsAgainst: 40, goalDiff: 17, points: 51, form: ['D', 'W', 'L', 'W', 'W'], zone: 'uel' },
      { rank: 6, team: 'Chelsea', shortName: 'CHE', played: 29, won: 14, drawn: 6, lost: 9, goalsFor: 52, goalsAgainst: 42, goalDiff: 10, points: 48, form: ['L', 'W', 'W', 'D', 'L'], zone: 'uel' },
      { rank: 7, team: 'Newcastle United', shortName: 'NEW', played: 29, won: 13, drawn: 8, lost: 8, goalsFor: 49, goalsAgainst: 39, goalDiff: 10, points: 47, form: ['W', 'L', 'W', 'D', 'W'] },
      { rank: 8, team: 'Manchester United', shortName: 'MUN', played: 29, won: 13, drawn: 6, lost: 10, goalsFor: 45, goalsAgainst: 43, goalDiff: 2, points: 45, form: ['D', 'W', 'L', 'W', 'D'] },
      { rank: 9, team: 'Brighton', shortName: 'BHA', played: 29, won: 11, drawn: 10, lost: 8, goalsFor: 44, goalsAgainst: 42, goalDiff: 2, points: 43, form: ['L', 'D', 'W', 'L', 'D'] },
      { rank: 10, team: 'Fulham', shortName: 'FUL', played: 29, won: 11, drawn: 7, lost: 11, goalsFor: 41, goalsAgainst: 42, goalDiff: -1, points: 40, form: ['W', 'L', 'D', 'W', 'L'] },
      { rank: 11, team: 'Brentford', shortName: 'BRE', played: 29, won: 10, drawn: 8, lost: 11, goalsFor: 43, goalsAgainst: 46, goalDiff: -3, points: 38, form: ['D', 'W', 'L', 'L', 'W'] },
      { rank: 12, team: 'Bournemouth', shortName: 'BOU', played: 29, won: 10, drawn: 7, lost: 12, goalsFor: 39, goalsAgainst: 44, goalDiff: -5, points: 37, form: ['L', 'W', 'L', 'D', 'W'] },
      { rank: 13, team: 'West Ham United', shortName: 'WHU', played: 29, won: 9, drawn: 8, lost: 12, goalsFor: 36, goalsAgainst: 48, goalDiff: -12, points: 35, form: ['L', 'D', 'W', 'L', 'L'] },
      { rank: 14, team: 'Crystal Palace', shortName: 'CRY', played: 29, won: 8, drawn: 10, lost: 11, goalsFor: 34, goalsAgainst: 40, goalDiff: -6, points: 34, form: ['W', 'D', 'D', 'L', 'D'] },
      { rank: 15, team: 'Nottingham Forest', shortName: 'NFO', played: 29, won: 8, drawn: 8, lost: 13, goalsFor: 33, goalsAgainst: 45, goalDiff: -12, points: 32, form: ['D', 'L', 'W', 'L', 'D'] },
      { rank: 16, team: 'Wolverhampton', shortName: 'WOL', played: 29, won: 8, drawn: 6, lost: 15, goalsFor: 35, goalsAgainst: 51, goalDiff: -16, points: 30, form: ['L', 'L', 'W', 'L', 'W'] },
      { rank: 17, team: 'Everton', shortName: 'EVE', played: 29, won: 7, drawn: 9, lost: 13, goalsFor: 30, goalsAgainst: 44, goalDiff: -14, points: 30, form: ['W', 'D', 'L', 'D', 'W'] },
      { rank: 18, team: 'Ipswich Town', shortName: 'IPS', played: 29, won: 5, drawn: 9, lost: 15, goalsFor: 28, goalsAgainst: 52, goalDiff: -24, points: 24, form: ['L', 'L', 'D', 'L', 'D'], zone: 'relegation' },
      { rank: 19, team: 'Leicester City', shortName: 'LEI', played: 29, won: 5, drawn: 7, lost: 17, goalsFor: 31, goalsAgainst: 59, goalDiff: -28, points: 22, form: ['L', 'L', 'L', 'D', 'L'], zone: 'relegation' },
      { rank: 20, team: 'Southampton', shortName: 'SOU', played: 29, won: 3, drawn: 5, lost: 21, goalsFor: 21, goalsAgainst: 60, goalDiff: -39, points: 14, form: ['L', 'D', 'L', 'L', 'L'], zone: 'relegation' }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAMPIONSHIP (Full Table with Promotion, Playoff, Relegation)
  // --------------------------------------------------------------------------
  'Championship': {
    competition: 'Championship',
    season: '2025/2026',
    updatedAt: 'Live',
    teams: [
      { rank: 1, team: 'Leeds United', shortName: 'LEE', played: 35, won: 23, drawn: 7, lost: 5, goalsFor: 71, goalsAgainst: 33, goalDiff: 38, points: 76, form: ['W', 'W', 'W', 'D', 'W'], zone: 'promo' },
      { rank: 2, team: 'Burnley', shortName: 'BUR', played: 35, won: 21, drawn: 10, lost: 4, goalsFor: 62, goalsAgainst: 29, goalDiff: 33, points: 73, form: ['W', 'W', 'D', 'W', 'D'], zone: 'promo' },
      { rank: 3, team: 'Sunderland', shortName: 'SUN', played: 35, won: 20, drawn: 8, lost: 7, goalsFor: 59, goalsAgainst: 37, goalDiff: 22, points: 68, form: ['L', 'W', 'W', 'W', 'D'], zone: 'playoff' },
      { rank: 4, team: 'Sheffield United', shortName: 'SHU', played: 35, won: 19, drawn: 9, lost: 7, goalsFor: 55, goalsAgainst: 34, goalDiff: 21, points: 66, form: ['W', 'W', 'D', 'L', 'D'], zone: 'playoff' },
      { rank: 5, team: 'West Bromwich', shortName: 'WBA', played: 35, won: 16, drawn: 12, lost: 7, goalsFor: 48, goalsAgainst: 32, goalDiff: 16, points: 60, form: ['L', 'W', 'D', 'W', 'D'], zone: 'playoff' },
      { rank: 6, team: 'Middlesbrough', shortName: 'MID', played: 35, won: 16, drawn: 8, lost: 11, goalsFor: 51, goalsAgainst: 40, goalDiff: 11, points: 56, form: ['D', 'W', 'L', 'W', 'W'], zone: 'playoff' },
      { rank: 7, team: 'Norwich City', shortName: 'NOR', played: 35, won: 15, drawn: 9, lost: 11, goalsFor: 56, goalsAgainst: 48, goalDiff: 8, points: 54, form: ['W', 'W', 'L', 'D', 'W'] },
      { rank: 8, team: 'Coventry City', shortName: 'COV', played: 35, won: 14, drawn: 10, lost: 11, goalsFor: 49, goalsAgainst: 43, goalDiff: 6, points: 52, form: ['D', 'D', 'W', 'W', 'L'] },
      { rank: 9, team: 'Watford', shortName: 'WAT', played: 35, won: 14, drawn: 9, lost: 12, goalsFor: 46, goalsAgainst: 45, goalDiff: 1, points: 51, form: ['W', 'L', 'D', 'W', 'L'] },
      { rank: 10, team: 'Bristol City', shortName: 'BRC', played: 35, won: 13, drawn: 11, lost: 11, goalsFor: 43, goalsAgainst: 42, goalDiff: 1, points: 50, form: ['D', 'W', 'L', 'W', 'D'] },
      { rank: 11, team: 'Blackburn Rovers', shortName: 'BLA', played: 35, won: 13, drawn: 10, lost: 12, goalsFor: 44, goalsAgainst: 44, goalDiff: 0, points: 49, form: ['W', 'L', 'W', 'D', 'L'] },
      { rank: 12, team: 'Swansea City', shortName: 'SWA', played: 35, won: 12, drawn: 11, lost: 12, goalsFor: 38, goalsAgainst: 39, goalDiff: -1, points: 47, form: ['L', 'W', 'D', 'W', 'D'] },
      { rank: 13, team: 'Derby County', shortName: 'DER', played: 35, won: 12, drawn: 9, lost: 14, goalsFor: 41, goalsAgainst: 44, goalDiff: -3, points: 45, form: ['W', 'L', 'L', 'W', 'D'] },
      { rank: 14, team: 'Millwall', shortName: 'MIL', played: 35, won: 11, drawn: 11, lost: 13, goalsFor: 37, goalsAgainst: 41, goalDiff: -4, points: 44, form: ['D', 'D', 'W', 'L', 'W'] },
      { rank: 15, team: 'Queens Park Rangers', shortName: 'QPR', played: 35, won: 10, drawn: 12, lost: 13, goalsFor: 39, goalsAgainst: 47, goalDiff: -8, points: 42, form: ['L', 'W', 'D', 'D', 'L'] },
      { rank: 16, team: 'Stoke City', shortName: 'STK', played: 35, won: 10, drawn: 10, lost: 15, goalsFor: 35, goalsAgainst: 45, goalDiff: -10, points: 40, form: ['L', 'L', 'W', 'D', 'W'] },
      { rank: 17, team: 'Luton Town', shortName: 'LUT', played: 35, won: 10, drawn: 9, lost: 16, goalsFor: 40, goalsAgainst: 51, goalDiff: -11, points: 39, form: ['L', 'W', 'L', 'L', 'D'] },
      { rank: 18, team: 'Preston North End', shortName: 'PNE', played: 35, won: 9, drawn: 11, lost: 15, goalsFor: 33, goalsAgainst: 46, goalDiff: -13, points: 38, form: ['D', 'L', 'W', 'L', 'D'] },
      { rank: 19, team: 'Oxford United', shortName: 'OXF', played: 35, won: 9, drawn: 10, lost: 16, goalsFor: 36, goalsAgainst: 52, goalDiff: -16, points: 37, form: ['L', 'D', 'L', 'W', 'L'] },
      { rank: 20, team: 'Hull City', shortName: 'HUL', played: 35, won: 8, drawn: 11, lost: 16, goalsFor: 35, goalsAgainst: 50, goalDiff: -15, points: 35, form: ['D', 'L', 'L', 'D', 'W'] },
      { rank: 21, team: 'Portsmouth', shortName: 'POR', played: 35, won: 7, drawn: 10, lost: 18, goalsFor: 34, goalsAgainst: 54, goalDiff: -20, points: 31, form: ['L', 'D', 'L', 'W', 'L'] },
      { rank: 22, team: 'Plymouth Argyle', shortName: 'PLY', played: 35, won: 7, drawn: 9, lost: 19, goalsFor: 36, goalsAgainst: 63, goalDiff: -27, points: 30, form: ['L', 'L', 'D', 'L', 'D'], zone: 'relegation' },
      { rank: 23, team: 'Cardiff City', shortName: 'CAR', played: 35, won: 6, drawn: 9, lost: 20, goalsFor: 32, goalsAgainst: 64, goalDiff: -32, points: 27, form: ['D', 'L', 'L', 'L', 'D'], zone: 'relegation' }
    ]
  },

  // --------------------------------------------------------------------------
  // LEAGUE ONE (Full Table with Promotion, Playoff, Relegation)
  // --------------------------------------------------------------------------
  'League One': {
    competition: 'League One',
    season: '2025/2026',
    updatedAt: 'Live',
    teams: [
      { rank: 1, team: 'Birmingham City', shortName: 'BIR', played: 33, won: 22, drawn: 7, lost: 4, goalsFor: 64, goalsAgainst: 26, goalDiff: 38, points: 73, form: ['W', 'W', 'W', 'D', 'W'], zone: 'promo' },
      { rank: 2, team: 'Wrexham', shortName: 'WRE', played: 33, won: 20, drawn: 8, lost: 5, goalsFor: 57, goalsAgainst: 29, goalDiff: 28, points: 68, form: ['W', 'W', 'D', 'W', 'L'], zone: 'promo' },
      { rank: 3, team: 'Huddersfield Town', shortName: 'HUD', played: 33, won: 19, drawn: 7, lost: 7, goalsFor: 54, goalsAgainst: 32, goalDiff: 22, points: 64, form: ['W', 'D', 'W', 'W', 'D'], zone: 'playoff' },
      { rank: 4, team: 'Bolton Wanderers', shortName: 'BOL', played: 33, won: 18, drawn: 8, lost: 7, goalsFor: 56, goalsAgainst: 36, goalDiff: 20, points: 62, form: ['W', 'W', 'D', 'L', 'D'], zone: 'playoff' },
      { rank: 5, team: 'Charlton Athletic', shortName: 'CHA', played: 33, won: 17, drawn: 9, lost: 7, goalsFor: 51, goalsAgainst: 33, goalDiff: 18, points: 60, form: ['W', 'W', 'W', 'D', 'W'], zone: 'playoff' },
      { rank: 6, team: 'Barnsley', shortName: 'BAR', played: 33, won: 17, drawn: 8, lost: 8, goalsFor: 55, goalsAgainst: 41, goalDiff: 14, points: 59, form: ['W', 'L', 'W', 'W', 'W'], zone: 'playoff' },
      { rank: 7, team: 'Lincoln City', shortName: 'LIN', played: 33, won: 15, drawn: 11, lost: 7, goalsFor: 47, goalsAgainst: 32, goalDiff: 15, points: 56, form: ['W', 'W', 'D', 'W', 'D'] },
      { rank: 8, team: 'Stockport County', shortName: 'STP', played: 33, won: 15, drawn: 9, lost: 9, goalsFor: 50, goalsAgainst: 38, goalDiff: 12, points: 54, form: ['L', 'W', 'W', 'D', 'L'] },
      { rank: 9, team: 'Peterborough United', shortName: 'PET', played: 33, won: 14, drawn: 7, lost: 12, goalsFor: 58, goalsAgainst: 49, goalDiff: 9, points: 49, form: ['L', 'W', 'L', 'W', 'L'] },
      { rank: 10, team: 'Reading', shortName: 'REA', played: 33, won: 13, drawn: 9, lost: 11, goalsFor: 48, goalsAgainst: 45, goalDiff: 3, points: 48, form: ['L', 'D', 'W', 'W', 'L'] },
      { rank: 11, team: 'Wycombe Wanderers', shortName: 'WYC', played: 33, won: 13, drawn: 8, lost: 12, goalsFor: 44, goalsAgainst: 42, goalDiff: 2, points: 47, form: ['D', 'W', 'L', 'W', 'D'] },
      { rank: 12, team: 'Blackpool', shortName: 'BLA', played: 33, won: 12, drawn: 10, lost: 11, goalsFor: 45, goalsAgainst: 44, goalDiff: 1, points: 46, form: ['D', 'D', 'W', 'L', 'D'] },
      { rank: 13, team: 'Rotherham United', shortName: 'ROT', played: 33, won: 11, drawn: 11, lost: 11, goalsFor: 40, goalsAgainst: 41, goalDiff: -1, points: 44, form: ['L', 'W', 'D', 'L', 'W'] },
      { rank: 14, team: 'Wigan Athletic', shortName: 'WIG', played: 33, won: 10, drawn: 12, lost: 11, goalsFor: 35, goalsAgainst: 36, goalDiff: -1, points: 42, form: ['D', 'L', 'W', 'D', 'D'] },
      { rank: 15, team: 'Mansfield Town', shortName: 'MAN', played: 33, won: 11, drawn: 8, lost: 14, goalsFor: 42, goalsAgainst: 47, goalDiff: -5, points: 41, form: ['W', 'L', 'L', 'D', 'W'] },
      { rank: 16, team: 'Exeter City', shortName: 'EXE', played: 33, won: 11, drawn: 7, lost: 15, goalsFor: 36, goalsAgainst: 45, goalDiff: -9, points: 40, form: ['L', 'W', 'L', 'D', 'L'] },
      { rank: 17, team: 'Leyton Orient', shortName: 'LEY', played: 33, won: 10, drawn: 8, lost: 15, goalsFor: 38, goalsAgainst: 48, goalDiff: -10, points: 38, form: ['W', 'L', 'D', 'L', 'W'] },
      { rank: 18, team: 'Bristol Rovers', shortName: 'BRR', played: 33, won: 9, drawn: 9, lost: 15, goalsFor: 34, goalsAgainst: 49, goalDiff: -15, points: 36, form: ['L', 'D', 'W', 'L', 'L'] },
      { rank: 19, team: 'Northampton Town', shortName: 'NOR', played: 33, won: 8, drawn: 11, lost: 14, goalsFor: 33, goalsAgainst: 48, goalDiff: -15, points: 35, form: ['D', 'L', 'D', 'W', 'L'] },
      { rank: 20, team: 'Stevenage', shortName: 'STE', played: 33, won: 8, drawn: 10, lost: 15, goalsFor: 30, goalsAgainst: 45, goalDiff: -15, points: 34, form: ['L', 'D', 'L', 'L', 'D'] },
      { rank: 21, team: 'Cambridge United', shortName: 'CAM', played: 33, won: 7, drawn: 10, lost: 16, goalsFor: 29, goalsAgainst: 47, goalDiff: -18, points: 31, form: ['L', 'L', 'D', 'L', 'D'], zone: 'relegation' },
      { rank: 22, team: 'Shrewsbury Town', shortName: 'SHR', played: 33, won: 6, drawn: 11, lost: 16, goalsFor: 28, goalsAgainst: 51, goalDiff: -23, points: 29, form: ['D', 'L', 'L', 'D', 'L'], zone: 'relegation' },
      { rank: 23, team: 'Crawley Town', shortName: 'CRA', played: 33, won: 6, drawn: 9, lost: 18, goalsFor: 31, goalsAgainst: 58, goalDiff: -27, points: 27, form: ['L', 'L', 'L', 'D', 'L'], zone: 'relegation' },
      { rank: 24, team: 'Burton Albion', shortName: 'BUR', played: 33, won: 4, drawn: 10, lost: 19, goalsFor: 26, goalsAgainst: 59, goalDiff: -33, points: 22, form: ['L', 'D', 'L', 'L', 'D'], zone: 'relegation' }
    ]
  }
};

/**
 * LiveScore API Client
 * Connects to the server-side /api/livescores route with instant resilient client fallback
 */
export const LiveScoreApi = {
  /**
   * Fetch latest match scores
   */
  async getLiveScores(competition?: string): Promise<{ data: LiveMatch[]; timestamp: string }> {
    try {
      const compParam = competition ? `?comp=${encodeURIComponent(competition)}&type=scores` : '?type=scores';
      const response = await fetch(`/api/livescores${compParam}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data)) {
          return {
            data: json.data,
            timestamp: json.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
        }
      }
    } catch {
      // Fallback to client mock
    }

    // Local fallback
    await new Promise((resolve) => setTimeout(resolve, 150));
    let results = [...MOCK_LIVE_MATCHES];
    if (competition && competition !== 'All') {
      results = results.filter((m) => m.comp.toLowerCase() === competition.toLowerCase());
    }

    return {
      data: results,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  },

  /**
   * Fetch league table standings
   */
  async getStandings(competition: string = 'Premier League'): Promise<CompetitionStandings> {
    try {
      const compParam = `?comp=${encodeURIComponent(competition)}&type=standings`;
      const response = await fetch(`/api/livescores${compParam}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const json = await response.json();
        if (json.standings && json.standings.teams) {
          return json.standings;
        }
      }
    } catch {
      // Fallback to client mock
    }

    // Local fallback
    await new Promise((resolve) => setTimeout(resolve, 150));
    const compKey = Object.keys(MOCK_STANDINGS).find(
      (k) => k.toLowerCase() === competition.toLowerCase()
    ) || 'Premier League';

    return MOCK_STANDINGS[compKey];
  },

  /**
   * Fetch upcoming fixtures
   */
  async getNextFixtures(competition?: string): Promise<{ data: NextFixture[]; timestamp: string }> {
    try {
      const compParam = competition ? `?comp=${encodeURIComponent(competition)}&type=fixtures` : '?type=fixtures';
      const response = await fetch(`/api/livescores${compParam}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data)) {
          return {
            data: json.data,
            timestamp: json.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
        }
      }
    } catch {
      // Fallback to client mock
    }

    // Local fallback
    await new Promise((resolve) => setTimeout(resolve, 150));
    let results = [...MOCK_NEXT_FIXTURES];
    if (competition && competition !== 'All') {
      results = results.filter((f) => f.comp.toLowerCase() === competition.toLowerCase());
    }

    return {
      data: results,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  },

  /**
   * Fetch today's Champions League live matches and results
   */
  async getChampionsLeagueToday(): Promise<{ data: LiveMatch[]; timestamp: string }> {
    try {
      const response = await fetch('/api/livescores?comp=Champions%20League&todayOnly=true&type=scores', {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data)) {
          return {
            data: json.data,
            timestamp: json.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
        }
      }
    } catch {
      // Fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      data: MOCK_LIVE_MATCHES.filter((m) => m.comp === 'Champions League'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }
};

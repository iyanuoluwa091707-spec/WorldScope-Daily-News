export interface MatchFixture {
  id: string;
  home: string;
  homeScore?: string;
  away: string;
  awayScore?: string;
  status: string; // 'FT', '88\' LIVE', '15:00 Today', 'Tomorrow 17:30'
  comp: 'Premier League' | 'Championship';
  scorers?: string;
  venue: string;
  isLive?: boolean;
  highlightNote?: string;
}

export interface LeagueTableTeam {
  pos: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: string;
  pts: number;
  form: ('W' | 'D' | 'L')[];
}

export interface PunditStory {
  id: string;
  punditName: string;
  punditRole: string;
  punditImage: string;
  tag: string;
  title: string;
  quote: string;
  topicCategory: 'Premier League' | 'Championship' | 'Tactics';
  readTime: string;
}

export const PREMIER_LEAGUE_FIXTURES: MatchFixture[] = [
  {
    id: 'pl-1',
    home: 'Arsenal',
    homeScore: '2',
    away: 'Chelsea',
    awayScore: '1',
    status: 'FT',
    comp: 'Premier League',
    scorers: "Havertz 38', Odegaard 62' | Jackson 75'",
    venue: 'Emirates Stadium',
    highlightNote: 'Arsenal go joint-top of table with emphatic derby win',
  },
  {
    id: 'pl-2',
    home: 'Man City',
    homeScore: '3',
    away: 'Brighton',
    awayScore: '1',
    status: 'FT',
    comp: 'Premier League',
    scorers: "Haaland 12', 45+2', Foden 81' | Mitoma 64'",
    venue: 'Etihad Stadium',
    highlightNote: 'Haaland brace takes season tally to 26 goals',
  },
  {
    id: 'pl-3',
    home: 'Liverpool',
    homeScore: '1',
    away: 'Man Utd',
    awayScore: '0',
    status: '88\' LIVE',
    comp: 'Premier League',
    scorers: "Salah (pen) 74'",
    venue: 'Anfield',
    isLive: true,
    highlightNote: 'Controversial 74th-minute VAR penalty separates rivals',
  },
  {
    id: 'pl-4',
    home: 'Tottenham',
    homeScore: '2',
    away: 'Newcastle',
    awayScore: '2',
    status: 'FT',
    comp: 'Premier League',
    scorers: "Son 21', Maddison 55' | Isak 34', Gordon 68'",
    venue: 'Tottenham Hotspur Stadium',
    highlightNote: 'End-to-end clash leaves both sides in European contention',
  },
  {
    id: 'pl-5',
    home: 'Aston Villa',
    homeScore: '2',
    away: 'Wolves',
    awayScore: '0',
    status: 'FT',
    comp: 'Premier League',
    scorers: "Watkins 41', Rogers 79'",
    venue: 'Villa Park',
    highlightNote: 'Emery\'s men strengthen grip on top four position',
  },
  {
    id: 'pl-6',
    home: 'West Ham',
    away: 'Everton',
    status: 'Tomorrow 15:00',
    comp: 'Premier League',
    venue: 'London Stadium',
    highlightNote: 'Relegation battle implications at the London Stadium',
  },
];

export const CHAMPIONSHIP_FIXTURES: MatchFixture[] = [
  {
    id: 'ch-1',
    home: 'Leeds United',
    homeScore: '3',
    away: 'Sunderland',
    awayScore: '1',
    status: 'FT',
    comp: 'Championship',
    scorers: "Piroe 15', Gnonto 52', James 88' | Roberts 44'",
    venue: 'Elland Road',
    highlightNote: 'Leeds storm back to top of the Championship table',
  },
  {
    id: 'ch-2',
    home: 'Sheffield Utd',
    homeScore: '1',
    away: 'Sheffield Wed',
    awayScore: '0',
    status: 'FT',
    comp: 'Championship',
    scorers: "Hamer 33'",
    venue: 'Bramall Lane',
    highlightNote: 'Steel City derby glory sealed by 25-yard screamer',
  },
  {
    id: 'ch-3',
    home: 'West Brom',
    homeScore: '0',
    away: 'Burnley',
    awayScore: '2',
    status: 'FT',
    comp: 'Championship',
    scorers: "Brownhill 28', Foster 61'",
    venue: 'The Hawthorns',
    highlightNote: 'Clarets keep fourth consecutive clean sheet',
  },
  {
    id: 'ch-4',
    home: 'Middlesbrough',
    homeScore: '2',
    away: 'Coventry City',
    awayScore: '2',
    status: 'FT',
    comp: 'Championship',
    scorers: "Latte Lath 19', Hackney 77' | Wright 40', Simms 90+2'",
    venue: 'Riverside Stadium',
    highlightNote: 'Stoppage-time header locks both in playoff zone',
  },
  {
    id: 'ch-5',
    home: 'Norwich City',
    homeScore: '3',
    away: 'Watford',
    awayScore: '0',
    status: 'FT',
    comp: 'Championship',
    scorers: "Sargent 11', 48', Sainz 83'",
    venue: 'Carrow Road',
    highlightNote: 'Josh Sargent brace inspires dominant home display',
  },
  {
    id: 'ch-6',
    home: 'Luton Town',
    homeScore: '2',
    away: 'Bristol City',
    awayScore: '1',
    status: 'FT',
    comp: 'Championship',
    scorers: "Morris 24', Adebayo 72' | Wells 85'",
    venue: 'Kenilworth Road',
    highlightNote: 'Hatters hold on under intense late pressure',
  },
];

export const PREMIER_LEAGUE_TABLE: LeagueTableTeam[] = [
  { pos: 1, team: 'Arsenal', played: 28, won: 20, drawn: 5, lost: 3, gd: '+42', pts: 65, form: ['W', 'W', 'W', 'D', 'W'] },
  { pos: 2, team: 'Man City', played: 28, won: 19, drawn: 6, lost: 3, gd: '+38', pts: 63, form: ['W', 'D', 'W', 'W', 'W'] },
  { pos: 3, team: 'Liverpool', played: 28, won: 18, drawn: 7, lost: 3, gd: '+35', pts: 61, form: ['W', 'W', 'D', 'W', 'W'] },
  { pos: 4, team: 'Aston Villa', played: 28, won: 16, drawn: 5, lost: 7, gd: '+18', pts: 53, form: ['W', 'L', 'W', 'W', 'D'] },
  { pos: 5, team: 'Tottenham', played: 28, won: 15, drawn: 5, lost: 8, gd: '+16', pts: 50, form: ['D', 'W', 'L', 'W', 'W'] },
  { pos: 6, team: 'Chelsea', played: 28, won: 14, drawn: 6, lost: 8, gd: '+12', pts: 48, form: ['L', 'W', 'W', 'D', 'L'] },
  { pos: 17, team: 'Everton', played: 28, won: 7, drawn: 8, lost: 13, gd: '-14', pts: 29, form: ['W', 'D', 'L', 'D', 'W'] },
  { pos: 18, team: 'Ipswich Town', played: 28, won: 5, drawn: 9, lost: 14, gd: '-22', pts: 24, form: ['L', 'L', 'D', 'L', 'D'] },
  { pos: 19, team: 'Leicester City', played: 28, won: 5, drawn: 7, lost: 16, gd: '-28', pts: 22, form: ['L', 'L', 'L', 'D', 'L'] },
  { pos: 20, team: 'Southampton', played: 28, won: 3, drawn: 5, lost: 20, gd: '-37', pts: 14, form: ['L', 'D', 'L', 'L', 'L'] },
];

export const CHAMPIONSHIP_TABLE: LeagueTableTeam[] = [
  { pos: 1, team: 'Leeds United', played: 34, won: 22, drawn: 7, lost: 5, gd: '+36', pts: 73, form: ['W', 'W', 'W', 'D', 'W'] },
  { pos: 2, team: 'Burnley', played: 34, won: 21, drawn: 9, lost: 4, gd: '+32', pts: 72, form: ['W', 'W', 'D', 'W', 'W'] },
  { pos: 3, team: 'Sunderland', played: 34, won: 20, drawn: 8, lost: 6, gd: '+24', pts: 68, form: ['L', 'W', 'W', 'W', 'D'] },
  { pos: 4, team: 'Sheffield United', played: 34, won: 19, drawn: 8, lost: 7, gd: '+21', pts: 65, form: ['W', 'W', 'D', 'L', 'W'] },
  { pos: 5, team: 'West Brom', played: 34, won: 16, drawn: 11, lost: 7, gd: '+15', pts: 59, form: ['L', 'W', 'D', 'W', 'D'] },
  { pos: 6, team: 'Middlesbrough', played: 34, won: 16, drawn: 8, lost: 10, gd: '+12', pts: 56, form: ['D', 'W', 'L', 'W', 'W'] },
  { pos: 22, team: 'Portsmouth', played: 34, won: 7, drawn: 10, lost: 17, gd: '-19', pts: 31, form: ['L', 'D', 'L', 'W', 'L'] },
  { pos: 23, team: 'Plymouth Argyle', played: 34, won: 7, drawn: 9, lost: 18, gd: '-26', pts: 30, form: ['L', 'L', 'D', 'L', 'D'] },
  { pos: 24, team: 'Cardiff City', played: 34, won: 6, drawn: 9, lost: 19, gd: '-30', pts: 27, form: ['D', 'L', 'L', 'L', 'D'] },
];

export const CHAMPIONS_LEAGUE_TABLE: LeagueTableTeam[] = [
  { pos: 1, team: 'Real Madrid', played: 8, won: 7, drawn: 0, lost: 1, gd: '+14', pts: 21, form: ['W', 'W', 'W', 'W', 'W'] },
  { pos: 2, team: 'Man City', played: 8, won: 6, drawn: 2, lost: 0, gd: '+15', pts: 20, form: ['W', 'W', 'D', 'W', 'D'] },
  { pos: 3, team: 'Bayern Munich', played: 8, won: 6, drawn: 1, lost: 1, gd: '+11', pts: 19, form: ['W', 'W', 'W', 'L', 'W'] },
  { pos: 4, team: 'Arsenal', played: 8, won: 6, drawn: 1, lost: 1, gd: '+12', pts: 19, form: ['W', 'D', 'W', 'W', 'W'] },
  { pos: 5, team: 'Barcelona', played: 8, won: 5, drawn: 2, lost: 1, gd: '+7', pts: 17, form: ['W', 'W', 'D', 'W', 'L'] },
  { pos: 6, team: 'Inter Milan', played: 8, won: 5, drawn: 2, lost: 1, gd: '+6', pts: 17, form: ['W', 'D', 'W', 'W', 'D'] },
  { pos: 7, team: 'Paris Saint-Germain', played: 8, won: 5, drawn: 1, lost: 2, gd: '+5', pts: 16, form: ['L', 'W', 'W', 'W', 'D'] },
  { pos: 8, team: 'Liverpool', played: 8, won: 5, drawn: 1, lost: 2, gd: '+6', pts: 16, form: ['W', 'L', 'W', 'W', 'D'] },
  { pos: 9, team: 'Bayer Leverkusen', played: 8, won: 5, drawn: 0, lost: 3, gd: '+4', pts: 15, form: ['W', 'W', 'L', 'W', 'W'] },
  { pos: 10, team: 'Aston Villa', played: 8, won: 4, drawn: 2, lost: 2, gd: '+4', pts: 14, form: ['D', 'W', 'W', 'L', 'W'] },
  { pos: 11, team: 'Atlético Madrid', played: 8, won: 4, drawn: 2, lost: 2, gd: '+2', pts: 14, form: ['W', 'D', 'L', 'W', 'D'] },
  { pos: 12, team: 'Borussia Dortmund', played: 8, won: 4, drawn: 1, lost: 3, gd: '+3', pts: 13, form: ['L', 'W', 'W', 'L', 'W'] },
];

export const LEAGUE_ONE_TABLE: LeagueTableTeam[] = [
  { pos: 1, team: 'Birmingham City', played: 33, won: 22, drawn: 7, lost: 4, gd: '+38', pts: 73, form: ['W', 'W', 'W', 'D', 'W'] },
  { pos: 2, team: 'Wrexham', played: 33, won: 20, drawn: 8, lost: 5, gd: '+28', pts: 68, form: ['W', 'W', 'D', 'W', 'L'] },
  { pos: 3, team: 'Huddersfield Town', played: 33, won: 19, drawn: 7, lost: 7, gd: '+22', pts: 64, form: ['W', 'D', 'W', 'W', 'D'] },
  { pos: 4, team: 'Bolton Wanderers', played: 33, won: 18, drawn: 8, lost: 7, gd: '+20', pts: 62, form: ['W', 'W', 'D', 'L', 'D'] },
  { pos: 5, team: 'Charlton Athletic', played: 33, won: 17, drawn: 9, lost: 7, gd: '+18', pts: 60, form: ['W', 'W', 'W', 'D', 'W'] },
  { pos: 6, team: 'Barnsley', played: 33, won: 17, drawn: 8, lost: 8, gd: '+14', pts: 59, form: ['W', 'L', 'W', 'W', 'W'] },
  { pos: 7, team: 'Lincoln City', played: 33, won: 15, drawn: 11, lost: 7, gd: '+15', pts: 56, form: ['W', 'W', 'D', 'W', 'D'] },
  { pos: 8, team: 'Stockport County', played: 33, won: 15, drawn: 9, lost: 9, gd: '+12', pts: 54, form: ['L', 'W', 'W', 'D', 'L'] },
  { pos: 9, team: 'Peterborough United', played: 33, won: 14, drawn: 7, lost: 12, gd: '+9', pts: 49, form: ['L', 'W', 'L', 'W', 'L'] },
  { pos: 10, team: 'Reading', played: 33, won: 13, drawn: 9, lost: 11, gd: '+3', pts: 48, form: ['L', 'D', 'W', 'W', 'L'] },
  { pos: 21, team: 'Cambridge United', played: 33, won: 7, drawn: 10, lost: 16, gd: '-18', pts: 31, form: ['L', 'L', 'D', 'L', 'D'] },
  { pos: 22, team: 'Shrewsbury Town', played: 33, won: 6, drawn: 11, lost: 16, gd: '-23', pts: 29, form: ['D', 'L', 'L', 'D', 'L'] },
  { pos: 23, team: 'Crawley Town', played: 33, won: 6, drawn: 9, lost: 18, gd: '-27', pts: 27, form: ['L', 'L', 'L', 'D', 'L'] },
  { pos: 24, team: 'Burton Albion', played: 33, won: 4, drawn: 10, lost: 19, gd: '-33', pts: 22, form: ['L', 'D', 'L', 'L', 'D'] },
];

export const BBC_PUNDIT_STORIES: PunditStory[] = [
  {
    id: 'pundit-1',
    punditName: 'Alan Shearer',
    punditRole: 'MOTD Pundit & Premier League All-Time Record Scorer',
    punditImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tag: 'SHEARER ANALYSIS',
    title: "Why Erling Haaland's blindside movement makes Man City unstoppable",
    quote: "Defenders are caught ball-watching while Haaland moves into their blindspot. You cannot teach that natural predator instinct — he is redefining the modern number nine.",
    topicCategory: 'Premier League',
    readTime: '4 min read',
  },
  {
    id: 'pundit-2',
    punditName: 'Gary Lineker',
    punditRole: 'Match of the Day Lead Anchor',
    punditImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    tag: 'MOTD DEBRIEF',
    title: "Weekend VAR decisions and why refereeing standards need reform",
    quote: "Supporters inside stadiums are waiting four minutes while officials search for freeze-frames. Accuracy without transparency is slowly eroding matchday enjoyment.",
    topicCategory: 'Premier League',
    readTime: '5 min read',
  },
  {
    id: 'pundit-3',
    punditName: 'Chris Sutton',
    punditRole: 'WorldScope 5 Live & MOTD Columnist',
    punditImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    tag: "SUTTON'S PREDICTIONS",
    title: "Who wins the Etihad title showdown? Sutton takes on celebrity guest",
    quote: "Arsenal have the resilience and defensive spine this year. I'm backing Arteta's men to claim a vital result in Manchester that keeps them in pole position.",
    topicCategory: 'Premier League',
    readTime: '3 min read',
  },
  {
    id: 'pundit-4',
    punditName: 'Micah Richards',
    punditRole: 'WorldScope Sport Pundit & Premier League Winner',
    punditImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    tag: "MICAH'S COLUMN",
    title: "Why William Saliba and Gabriel are the best centre-back duo in Europe",
    quote: "Gabriel provides the raw ferocity and tackles everything, while Saliba reads the danger before it happens. It's the closest thing to Ferdinand and Vidic we've seen in a decade.",
    topicCategory: 'Premier League',
    readTime: '4 min read',
  },
  {
    id: 'pundit-5',
    punditName: 'Pat Nevin',
    punditRole: 'WorldScope 5 Live Football Analyst',
    punditImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    tag: 'CHALKBOARD CLINIC',
    title: "The pressing traps and inverted full-back evolutions defining 2026",
    quote: "Notice how Leeds and Burnley in the Championship mirror top-flight pressing structures. The transition speed from winning the ball in the central third is extraordinary.",
    topicCategory: 'Championship',
    readTime: '4 min read',
  },
  {
    id: 'pundit-6',
    punditName: 'Karen Carney',
    punditRole: 'WorldScope Football Analyst & England Hall of Fame',
    punditImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    tag: 'TACTICAL ROOM',
    title: "Inside the midfield rotations that make modern English teams tick",
    quote: "The days of rigid number sixes and eights are over. The teams competing at the summit rotate their midfielders seamlessly into half-spaces to drag defenders out of position.",
    topicCategory: 'Premier League',
    readTime: '5 min read',
  },
];

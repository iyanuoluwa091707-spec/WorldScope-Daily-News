import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  RefreshCw, 
  Activity, 
  BarChart3, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';
import { 
  MARKET_QUOTES, 
  MarketQuote, 
  ChartDataPoint, 
  generateChartSeries, 
  MarketDataApi 
} from '../services/marketDataApi';

interface LiveMarketChartProps {
  initialSymbol?: string;
  onSelectArticleTopic?: (topic: string) => void;
}

export const LiveMarketChart: React.FC<LiveMarketChartProps> = ({
  initialSymbol = '^FTSE',
  onSelectArticleTopic
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol);
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candlestick' | 'line'>('area');
  const [showMA, setShowMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  
  const [quote, setQuote] = useState<MarketQuote>(MARKET_QUOTES[initialSymbol] || MARKET_QUOTES['^FTSE']);
  const [chartPoints, setChartPoints] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeAssetTab, setActiveAssetTab] = useState<'indices' | 'stocks' | 'commodities' | 'currencies'>('indices');

  // Hover state
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fetch chart data when symbol or timeframe changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const result = await MarketDataApi.getChartData(selectedSymbol, timeframe);
        if (isMounted) {
          setQuote(result.quote);
          setChartPoints(result.points);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          const fallbackQuote = MARKET_QUOTES[selectedSymbol] || MARKET_QUOTES['^FTSE'];
          setQuote(fallbackQuote);
          setChartPoints(generateChartSeries(selectedSymbol, timeframe));
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [selectedSymbol, timeframe]);

  // Live real-time tick pulse simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setQuote((prevQuote) => {
        const tickDelta = (Math.random() - 0.49) * (prevQuote.price * 0.0004);
        const newPrice = Math.round((prevQuote.price + tickDelta) * 100) / 100;
        const newChange = Math.round((newPrice - prevQuote.previousClose) * 100) / 100;
        const newChangePercent = Math.round((newChange / prevQuote.previousClose) * 10000) / 100;

        return {
          ...prevQuote,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          dayHigh: Math.max(prevQuote.dayHigh, newPrice),
          dayLow: Math.min(prevQuote.dayLow, newPrice),
          updatedAt: 'Live'
        };
      });

      // Update the latest point on the 1D chart
      if (timeframe === '1D') {
        setChartPoints((prevPoints) => {
          if (prevPoints.length === 0) return prevPoints;
          const updated = [...prevPoints];
          const last = updated[updated.length - 1];
          const tickDelta = (Math.random() - 0.49) * (last.close * 0.0004);
          const newClose = Math.round((last.close + tickDelta) * 100) / 100;
          updated[updated.length - 1] = {
            ...last,
            close: newClose,
            price: newClose,
            high: Math.max(last.high, newClose),
            low: Math.min(last.low, newClose)
          };
          return updated;
        });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, timeframe]);

  const isPositive = quote.change >= 0;

  // Chart dimensions & scaling calculations
  const chartMetrics = useMemo(() => {
    if (chartPoints.length === 0) return null;

    const width = 800;
    const height = 340;
    const paddingLeft = 10;
    const paddingRight = 65;
    const paddingTop = 20;
    const paddingBottom = showVolume ? 60 : 25;
    const volumeHeight = showVolume ? 45 : 0;
    const plotHeight = height - paddingTop - paddingBottom;
    const plotWidth = width - paddingLeft - paddingRight;

    const prices = chartPoints.flatMap(p => [p.low, p.high, p.close]);
    if (showMA) {
      chartPoints.forEach(p => { if (p.ma20) prices.push(p.ma20); });
    }
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    const paddedMin = minPrice - priceRange * 0.05;
    const paddedMax = maxPrice + priceRange * 0.05;
    const paddedRange = paddedMax - paddedMin;

    const maxVolume = Math.max(...chartPoints.map(p => p.volume || 0)) || 1;

    const getX = (index: number) => {
      return paddingLeft + (index / (chartPoints.length - 1 || 1)) * plotWidth;
    };

    const getY = (val: number) => {
      return paddingTop + plotHeight - ((val - paddedMin) / paddedRange) * plotHeight;
    };

    // Construct SVG Line and Area path
    const linePathPoints = chartPoints.map((p, i) => `${getX(i).toFixed(1)},${getY(p.close).toFixed(1)}`);
    const linePath = `M ${linePathPoints.join(' L ')}`;
    const areaPath = `${linePath} L ${getX(chartPoints.length - 1).toFixed(1)},${(paddingTop + plotHeight).toFixed(1)} L ${getX(0).toFixed(1)},${(paddingTop + plotHeight).toFixed(1)} Z`;

    // Moving average path
    let maPath = '';
    if (showMA) {
      const maPoints = chartPoints
        .map((p, i) => p.ma20 ? `${getX(i).toFixed(1)},${getY(p.ma20).toFixed(1)}` : null)
        .filter(Boolean);
      if (maPoints.length > 0) {
        maPath = `M ${maPoints.join(' L ')}`;
      }
    }

    // Horizontal grid price lines
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
      const val = paddedMin + ratio * paddedRange;
      const y = getY(val);
      return { val, y };
    });

    return {
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      volumeHeight,
      plotHeight,
      plotWidth,
      paddedMin,
      paddedMax,
      paddedRange,
      maxVolume,
      getX,
      getY,
      linePath,
      areaPath,
      maPath,
      gridLines
    };
  }, [chartPoints, showMA, showVolume]);

  // Handle pointer hover across SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !chartMetrics || chartPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * chartMetrics.width;

    const relativeX = Math.max(0, Math.min(chartMetrics.plotWidth, svgX - chartMetrics.paddingLeft));
    const index = Math.round((relativeX / chartMetrics.plotWidth) * (chartPoints.length - 1));
    const safeIndex = Math.max(0, Math.min(chartPoints.length - 1, index));

    setHoveredPoint(chartPoints[safeIndex]);
    setHoverX(chartMetrics.getX(safeIndex));
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverX(null);
  };

  const currentPoint = hoveredPoint || (chartPoints.length > 0 ? chartPoints[chartPoints.length - 1] : null);

  // Group quotes for quick switcher
  const categorizedQuotes = useMemo(() => {
    const list = Object.values(MARKET_QUOTES);
    return {
      indices: list.filter(q => q.category === 'indices'),
      stocks: list.filter(q => q.category === 'stocks'),
      commodities: list.filter(q => q.category === 'commodities'),
      currencies: list.filter(q => q.category === 'currencies'),
    };
  }, []);

  return (
    <div className="bg-[#121212] text-white border-y border-neutral-800 shadow-2xl">
      {/* Ticker Bar (Top Horizontal Strip) */}
      <div className="bg-black border-b border-neutral-800 overflow-x-auto no-scrollbar py-2 px-4">
        <div className="flex items-center gap-4 text-xs font-mono min-w-max">
          <div className="flex items-center gap-1.5 text-neutral-400 font-sans font-bold pr-2 border-r border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>MARKET PULSE</span>
          </div>

          {Object.values(MARKET_QUOTES).slice(0, 8).map((item) => {
            const isUp = item.change >= 0;
            const isSelected = item.symbol === selectedSymbol;
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => setSelectedSymbol(item.symbol)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-neutral-800 text-white font-bold ring-1 ring-neutral-700' 
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span className="font-semibold">{item.name}</span>
                <span className="text-white">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`font-bold flex items-center ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Terminal Body */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header with Title and Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="bg-[#B80000] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs">
                BUSINESS & MARKETS WIRE
              </span>
              <span className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                <Clock className="w-3.5 h-3.5" />
                Updated {lastUpdated || quote.updatedAt}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                London & Global Trading Live
              </span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {quote.name}
              </h2>
              <span className="text-sm font-mono text-neutral-400">
                {quote.symbol} • {quote.exchange} ({quote.currency})
              </span>
            </div>
          </div>

          {/* Real-time Price and Change Display */}
          <div className="flex items-center gap-4 bg-neutral-900/90 border border-neutral-800 p-3 rounded-lg">
            <div>
              <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Current Price</div>
              <div className="text-3xl font-mono font-black tracking-tight text-white">
                {quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs font-normal text-neutral-400 ml-1.5">{quote.currency}</span>
              </div>
            </div>

            <div className="border-l border-neutral-800 pl-4">
              <div className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Day Change</div>
              <div className={`flex items-center gap-1 text-base font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isPositive ? '+' : ''}{quote.change.toFixed(2)}</span>
                <span className="text-xs bg-neutral-800 px-1.5 py-0.5 rounded ml-1">
                  {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80">
          {/* Timeframe Selector */}
          <div className="inline-flex bg-neutral-900 p-1 rounded-md border border-neutral-800">
            {(['1D', '5D', '1M', '6M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-neutral-100 text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type & Indicator Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex bg-neutral-900 p-1 rounded-md border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer ${chartType === 'area' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Area
              </button>
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer ${chartType === 'line' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Line
              </button>
              <button
                type="button"
                onClick={() => setChartType('candlestick')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer ${chartType === 'candlestick' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Candlestick
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMA(!showMA)}
              className={`text-xs px-2.5 py-1.5 rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showMA ? 'border-amber-500/60 text-amber-400 bg-amber-950/30' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-0.5 bg-amber-400 inline-block" />
              MA 20
            </button>

            <button
              type="button"
              onClick={() => setShowVolume(!showVolume)}
              className={`text-xs px-2.5 py-1.5 rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showVolume ? 'border-blue-500/60 text-blue-400 bg-blue-950/30' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Volume
            </button>

            <button
              type="button"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`text-xs px-2.5 py-1.5 rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isLiveStreaming ? 'border-emerald-500/60 text-emerald-400 bg-emerald-950/30' : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Toggle simulated real-time market ticks"
            >
              <Activity className="w-3.5 h-3.5" />
              {isLiveStreaming ? 'Live Streaming' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Hover Readout Bar */}
        <div className="py-2.5 px-3 bg-neutral-900/50 border border-neutral-800/60 rounded-t mt-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4 text-neutral-300">
            <span className="text-neutral-400">Time: <strong className="text-white">{currentPoint?.time || '--'}</strong></span>
            <span>Close: <strong className="text-white font-bold">{currentPoint?.close?.toLocaleString() || '--'}</strong></span>
            {chartType === 'candlestick' && (
              <>
                <span className="hidden sm:inline">Open: <strong className="text-neutral-200">{currentPoint?.open?.toLocaleString()}</strong></span>
                <span className="hidden sm:inline">High: <strong className="text-emerald-400">{currentPoint?.high?.toLocaleString()}</strong></span>
                <span className="hidden sm:inline">Low: <strong className="text-rose-400">{currentPoint?.low?.toLocaleString()}</strong></span>
              </>
            )}
            {showMA && currentPoint?.ma20 && (
              <span className="text-amber-400 hidden md:inline">MA20: <strong>{currentPoint.ma20.toLocaleString()}</strong></span>
            )}
          </div>

          {showVolume && currentPoint?.volume && (
            <div className="text-neutral-400">
              Bar Vol: <strong className="text-neutral-200">{currentPoint.volume.toLocaleString()}</strong>
            </div>
          )}
        </div>

        {/* Chart Canvas Area */}
        <div className="relative bg-neutral-950 border border-t-0 border-neutral-800 rounded-b p-2 sm:p-4 min-h-[340px]">
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center z-20">
              <div className="flex items-center gap-2 text-neutral-300 font-mono text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                Loading Financial Instrument Data...
              </div>
            </div>
          )}

          {chartMetrics && (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${chartMetrics.width} ${chartMetrics.height}`}
              className="w-full h-auto cursor-crosshair select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                {/* Gradient for area fill */}
                <linearGradient id="chartGradientUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="85%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradientDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="85%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines and price labels */}
              {chartMetrics.gridLines.map((grid, i) => (
                <g key={i}>
                  <line
                    x1={chartMetrics.paddingLeft}
                    y1={grid.y}
                    x2={chartMetrics.width - chartMetrics.paddingRight}
                    y2={grid.y}
                    stroke="#262626"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={chartMetrics.width - chartMetrics.paddingRight + 8}
                    y={grid.y + 3}
                    fill="#737373"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {grid.val >= 1000 ? grid.val.toFixed(1) : grid.val.toFixed(2)}
                  </text>
                </g>
              ))}

              {/* Volume Bars (Sub-chart at bottom) */}
              {showVolume && chartPoints.map((p, i) => {
                const x = chartMetrics.getX(i);
                const barH = (p.volume / chartMetrics.maxVolume) * chartMetrics.volumeHeight;
                const barY = chartMetrics.height - chartMetrics.paddingBottom + chartMetrics.volumeHeight - barH;
                const isGreen = p.close >= p.open;
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - 2}
                    y={barY}
                    width="4"
                    height={barH}
                    fill={isGreen ? '#10b981' : '#f43f5e'}
                    opacity="0.3"
                  />
                );
              })}

              {/* Area fill */}
              {chartType === 'area' && (
                <path
                  d={chartMetrics.areaPath}
                  fill={`url(#${isPositive ? 'chartGradientUp' : 'chartGradientDown'})`}
                />
              )}

              {/* Line chart or Area perimeter */}
              {(chartType === 'area' || chartType === 'line') && (
                <path
                  d={chartMetrics.linePath}
                  fill="none"
                  stroke={isPositive ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Candlesticks view */}
              {chartType === 'candlestick' && chartPoints.map((p, i) => {
                const x = chartMetrics.getX(i);
                const yOpen = chartMetrics.getY(p.open);
                const yClose = chartMetrics.getY(p.close);
                const yHigh = chartMetrics.getY(p.high);
                const yLow = chartMetrics.getY(p.low);
                const isGreen = p.close >= p.open;
                const candleTop = Math.min(yOpen, yClose);
                const candleHeight = Math.max(2, Math.abs(yClose - yOpen));

                return (
                  <g key={`candle-${i}`}>
                    {/* High-Low Wick */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={isGreen ? '#10b981' : '#f43f5e'}
                      strokeWidth="1.2"
                    />
                    {/* Candle Body */}
                    <rect
                      x={x - 3.5}
                      y={candleTop}
                      width="7"
                      height={candleHeight}
                      fill={isGreen ? '#10b981' : '#f43f5e'}
                      stroke={isGreen ? '#10b981' : '#f43f5e'}
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Moving average line */}
              {showMA && chartMetrics.maPath && (
                <path
                  d={chartMetrics.maPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />
              )}

              {/* Hover crosshair & active dot */}
              {hoverX !== null && hoveredPoint && (
                <g>
                  {/* Vertical Guide */}
                  <line
                    x1={hoverX}
                    y1={chartMetrics.paddingTop}
                    x2={hoverX}
                    y2={chartMetrics.height - chartMetrics.paddingBottom}
                    stroke="#a3a3a3"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Price marker dot */}
                  <circle
                    cx={hoverX}
                    cy={chartMetrics.getY(hoveredPoint.close)}
                    r="4.5"
                    fill="#ffffff"
                    stroke={isPositive ? '#10b981' : '#f43f5e'}
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>
          )}

          {/* Time axis labels */}
          {chartPoints.length > 0 && (
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 pt-2 px-3 border-t border-neutral-900">
              <span>{chartPoints[0].time}</span>
              <span className="hidden sm:inline">{chartPoints[Math.floor(chartPoints.length / 2)].time}</span>
              <span>{chartPoints[chartPoints.length - 1].time}</span>
            </div>
          )}
        </div>

        {/* Fundamental Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 my-4">
          <div className="bg-neutral-900/60 p-3 rounded border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Prev Close</span>
            <span className="text-sm font-mono font-bold text-neutral-100">
              {quote.previousClose.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-neutral-900/60 p-3 rounded border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Open</span>
            <span className="text-sm font-mono font-bold text-neutral-100">
              {quote.open.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-neutral-900/60 p-3 rounded border border-neutral-800/80 col-span-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Day Range</span>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-300">
              <span>{quote.dayLow.toLocaleString()}</span>
              <div className="flex-1 mx-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 bottom-0 bg-emerald-500" 
                  style={{
                    left: `${Math.max(0, Math.min(100, ((quote.price - quote.dayLow) / (quote.dayHigh - quote.dayLow || 1)) * 100))}%`,
                    width: '4px'
                  }}
                />
              </div>
              <span>{quote.dayHigh.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-neutral-900/60 p-3 rounded border border-neutral-800/80 col-span-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">52-Week Range</span>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-300">
              <span>{quote.week52Low.toLocaleString()}</span>
              <div className="flex-1 mx-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 bottom-0 bg-blue-500" 
                  style={{
                    left: `${Math.max(0, Math.min(100, ((quote.price - quote.week52Low) / (quote.week52High - quote.week52Low || 1)) * 100))}%`,
                    width: '4px'
                  }}
                />
              </div>
              <span>{quote.week52High.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-neutral-900/60 p-3 rounded border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Volume</span>
            <span className="text-sm font-mono font-bold text-neutral-100">{quote.volume}</span>
          </div>

          <div className="bg-neutral-900/60 p-3 rounded border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
              {quote.marketCap ? 'Market Cap' : 'Exchange'}
            </span>
            <span className="text-sm font-mono font-bold text-neutral-100">
              {quote.marketCap || quote.exchange.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Watchlist & Market Segment Switcher */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              Global Market Watchlists
            </h3>

            {/* Segment tabs */}
            <div className="inline-flex bg-neutral-900 p-1 rounded border border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveAssetTab('indices')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  activeAssetTab === 'indices' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Major Indices
              </button>
              <button
                type="button"
                onClick={() => setActiveAssetTab('stocks')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  activeAssetTab === 'stocks' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Featured Equities
              </button>
              <button
                type="button"
                onClick={() => setActiveAssetTab('commodities')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  activeAssetTab === 'commodities' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Commodities
              </button>
              <button
                type="button"
                onClick={() => setActiveAssetTab('currencies')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  activeAssetTab === 'currencies' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Forex FX
              </button>
            </div>
          </div>

          {/* Asset Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categorizedQuotes[activeAssetTab].map((item) => {
              const isUp = item.change >= 0;
              const isSelected = item.symbol === selectedSymbol;

              return (
                <div
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-neutral-800/90 border-neutral-600 shadow-md ring-1 ring-neutral-500'
                      : 'bg-neutral-900/50 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-neutral-300 group-hover:text-white">
                      {item.symbol}
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="text-xs font-medium text-neutral-400 truncate mb-2">
                    {item.name}
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-mono font-black text-white">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {item.currency}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

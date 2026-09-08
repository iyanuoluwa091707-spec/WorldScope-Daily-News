import React from 'react';

interface LogoProps {
  variant?: 'header' | 'footer' | 'compact' | 'mark';
  className?: string;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  className = '',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  // SVG Scope + Globe Vector Mark
  const LogoMark = ({ size = 32 }: { size?: number }) => (
    <div
      className="relative flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Precision Scope Ring */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke={isDark ? '#FFFFFF' : '#000000'}
          strokeWidth="2.5"
        />

        {/* Global Latitudinal Curve */}
        <ellipse
          cx="20"
          cy="20"
          rx="18"
          ry="7.5"
          stroke={isDark ? '#FFFFFF' : '#000000'}
          strokeWidth="1.5"
          strokeDasharray="1 0"
        />

        {/* Global Longitudinal Curve */}
        <ellipse
          cx="20"
          cy="20"
          rx="7.5"
          ry="18"
          stroke={isDark ? '#FFFFFF' : '#000000'}
          strokeWidth="1.5"
        />

        {/* Precision Scope Reticle Crosshairs */}
        <line
          x1="20"
          y1="2"
          x2="20"
          y2="7"
          stroke={isDark ? '#FFD200' : '#B80000'}
          strokeWidth="2.5"
          strokeLinecap="square"
        />
        <line
          x1="20"
          y1="33"
          x2="20"
          y2="38"
          stroke={isDark ? '#FFD200' : '#B80000'}
          strokeWidth="2.5"
          strokeLinecap="square"
        />
        <line
          x1="2"
          y1="20"
          x2="7"
          y2="20"
          stroke={isDark ? '#FFD200' : '#B80000'}
          strokeWidth="2.5"
          strokeLinecap="square"
        />
        <line
          x1="33"
          y1="20"
          x2="38"
          y2="20"
          stroke={isDark ? '#FFD200' : '#B80000'}
          strokeWidth="2.5"
          strokeLinecap="square"
        />

        {/* Central Aperture Focal Point */}
        <circle
          cx="20"
          cy="20"
          r="2.75"
          fill={isDark ? '#FFD200' : '#B80000'}
        />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <LogoMark size={32} />;
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 sm:gap-2 select-none flex-nowrap whitespace-nowrap ${className}`}>
        <LogoMark size={24} />
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none flex-nowrap whitespace-nowrap">
          <span className={`font-black text-xs sm:text-sm uppercase tracking-tight whitespace-nowrap ${isDark ? 'text-white' : 'text-black'}`}>
            WorldScope
          </span>
          <span className="bg-[#B80000] text-white text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.5 uppercase tracking-wider rounded-xs whitespace-nowrap shrink-0">
            Daily
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2.5 sm:gap-3 select-none flex-nowrap whitespace-nowrap ${className}`}>
        <LogoMark size={32} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 sm:gap-2 leading-none flex-nowrap whitespace-nowrap">
            <span className={`font-black text-base sm:text-xl uppercase tracking-tight whitespace-nowrap ${isDark ? 'text-white' : 'text-black'}`}>
              WorldScope
            </span>
            <span className="bg-[#B80000] text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 uppercase tracking-widest rounded-xs whitespace-nowrap shrink-0">
              Daily
            </span>
          </div>
          <span className={`text-[10px] sm:text-[11px] font-medium tracking-wide mt-1 whitespace-nowrap ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Global Journalism & Real-time Wire
          </span>
        </div>
      </div>
    );
  }

  // Default 'header' variant - responsive layout ensuring Daily is always alongside WorldScope and never covers it
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 select-none flex-nowrap whitespace-nowrap ${className}`}>
      <div className="shrink-0 flex items-center justify-center">
        {/* Responsive Logo Mark */}
        <div className="block sm:hidden">
          <LogoMark size={22} />
        </div>
        <div className="hidden sm:block">
          <LogoMark size={28} />
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap whitespace-nowrap shrink-0">
        <span className={`font-black text-sm sm:text-lg md:text-xl tracking-tight uppercase font-sans whitespace-nowrap leading-none ${isDark ? 'text-white' : 'text-black'}`}>
          WorldScope
        </span>
        <span className="bg-black text-white text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-black px-1 sm:px-1.5 md:px-2 py-0.5 uppercase tracking-wider rounded-xs border border-neutral-700 whitespace-nowrap shrink-0 leading-none">
          Daily
        </span>
      </div>
    </div>
  );
};

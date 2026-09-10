import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('worldscope_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('worldscope_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('worldscope_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      type="button"
      id="worldscope-dark-mode-toggle"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer text-xs font-bold border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100 ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#FFD200]" />
          {showLabel && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-neutral-700" />
          {showLabel && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
};

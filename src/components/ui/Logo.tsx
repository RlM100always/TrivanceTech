import React, { useState } from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Drop the real logo file at public/logo.png (or .svg/.webp — just update LOGO_SRC below
// to match the extension). Files in public/ are served from the site root, so
// public/logo.png becomes reachable at /logo.png with no import needed.
const LOGO_SRC = '/logo.png';

const Logo: React.FC<LogoProps> = ({ variant = 'light', size = 'md', className = '' }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-neutral-900 dark:text-white';
  const accentColor = variant === 'light' ? '#60A5FA' : '#2563EB';

  return (
    <div className={`flex items-center ${className}`}>
      {imageFailed ? (
        // Fallback inline mark — shown only if /logo.png hasn't been added yet.
        <svg
          className={sizeClasses[size]}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2L36 34H4L20 2Z" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1.5" />
          <path d="M20 8L30 26H10L20 8Z" fill={accentColor} fillOpacity="0.8" />
          <path d="M20 14L24 20H16L20 14Z" fill="white" fillOpacity="0.9" />
          <circle cx="15" cy="22" r="1.5" fill={accentColor} />
          <circle cx="25" cy="22" r="1.5" fill={accentColor} />
          <circle cx="20" cy="28" r="1.5" fill={accentColor} />
        </svg>
      ) : (
        <img
          src={LOGO_SRC}
          alt="AiTechWorlds"
          className={`${sizeClasses[size]} w-auto object-contain`}
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="ml-3">
        <span className={`text-xl font-bold ${textColor}`}>AiTech</span>
        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Worlds</span>
      </div>
    </div>
  );
};

export default Logo;
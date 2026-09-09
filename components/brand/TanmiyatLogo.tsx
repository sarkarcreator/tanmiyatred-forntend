'use client';

import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'gold' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDescriptor?: boolean;
  symbolOnly?: boolean;
  className?: string;
}

export const TanmiyatLogo: React.FC<LogoProps> = ({
  variant = 'gold',
  size = 'md',
  showDescriptor = true,
  symbolOnly = false,
  className = '',
}) => {
  // Height configurations
  const dimensions = {
    sm: { height: 38, width: symbolOnly ? 38 : 130, emblemScale: 0.7 },
    md: { height: 52, width: symbolOnly ? 52 : 180, emblemScale: 1 },
    lg: { height: 72, width: symbolOnly ? 72 : 240, emblemScale: 1.35 },
    xl: { height: 96, width: symbolOnly ? 96 : 320, emblemScale: 1.8 },
  }[size];

  // Colors based on luxury palette:
  // Obsidian: #0A0A09, Warm Ivory: #F5F2EB, Champagne Gold: #B79A62, Stone: #C8C0B3
  const isDarkBg = variant === 'dark' || variant === 'gold';
  const goldGradientId = `tanmiyat-gold-${size}-${variant}`;
  const goldGlowId = `tanmiyat-glow-${size}`;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ letterSpacing: '0.05em' }}
    >
      <svg
        viewBox={symbolOnly ? '0 0 100 100' : '0 0 340 160'}
        className="w-auto"
        style={{ height: `${dimensions.height}px` }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tanmiyat Real Estate Development LLC"
      >
        <defs>
          {/* Subtle champagne gold gradient matching Tanmiyat's official emblem */}
          <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D8BE8A" />
            <stop offset="25%" stopColor="#C4A86E" />
            <stop offset="50%" stopColor="#E9D7AF" />
            <stop offset="75%" stopColor="#B79A62" />
            <stop offset="100%" stopColor="#8C6F3B" />
          </linearGradient>

          <linearGradient id={`${goldGradientId}-highlight`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9F5EC" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#C4A86E" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8C6F3B" stopOpacity="0.9" />
          </linearGradient>

          <filter id={goldGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0A0A09" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* EMBLEM: Soaring 3-Tower Skyline with Sweeping Arabesque Ribbon */}
        <g
          transform={symbolOnly ? 'translate(0, 0)' : 'translate(120, 0)'}
          filter={`url(#${goldGlowId})`}
        >
          {/* Left Tower */}
          <path
            d="M25 46 L35 34 L35 68 C35 68 28 68 25 64 Z"
            fill={`url(#${goldGradientId})`}
          />
          <path
            d="M17 56 C20 48 24 43 27 38 L30 42 C26 48 23 54 20 62 Z"
            fill="#D8BE8A"
          />

          {/* Center Highest Skyscraper Spire */}
          <path
            d="M44 14 L50 8 L56 14 L56 70 L44 70 Z"
            fill={`url(#${goldGradientId})`}
          />
          {/* Center Bevel Line */}
          <path
            d="M50 8 L50 70"
            stroke="#F5EFE0"
            strokeWidth="0.75"
            strokeOpacity="0.6"
          />

          {/* Right Tower */}
          <path
            d="M59 20 L66 14 L73 20 L73 68 C68 68 64 68 59 64 Z"
            fill={`url(#${goldGradientId})`}
          />
          <path
            d="M66 14 L66 67"
            stroke="#F5EFE0"
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />

          {/* Sweeping Iconic Arabesque Ribbon */}
          <path
            d="M20 72 C32 68 44 48 60 48 C72 48 80 56 80 56 C80 56 70 51 60 52 C45 53 32 72 20 72 Z"
            fill={`url(#${goldGradientId})`}
          />
          <path
            d="M20 72 C35 70 47 50 63 49 C74 48 80 55 80 55"
            stroke="#FFF4D4"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>

        {!symbolOnly && (
          <>
            {/* BRAND TYPOGRAPHY: TANMIYAT LLC */}
            <text
              x="170"
              y="108"
              textAnchor="middle"
              fontFamily="'Playfair Display', 'Cormorant Garamond', 'Cinzel', Georgia, serif"
              fontSize="29"
              fontWeight="600"
              letterSpacing="7"
              fill={variant === 'light' ? '#0A0A09' : `url(#${goldGradientId})`}
            >
              TANMIYAT
            </text>
            <text
              x="272"
              y="104"
              fontFamily="'Playfair Display', Georgia, serif"
              fontSize="12"
              fontWeight="500"
              letterSpacing="2"
              fill={variant === 'light' ? '#7A756D' : '#D8BE8A'}
            >
              LLC
            </text>

            {showDescriptor && (
              <>
                {/* SECONDARY DESCRIPTOR: REAL ESTATE DEVELOPMENT */}
                <text
                  x="170"
                  y="128"
                  textAnchor="middle"
                  fontFamily="'Manrope', -apple-system, sans-serif"
                  fontSize="8.5"
                  fontWeight="600"
                  letterSpacing="5.5"
                  fill={variant === 'light' ? '#4A463F' : '#C8C0B3'}
                >
                  REAL ESTATE DEVELOPMENT
                </text>

                {/* HERITAGE YEAR: — 1999 — */}
                <line
                  x1="80"
                  y1="144"
                  x2="140"
                  y2="144"
                  stroke={variant === 'light' ? '#B79A62' : '#8C6F3B'}
                  strokeWidth="0.75"
                />
                <text
                  x="170"
                  y="147"
                  textAnchor="middle"
                  fontFamily="'Playfair Display', serif"
                  fontSize="10"
                  fontWeight="500"
                  letterSpacing="3"
                  fill={variant === 'light' ? '#B79A62' : '#D8BE8A'}
                >
                  1999
                </text>
                <line
                  x1="200"
                  y1="144"
                  x2="260"
                  y2="144"
                  stroke={variant === 'light' ? '#B79A62' : '#8C6F3B'}
                  strokeWidth="0.75"
                />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
};

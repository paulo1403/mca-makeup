"use client";

import React from "react";
import Link from "next/link";

type LogoProps = {
  size?: number;
  className?: string;
};

export default function Logo({ size = 40, className = "" }: LogoProps) {
  const s = Math.max(28, Math.min(64, size));
  return (
    <Link href="/" aria-label="Inicio" className={`site-logo inline-block ${className}`}> 
      <svg
        width={s}
        height={s}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden={false}
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="1" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill="var(--logo-bg, transparent)" stroke="var(--logo-stroke, transparent)" strokeWidth="2" />

        <g transform="translate(0,4)">
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontFamily="var(--font-playfair), serif"
            fontWeight="700"
            fontSize="46"
            fill="currentColor"
            style={{ letterSpacing: '-2px' }}
          >
            MC
          </text>
        </g>

        {/* small accent sparkle using the gold gradient */}
        <circle cx="80" cy="22" r="4" fill="url(#g)" opacity="0.95" />
      </svg>
    </Link>
  );
}

import Link from "next/link";
import React from "react";
import "../styles/components/logo.css";

export default function Logo() {
  return (
    <Link href="/" className="cursor-pointer">
      {/* Desktop Logo */}
      <div className="logo-wrapper logo-desktop">
        <svg
          width="200"
          height="44"
          viewBox="0 0 200 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="brand-logo"
        >
          {/* Decorative makeup brush stroke behind */}
          <path
            d="M2 22C2 22 8 18 15 20C22 22 25 26 32 24C39 22 42 18 48 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.15"
            className="logo-accent logo-brush-stroke"
          />

          {/* Monogram Circle */}
          <circle cx="22" cy="22" r="20" fill="url(#logoGradient)" className="logo-circle" />

          {/* MC Monogram */}
          <text
            x="22"
            y="30"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
            fill="white"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
            className="logo-monogram"
          >
            MC
          </text>

          {/* Name - Marcela */}
          <text
            x="52"
            y="20"
            fontSize="16"
            fontWeight="600"
            fill="currentColor"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.3"
            className="logo-name-primary"
          >
            Marcela
          </text>

          {/* Name - Cordero */}
          <text
            x="52"
            y="34"
            fontSize="13"
            fontWeight="400"
            fill="currentColor"
            opacity="0.75"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="1.2"
            className="logo-name-secondary"
          >
            CORDERO
          </text>

          {/* Decorative dots */}
          <circle
            cx="120"
            cy="22"
            r="1.5"
            fill="currentColor"
            opacity="0.4"
            className="logo-dot logo-dot-1"
          />
          <circle
            cx="127"
            cy="22"
            r="1.5"
            fill="currentColor"
            opacity="0.6"
            className="logo-dot logo-dot-2"
          />
          <circle
            cx="134"
            cy="22"
            r="1.5"
            fill="currentColor"
            opacity="0.3"
            className="logo-dot logo-dot-3"
          />

          {/* Subtitle */}
          <text
            x="145"
            y="26"
            fontSize="9"
            fontWeight="500"
            fill="currentColor"
            opacity="0.6"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.8"
            className="logo-subtitle"
          >
            MAKEUP
          </text>

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary-hover)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Mobile Logo - Compact version */}
      <div className="logo-wrapper logo-mobile">
        <svg
          width="110"
          height="40"
          viewBox="0 0 110 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="brand-logo brand-logo-mobile"
        >
          {/* Monogram Circle */}
          <circle cx="20" cy="20" r="18" fill="url(#logoGradientMobile)" className="logo-circle" />

          {/* MC Monogram */}
          <text
            x="20"
            y="27"
            fontSize="18"
            fontWeight="700"
            textAnchor="middle"
            fill="white"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
            className="logo-monogram"
          >
            MC
          </text>

          {/* Name - Marcela (mobile) */}
          <text
            x="46"
            y="17"
            fontSize="14"
            fontWeight="600"
            fill="currentColor"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.2"
            className="logo-name-primary"
          >
            Marcela
          </text>

          {/* Name - Cordero (mobile) */}
          <text
            x="46"
            y="29"
            fontSize="11"
            fontWeight="400"
            fill="currentColor"
            opacity="0.7"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.8"
            className="logo-name-secondary"
          >
            CORDERO
          </text>

          {/* Gradient Definition Mobile */}
          <defs>
            <linearGradient id="logoGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary-hover)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Link>
  );
}

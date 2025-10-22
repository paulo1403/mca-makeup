"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Brush,
  Feather,
  Flower2,
  Gem,
  Palette,
  Sparkles as SparklesIcon,
  Star,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type React from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  blur: number;
  opacity: number;
  colorVar: string; // CSS var name, e.g. '--color-accent-secondary'
  driftX: number;
  driftY: number;
  duration: number;
  delay?: number;
};

// Deterministic layout to avoid hydration mismatch
const PARTICLES: Particle[] = [
  {
    x: 8,
    y: 12,
    size: 180,
    blur: 30,
    opacity: 0.25,
    colorVar: "--color-accent-secondary",
    driftX: 10,
    driftY: 20,
    duration: 10,
  },
  {
    x: 78,
    y: 18,
    size: 140,
    blur: 22,
    opacity: 0.22,
    colorVar: "--color-accent-primary",
    driftX: 12,
    driftY: 14,
    duration: 9,
    delay: 0.2,
  },
  {
    x: 16,
    y: 78,
    size: 200,
    blur: 34,
    opacity: 0.24,
    colorVar: "--color-accent-tertiary",
    driftX: 8,
    driftY: 16,
    duration: 12,
    delay: 0.4,
  },
  {
    x: 90,
    y: 82,
    size: 160,
    blur: 26,
    opacity: 0.2,
    colorVar: "--color-accent-secondary",
    driftX: 14,
    driftY: 10,
    duration: 11,
  },
  {
    x: 50,
    y: 10,
    size: 220,
    blur: 36,
    opacity: 0.18,
    colorVar: "--color-accent-primary",
    driftX: 16,
    driftY: 8,
    duration: 14,
    delay: 0.6,
  },
  {
    x: 6,
    y: 50,
    size: 140,
    blur: 24,
    opacity: 0.22,
    colorVar: "--color-accent-tertiary",
    driftX: 10,
    driftY: 12,
    duration: 10,
  },
  {
    x: 35,
    y: 85,
    size: 120,
    blur: 20,
    opacity: 0.2,
    colorVar: "--color-accent-primary",
    driftX: 12,
    driftY: 10,
    duration: 9,
  },
  {
    x: 82,
    y: 36,
    size: 180,
    blur: 28,
    opacity: 0.23,
    colorVar: "--color-accent-secondary",
    driftX: 8,
    driftY: 16,
    duration: 12,
  },
  {
    x: 28,
    y: 28,
    size: 130,
    blur: 22,
    opacity: 0.21,
    colorVar: "--color-accent-tertiary",
    driftX: 10,
    driftY: 12,
    duration: 11,
  },
  {
    x: 60,
    y: 70,
    size: 210,
    blur: 35,
    opacity: 0.19,
    colorVar: "--color-accent-primary",
    driftX: 14,
    driftY: 14,
    duration: 13,
  },
];

export default function GlobalParticles() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const ICONS = getIconSetForPath(pathname);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* subtle vignette to add depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 800px at 10% 10%, rgba(0,0,0,0.08), transparent 60%)," +
            "radial-gradient(1200px 800px at 90% 90%, rgba(0,0,0,0.06), transparent 60%)",
        }}
      />

      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: p.opacity, scale: 1, rotate: 0 }}
          animate={
            reduceMotion
              ? { x: 0, y: 0, opacity: p.opacity }
              : {
                  x: [0, p.driftX, -p.driftX, 0],
                  y: [0, p.driftY, -p.driftY, 0],
                  scale: [0.96, 1.04, 0.98, 1.02],
                  rotate: [0, 10, -8, 0],
                  opacity: [p.opacity * 0.9, p.opacity, p.opacity * 0.95, p.opacity],
                }
          }
          transition={{
            duration: p.duration * 2,
            delay: p.delay ?? 0,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            filter: `blur(${p.blur}px)`,
            opacity: p.opacity,
            willChange: "transform",
            mixBlendMode: "screen",
            background: `radial-gradient(circle at center, var(${p.colorVar}) 0%, transparent 60%)`,
          }}
        />
      ))}

      {/* Sparkles layer: tiny soft particles with orbital motion */}
      {SPARKLES.map((s, i) => (
        <motion.div
          key={`sparkle-${i}`}
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={
            reduceMotion
              ? { x: 0, y: 0 }
              : {
                  x: [0, s.orbitX, 0, -s.orbitX, 0],
                  y: [0, s.orbitY, 0, -s.orbitY, 0],
                  rotate: [0, 180, 360],
                }
          }
          transition={{
            duration: s.duration,
            delay: s.delay ?? 0,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            filter: `blur(${s.blur}px)`,
            opacity: s.opacity,
            willChange: "transform",
            mixBlendMode: "soft-light",
            background: `radial-gradient(circle at center, var(${s.colorVar}) 0%, transparent 70%)`,
          }}
        />
      ))}

      {/* Lucide icons layer: subtle floating makeup-related outlines */}
      {ICONS.map((icon, i) => (
        <motion.div
          key={`icon-${i}`}
          initial={{ x: 0, y: 0, rotate: 0, opacity: icon.opacity }}
          animate={
            reduceMotion
              ? { opacity: icon.opacity }
              : {
                  x: [0, icon.driftX, -icon.driftX, 0],
                  y: [0, icon.driftY, -icon.driftY, 0],
                  rotate: [0, 8, -6, 0],
                  opacity: [icon.opacity * 0.9, icon.opacity, icon.opacity * 0.95, icon.opacity],
                }
          }
          transition={{
            duration: icon.duration,
            delay: icon.delay ?? 0,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            willChange: "transform",
            mixBlendMode: "soft-light",
            color: `var(${icon.colorVar})`,
          }}
        >
          <icon.Icon size={icon.size} strokeWidth={icon.strokeWidth ?? 1.2} />
        </motion.div>
      ))}
    </div>
  );
}

type Sparkle = {
  x: number;
  y: number;
  size: number;
  blur: number;
  opacity: number;
  colorVar: string;
  orbitX: number;
  orbitY: number;
  duration: number;
  delay?: number;
};

const SPARKLES: Sparkle[] = [
  {
    x: 12,
    y: 30,
    size: 8,
    blur: 2,
    opacity: 0.35,
    colorVar: "--color-accent-secondary",
    orbitX: 6,
    orbitY: 4,
    duration: 9,
  },
  {
    x: 22,
    y: 68,
    size: 10,
    blur: 3,
    opacity: 0.3,
    colorVar: "--color-accent-primary",
    orbitX: 8,
    orbitY: 5,
    duration: 10,
  },
  {
    x: 38,
    y: 20,
    size: 7,
    blur: 2,
    opacity: 0.32,
    colorVar: "--color-accent-tertiary",
    orbitX: 5,
    orbitY: 3,
    duration: 8,
  },
  {
    x: 48,
    y: 82,
    size: 9,
    blur: 3,
    opacity: 0.28,
    colorVar: "--color-accent-primary",
    orbitX: 7,
    orbitY: 5,
    duration: 11,
  },
  {
    x: 66,
    y: 26,
    size: 6,
    blur: 2,
    opacity: 0.3,
    colorVar: "--color-accent-secondary",
    orbitX: 6,
    orbitY: 4,
    duration: 9,
  },
  {
    x: 72,
    y: 54,
    size: 8,
    blur: 2,
    opacity: 0.35,
    colorVar: "--color-accent-tertiary",
    orbitX: 7,
    orbitY: 4,
    duration: 10,
  },
  {
    x: 84,
    y: 36,
    size: 10,
    blur: 3,
    opacity: 0.3,
    colorVar: "--color-accent-primary",
    orbitX: 8,
    orbitY: 6,
    duration: 12,
  },
  {
    x: 16,
    y: 88,
    size: 7,
    blur: 2,
    opacity: 0.32,
    colorVar: "--color-accent-secondary",
    orbitX: 6,
    orbitY: 3,
    duration: 9,
  },
  {
    x: 30,
    y: 44,
    size: 9,
    blur: 3,
    opacity: 0.28,
    colorVar: "--color-accent-tertiary",
    orbitX: 7,
    orbitY: 5,
    duration: 10,
  },
  {
    x: 58,
    y: 72,
    size: 8,
    blur: 2,
    opacity: 0.33,
    colorVar: "--color-accent-primary",
    orbitX: 6,
    orbitY: 4,
    duration: 11,
  },
];

type IconComp = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }
>;

type IconSpec = {
  Icon: IconComp;
  x: number;
  y: number;
  size: number;
  opacity: number;
  colorVar: string;
  driftX: number;
  driftY: number;
  duration: number;
  delay?: number;
  strokeWidth?: number;
};

function getIconSetForPath(pathname: string): IconSpec[] {
  // Avoid background icons in admin to keep dashboard clean
  if (pathname.startsWith("/admin")) return [];

  // Complaint and review pages: calmer set
  if (pathname.includes("libro") || pathname.includes("reclamo") || pathname.includes("review")) {
    return [
      {
        Icon: Feather,
        x: 12,
        y: 22,
        size: 36,
        opacity: 0.12,
        colorVar: "--color-accent-secondary",
        driftX: 10,
        driftY: 8,
        duration: 18,
      },
      {
        Icon: Star,
        x: 28,
        y: 76,
        size: 30,
        opacity: 0.1,
        colorVar: "--color-accent-primary",
        driftX: 12,
        driftY: 10,
        duration: 20,
        delay: 0.5,
      },
      {
        Icon: SparklesIcon,
        x: 44,
        y: 34,
        size: 34,
        opacity: 0.12,
        colorVar: "--color-accent-tertiary",
        driftX: 8,
        driftY: 12,
        duration: 16,
      },
      {
        Icon: Palette,
        x: 66,
        y: 18,
        size: 38,
        opacity: 0.1,
        colorVar: "--color-accent-secondary",
        driftX: 9,
        driftY: 9,
        duration: 19,
      },
      {
        Icon: Flower2,
        x: 82,
        y: 62,
        size: 40,
        opacity: 0.1,
        colorVar: "--color-accent-primary",
        driftX: 12,
        driftY: 8,
        duration: 21,
      },
    ];
  }

  // Default/home and booking pages: more playful set
  return [
    {
      Icon: Brush,
      x: 8,
      y: 18,
      size: 42,
      opacity: 0.12,
      colorVar: "--color-accent-secondary",
      driftX: 12,
      driftY: 10,
      duration: 20,
    },
    {
      Icon: SparklesIcon,
      x: 22,
      y: 68,
      size: 38,
      opacity: 0.12,
      colorVar: "--color-accent-primary",
      driftX: 10,
      driftY: 12,
      duration: 18,
      delay: 0.6,
    },
    {
      Icon: Star,
      x: 38,
      y: 26,
      size: 36,
      opacity: 0.1,
      colorVar: "--color-accent-tertiary",
      driftX: 14,
      driftY: 8,
      duration: 22,
    },
    {
      Icon: Palette,
      x: 56,
      y: 80,
      size: 40,
      opacity: 0.1,
      colorVar: "--color-accent-primary",
      driftX: 8,
      driftY: 14,
      duration: 19,
    },
    {
      Icon: Flower2,
      x: 72,
      y: 32,
      size: 44,
      opacity: 0.1,
      colorVar: "--color-accent-secondary",
      driftX: 12,
      driftY: 10,
      duration: 21,
    },
    {
      Icon: Gem,
      x: 86,
      y: 58,
      size: 36,
      opacity: 0.1,
      colorVar: "--color-accent-tertiary",
      driftX: 10,
      driftY: 12,
      duration: 20,
    },
  ];
}

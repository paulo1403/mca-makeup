"use client";
import React from "react";
import type { Appointment } from "@/hooks/useAppointments";
import { formatPrice, getPriceBreakdown, formatServices, formatDate, formatTime } from "@/utils/appointmentHelpers";

export interface QuoteShareData {
  appointment: Appointment;
  deposit?: number;
}

function getHomeAddress(appointment: Appointment) {
  const parts = [appointment.address, appointment.addressReference, appointment.district].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  const notes = appointment.additionalNotes || "";
  const candidates: string[] = [];
  notes
    .split("\n")
    .map((l) => l.trim())
    .forEach((line) => {
      const low = line.toLowerCase();
      const hasKeyword = low.includes("dirección") || low.includes("ubicación") || low.includes("local") || low.includes("hotel");
      if (hasKeyword) {
        const idx = line.indexOf(":");
        candidates.push(idx >= 0 ? line.slice(idx + 1).trim() : line.trim());
      }
    });
  return candidates.join(" ");
}

export function buildQuoteText({ appointment, deposit = 150 }: QuoteShareData) {
  const services = formatServices(appointment);
  const price = getPriceBreakdown(appointment);
  const lines: string[] = [];
  const fecha = formatDate(appointment.appointmentDate);
  const timeRange = formatTime(appointment.appointmentTime);
  const horaStart = timeRange.includes("-") ? timeRange.split("-")[0].trim() : timeRange;
  const hora = horaStart.replace(" AM", "am").replace(" PM", "pm");
  const locationStr = (appointment.location || "").toLowerCase();
  const homeText = getHomeAddress(appointment);
  const isStudio = locationStr.includes("studio") || locationStr === "studio" || (!homeText && (getPriceBreakdown(appointment).transportCost || 0) === 0);
  const ubicacion = isStudio
    ? "en Av Bolívar 1075 Pueblo Libre:"
    : homeText
      ? `en ${homeText}:`
      : "a domicilio:";
  lines.push("Este sería el detalle del servicio:");
  lines.push(`Cita programada para el ${fecha} a la ${hora} ${ubicacion}`);
  if (!isStudio && homeText && !ubicacion.includes(homeText)) {
    lines.push(`Dirección: ${homeText}`);
  }
  lines.push("");
  services.forEach((s) => {
    const unit = appointment.services?.find((it) => it.name === s.name)?.price ?? 0;
    const totalLinePrice = unit * (s.quantity || 1);
    lines.push(`${s.displayText}: ${new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(totalLinePrice)}`);
  });
  if (price.transportCost > 0) {
    lines.push(`Movilidad: ${new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(price.transportCost)}`);
  }
  lines.push(`Total ${formatPrice(price.totalPrice)}`);
  lines.push(`Adelanto ${formatPrice(deposit)}`);
  lines.push(`Restante ${formatPrice(Math.max(0, (price.totalPrice || 0) - (deposit || 0)))}`);
  return lines.join("\n");
}

export async function generateQuotePng({ appointment, deposit = 150 }: QuoteShareData): Promise<Blob | null> {
  const services = formatServices(appointment);
  const price = getPriceBreakdown(appointment);

  // Tokens visuales desde CSS para que se parezca a la web
  const css = getComputedStyle(document.documentElement);
  const colors = {
    surface: css.getPropertyValue("--color-surface").trim() || "#ffffff",
    surfaceElevated: css.getPropertyValue("--color-surface-elevated").trim() || "#f4ece6",
    border: css.getPropertyValue("--color-border").trim() || "#e5d6c8",
    heading: css.getPropertyValue("--color-heading").trim() || "#2d221b",
    body: css.getPropertyValue("--color-body").trim() || "#5a4a3e",
    muted: css.getPropertyValue("--color-muted").trim() || "#8b7a6d",
    primary: css.getPropertyValue("--color-primary").trim() || "#b08463",
    accent: css.getPropertyValue("--color-accent").trim() || "#b9937b",
    accentSoft: css.getPropertyValue("--color-accent-soft").trim() || "#e6d7c9",
  };

  // Layout parecido a las tarjetas de la web
  const width = 940;
  const padding = 56;
  const lineGap = 16;
  const titleFont = "600 30px 'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, Roboto";
  const lineFont = "500 24px 'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, Roboto";
  const smallFont = "400 20px 'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, Roboto";
  const boldFont = "700 24px 'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, Roboto";
  const radius = 18;
  const innerPad = 32; // padding interno de la tarjeta blanca

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d")!;
  const baseLines = 3;
  const priceRight = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(1000);
  measureCtx.font = boldFont;
  const rightColMin = Math.ceil(measureCtx.measureText(priceRight).width) + 24;
  const cardWMeasure = width - (padding - 4) * 2;
  const contentWMeasure = cardWMeasure - innerPad * 2;
  const leftColMax = contentWMeasure - rightColMin;
  measureCtx.font = smallFont;
  const fecha = formatDate(appointment.appointmentDate);
  const timeRangeHeader = formatTime(appointment.appointmentTime);
  const horaStartHeader = timeRangeHeader.includes("-") ? timeRangeHeader.split("-")
    [0].trim() : timeRangeHeader;
  const horaHeader = horaStartHeader.replace(" AM", "am").replace(" PM", "pm");
  const locationStr2 = (appointment.location || "").toLowerCase();
  const homeText2 = getHomeAddress(appointment);
  const isStudio2 = locationStr2.includes("studio") || locationStr2 === "studio" || (!homeText2 && (price.transportCost || 0) === 0);
  const ubicacion = isStudio2
    ? "en Av Bolívar 1075 Pueblo Libre:"
    : homeText2
      ? `en ${homeText2}:`
      : "a domicilio:";
  const headerWrapped = wrapLines(measureCtx, `Cita programada para el ${fecha} a la ${horaHeader} ${ubicacion}`, contentWMeasure, smallFont);
  measureCtx.font = lineFont;
  let dynamicLines = baseLines + headerWrapped.length;
  // Always include a Dirección line (Studio uses fixed address)
  measureCtx.font = smallFont;
  const dirTextMeasure = isStudio2
    ? "Av Bolívar 1075 Pueblo Libre"
    : [appointment.address, appointment.addressReference, appointment.district].filter(Boolean).join(" ");
  const headerIncludesDir = isStudio2
    ? ubicacion.includes("Av Bolívar 1075 Pueblo Libre")
    : dirTextMeasure ? ubicacion.includes(dirTextMeasure) : false;
  if (dirTextMeasure && !headerIncludesDir) {
    const dirLinesMeasure = wrapLines(measureCtx, `Dirección: ${dirTextMeasure}`, contentWMeasure, smallFont);
    dynamicLines += dirLinesMeasure.length;
  }
  measureCtx.font = lineFont;
  services.forEach((s) => {
    const leftText = `${s.displayText}`;
    const lines = wrapLines(measureCtx, leftText, leftColMax, lineFont);
    dynamicLines += lines.length;
  });
  if ((price.transportCost || 0) > 0) {
    dynamicLines += 1;
  }
  dynamicLines += 4;
  const height = padding * 2 + dynamicLines * 30 + (dynamicLines - 1) * lineGap + 32;

  const dpr = Math.max(2, Math.floor(window.devicePixelRatio || 1));
  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(dpr, dpr);

  // Fondo general
  ctx.fillStyle = colors.surfaceElevated;
  roundRect(ctx, 0, 0, width, height, radius + 6, true, false);

  // Tarjeta interior con borde
  const cardX = padding - 4;
  const cardY = padding - 4;
  const cardW = width - (padding - 4) * 2;
  const cardH = height - (padding - 4) * 2;
  ctx.fillStyle = colors.surface;
  roundRect(ctx, cardX, cardY, cardW, cardH, radius, true, false);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, radius, false, true);

  // Cabecera
  const contentX = cardX + innerPad;
  let y = cardY + innerPad + 4;
  const contentWidth = cardW - innerPad * 2;
  ctx.fillStyle = colors.heading;
  ctx.font = titleFont;
  ctx.textBaseline = "top";
  ctx.fillText("Este sería el detalle del servicio:", contentX, y);
  y += 40 + lineGap;
  ctx.font = smallFont;
  ctx.fillStyle = colors.muted;
  const headerLines = wrapLines(ctx, `Cita programada para el ${fecha} a la ${horaHeader} ${ubicacion}`, contentWidth, smallFont);
  headerLines.forEach((line) => {
    ctx.fillText(line, contentX, y);
    y += 28 + Math.max(0, lineGap - 6);
  });
  {
    const dirText = isStudio2
      ? "Av Bolívar 1075 Pueblo Libre"
      : [appointment.address, appointment.addressReference, appointment.district].filter(Boolean).join(" ");
    const headerHasDir = isStudio2
      ? ubicacion.includes("Av Bolívar 1075 Pueblo Libre")
      : dirText ? ubicacion.includes(dirText) : false;
    if (dirText && !headerHasDir) {
      const dirLines = wrapLines(ctx, `Dirección: ${dirText}`, contentWidth, smallFont);
      dirLines.forEach((line) => {
        ctx.fillText(line, contentX, y);
        y += 28 + Math.max(0, lineGap - 6);
      });
    }
  }
  y += 6;

  // Subtítulo Servicios
  ctx.font = boldFont;
  ctx.fillStyle = colors.heading;
  ctx.fillText("Servicios", contentX, y);
  y += 30 + lineGap;

  // Lista de servicios
  services.forEach((s) => {
    const unit = appointment.services?.find((it) => it.name === s.name)?.price ?? 0;
    const totalLinePrice = unit * (s.quantity || 1);
    const left = `${s.displayText}`;
    const right = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(totalLinePrice);
    y = drawTwoColumnWrapped(ctx, left, right, contentX, y, contentWidth, lineFont, colors.body, boldFont, leftColMax);
    y += Math.max(10, lineGap - 4);
  });
  if (price.transportCost > 0) {
    const left = "Movilidad";
    const right = formatPrice(price.transportCost);
    y = drawTwoColumnWrapped(ctx, left, right, contentX, y, contentWidth, lineFont, colors.body, boldFont, leftColMax);
    y += Math.max(10, lineGap - 4);
  }

  // Separador
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, y);
  ctx.lineTo(contentX + contentWidth, y);
  ctx.stroke();
  y += 18;

  // Total destacado
  ctx.font = boldFont;
  y = drawTwoColumnWrapped(ctx, "Total", formatPrice(price.totalPrice), contentX, y, contentWidth, boldFont, colors.primary, boldFont, leftColMax);
  y += 32;

  // Adelanto
  ctx.font = lineFont;
  y = drawTwoColumnWrapped(ctx, "Adelanto", formatPrice(deposit), contentX, y, contentWidth, lineFont, colors.body, boldFont, leftColMax);
  y += 30 + 8;

  // Restante con "pill" de acento suave, valor a la derecha
  const label = "Restante";
  ctx.font = boldFont;
  const labelW = ctx.measureText(label).width;
  const pillH = 30;
  const pillX = contentX;
  const pillY = y - 6;
  ctx.fillStyle = colors.accentSoft;
  roundRect(ctx, pillX, pillY, labelW + 20, pillH, 10, true, false);
  ctx.fillStyle = colors.accent;
  ctx.fillText(label, pillX + 10, y);
  const value = formatPrice(Math.max(0, (price.totalPrice || 0) - (deposit || 0)));
  const valueW = ctx.measureText(value).width;
  ctx.fillStyle = colors.heading;
  ctx.fillText(value, contentX + contentWidth - valueW, y);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export async function copyQuotePngToClipboard(args: QuoteShareData) {
  const blob = await generateQuotePng(args);
  if (!blob) return false;
  try {
    const ClipboardItemClass = (window as any).ClipboardItem;
    if (!ClipboardItemClass) throw new Error("ClipboardItem unsupported");
    await (navigator.clipboard as any).write([new ClipboardItemClass({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

export default function QuoteShareCard() {
  return null;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: string) {
  ctx.font = font;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = current ? current + " " + w : w;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawTwoColumnWrapped(
  ctx: CanvasRenderingContext2D,
  left: string,
  right: string,
  x: number,
  y: number,
  width: number,
  font: string,
  color: string,
  boldFont: string,
  leftMaxWidth: number,
) {
  ctx.font = boldFont;
  const rightW = ctx.measureText(right).width;
  ctx.fillStyle = color;
  ctx.fillText(right, x + width - rightW, y);
  const lines = wrapLines(ctx, left, leftMaxWidth, font);
  ctx.font = font;
  ctx.fillStyle = color;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * 30);
  }
  return y + lines.length * 30;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: boolean,
  stroke: boolean,
) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius } as any;
  } else {
    radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
  }
  ctx.beginPath();
  ctx.moveTo(x + (radius as any).tl, y);
  ctx.lineTo(x + width - (radius as any).tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + (radius as any).tr);
  ctx.lineTo(x + width, y + height - (radius as any).br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - (radius as any).br, y + height);
  ctx.lineTo(x + (radius as any).bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - (radius as any).bl);
  ctx.lineTo(x, y + (radius as any).tl);
  ctx.quadraticCurveTo(x, y, x + (radius as any).tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

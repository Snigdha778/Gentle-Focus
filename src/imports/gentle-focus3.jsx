import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   FONTS — Playfair Display + Plus Jakarta Sans
   Premium pairing: editorial serif + geometric sans
───────────────────────────────────────── */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
`;

/* ─────────────────────────────────────────
   DESIGN TOKENS & GLOBAL STYLES
───────────────────────────────────────── */
const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Palette */
  --parchment:    #F5F2EC;
  --parchment-2:  #EDE9E1;
  --parchment-3:  #E2DDD4;
  --ivory:        #FDFBF8;
  --ivory-2:      #FAF8F4;

  --ink:          #18140F;
  --ink-80:       rgba(24,20,15,0.80);
  --ink-55:       rgba(24,20,15,0.55);
  --ink-35:       rgba(24,20,15,0.35);
  --ink-15:       rgba(24,20,15,0.15);
  --ink-07:       rgba(24,20,15,0.07);
  --ink-04:       rgba(24,20,15,0.04);

  --gold:         #B8965A;
  --gold-light:   #D4B07A;
  --gold-faint:   rgba(184,150,90,0.12);
  --gold-ring:    rgba(184,150,90,0.22);

  --sage:         #4F7863;
  --sage-bg:      rgba(79,120,99,0.09);
  --sage-border:  rgba(79,120,99,0.2);

  --clay:         #8B6340;
  --clay-bg:      rgba(139,99,64,0.08);
  --clay-border:  rgba(139,99,64,0.18);

  --slate:        #6B7B8D;
  --slate-bg:     rgba(107,123,141,0.08);
  --slate-border: rgba(107,123,141,0.18);

  --stone:        #87847E;
  --stone-bg:     rgba(135,132,126,0.10);
  --stone-border: rgba(135,132,126,0.20);

  /* Surfaces */
  --bg:      var(--parchment);
  --card:    var(--ivory);
  --card-2:  var(--ivory-2);

  /* Borders */
  --border:       var(--ink-07);
  --border-md:    var(--ink-15);

  /* Radius */
  --r-xs:   8px;
  --r-sm:   14px;
  --r-md:   20px;
  --r-lg:   28px;
  --r-xl:   36px;
  --r-pill: 999px;

  /* Shadows — layered for depth */
  --shadow-xs: 0 1px 2px rgba(24,20,15,0.04);
  --shadow-sm: 0 1px 4px rgba(24,20,15,0.05), 0 4px 12px rgba(24,20,15,0.05);
  --shadow-md: 0 2px 8px rgba(24,20,15,0.06), 0 12px 32px rgba(24,20,15,0.07);
  --shadow-lg: 0 4px 16px rgba(24,20,15,0.07), 0 24px 64px rgba(24,20,15,0.09);

  /* Easing */
  --spring:  cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --smooth:  cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 400;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── BACKGROUND TEXTURE ── */
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image:
    radial-gradient(ellipse 80% 60% at 20% 10%, rgba(184,150,90,0.05) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 85% 90%, rgba(79,120,99,0.04) 0%, transparent 60%);
  pointer-events: none; z-index: 0;
}

/* ── APP SHELL ── */
.app {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center;
  padding: 0 24px 120px;
}

/* ── TOPBAR ── */
.topbar {
  width: 100%; max-width: 520px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 36px 0 0;
  margin-bottom: 4px;
}
.logo {
  font-family: 'Playfair Display', serif;
  font-size: 17px; font-weight: 500;
  color: var(--ink); letter-spacing: 0.01em;
  user-select: none;
}
.logo em { font-style: italic; color: var(--gold); }
.topbar-right { display: flex; align-items: center; gap: 10px; }

/* ── SCREEN ── */
.screen {
  width: 100%; max-width: 520px;
  animation: screenIn 0.5s var(--ease-out) both;
}
@keyframes screenIn {
  from { opacity: 0; transform: translateY(20px) scale(0.99); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}

/* Staggered children */
.screen > * { animation: childIn 0.45s var(--ease-out) both; }
.screen > *:nth-child(1) { animation-delay: 0.04s; }
.screen > *:nth-child(2) { animation-delay: 0.08s; }
.screen > *:nth-child(3) { animation-delay: 0.12s; }
.screen > *:nth-child(4) { animation-delay: 0.16s; }
.screen > *:nth-child(5) { animation-delay: 0.20s; }
.screen > *:nth-child(6) { animation-delay: 0.24s; }
@keyframes childIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ── FLOW BADGE (topbar) ── */
.flow-badge {
  display: flex; align-items: center; gap: 8px;
  background: var(--card);
  border: 1px solid var(--border-md);
  border-radius: var(--r-pill);
  padding: 8px 16px 8px 12px;
  cursor: pointer;
  transition: background 0.2s var(--ease-out),
              box-shadow 0.2s var(--ease-out),
              transform 0.15s var(--ease-out);
  box-shadow: var(--shadow-xs);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.flow-badge:hover {
  background: var(--ivory-2);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.flow-badge:active { transform: scale(0.97); }
.flow-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--gold); flex-shrink: 0;
  animation: breatheDot 3.5s ease-in-out infinite;
}
@keyframes breatheDot {
  0%,100% { opacity: 1; transform: scale(1);    }
  50%      { opacity: 0.5; transform: scale(1.3); }
}
.flow-badge-label { font-size: 12px; font-weight: 500; color: var(--ink-55); letter-spacing: 0.02em; }
.flow-badge-val   { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--ink); }

/* ── ICON BUTTON ── */
.btn-icon {
  width: 42px; height: 42px; border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--border-md);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: var(--shadow-xs);
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.btn-icon:hover { background: var(--ivory-2); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.btn-icon:active { transform: scale(0.94); }

/* ── BACK BUTTON ── */
.back-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: none; border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 500;
  color: var(--ink-35); cursor: pointer; padding: 0;
  margin-bottom: 32px;
  transition: color 0.18s; letter-spacing: -0.01em;
  -webkit-tap-highlight-color: transparent;
}
.back-btn:hover { color: var(--ink-80); }
.back-arrow {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--card); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; line-height: 1;
  transition: background 0.18s, transform 0.2s var(--ease-out);
  box-shadow: var(--shadow-xs);
}
.back-btn:hover .back-arrow { background: var(--ivory-2); transform: translateX(-2px); }

/* ═══════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════ */
.home-hero {
  margin-top: 52px; margin-bottom: 52px;
  text-align: center;
}
.orb-wrap {
  width: 96px; height: 96px;
  margin: 0 auto 36px;
  position: relative;
}
.orb-ring {
  position: absolute; inset: -10px;
  border-radius: 50%;
  border: 1.5px solid var(--gold-ring);
  animation: orbRing 4.5s ease-in-out infinite;
}
.orb-ring-2 {
  position: absolute; inset: -20px;
  border-radius: 50%;
  border: 1px solid rgba(184,150,90,0.1);
  animation: orbRing 4.5s ease-in-out infinite 0.8s;
}
@keyframes orbRing {
  0%,100% { opacity: 1; transform: scale(1);    }
  50%      { opacity: 0; transform: scale(1.18); }
}
.orb {
  width: 96px; height: 96px; border-radius: 50%;
  background:
    radial-gradient(circle at 38% 34%,
      rgba(255,252,245,0.9) 0%,
      rgba(220,200,168,0.7) 35%,
      rgba(184,150,90,0.5)  70%,
      rgba(160,125,70,0.6)  100%);
  box-shadow:
    inset 0 2px 8px rgba(255,245,220,0.6),
    inset 0 -4px 12px rgba(140,100,40,0.2),
    0 8px 32px rgba(184,150,90,0.2),
    0 2px 8px rgba(184,150,90,0.15);
  animation: orbPulse 4.5s ease-in-out infinite;
}
@keyframes orbPulse {
  0%,100% { transform: scale(1);    }
  50%      { transform: scale(1.06); }
}
.home-eyebrow {
  font-size: 11px; letter-spacing: 0.13em; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 14px;
}
.home-hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(34px, 9vw, 48px);
  line-height: 1.1; letter-spacing: -0.02em;
  color: var(--ink); margin-bottom: 16px; font-weight: 400;
}
.home-hero h1 em { font-style: italic; color: var(--gold); }
.home-hero p {
  font-size: 16px; color: var(--ink-55);
  font-weight: 300; line-height: 1.7; max-width: 300px;
  margin: 0 auto;
}

/* ── PENDING TASKS ── */
.pending-tasks {
  background: var(--card);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  overflow: hidden; margin-bottom: 14px;
  box-shadow: var(--shadow-sm);
}
.pending-header {
  padding: 16px 22px 13px;
  font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-35); font-weight: 600;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px;
}
.pending-count-pill {
  background: var(--gold-faint);
  color: var(--gold);
  font-size: 10px; font-weight: 600;
  padding: 2px 8px; border-radius: var(--r-pill);
  letter-spacing: 0.02em;
}
.pending-item {
  padding: 16px 22px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border);
  cursor: pointer; transition: background 0.18s; min-height: 66px;
  -webkit-tap-highlight-color: transparent;
}
.pending-item:last-child { border-bottom: none; }
.pending-item:hover { background: var(--parchment-2); }
.pending-item-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.pending-indicator {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: var(--gold-faint);
  border: 1px solid var(--gold-ring);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; transition: transform 0.2s var(--ease-out);
}
.pending-item:hover .pending-indicator { transform: scale(1.06); }
.pending-name { font-size: 15px; color: var(--ink); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.01em; }
.pending-meta { font-size: 12px; color: var(--ink-35); margin-top: 2px; }
.resume-pill {
  font-size: 12px; padding: 6px 14px;
  background: var(--ink); color: var(--parchment);
  border-radius: var(--r-pill); font-weight: 500;
  transition: opacity 0.15s, transform 0.15s var(--ease-out);
  flex-shrink: 0; margin-left: 12px; letter-spacing: -0.01em;
  white-space: nowrap;
}
.pending-item:hover .resume-pill { opacity: 0.82; transform: scale(0.97); }

/* ═══════════════════════════════════════
   FLOW SCORE PANEL
═══════════════════════════════════════ */
.flow-panel {
  background: var(--card);
  border: 1px solid var(--border-md);
  border-radius: var(--r-lg);
  padding: 0;
  margin-bottom: 16px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  animation: panelReveal 0.4s var(--ease-out) both;
}
@keyframes panelReveal {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}
.flow-panel-top {
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, rgba(184,150,90,0.06) 0%, transparent 60%);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.flow-panel-title-block {}
.flow-panel-eyebrow {
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 4px;
}
.flow-panel-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px; letter-spacing: -0.02em;
  color: var(--ink); font-weight: 400;
}
.flow-panel-close {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--parchment-2); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: var(--ink-35); cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.15s var(--ease-out);
  -webkit-tap-highlight-color: transparent; flex-shrink: 0;
}
.flow-panel-close:hover { background: var(--parchment-3); color: var(--ink-80); transform: scale(1.08); }
.flow-ring-area {
  padding: 28px 24px 20px;
  display: flex; align-items: center; gap: 28px;
}
.flow-score-ring-wrap { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
.flow-score-ring-svg { position: absolute; top: 0; left: 0; transform: rotate(-90deg); }
.flow-score-ring-track { fill: none; stroke: var(--parchment-2); stroke-width: 6; }
.flow-score-ring-fill  {
  fill: none; stroke: var(--gold); stroke-width: 6; stroke-linecap: round;
  transition: stroke-dashoffset 1.2s var(--ease-out);
  filter: drop-shadow(0 0 4px rgba(184,150,90,0.3));
}
.flow-score-center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%); text-align: center;
}
.flow-score-number {
  font-family: 'Playfair Display', serif;
  font-size: 28px; letter-spacing: -0.04em;
  color: var(--ink); line-height: 1; display: block;
}
.flow-score-lbl {
  font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-35); font-weight: 600; margin-top: 3px;
}
.flow-score-info { flex: 1; }
.flow-score-tagline {
  font-family: 'Playfair Display', serif;
  font-size: 15px; font-style: italic;
  color: var(--ink-55); line-height: 1.5; margin-bottom: 14px;
}
.flow-stats-row { display: flex; gap: 8px; }
.flow-stat {
  flex: 1; text-align: center;
  background: var(--parchment);
  border-radius: var(--r-sm);
  padding: 10px 6px;
  border: 1px solid var(--border);
}
.flow-stat-val {
  font-family: 'Playfair Display', serif;
  font-size: 19px; letter-spacing: -0.03em;
  color: var(--ink); display: block;
}
.flow-stat-lbl { font-size: 10px; color: var(--ink-35); margin-top: 1px; font-weight: 500; }

/* ═══════════════════════════════════════
   BUTTONS
═══════════════════════════════════════ */
.btn-primary {
  width: 100%; padding: 19px 28px;
  background: var(--ink); color: var(--parchment);
  border: none; border-radius: var(--r-md);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 16px; font-weight: 600;
  cursor: pointer; letter-spacing: -0.01em;
  box-shadow: 0 1px 3px rgba(24,20,15,0.15), 0 4px 16px rgba(24,20,15,0.12);
  transition: opacity 0.18s, transform 0.15s var(--ease-out), box-shadow 0.18s;
  -webkit-tap-highlight-color: transparent;
}
.btn-primary:hover {
  opacity: 0.88;
  box-shadow: 0 2px 8px rgba(24,20,15,0.18), 0 8px 24px rgba(24,20,15,0.14);
  transform: translateY(-1px);
}
.btn-primary:active  { transform: scale(0.982); box-shadow: none; }
.btn-primary:disabled { opacity: 0.22; cursor: default; transform: none; box-shadow: none; }

.btn-secondary {
  width: 100%; padding: 17px 28px;
  background: var(--card);
  color: var(--ink-80);
  border: 1px solid var(--border-md);
  border-radius: var(--r-md);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 15px; font-weight: 500;
  cursor: pointer; letter-spacing: -0.01em;
  margin-top: 10px; box-shadow: var(--shadow-xs);
  transition: background 0.18s, box-shadow 0.18s, transform 0.15s var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.btn-secondary:hover {
  background: var(--ivory-2);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.btn-secondary:active { transform: scale(0.982); }

.btn-ghost-text {
  background: none; border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  color: var(--ink-35); cursor: pointer;
  padding: 10px 0; display: block; width: 100%; text-align: center;
  transition: color 0.15s; letter-spacing: -0.005em;
  -webkit-tap-highlight-color: transparent;
}
.btn-ghost-text:hover { color: var(--ink-55); }

/* ═══════════════════════════════════════
   CREATE FORM
═══════════════════════════════════════ */
.screen-eyebrow {
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 10px;
}
.screen-heading {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 7vw, 36px);
  letter-spacing: -0.025em; line-height: 1.12;
  color: var(--ink); margin-bottom: 36px; font-weight: 400;
}
.screen-heading em { font-style: italic; color: var(--gold); }

.form-card {
  background: var(--card);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  padding: 32px 28px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 14px;
}
.form-field { margin-bottom: 26px; }
.form-field:last-child { margin-bottom: 0; }
.field-label {
  font-size: 11px; letter-spacing: 0.09em; text-transform: uppercase;
  color: var(--ink-35); font-weight: 600; margin-bottom: 10px; display: block;
}
.field-input {
  width: 100%;
  background: var(--parchment);
  border: 1.5px solid var(--border-md);
  border-radius: var(--r-sm);
  padding: 15px 18px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 15px; color: var(--ink); outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  -webkit-appearance: none; appearance: none; line-height: 1;
}
.field-input:focus {
  border-color: var(--gold);
  background: var(--ivory);
  box-shadow: 0 0 0 4px var(--gold-faint);
}
.field-input::placeholder { color: var(--ink-35); }
textarea.field-input { resize: none; line-height: 1.6; min-height: 80px; padding-top: 14px; }

.time-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.time-chip {
  padding: 10px 18px; border-radius: var(--r-pill);
  border: 1.5px solid var(--border-md);
  background: var(--parchment);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; font-weight: 500; color: var(--ink-55);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.time-chip.active {
  background: var(--ink); color: var(--parchment);
  border-color: var(--ink);
  box-shadow: 0 2px 8px rgba(24,20,15,0.15);
  transform: translateY(-1px);
}
.time-chip:not(.active):hover {
  background: var(--parchment-2); color: var(--ink);
  transform: translateY(-1px);
}
.custom-time-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
.custom-time-input {
  width: 72px;
  background: var(--parchment); border: 1.5px solid var(--border-md);
  border-radius: var(--r-xs); padding: 10px 12px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 15px; font-weight: 500; color: var(--ink); outline: none; text-align: center;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none; appearance: none;
}
.custom-time-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-faint); }
.custom-time-label { font-size: 13px; color: var(--ink-35); font-weight: 400; }

.form-divider { height: 1px; background: var(--border); margin: 26px 0; }

/* ═══════════════════════════════════════
   FOCUS SCREEN
═══════════════════════════════════════ */
.focus-screen { padding-top: 20px; text-align: center; }
.focus-task-eyebrow {
  font-size: 10px; letter-spacing: 0.13em; text-transform: uppercase;
  color: var(--gold); font-weight: 600; margin-bottom: 8px;
}
.focus-task-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(21px, 5vw, 27px);
  color: var(--ink); letter-spacing: -0.02em;
  margin-bottom: 44px; line-height: 1.25;
  padding: 0 12px; font-weight: 400;
}

/* Timer ring */
.timer-ring-wrap {
  position: relative; width: 240px; height: 240px;
  margin: 0 auto 44px;
}
.timer-ring-bg-circle {
  position: absolute; inset: 12px; border-radius: 50%;
  background: var(--card);
  box-shadow: var(--shadow-md), inset 0 1px 4px rgba(24,20,15,0.04);
}
.timer-ring-svg {
  position: absolute; top: 0; left: 0;
  transform: rotate(-90deg); overflow: visible;
}
.timer-track { fill: none; stroke: var(--parchment-2); stroke-width: 5; }
.timer-progress {
  fill: none; stroke: var(--gold); stroke-width: 5; stroke-linecap: round;
  transition: stroke-dashoffset 1s linear, stroke 0.5s;
  filter: drop-shadow(0 0 6px rgba(184,150,90,0.35));
}
.timer-progress.overtime { stroke: var(--stone); filter: none; }
.timer-center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); text-align: center; width: 150px;
}
.timer-digits {
  font-family: 'Playfair Display', serif;
  font-size: 54px; letter-spacing: -0.05em;
  color: var(--ink); line-height: 1; font-weight: 400;
  display: block;
}
.timer-digits.paused {
  animation: timerPulse 2.4s ease-in-out infinite;
  color: var(--ink-55);
}
@keyframes timerPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
.timer-status-label {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-35); font-weight: 600; margin-top: 6px;
}

/* Overtime note */
.overtime-note {
  background: var(--stone-bg); border: 1px solid var(--stone-border);
  border-radius: var(--r-md); padding: 14px 20px;
  font-size: 14px; color: var(--stone); line-height: 1.6;
  margin-bottom: 24px; text-align: left;
}

/* Focus controls */
.focus-controls {
  display: flex; align-items: center; justify-content: center; gap: 20px;
  margin-bottom: 32px;
}
.ctrl-btn {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  cursor: pointer; background: none; border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-tap-highlight-color: transparent;
}
.ctrl-icon {
  width: 58px; height: 58px; border-radius: 18px;
  background: var(--card); border: 1px solid var(--border-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; box-shadow: var(--shadow-sm);
  transition: background 0.2s, transform 0.2s var(--ease-out),
              box-shadow 0.2s;
}
.ctrl-btn:hover .ctrl-icon {
  background: var(--ivory-2);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px) scale(1.04);
}
.ctrl-btn:active .ctrl-icon { transform: scale(0.93); box-shadow: none; }
.ctrl-btn.primary .ctrl-icon {
  background: var(--ink); border-color: var(--ink);
  color: var(--parchment); width: 68px; height: 68px; border-radius: 22px;
  box-shadow: 0 4px 16px rgba(24,20,15,0.2);
  font-size: 22px;
}
.ctrl-btn.primary:hover .ctrl-icon {
  background: #2c2520;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 20px rgba(24,20,15,0.25);
}
.ctrl-label {
  font-size: 11px; color: var(--ink-35);
  letter-spacing: 0.04em; font-weight: 600; text-transform: uppercase;
}

.complete-area { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.btn-complete {
  width: 100%; max-width: 300px; padding: 18px 28px;
  background: var(--sage-bg); color: var(--sage);
  border: 1.5px solid var(--sage-border);
  border-radius: var(--r-md);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 15px; font-weight: 600; cursor: pointer; letter-spacing: -0.01em;
  transition: background 0.18s, transform 0.15s var(--ease-out), box-shadow 0.18s;
  box-shadow: 0 1px 4px rgba(79,120,99,0.12);
  -webkit-tap-highlight-color: transparent;
}
.btn-complete:hover {
  background: rgba(79,120,99,0.13);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79,120,99,0.15);
}
.btn-complete:active { transform: scale(0.982); }

/* ═══════════════════════════════════════
   BREAK SHEET
═══════════════════════════════════════ */
.break-sheet {
  background: var(--card); border-radius: var(--r-lg);
  border: 1px solid var(--border-md);
  padding: 26px 24px 20px;
  box-shadow: var(--shadow-lg); margin-bottom: 18px;
  animation: sheetRise 0.35s var(--ease-out) both;
}
@keyframes sheetRise {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.break-sheet-label {
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-35); font-weight: 600; margin-bottom: 18px;
}
.break-options { display: flex; gap: 10px; margin-bottom: 14px; }
.break-opt {
  flex: 1; padding: 20px 14px; cursor: pointer;
  background: var(--parchment);
  border: 1.5px solid var(--border-md);
  border-radius: var(--r-md);
  font-family: 'Plus Jakarta Sans', sans-serif; text-align: center;
  transition: all 0.2s var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}
.break-opt:hover {
  background: var(--parchment-2);
  border-color: var(--border-md);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.break-opt:active { transform: scale(0.97); }
.break-opt-emoji { font-size: 28px; margin-bottom: 10px; display: block; }
.break-opt-name { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 2px; letter-spacing: -0.01em; }
.break-opt-time { font-size: 12px; color: var(--ink-35); font-weight: 400; }

/* ═══════════════════════════════════════
   ACTIVE BREAK SCREEN
═══════════════════════════════════════ */
.break-screen { text-align: center; padding-top: 40px; }
.break-emoji-wrap {
  margin-bottom: 28px; display: inline-block;
  animation: floatEmoji 4s ease-in-out infinite;
}
@keyframes floatEmoji {
  0%,100% { transform: translateY(0) rotate(-3deg);  }
  50%      { transform: translateY(-8px) rotate(3deg); }
}
.break-emoji { font-size: 56px; display: block; line-height: 1; }
.break-screen-title {
  font-family: 'Playfair Display', serif;
  font-size: 30px; letter-spacing: -0.025em;
  color: var(--ink); margin-bottom: 8px; font-weight: 400;
}
.break-screen-sub {
  font-size: 15px; color: var(--ink-55); font-weight: 300;
  margin-bottom: 40px; line-height: 1.65;
}

/* Break ring */
.break-ring-wrap {
  position: relative; width: 168px; height: 168px;
  margin: 0 auto 36px;
}
.break-ring-bg-circle {
  position: absolute; inset: 10px; border-radius: 50%;
  background: var(--card); box-shadow: var(--shadow-sm);
}
.break-ring-svg { position: absolute; top: 0; left: 0; transform: rotate(-90deg); }
.break-ring-track { fill: none; stroke: var(--parchment-2); stroke-width: 4; }
.break-ring-fill  {
  fill: none; stroke: var(--slate); stroke-width: 4; stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 0 4px rgba(107,123,141,0.3));
}
.break-ring-center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%); text-align: center;
}
.break-time-digits {
  font-family: 'Playfair Display', serif;
  font-size: 40px; letter-spacing: -0.05em;
  color: var(--ink); line-height: 1;
}
.break-time-label {
  font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-35); font-weight: 600; margin-top: 5px;
}

.extended-notice {
  background: var(--stone-bg);
  border: 1px solid var(--stone-border);
  border-radius: var(--r-md); padding: 16px 20px;
  margin-bottom: 20px; text-align: left;
  animation: noticeIn 0.4s var(--ease-out) both;
}
@keyframes noticeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.extended-notice-title {
  font-size: 13px; font-weight: 600; color: var(--stone);
  margin-bottom: 4px; letter-spacing: -0.01em;
}
.extended-notice-body {
  font-size: 13px; color: var(--stone); line-height: 1.55; font-weight: 300;
}

/* ═══════════════════════════════════════
   COMPLETION SCREEN
═══════════════════════════════════════ */
.completion-screen { text-align: center; padding-top: 52px; }
.completion-emblem {
  width: 80px; height: 80px; border-radius: 24px;
  margin: 0 auto 24px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 36px; font-weight: 400;
  animation: emblemIn 0.6s var(--spring) both;
}
.completion-emblem.done    { background: var(--sage-bg);  border: 1.5px solid var(--sage-border);  color: var(--sage);  }
.completion-emblem.longer  { background: var(--clay-bg);  border: 1.5px solid var(--clay-border);  color: var(--clay);  }
.completion-emblem.stopped { background: var(--stone-bg); border: 1.5px solid var(--stone-border); color: var(--stone); }
@keyframes emblemIn {
  from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
  to   { opacity: 1; transform: scale(1)   rotate(0deg);  }
}
.completion-tag {
  display: inline-block;
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  font-weight: 600; padding: 5px 14px; border-radius: var(--r-pill);
  margin-bottom: 20px;
  animation: tagIn 0.4s 0.1s var(--ease-out) both;
}
@keyframes tagIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.completion-tag.done    { background: var(--sage-bg);  color: var(--sage);  }
.completion-tag.longer  { background: var(--clay-bg);  color: var(--clay);  }
.completion-tag.stopped { background: var(--stone-bg); color: var(--stone); }
.completion-headline {
  font-family: 'Playfair Display', serif;
  font-size: clamp(24px, 6vw, 32px);
  letter-spacing: -0.025em; line-height: 1.2;
  color: var(--ink); margin-bottom: 10px; font-weight: 400;
  animation: headIn 0.45s 0.14s var(--ease-out) both;
}
@keyframes headIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.completion-sub {
  font-size: 15px; color: var(--ink-55); font-weight: 300;
  margin-bottom: 36px; line-height: 1.65;
  animation: headIn 0.45s 0.18s var(--ease-out) both;
}
.reward-reveal {
  background: linear-gradient(135deg, var(--clay-bg) 0%, rgba(184,150,90,0.06) 100%);
  border: 1px solid var(--clay-border);
  border-radius: var(--r-lg); padding: 22px 24px;
  margin-bottom: 16px;
  animation: headIn 0.45s 0.22s var(--ease-out) both;
}
.reward-eyebrow {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--clay); font-weight: 600; margin-bottom: 6px;
}
.reward-text {
  font-family: 'Playfair Display', serif;
  font-size: 22px; color: var(--clay); font-style: italic; font-weight: 400;
}
.score-row {
  background: var(--slate-bg); border: 1px solid var(--slate-border);
  border-radius: var(--r-md); padding: 14px 18px;
  display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
  text-align: left;
  animation: headIn 0.45s 0.26s var(--ease-out) both;
}
.score-badge {
  width: 40px; height: 40px; border-radius: 12px;
  background: var(--card); border: 1px solid var(--slate-border);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 14px;
  color: var(--slate); flex-shrink: 0; font-weight: 500;
}
.score-info { font-size: 13px; color: var(--slate); line-height: 1.5; }
.score-info strong { display: block; font-weight: 600; font-size: 12px; letter-spacing: 0.02em; margin-bottom: 2px; text-transform: uppercase; }
.stats-trio { display: flex; gap: 10px; margin-bottom: 24px; animation: headIn 0.45s 0.3s var(--ease-out) both; }
.stat-card {
  flex: 1; background: var(--card); border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 16px 10px; text-align: center;
  box-shadow: var(--shadow-xs);
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 22px; letter-spacing: -0.03em;
  color: var(--ink); display: block; margin-bottom: 3px;
}
.stat-desc { font-size: 11px; color: var(--ink-35); font-weight: 500; }

/* ═══════════════════════════════════════
   HISTORY SCREEN
═══════════════════════════════════════ */
.history-screen { padding-top: 8px; }
.history-summary {
  display: flex; gap: 10px; margin-bottom: 20px;
}
.hsumm-card {
  flex: 1; background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 16px 12px; text-align: center;
  box-shadow: var(--shadow-xs);
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s;
}
.hsumm-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.hsumm-val {
  font-family: 'Playfair Display', serif;
  font-size: 24px; letter-spacing: -0.03em;
  color: var(--ink); display: block; margin-bottom: 3px;
}
.hsumm-lbl { font-size: 11px; color: var(--ink-35); font-weight: 500; }

.history-list { display: flex; flex-direction: column; gap: 10px; }
.history-item {
  background: var(--card); border: 1px solid var(--border);
  border-radius: var(--r-lg); padding: 18px 22px;
  box-shadow: var(--shadow-xs);
  transition: box-shadow 0.2s, transform 0.2s var(--ease-out);
  animation: itemIn 0.4s var(--ease-out) both;
}
.history-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
@keyframes itemIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.history-item-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
.history-item-name {
  font-size: 15px; font-weight: 600; color: var(--ink);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  flex: 1; min-width: 0; letter-spacing: -0.01em;
}
.h-status {
  font-size: 10px; font-weight: 600; padding: 4px 12px;
  border-radius: var(--r-pill); white-space: nowrap; flex-shrink: 0;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.h-done    { background: var(--sage-bg);  color: var(--sage);  }
.h-longer  { background: var(--clay-bg);  color: var(--clay);  }
.h-stopped { background: var(--stone-bg); color: var(--stone); }
.history-item-meta {
  font-size: 12px; color: var(--ink-35);
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.meta-sep { opacity: 0.4; }
.break-tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 500;
  background: var(--stone-bg); color: var(--stone);
  padding: 3px 10px; border-radius: var(--r-pill);
  border: 1px solid var(--stone-border);
}

.history-empty {
  text-align: center; padding: 64px 0 20px;
  color: var(--ink-35); line-height: 1.7;
}
.history-empty-glyph {
  font-family: 'Playfair Display', serif;
  font-size: 40px; color: var(--ink-15);
  display: block; margin-bottom: 14px;
}
.history-empty-text {
  font-size: 15px; font-weight: 300; color: var(--ink-35);
}

/* ═══════════════════════════════════════
   FOOTER CREDIT
═══════════════════════════════════════ */
.footer-credit {
  width: 100%; max-width: 520px; text-align: center;
  padding-top: 48px; padding-bottom: 4px;
  font-size: 11.5px; color: var(--ink-35); font-weight: 400;
  letter-spacing: 0.04em; user-select: none;
  opacity: 0.7;
}
.footer-credit span {
  font-family: 'Playfair Display', serif;
  font-style: italic; color: var(--gold); opacity: 0.9;
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 380px) {
  .app { padding: 0 16px 100px; }
  .focus-controls { gap: 14px; }
  .ctrl-icon { width: 52px; height: 52px; border-radius: 16px; }
  .ctrl-btn.primary .ctrl-icon { width: 62px; height: 62px; }
  .break-options { flex-direction: column; }
  .form-card { padding: 24px 20px; }
}
@media (min-width: 640px) {
  .app { padding: 0 40px 120px; }
  .topbar { padding-top: 44px; }
}
@media (min-width: 1024px) {
  .app { padding: 0 60px 120px; }
}
`;

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const pad = n => String(Math.floor(n)).padStart(2, "0");
const fmt = s => `${pad(s / 60)}:${pad(s % 60)}`;
const fmtDuration = s => {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
};
const fmtDate = ts => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const PRESETS = [10, 25, 45];

const STATUS = {
  done:    { tag: "Completed",   hClass: "h-done",    tClass: "done",    emblem: "✦" },
  longer:  { tag: "Took longer", hClass: "h-longer",  tClass: "longer",  emblem: "◎" },
  stopped: { tag: "Paused",      hClass: "h-stopped", tClass: "stopped", emblem: "◇" },
};

function calcScore(history) {
  let score = 0, completed = 0, returned = 0;
  history.forEach(h => {
    if (h.status === "done")             { score += 3; completed++; }
    if (h.status === "longer")           { score += 2; completed++; }
    if (h.status === "stopped")          { score += 1; }
    if (h.breakBehavior === "returned")  { score += 1; returned++;  }
  });
  return { score, completed, returned };
}

const ENCOURAGEMENTS = [
  "Every session leaves something behind.",
  "Showing up is half the work.",
  "Gentle progress is still progress.",
  "Rest is part of the work.",
  "The act of beginning is already a win.",
  "You're allowed to go slowly.",
];

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const set = useCallback(v => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, set];
}

/* ─────────────────────────────────────────
   HISTORY ICON
───────────────────────────────────────── */
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7.5 4.5v3.25l2.25 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function GentleFocus() {
  const [screen,         setScreen]         = useState("home");
  const [showFlowPanel,  setShowFlowPanel]  = useState(false);
  const [task,           setTask]           = useState({ title: "", desc: "", mins: 25, reward: "" });
  const [customMins,     setCustomMins]     = useState("");
  const [activeTask,     setActiveTask]     = useState(null);
  const [timerState,     setTimerState]     = useState("idle");
  const [secondsLeft,    setSecondsLeft]    = useState(0);
  const [totalSeconds,   setTotalSeconds]   = useState(0);
  const [elapsed,        setElapsed]        = useState(0);
  const [showBreakSheet, setShowBreakSheet] = useState(false);
  const [breakType,      setBreakType]      = useState(null);
  const [breakSecsLeft,  setBreakSecsLeft]  = useState(0);
  const [breakTotalSecs, setBreakTotalSecs] = useState(0);
  const [breakExtended,  setBreakExtended]  = useState(false);
  const [breakBehavior,  setBreakBehavior]  = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [history,        setHistory]        = useLocalStorage("gf_history_v3", []);
  const timerRef = useRef(null);
  const breakRef = useRef(null);

  /* ── Focus timer ── */
  useEffect(() => {
    if (timerState === "running") {
      timerRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) { clearInterval(timerRef.current); setTimerState("overtime"); return 0; }
          return s - 1;
        });
        setElapsed(e => e + 1);
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerState]);

  /* ── Break timer ── */
  useEffect(() => {
    if (breakType && breakSecsLeft > 0) {
      breakRef.current = setInterval(() => {
        setBreakSecsLeft(s => {
          if (s <= 1) {
            clearInterval(breakRef.current);
            setBreakExtended(true);
            setBreakBehavior("extended");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else clearInterval(breakRef.current);
    return () => clearInterval(breakRef.current);
  }, [breakType, breakSecsLeft]);

  /* ── Derived ── */
  const pendingTasks = history.filter(h => h.status === "stopped");
  const { score, completed: completedCount, returned: returnedCount } = calcScore(history);
  const encouragement = ENCOURAGEMENTS[history.length % ENCOURAGEMENTS.length];
  const scoreDisplay = Math.min(score, 99);
  const scorePct = Math.min(scoreDisplay / 50, 1);
  const SR = 44, SC = 2 * Math.PI * SR;
  const scoreDash = SC * (1 - scorePct);

  const progress = totalSeconds > 0 ? Math.max(0, secondsLeft / totalSeconds) : 0;
  const R = 106, C = 2 * Math.PI * R;
  const timerDash = C * progress;

  const breakProgress = breakTotalSecs > 0 ? Math.max(0, breakSecsLeft / breakTotalSecs) : 0;
  const BR = 72, BC = 2 * Math.PI * BR;
  const breakDash = BC * breakProgress;

  /* ── Actions ── */
  const clearAll = () => { clearInterval(timerRef.current); clearInterval(breakRef.current); };

  function startTask() {
    const secs = task.mins * 60;
    const t = { ...task, id: Date.now(), startedAt: Date.now() };
    setActiveTask(t); setSecondsLeft(secs); setTotalSeconds(secs); setElapsed(0);
    setBreakBehavior(null); setBreakType(null); setBreakExtended(false); setShowBreakSheet(false);
    setTimerState("running"); setScreen("focus");
  }

  function resumeTask(h) {
    const secs = h.originalMins * 60;
    setActiveTask({ ...h }); setSecondsLeft(secs); setTotalSeconds(secs); setElapsed(0);
    setBreakBehavior(null); setBreakType(null); setBreakExtended(false); setShowBreakSheet(false);
    setTimerState("running"); setHistory(prev => prev.filter(x => x.id !== h.id)); setScreen("focus");
  }

  function openBreakSheet() { clearInterval(timerRef.current); setTimerState("paused"); setShowBreakSheet(true); }
  function startBreak(type) {
    const secs = type === "quick" ? 300 : 900;
    setShowBreakSheet(false); setBreakType(type);
    setBreakSecsLeft(secs); setBreakTotalSecs(secs); setBreakExtended(false);
  }
  function endBreak() {
    clearInterval(breakRef.current);
    if (breakBehavior !== "extended") setBreakBehavior("returned");
    setBreakType(null); setBreakExtended(false); setTimerState("running");
  }
  function finishTask(forced = false) {
    clearAll();
    const wasExtended = breakBehavior === "extended";
    let status;
    if (forced && secondsLeft > 0) status = "stopped";
    else if (wasExtended || timerState === "overtime" || elapsed > totalSeconds * 1.05) status = "longer";
    else status = "done";
    const record = { ...activeTask, id: activeTask?.id || Date.now(), status, elapsed, originalMins: activeTask?.mins, completedAt: Date.now(), breakBehavior: breakBehavior || null };
    setHistory(prev => [record, ...prev]); setCompletionData(record);
    setTimerState("idle"); setBreakType(null); setShowBreakSheet(false); setBreakExtended(false); setBreakBehavior(null);
    setScreen("completion");
  }
  function goHome() {
    clearAll(); setTimerState("idle"); setBreakType(null); setShowBreakSheet(false);
    setBreakExtended(false); setBreakBehavior(null);
    setTask({ title: "", desc: "", mins: 25, reward: "" }); setCustomMins(""); setShowFlowPanel(false); setScreen("home");
  }

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <>
      <style>{FONTS + css}</style>
      <div className="app">

        {/* ── TOP BAR ── */}
        <div className="topbar">
          <div className="logo">gentle<em>focus</em></div>
          <div className="topbar-right">
            {screen === "home" && (
              <>
                <button className="flow-badge" onClick={() => setShowFlowPanel(p => !p)} title="Your flow score">
                  <div className="flow-badge-dot" />
                  <span className="flow-badge-label">Flow</span>
                  <span className="flow-badge-val">{scoreDisplay}</span>
                </button>
                <button className="btn-icon" onClick={() => setScreen("history")} title="History">
                  <ClockIcon />
                </button>
              </>
            )}
            {screen !== "home" && screen !== "focus" && screen !== "completion" && (
              <button className="back-btn" onClick={goHome}>
                <span className="back-arrow">←</span>
                back
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════ HOME ══════════════════════ */}
        {screen === "home" && (
          <div className="screen">

            {/* Flow Score Panel */}
            {showFlowPanel && (
              <div className="flow-panel">
                <div className="flow-panel-top">
                  <div className="flow-panel-title-block">
                    <div className="flow-panel-eyebrow">Your momentum</div>
                    <div className="flow-panel-title">Flow score</div>
                  </div>
                  <button className="flow-panel-close" onClick={() => setShowFlowPanel(false)}>×</button>
                </div>
                <div className="flow-ring-area">
                  <div className="flow-score-ring-wrap">
                    <svg className="flow-score-ring-svg" width="100" height="100" viewBox="0 0 100 100">
                      <circle className="flow-score-ring-track" cx="50" cy="50" r={SR} />
                      <circle className="flow-score-ring-fill" cx="50" cy="50" r={SR}
                        strokeDasharray={SC} strokeDashoffset={scoreDash} />
                    </svg>
                    <div className="flow-score-center">
                      <span className="flow-score-number">{scoreDisplay}</span>
                      <span className="flow-score-lbl">pts</span>
                    </div>
                  </div>
                  <div className="flow-score-info">
                    <div className="flow-score-tagline">"{encouragement}"</div>
                    <div className="flow-stats-row">
                      {[
                        { v: completedCount, l: "done"      },
                        { v: returnedCount,  l: "returned"  },
                        { v: history.length, l: "sessions"  },
                      ].map(({ v, l }) => (
                        <div key={l} className="flow-stat">
                          <span className="flow-stat-val">{v}</span>
                          <span className="flow-stat-lbl">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hero */}
            <div className="home-hero">
              <div className="orb-wrap">
                <div className="orb-ring-2" />
                <div className="orb-ring" />
                <div className="orb" />
              </div>
              <div className="home-eyebrow">One thing at a time</div>
              <h1>Focus on what<br /><em>matters now</em></h1>
              <p>No pressure, no guilt. Just one gentle step forward.</p>
            </div>

            {/* Pending / resume */}
            {pendingTasks.length > 0 && (
              <div className="pending-tasks">
                <div className="pending-header">
                  Continue where you left off
                  <span className="pending-count-pill">{pendingTasks.length}</span>
                </div>
                {pendingTasks.slice(0, 3).map(h => (
                  <div key={h.id} className="pending-item" onClick={() => resumeTask(h)}>
                    <div className="pending-item-left">
                      <div className="pending-indicator">◎</div>
                      <div>
                        <div className="pending-name">{h.title}</div>
                        <div className="pending-meta">{h.originalMins} min · {fmtDuration(h.elapsed)} done</div>
                      </div>
                    </div>
                    <div className="resume-pill">Resume</div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-primary" onClick={() => setScreen("create")}>
              Begin a task
            </button>
            <button className="btn-secondary" onClick={() => setScreen("history")}>
              View history
            </button>

            <div className="footer-credit">Designed by <span>Snigdha Joshi</span></div>
          </div>
        )}

        {/* ══════════════════════ CREATE ══════════════════════ */}
        {screen === "create" && (
          <div className="screen">
            <button className="back-btn" onClick={goHome}>
              <span className="back-arrow">←</span> back
            </button>
            <div className="screen-eyebrow">Let's begin</div>
            <div className="screen-heading">What are you<br /><em>working on?</em></div>

            <div className="form-card">
              <div className="form-field">
                <label className="field-label">Task name</label>
                <input
                  className="field-input"
                  placeholder="Name your task…"
                  value={task.title}
                  onChange={e => setTask(t => ({ ...t, title: e.target.value }))}
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label className="field-label">Notes (optional)</label>
                <textarea
                  className="field-input"
                  placeholder="Any details that might help…"
                  value={task.desc}
                  onChange={e => setTask(t => ({ ...t, desc: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="form-field">
                <label className="field-label">How long?</label>
                <div className="time-chips">
                  {PRESETS.map(p => (
                    <button key={p}
                      className={`time-chip ${task.mins === p && !customMins ? "active" : ""}`}
                      onClick={() => { setTask(t => ({ ...t, mins: p })); setCustomMins(""); }}>
                      {p} min
                    </button>
                  ))}
                </div>
                <div className="custom-time-row">
                  <input
                    className="custom-time-input" type="number"
                    placeholder="—" min="1" max="180"
                    value={customMins}
                    onChange={e => {
                      setCustomMins(e.target.value);
                      const v = parseInt(e.target.value);
                      if (v > 0) setTask(t => ({ ...t, mins: v }));
                    }}
                  />
                  <span className="custom-time-label">min custom</span>
                </div>
              </div>

              <div className="form-divider" />

              <div className="form-field">
                <label className="field-label">Reward when done (optional)</label>
                <input
                  className="field-input"
                  placeholder="e.g. Eat chocolate 🍫"
                  value={task.reward}
                  onChange={e => setTask(t => ({ ...t, reward: e.target.value }))}
                />
              </div>
            </div>

            <button className="btn-primary" disabled={!task.title.trim()} onClick={startTask}>
              Start — {task.mins} min
            </button>

            <div className="footer-credit">Designed by <span>Snigdha Joshi</span></div>
          </div>
        )}

        {/* ══════════════════════ FOCUS (no break) ══════════════════════ */}
        {screen === "focus" && !breakType && (
          <div className="screen focus-screen">
            <div className="focus-task-eyebrow">In focus</div>
            <div className="focus-task-title">{activeTask?.title}</div>

            {/* Timer ring */}
            <div className="timer-ring-wrap">
              <div className="timer-ring-bg-circle" />
              <svg className="timer-ring-svg" width="240" height="240" viewBox="0 0 240 240">
                <circle className="timer-track" cx="120" cy="120" r={R} />
                <circle
                  className={`timer-progress${timerState === "overtime" ? " overtime" : ""}`}
                  cx="120" cy="120" r={R}
                  strokeDasharray={C}
                  strokeDashoffset={timerDash}
                />
              </svg>
              <div className="timer-center">
                <span className={`timer-digits${timerState === "paused" ? " paused" : ""}`}>
                  {timerState === "overtime" ? `+${fmt(elapsed - totalSeconds)}` : fmt(secondsLeft)}
                </span>
                <div className="timer-status-label">
                  {timerState === "paused" ? "paused" : timerState === "overtime" ? "still going" : "remaining"}
                </div>
              </div>
            </div>

            {timerState === "overtime" && (
              <div className="overtime-note">
                You've taken a bit more time than planned.<br />That's completely fine — keep going.
              </div>
            )}

            {/* Break options sheet */}
            {showBreakSheet && (
              <div className="break-sheet">
                <div className="break-sheet-label">Take a moment</div>
                <div className="break-options">
                  <button className="break-opt" onClick={() => startBreak("quick")}>
                    <span className="break-opt-emoji">🌿</span>
                    <div className="break-opt-name">Quick Reset</div>
                    <div className="break-opt-time">5 minutes</div>
                  </button>
                  <button className="break-opt" onClick={() => startBreak("deep")}>
                    <span className="break-opt-emoji">🌙</span>
                    <div className="break-opt-name">Deep Pause</div>
                    <div className="break-opt-time">15 minutes</div>
                  </button>
                </div>
                <button className="btn-ghost-text"
                  onClick={() => { setShowBreakSheet(false); setTimerState("running"); }}>
                  Continue without a break
                </button>
              </div>
            )}

            {!showBreakSheet && (
              <>
                <div className="focus-controls">
                  <button className="ctrl-btn" onClick={openBreakSheet}>
                    <div className="ctrl-icon">☁</div>
                    <span className="ctrl-label">Break</span>
                  </button>
                  <button className="ctrl-btn primary"
                    onClick={timerState === "running" ? () => setTimerState("paused") : () => setTimerState("running")}>
                    <div className="ctrl-icon">{timerState === "running" ? "⏸" : "▶"}</div>
                    <span className="ctrl-label">{timerState === "running" ? "Pause" : "Resume"}</span>
                  </button>
                  <button className="ctrl-btn" onClick={() => { setSecondsLeft(s => s + 600); setTotalSeconds(t => t + 600); }}>
                    <div className="ctrl-icon" style={{ fontSize: "13px", fontWeight: 600 }}>+10m</div>
                    <span className="ctrl-label">Extend</span>
                  </button>
                </div>
                <div className="complete-area">
                  <button className="btn-complete" onClick={() => finishTask(false)}>
                    Mark as complete
                  </button>
                  <button className="btn-ghost-text" onClick={() => finishTask(true)}>
                    Pause here for now
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════ BREAK ══════════════════════ */}
        {screen === "focus" && breakType && (
          <div className="screen break-screen">
            <div className="break-emoji-wrap">
              <span className="break-emoji">{breakType === "quick" ? "🌿" : "🌙"}</span>
            </div>
            <div className="break-screen-title">
              {breakType === "quick" ? "Quick reset" : "Deep pause"}
            </div>
            <p className="break-screen-sub">
              {breakType === "quick"
                ? "Step away. Breathe. Stretch a little."
                : "This time is entirely yours. Rest without guilt."}
            </p>

            <div className="break-ring-wrap">
              <div className="break-ring-bg-circle" />
              <svg className="break-ring-svg" width="168" height="168" viewBox="0 0 168 168">
                <circle className="break-ring-track" cx="84" cy="84" r={BR} />
                <circle className="break-ring-fill" cx="84" cy="84" r={BR}
                  strokeDasharray={BC} strokeDashoffset={breakDash} />
              </svg>
              <div className="break-ring-center">
                <div className="break-time-digits">{fmt(breakSecsLeft)}</div>
                <div className="break-time-label">{breakExtended ? "extended" : "remaining"}</div>
              </div>
            </div>

            {breakExtended && (
              <div className="extended-notice">
                <div className="extended-notice-title">Looks like you needed a little more time.</div>
                <div className="extended-notice-body">
                  That's completely okay. Your session is still here whenever you're ready.
                </div>
              </div>
            )}

            <button className="btn-primary" onClick={endBreak}>
              Continue when ready
            </button>
            <button className="btn-secondary" onClick={() => finishTask(true)}>
              Call it here — that still counts
            </button>
          </div>
        )}

        {/* ══════════════════════ COMPLETION ══════════════════════ */}
        {screen === "completion" && completionData && (() => {
          const s = STATUS[completionData.status];
          const pts = completionData.status === "done" ? 3 : completionData.status === "longer" ? 2 : 1;
          const bonus = completionData.breakBehavior === "returned" ? 1 : 0;
          const totalPts = pts + bonus;
          const msgs = {
            done:    ["You showed up and finished this.", "That matters more than the time."],
            longer:  ["You took your time — and that's okay.", "Progress doesn't have to be fast."],
            stopped: ["Paused here. You can return anytime.", "Even starting is something."],
          };
          const [headline, sub] = msgs[completionData.status];
          return (
            <div className="screen completion-screen">
              <div className={`completion-emblem ${s.tClass}`}>{s.emblem}</div>
              <span className={`completion-tag ${s.tClass}`}>{s.tag}</span>
              <div className="completion-headline">{headline}</div>
              <p className="completion-sub">{sub}</p>

              {completionData.reward && completionData.status === "done" && (
                <div className="reward-reveal">
                  <div className="reward-eyebrow">Your reward</div>
                  <div className="reward-text">{completionData.reward}</div>
                </div>
              )}

              <div className="score-row">
                <div className="score-badge">+{totalPts}</div>
                <div className="score-info">
                  <strong>Flow points earned</strong>
                  {bonus > 0
                    ? `+${pts} for this session · +${bonus} for returning from break`
                    : `+${pts} added to your flow score`}
                </div>
              </div>

              <div className="stats-trio">
                <div className="stat-card">
                  <span className="stat-num">{fmtDuration(completionData.elapsed)}</span>
                  <span className="stat-desc">Time spent</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">{completionData.originalMins}m</span>
                  <span className="stat-desc">Planned</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">{score + totalPts}</span>
                  <span className="stat-desc">Flow score</span>
                </div>
              </div>

              <button className="btn-primary" onClick={() => {
                setScreen("create"); setTask({ title: "", desc: "", mins: 25, reward: "" }); setCustomMins("");
              }}>
                Start another task
              </button>
              <button className="btn-secondary" onClick={goHome}>Back home</button>

              <div className="footer-credit">Designed by <span>Snigdha Joshi</span></div>
            </div>
          );
        })()}

        {/* ══════════════════════ HISTORY ══════════════════════ */}
        {screen === "history" && (
          <div className="screen history-screen">
            <div className="screen-eyebrow">Your journey</div>
            <div className="screen-heading" style={{ marginBottom: 28 }}>
              History
            </div>

            {history.length === 0 ? (
              <div className="history-empty">
                <span className="history-empty-glyph">○</span>
                <p className="history-empty-text">Nothing yet. Your sessions<br />will appear here.</p>
                <div className="footer-credit" style={{ marginTop: 48 }}>
                  Designed by <span>Snigdha Joshi</span>
                </div>
              </div>
            ) : (
              <>
                <div className="history-summary">
                  {[
                    { v: scoreDisplay,   l: "Flow score" },
                    { v: completedCount, l: "Completed"  },
                    { v: history.length, l: "Sessions"   },
                  ].map(({ v, l }) => (
                    <div key={l} className="hsumm-card">
                      <span className="hsumm-val">{v}</span>
                      <span className="hsumm-lbl">{l}</span>
                    </div>
                  ))}
                </div>

                <div className="history-list">
                  {history.map((h, i) => {
                    const s = STATUS[h.status];
                    return (
                      <div key={h.id} className="history-item" style={{ animationDelay: `${i * 0.04}s` }}>
                        <div className="history-item-head">
                          <div className="history-item-name">{h.title}</div>
                          <span className={`h-status ${s.hClass}`}>{s.tag}</span>
                        </div>
                        <div className="history-item-meta">
                          <span>{fmtDuration(h.elapsed)}</span>
                          <span className="meta-sep">·</span>
                          <span>{h.originalMins} min planned</span>
                          {h.completedAt && (
                            <><span className="meta-sep">·</span><span>{fmtDate(h.completedAt)}</span></>
                          )}
                          {h.breakBehavior === "extended" && (
                            <span className="break-tag">◽ Took a longer pause</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="btn-ghost-text" style={{ marginTop: 24, fontSize: 12 }}
                  onClick={() => { if (window.confirm("Clear all history?")) setHistory([]); }}>
                  Clear history
                </button>

                <div className="footer-credit">Designed by <span>Snigdha Joshi</span></div>
              </>
            )}
          </div>
        )}

      </div>
    </>
  );
}

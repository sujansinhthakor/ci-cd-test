"use client";

import { useEffect, useState } from "react";

const FULL_TEXT = "Code. Deploy. Dominate.";
const BOOT_LINES = [
  "BIOS v3.14.15 — Initializing...",
  "RAM check: 1,048,576K OK",
  "Loading NEXT.JS kernel v15.0.0...",
  "Mounting /app filesystem... [OK]",
  "Starting TypeScript daemon... [OK]",
  "Hot reload service: ACTIVE",
  "All systems nominal. Welcome.",
];

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [glitch, setGlitch] = useState(false);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooted(true), 600);
      }
    }, 260);
    return () => clearInterval(interval);
  }, []);

  // Typewriter
  useEffect(() => {
    if (!booted) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= FULL_TEXT.length) {
        setTyped(FULL_TEXT.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [booted]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Random glitch flicker
  useEffect(() => {
    if (!booted) return;
    const trigger = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    };
    const t = setInterval(trigger, 4000 + Math.random() * 3000);
    return () => clearInterval(t);
  }, [booted]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&family=Fira+Code:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #00ff41;
          --green-dim: #00b82e;
          --green-ghost: rgba(0,255,65,0.06);
          --amber: #ffa800;
          --black: #000300;
          --glow: 0 0 8px rgba(0,255,65,0.8), 0 0 20px rgba(0,255,65,0.4);
          --glow-sm: 0 0 4px rgba(0,255,65,0.6), 0 0 10px rgba(0,255,65,0.2);
          --glow-amber: 0 0 8px rgba(255,168,0,0.8);
        }

        html, body { background: #000; min-height: 100vh; }

        body {
          font-family: 'Share Tech Mono', monospace;
          color: var(--green);
          background: var(--black);
          overflow-x: hidden;
          cursor: crosshair;
        }

        .scanlines {
          position: fixed; inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px
          );
          pointer-events: none; z-index: 100;
        }

        .vignette {
          position: fixed; inset: 0;
          background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.85) 100%);
          pointer-events: none; z-index: 99;
        }

        @keyframes scandown {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
        .scan-bar {
          position: fixed; left: 0; right: 0; height: 3px;
          background: linear-gradient(transparent, rgba(0,255,65,0.06), transparent);
          animation: scandown 6s linear infinite;
          pointer-events: none; z-index: 101;
        }

        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.7; } 97% { opacity: 1; }
          98% { opacity: 0.4; } 99% { opacity: 0.9; }
        }

        .grid-bg {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none; z-index: 0;
        }

        @keyframes glitch-anim {
          0%   { clip-path: inset(20% 0 60% 0); transform: translateX(-4px); filter: hue-rotate(90deg); }
          25%  { clip-path: inset(60% 0 10% 0); transform: translateX(4px); }
          50%  { clip-path: inset(40% 0 40% 0); transform: translateX(-2px); filter: hue-rotate(0); }
          75%  { clip-path: inset(5% 0 80% 0); transform: translateX(2px); }
          100% { clip-path: inset(0); transform: none; }
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .boot-screen {
          position: fixed; inset: 0;
          background: var(--black);
          z-index: 200; padding: 48px;
          display: flex; flex-direction: column;
          justify-content: flex-start; gap: 6px;
          transition: opacity 0.5s, visibility 0.5s;
        }
        .boot-screen.hidden { opacity: 0; visibility: hidden; pointer-events: none; }

        .boot-line {
          font-family: 'Fira Code', monospace;
          font-size: 13px; font-weight: 300;
          color: var(--green-dim);
          animation: fadeIn 0.1s ease;
        }
        .boot-line .ok { color: var(--green); text-shadow: var(--glow-sm); }

        .boot-prompt { margin-top: 16px; font-size: 13px; color: var(--green); text-shadow: var(--glow-sm); }

        .page {
          position: relative; z-index: 2;
          min-height: 100vh;
          display: grid; grid-template-rows: auto 1fr auto;
          padding: 0 48px; max-width: 1400px; margin: 0 auto;
        }

        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 0;
          border-bottom: 1px solid rgba(0,255,65,0.15);
        }

        .logo {
          font-family: 'VT323', monospace; font-size: 28px;
          color: var(--green); text-shadow: var(--glow); letter-spacing: 0.05em;
        }

        .header-right { display: flex; align-items: center; gap: 32px; }

        .nav-link {
          font-family: 'Fira Code', monospace; font-size: 12px;
          color: var(--green-dim); text-decoration: none;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: color 0.15s, text-shadow 0.15s;
        }
        .nav-link::before { content: '> '; }
        .nav-link:hover { color: var(--green); text-shadow: var(--glow-sm); }

        .clock-display {
          font-family: 'VT323', monospace; font-size: 20px;
          color: var(--amber); text-shadow: var(--glow-amber); letter-spacing: 0.05em;
        }

        .hero {
          display: flex; flex-direction: column;
          justify-content: center; padding: 60px 0; position: relative;
        }

        .ascii-border {
          font-family: 'VT323', monospace; font-size: 16px;
          color: rgba(0,255,65,0.2); line-height: 1.2;
          margin-bottom: 40px; white-space: pre; letter-spacing: 0.05em;
        }

        .prompt-row {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Fira Code', monospace; font-size: 13px;
          color: var(--amber); text-shadow: var(--glow-amber);
          margin-bottom: 24px; letter-spacing: 0.05em;
        }
        .prompt-row .ps { color: var(--green-dim); }
        .prompt-row .dollar { color: var(--green); }
        .prompt-row .comment { color: rgba(0,255,65,0.3); margin-left: 8px; }

        .headline {
          font-family: 'VT323', monospace;
          font-size: clamp(64px, 9vw, 130px);
          line-height: 0.95; color: var(--green);
          text-shadow: var(--glow); letter-spacing: 0.02em;
          margin-bottom: 8px;
          min-height: clamp(130px, 18vw, 260px);
        }

        .type-cursor {
          display: inline-block; width: 0.55em; height: 0.85em;
          background: var(--green); box-shadow: var(--glow);
          vertical-align: bottom; margin-left: 3px;
        }

        .sub-row {
          display: grid; grid-template-columns: 1fr auto;
          gap: 60px; align-items: end; margin-top: 48px;
        }

        .body-panel {
          border: 1px solid rgba(0,255,65,0.15);
          padding: 28px; background: var(--green-ghost); position: relative;
        }
        .body-panel::before {
          content: '[ SYSTEM INFO ]';
          position: absolute; top: -10px; left: 16px;
          font-family: 'VT323', monospace; font-size: 14px;
          background: var(--black); padding: 0 8px;
          color: var(--green-dim); letter-spacing: 0.1em;
        }

        .info-row {
          display: flex; gap: 8px;
          font-family: 'Fira Code', monospace;
          font-size: 12px; font-weight: 300;
          color: rgba(0,255,65,0.5);
          margin-bottom: 10px; line-height: 1.7;
        }
        .info-row .label { color: var(--green-dim); min-width: 100px; flex-shrink: 0; }
        .info-row .val { color: rgba(0,255,65,0.7); }
        .info-row .hot { color: var(--amber); text-shadow: var(--glow-amber); }

        .desc {
          font-family: 'Fira Code', monospace;
          font-size: 13px; font-weight: 300;
          color: rgba(0,255,65,0.5); line-height: 1.9;
          margin-top: 18px; padding-top: 18px;
          border-top: 1px solid rgba(0,255,65,0.1);
        }
        .desc a { color: var(--amber); text-shadow: var(--glow-amber); text-decoration: none; }

        .cta-panel { display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; min-width: 220px; }

        .btn {
          font-family: 'VT323', monospace; font-size: 22px;
          letter-spacing: 0.08em; text-decoration: none;
          padding: 12px 24px; text-align: center;
          transition: all 0.15s; position: relative; display: block;
        }

        .btn-primary-crt {
          background: var(--green); color: var(--black);
          border: 2px solid var(--green);
          box-shadow: var(--glow), inset 0 0 20px rgba(0,255,65,0.2);
        }
        .btn-primary-crt:hover {
          background: transparent; color: var(--green);
          box-shadow: var(--glow), 0 0 40px rgba(0,255,65,0.3);
        }

        .btn-ghost-crt {
          background: transparent; color: var(--amber);
          border: 1px solid rgba(255,168,0,0.4);
          text-shadow: var(--glow-amber);
        }
        .btn-ghost-crt:hover {
          border-color: var(--amber);
          box-shadow: var(--glow-amber), 0 0 20px rgba(255,168,0,0.15);
          background: rgba(255,168,0,0.05);
        }

        .stats-strip {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; margin-top: 60px;
          background: rgba(0,255,65,0.1);
          border: 1px solid rgba(0,255,65,0.1);
        }

        .stat-cell {
          background: var(--black); padding: 20px;
          text-align: center; position: relative;
        }
        .stat-cell::before {
          content: '//'; font-family: 'Fira Code', monospace;
          font-size: 10px; color: rgba(0,255,65,0.2);
          position: absolute; top: 8px; left: 10px;
        }

        .stat-num {
          font-family: 'VT323', monospace; font-size: 42px;
          color: var(--green); text-shadow: var(--glow);
          line-height: 1; display: block;
        }
        .stat-label {
          font-family: 'Fira Code', monospace; font-size: 10px;
          color: rgba(0,255,65,0.35); text-transform: uppercase;
          letter-spacing: 0.2em; margin-top: 4px; display: block;
        }

        .footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0; border-top: 1px solid rgba(0,255,65,0.1);
        }
        .footer-text {
          font-family: 'Fira Code', monospace; font-size: 11px;
          color: rgba(0,255,65,0.25); letter-spacing: 0.1em;
        }
        .footer-text code { color: var(--amber); }
        .uptime { font-family: 'VT323', monospace; font-size: 18px; color: rgba(0,255,65,0.3); }
      `}</style>

      <div className="scanlines" />
      <div className="scan-bar" />
      <div className="vignette" />
      <div className="grid-bg" />

      {/* Boot screen */}
      <div className={`boot-screen${booted ? " hidden" : ""}`}>
        <div
          style={{
            fontFamily: "'VT323',monospace",
            fontSize: 22,
            color: "var(--green)",
            textShadow: "var(--glow)",
            marginBottom: 24,
          }}
        >
          ▓▓▓ NEXT.JS TERMINAL OS ▓▓▓
        </div>
        {bootLines.map((line, i) => {
          if (!line) return null;
          const hasOk = line.includes("[OK]");
          return (
            <div key={i} className="boot-line">
              <span style={{ color: "rgba(0,255,65,0.4)" }}>
                [{String(i).padStart(2, "0")}]{" "}
              </span>
              {hasOk ? (
                <>
                  {line.replace(" [OK]", "")} <span className="ok">[OK]</span>
                </>
              ) : (
                line
              )}
            </div>
          );
        })}
        {bootLines.length === BOOT_LINES.length && (
          <div className="boot-prompt">{">"} Ready_</div>
        )}
      </div>

      <div style={{ animation: "flicker 8s infinite" }}>
        <div
          className={`page${glitch ? " glitch-on" : ""}`}
          style={
            glitch ? { animation: "glitch-anim 0.12s steps(2) forwards" } : {}
          }
        >
          <header className="header">
            <div className="logo">NEXT://OS&gt;_</div>
            <div className="header-right">
              <a href="https://nextjs.org/docs" className="nav-link">
                Docs
              </a>
              <a href="https://nextjs.org/learn" className="nav-link">
                Learn
              </a>
              <a href="https://vercel.com" className="nav-link">
                Deploy
              </a>
              <ClockDisplay />
            </div>
          </header>

          <main className="hero">
            <div className="ascii-border">{`╔══════════════════════════════════════════════════════════╗\n║  NEXT.JS FRAMEWORK — PRODUCTION ENVIRONMENT LOADED      ║\n╚══════════════════════════════════════════════════════════╝`}</div>

            <div className="prompt-row">
              <span className="ps">~/app</span>
              <span className="dollar">$</span>
              <span>npx create-next-app@latest</span>
              <span className="comment">-- --typescript --tailwind --app</span>
            </div>

            <div className="headline">
              {typed}
              <span
                className="type-cursor"
                style={{ opacity: showCursor ? 1 : 0 }}
              />
            </div>

            <div className="sub-row">
              <div className="body-panel">
                {[
                  { label: "FRAMEWORK", val: "Next.js 15.0.0", hot: false },
                  {
                    label: "RUNTIME",
                    val: "Node 22 / Edge / WASM",
                    hot: false,
                  },
                  {
                    label: "RENDERER",
                    val: "RSC + Partial Hydration",
                    hot: false,
                  },
                  { label: "BUNDLER", val: "⚡ Turbopack", hot: true },
                  { label: "STATUS", val: "ONLINE ●", hot: true },
                ].map(({ label, val, hot }) => (
                  <div key={label} className="info-row">
                    <span className="label">{label}</span>
                    <span className={hot ? "hot" : "val"}>{val}</span>
                  </div>
                ))}
                <p className="desc">
                  The React framework trusted at scale. Zero-config,
                  production-ready. Edit <a href="#">app/page.tsx</a> to begin
                  your build.
                </p>
              </div>

              <div className="cta-panel">
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary-crt"
                >
                  DEPLOY NOW
                </a>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost-crt"
                >
                  DOCUMENTATION
                </a>
                <a
                  href="https://nextjs.org/learn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost-crt"
                >
                  LEARN CENTER
                </a>
              </div>
            </div>

            <div className="stats-strip">
              {[
                { num: "99", label: "Perf Score" },
                { num: "∞", label: "Scalability" },
                { num: "0ms", label: "TTFB Edge" },
                { num: "100%", label: "TypeSafe" },
              ].map((s) => (
                <div key={s.label} className="stat-cell">
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </main>

          <footer className="footer">
            <span className="footer-text">
              SESSION ACTIVE — edit <code>app/page.tsx</code> to modify this
              interface
            </span>
            <span className="uptime">
              UPTIME: <UptimeClock />
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}

function ClockDisplay() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="clock-display">{time}</span>;
}

function UptimeClock() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return <>{`${h}:${m}:${s}`}</>;
}

"use client";

import { useState, useEffect } from "react";
import { useCinematicModeStore } from "../../core/cinematic";
import { usePerformanceStore, type PerformanceProfile } from "../../core/performance";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const phase = useCinematicModeStore((state) => state.phase);
  const startReplay = useCinematicModeStore((state) => state.startReplay);
  const profile = usePerformanceStore((state) => state.profile);
  const override = usePerformanceStore((state) => state.override);
  const setOverride = usePerformanceStore((state) => state.setOverride);

  const [scrolled, setScrolled] = useState(false);
  const [showQuality, setShowQuality] = useState(false);

  const isReplayEnabled = phase === "complete";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleQualityChange = (value: PerformanceProfile) => {
    setOverride(value);
    setShowQuality(false);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-black/40 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#" className="text-lg font-bold tracking-[0.2em] text-white">
          AYENDA
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuality((s) => !s)}
              className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white md:block"
              aria-label="Performance quality settings"
            >
              Quality: {override ?? profile}
            </button>
            {showQuality && (
              <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-black/60 p-1 backdrop-blur-xl">
                {(["High", "Medium", "Low"] as PerformanceProfile[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleQualityChange(level)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      (override ?? profile) === level
                        ? "bg-white/10 text-ayenda-yellow"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={startReplay}
            disabled={!isReplayEnabled}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all ${
              isReplayEnabled
                ? "border border-ayenda-amber/40 bg-ayenda-amber/10 text-ayenda-amber hover:bg-ayenda-amber/20"
                : "cursor-not-allowed border border-white/5 bg-white/5 text-white/30"
            }`}
          >
            Replay Journey
          </button>

          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-ayenda-amber to-ayenda-yellow px-4 py-2 text-xs font-semibold text-black transition-all hover:shadow-[0_0_24px_rgba(255,159,67,0.35)]"
          >
            Start a Project
          </a>
        </div>
      </nav>
    </header>
  );
}

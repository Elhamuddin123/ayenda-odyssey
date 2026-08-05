"use client";

import { useEffect, useState } from "react";
import { EngineProvider } from "../core/engine";
import { CinematicOverlay, useCinematicModeStore } from "../core/cinematic";
import { AudioProvider } from "../core/audio";
import { Navbar, Hero } from "./sections";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      useCinematicModeStore.getState().setReducedMotion(event.matches);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reducedMotion;
}

function CinematicStateProvider({ children }: { readonly children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <AudioProvider reducedMotion={reducedMotion} />
      <CinematicOverlay reducedMotion={reducedMotion} />
      {children}
    </>
  );
}

function MainContent() {
  const isLocked = useCinematicModeStore((state) => state.isLocked);

  return (
    <main
      className={`relative z-10 transition-opacity duration-1000 ${
        isLocked ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"
      }`}
      aria-hidden={isLocked}
    >
      <Navbar />
      <Hero />
    </main>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
      <div className="fixed inset-0 z-0">
        <EngineProvider />
      </div>

      <CinematicStateProvider>
        <MainContent />
      </CinematicStateProvider>
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { useCinematicModeStore } from "./cinematicModeStore";

interface CinematicOverlayProps {
  readonly reducedMotion?: boolean;
}

export function CinematicOverlay({ reducedMotion = false }: CinematicOverlayProps) {
  const phase = useCinematicModeStore((state) => state.phase);
  const isLocked = useCinematicModeStore((state) => state.isLocked);
  const skip = useCinematicModeStore((state) => state.skip);

  const handleSkip = useCallback(() => {
    skip();
  }, [skip]);

  // ESC key skip.
  useEffect(() => {
    if (reducedMotion) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isLocked) {
        handleSkip();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSkip, isLocked, reducedMotion]);

  // Lock scroll while cinematic mode is active.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isLocked) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [isLocked]);

  if (reducedMotion || phase === "complete") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-end p-6 md:p-10"
      style={{ pointerEvents: "none" }}
    >
      <button
        type="button"
        onClick={handleSkip}
        className="pointer-events-auto rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Skip cinematic journey"
      >
        Skip
      </button>
    </div>
  );
}

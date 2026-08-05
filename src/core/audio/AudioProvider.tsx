"use client";

import { useEffect, useState } from "react";
import { useDirector } from "../director";
import { AudioManager } from "./AudioManager";

interface AudioProviderProps {
  readonly reducedMotion?: boolean;
}

export function AudioProvider({ reducedMotion = false }: AudioProviderProps) {
  const { musicMood, cinematicPhase } = useDirector();
  const [userMuted, setUserMuted] = useState(false);

  // Initialize audio context on first user interaction to satisfy browser autoplay policies.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initAudio = () => {
      AudioManager.init();
    };

    window.addEventListener("pointerdown", initAudio, { once: true });
    window.addEventListener("keydown", initAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", initAudio);
      window.removeEventListener("keydown", initAudio);
    };
  }, []);

  // React to mood changes.
  useEffect(() => {
    if (cinematicPhase === "complete" || userMuted || reducedMotion) {
      AudioManager.setMuted(true);
      return;
    }
    AudioManager.setMuted(false);
    AudioManager.setMood(musicMood, reducedMotion);
  }, [musicMood, cinematicPhase, userMuted, reducedMotion]);

  return null;
}

export { AudioManager };

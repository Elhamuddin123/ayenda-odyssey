"use client";

import { useEffect, useRef } from "react";
import { usePerformanceStore } from "../performance";
import { useTimelineStore } from "../timeline/timelineStore";
import { useCinematicModeStore } from "../cinematic";
import { useDirectorStore } from "./DirectorState";
import { computeAdaptiveDurations, SceneRegistry } from "./SceneRegistry";

export function DirectorOrchestrator() {
  const detectProfile = usePerformanceStore((state) => state.detectProfile);
  const durationScale = usePerformanceStore((state) => state.durationScale);

  const setRegistry = useDirectorStore((state) => state.setRegistry);
  const setByElapsedTime = useDirectorStore((state) => state.setByElapsedTime);
  const directorPhase = useDirectorStore((state) => state.cinematicPhase);
  const setDirectorPhase = useDirectorStore((state) => state.setCinematicPhase);
  const totalDuration = useDirectorStore((state) => state.totalDuration);

  const phase = useCinematicModeStore((state) => state.phase);
  const setCinematicPhase = useCinematicModeStore((state) => state.setPhase);
  const finishReplay = useCinematicModeStore((state) => state.finishReplay);

  const timelinePlay = useTimelineStore((state) => state.play);
  const timelinePause = useTimelineStore((state) => state.pause);
  const timelineReset = useTimelineStore((state) => state.reset);
  const timelineSeek = useTimelineStore((state) => state.seek);
  const timelineSetDuration = useTimelineStore((state) => state.setDuration);
  const timelineSetSpeed = useTimelineStore((state) => state.setPlaybackSpeed);
  const timelineSetDirection = useTimelineStore((state) => state.setDirection);
  const timelineDuration = useTimelineStore((state) => state.duration);

  const previousPhase = useRef(phase);
  const hasDetected = useRef(false);

  // Detect performance profile and compute adaptive registry once on mount.
  useEffect(() => {
    if (hasDetected.current) return;
    hasDetected.current = true;
    detectProfile();
  }, [detectProfile]);

  // Apply adaptive registry whenever profile changes.
  useEffect(() => {
    const adaptiveRegistry = computeAdaptiveDurations(durationScale);
    setRegistry(adaptiveRegistry);
  }, [durationScale, setRegistry]);

  // Sync timeline duration with director total duration.
  useEffect(() => {
    if (totalDuration > 0 && Math.abs(timelineDuration - totalDuration) > 0.001) {
      timelineSetDuration(totalDuration);
    }
  }, [totalDuration, timelineDuration, timelineSetDuration]);

  // Handle cinematic phase transitions.
  useEffect(() => {
    if (previousPhase.current === phase) return;
    previousPhase.current = phase;

    switch (phase) {
      case "intro":
        timelineReset();
        timelineSetDirection(1);
        timelineSetSpeed(1);
        timelineSeek(0);
        setDirectorPhase("intro");
        break;
      case "playing":
        timelineReset();
        timelineSetDirection(1);
        timelineSetSpeed(1);
        timelinePlay();
        setDirectorPhase("playing");
        break;
      case "reversing":
        timelineSetDirection(-1);
        timelineSetSpeed(1);
        timelinePlay();
        setDirectorPhase("reversing");
        break;
      case "replaying":
        timelineReset();
        timelineSetDirection(1);
        timelineSetSpeed(1);
        timelinePlay();
        setDirectorPhase("playing");
        break;
      case "complete":
        timelinePause();
        setDirectorPhase("complete");
        break;
    }
  }, [
    phase,
    timelinePlay,
    timelinePause,
    timelineReset,
    timelineSeek,
    timelineSetDirection,
    timelineSetSpeed,
    setDirectorPhase,
  ]);

  // Auto-start the intro sequence after profile detection completes.
  useEffect(() => {
    if (phase === "intro" && !usePerformanceStore.getState().isDetecting) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) {
        setCinematicPhase("complete");
      } else {
        setCinematicPhase("playing");
      }
    }
  }, [phase, setCinematicPhase]);

  // Drive director state from timeline every frame via a single rAF loop.
  useEffect(() => {
    let frameId = 0;
    let previousElapsed = -1;

    const loop = () => {
      const currentElapsed = useTimelineStore.getState().elapsedTime;
      if (currentElapsed !== previousElapsed) {
        previousElapsed = currentElapsed;
        setByElapsedTime(currentElapsed);
      }

      const currentPhase = useCinematicModeStore.getState().phase;
      const currentProgress = useTimelineStore.getState().progress;
      const currentDirection = useTimelineStore.getState().direction;
      const currentPlaying = useTimelineStore.getState().isPlaying;

      if (
        currentPhase === "playing" &&
        currentProgress >= 1 &&
        currentDirection === 1 &&
        currentPlaying
      ) {
        timelinePause();
        setCinematicPhase("complete");
        setDirectorPhase("complete");
      }

      if (
        currentPhase === "reversing" &&
        currentProgress <= 0 &&
        currentDirection === -1 &&
        currentPlaying
      ) {
        timelinePause();
        finishReplay();
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [
    finishReplay,
    setByElapsedTime,
    setCinematicPhase,
    setDirectorPhase,
    timelinePause,
  ]);

  // Keep director phase in sync with cinematic phase for external observers.
  useEffect(() => {
    const targetPhase =
      phase === "replaying" || phase === "reversing" ? "playing" : phase;
    if (directorPhase !== targetPhase) {
      setDirectorPhase(targetPhase);
    }
  }, [directorPhase, phase, setDirectorPhase]);

  return null;
}

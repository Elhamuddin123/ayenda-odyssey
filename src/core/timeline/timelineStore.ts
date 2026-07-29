import { create } from "zustand";
import type { TimelineStore } from "./timelineTypes";

const TIMELINE_DURATION_SECONDS = 60;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  initialized: false,
  elapsedTime: 0,
  deltaTime: 0,
  progress: 0,
  currentScene: "Intro",
  isPlaying: false,
  isPaused: false,
  playbackSpeed: 1,

  initialize: () => set({ initialized: true }),

  play: () => set({ isPlaying: true, isPaused: false }),

  pause: () => set({ isPaused: true }),

  resume: () => set({ isPlaying: true, isPaused: false }),

  reset: () =>
    set({
      elapsedTime: 0,
      deltaTime: 0,
      progress: 0,
      isPlaying: false,
      isPaused: false,
    }),

  seek: (progress) => {
    const normalized = clamp(progress, 0, 1);
    set({
      elapsedTime: normalized * TIMELINE_DURATION_SECONDS,
      deltaTime: 0,
      progress: normalized,
    });
  },

  setScene: (currentScene) => set({ currentScene }),

  setPlaybackSpeed: (playbackSpeed) =>
    set({ playbackSpeed: playbackSpeed > 0 ? playbackSpeed : 1 }),

  tick: (delta) => {
    const state = get();

    if (!state.isPlaying || state.isPaused) {
      set({ deltaTime: 0 });
      return;
    }

    const adjustedDelta = delta * state.playbackSpeed;
    const nextElapsedTime = state.elapsedTime + adjustedDelta;
    const nextProgress = clamp(nextElapsedTime / TIMELINE_DURATION_SECONDS, 0, 1);

    set({
      elapsedTime: nextElapsedTime,
      deltaTime: adjustedDelta,
      progress: nextProgress,
    });
  },
}));

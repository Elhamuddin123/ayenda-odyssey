import { create } from "zustand";
import type { TimelineScene } from "./timelineTypes";

export interface TimelineState {
  readonly initialized: boolean;
  readonly elapsedTime: number;
  readonly deltaTime: number;
  readonly progress: number;
  readonly currentScene: TimelineScene;
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
  readonly playbackSpeed: number;
  readonly duration: number;
  readonly direction: 1 | -1;
}

export interface TimelineActions {
  play: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  seek: (progress: number) => void;
  seekTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setScene: (scene: TimelineScene) => void;
  setPlaybackSpeed: (speed: number) => void;
  setDirection: (direction: 1 | -1) => void;
  tick: (delta: number) => void;
}

export interface TimelineStore extends TimelineState, TimelineActions {
  initialize: () => void;
}

const INITIAL_SCENE: TimelineScene = "Universe";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  initialized: false,
  elapsedTime: 0,
  deltaTime: 0,
  progress: 0,
  currentScene: INITIAL_SCENE,
  isPlaying: false,
  isPaused: false,
  playbackSpeed: 1,
  duration: 60,
  direction: 1,

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
      direction: 1,
    }),

  seek: (progress) => {
    const normalized = clamp(progress, 0, 1);
    const state = get();
    set({
      elapsedTime: normalized * state.duration,
      deltaTime: 0,
      progress: normalized,
    });
  },

  seekTime: (time) => {
    const state = get();
    const normalized = clamp(time / state.duration, 0, 1);
    set({
      elapsedTime: time,
      deltaTime: 0,
      progress: normalized,
    });
  },

  setDuration: (duration) => set({ duration: Math.max(1, duration) }),

  setScene: (currentScene) => set({ currentScene }),

  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

  setDirection: (direction) => set({ direction }),

  tick: (delta) => {
    const state = get();

    if (!state.isPlaying || state.isPaused) {
      if (state.deltaTime !== 0) {
        set({ deltaTime: 0 });
      }
      return;
    }

    const adjustedDelta = delta * state.playbackSpeed * state.direction;
    const nextElapsedTime = clamp(state.elapsedTime + adjustedDelta, 0, state.duration);
    const nextProgress = state.duration > 0 ? nextElapsedTime / state.duration : 0;
    const nextDelta = nextElapsedTime === state.elapsedTime ? 0 : adjustedDelta;

    if (
      state.elapsedTime !== nextElapsedTime ||
      state.deltaTime !== nextDelta ||
      state.progress !== nextProgress
    ) {
      set({
        elapsedTime: nextElapsedTime,
        deltaTime: nextDelta,
        progress: nextProgress,
      });
    }
  },
}));

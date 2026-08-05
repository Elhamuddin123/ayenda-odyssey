import { create } from "zustand";

export type CinematicPhase =
  "intro" | "playing" | "reversing" | "replaying" | "complete";

export interface CinematicModeState {
  readonly phase: CinematicPhase;
  readonly reducedMotion: boolean;
  readonly skipped: boolean;
  readonly isLocked: boolean;
  readonly setPhase: (phase: CinematicPhase) => void;
  readonly skip: () => void;
  readonly startReplay: () => void;
  readonly finishReplay: () => void;
  readonly completeIntro: () => void;
  readonly reset: () => void;
  readonly setReducedMotion: (value: boolean) => void;
}

function isCinematicLocked(phase: CinematicPhase): boolean {
  return (
    phase === "intro" ||
    phase === "playing" ||
    phase === "reversing" ||
    phase === "replaying"
  );
}

export const useCinematicModeStore = create<CinematicModeState>((set) => ({
  phase: "intro",
  reducedMotion: false,
  skipped: false,
  isLocked: true,

  setPhase: (phase) => set({ phase, isLocked: isCinematicLocked(phase) }),

  skip: () =>
    set({
      phase: "complete",
      skipped: true,
      isLocked: false,
    }),

  startReplay: () =>
    set({
      phase: "reversing",
      skipped: false,
      isLocked: true,
    }),

  finishReplay: () =>
    set({
      phase: "replaying",
      isLocked: true,
    }),

  completeIntro: () =>
    set((state) => ({
      phase: state.reducedMotion ? "complete" : "playing",
      isLocked: state.reducedMotion ? false : true,
    })),

  reset: () =>
    set({
      phase: "intro",
      reducedMotion: false,
      skipped: false,
      isLocked: true,
    }),

  setReducedMotion: (value) =>
    set((state) => ({
      reducedMotion: value,
      phase: state.phase === "intro" && value ? "complete" : state.phase,
      isLocked: state.phase === "intro" && value ? false : state.isLocked,
    })),
}));

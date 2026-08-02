import { create } from "zustand";
import type { DirectorIntentions } from "./directorTypes";
import { DefaultSceneKey, SceneRegistry } from "./SceneRegistry";

export interface DirectorState extends DirectorIntentions {
  setScene: (sceneKey: string) => void;
  setProgress: (progress: number) => void;
  setCameraMood: (m: DirectorIntentions["cameraMood"]) => void;
  setMusicMood: (m: DirectorIntentions["musicMood"]) => void;
  setVisualMood: (m: DirectorIntentions["visualMood"]) => void;
  setTransitionStyle: (t: DirectorIntentions["transitionStyle"]) => void;
}

const initialScene = SceneRegistry[0];

export const useDirectorStore = create<DirectorState>((set) => ({
  currentAct: 1,
  currentSceneKey: initialScene?.key ?? DefaultSceneKey,
  sceneDuration: initialScene?.duration ?? 5,
  sceneProgress: 0,
  cameraMood: initialScene?.cameraMood ?? "Idle",
  musicMood: initialScene?.musicMood ?? "Silence",
  visualMood: initialScene?.musicMood ? "Infinite" : "Dark",
  transitionStyle: initialScene?.transition ?? "Fade",

  setScene: (sceneKey: string) => {
    const scene = SceneRegistry.find((s) => s.key === sceneKey);
    if (!scene) return;
    set(() => ({
      currentSceneKey: scene.key,
      sceneDuration: scene.duration,
      sceneProgress: 0,
      cameraMood: scene.cameraMood,
      musicMood: scene.musicMood,
      visualMood: "Dark",
      transitionStyle: scene.transition,
    }));
  },

  setProgress: (progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));
    set(() => ({ sceneProgress: clamped }));
  },

  setCameraMood: (m) => set(() => ({ cameraMood: m })),
  setMusicMood: (m) => set(() => ({ musicMood: m })),
  setVisualMood: (m) => set(() => ({ visualMood: m })),
  setTransitionStyle: (t) => set(() => ({ transitionStyle: t })),
}));

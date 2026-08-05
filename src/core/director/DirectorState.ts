import { create } from "zustand";
import type {
  CameraMood,
  DirectorIntentions,
  MusicMood,
  SceneMeta,
  TransitionStyle,
  VisualMood,
} from "./directorTypes";
import {
  BASE_TOTAL_DURATION_SECONDS,
  computeAdaptiveDurations,
  DefaultSceneKey,
  getSceneByKey,
  getSceneIndex,
  SceneRegistry,
} from "./SceneRegistry";

export interface DirectorState extends DirectorIntentions {
  readonly registry: ReadonlyArray<SceneMeta>;
  readonly setScene: (sceneKey: string) => void;
  readonly setProgress: (progress: number) => void;
  readonly setByElapsedTime: (elapsedTime: number) => void;
  readonly setRegistry: (registry: ReadonlyArray<SceneMeta>) => void;
  readonly setCinematicPhase: (phase: DirectorIntentions["cinematicPhase"]) => void;
  readonly advance: () => void;
  readonly complete: () => void;
  readonly reset: () => void;
  readonly skipToEnd: () => void;
  readonly jumpToAct: (act: number) => void;
}

function getInitialState(
  registry: ReadonlyArray<SceneMeta>,
): DirectorIntentions & { registry: ReadonlyArray<SceneMeta> } {
  const firstScene = registry[0] ?? getSceneByKey(DefaultSceneKey) ?? SceneRegistry[0];
  if (!firstScene) {
    throw new Error("Scene registry is empty");
  }

  return {
    registry,
    currentAct: firstScene.act,
    currentSceneKey: firstScene.key,
    sceneDuration: firstScene.duration,
    sceneProgress: 0,
    cameraMood: firstScene.cameraMood,
    musicMood: firstScene.musicMood,
    visualMood: mapLightingToVisualMood(firstScene.lightingMood),
    transitionStyle: firstScene.transition,
    cinematicPhase: "intro",
    totalElapsedTime: 0,
    totalDuration: registry.reduce((sum, s) => sum + s.duration, 0),
    isClimax: firstScene.climax,
  };
}

function mapLightingToVisualMood(lightingMood: string): VisualMood {
  switch (lightingMood) {
    case "Dark":
      return "Dark";
    case "Infinite":
      return "Infinite";
    case "Mystery":
      return "Mystery";
    case "Hope":
      return "Hope";
    case "Awe":
      return "Awe";
    case "Arrival":
      return "Arrival";
    case "Ayenda":
      return "Ayenda";
    case "Website":
      return "Website";
    default:
      return "Discovery";
  }
}

function updateFromScene(
  scene: SceneMeta,
  elapsedTime: number,
  totalDuration: number,
): Partial<DirectorState> {
  return {
    currentAct: scene.act,
    currentSceneKey: scene.key,
    sceneDuration: scene.duration,
    cameraMood: scene.cameraMood,
    musicMood: scene.musicMood,
    visualMood: mapLightingToVisualMood(scene.lightingMood),
    transitionStyle: scene.transition,
    totalElapsedTime: elapsedTime,
    totalDuration: totalDuration,
    isClimax: scene.climax,
  };
}

export const useDirectorStore = create<DirectorState>((set, get) => {
  const initialRegistry = SceneRegistry;

  return {
    ...getInitialState(initialRegistry),

    setRegistry: (registry) => {
      set((state) => {
        const currentScene = getSceneByKey(state.currentSceneKey) ?? registry[0];
        const totalDuration = registry.reduce((sum, s) => sum + s.duration, 0);
        return {
          registry,
          totalDuration,
          ...(currentScene
            ? updateFromScene(currentScene, state.totalElapsedTime, totalDuration)
            : {}),
        };
      });
    },

    setScene: (sceneKey) => {
      const scene = getSceneByKey(sceneKey);
      if (!scene) return;
      const state = get();
      set(updateFromScene(scene, state.totalElapsedTime, state.totalDuration));
    },

    setProgress: (progress) => {
      const clamped = Math.max(0, Math.min(1, progress));
      set({ sceneProgress: clamped });
    },

    setByElapsedTime: (elapsedTime) => {
      const state = get();
      const registry = state.registry;
      const totalDuration = registry.reduce((sum, s) => sum + s.duration, 0);
      const clampedElapsed = Math.max(0, Math.min(totalDuration, elapsedTime));

      let accumulated = 0;
      let currentScene = registry[0];
      let sceneProgress = 0;

      for (const scene of registry) {
        if (
          accumulated + scene.duration >= clampedElapsed ||
          scene === registry[registry.length - 1]
        ) {
          currentScene = scene;
          sceneProgress =
            scene.duration > 0 ? (clampedElapsed - accumulated) / scene.duration : 0;
          break;
        }
        accumulated += scene.duration;
      }

      set({
        ...updateFromScene(currentScene, clampedElapsed, totalDuration),
        sceneProgress,
      });
    },

    setCinematicPhase: (phase) => set({ cinematicPhase: phase }),

    advance: () => {
      const state = get();
      const idx = getSceneIndex(state.currentSceneKey);
      const next = state.registry[idx + 1];
      if (next) {
        set(
          updateFromScene(
            next,
            state.totalElapsedTime + state.sceneDuration * (1 - state.sceneProgress),
            state.totalDuration,
          ),
        );
        set({ sceneProgress: 0 });
      } else {
        set({ cinematicPhase: "complete" });
      }
    },

    complete: () =>
      set({
        cinematicPhase: "complete",
        sceneProgress: 1,
        totalElapsedTime: get().totalDuration,
      }),

    reset: () => {
      const state = get();
      set({
        ...getInitialState(state.registry),
        cinematicPhase: "intro",
      });
    },

    skipToEnd: () => {
      const state = get();
      const lastScene = state.registry[state.registry.length - 1];
      if (!lastScene) return;
      set({
        ...updateFromScene(lastScene, state.totalDuration, state.totalDuration),
        sceneProgress: 1,
        cinematicPhase: "complete",
      });
    },

    jumpToAct: (act) => {
      const state = get();
      const scene = state.registry.find((s) => s.act === act);
      if (!scene) return;
      const elapsedTime = state.registry
        .slice(0, getSceneIndex(scene.key))
        .reduce((sum, s) => sum + s.duration, 0);
      set({
        ...updateFromScene(scene, elapsedTime, state.totalDuration),
        sceneProgress: 0,
      });
    },
  };
});

export { BASE_TOTAL_DURATION_SECONDS, computeAdaptiveDurations };

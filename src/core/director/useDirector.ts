import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDirectorStore } from "./DirectorState";
import type { DirectorIntentions } from "./directorTypes";

export function useDirector() {
  const select = useShallow((s: any) => ({
    currentAct: s.currentAct,
    currentSceneKey: s.currentSceneKey,
    sceneDuration: s.sceneDuration,
    sceneProgress: s.sceneProgress,
    cameraMood: s.cameraMood,
    musicMood: s.musicMood,
    visualMood: s.visualMood,
    transitionStyle: s.transitionStyle,
  }));

  const state = useDirectorStore(select);

  const actions = useDirectorStore((s) => ({
    setScene: s.setScene,
    setProgress: s.setProgress,
    setCameraMood: s.setCameraMood,
    setMusicMood: s.setMusicMood,
    setVisualMood: s.setVisualMood,
    setTransitionStyle: s.setTransitionStyle,
  }));

  return useMemo<DirectorIntentions & typeof actions>(() => ({ ...state, ...actions }), [state, actions]);
}

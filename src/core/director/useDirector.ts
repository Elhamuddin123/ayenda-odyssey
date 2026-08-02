import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDirectorStore } from "./DirectorState";
import type { DirectorIntentions } from "./directorTypes";

export function useDirector() {
  const selectState = useShallow((s: any) => ({
    currentAct: s.currentAct,
    currentSceneKey: s.currentSceneKey,
    sceneDuration: s.sceneDuration,
    sceneProgress: s.sceneProgress,
    cameraMood: s.cameraMood,
    musicMood: s.musicMood,
    visualMood: s.visualMood,
    transitionStyle: s.transitionStyle,
  }));

  const state = useDirectorStore(selectState);

  const setScene = useDirectorStore((s) => s.setScene);
  const setProgress = useDirectorStore((s) => s.setProgress);
  const setCameraMood = useDirectorStore((s) => s.setCameraMood);
  const setMusicMood = useDirectorStore((s) => s.setMusicMood);
  const setVisualMood = useDirectorStore((s) => s.setVisualMood);
  const setTransitionStyle = useDirectorStore((s) => s.setTransitionStyle);

  return useMemo(
    () => ({
      ...state,
      setScene,
      setProgress,
      setCameraMood,
      setMusicMood,
      setVisualMood,
      setTransitionStyle,
    }),
    [state, setScene, setProgress, setCameraMood, setMusicMood, setVisualMood, setTransitionStyle],
  );
}

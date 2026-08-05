import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDirectorStore, type DirectorState } from "./DirectorState";
import type { DirectorIntentions } from "./directorTypes";

type DirectorView = DirectorIntentions &
  Pick<
    DirectorState,
    | "registry"
    | "setScene"
    | "setProgress"
    | "setByElapsedTime"
    | "setCinematicPhase"
    | "advance"
    | "complete"
    | "reset"
    | "skipToEnd"
    | "jumpToAct"
  >;

export function useDirector(): DirectorView {
  const selectState = useShallow((s: DirectorState) => ({
    currentAct: s.currentAct,
    currentSceneKey: s.currentSceneKey,
    sceneDuration: s.sceneDuration,
    sceneProgress: s.sceneProgress,
    cameraMood: s.cameraMood,
    musicMood: s.musicMood,
    visualMood: s.visualMood,
    transitionStyle: s.transitionStyle,
    cinematicPhase: s.cinematicPhase,
    totalElapsedTime: s.totalElapsedTime,
    totalDuration: s.totalDuration,
    isClimax: s.isClimax,
    registry: s.registry,
  }));

  const selectActions = useShallow((s: DirectorState) => ({
    setScene: s.setScene,
    setProgress: s.setProgress,
    setByElapsedTime: s.setByElapsedTime,
    setCinematicPhase: s.setCinematicPhase,
    advance: s.advance,
    complete: s.complete,
    reset: s.reset,
    skipToEnd: s.skipToEnd,
    jumpToAct: s.jumpToAct,
  }));

  const state = useDirectorStore(selectState);
  const actions = useDirectorStore(selectActions);

  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}

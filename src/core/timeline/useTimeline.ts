import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTimelineStore } from "./timelineStore";
import type { TimelineStore } from "./timelineTypes";

export function useTimeline() {
  const selectState = useShallow((timeline: TimelineStore) => ({
    elapsedTime: timeline.elapsedTime,
    deltaTime: timeline.deltaTime,
    progress: timeline.progress,
    currentScene: timeline.currentScene,
    isPlaying: timeline.isPlaying,
    isPaused: timeline.isPaused,
    playbackSpeed: timeline.playbackSpeed,
    initialized: timeline.initialized,
  }));

  const selectActions = useShallow((timeline: TimelineStore) => ({
    play: timeline.play,
    pause: timeline.pause,
    resume: timeline.resume,
    reset: timeline.reset,
    seek: timeline.seek,
    setScene: timeline.setScene,
    setPlaybackSpeed: timeline.setPlaybackSpeed,
  }));

  const state = useTimelineStore(selectState);
  const actions = useTimelineStore(selectActions);

  return useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [actions, state],
  );
}

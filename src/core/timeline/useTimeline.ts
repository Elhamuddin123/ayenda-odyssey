import { useMemo } from "react";
import { useTimelineStore } from "./timelineStore";

export function useTimeline() {
  const state = useTimelineStore((timeline) => ({
    elapsedTime: timeline.elapsedTime,
    deltaTime: timeline.deltaTime,
    progress: timeline.progress,
    currentScene: timeline.currentScene,
    isPlaying: timeline.isPlaying,
    isPaused: timeline.isPaused,
    playbackSpeed: timeline.playbackSpeed,
    initialized: timeline.initialized,
  }));

  const actions = useTimelineStore((timeline) => ({
    play: timeline.play,
    pause: timeline.pause,
    resume: timeline.resume,
    reset: timeline.reset,
    seek: timeline.seek,
    setScene: timeline.setScene,
    setPlaybackSpeed: timeline.setPlaybackSpeed,
  }));

  return useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [actions, state],
  );
}

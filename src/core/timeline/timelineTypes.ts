import type { SceneKey } from "../scene/sceneRegistry";

export type TimelineScene = SceneKey;

export interface TimelineState {
  readonly initialized: boolean;
  readonly elapsedTime: number;
  readonly deltaTime: number;
  readonly progress: number;
  readonly currentScene: TimelineScene;
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
  readonly playbackSpeed: number;
}

export interface TimelineActions {
  play: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  seek: (progress: number) => void;
  setScene: (scene: TimelineScene) => void;
  setPlaybackSpeed: (speed: number) => void;
}

export interface TimelineStore extends TimelineState, TimelineActions {
  initialize: () => void;
  tick: (delta: number) => void;
}

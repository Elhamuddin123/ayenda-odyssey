export type CameraMood =
  | "Idle"
  | "Floating"
  | "Observing"
  | "Investigating"
  | "Approaching";

export type MusicMood = "Silence" | "Ambient" | "DeepSpace" | "Tension" | "Discovery";

export type VisualMood = "Dark" | "Infinite" | "Hope" | "Mystery" | "Discovery";

export type TransitionStyle = "Fade" | "SlowExposure" | "LightBloom" | "Silence" | "CrossDissolve";

export type Emotion = "Curiosity" | "Wonder" | "Mystery" | "Awe" | "Anticipation";

export interface DirectorIntentions {
  currentAct: number;
  currentSceneKey: string;
  sceneDuration: number; // seconds
  sceneProgress: number; // 0-1
  cameraMood: CameraMood;
  musicMood: MusicMood;
  visualMood: VisualMood;
  transitionStyle: TransitionStyle;
}

export interface SceneMeta {
  readonly key: string;
  readonly name: string;
  readonly purpose: string;
  readonly emotion: Emotion;
  readonly duration: number; // seconds
  readonly cameraMood: CameraMood;
  readonly visibleObjects: string[];
  readonly lightingMood: string;
  readonly musicMood: MusicMood;
  readonly transition: TransitionStyle;
  readonly narrationPlaceholder?: string;
}

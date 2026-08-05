export type CameraMood =
  | "Idle"
  | "Floating"
  | "Observing"
  | "Investigating"
  | "Approaching"
  | "Orbiting"
  | "Crossing"
  | "Retreating"
  | "Arriving";

export type MusicMood =
  "Silence" | "Ambient" | "DeepSpace" | "Tension" | "Discovery" | "Hope" | "Finale";

export type VisualMood =
  | "Dark"
  | "Infinite"
  | "Mystery"
  | "Hope"
  | "Discovery"
  | "Awe"
  | "Rebirth"
  | "Arrival"
  | "Ayenda"
  | "Website";

export type TransitionStyle =
  | "Fade"
  | "SlowExposure"
  | "LightBloom"
  | "Silence"
  | "CrossDissolve"
  | "HorizonDistort"
  | "AtmosphereBloom";

export type Emotion =
  | "Curiosity"
  | "Wonder"
  | "Silence"
  | "Mystery"
  | "Insignificance"
  | "Exploration"
  | "Discovery"
  | "Awe"
  | "Tension"
  | "Hope"
  | "Arrival"
  | "Trust"
  | "Inspiration";

export type CinematicPhase =
  "intro" | "playing" | "reversing" | "replaying" | "complete";

export interface DirectorIntentions {
  currentAct: number;
  currentSceneKey: string;
  sceneDuration: number;
  sceneProgress: number;
  cameraMood: CameraMood;
  musicMood: MusicMood;
  visualMood: VisualMood;
  transitionStyle: TransitionStyle;
  cinematicPhase: CinematicPhase;
  totalElapsedTime: number;
  totalDuration: number;
  isClimax: boolean;
}

export interface SceneMeta {
  readonly key: string;
  readonly act: number;
  readonly name: string;
  readonly purpose: string;
  readonly emotion: Emotion;
  readonly baseDuration: number;
  readonly duration: number;
  readonly cameraMood: CameraMood;
  readonly visibleObjects: string[];
  readonly lightingMood: string;
  readonly musicMood: MusicMood;
  readonly transition: TransitionStyle;
  readonly narrationPlaceholder?: string;
  readonly climax: boolean;
  readonly description: string;
}

export interface ActMeta {
  readonly act: number;
  readonly title: string;
  readonly emotion: Emotion;
  readonly scenes: ReadonlyArray<SceneMeta>;
  readonly duration: number;
}

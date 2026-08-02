import type { SceneMeta } from "./directorTypes";

// Act I – The Unknown
const ActI_Scene1: SceneMeta = {
  key: "act1_scene1",
  name: "Silence",
  purpose: "The visitor forgets the outside world.",
  emotion: "Curiosity",
  duration: 5,
  cameraMood: "Idle",
  visibleObjects: ["almost_nothing"],
  lightingMood: "Dark",
  musicMood: "Silence",
  transition: "Fade",
  narrationPlaceholder: "",
};

const ActI_Scene2: SceneMeta = {
  key: "act1_scene2",
  name: "The Universe Breathes",
  purpose: "The universe begins to reveal itself.",
  emotion: "Wonder",
  duration: 12,
  cameraMood: "Floating",
  visibleObjects: ["stars", "tiny_dust"],
  lightingMood: "Infinite",
  musicMood: "Ambient",
  transition: "SlowExposure",
};

const ActI_Scene3: SceneMeta = {
  key: "act1_scene3",
  name: "A Distant Signal",
  purpose: "A distant glow appears but is not yet understood.",
  emotion: "Mystery",
  duration: 15,
  cameraMood: "Observing",
  visibleObjects: ["nebula", "hero_stars"],
  lightingMood: "Mystery",
  musicMood: "DeepSpace",
  transition: "CrossDissolve",
};

const ActI_Scene4: SceneMeta = {
  key: "act1_scene4",
  name: "Discovery",
  purpose: "The distant object is slowly recognized as a Black Hole.",
  emotion: "Awe",
  duration: 20,
  cameraMood: "Investigating",
  visibleObjects: ["black_hole", "disk"],
  lightingMood: "Hope",
  musicMood: "Discovery",
  transition: "SlowExposure",
};

const ActI_Scene5: SceneMeta = {
  key: "act1_scene5",
  name: "Decision",
  purpose: "Prepare for the transition into Act II.",
  emotion: "Anticipation",
  duration: 10,
  cameraMood: "Observing",
  visibleObjects: ["black_hole", "stars"],
  lightingMood: "Mystery",
  musicMood: "Tension",
  transition: "CrossDissolve",
};

export const SceneRegistry: ReadonlyArray<SceneMeta> = [
  ActI_Scene1,
  ActI_Scene2,
  ActI_Scene3,
  ActI_Scene4,
  ActI_Scene5,
];

export const DefaultSceneKey = ActI_Scene1.key;

export function getSceneByKey(key: string): SceneMeta | undefined {
  return SceneRegistry.find((s) => s.key === key);
}

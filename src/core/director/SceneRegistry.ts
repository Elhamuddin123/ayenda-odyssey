import type { ActMeta, SceneMeta } from "./directorTypes";

const actIScene: SceneMeta = {
  key: "act1_unknown",
  act: 1,
  name: "The Unknown",
  purpose: "Disconnect the visitor from the outside world.",
  emotion: "Curiosity",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Idle",
  visibleObjects: ["almost_nothing"],
  lightingMood: "Dark",
  musicMood: "Silence",
  transition: "Fade",
  narrationPlaceholder: "",
  climax: false,
  description: "Complete darkness. No UI. Tiny stars begin to appear.",
};

const actIIScene: SceneMeta = {
  key: "act2_breathes",
  act: 2,
  name: "The Universe Breathes",
  purpose: "Reveal space as living and expansive.",
  emotion: "Wonder",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Floating",
  visibleObjects: ["stars", "tiny_dust", "nebula"],
  lightingMood: "Infinite",
  musicMood: "Ambient",
  transition: "SlowExposure",
  climax: false,
  description: "Deep space reveals itself. Camera moves forward like a spacecraft.",
};

const actIIIScene: SceneMeta = {
  key: "act3_signal",
  act: 3,
  name: "A Distant Signal",
  purpose: "A tiny anomaly appears far away.",
  emotion: "Mystery",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Observing",
  visibleObjects: ["nebula", "hero_stars", "distant_black_hole"],
  lightingMood: "Mystery",
  musicMood: "DeepSpace",
  transition: "CrossDissolve",
  climax: false,
  description: "A faint black hole becomes visible in the distance.",
};

const actIVScene: SceneMeta = {
  key: "act4_approach",
  act: 4,
  name: "Approach",
  purpose: "The camera slowly approaches the black hole.",
  emotion: "Exploration",
  baseDuration: 4,
  duration: 4,
  cameraMood: "Approaching",
  visibleObjects: ["black_hole", "disk", "stars", "dust"],
  lightingMood: "Mystery",
  musicMood: "Tension",
  transition: "SlowExposure",
  climax: false,
  description: "The black hole grows. Stars begin to bend and align.",
};

const actVScene: SceneMeta = {
  key: "act5_horizon",
  act: 5,
  name: "Event Horizon",
  purpose: "The black hole fills the screen. Time feels slower.",
  emotion: "Awe",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Orbiting",
  visibleObjects: ["black_hole", "disk", "lensing"],
  lightingMood: "Awe",
  musicMood: "Tension",
  transition: "HorizonDistort",
  climax: true,
  description: "The accretion disk becomes prominent. Light bends elegantly.",
};

const actVIScene: SceneMeta = {
  key: "act6_crossing",
  act: 6,
  name: "Crossing",
  purpose: "Cross the event horizon. Reality distorts.",
  emotion: "Tension",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Crossing",
  visibleObjects: ["black_hole", "event_horizon"],
  lightingMood: "Dark",
  musicMood: "Silence",
  transition: "Silence",
  climax: true,
  description: "Stars disappear. The universe fades to near darkness.",
};

const actVIIScene: SceneMeta = {
  key: "act7_rebirth",
  act: 7,
  name: "Rebirth",
  purpose: "A small blue light appears. Earth emerges.",
  emotion: "Hope",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Retreating",
  visibleObjects: ["earth"],
  lightingMood: "Hope",
  musicMood: "Hope",
  transition: "LightBloom",
  climax: true,
  description: "Earth slowly emerges from darkness. Hope replaces mystery.",
};

const actVIIIScene: SceneMeta = {
  key: "act8_arrival",
  act: 8,
  name: "Arrival",
  purpose: "Enter Earth's atmosphere. Warm light. Life.",
  emotion: "Arrival",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Arriving",
  visibleObjects: ["earth", "atmosphere"],
  lightingMood: "Arrival",
  musicMood: "Hope",
  transition: "AtmosphereBloom",
  climax: false,
  description: "Sunrise, clouds, warm light. Humanity is reached.",
};

const actIXScene: SceneMeta = {
  key: "act9_ayenda",
  act: 9,
  name: "AYENDA",
  purpose: "The company reveals itself through minimal transition.",
  emotion: "Trust",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Idle",
  visibleObjects: ["ayenda_identity"],
  lightingMood: "Ayenda",
  musicMood: "Finale",
  transition: "CrossDissolve",
  climax: true,
  description: "The Ayenda logo appears as if it has always been there.",
};

const actXScene: SceneMeta = {
  key: "act10_website",
  act: 10,
  name: "The Website Begins",
  purpose: "The visitor arrives at the future.",
  emotion: "Inspiration",
  baseDuration: 2,
  duration: 2,
  cameraMood: "Idle",
  visibleObjects: ["hero"],
  lightingMood: "Website",
  musicMood: "Finale",
  transition: "Fade",
  climax: false,
  description: "Hero section, services, and the journey complete.",
};

export const SceneRegistry: ReadonlyArray<SceneMeta> = [
  actIScene,
  actIIScene,
  actIIIScene,
  actIVScene,
  actVScene,
  actVIScene,
  actVIIScene,
  actVIIIScene,
  actIXScene,
  actXScene,
];

export const DefaultSceneKey = SceneRegistry[0].key;

export const ActRegistry: ReadonlyArray<ActMeta> = [
  {
    act: 1,
    title: "The Unknown",
    emotion: "Curiosity",
    scenes: [actIScene],
    duration: actIScene.duration,
  },
  {
    act: 2,
    title: "The Universe Breathes",
    emotion: "Wonder",
    scenes: [actIIScene],
    duration: actIIScene.duration,
  },
  {
    act: 3,
    title: "A Distant Signal",
    emotion: "Mystery",
    scenes: [actIIIScene],
    duration: actIIIScene.duration,
  },
  {
    act: 4,
    title: "Approach",
    emotion: "Exploration",
    scenes: [actIVScene],
    duration: actIVScene.duration,
  },
  {
    act: 5,
    title: "Event Horizon",
    emotion: "Awe",
    scenes: [actVScene],
    duration: actVScene.duration,
  },
  {
    act: 6,
    title: "Crossing",
    emotion: "Tension",
    scenes: [actVIScene],
    duration: actVIScene.duration,
  },
  {
    act: 7,
    title: "Rebirth",
    emotion: "Hope",
    scenes: [actVIIScene],
    duration: actVIIScene.duration,
  },
  {
    act: 8,
    title: "Arrival",
    emotion: "Arrival",
    scenes: [actVIIIScene],
    duration: actVIIIScene.duration,
  },
  {
    act: 9,
    title: "AYENDA",
    emotion: "Trust",
    scenes: [actIXScene],
    duration: actIXScene.duration,
  },
  {
    act: 10,
    title: "The Website Begins",
    emotion: "Inspiration",
    scenes: [actXScene],
    duration: actXScene.duration,
  },
];

export const BASE_TOTAL_DURATION_SECONDS = SceneRegistry.reduce(
  (sum, scene) => sum + scene.baseDuration,
  0,
);

export function getSceneByKey(key: string): SceneMeta | undefined {
  return SceneRegistry.find((s) => s.key === key);
}

export function getSceneIndex(sceneKey: string): number {
  return SceneRegistry.findIndex((s) => s.key === sceneKey);
}

export function getNextSceneKey(currentKey: string): string | undefined {
  const idx = getSceneIndex(currentKey);
  if (idx < 0) return SceneRegistry[0].key;
  return SceneRegistry[idx + 1]?.key;
}

export function getPreviousSceneKey(currentKey: string): string | undefined {
  const idx = getSceneIndex(currentKey);
  if (idx <= 0) return undefined;
  return SceneRegistry[idx - 1]?.key;
}

export function computeAdaptiveDurations(
  durationScale: number,
  maxTotalSeconds = 25,
  climaxBuffer = 0.15,
): ReadonlyArray<SceneMeta> {
  // Proportional compression across all acts.
  const compressed = SceneRegistry.map((scene) => ({
    ...scene,
    duration: scene.baseDuration * durationScale,
  }));

  const compressedTotal = compressed.reduce((sum, s) => sum + s.duration, 0);

  // If compression already keeps us under the ceiling, redistribute a small buffer
  // from non-climax scenes to climax scenes so emotional beats feel longer.
  if (compressedTotal <= maxTotalSeconds) {
    const climaxScenes = compressed.filter((s) => s.climax);
    const nonClimax = compressed.filter((s) => !s.climax);
    const desiredClimaxTotal = climaxScenes.reduce(
      (sum, s) => sum + s.duration * (1 + climaxBuffer),
      0,
    );
    const desiredNonClimaxTotal = compressedTotal - desiredClimaxTotal;

    if (desiredNonClimaxTotal > 0) {
      const nonClimaxFactor =
        desiredNonClimaxTotal / nonClimax.reduce((sum, s) => sum + s.duration, 0);
      return compressed.map((scene) => {
        if (scene.climax) {
          return { ...scene, duration: scene.duration * (1 + climaxBuffer) };
        }
        return { ...scene, duration: scene.duration * nonClimaxFactor };
      });
    }
  }

  // Rare fallback: if compressed total still exceeds the ceiling, trim non-climax
  // scenes proportionally and keep climax scenes at their compressed duration.
  const excess = compressedTotal - maxTotalSeconds;
  const nonClimax = compressed.filter((s) => !s.climax);
  const targetNonClimaxTotal =
    nonClimax.reduce((sum, s) => sum + s.duration, 0) - excess;
  const nonClimaxFactor =
    targetNonClimaxTotal / nonClimax.reduce((sum, s) => sum + s.duration, 0);

  return compressed.map((scene) => {
    if (scene.climax) return scene;
    return { ...scene, duration: scene.duration * nonClimaxFactor };
  });
}

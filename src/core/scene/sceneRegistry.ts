export type SceneKey = "Intro" | "Universe" | "SolarJourney" | "Earth" | "AyendaHQ";

export interface SceneDescriptor {
  readonly key: SceneKey;
  readonly label: string;
}

export const sceneRegistry: Readonly<Record<SceneKey, SceneDescriptor>> = {
  Intro: { key: "Intro", label: "Intro" },
  Universe: { key: "Universe", label: "Universe" },
  SolarJourney: { key: "SolarJourney", label: "Solar Journey" },
  Earth: { key: "Earth", label: "Earth" },
  AyendaHQ: { key: "AyendaHQ", label: "Ayenda HQ" },
};

export const defaultScene: SceneKey = "Intro";

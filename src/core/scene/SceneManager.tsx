"use client";

import { useEffect, type ComponentType } from "react";
import { useEngineContext } from "../engine/engineContext";
import { sceneRegistry, type SceneKey } from "./sceneRegistry";
import { UniverseScene } from "../../features/universe";

const sceneMap: Record<SceneKey, ComponentType> = {
  Intro: () => null,
  Universe: UniverseScene,
  SolarJourney: () => null,
  Earth: () => null,
  AyendaHQ: () => null,
};

export function SceneManager() {
  const engine = useEngineContext();
  const scene = sceneRegistry[engine.currentScene];
  const SceneComponent = sceneMap[scene.key];

  useEffect(() => {
    // Placeholder hook for future scene lifecycle logic.
    // The current registry is intentionally declarative only.
  }, [scene.key]);

  return <SceneComponent />;
}

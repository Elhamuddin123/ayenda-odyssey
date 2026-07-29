"use client";

import { useEffect } from "react";
import { useEngineContext } from "../engine/engineContext";
import { sceneRegistry } from "./sceneRegistry";

export function SceneManager() {
  const engine = useEngineContext();
  const scene = sceneRegistry[engine.currentScene];

  useEffect(() => {
    // Placeholder hook for future scene lifecycle logic.
    // The current registry is intentionally declarative only.
  }, [scene.key]);

  return null;
}

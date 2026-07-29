"use client";

import { useEffect, useMemo, useState } from "react";
import { EngineCanvas } from "../renderer";
import { EngineLighting } from "../lighting";
import { CameraRig } from "../camera";
import { SceneManager } from "../scene";
import type { SceneKey } from "../scene/sceneRegistry";
import { EngineContextProvider } from "./engineContext";
import { useLoadingStore } from "../loading";
import { TimelineProvider } from "../timeline";

export default function EngineProvider() {
  const setLoadingState = useLoadingStore((state) => state.setLoadingState);
  const [currentScene, setCurrentScene] = useState<SceneKey>("Universe");

  const engineContextValue = useMemo(
    () => ({
      id: "ayenda-odyssey-engine",
      currentScene,
      setActiveScene: setCurrentScene,
    }),
    [currentScene],
  );

  useEffect(() => {
    setLoadingState({
      isLoading: false,
      progress: 1,
      currentStage: "ready",
    });
  }, [setLoadingState]);

  return (
    <EngineContextProvider value={engineContextValue}>
      <TimelineProvider>
        <EngineCanvas>
          <color attach="background" args={["#000000"]} />
          <CameraRig />
          <EngineLighting />
          <SceneManager />
        </EngineCanvas>
      </TimelineProvider>
    </EngineContextProvider>
  );
}

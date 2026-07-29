"use client";

import { createContext, type PropsWithChildren, useContext } from "react";
import type { SceneKey } from "../scene/sceneRegistry";

export interface EngineService {
  readonly id: string;
  readonly currentScene: SceneKey;
  setActiveScene: (scene: SceneKey) => void;
}

const EngineContext = createContext<EngineService | null>(null);

interface EngineContextProviderProps extends PropsWithChildren {
  readonly value: EngineService;
}

export function EngineContextProvider({ children, value }: EngineContextProviderProps) {
  return <EngineContext.Provider value={value}>{children}</EngineContext.Provider>;
}

export function useEngineContext() {
  const context = useContext(EngineContext);

  if (!context) {
    throw new Error("useEngineContext must be used inside an EngineContextProvider");
  }

  return context;
}

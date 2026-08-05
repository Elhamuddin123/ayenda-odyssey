"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useDpr } from "../performance";

interface EngineCanvasProps {
  readonly children?: ReactNode;
}

export function EngineCanvas({ children }: EngineCanvasProps) {
  const dpr = useDpr();

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        (
          gl as unknown as { physicallyCorrectLights: boolean }
        ).physicallyCorrectLights = true;
      }}
      dpr={dpr}
      performance={{ min: 1, max: 2 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {children}
    </Canvas>
  );
}

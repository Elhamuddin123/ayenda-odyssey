"use client";

import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { PerspectiveCamera } from "three";

type EngineCameraProps = ComponentPropsWithoutRef<"perspectiveCamera"> & {
  makeDefault?: boolean;
};

export const EngineCamera = forwardRef<PerspectiveCamera, EngineCameraProps>(
  function EngineCamera(props, ref) {
    return (
      <perspectiveCamera
        ref={ref}
        makeDefault
        fov={60}
        near={0.1}
        far={1000}
        position={[0, 2, 6]}
        {...props}
      />
    );
  },
);

EngineCamera.displayName = "EngineCamera";

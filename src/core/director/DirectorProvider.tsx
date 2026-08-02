"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useDirectorStore } from "./DirectorState";
import { DefaultSceneKey } from "./SceneRegistry";

export function DirectorProvider({ children }: PropsWithChildren) {
  const setScene = useDirectorStore((s) => s.setScene);

  useEffect(() => {
    // Initialize to the first scene; do not start progressing automatically.
    setScene(DefaultSceneKey);
  }, [setScene]);

  return <>{children}</>;
}

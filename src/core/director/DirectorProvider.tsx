"use client";

import { type PropsWithChildren } from "react";
import { DirectorOrchestrator } from "./DirectorOrchestrator";

export function DirectorProvider({ children }: PropsWithChildren) {
  return (
    <>
      <DirectorOrchestrator />
      {children}
    </>
  );
}

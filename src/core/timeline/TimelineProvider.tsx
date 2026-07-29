"use client";

import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { TimelineManager } from "./TimelineManager";
import { useTimelineStore } from "./timelineStore";

interface TimelineContextValue {
  readonly initialized: boolean;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: PropsWithChildren) {
  const initialized = useTimelineStore((state) => state.initialized);
  const contextValue = useMemo(() => ({ initialized }), [initialized]);

  return (
    <TimelineContext.Provider value={contextValue}>
      <TimelineManager />
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimelineContext() {
  const context = useContext(TimelineContext);

  if (!context) {
    throw new Error("useTimelineContext must be used within a TimelineProvider");
  }

  return context;
}

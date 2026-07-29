"use client";

import { useEffect } from "react";
import { useTimelineStore } from "./timelineStore";

export function TimelineManager() {
  const initialize = useTimelineStore((state) => state.initialize);
  const tick = useTimelineStore((state) => state.tick);

  useEffect(() => {
    initialize();

    let previous = performance.now();
    let frameId = 0;

    const loop = () => {
      const now = performance.now();
      const delta = (now - previous) / 1000;
      previous = now;

      tick(delta);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [initialize, tick]);

  return null;
}

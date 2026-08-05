import { useMemo } from "react";
import { usePerformanceStore } from "./performanceStore";

export function useDpr() {
  const profileDpr = usePerformanceStore((state) => state.dpr);

  return useMemo(() => {
    const deviceRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    return Math.min(profileDpr, deviceRatio);
  }, [profileDpr]);
}

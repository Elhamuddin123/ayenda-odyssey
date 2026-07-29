import { useMemo } from "react";

export interface AdaptiveQualityState {
  readonly enabled: boolean;
  readonly targetDpr: number;
}

export function useAdaptiveQuality() {
  return useMemo<AdaptiveQualityState>(() => ({
    enabled: false,
    targetDpr: 1,
  }), []);
}

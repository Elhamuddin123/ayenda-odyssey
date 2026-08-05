import { usePerformanceStore, type PerformanceProfile } from "./performanceStore";

export interface AdaptiveQualityState {
  readonly enabled: boolean;
  readonly targetDpr: number;
  readonly profile: PerformanceProfile;
  readonly particleDensity: number;
  readonly shaderQuality: "High" | "Medium" | "Low";
  readonly durationScale: number;
}

export function useAdaptiveQuality(): AdaptiveQualityState {
  return usePerformanceStore((state) => ({
    enabled: true,
    targetDpr: state.dpr,
    profile: state.profile,
    particleDensity: state.particleDensity,
    shaderQuality: state.shaderQuality,
    durationScale: state.durationScale,
  }));
}

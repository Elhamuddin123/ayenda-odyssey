import { describe, expect, it } from "vitest";
import { usePerformanceStore } from "../../../../src/core/performance/performanceStore";

describe("usePerformanceStore", () => {
  it("starts in detecting state with a default medium profile", () => {
    const state = usePerformanceStore.getState();
    expect(state.isDetecting).toBe(true);
    expect(state.profile).toBe("Medium");
    expect(state.dpr).toBe(1.25);
  });

  it("applies high profile settings", () => {
    usePerformanceStore.getState().applyProfile("High");
    const state = usePerformanceStore.getState();
    expect(state.profile).toBe("High");
    expect(state.dpr).toBe(2);
    expect(state.durationScale).toBe(1);
    expect(state.particleDensity).toBe(1);
  });

  it("applies low profile settings", () => {
    usePerformanceStore.getState().applyProfile("Low");
    const state = usePerformanceStore.getState();
    expect(state.profile).toBe("Low");
    expect(state.dpr).toBe(1);
    expect(state.durationScale).toBe(0.55);
    expect(state.particleDensity).toBe(0.3);
  });
});

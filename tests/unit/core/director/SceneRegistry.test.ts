import { describe, expect, it } from "vitest";
import {
  BASE_TOTAL_DURATION_SECONDS,
  computeAdaptiveDurations,
  SceneRegistry,
} from "../../../../src/core/director/SceneRegistry";

describe("SceneRegistry", () => {
  it("has 10 acts with a 22 second base total duration", () => {
    expect(SceneRegistry).toHaveLength(10);
    expect(BASE_TOTAL_DURATION_SECONDS).toBe(22);
  });

  it("assigns unique keys to every scene", () => {
    const keys = SceneRegistry.map((scene) => scene.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("marks climax acts correctly", () => {
    const climaxActs = SceneRegistry.filter((scene) => scene.climax).map(
      (scene) => scene.act,
    );
    expect(climaxActs).toEqual([5, 6, 7, 9]);
  });
});

describe("computeAdaptiveDurations", () => {
  it("compresses all acts proportionally on low-end devices", () => {
    const compressed = computeAdaptiveDurations(0.5);
    const total = compressed.reduce((sum, scene) => sum + scene.duration, 0);
    expect(total).toBeCloseTo(11, 1);
  });

  it("does not exceed the 25 second ceiling", () => {
    const scaled = computeAdaptiveDurations(1.5, 25);
    const total = scaled.reduce((sum, scene) => sum + scene.duration, 0);
    expect(total).toBeLessThanOrEqual(25 + 0.01);
  });

  it("increases the total duration of climax acts relative to proportional compression", () => {
    const scale = 0.8;
    const proportionalTotal = BASE_TOTAL_DURATION_SECONDS * scale;
    const scaled = computeAdaptiveDurations(scale);
    const scaledTotal = scaled.reduce((sum, scene) => sum + scene.duration, 0);

    // Total duration is preserved when applying the climax buffer.
    expect(scaledTotal).toBeCloseTo(proportionalTotal, 1);

    const climaxSum = scaled
      .filter((scene) => scene.climax)
      .reduce((sum, scene) => sum + scene.duration, 0);
    const nonClimaxSum = scaled
      .filter((scene) => !scene.climax)
      .reduce((sum, scene) => sum + scene.duration, 0);

    // Climax acts receive more aggregate time than their proportional share.
    expect(climaxSum).toBeGreaterThan(
      SceneRegistry.filter((scene) => scene.climax).reduce(
        (sum, scene) => sum + scene.baseDuration * scale,
        0,
      ),
    );
    expect(nonClimaxSum).toBeLessThan(
      SceneRegistry.filter((scene) => !scene.climax).reduce(
        (sum, scene) => sum + scene.baseDuration * scale,
        0,
      ),
    );
  });
});

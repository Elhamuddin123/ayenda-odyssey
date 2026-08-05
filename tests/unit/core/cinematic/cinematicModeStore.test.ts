import { describe, expect, it } from "vitest";
import { useCinematicModeStore } from "../../../../src/core/cinematic/cinematicModeStore";

describe("useCinematicModeStore", () => {
  it("starts in the intro phase and is locked", () => {
    const state = useCinematicModeStore.getState();
    expect(state.phase).toBe("intro");
    expect(state.isLocked).toBe(true);
  });

  it("unlocks and marks skipped when skip is called", () => {
    useCinematicModeStore.getState().skip();
    const state = useCinematicModeStore.getState();
    expect(state.phase).toBe("complete");
    expect(state.skipped).toBe(true);
    expect(state.isLocked).toBe(false);
  });

  it("locks the experience when replay starts", () => {
    useCinematicModeStore.getState().startReplay();
    const state = useCinematicModeStore.getState();
    expect(state.phase).toBe("reversing");
    expect(state.isLocked).toBe(true);
  });

  it("moves from reversing to replaying", () => {
    useCinematicModeStore.getState().finishReplay();
    const state = useCinematicModeStore.getState();
    expect(state.phase).toBe("replaying");
    expect(state.isLocked).toBe(true);
  });
});

import { useMemo } from "react";
import { useDirector } from "../../core/director";

export interface CinematicMood {
  readonly starOpacity: number;
  readonly starSpeed: number;
  readonly dustOpacity: number;
  readonly dustSpeed: number;
  readonly nebulaOpacity: number;
  readonly blackHoleOpacity: number;
  readonly blackHoleScale: number;
  readonly diskOpacity: number;
  readonly diskGlow: number;
  readonly earthOpacity: number;
  readonly earthScale: number;
  readonly atmosphereOpacity: number;
  readonly ayendaOpacity: number;
  readonly backgroundGlow: number;
  readonly fogDensity: number;
}

export function useCinematicMood(): CinematicMood {
  const { currentAct, sceneProgress } = useDirector();

  return useMemo(() => {
    const act = currentAct;
    const t = sceneProgress;

    // Helpers for fade in/out over an act
    const fadeIn = (start = 0.0, end = 1.0) =>
      Math.max(0, Math.min(1, (t - start) / (end - start)));
    const fadeOut = (start = 0.0, end = 1.0) =>
      1 - Math.max(0, Math.min(1, (t - start) / (end - start)));

    switch (act) {
      case 1:
        return {
          starOpacity: 0.15 * fadeIn(0.2, 1.0),
          starSpeed: 0.2,
          dustOpacity: 0.0,
          dustSpeed: 0.2,
          nebulaOpacity: 0.0,
          blackHoleOpacity: 0.0,
          blackHoleScale: 0.2,
          diskOpacity: 0.0,
          diskGlow: 0.0,
          earthOpacity: 0.0,
          earthScale: 0.2,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.0,
          backgroundGlow: 0.0,
          fogDensity: 0.0,
        };
      case 2:
        return {
          starOpacity: 0.35 + 0.3 * fadeIn(0.0, 1.0),
          starSpeed: 1.0,
          dustOpacity: 0.25 * fadeIn(0.1, 0.8),
          dustSpeed: 1.0,
          nebulaOpacity: 0.25 * fadeIn(0.2, 1.0),
          blackHoleOpacity: 0.0,
          blackHoleScale: 0.3,
          diskOpacity: 0.0,
          diskGlow: 0.0,
          earthOpacity: 0.0,
          earthScale: 0.2,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.0,
          backgroundGlow: 0.1,
          fogDensity: 0.02,
        };
      case 3:
        return {
          starOpacity: 0.65,
          starSpeed: 1.0,
          dustOpacity: 0.45,
          dustSpeed: 1.0,
          nebulaOpacity: 0.5,
          blackHoleOpacity: 0.25 * fadeIn(0.2, 0.9),
          blackHoleScale: 0.35,
          diskOpacity: 0.15 * fadeIn(0.3, 1.0),
          diskGlow: 0.2,
          earthOpacity: 0.0,
          earthScale: 0.2,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.0,
          backgroundGlow: 0.18,
          fogDensity: 0.04,
        };
      case 4:
        return {
          starOpacity: 0.85 - 0.15 * fadeIn(0.5, 1.0),
          starSpeed: 1.0 + 0.5 * fadeIn(0.0, 1.0),
          dustOpacity: 0.55,
          dustSpeed: 1.0 + 0.8 * fadeIn(0.0, 1.0),
          nebulaOpacity: 0.45 - 0.15 * fadeIn(0.4, 1.0),
          blackHoleOpacity: 0.25 + 0.65 * fadeIn(0.0, 1.0),
          blackHoleScale: 0.35 + 0.45 * fadeIn(0.0, 1.0),
          diskOpacity: 0.15 + 0.55 * fadeIn(0.1, 0.9),
          diskGlow: 0.2 + 0.5 * fadeIn(0.1, 0.9),
          earthOpacity: 0.0,
          earthScale: 0.2,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.0,
          backgroundGlow: 0.25,
          fogDensity: 0.05,
        };
      case 5:
        return {
          starOpacity: 0.7 - 0.5 * fadeIn(0.3, 1.0),
          starSpeed: 1.5,
          dustOpacity: 0.5 - 0.2 * fadeIn(0.4, 1.0),
          dustSpeed: 1.8,
          nebulaOpacity: 0.35 - 0.2 * fadeIn(0.5, 1.0),
          blackHoleOpacity: 0.9 + 0.1 * fadeIn(0.0, 1.0),
          blackHoleScale: 0.8 + 0.15 * fadeIn(0.0, 1.0),
          diskOpacity: 0.7 + 0.2 * fadeIn(0.0, 1.0),
          diskGlow: 0.7 + 0.25 * fadeIn(0.0, 1.0),
          earthOpacity: 0.0,
          earthScale: 0.2,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.0,
          backgroundGlow: 0.35,
          fogDensity: 0.08,
        };
      case 6:
        return {
          starOpacity: 0.2 * fadeOut(0.0, 0.7),
          starSpeed: 2.0,
          dustOpacity: 0.3 * fadeOut(0.0, 0.8),
          dustSpeed: 2.0,
          nebulaOpacity: 0.15 * fadeOut(0.0, 0.7),
          blackHoleOpacity: 1.0 - 0.7 * fadeIn(0.4, 1.0),
          blackHoleScale: 0.95 + 0.05 * fadeIn(0.0, 1.0),
          diskOpacity: 0.9 * fadeOut(0.2, 1.0),
          diskGlow: 0.95 * fadeOut(0.2, 1.0),
          earthOpacity: 0.0,
          earthScale: 0.2,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.0,
          backgroundGlow: 0.1,
          fogDensity: 0.12,
        };
      case 7:
        return {
          starOpacity: 0.1,
          starSpeed: 0.6,
          dustOpacity: 0.1,
          dustSpeed: 0.6,
          nebulaOpacity: 0.1,
          blackHoleOpacity: 0.3 * fadeOut(0.0, 0.6),
          blackHoleScale: 0.8 * fadeOut(0.0, 0.6),
          diskOpacity: 0.2 * fadeOut(0.0, 0.6),
          diskGlow: 0.2 * fadeOut(0.0, 0.6),
          earthOpacity: 0.15 + 0.55 * fadeIn(0.2, 0.9),
          earthScale: 0.3 + 0.4 * fadeIn(0.2, 0.9),
          atmosphereOpacity: 0.1 + 0.4 * fadeIn(0.3, 1.0),
          ayendaOpacity: 0.0,
          backgroundGlow: 0.2,
          fogDensity: 0.04,
        };
      case 8:
        return {
          starOpacity: 0.35,
          starSpeed: 0.8,
          dustOpacity: 0.25,
          dustSpeed: 0.8,
          nebulaOpacity: 0.2,
          blackHoleOpacity: 0.0,
          blackHoleScale: 0.2,
          diskOpacity: 0.0,
          diskGlow: 0.0,
          earthOpacity: 0.7 + 0.25 * fadeIn(0.0, 1.0),
          earthScale: 0.7 + 0.25 * fadeIn(0.0, 1.0),
          atmosphereOpacity: 0.5 + 0.35 * fadeIn(0.0, 1.0),
          ayendaOpacity: 0.0,
          backgroundGlow: 0.45,
          fogDensity: 0.03,
        };
      case 9:
        return {
          starOpacity: 0.25 - 0.15 * fadeIn(0.3, 1.0),
          starSpeed: 0.5,
          dustOpacity: 0.15 - 0.1 * fadeIn(0.3, 1.0),
          dustSpeed: 0.5,
          nebulaOpacity: 0.12 - 0.08 * fadeIn(0.3, 1.0),
          blackHoleOpacity: 0.0,
          blackHoleScale: 0.15,
          diskOpacity: 0.0,
          diskGlow: 0.0,
          earthOpacity: 0.95 * fadeOut(0.0, 1.0),
          earthScale: 0.95 * fadeOut(0.0, 1.0),
          atmosphereOpacity: 0.85 * fadeOut(0.0, 1.0),
          ayendaOpacity: 0.2 + 0.8 * fadeIn(0.2, 0.9),
          backgroundGlow: 0.35,
          fogDensity: 0.02,
        };
      case 10:
        return {
          starOpacity: 0.1,
          starSpeed: 0.3,
          dustOpacity: 0.08,
          dustSpeed: 0.3,
          nebulaOpacity: 0.04,
          blackHoleOpacity: 0.0,
          blackHoleScale: 0.15,
          diskOpacity: 0.0,
          diskGlow: 0.0,
          earthOpacity: 0.0,
          earthScale: 0.15,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.6 - 0.5 * fadeIn(0.5, 1.0),
          backgroundGlow: 0.2,
          fogDensity: 0.01,
        };
      default:
        return {
          starOpacity: 0.1,
          starSpeed: 0.3,
          dustOpacity: 0.08,
          dustSpeed: 0.3,
          nebulaOpacity: 0.04,
          blackHoleOpacity: 0.0,
          blackHoleScale: 0.15,
          diskOpacity: 0.0,
          diskGlow: 0.0,
          earthOpacity: 0.0,
          earthScale: 0.15,
          atmosphereOpacity: 0.0,
          ayendaOpacity: 0.0,
          backgroundGlow: 0.2,
          fogDensity: 0.01,
        };
    }
  }, [currentAct, sceneProgress]);
}

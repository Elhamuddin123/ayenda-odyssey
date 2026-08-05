import { create } from "zustand";

export type PerformanceProfile = "High" | "Medium" | "Low";

export interface PerformanceState {
  readonly profile: PerformanceProfile;
  readonly override: PerformanceProfile | null;
  readonly detected: PerformanceProfile;
  readonly dpr: number;
  readonly durationScale: number;
  readonly particleDensity: number;
  readonly shaderQuality: "High" | "Medium" | "Low";
  readonly targetFps: number;
  readonly memoryClass: "high" | "medium" | "low";
  readonly gpuTier: "high" | "medium" | "low" | "unknown";
  readonly supportsWebGPU: boolean;
  readonly isDetecting: boolean;
  readonly setOverride: (profile: PerformanceProfile | null) => void;
  readonly detectProfile: () => void;
  readonly applyProfile: (profile: PerformanceProfile) => void;
}

function getWebGLRendererInfo(): {
  renderer: string;
  vendor: string;
  unmaskedRenderer: string;
  unmaskedVendor: string;
} {
  const canvas = document.createElement("canvas");
  const gl =
    (canvas.getContext("webgl2") as WebGLRenderingContext | null) ||
    (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

  if (!gl) {
    return {
      renderer: "unknown",
      vendor: "unknown",
      unmaskedRenderer: "unknown",
      unmaskedVendor: "unknown",
    };
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer =
    gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? 0) ?? "unknown";
  const vendor = gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL ?? 0) ?? "unknown";

  return {
    renderer: gl.getParameter(gl.RENDERER) ?? "unknown",
    vendor: gl.getParameter(gl.VENDOR) ?? "unknown",
    unmaskedRenderer: renderer,
    unmaskedVendor: vendor,
  };
}

function inferGpuTier(renderer: string): "high" | "medium" | "low" | "unknown" {
  const lower = renderer.toLowerCase();
  if (
    lower.includes("apple") ||
    lower.includes("m1") ||
    lower.includes("m2") ||
    lower.includes("m3")
  ) {
    return "high";
  }
  if (
    lower.includes("nvidia") ||
    lower.includes("rtx") ||
    lower.includes("gtx 16") ||
    lower.includes("gtx 10")
  ) {
    return "high";
  }
  if (
    lower.includes("amd") ||
    lower.includes("radeon") ||
    lower.includes("intel") ||
    lower.includes("iris")
  ) {
    return "medium";
  }
  if (
    lower.includes("swiftshader") ||
    lower.includes("llvmpipe") ||
    lower.includes("software")
  ) {
    return "low";
  }
  return "unknown";
}

function inferMemoryClass(): "high" | "medium" | "low" {
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (memory === undefined) return "medium";
  if (memory >= 8) return "high";
  if (memory >= 4) return "medium";
  return "low";
}

function computeProfile(): PerformanceProfile {
  if (typeof window === "undefined" || typeof navigator === "undefined")
    return "Medium";

  const info = getWebGLRendererInfo();
  const gpuTier = inferGpuTier(info.unmaskedRenderer);
  const memoryClass = inferMemoryClass();
  const supportsWebGPU = "gpu" in navigator;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent,
    );

  if (isMobile) {
    if (gpuTier === "high" && memoryClass === "high" && cores >= 6) return "Medium";
    return "Low";
  }

  if (gpuTier === "high" && memoryClass === "high" && cores >= 8 && supportsWebGPU)
    return "High";
  if (gpuTier === "low" || memoryClass === "low" || cores <= 4) return "Low";
  return "Medium";
}

function profileSettings(profile: PerformanceProfile) {
  switch (profile) {
    case "High":
      return {
        dpr: 2,
        durationScale: 1,
        particleDensity: 1,
        shaderQuality: "High" as const,
        targetFps: 60,
      };
    case "Medium":
      return {
        dpr: 1.25,
        durationScale: 0.8,
        particleDensity: 0.6,
        shaderQuality: "Medium" as const,
        targetFps: 60,
      };
    case "Low":
      return {
        dpr: 1,
        durationScale: 0.55,
        particleDensity: 0.3,
        shaderQuality: "Low" as const,
        targetFps: 30,
      };
  }
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  profile: "Medium",
  override: null,
  detected: "Medium",
  dpr: 1.25,
  durationScale: 0.8,
  particleDensity: 0.6,
  shaderQuality: "Medium",
  targetFps: 60,
  memoryClass: "medium",
  gpuTier: "unknown",
  supportsWebGPU: false,
  isDetecting: true,

  setOverride: (override) => {
    set((state) => {
      const profile = override ?? state.detected;
      return { override, ...profileSettings(profile), profile };
    });
  },

  detectProfile: () => {
    const detected = computeProfile();
    const info = getWebGLRendererInfo();
    const gpuTier = inferGpuTier(info.unmaskedRenderer);
    const memoryClass = inferMemoryClass();
    const supportsWebGPU = typeof navigator !== "undefined" && "gpu" in navigator;

    set((state) => {
      const profile = state.override ?? detected;
      return {
        detected,
        ...profileSettings(profile),
        profile,
        gpuTier,
        memoryClass,
        supportsWebGPU,
        isDetecting: false,
      };
    });
  },

  applyProfile: (profile) => {
    set(() => ({ profile, ...profileSettings(profile) }));
  },
}));

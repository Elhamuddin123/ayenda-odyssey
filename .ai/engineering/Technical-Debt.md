# AYENDA ODYSSEY TECHNICAL DEBT REGISTER

This document records architectural and engineering debt observed in the current workspace.

It does not prescribe a rewrite. It documents the current pain points and the smallest sensible next steps.

## Critical

| Description | Location | Risk | Suggested solution | Sprint recommendation |
|---|---|---|---|---|
| Scene ownership is split between a lightweight scene registry and the director’s canonical scene registry, which creates two competing models of “what scene exists.” | `src/core/scene/sceneRegistry.ts`, `src/core/scene/SceneManager.tsx`, `src/core/director/SceneRegistry.ts`, `src/core/director/DirectorState.ts`, `src/core/engine/EngineProvider.tsx` | Scene selection, naming, and future transitions can drift between systems and become inconsistent as more scenes are added. | Make one registry authoritative and reduce the other to a compatibility layer or remove it once the engine boundary is stable. | Sprint 1 |
| Three.js geometries, materials, and shader resources are created in feature components without a formal disposal policy. | `src/features/universe/Background.tsx`, `src/features/universe/earth/Earth.tsx`, `src/features/universe/blackhole/EventHorizon.tsx`, `src/features/universe/blackhole/AccretionDisk.tsx`, `src/features/universe/identity/AyendaIdentity.tsx`, `src/features/universe/stars/StarLayer.tsx`, `src/features/universe/dust/DustLayer.tsx`, `src/features/universe/nebula/NebulaLayer.tsx` | Long sessions can leak GPU memory, increase draw-side fragmentation, and eventually degrade performance or crash lower-memory devices. | Introduce a consistent resource lifecycle rule for geometry, material, and texture disposal. | Sprint 1 |

## High

| Description | Location | Risk | Suggested solution | Sprint recommendation |
|---|---|---|---|---|
| Cinematic phase state is represented in more than one store, which makes replay, skip, and lock behavior harder to reason about. | `src/core/cinematic/cinematicModeStore.ts`, `src/core/director/DirectorState.ts`, `src/core/director/DirectorOrchestrator.tsx`, `src/app/page.tsx`, `src/app/sections/Navbar.tsx` | A phase can be considered “complete,” “locked,” or “playing” by different parts of the app at slightly different times. That is a source of subtle state bugs. | Choose one canonical phase owner and make the other layers derive read-only state from it. | Sprint 1 |
| The scene manager still maps several valid scene keys to `null`, so navigation can reach dead scenes. | `src/core/scene/SceneManager.tsx` | Scene transitions can produce a blank canvas or incomplete experience when a mapped scene is reached. | Either implement the missing scene components or remove the keys from the active scene map until they are real. | Sprint 1 |
| The app route still mounts a legacy marketing shell alongside the engine shell. | `src/app/page.tsx`, `src/app/sections/Navbar.tsx`, `src/app/sections/Hero.tsx` | The runtime mixes cinematic engine behavior with ordinary website behavior, which weakens the product model and complicates future shell cleanup. | Separate the cinematic shell from any marketing shell and make the active route unambiguous. | Sprint 1-2 |
| The project includes installed packages that are not currently referenced by the workspace code, increasing maintenance and bundle risk. | `package.json` | Unused dependencies create noise during audits and may encourage accidental coupling before there is a real use case. | Keep only dependencies that are actively used or scheduled for immediate integration. | Sprint 2 |
| There is no formal asset-loading or caching layer yet, even though the engine architecture implies future textures, HDRIs, models, and audio assets. | `src/core/assets/index.ts`, `src/core/loading/loadingStore.ts`, `src/core/engine/EngineProvider.tsx` | Asset work will likely spread across components unless a loader/caching boundary is introduced early. | Add an asset manifest, loader boundary, and cache policy before more media types are added. | Sprint 2 |

## Medium

| Description | Location | Risk | Suggested solution | Sprint recommendation |
|---|---|---|---|---|
| The director registry is a large monolithic file that combines scene data, act metadata, duration math, and lookup helpers. | `src/core/director/SceneRegistry.ts` | The file is already hard to scan and will get harder to evolve as scene count increases. | Split pure data from duration policy and lookup helpers into smaller focused modules. | Sprint 2 |
| Camera motion logic is encoded in one large utility module that knows about act semantics and narrative anchors. | `src/core/camera/cameraUtils.ts`, `src/core/camera/CameraController.tsx` | Camera changes become harder to test and harder to reuse outside the current act structure. | Separate motion math from narrative mapping so the controller depends on smaller helpers. | Sprint 2 |
| The director store carries both state and orchestration responsibilities. | `src/core/director/DirectorState.ts`, `src/core/director/DirectorOrchestrator.tsx` | The store can become a policy sink, which makes future transitions and debugging more expensive. | Keep the store as state only and move orchestration policy into a dedicated service layer. | Sprint 2 |
| The current shader approach is feature-local and practical, but there is no shared convention for uniform naming, disposal, or shader utility reuse. | `src/features/universe/Background.tsx`, `src/features/universe/nebula/nebulaUtils.ts`, `src/features/universe/stars/starGenerator.ts`, `src/features/universe/blackhole/blackHoleShaders.ts`, `src/features/universe/earth/Earth.tsx`, `src/features/universe/identity/AyendaIdentity.tsx` | Shader maintenance will become harder as more materials are added and shared behavior starts to repeat. | Add shader conventions and extract shared helpers only when duplication is proven. | Sprint 2-3 |
| The performance system is useful but still spread across detection, canvas setup, visual density, and UI override surfaces. | `src/core/performance/performanceStore.ts`, `src/core/performance/useDpr.ts`, `src/features/universe/stars/Starfield.tsx`, `src/features/universe/dust/GalaxyDust.tsx`, `src/core/renderer/EngineCanvas.tsx`, `src/app/sections/Navbar.tsx` | Performance policy can become inconsistent if future systems read only part of the profile state. | Introduce a clearer budget model that centralizes how quality decisions are derived and applied. | Sprint 2-3 |
| Some helper modules are exported but not meaningfully used by the active runtime. | `src/core/performance/useFps.ts`, `src/core/performance/useViewport.ts`, `src/core/director/SceneTransition.ts`, `src/core/director/SceneDefinition.ts`, `src/core/director/DirectorTimeline.ts`, `src/core/assets/index.ts` | These exports increase surface area and make the architecture look more complete than it is. | Keep them only if they are on the immediate path to use; otherwise fold them into future work when needed. | Sprint 3 |

## Low

| Description | Location | Risk | Suggested solution | Sprint recommendation |
|---|---|---|---|---|
| The build emits a non-fatal module type warning for the Tailwind config. | `tailwind.config.ts`, `package.json` | The warning does not break the build, but it is noisy and can hide more important diagnostics later. | Make module typing explicit so the warning disappears. | Sprint 3 |
| A stray binary-like asset appears under the styles directory and is not part of the known visual pipeline. | `src/styles/jkjkk.png` | It adds confusion during maintenance and may represent accidental workspace clutter. | Re-home or remove it once its purpose is confirmed. | Sprint 3 |
| Some UI copy still reflects a normal marketing site rather than the cinematic engine direction. | `src/app/sections/Hero.tsx`, `src/app/sections/Navbar.tsx` | This is mostly product-direction debt rather than a runtime defect, but it can mislead future implementation work. | Align copy and shell behavior with the cinematic architecture when the shell is revisited. | Sprint 3-4 |

## Notes

- The current workspace is buildable and testable.
- Most debt is architectural rather than correctness-breaking.
- The largest engineering risk is not a single broken feature; it is the accumulation of overlapping ownership boundaries.
- The recommended sprint order reflects risk, not implementation convenience.


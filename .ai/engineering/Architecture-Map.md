# AYENDA ODYSSEY ARCHITECTURE MAP

This document maps the current workspace as it exists today.

It is descriptive, not aspirational. It shows how the code is wired now, where ownership is duplicated, and where the architecture is likely to need refinement as the experience grows.

## 1. Folder Hierarchy

```text
D:\Ayenda-odyssey
├─ src
│  ├─ app
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ globals.css
│  │  └─ sections
│  ├─ core
│  │  ├─ assets
│  │  ├─ audio
│  │  ├─ camera
│  │  ├─ cinematic
│  │  ├─ director
│  │  ├─ engine
│  │  ├─ lighting
│  │  ├─ loading
│  │  ├─ performance
│  │  ├─ renderer
│  │  ├─ scene
│  │  └─ timeline
│  ├─ features
│  │  └─ universe
│  │     ├─ blackhole
│  │     ├─ dust
│  │     ├─ earth
│  │     ├─ identity
│  │     ├─ nebula
│  │     └─ stars
│  └─ styles
├─ tests
│  └─ unit
│     └─ core
├─ docs
└─ root config files
```

### Workspace layers

- `src/app` is the Next.js shell and route entry.
- `src/core` is the orchestration and service layer.
- `src/features/universe` is the current 3D content layer.
- `tests` cover store and registry behavior.
- `docs` contains the written project doctrine and planning material.

## 2. Module Relationships

### Application entry chain

```text
layout.tsx
  └─ globals.css

page.tsx
  ├─ EngineProvider
  │  ├─ EngineContextProvider
  │  ├─ DirectorProvider
  │  │  └─ DirectorOrchestrator
  │  ├─ TimelineProvider
  │  │  └─ TimelineManager
  │  └─ EngineCanvas
  │     ├─ CameraRig
  │     │  ├─ EngineCamera
  │     │  └─ CameraController
  │     ├─ EngineLighting
  │     └─ SceneManager
  ├─ AudioProvider
  ├─ CinematicOverlay
  └─ legacy shell
     ├─ Navbar
     └─ Hero
```

### Core-to-feature relationships

- `SceneManager` selects `UniverseScene`.
- `UniverseScene` composes the universe feature modules.
- `useCinematicMood` reads director state and translates it into per-scene visual values.
- `CameraController` reads director state and computes the camera journey.
- `AudioProvider` reads director state and maps music mood to audio behavior.
- `Navbar` reads cinematic and performance state.

### Store relationships

```text
usePerformanceStore
  ├─ EngineCanvas
  ├─ Starfield
  ├─ DirectorOrchestrator
  └─ Navbar

useDirectorStore
  ├─ useDirector
  ├─ DirectorOrchestrator
  ├─ CameraController
  ├─ useCinematicMood
  └─ AudioProvider

useTimelineStore
  ├─ TimelineManager
  ├─ useTimeline
  └─ DirectorOrchestrator

useCinematicModeStore
  ├─ page.tsx local provider logic
  ├─ CinematicOverlay
  ├─ DirectorOrchestrator
  └─ Navbar

useLoadingStore
  └─ EngineProvider
```

## 3. Import Graph

The graph below focuses on the active runtime path.

```text
src/app/page.tsx
  ├─ ../core/engine
  ├─ ../core/cinematic
  ├─ ../core/audio
  └─ ./sections

src/core/engine/EngineProvider.tsx
  ├─ ../renderer
  ├─ ../lighting
  ├─ ../camera
  ├─ ../scene
  ├─ ./engineContext
  ├─ ../loading
  ├─ ../timeline
  └─ ../director

src/core/scene/SceneManager.tsx
  ├─ ../engine/engineContext
  ├─ ./sceneRegistry
  └─ ../../features/universe

src/features/universe/UniverseScene.tsx
  ├─ ./Background
  ├─ ./stars
  ├─ ./nebula
  ├─ ./dust
  ├─ ./blackhole
  ├─ ./earth/Earth
  ├─ ./identity/AyendaIdentity
  └─ ./useCinematicMood

src/core/director/DirectorOrchestrator.tsx
  ├─ ../performance
  ├─ ../timeline/timelineStore
  ├─ ../cinematic
  ├─ ./DirectorState
  └─ ./SceneRegistry

src/core/camera/CameraController.tsx
  ├─ @react-three/fiber
  ├─ ./cameraUtils
  ├─ ./cameraConstants
  └─ ../director

src/core/audio/AudioProvider.tsx
  ├─ ../director
  └─ ./AudioManager

src/features/universe/stars/Starfield.tsx
  ├─ ../../../core/performance
  ├─ ./starConstants
  ├─ ./StarLayer
  └─ ./starTypes

src/features/universe/nebula/Nebula.tsx
  ├─ ./NebulaLayer
  └─ ./nebulaConstants
```

### Import graph notes

- The app shell imports engine, cinematic, audio, and legacy UI paths directly.
- The engine imports the director and timeline, so engine startup also boots narrative control.
- Universe visuals depend on director state through `useCinematicMood`.
- Camera motion also depends on director state, which means camera and visuals are synchronized by the same narrative source.

## 4. Rendering Flow

```text
Next.js app route
  -> EngineProvider
  -> EngineCanvas
  -> R3F Canvas
  -> CameraRig + EngineLighting + SceneManager
  -> UniverseScene
  -> feature layers
     -> Background
     -> Nebula
     -> BlackHole
     -> GalaxyDust
     -> Starfield
     -> Earth
     -> AyendaIdentity
```

### Render ownership

- `EngineCanvas` owns the canvas configuration.
- `CameraRig` owns the scene camera and rig transformation.
- `EngineLighting` owns global lighting.
- `SceneManager` owns scene selection.
- `UniverseScene` owns visual composition.
- Each universe feature owns its own geometry and material behavior.

## 5. Director Flow

```text
performance profile detection
  -> compute adaptive scene durations
  -> set director registry
  -> sync cinematic phase
  -> drive timeline state
  -> derive current act / scene / mood
  -> feed camera, audio, and universe visuals
```

### Director responsibilities

- store the canonical scene registry
- map elapsed time to scene progress
- manage act transitions and phase changes
- expose camera, visual, and music moods
- adapt durations based on performance

### Director flow risks

- director registry and scene registry are tightly coupled.
- narrative policy and state mutation live in the same subsystem.
- `DirectorOrchestrator` acts like a control plane and a synchronization loop at the same time.

## 6. Timeline Flow

```text
TimelineProvider
  -> TimelineManager
  -> requestAnimationFrame loop
  -> timelineStore.tick(delta)
  -> director reads elapsed time
```

### Timeline behavior

- `TimelineManager` initializes the store and starts a persistent frame loop.
- `timelineStore` tracks elapsed time, delta time, playback speed, direction, and progress.
- `DirectorOrchestrator` reads timeline state and maps it back into scene state.

### Timeline coupling

- The timeline is not independent; it exists to support director logic.
- Playback state and cinematic phase are partially duplicated across stores.

## 7. Camera Flow

```text
Director state
  -> CameraController
  -> computeCameraTarget
  -> camera rig position / rotation
  -> R3F camera transform
```

### Camera architecture

- `CameraRig` provides the transform container.
- `EngineCamera` defines the perspective camera defaults.
- `CameraController` computes motion using act, scene progress, total progress, and camera mood.
- `cameraUtils.ts` contains the motion path logic.

### Camera risks

- camera math is scene-registry-aware, so it will grow with registry complexity.
- `cameraUtils.ts` is doing both motion policy and target computation.

## 8. Universe Flow

```text
director mood
  -> useCinematicMood
  -> UniverseScene
  -> visual layer props
  -> feature-specific geometry/material updates
```

### Universe composition

- `Background` sets the deep-space base environment.
- `Nebula` adds layered atmospheric depth.
- `BlackHole` renders the main gravity focal point.
- `GalaxyDust` adds dust structure and parallax motion.
- `Starfield` renders clustered stars with density scaling.
- `Earth` represents the transition beat toward arrival.
- `AyendaIdentity` renders the brand identity reveal.

### Universe flow risks

- each visual family owns its own setup, which is good, but disposal is not centralized.
- the visual stack is strongly coupled to act and scene progression.

## 9. UI Flow

```text
page.tsx
  -> Navbar
  -> Hero
  -> CinematicOverlay
```

### UI observations

- the visible UI is still a legacy marketing shell.
- `Navbar` is interactive and tied to performance and replay controls.
- `Hero` still contains normal site CTA structure.
- `CinematicOverlay` is the only UI element that behaves like a cinematic system control.

### UI coupling risks

- the shell is not yet fully aligned with the engine-centric runtime.
- anchor links and marketing CTA behavior are conceptually separate from the cinematic architecture.

## 10. Shader Ownership

Current shader ownership is feature-local.

```text
Background.tsx
  -> background shader strings

stars/starGenerator.ts
  -> star vertex + fragment shaders

nebula/nebulaUtils.ts
  -> nebula vertex + fragment shaders

blackhole/blackHoleShaders.ts
  -> accretion disk shaders

earth/Earth.tsx
  -> atmosphere shader

identity/AyendaIdentity.tsx
  -> identity ring shader
```

### Shader notes

- shaders are co-located with the feature that uses them.
- uniforms are simple and narrowly scoped.
- shader ownership is clear, but not standardized in a shared library.

## 11. Data Flow

```text
performance detection
  -> usePerformanceStore
  -> director duration scaling
  -> visual density / DPR / motion scaling

scene registry
  -> director state
  -> camera / audio / visuals

timeline progression
  -> director elapsed time mapping
  -> scene progress
  -> mood calculation

cinematic phase
  -> overlay lock state
  -> replay / skip handling
```

### Data flow characteristics

- data flows mostly top-down from director and performance into visuals.
- the scene is rendered declaratively, but many values are still derived imperatively inside per-frame hooks.

## 12. Event Flow

```text
pointer / keyboard events
  -> AudioProvider initializes audio context

Escape / skip button
  -> CinematicOverlay.skip()
  -> cinematic mode complete

scroll / replay / quality menu clicks
  -> Navbar local UI behavior

requestAnimationFrame
  -> TimelineManager.tick
  -> DirectorOrchestrator sync loop
  -> useFrame camera / scene motion
```

### Event flow notes

- browser input is used sparingly and mostly for control interactions.
- the system is heavily animation-frame driven.
- there is no global event bus, which keeps the design simpler.

## 13. Duplicate Ownership

These are the strongest duplicate-ownership areas in the workspace.

### Scene ownership duplication

- `src/core/scene/sceneRegistry.ts` defines a lightweight scene registry.
- `src/core/director/SceneRegistry.ts` defines the authoritative narrative registry.

This is the clearest duplicated concept in the codebase.

### Phase ownership duplication

- `useCinematicModeStore` owns cinematic phase state.
- `useDirectorStore` also owns a `cinematicPhase` field.
- `timelineStore` owns play/pause state.

The system works, but the same conceptual state is represented in more than one place.

### Performance ownership duplication

- `performanceStore` owns global quality policy.
- `Navbar` exposes an override UI.
- `EngineCanvas`, `Starfield`, and `DirectorOrchestrator` all read performance policy directly.

This is acceptable today, but it means performance policy is distributed across three layers.

## 14. Circular Risks

No hard circular import crash was observed in the current source map, but there are architectural circular risks.

### Risk patterns

- director state informs camera, audio, and visuals
- those same systems are mounted through the engine shell
- the engine shell also owns scene selection and timeline synchronization

The risk is not an import loop today. The risk is that a future helper or shared utility could create a hidden dependency cycle because the boundaries are already dense.

### Most likely future cycle candidates

- `director` <-> `timeline`
- `director` <-> `camera`
- `director` <-> `cinematic`
- `scene` <-> `director`

## 15. Tight Coupling

### Tight coupling hotspots

- `CameraController` is tightly coupled to director state and act semantics.
- `useCinematicMood` is tightly coupled to scene registry acts and progress values.
- `DirectorOrchestrator` is coupled to performance detection, scene registry adaptation, timeline state, and cinematic phase changes.
- `SceneManager` is tightly coupled to `UniverseScene` as the current active scene.
- `AudioProvider` is tied to the director’s music mood model.

### What this means

The system is intentionally cohesive, but some modules have become control hubs. That is fine for the current stage, but these hubs should not keep absorbing unrelated responsibilities.

## 16. Weak Abstractions

### Weak abstractions in the current code

- `core/scene/sceneRegistry.ts` is too small to be meaningful long-term if the director registry is the real scene model.
- `DirectorTimeline.ts` and `SceneTransition.ts` currently act more like thin convenience wrappers than stable abstractions.
- `core/assets/index.ts` is a placeholder abstraction without a manifest or loader policy.
- `useViewport` and `useFps` are generic helpers but not currently integrated into the runtime architecture.

### Why they are weak

These modules exist as shape, not as critical infrastructure. They do not yet carry enough behavior or shared usage to justify their long-term status.

## 17. Large Modules

The largest and most architecturally important files are:

- `src/core/director/SceneRegistry.ts`
- `src/features/universe/useCinematicMood.ts`
- `src/core/director/DirectorState.ts`
- `src/core/camera/cameraUtils.ts`
- `src/core/director/DirectorOrchestrator.tsx`
- `src/core/performance/performanceStore.ts`
- `src/features/universe/stars/starGenerator.ts`

### Why they matter

These modules are doing policy work, not just rendering or simple data definition. They will become harder to reason about as the experience gains more scenes and more asset types.

## 18. Refactoring Opportunities

### High-value opportunities

1. Consolidate scene truth into one authoritative registry and one lightweight scene descriptor layer.
2. Separate director policy from director state mutation.
3. Extract resource lifecycle handling into reusable cleanup helpers.
4. Add an asset manifest and loader boundary before adding more textures or models.
5. Make the timeline manager and director sync responsibilities explicit and narrower.
6. Move the legacy shell out of the main runtime path once the cinematic shell is ready.
7. Extract shared math or shader utilities only where reuse is real.

### Lower-risk cleanup opportunities

- remove or defer dead exports that are not currently used
- standardize module naming for scene, act, phase, and registry
- add explicit fallback components for loading and render failure

## 19. System Summary

Current architecture strengths:

- clear engine direction
- strong separation between core orchestration and universe visuals
- good use of Zustand for runtime state
- coherent R3F and Three.js composition
- strong narrative intent in the director layer

Current architecture weaknesses:

- duplicated scene ownership
- scattered phase ownership
- no formal resource lifecycle policy
- legacy shell still present
- several thin abstractions that are not yet mission-critical

## 20. Working Rule

Any future change should respect the current direction:

- preserve the engine-first structure
- avoid introducing duplicate ownership of the same concept
- keep feature-local rendering logic local
- keep shared policy in core systems
- favor incremental refinement over architectural replacement


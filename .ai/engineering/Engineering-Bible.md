# AYENDA ODYSSEY ENGINEERING BIBLE

This document is the permanent engineering constitution for the current Ayenda Odyssey workspace.

It describes the architecture as it exists today. It does not redefine the system, replace current patterns, or assume future implementations are already present.

## 1. Project Architecture

Ayenda Odyssey is currently organized as a layered Next.js application with a cinematic experience shell, a rendering engine layer, and feature modules for the universe visuals.

The architecture is built around these ideas:

- Next.js App Router is the application host.
- React components compose both the UI shell and the 3D experience.
- TypeScript provides strict typing for engine, state, and scene contracts.
- React Three Fiber is the runtime bridge into Three.js.
- Zustand powers most application state.
- Visual features are isolated under `src/features/universe`.
- Engine services and orchestration live under `src/core`.

The system is already closer to an engine than a normal website. The current shape favors composable services, layered state, and explicit scene orchestration.

## 2. Folder Structure

The current workspace is organized by responsibility rather than by page.

### Root

- `src/` - application source
- `docs/` - project documentation and planning
- `tests/` - unit tests
- `package.json` - dependency and script manifest
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - lint configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind configuration

### `src/app`

Contains the App Router shell and the current visible application entry point.

- `layout.tsx` - root document shell and metadata
- `page.tsx` - current home route composition
- `globals.css` - global styles and base visual treatment
- `sections/` - legacy marketing-style shell components currently still mounted in the page

### `src/core`

Contains the engine and orchestration layer.

- `engine/` - engine context and root provider
- `renderer/` - R3F canvas wrapper
- `camera/` - camera rig, controller, and motion math
- `lighting/` - global lighting layer
- `scene/` - lightweight scene registry and scene manager
- `director/` - cinematic state, registry, timing, and orchestration
- `timeline/` - timeline store and playback manager
- `performance/` - performance detection and adaptive quality hooks
- `audio/` - audio context management
- `cinematic/` - cinematic phase state and overlay
- `loading/` - loading state store
- `assets/` - asset descriptors placeholder

### `src/features/universe`

Contains the visible 3D experience modules.

- `Background.tsx` - world-space background sphere
- `UniverseScene.tsx` - assembly of the current experience layers
- `stars/` - starfield generation and rendering
- `nebula/` - nebula layers and GLSL utilities
- `dust/` - dust field generation and rendering
- `blackhole/` - black hole, event horizon, and disk components
- `earth/` - Earth and atmosphere rendering
- `identity/` - Ayenda identity object

### `tests`

Contains current unit coverage for state and registry logic.

- `tests/unit/core/performance/performanceStore.test.ts`
- `tests/unit/core/director/SceneRegistry.test.ts`
- `tests/unit/core/cinematic/cinematicModeStore.test.ts`

## 3. Module Responsibilities

### App Shell

The app shell is responsible for mounting the root experience and setting global document-level metadata and styles.

Current responsibilities:

- define metadata
- establish dark baseline styling
- render the current home experience

### Engine Layer

The engine layer coordinates the runtime scene state and the R3F canvas stack.

Current responsibilities:

- create the engine context
- mount the canvas
- provide camera, lighting, and scene composition
- connect director and timeline orchestration

### Director Layer

The director layer is the narrative control plane.

Current responsibilities:

- store current act and scene
- compute adaptive durations
- map scene metadata to cinematic state
- drive phase transitions
- expose intent values such as camera mood, music mood, and visual mood

### Timeline Layer

The timeline layer tracks elapsed time and playback state.

Current responsibilities:

- maintain play/pause/seek state
- advance elapsed time
- synchronize with director state

### Performance Layer

The performance layer detects the device class and adapts rendering quality.

Current responsibilities:

- detect GPU/memory capabilities
- derive a performance profile
- set DPR, density, and timing scale
- expose adaptive quality hooks

### Universe Feature Layer

The universe layer contains the cinematic visuals.

Current responsibilities:

- render space background
- render stars, dust, and nebulae
- render the black hole and accretion disk
- render Earth and identity beats
- map director mood to scene opacity, scale, and visibility

## 4. Rendering Pipeline

The current render path is:

1. `src/app/page.tsx` mounts the experience shell.
2. `EngineProvider` creates engine context and mounts orchestration providers.
3. `EngineCanvas` mounts the R3F `Canvas`.
4. `CameraRig`, `EngineLighting`, and `SceneManager` are rendered inside the canvas.
5. `SceneManager` selects the active scene.
6. `UniverseScene` composes the visible 3D layers.
7. Individual feature modules animate their own geometry/material state through `useFrame` and React effects.

The pipeline is functional and already optimized for a cinematic background experience, but it is not yet structured around a formal loading manager, post-processing chain, or asset streaming layer.

## 5. React Architecture

The React architecture is hybrid:

- the app shell uses ordinary React components
- the engine uses client components and R3F integration
- most runtime state is kept in Zustand stores rather than local component state

Current React patterns:

- root layout is server-friendly
- engine and cinematic components are client-only
- composition favors small focused modules
- some components are stateful wrappers around imperative Three.js objects
- provider composition is used to scope engine concerns

The current design is correct for a cinematic app, but the provider graph is dense and would benefit from a clearer service boundary over time.

## 6. Three.js Architecture

Three.js is used directly for geometry, material, shader, and vector math.

Current Three.js patterns:

- manual creation of geometries and materials in feature modules
- custom shaders for background, stars, nebula, black hole disk, and identity ring
- direct use of `BufferGeometry`, `SphereGeometry`, `PlaneGeometry`, `RingGeometry`, `TorusGeometry`
- material mutation through refs and effects
- use of `three` math objects such as `Vector3`, `Euler`, and `Color`

The implementation is modular but still component-owned rather than asset-managed. That is acceptable at the current stage, but cleanup and reuse layers will become increasingly important.

## 7. React Three Fiber Architecture

R3F is the bridge between React and the WebGL scene.

Current R3F patterns:

- `Canvas` is wrapped in `EngineCanvas`
- the scene graph is assembled declaratively
- `useFrame` drives per-frame updates in feature components
- `frustumCulled={false}` is used in several visual layers
- the camera is controlled by a custom rig instead of default orbit-style interaction

Current R3F architecture is effective for cinematic control, but the absence of a formal post-processing and loader orchestration layer means the render loop still relies heavily on component ownership.

## 8. GLSL Organization

GLSL lives inside feature-local modules.

Current organization:

- star shaders are defined in `stars/starGenerator.ts`
- nebula shaders are defined in `nebula/nebulaUtils.ts`
- black hole disk shaders are defined in `blackhole/blackHoleShaders.ts`
- the Earth atmosphere shader is embedded in `Earth.tsx`
- the identity ring shader is embedded in `AyendaIdentity.tsx`
- the background shader is embedded in `Background.tsx`

This organization is feature-local and easy to navigate, but it is not yet standardized.

Recommended incremental evolution:

- extract shared shader utilities when a second or third material reuses the same helpers
- keep feature-owned shaders co-located until sharing is real
- avoid centralizing all GLSL too early

## 9. Camera Architecture

The camera system is explicit and narrative-driven.

Current structure:

- `CameraRig` owns the camera group
- `EngineCamera` defines the perspective camera defaults
- `CameraController` updates the rig position and rotation per frame
- `cameraUtils.ts` computes the camera journey from act state and scene progress
- `cameraConstants.ts` defines motion tuning constants

Camera behavior is driven by the director state rather than user interaction.

This is the correct shape for a cinematic experience, but the camera logic is still tightly coupled to the current act registry.

## 10. Director Architecture

The director is the project’s narrative brain.

Current components:

- `DirectorState.ts` - Zustand store for current act, scene, moods, and timing
- `SceneRegistry.ts` - canonical scene definitions and adaptive duration logic
- `DirectorOrchestrator.tsx` - synchronization between performance, timeline, and cinematic phases
- `directorTypes.ts` - shared types
- `useDirector.ts` - read/write hook for director state

The director currently does all of the following:

- maps elapsed time to scene state
- maps scene state to moods
- adjusts duration based on performance profile
- handles intro, playing, reversing, replaying, and complete phases

This is a powerful architecture, but it is also the highest-risk area for future drift because it mixes narrative data, timing policy, and runtime orchestration in one subsystem.

## 11. Timeline Architecture

The timeline system provides continuous time progression.

Current structure:

- `timelineStore.ts` holds the playback state and time advancement logic
- `TimelineManager.ts` runs the requestAnimationFrame loop
- `TimelineProvider.tsx` mounts the manager and exposes context
- `useTimeline.ts` provides a selector hook
- `timelineTypes.ts` defines the store contract

The timeline is intentionally simple and store-based. It is currently a supporting system for the director rather than a user-facing playback control.

## 12. Universe Architecture

The universe is the current primary 3D feature set.

Current composition in `UniverseScene.tsx`:

- `Background`
- `Nebula`
- `BlackHole`
- `GalaxyDust`
- `Starfield`
- `Earth`
- `AyendaIdentity`

Visual mood is derived from `useCinematicMood.ts`, which maps director act and progress into opacity, scale, glow, speed, and density values.

This is a good separation of concerns:

- scene assembly stays in one place
- each visual family owns its own rendering details
- mood logic stays declarative

The weak point is lifecycle management, especially around resource cleanup and repeated object creation.

## 13. State Management

Zustand is the dominant state layer.

Current stores:

- `useCinematicModeStore`
- `useDirectorStore`
- `useTimelineStore`
- `useLoadingStore`
- `usePerformanceStore`

Current state philosophy:

- stores are the source of truth for runtime orchestration
- hooks read slices of state using shallow selectors
- state is intentionally separated by domain

The current design is reasonable, but it is split across multiple overlapping domains:

- cinematic phase
- director phase
- timeline playback
- engine scene selection

This is the most obvious long-term coordination risk in the codebase.

## 14. Performance Architecture

The performance system already anticipates a premium experience.

Current features:

- GPU and memory detection
- performance profile selection
- DPR scaling
- particle density scaling
- duration scaling
- target FPS modeling
- quality override controls in the shell

The performance architecture is directionally strong, but it currently acts more as a policy layer than a fully integrated rendering budget manager.

Recommended incremental improvements:

- add a formal frame-budget monitor
- make low-quality fallbacks explicit per subsystem
- connect asset loading decisions to the same profile

## 15. Resource Lifecycle

Resource lifecycle is currently managed inconsistently.

What exists today:

- some components memoize geometries and materials
- several components hold refs to materials for live uniform updates
- the audio manager owns the audio context lifetime

What is missing:

- explicit disposal for geometries and materials in visual components
- centralized loader cache lifecycle
- teardown policy for scene transitions
- a formal asset registry with eviction rules

This is the largest technical gap between the current architecture and a production-grade cinematic engine.

## 16. Memory Management

Memory behavior is acceptable for a small demo, but not yet hardened for long sessions.

Observed concerns:

- large geometries are created in several components
- shader materials are recreated in feature-local memo blocks
- several loops update per frame without a broader lifecycle policy
- the audio manager keeps a Web Audio context alive after initialization

Recommended incremental improvements:

- add disposal cleanup to visual components
- use shared geometry/material caches where reuse is real
- avoid repeated instantiation of static values inside render paths

## 17. Error Handling

Error handling is minimal at the moment.

Current state:

- no global React error boundary
- no formal loading error state for 3D assets
- no scene fallback if an R3F component fails
- no audio fallback UI beyond mute behavior

The app builds and runs, but the runtime has not yet been hardened for partial failure.

Recommended incremental improvements:

- add an error boundary around the experience shell
- add a render-safe fallback for scene failures
- surface loader failures into `loadingStore`

## 18. Asset Management

Asset management is currently a placeholder.

Observed state:

- `src/core/assets/index.ts` exports an empty asset list
- no loader pipeline exists yet for textures, HDRIs, models, or audio manifests
- no cache manager exists for textures or glTF assets

This is appropriate for an early engine foundation, but it should be the next major subsystem after the current visual scaffolding.

Recommended incremental improvements:

- introduce an asset manifest
- centralize loader logic
- add caching and preloading rules
- connect loading state to actual assets instead of hard-coded completion

## 19. Build Pipeline

The build pipeline is modern and healthy.

Current configuration:

- Next.js App Router
- Turbopack dev mode
- TypeScript strict mode
- ESLint flat config
- Prettier formatting
- Vitest unit tests
- Playwright configured for e2e

Verified status:

- lint passes
- typecheck passes
- unit tests pass
- formatting check passes
- production build passes
- local dev server responds successfully

There is one non-fatal build warning about `tailwind.config.ts` module typing. It does not block the build, but it should be cleaned up in the future.

## 20. Coding Standards

Current standards implied by the codebase:

- strict TypeScript
- modular domain ownership
- explicit file names
- local imports through the `@/*` alias
- feature-local shader and geometry logic
- minimal comments except where behavior is subtle

The codebase already tends toward readability and domain isolation.

Recommended incremental improvements:

- keep shared contracts in typed modules
- prefer small focused files
- avoid broad barrel exports when they hide dependency shape

## 21. TypeScript Standards

Current TypeScript posture:

- strict mode enabled
- bundler module resolution
- no `allowJs`
- React and Next typings installed
- explicit types used in stores, providers, and props

Observed strengths:

- store contracts are typed
- scene metadata is typed
- shader and render component props are typed

Observed risks:

- some runtime assumptions still rely on non-null assertions through React refs or implicit component ownership
- a few modules are typed more as implementation convenience than as a stable public API

## 22. React Standards

Current React patterns:

- client components for runtime-heavy pieces
- server-friendly layout for document shell
- hooks used for state and motion
- context used for engine service scope
- effect-driven orchestration for browser-only behavior

Philosophy currently in the code:

- React is a coordinator, not the main simulation engine
- Three.js owns the scene work
- Zustand owns state

This is the correct direction for a cinematic experience.

## 23. Three.js Standards

Current standards implied by the code:

- feature-local ownership of mesh/material construction
- direct use of Three primitives
- shader materials when surface behavior needs control
- simple material mutation through refs
- broad memoization for static geometry where already implemented

The code respects Three.js’s imperative model while keeping a React wrapper around it.

Recommended incremental improvements:

- establish disposal rules
- standardize loader/caching ownership
- share reusable render helpers where patterns repeat

## 24. Shader Standards

Current shader standards are informal but workable.

Current pattern:

- shaders live next to the visual feature that uses them
- shader code is embedded as string literals
- uniforms are usually minimal and specific
- alpha discard is used for soft particle edges

This is fine for the current scope.

Recommended incremental improvements:

- keep shader naming consistent
- extract common utilities only when duplication appears in multiple materials
- document intended uniform meanings inside the shader module

## 25. Naming Conventions

Current naming style:

- PascalCase for React components and types
- camelCase for hooks, utilities, and functions
- `index.ts` used for controlled public exports
- scene and registry constants often use descriptive domain names

The naming is generally coherent.

Risk area:

- some names overlap between the engine scene registry and the director scene registry
- some feature names are aspirational rather than operational

Recommended incremental improvement:

- reserve one canonical term for each concept: scene, act, phase, mood, registry

## 26. File Organization

Current file organization is strong at the domain boundary level.

Good traits:

- engine code is separated from universe visuals
- low-level helpers are close to their consumers
- tests mirror the source-domain layout

Weak traits:

- there are overlapping directories for scene concepts
- some placeholders remain exported even when not yet used
- there is at least one stray asset-like file in `src/styles/`

## 27. Component Philosophy

Current component philosophy is:

- components should be composable scene pieces
- components may encapsulate imperative Three.js setup when needed
- components should not own unrelated business logic

This is generally being followed.

Observed exception:

- some components still contain too much domain math and lifecycle policy in one file

Recommended incremental improvement:

- keep render components thin
- move policy and calculation into typed utilities when they stabilize

## 28. Hook Philosophy

Current hook philosophy:

- hooks expose engine state or view state
- hooks should remain pure selectors or browser-native effect wrappers
- hooks are used to hide store and frame-loop details from UI components

Examples:

- `useDirector`
- `useTimeline`
- `usePerformanceStore` selectors
- `useCinematicMood`
- `useDpr`
- `useViewport`

Recommended incremental improvement:

- avoid turning hooks into hidden service locators for multiple domains at once

## 29. Utility Philosophy

Current utility philosophy:

- utilities should be narrow and feature-aligned
- math and mapping functions live close to the systems they support
- registries and constants often remain in the domain folder

This is mostly healthy.

Recommended incremental improvement:

- promote shared utilities only when they are genuinely reused
- avoid over-centralizing small helpers too early

## 30. Testing Strategy

Current testing strategy is unit-first.

Existing coverage:

- performance store behavior
- scene registry invariants
- cinematic mode store behavior

This gives a good foundation for state logic, but not yet for integration or rendering behavior.

Recommended incremental improvements:

- add integration coverage for engine orchestration
- add basic render smoke tests for scene mounting
- add asset-loading contract tests when the loader system exists

## 31. Optimization Strategy

Current optimization strategy is mostly adaptive and declarative.

Observed techniques:

- DPR scaling
- particle density scaling
- duration scaling
- frustum culling disabled only where needed
- memoization for some geometries/materials
- compact shader implementations for repeated geometry

The strategy is sensible for a cinematic app, but the missing layer is a formal budget coordinator for CPU, GPU, and asset cost.

## 32. Technical Debt

Current technical debt is concentrated in these areas:

- duplicated scene registries
- placeholder modules that are exported before they are meaningfully used
- runtime resources without disposal policy
- legacy marketing shell still mounted in the app route
- direct coupling of scene mood to act registry internals

This debt is manageable, but it should be reduced before the visual engine expands further.

## 33. Known Risks

Known risks in the current architecture:

- resource leaks from unmanaged geometry/material lifecycles
- state drift between timeline, director, cinematic phase, and engine scene selection
- future loader complexity without a manifest/cache layer
- growing scene complexity inside large registry files
- underused or unused dependencies increasing maintenance and install cost
- inconsistent runtime behavior if placeholder scenes remain reachable

## 34. Recommended Evolution

The project should evolve incrementally from its current architecture rather than being rewritten.

Recommended order of evolution:

1. Consolidate scene and phase ownership.
2. Add a formal asset manager with caching and loading state integration.
3. Add global error boundaries and render fallbacks.
4. Standardize resource cleanup for all visual components.
5. Introduce a post-processing and rendering effects layer.
6. Separate scene metadata, scene flow, and director policy more clearly.
7. Remove dead exports and unused dependencies once the next subsystem is in place.
8. Replace the legacy shell with the cinematic shell only when the experience is ready.

## 35. Constitution

The engineering rules for this workspace are:

- preserve the cinematic intent
- keep architecture modular
- keep state explicit
- keep resource ownership local and accountable
- prefer incremental evolution over rewrites
- let performance guide every addition
- do not duplicate conceptual ownership
- do not introduce hidden coupling between engine systems
- treat shader, scene, camera, and state boundaries as first-class architecture

This document describes the current project and protects it from accidental architectural drift.

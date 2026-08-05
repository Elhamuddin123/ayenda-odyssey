# AYENDA ODYSSEY PERFORMANCE GUIDE

This guide describes performance strategy for the current rendering architecture.

It is based on the code that exists today: a Next.js App Router shell, an R3F canvas, a director/timeline orchestration layer, and feature-local Three.js visual modules.

The goal is not to re-architect the system. The goal is to preserve the current cinematic direction while making the existing pipeline cheaper, more predictable, and easier to scale.

## 1. Current Rendering Architecture

The current render path is:

1. `src/app/page.tsx` mounts the experience shell.
2. `EngineProvider` mounts the engine context, director provider, and timeline provider.
3. `EngineCanvas` creates the R3F canvas with high-performance WebGL settings.
4. `CameraRig`, `EngineLighting`, and `SceneManager` render inside the canvas.
5. `SceneManager` selects `UniverseScene`.
6. `UniverseScene` assembles background, nebula, black hole, dust, stars, Earth, and identity layers.
7. Director state and performance state drive visual density, opacity, camera motion, and timing.

This is already a strong cinematic base. The main performance cost comes from the fact that many layers are independently animated and several of them generate their own geometry and materials.

## 2. GPU Optimization

### Current state

- The canvas is configured with `powerPreference: "high-performance"`.
- Antialiasing is enabled.
- The canvas is not using a post-processing stack yet.
- Large point clouds and multiple full-frame shader layers are rendered at once.
- Several layers disable frustum culling.

### Recommendations

- Keep the canvas in high-performance mode for the default experience.
- Add a clear quality ladder for GPU-heavy effects before adding more scene complexity.
- Reduce the number of simultaneously visible full-frame layers where possible.
- Prefer additive or normal blending only when it materially improves the composition.
- Avoid adding extra full-screen passes until the scene budget is measured.

### Current risk

The scene is visually rich but GPU cost can rise quickly if new layers are added without a budget policy.

## 3. CPU Optimization

### Current state

- The director, timeline, and camera each run some frame-based logic.
- `useFrame` is used in multiple scene components.
- Several store selectors are read on the render path.
- Star, dust, and nebula generation are performed in component-local code.

### Recommendations

- Keep expensive calculations out of render bodies.
- Avoid rebuilding geometry or materials from unstable props.
- Prefer store selectors over broad object subscriptions, which the code already mostly does.
- Keep frame updates bounded to visible motion only.
- Move any repeated math that does not depend on per-frame state into cached helpers.

### Current risk

The CPU cost is not extreme yet, but the architecture can easily accumulate multiple per-frame loops and redundant calculations.

## 4. Memory Optimization

### Current state

- Geometries and materials are instantiated inside feature modules.
- The code currently relies on memoization and refs, but not on an explicit disposal layer.
- The audio manager holds a persistent `AudioContext`.
- There is no centralized asset cache yet.

### Recommendations

- Add disposal discipline for every geometry and material that is created manually.
- Treat memoized Three.js objects as long-lived resources, not disposable implementation details.
- Introduce an asset cache when textures, HDRIs, and glTF models are added.
- Keep persistent browser resources like audio contexts intentional and documented.

### Current risk

Long-running sessions may accumulate GPU and CPU memory pressure because lifecycle cleanup is not yet centralized.

## 5. Geometry Reuse

### Current state

- `Background` creates a sphere geometry once.
- `Nebula` creates one plane geometry and shares it across layers in the component tree.
- `Earth`, `EventHorizon`, `AccretionDisk`, and `AyendaIdentity` each own their own static geometry.
- `StarLayer` and `DustLayer` create geometry per layer using generator functions.

### Recommendations

- Reuse geometry when the shape is identical across instances.
- Keep one geometry instance per stable layer configuration whenever possible.
- Share geometry across layers when only material or transform differs.
- Avoid rebuilding geometries from array/object props that change identity every render.

### Best fit for current architecture

The current feature-local structure is good. Geometry reuse should happen inside a feature family, not through a global geometry singleton too early.

## 6. Material Reuse

### Current state

- Most materials are created per component instance.
- Shader materials are local to the visual feature that owns them.
- Some materials are updated through refs for opacity and uniforms.

### Recommendations

- Reuse materials when the shader, uniforms, and blending mode are effectively the same.
- Keep feature-scoped materials co-located until there is proven reuse across multiple scenes.
- Avoid creating new material instances from unstable `useMemo` dependencies.
- Consider pooled or cached material factories for future repeated objects such as props, icons, or reusable VFX motifs.

### Current risk

Material creation is acceptable now, but repeated scene mounts or future content additions could make this a hidden cost center.

## 7. Shader Optimization

### Current state

- Shaders are feature-local and simple.
- Star and dust shaders use point sprites.
- Nebula and background shaders are full-surface procedural materials.
- Black hole and identity shaders are additive and visually prominent.
- Several shaders use discard logic, noise, or looping FBM-style patterns.

### Recommendations

- Keep fragment shaders lean and visually targeted.
- Prefer low-iteration noise patterns unless the effect absolutely needs complexity.
- Avoid adding branching that varies heavily per pixel unless the effect is truly narrative-critical.
- Keep uniform sets small.
- Add shared shader helpers only when multiple materials need the same math.

### Current risk

The nebula and background layers are visually efficient for what they do, but as more large-screen shader passes are added, fragment cost will become the first bottleneck.

## 8. Texture Management

### Current state

- No formal texture pipeline exists yet.
- No texture cache or loader registry exists yet.
- The current experience is mostly geometry- and shader-driven.

### Recommendations

- Introduce texture caching before the first real production texture set lands.
- Prefer compressed texture formats once the texture pipeline is real.
- Add a loader policy for future HDRI, KTX2, and model textures.
- Keep high-frequency scene textures resident only if they are reused.

### Current risk

Texture management is currently a future gap rather than an active problem, but the architecture is not yet ready for large texture-heavy content.

## 9. Particle Optimization

### Current state

- Stars and dust are rendered as layered point clouds.
- Particle counts are non-trivial.
- Density is scaled by `usePerformanceStore`.
- Hero stars use twinkle logic and per-frame shader uniform updates.

### Recommendations

- Keep the layer count limited and purposeful.
- Use density scaling aggressively on weaker devices.
- Avoid increasing total particle count without removing cost elsewhere.
- Preserve the current cluster-based generation approach because it produces visual richness without requiring more layers.
- Consider capping visible particle density per profile rather than scaling everything linearly forever.

### Current risk

Particles are one of the clearest visual strengths of the project, but they are also the easiest way to accidentally break frame budget later.

## 10. Animation Optimization

### Current state

- Camera motion is animated every frame.
- Timeline and director both use frame loops.
- Stars, dust, nebula, and accretion disk layers animate continuously.
- Some visible UI elements use local React state and timed transitions.

### Recommendations

- Keep animation responsibility local to the component that actually needs it.
- Avoid simultaneous frame loops that can be merged into one orchestration layer.
- Prefer delta-driven animation over timer-driven state churn.
- Reserve `useFrame` for motion that must be synchronized to the render loop.

### Current risk

The app already has multiple animation authorities. That is acceptable now, but it is the place most likely to drift if more loops are added.

## 11. Frame Pacing

### Current state

- `TimelineManager` runs its own `requestAnimationFrame` loop.
- `DirectorOrchestrator` also runs a `requestAnimationFrame` loop.
- `useFrame` runs inside R3F for visual motion.
- The canvas uses R3F performance settings and adaptive DPR.

### Recommendations

- Keep frame ownership explicit and narrow.
- Avoid adding more global animation loops unless they control something that cannot live inside the existing loops.
- Make frame budget decisions based on visible quality rather than abstract device capability alone.
- Add an FPS monitor when the runtime begins to feel crowded with motion systems.

### Current risk

Frame pacing can become uneven if several loops all mutate related state at the same time.

## 12. Bundle Optimization

### Current state

- The app already uses Next.js App Router and Turbopack in dev.
- The dependency set includes heavy rendering libraries, animation libraries, and test tooling.
- Several dependencies are installed but not yet used in source.

### Recommendations

- Keep production bundles focused on the modules actually used by the shell.
- Delay importing optional animation or motion libraries until there is a concrete usage path.
- Keep feature-local imports shallow so that only the current experience path is loaded.
- Avoid turning broad barrel exports into hidden bundle multipliers.

### Current risk

The package set is larger than the current runtime needs, so bundle size can grow faster than visible functionality if the extra dependencies are activated casually.

## 13. Future Scalability

### Current state

The architecture is scalable in shape:

- engine layer
- director layer
- timeline layer
- performance layer
- feature-local universe layers

### What will scale well

- store-based state separation
- feature-local shader ownership
- declarative scene composition
- typed registry-driven storytelling

### What will not scale automatically

- duplicate scene registries
- resource lifecycle management
- unbounded particle growth
- more animation loops without orchestration boundaries
- new asset types without a loader/cache layer

### Recommendations

- Add formal asset and cleanup services before the content library grows.
- Keep the universe feature tree modular by visual family.
- Treat director policy as a core engine service, not a component-level convenience.

## 14. Base Optimization Principles for This Codebase

These are the practical rules that best fit the current architecture.

### Preserve

- feature-local ownership of visuals
- director-driven camera and mood control
- adaptive density and DPR scaling
- memoized static geometries where already present

### Tighten

- resource cleanup
- repeated object creation
- duplicate ownership of scene or phase state
- multiple animation loops that touch related state

### Defer

- global shader libraries
- global geometry registries
- aggressive abstraction of already-working feature-local code

## 15. Practical Priority Order

If performance work is scheduled incrementally, the best order is:

1. Add explicit resource cleanup and lifecycle rules.
2. Consolidate duplicate scene and phase ownership.
3. Add asset loading and caching infrastructure.
4. Tighten particle and shader budgets before adding more content.
5. Introduce frame budgeting and runtime FPS visibility.
6. Add post-processing only after the base render path is stable.

## 16. Summary

The current rendering architecture is strong for a cinematic experience because it is modular, layered, and already performance-aware.

Its biggest performance risks are not the current visuals themselves. The risks are:

- resource lifecycle gaps
- duplicate ownership of narrative state
- multiple frame loops
- future asset complexity without a loader system
- unbounded visual expansion without a budget discipline

The best path forward is not a rewrite. It is to protect the existing structure, formalize cleanup, and scale the same architecture with more discipline.


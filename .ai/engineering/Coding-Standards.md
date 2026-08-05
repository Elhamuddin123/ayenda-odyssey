# AYENDA ODYSSEY CODING STANDARDS

These standards describe how this codebase currently works and how new code should align with it.

They are intentionally project-specific. They are not generic React or Three.js advice.

## 1. React Conventions

- Use React primarily as an orchestration layer, not as a simulation engine.
- Keep browser-only logic inside client components.
- Keep the App Router shell lean and let engine-specific behavior live in `src/core`.
- Prefer composition over deeply nested prop drilling.
- Keep stateful behavior in hooks or stores when it is shared across the cinematic system.
- Use local React state only for truly local UI behavior, such as menu toggles or transient visibility.
- Favor small focused components over monolithic scene components.
- Keep React components declarative even when they host imperative Three.js objects.

### Current project pattern

- `src/app/page.tsx` assembles the runtime shell.
- `src/core/engine/EngineProvider.tsx` coordinates engine services.
- `src/features/universe/UniverseScene.tsx` composes the 3D layers.
- `src/app/sections/Navbar.tsx` and `src/app/sections/Hero.tsx` remain legacy shell components and should stay lightweight until the shell is replaced.

## 2. TypeScript Conventions

- Use strict TypeScript for all new code.
- Type public props, store state, and exported helpers explicitly.
- Prefer `readonly` for data that should not be mutated.
- Use union types for project domain states such as scenes, moods, phases, and performance tiers.
- Keep type definitions close to the subsystem they describe unless they are truly shared.
- Avoid `any`.
- Avoid broad type assertions unless bridging a browser or WebGL API that cannot be typed more precisely.

### Current project pattern

- Store contracts are strongly typed.
- Scene metadata is typed through director-specific interfaces.
- Three.js refs often require `null`-safe typing because they are controlled by React lifecycle.

## 3. Folder Conventions

- Organize by domain responsibility, not by generic layer names alone.
- Keep engine code in `src/core`.
- Keep 3D visual families in `src/features/universe`.
- Keep route composition in `src/app`.
- Keep tests under `tests` with a path shape that mirrors the source domain.
- Keep documentation under `docs` or `.ai/engineering` depending on whether it is user-facing or engineering-governance content.

### Current project pattern

- `core/` contains orchestration, state, and engine primitives.
- `features/universe/` contains the scene family that powers the current experience.
- `app/sections/` is still present, but it should be treated as legacy shell code rather than the long-term content model.

## 4. Naming Conventions

- Use PascalCase for React components, React props types, and exported classes.
- Use camelCase for hooks, functions, stores, and local variables.
- Use descriptive domain names rather than generic names such as `Manager` unless the module really is an orchestrator.
- Use `index.ts` only for deliberate public exports.
- Prefer project terms that already exist in the codebase: scene, act, phase, timeline, mood, registry, canvas, rig, overlay.

### Current project pattern

- `EngineProvider`, `DirectorOrchestrator`, `CameraController`, `Starfield`, `GalaxyDust`, and `CinematicOverlay` match the current naming language.
- Avoid introducing alternate names for the same concepts.

## 5. Hook Conventions

- Hooks should either read state, coordinate a browser effect, or derive view data.
- Keep hooks single-purpose.
- Use hooks for shared state selection rather than spreading store access throughout the tree.
- Memoize derived values only when it improves clarity or avoids unnecessary recomputation in a hot path.
- Use `useFrame` only for motion or state that truly belongs to the render loop.

### Current project pattern

- `useDirector` exposes the director store in a curated shape.
- `useTimeline` exposes timeline state and actions in a curated shape.
- `useCinematicMood` derives mood values from director state.
- `useDpr`, `useViewport`, and `useFps` are utility hooks and should remain narrow.

## 6. Component Conventions

- Keep visual components close to the assets, shaders, or math they own.
- Keep component responsibilities narrow.
- Let engine composition happen at the scene or provider level.
- Do not hide major policy decisions inside a rendering component unless that component is the clear owner.
- Prefer small reusable scene parts over giant scene files.

### Current project pattern

- `UniverseScene` is a composition root for the 3D experience.
- `StarLayer`, `DustLayer`, `NebulaLayer`, `AccretionDisk`, `Earth`, and `AyendaIdentity` each own a visual slice of the scene.
- `SceneManager` is a routing component for scene selection.

## 7. Store Conventions

- Use Zustand for shared runtime state.
- Keep stores domain-specific.
- Use stores for cinematic control, performance policy, timeline, loading, and director state.
- Select only the slice of store state that a component actually needs.
- Keep action names imperative and domain-specific.
- Avoid duplicating the same concept across multiple stores unless one store is a derived compatibility layer.

### Current project pattern

- `usePerformanceStore` owns device and quality policy.
- `useDirectorStore` owns the narrative state model.
- `useTimelineStore` owns playback progression.
- `useCinematicModeStore` owns overlay lock and replay behavior.
- `useLoadingStore` is the current placeholder for loading lifecycle.

## 8. Utility Conventions

- Keep utilities narrow and domain-aligned.
- Prefer utility modules for math, mapping, and lookup logic that would otherwise clutter components.
- Do not create a broad utilities bucket too early.
- Only promote a helper into shared utility space when it is genuinely reused.

### Current project pattern

- Camera math lives in `cameraUtils.ts`.
- Scene timing and adaptive durations live in the director registry and director helpers.
- Shader factories live with the visual family that uses them.

## 9. Shader Conventions

- Keep shaders feature-local unless there is proven cross-feature reuse.
- Use GLSL strings or feature-local shader modules as the current project does.
- Keep uniforms small and explicit.
- Use meaningful uniform names that read like scene intent, not engine internals.
- Prefer readable shader math over clever compression.
- Keep discard logic and blending decisions inside the shader module that owns the visual effect.

### Current project pattern

- Background, stars, nebula, black hole disk, Earth atmosphere, and identity ring each own their shader logic.
- Shader ownership should stay with the visual family that renders it.

## 10. Three.js Conventions

- Use Three.js directly for geometry, material, and math objects when the effect requires it.
- Keep Three.js object creation near the component or generator that owns the effect.
- Reuse geometries when the same shape is needed repeatedly.
- Reuse materials when shader behavior is truly identical.
- Be explicit about transparency, depth writing, blending, and frustum culling.
- Treat manual Three.js objects as lifecycle-managed resources.

### Current project pattern

- Point clouds, sphere meshes, ring geometry, and shader materials are all created in feature-local modules.
- Several components mutate material uniforms through refs after creation.

## 11. Comments

- Comment only when intent is not obvious from the code.
- Prefer explaining why a decision exists, not what the code already says.
- Keep comments short and local.
- Avoid comments that restate names or syntax.

### Current project pattern

- Comments are used sparingly in math-heavy or shader-heavy code.
- This is the right pattern for the project.

## 12. Documentation

- Documentation should describe the current architecture before describing future plans.
- Use docs to preserve project philosophy, engineering rules, architecture maps, performance guidance, and debt registers.
- Keep documentation aligned with the actual folder and module structure.
- If documentation disagrees with code, the code and this engineering record must be reconciled.

### Current project pattern

- `docs/` holds the broader project narrative and planning materials.
- `.ai/engineering/` holds engineering governance documents such as architecture maps, standards, and debt records.

## 13. Imports

- Prefer the `@/*` alias for imports that cross multiple levels of `src`.
- Use relative imports for nearby files inside the same subsystem.
- Keep import groups stable and readable.
- Do not use deep barrel imports if they hide the true dependency path.
- Import types explicitly when that improves clarity.
- Keep browser and Three.js imports local to the modules that need them.

### Current project pattern

- Cross-domain imports usually use `../core/...` or `../../core/...` inside `src`.
- Most feature internals use local relative imports.
- Barrels exist, but they should not obscure ownership.

## 14. Exports

- Use `index.ts` barrels intentionally.
- Export only the public surface of a domain, not every internal helper by default.
- Avoid re-exporting unstable internals unless they are part of the current public contract.
- Prefer explicit exports over wildcard exports when the module boundary matters.

### Current project pattern

- `core` and `features/universe` both expose barrels.
- Several helper modules are exported before they are truly central. That is acceptable only while they are part of active architectural shaping.

## 15. Formatting

- Follow Prettier as the formatting authority.
- Use two-space indentation.
- Use semicolons.
- Use double quotes.
- Use trailing commas where valid.
- Keep line width around the current project default.

### Current project pattern

- Formatting is already consistent across the workspace.
- ESM config files and TypeScript source should stay aligned with the existing Prettier style.

## 16. Architecture Rules

These are the project-specific rules that must guide new work.

- Preserve the engine-first structure.
- Keep rendering concerns in the universe layer or the engine layer, not in route code.
- Do not duplicate ownership of the same concept across multiple systems unless one is a compatibility layer.
- Keep director, timeline, camera, and performance concerns separate, even when they communicate closely.
- Keep scene data declarative and scene behavior composable.
- Keep GPU resources lifecycle-managed.
- Keep shader code close to the visual family that owns it.
- Keep the App Router shell thin.
- Prefer incremental evolution over architectural rewrites.

### Current project pattern

- The codebase already follows a modular cinematic engine shape.
- The main discipline needed now is consistency, lifecycle management, and reduction of duplicated ownership.

## 17. Practical Examples of “Do This, Not That”

- Put scene math in `cameraUtils.ts` rather than burying it in the page component.
- Put visual-specific shader code next to the visual family rather than in a global shader bucket too early.
- Put shared runtime state in Zustand rather than passing it through many React props.
- Put engine orchestration in `src/core` rather than in `src/app`.
- Put long-lived narrative policy in the director layer rather than in a render component.

## 18. Final Rule

If a new convention conflicts with the codebase’s current architecture, the codebase wins.

These standards are meant to keep the project coherent as it grows, not to force it into a generic frontend template.


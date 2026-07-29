# Rendering Engine Architecture

## Ownership boundaries

`src/engine` owns long-lived rendering state and is deliberately independent of React. It composes the scene, renderer, camera, animation, assets, audio, lighting, post-processing, loading, and performance managers through one `EngineController`.

`src/providers` owns browser and React lifecycle. Providers create one engine instance per mounted experience, expose it through context, and keep browser-only concerns such as Lenis and the WebGL canvas out of server components.

`src/components/experience` is the React Three Fiber bridge. It contains no story content: it attaches R3F objects to the engine, applies baseline lighting, reports viewport changes, and runs the engine frame loop.

## Data flow

```text
Root layout
  -> RootProviders
    -> ExperienceProvider (EngineController)
      -> ExperienceCanvas (lazy, client-only)
        -> R3F lifecycle bridge
          -> EngineController
            -> individual managers
```

Scenes should only consume the engine through `useExperience` or narrow manager APIs. They must not create additional global `WebGLRenderer`, `AudioListener`, or loader instances.

## Asset pipeline

The asset manager owns a single Three.js loading manager and cache-aware loader entry points. Textures are cached by URL. GLTF, Draco, KTX2, and HDRI loaders are lazy capabilities, so their code is only requested when a future scene needs them.

Public binary asset paths are grouped by medium under `public/assets`. Source scenes should reference a central asset manifest rather than duplicate URL literals.

## Performance policy

The engine clamps device pixel ratio, keeps anti-aliasing and render settings centralized, and samples frame timing against a 60 FPS target. Development-only diagnostics are isolated from production bundles. Scenes should use Suspense boundaries and lazy modules for heavy content, dispose GPU resources on unmount, and avoid creating assets in render loops.

## Extension policy

Add a scene under `src/scenes/<scene-name>` and register it through a future scene manifest. Add reusable visual primitives under `src/components/experience` or `src/scenes/shared`. Add a manager only when it owns a distinct lifecycle or resource family; otherwise extend the existing manager's focused public API.

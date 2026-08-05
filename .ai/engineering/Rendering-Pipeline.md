# AYENDA ODYSSEY RENDERING PIPELINE

This document describes the current rendering pipeline as implemented in the workspace today.

It is not a target architecture. It is a map of how rendering currently flows through the app.

## 1. Pipeline Overview

The rendering pipeline is centered on Next.js, React, R3F, and Three.js.

Current path:

1. `src/app/page.tsx` mounts the experience shell.
2. `EngineProvider` mounts engine, director, and timeline providers.
3. `EngineCanvas` creates the R3F canvas.
4. `CameraRig`, `EngineLighting`, and `SceneManager` are mounted inside the canvas.
5. `SceneManager` selects the current scene from the engine scene registry.
6. `UniverseScene` composes the current visual layer stack.
7. Feature components animate through `useFrame`, React effects, or store-derived props.

## 2. Render Ownership

### App shell

`src/app/page.tsx` owns the top-level composition of:

- engine provider
- audio provider
- cinematic overlay
- legacy shell content

### Engine shell

`src/core/engine/EngineProvider.tsx` owns:

- engine context creation
- director provider mounting
- timeline provider mounting
- loading state initialization

### Canvas shell

`src/core/renderer/EngineCanvas.tsx` owns:

- the R3F `Canvas`
- DPR selection
- WebGL performance flags
- physical light behavior configuration

### Scene shell

`src/core/scene/SceneManager.tsx` owns:

- scene lookup
- scene component selection
- the bridge from engine scene key to active scene component

### Universe composition

`src/features/universe/UniverseScene.tsx` owns:

- background
- nebula
- black hole
- dust
- starfield
- Earth
- identity reveal

## 3. Render Flow by Layer

### Background

`Background.tsx` renders a large sphere with a custom shader to create the deep-space base.

### Nebula

`Nebula.tsx` creates a shared plane geometry and renders layered shader quads through `NebulaLayer`.

### Black hole

`BlackHole.tsx` composes `EventHorizon` and `AccretionDisk`.

### Dust and stars

`GalaxyDust.tsx` and `Starfield.tsx` iterate layer definitions and render point-based visual systems.

### Earth and identity

`Earth.tsx` and `AyendaIdentity.tsx` render the transition beat toward brand identity.

## 4. Control Flow

Rendering is controlled by three state sources:

- `usePerformanceStore` controls density and DPR.
- `useDirectorStore` controls act, scene, mood, and timing.
- `useTimelineStore` advances the current elapsed time.

`useCinematicModeStore` controls overlay lock and replay state.

## 5. Frame Flow

The current runtime uses multiple frame-oriented systems:

- `useFrame` for camera motion and feature animation
- `requestAnimationFrame` in `TimelineManager`
- `requestAnimationFrame` in `DirectorOrchestrator`

This is functional, but it means frame ownership is distributed across more than one system.

## 6. Current Bottlenecks

The pipeline is most sensitive to:

- repeated geometry creation
- repeated material creation
- unbounded layer count growth
- multiple frame loops touching related state
- any future full-screen post-processing passes

## 7. Recommended Rendering Rules

- Keep render ownership local to the layer that owns the visual.
- Keep global canvas policy in `EngineCanvas`.
- Keep scene selection in `SceneManager`.
- Keep narrative state in the director layer.
- Keep per-frame work focused and necessary.
- Avoid introducing extra render loops unless they are clearly justified.
- Add post-processing only after the base scene budget is stable.


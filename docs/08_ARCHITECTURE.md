# Architecture

## System Overview
Ayenda Odyssey is built as an intention-driven cinematic engine. The architecture separates storytelling from rendering.

## Engine
- Manages scene composition and rendering surface.
- Hosts core visual systems: renderer, camera, universe content.

## Director
- The single source of storytelling truth.
- Broadcasts high-level intentions such as scene, mood, and transition.
- Does not render graphics directly.

## Timeline
- Tracks progress and timing.
- Provides a consistent sense of story pacing.
- Feeds systems with normalized progress values.

## Renderer
- Renders the 3D canvas.
- Executes scene graph updates.
- Avoids animation logic outside of visual drift.

## Camera
- Drives subtle, cinematic motion.
- Responds to director intentions, not raw input.
- Maintains a spacecraft-like mood.

## Universe
- Contains background, nebula, dust, stars, black hole.
- Provides a layered sense of depth.
- Reacts to director and timeline intentions.

## Future Systems
- Audio should subscribe to the director.
- UI should remain minimal and intent-driven.
- Black hole and planet systems should respond to narrative state.

## Dependency Philosophy
- Keep dependencies minimal and focused.
- Prefer internal services and clear contracts.
- Do not couple storytelling to rendering details.

## Folder Philosophy
- `src/core` contains core engine and systems.
- `src/features` contains content layers.
- `docs/` contains vision, rules, and architecture guidance.
- Keep boundaries clean and intentional.

# Performance Guidelines

## Performance Budget
- Maintain smooth rendering at all times.
- Keep the experience feeling premium, with no dropped frames.

## React Guidelines
- Avoid unnecessary re-renders.
- Keep state focused and minimal.
- Use hooks for subscription-based state, not broad context.
- Separate direction from render state.

## Three.js Guidelines
- Reuse geometries and materials.
- Create buffers once and avoid per-frame allocations.
- Use shader efficiency over expensive material effects.

## Memory Rules
- Keep asset lifetime predictable.
- Avoid dynamic creation in render loops.
- Use typed arrays for procedural content.

## Rendering Rules
- One pass rendering only.
- No additional post-processing.
- Keep draw call count minimal.

## Geometry Reuse
- Share geometry across repeated objects where possible.
- Prefer instancing only when it benefits performance.

## Material Reuse
- Reuse materials for visually similar objects.
- Keep shader variants minimal.

## FPS Targets
- Target 60 FPS on modern hardware.
- Maintain a smooth experience on the production scene.

## Optimization Philosophy
- Optimize for perception, not raw metrics.
- Prefer subtle visual economy over expensive effects.
- Keep systems composable and maintainable.

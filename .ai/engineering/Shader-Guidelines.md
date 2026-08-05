# AYENDA ODYSSEY SHADER GUIDELINES

This document describes how shaders are currently organized in the workspace and how new shader work should align with the existing architecture.

## 1. Current Shader Model

Shaders are feature-local.

The project currently uses GLSL strings or shader factories inside the visual module that owns the effect.

Current owners:

- `src/features/universe/Background.tsx`
- `src/features/universe/stars/starGenerator.ts`
- `src/features/universe/nebula/nebulaUtils.ts`
- `src/features/universe/blackhole/blackHoleShaders.ts`
- `src/features/universe/earth/Earth.tsx`
- `src/features/universe/identity/AyendaIdentity.tsx`

## 2. Ownership Rules

- Keep shader code with the visual feature that uses it.
- Do not move all shaders into a global file unless there is repeated, real reuse.
- Keep shader factories close to the geometry or material factory that uses them.
- Avoid cross-feature shader coupling unless the visual language is intentionally shared.

## 3. Uniform Rules

- Keep uniforms narrow and expressive.
- Use names that describe visual intent, not engine internals.
- Prefer a small set of stable uniforms over a large, highly mutable uniform surface.
- Update uniforms through refs when the shader is meant to stay alive across frames.

## 4. Blending and Depth Rules

- Use `transparent` only when the visual effect needs it.
- Use `depthWrite: false` for additive or layered atmospheric effects when appropriate.
- Use additive blending only for effects that should glow or accumulate light.
- Use normal blending for soft translucent layers that should not dominate the frame.
- Keep `frustumCulled={false}` limited to layers where the visual effect truly spans the scene.

## 5. Fragment Budget Rules

- Keep fragment shaders lean.
- Avoid adding expensive loops unless the visual payoff is necessary.
- Prefer low-iteration noise and domain warp over brute-force complexity.
- Avoid per-pixel branching that does not materially change the result.

## 6. Geometry and Shader Coupling

- Shader complexity should match geometry complexity.
- Point clouds should use point-specific shaders.
- Full-screen or background surfaces should keep their fragment cost low.
- Ring, sphere, and plane shaders should remain scoped to the object they render.

## 7. Current Patterns

- `Background.tsx` uses a custom shader on a sphere backdrop.
- `starGenerator.ts` creates point-cloud shaders with size, brightness, twinkle, and opacity control.
- `nebulaUtils.ts` uses FBM-style procedural noise on plane meshes.
- `blackHoleShaders.ts` provides disk shaders with glow and opacity controls.
- `Earth.tsx` contains the atmosphere shader inline because the effect is currently local and specific.
- `AyendaIdentity.tsx` contains the identity ring shader inline for the same reason.

## 8. Lifecycle Rules

- Treat shader materials as real resources.
- Reuse shader materials when the shader behavior is identical.
- Dispose materials when the owning component is torn down.
- Do not assume memoization alone is a lifecycle strategy.

## 9. Naming Rules

- Use descriptive shader variable names.
- Keep the shader module name aligned with the feature name.
- Use consistent `vertexShader`, `fragmentShader`, and uniform naming where local conventions allow it.

## 10. Evolution Rules

- If a shader pattern appears in multiple features, consider extracting helpers.
- If a shader is only used once, keep it local.
- If a shader starts carrying scene policy rather than visual math, move the policy out of the shader layer.


# AYENDA ODYSSEY TESTING STANDARDS

This document describes the current testing posture of the workspace and how future tests should align with the project as it exists now.

## 1. Current Testing Model

The codebase currently uses:

- Vitest for unit tests
- Playwright configured for end-to-end testing

The current test suite is state-heavy rather than rendering-heavy.

Existing tests cover:

- performance store behavior
- director scene registry behavior
- cinematic mode store behavior

## 2. What Must Be Tested

### State and orchestration

- store initialization
- store transitions
- director timing rules
- cinematic phase transitions
- performance profile logic

### Registry logic

- scene uniqueness
- act ordering
- duration calculations
- lookup helpers

### Engine contract

- provider composition
- scene selection behavior
- camera and timeline wiring
- loading state initialization

## 3. What Should Be Tested Lightly

- large shader math
- visual composition internals that are better validated by smoke checks
- per-frame scene motion details that are already driven by explicit math and R3F hooks

These areas should be smoke-tested or contract-tested rather than over-unit-tested.

## 4. What Should Not Be Over-Tested

- shader strings themselves unless a regression is likely
- visual constants that are intentionally art-directed
- one-off local React state that does not affect the engine

## 5. Current Test Placement

- unit tests belong under `tests/unit`
- tests should mirror the source domain path where practical
- state tests should live near the store domain they validate

## 6. Assertion Philosophy

- test what the engine promises
- test the contract, not the implementation detail, unless the implementation detail is the contract
- use precise assertions for timing, scene count, state transitions, and registry invariants
- prefer deterministic tests for stores and registry helpers

## 7. Existing Gaps

The current test suite does not yet cover:

- render flow smoke tests
- loading failures
- resource lifecycle behavior
- camera motion validation
- integration between director, timeline, and cinematic mode stores

## 8. Recommended Test Evolution

### Short term

- add tests for the director state transitions
- add tests for camera journey helpers
- add tests for timeline direction and playback edges

### Medium term

- add engine bootstrap tests
- add loading-state contract tests
- add integration tests for replay / skip flows

### Later

- add Playwright smoke tests for the runtime shell
- add visual regression checks when the scene set stabilizes


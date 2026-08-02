import { SceneRegistry } from "./SceneRegistry";

export function getActDuration(actNumber = 1) {
  // For now we only support Act I (the registry is Act I)
  return SceneRegistry.reduce((sum, s) => sum + s.duration, 0);
}

export function getSceneIndex(sceneKey: string) {
  return SceneRegistry.findIndex((s) => s.key === sceneKey);
}

export function getNextSceneKey(currentKey: string) {
  const idx = getSceneIndex(currentKey);
  if (idx < 0) return SceneRegistry[0].key;
  const next = SceneRegistry[idx + 1];
  return next ? next.key : SceneRegistry[0].key;
}

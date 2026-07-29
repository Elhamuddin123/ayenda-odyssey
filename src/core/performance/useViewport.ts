import { useThree } from "@react-three/fiber";

export function useViewport() {
  const { viewport, size } = useThree();
  return { viewport, size };
}

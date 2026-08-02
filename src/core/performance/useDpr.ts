import { useState } from "react";

export function useDpr() {
  const [dpr] = useState<[number, number]>(() => {
    const ratio = typeof window !== "undefined" ? Math.min(Math.max(window.devicePixelRatio, 1), 2) : 1;
    return [1, ratio];
  });

  return dpr;
}

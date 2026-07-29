import { useEffect, useState } from "react";

export function useDpr() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  useEffect(() => {
    const ratio = typeof window !== "undefined" ? Math.min(Math.max(window.devicePixelRatio, 1), 2) : 1;
    setDpr([1, ratio]);
  }, []);

  return dpr;
}

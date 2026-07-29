"use client";

export function EngineLighting() {
  return (
    <>
      <ambientLight intensity={0.45} color="#ffffff" />
      <directionalLight intensity={0.8} color="#ffffff" position={[5, 10, 8]} />
    </>
  );
}

"use client";

export function EngineLighting() {
  return (
    <>
      <ambientLight intensity={0.18} color="#0f2233" />
      <directionalLight intensity={0.38} color="#dbeffc" position={[5, 10, 8]} />
    </>
  );
}

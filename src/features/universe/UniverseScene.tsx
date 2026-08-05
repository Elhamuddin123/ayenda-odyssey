"use client";

import { Background } from "./Background";
import { Starfield } from "./stars";
import { Nebula } from "./nebula";
import { GalaxyDust } from "./dust";
import { BlackHole } from "./blackhole";
import { Earth } from "./earth/Earth";
import { AyendaIdentity } from "./identity/AyendaIdentity";
import { useCinematicMood } from "./useCinematicMood";

export function UniverseScene() {
  const mood = useCinematicMood();

  return (
    <>
      <Background />
      <Nebula opacityScale={mood.nebulaOpacity} />
      <BlackHole
        opacity={mood.blackHoleOpacity}
        scale={mood.blackHoleScale}
        diskOpacity={mood.diskOpacity}
        diskGlow={mood.diskGlow}
      />
      <GalaxyDust opacityScale={mood.dustOpacity} speedScale={mood.dustSpeed} />
      <Starfield opacityScale={mood.starOpacity} speedScale={mood.starSpeed} />
      <Earth
        opacity={mood.earthOpacity}
        scale={mood.earthScale}
        atmosphereOpacity={mood.atmosphereOpacity}
      />
      <AyendaIdentity opacity={mood.ayendaOpacity} />
    </>
  );
}

"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import React from "react";

export default function BloomComposer() {
  return (
    <EffectComposer multisampling={1} enableNormalPass={false}>
      <Bloom intensity={0.35} luminanceThreshold={0.2} luminanceSmoothing={0.85} radius={0.7} />
    </EffectComposer>
  );
}

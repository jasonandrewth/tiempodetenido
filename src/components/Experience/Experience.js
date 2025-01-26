import { MediaQueries } from "@/styles/mixins/MediaQueries";

import { Suspense } from "react";
import { useFrame, createPortal, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { OrbitControls, Environment, useEnvironment } from "@react-three/drei";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

import { useMotionValue, useSpring, transform } from "framer-motion";

//Components
import Placeholder from "./components/Placeholder";

import Model from "./components/Model";
import ImagePlane from "./components/ImagePlane";

//Hooks
// import { useDebug } from "@/hooks/useDebug";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Experience = () => {
  /**
   * Document Variables
   */
  const isDesktop = useMediaQuery(MediaQueries.hover);

  const isReady = useRef(false);

  const meshRef = useRef();

  return (
    <>
      <OrbitControls makeDefault />
      {/* <Environment map={texture} /> */}
      <directionalLight position={[2, 2, 5]} intensity={1} castShadow />
      {/* <hemisphereLight color={0xffffff} intensity={10.5} castShadow /> */}
      <ambientLight intensity={1} color={0xffffff} />
      <Suspense
        fallback={<Placeholder position={[0, 0, 0]} scale={[2, 2, 2]} />}
      >
        <Model />
      </Suspense>
      <ImagePlane />
    </>
  );
};

export default Experience;

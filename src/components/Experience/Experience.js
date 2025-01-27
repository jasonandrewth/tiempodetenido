import { MediaQueries } from "@/styles/mixins/MediaQueries";

import { Suspense } from "react";
import * as THREE from "three";
import { useFrame, createPortal, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import {
  OrbitControls,
  Environment,
  useEnvironment,
  useFBO,
  useTexture,
  shaderMaterial,
} from "@react-three/drei";
import { TextureLoader } from "three";
import { useLoader, extend } from "@react-three/fiber";

import { useMotionValue, useSpring, transform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

//Components
import Placeholder from "./components/Placeholder";

import Model from "./components/Model";
// import ImagePlane from "./components/ImagePlane";

//Hooks
// import { useDebug } from "@/hooks/useDebug";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGlobalData } from "@/context/Global";
//Shaders
import vertex from "./materials/shaders/background.vert";
import fragment from "./materials/shaders/background.frag";

const images = [
  "./testimgs/image1.jpg",
  "./testimgs/image2.jpg",
  "./testimgs/image3.jpg",
  "./testimgs/image4.jpg",
  "./testimgs/image5.jpg",
  "./testimgs/image6.jpg",
];

// DIFFUSE MATERIAL

const DiffuseMaterial = shaderMaterial(
  {
    uTime: 0,
    uRes: new THREE.Vector4(),
    uTextureDiffuse: null,
    uTextureDiffuseNext: null,
    uTextureFeedback: null,
    uColor: new THREE.Color(0x000000),
    uProgress: 0,
  },
  vertex,
  fragment
);
extend({ DiffuseMaterial });

const LINEAR_CONFIG = {
  type: "tween",
  ease: "linear",
  duration: 250,
};

const Experience = () => {
  /**
   * Document Variables
   */
  const isDesktop = useMediaQuery(MediaQueries.hover);

  const isReady = useRef(false);

  const meshRef = useRef();

  const { viewport, size, camera } = useThree();

  const { updateCurrentTexture, currentTexture } = useGlobalData();
  const animationFactor = useMotionValue(0);
  const linearSpringValue = useSpring(animationFactor, LINEAR_CONFIG);
  // Diffuse
  const planeRef = useRef(null);
  const materialRef = useRef(null);

  // Use the viewport width and height to set the scale of the plane
  const planeScale = [viewport.width, viewport.height, 1];

  // Framebuffer things
  const screenCamera = useRef(null);
  const quad = useRef(null);
  const mainScene = useMemo(() => new THREE.Scene(), []);
  const objectScene = useMemo(() => new THREE.Scene(), []);

  const renderBufferClean = useFBO(size.width, size.height, {
    format: THREE.RGBAFormat,

    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    stencilBuffer: false,
  });

  let renderBufferA = useFBO(size.width, size.height, {
    format: THREE.RGBAFormat,

    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
  });

  let renderBufferB = useFBO(size.width, size.height, {
    format: THREE.RGBAFormat,

    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
  });

  /**
   * Set Up Background
   */

  const textures = images.map((img) => useTexture(img));

  /**
   * TRANSITIONS
   */
  useEffect(() => {
    if (
      materialRef.current.uniforms.uTextureDiffuse.value !==
      textures[currentTexture]
    ) {
      animationFactor.set(1);
    } else {
      animationFactor.set(0);
    }
  }, [currentTexture]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTextureDiffuse.value =
        textures[currentTexture];
      materialRef.current.uniforms.uTextureDiffuseNext.value =
        textures[currentTexture + 1];
      materialRef.current.needsUpdate = true;
    }

    console.log(textures[currentTexture].image);
  }, []);
  //Switch textures for demo
  useEffect(() => {
    if (!materialRef.current) return;
    return;

    const interval = setInterval(() => {
      let temp = materialRef.current.uniforms.uTextureDiffuse.value;
      materialRef.current.uniforms.uTextureDiffuse.value =
        materialRef.current.uniforms.uTextureDiffuseNext.value;
      materialRef.current.uniforms.uTextureDiffuseNext.value = temp;
    }, 2000); // 2-second interval

    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, [materialRef.current, currentTexture]);

  //RESIZE CAM
  useEffect(() => {
    const handleResize = () => {
      // image cover
      const imageAspect = 960 / 820;
      let a1;
      let a2;
      if (size.height / size.width > imageAspect) {
        a1 = (size.width / size.height) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = size.height / size.width / imageAspect;
      }

      if (materialRef.current) {
        materialRef.current.uniforms.uRes.value.x = size.width;
        materialRef.current.uniforms.uRes.value.y = size.height;
        materialRef.current.uniforms.uRes.value.z = a1;
        materialRef.current.uniforms.uRes.value.w = a2;

        console.log(materialRef.current.uniforms.uRes, "resolution");
      }

      // const dist = camera.position.z;
      // const height = 1;
      // camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

      // // camera.fov = 75; // Set your desired FOV here
      // camera.aspect = size.width / size.height;

      // planeRef.current.scale.x = camera.aspect;
      // planeRef.current.scale.y = 1;

      // camera.updateProjectionMatrix();
      materialRef.current.needsUpdate = true;
    };

    handleResize(); // Set initial FOV and aspect ratio

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, size]);

  useGSAP(
    () => {
      if (
        materialRef.current.uniforms.uTextureDiffuse.value ==
        textures[currentTexture]
      )
        return;

      let prevTex = materialRef.current.uniforms.uTextureDiffuse.value;
      materialRef.current.uniforms.uTextureDiffuseNext.value =
        textures[currentTexture] ?? textures[0];
      //Animate progress
      gsap
        .fromTo(
          materialRef.current.uniforms.uProgress,
          { value: 0 },
          { value: 1, duration: 0.6, ease: "linear" }
        )
        .then(() => {
          materialRef.current.uniforms.uTextureDiffuse.value =
            materialRef.current.uniforms.uTextureDiffuseNext.value;

          materialRef.current.uniforms.uTextureDiffuseNext.value = prevTex;
        });
    },
    { dependencies: [currentTexture] }
  );

  /**
   * Main Frame Loop
   */

  useFrame((state, delta) => {
    const { gl, scene, camera, clock, pointer, viewport } = state;

    const linearAnimFactor = linearSpringValue.get();
    console.log(linearAnimFactor, "linam");

    const elapsedTime = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsedTime;
    }

    //Off screen
    gl.autoClearColor = false;

    materialRef.current.uniforms.uTextureFeedback.value = renderBufferA.texture;

    gl.setRenderTarget(renderBufferB);

    gl.render(mainScene, camera);

    // Render our basic scene to separate Framebuffer
    // gl.setRenderTarget(renderBufferClean);
    // // gl.clearColor();
    // gl.render(mainScene, camera);

    // console.log(renderBufferClean.texture.image);

    // gl.setRenderTarget(renderBufferClean);
    // if (renderBufferB.texture) {
    //   renderBufferB.texture.generateMipmaps = false;
    //   quad.current.material.map = renderBufferA.texture;
    // }
    // gl.render(mainScene, camera);

    gl.setRenderTarget(null);
    if (renderBufferClean.texture) {
      renderBufferClean.texture.generateMipmaps = false;
      quad.current.material.map = renderBufferClean.texture;
    }
    gl.render(mainScene, camera);

    // //Use for debugging
    // gl.clearColor();
    // gl.render(mainScene, camera);

    const swap = renderBufferA;
    renderBufferA = renderBufferB;
    renderBufferB = swap;

    // quad.current.material.map = renderBufferB.texture;
  });

  return (
    <>
      {createPortal(
        <>
          {/* <OrbitControls makeDefault /> */}
          {/* <Environment map={texture} /> */}
          <directionalLight position={[2, 2, 5]} intensity={1} castShadow />
          {/* <hemisphereLight color={0xffffff} intensity={10.5} castShadow /> */}
          <ambientLight intensity={1} color={0xffffff} />
          <Suspense
            fallback={<Placeholder position={[0, 0, 0]} scale={[2, 2, 2]} />}
          >
            <Model />
          </Suspense>
        </>,
        objectScene
      )}
      {createPortal(
        <>
          {/* <ImagePlane /> */}
          <mesh
            ref={planeRef}
            scale={planeScale}
            receiveShadow
            rotation={[0, 0, 0]}
            position={[0, 0, 0]}
          >
            <planeGeometry args={[1, 1]} /> {/* Plane size is normalized */}
            {/* <meshBasicMaterial color={0xff0000} /> */}
            <diffuseMaterial
              ref={materialRef}
              side={THREE.DoubleSide}
              wireframe={false}
              key="fadeMaterial"
              transparent={true}
              generateMipmaps={true}
            />
            {/* <meshBasicMaterial color={0xff0000} /> */}
          </mesh>
        </>,
        mainScene
      )}

      <mesh
        ref={quad}
        scale={planeScale}
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[1, 1]} /> {/* Plane size is normalized */}
        <meshBasicMaterial
          map={null}
          // color={0xff0000}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
};

export default Experience;

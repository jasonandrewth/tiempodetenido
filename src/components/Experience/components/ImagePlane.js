import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  useLoader,
  useFrame,
  useThree,
  extend,
  createPortal,
} from "@react-three/fiber";
import {
  useTexture,
  shaderMaterial,
  useFBO,
  OrthographicCamera,
} from "@react-three/drei";

//Shaders
import vertex from "../materials/shaders/background.vert";
import fragment from "../materials/shaders/background.frag";

const DiffuseMaterial = shaderMaterial(
  {
    uTime: 0,
    uRes: new THREE.Vector4(),
    uTextureDiffuse: null,
    uTextureDiffuseNext: null,
    uColor: new THREE.Color(0x000000),
  },
  vertex,
  fragment
);
extend({ DiffuseMaterial });

const ImagePlane = () => {
  const { viewport, size, camera } = useThree();
  const planeRef = useRef(null);
  const materialRef = useRef(null);

  // Framebuffer things
  const screenCamera = useRef(null);
  const quad = useRef(null);
  const mainScene = useMemo(() => new THREE.Scene(), []);

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

  // Use the viewport width and height to set the scale of the plane
  const planeScale = [viewport.width, viewport.height, 1];

  const texture = useTexture("./testimgs/image6.jpg");
  const texture2 = useTexture("./testimgs/image3.jpg");

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTextureDiffuse.value = texture;
      materialRef.current.uniforms.uTextureDiffuseNext.value = texture2;
      materialRef.current.needsUpdate = true;
    }
  }, [texture, texture2]);

  useEffect(() => {
    if (!materialRef.current) return;

    const interval = setInterval(() => {
      let temp = materialRef.current.uniforms.uTextureDiffuse.value;
      materialRef.current.uniforms.uTextureDiffuse.value =
        materialRef.current.uniforms.uTextureDiffuseNext.value;
      materialRef.current.uniforms.uTextureDiffuseNext.value = temp;
    }, 2500); // 2-second interval

    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, [materialRef.current, texture, texture2]);

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

  // auto-rotate
  useFrame((state, delta) => {
    const { gl, scene, camera, clock, pointer, viewport } = state;

    const elapsedTime = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsedTime;
    }
  });

  return (
    <>
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
          generateMipmaps={false}
        />
      </mesh>

      {/* <OrthographicCamera ref={screenCamera} position={[0, 0, 100]} /> */}
    </>
  );
};

export default ImagePlane;

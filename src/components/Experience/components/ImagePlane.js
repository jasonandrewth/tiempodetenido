import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useLoader, useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";

//Shaders
import vertex from "../Materials/shaders/background.vert";
import fragment from "../Materials/shaders/background.frag";

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
  const { viewport, size } = useThree();
  const planeRef = useRef(null);
  const materialRef = useRef(null);

  // Use the viewport width and height to set the scale of the plane
  const planeScale = [viewport.width, viewport.height, 1];

  const texture = useTexture("./testimgs/image6.jpg");
  const texture2 = useTexture("./testimgs/fire.jpg");

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTextureDiffuse.value = texture;
      materialRef.current.uniforms.uTextureDiffuseNext.value = texture2;
      materialRef.current.needsUpdate = true;
    }
  }, [texture, texture2]);

  useEffect(() => {
    if (!materialRef.current) return;
    return;
    const interval = setInterval(() => {
      let temp = materialRef.current.uniforms.uTextureDiffuse.value;
      materialRef.current.uniforms.uTextureDiffuse.value =
        materialRef.current.uniforms.uTextureDiffuseNext.value;
      materialRef.current.uniforms.uTextureDiffuseNext.value = temp;
    }, 2500); // 2-second interval

    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, [materialRef.current, texture, texture2]);

  // auto-rotate
  useFrame((state, delta) => {
    const { gl, scene, camera, clock, pointer, viewport } = state;

    const elapsedTime = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsedTime;
    }
  });

  return (
    <mesh ref={planeRef} scale={planeScale} receiveShadow>
      <planeGeometry args={[1, 1]} /> {/* Plane size is normalized */}
      {/* <meshBasicMaterial color={0xff0000} /> */}
      <diffuseMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
        wireframe={false}
        key="fadeMaterial"
        transparent={true}
        generateMipmaps={false}
        // transparent={!isPlaying}
      />
    </mesh>
  );
};

export default ImagePlane;

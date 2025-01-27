import { useRef } from "react";
import { MeshStandardMaterial } from "three";
import { useGLTF, Clone } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader, useFrame } from "@react-three/fiber";

const Model = () => {
  const model = useGLTF("./Models/camera.glb");

  const rotationRef = useRef(null);

  // console.log(model.scene);

  const testMat = new MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.0,
    roughness: 0.1,
  });

  // auto-rotate
  useFrame((state, delta) => {
    if (rotationRef.current) {
      //   rotationRef.current.rotation.y += delta * 0.5;
      rotationRef.current.rotation.y += delta * 0.15;
      // console.log(rotationRef.current.rotation.y);
    }
  });

  return (
    <>
      <Clone
        visible={false}
        ref={rotationRef}
        // ref={rotationRef}
        object={model.scene}
        // modelViewMatrix={model.scene.children[0].modelViewMatrix}
        scale={0.05}
        // rotation-y={Math.PI * 0.5}
        // rotation-x={Math.PI * 0.15}
        position={[0, 0, 0]}
      />
      <group
        visible={false}
        ref={rotationRef}
        scale={0.25}
        // rotation-y={Math.PI * 0.5}
        position={[0, -0.5, 0]}
        castShadow
      >
        <mesh
          geometry={model.scene.children[0].geometry}
          // material={model.scene.children[0].material}
          material={testMat}
          castShadow
          // modelViewMatrix={model.scene.children[0].modelViewMatrix}
        />
      </group>
    </>
  );

  return (
    <>
      <Clone object={model.scene} scale={0.35} />
      <Clone object={model.scene} scale={0.35} position-x={-4} />
      <Clone object={model.scene} scale={0.35} position-x={4} />
    </>
  );
};

useGLTF.preload("./Models/camera.glb");

export default Model;

import { useRef } from "react";
import { MeshStandardMaterial } from "three";
import { useGLTF, Clone } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader, useFrame } from "@react-three/fiber";

const Model = () => {
  const model = useGLTF("./Models/chairtestcenter.glb");

  const rotationRef = useRef(null);

  // console.log(model.scene);

  const testMat = new MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.0,
    roughness: 0.4,
  });

  // auto-rotate
  useFrame((state, delta) => {
    if (rotationRef.current) {
      // rotationRef.current.rotation.y += delta * 0.5;
      rotationRef.current.rotation.y += delta * 0.15;
      // console.log(rotationRef.current.rotation.y);
    }
  });

  return (
    <>
      {/* <Clone
        visible={true}
        ref={rotationRef}
        // ref={rotationRef}
        object={model.scene}
        // modelViewMatrix={model.scene.children[0].modelViewMatrix}
        scale={0.8}
        // rotation-y={Math.PI * 0.5}
        // rotation-x={Math.PI * 0.15}
        position={[0.4, 0, 0]}
      /> */}
      <group
        visible={true}
        ref={rotationRef}
        scale={0.8}
        rotation-x={Math.PI * 0.01}
        position={[0.0, 0, 0]}
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

useGLTF.preload("./Models/chairtestcenter.glb");

export default Model;

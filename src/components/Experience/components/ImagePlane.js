import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useLoader, useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";

//Shaders
// import vertex from "../Materials/shaders/background.vert";
// import fragment from "../Materials/shaders/background.frag";

const DiffuseMaterial = shaderMaterial(
  {
    uTime: 0,
    uRes: new THREE.Vector4(),
    uTextureDiffuse: null,
    uTextureDiffuseNext: null,
    uColor: new THREE.Color(0x000000),
  },
  `
  attribute vec2 uvref;
attribute float aSize;

uniform float uTime;
uniform float uSize;
uniform vec2 uRes;
uniform sampler2D uTextureDepth;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 newpos = position;

      // Final position
    vec4 modelPosition = modelMatrix * vec4(newpos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}

  `,
  `
  varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTextureDiffuse;
uniform sampler2D uTextureDiffuseNext;

float luminance(vec4 color) {
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

void main() {

    vec3 color = vec3(0.0, 0.0, 0.0);
    color = uColor;
    color.rg = vUv;
    vec2 smoothUV = smoothstep(0.0, 0.1, vUv);
    smoothUV *= vec2(smoothstep(0.0, 0.1, 1.0 - vUv));

    vec4 textureCurrent = texture2D(uTextureDiffuse, vUv);
    vec4 textureNext = texture2D(uTextureDiffuseNext, vUv);

    vec2 scaledUv = vUv * vec2(1.0);

    float luminanceDifference = abs(luminance(textureNext) - luminance(textureCurrent));

    vec2 colorDifferenceRG = textureNext.rg - textureCurrent.rg;
    vec2 direction = normalize(colorDifferenceRG + sin(uTime) * 0.5);

    //color1 in example touchdesigner
    scaledUv.rg += direction * (luminanceDifference * (sin(uTime) * 0.5 + 1.0) * smoothUV);

    // color.rg = scaledUv;
    scaledUv *= 0.05;

    // color.rgb = vec3(0.0);
    vec4 textureCurrentDisplaced = texture2D(uTextureDiffuse, vUv + scaledUv);
    vec4 textureNextDisplaced = texture2D(uTextureDiffuseNext, vUv + scaledUv);
    vec3 texNow = mix(textureCurrentDisplaced.rgb, textureNextDisplaced.rgb, (sin(uTime * 0.5) + 1.0) * 0.5);
    color.rgb = texNow.rgb;
    // color.rgb = vec3((sin(uTime) + 1.0) * 0.5);

    gl_FragColor = vec4(color, 0.3);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
  `
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

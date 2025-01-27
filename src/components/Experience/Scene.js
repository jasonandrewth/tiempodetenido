/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { Canvas } from "@react-three/fiber";

import Experience from "./Experience";
// import { useDebug } from "@/hooks/useDebug";

export default function Scene({ colorData, ...props }) {
  const path = usePathname();

  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <>
      <div
        className="canvas-wrapper"
        css={styles.wrapper}
        style={{
          "--color--background": "transparent",
        }}
      >
        <Canvas
          // camera={{ position: [0, 0, 4500], near: 0.01, far: 6000 }}
          // camera={{ fov: 25, position: [0, 0, 1.15], near: 0.001, far: 100 }}
          dpr={[1, 2]}
          {...props}
          style={{
            zIndex: 1,
          }}
          shadows
        >
          <Experience />
        </Canvas>
      </div>
    </>
  );
}

const styles = {
  wrapper: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100svh;
    height: 100vh;
    pointer-events: none;

    z-index: -1;

    &::after {
      content: " ";

      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 0;

      display: block;

      background-color: var(--color--background);
      /* background-image: linear-gradient(
        50deg,
        rgba(255, 255, 200, 0.2),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.5)
      ); */

      transition-property: opacity;
      transition-duration: 0ms;
      transition-delay: 1000ms;
      transition-timing-function: linear;
    }

    & canvas {
      opacity: 1;

      transition-property: opacity;
      transition-duration: 1000ms;
      transition-timing-function: linear;
    }

    &.isReady {
      &::after {
        opacity: 0;
      }

      & canvas {
        opacity: 1;
      }
    }
  `,
};

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { lerp } from "@superstructure.net/utils";
import { useMotionValue, useSpring } from "framer-motion";

function useViewOffset(offset = 0, cameraRef = null) {
   const { size, camera } = useThree();

   // setup motion values and springs
   const currentOffset = useMotionValue(offset * size.width);
   const currentOffsetSpring = useSpring(currentOffset, {
      type: "tween",
      duration: 2 * (parseFloat(currentOffset.version) <= 9 ? 1000 : 1), // workaround duration bug in old framer-motion version
   });

   useEffect(() => {
      currentOffset.set(offset * size.width);
   }, [size, offset]);

   // set initial view offset
   useEffect(() => {
      const currentCamera = cameraRef ? cameraRef.current : camera;

      if (currentCamera) {
         currentCamera.setViewOffset(size.width, size.height, 0, 0, size.width, size.height);
      }

      return () => {
         if (currentCamera) {
            currentCamera.clearViewOffset();
         }
      };
   }, [size.width, size.height]);

   // animate offset
   useFrame(() => {
      const currentCamera = cameraRef ? cameraRef.current : camera;

      if (!currentCamera) return;
      if (Math.abs(currentOffsetSpring.get() - currentCamera.view.offsetX) < 0.01) return;

      currentCamera.setViewOffset(size.width, size.height, currentOffsetSpring.get(), 0, size.width, size.height);
   });
}

export { useViewOffset };

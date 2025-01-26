import { useEffect, useRef } from "react";

const useFrameLoop = (callback) => {
  const frameRef = useRef(null);

  useEffect(() => {
    const loop = () => {
      callback(); // Call the provided callback to update values
      frameRef.current = requestAnimationFrame(loop); // Loop again
    };

    frameRef.current = requestAnimationFrame(loop); // Start the loop

    // Cleanup: Cancel animation frame when component unmounts
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [callback]); // Re-run the effect if the callback changes
};

export default useFrameLoop;

import { useEffect, useLayoutEffect, useState, useRef } from "react";

function useViewport() {
   const isClient = typeof window === "object";

   const [width, setWidth] = useState(isClient ? window.innerWidth : 0);
   const [height, setHeight] = useState(isClient ? window.innerHeight : 0);

   // eslint-disable-next-line no-use-before-define
   useLayoutEffect(() => {
      const onResize = () => {
         setWidth(isClient ? window.innerWidth : 0);
         setHeight(isClient ? window.innerHeight : 0);
      };

      window.addEventListener("resize", onResize);

      return () => {
         window.removeEventListener("resize", onResize);
      };
   }, [isClient]);

   return { width, height };
}

export { useViewport };

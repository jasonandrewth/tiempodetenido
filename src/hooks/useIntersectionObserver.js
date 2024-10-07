import { useState, useRef, useLayoutEffect, useCallback, useMemo } from "react";

import { useViewport } from "./useViewport";

/**
 * Tracks viewport visibility
 *
 */
function useIntersectionObserver(elementRef, _options) {
   const { width, height } = useViewport();

   const [inView, setInView] = useState(false);
   const options = useMemo(
      () => ({
         ...{
            root: null,
            rootMargin: "0px 0px 0px 0px",
            threshold: 0.0,
         },
         ..._options,
      }),
      [_options],
   );

   const observer = useRef(null);

   // resize event
   useLayoutEffect(() => {
      unobserve();
      observe();

      // unmount
      return () => {
         unobserve();
      };
   }, [width, height]);

   const onIntersect = useCallback(
      ([entry]) => {
         if (entry.isIntersecting) {
            setInView(true);
         } else {
            setInView(false);
         }
      },
      [setInView],
   );

   const observe = useCallback(() => {
      if (!elementRef.current) {
         return;
      }

      // console.log('useIntersectionObserver.observe()', options.current);
      if (observer.current) {
         unobserve();
      }

      observer.current = new IntersectionObserver(onIntersect, options);

      observer.current.observe(elementRef.current);
   }, [onIntersect, observer.current]);

   const unobserve = useCallback(() => {
      // console.log('useIntersectionObserver.unobserve()', elementRef);

      if (observer.current) {
         observer.current.disconnect();
         observer.current = null;
      }
   }, []);

   return { inView };
}

export { useIntersectionObserver };

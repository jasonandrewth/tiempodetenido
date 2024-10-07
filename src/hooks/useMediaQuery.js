import { useEffect, useState, useRef } from "react";

function useMediaQuery(query, defaultState = true) {
   const mediaQuery = useRef();
   const [matches, setMatches] = useState(defaultState);

   useEffect(() => {
      const isClient = typeof window === "object";

      function onChange() {
         setMatches(mediaQuery.current ? mediaQuery.current.matches : defaultState);
      }

      if (isClient) {
         mediaQuery.current = window.matchMedia(query);

         if (mediaQuery.current.addListener) {
            mediaQuery.current.addListener(onChange);
         } else if (mediaQuery.current.addEventListener) {
            mediaQuery.current.addEventListener("change", onChange);
         }

         setMatches(mediaQuery.current.matches);
      }

      return () => {
         if (mediaQuery.current) {
            if (mediaQuery.current.removeListener) {
               mediaQuery.current.removeListener(onChange);
            } else if (mediaQuery.current.removeEventListener) {
               mediaQuery.current.removeEventListener("change", onChange);
            }
         }
      };
   }, [query, defaultState]);

   return matches;
}

export { useMediaQuery };

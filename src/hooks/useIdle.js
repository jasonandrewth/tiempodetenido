import { useState, useEffect, useRef } from "react";

const useIdle = (delay, element) => {
   const [isIdle, setIsIdle] = useState(false);

   // create a new reference to track timer
   const timeoutId = useRef();

   // assign and remove the listeners
   useEffect(() => {
      let target;
      if (element.current) {
         target = element.current;
      } else {
         target = document;
      }

      setup(target);

      return () => {
         cleanUp(target);
      };
   }, []);

   const startTimer = () => {
      // wait till delay time before calling goInactive
      timeoutId.current = setTimeout(goInactive, delay);
   };

   const resetTimer = () => {
      //reset the timer and make user active
      clearTimeout(timeoutId.current);
      goActive();
   };

   const goInactive = () => {
      setIsIdle(true);
   };

   const goActive = () => {
      setIsIdle(false);

      // start the timer to track Inactiveness
      startTimer();
   };

   const setup = (target) => {
      target.addEventListener("mousemove", resetTimer, false);
      target.addEventListener("mousedown", resetTimer, false);
      target.addEventListener("keypress", resetTimer, false);
      target.addEventListener("DOMMouseScroll", resetTimer, false);
      target.addEventListener("mousewheel", resetTimer, false);
      target.addEventListener("touchmove", resetTimer, false);
      target.addEventListener("MSPointerMove", resetTimer, false);

      //edge case
      //if tab is changed or is out of focus
      window.addEventListener("blur", startTimer, false);
      window.addEventListener("focus", resetTimer, false);
   };

   const cleanUp = (target) => {
      target.removeEventListener("mousemove", resetTimer);
      target.removeEventListener("mousedown", resetTimer);
      target.removeEventListener("keypress", resetTimer);
      target.removeEventListener("DOMMouseScroll", resetTimer);
      target.removeEventListener("mousewheel", resetTimer);
      target.removeEventListener("touchmove", resetTimer);
      target.removeEventListener("MSPointerMove", resetTimer);

      //edge case
      //if tab is changed or is out of focus
      window.removeEventListener("blur", startTimer);
      window.removeEventListener("focus", resetTimer);

      // memory leak
      clearTimeout(timeoutId.current);
   };

   // return previous value (happens before update in useEffect above)
   return isIdle;
};

export default useIdle;

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

let easing = [0.175, 0.85, 0.42, 0.96];

const TransitionSetting = {
  initial: {
    y: "10%",

    opacity: 0,
  },
  exit: {
    y: "10%",

    opacity: 0,
    transition: {
      duration: 0.4,
      ease: easing,
    },
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      staggeringChildren: 2,
      duration: 0.4,
      ease: easing,
    },
  },
};

/**
 * Manual scroll restoration
 *
 */
function useScrollRestoration() {
  const pathname = usePathname();

  const scrollTop = useRef([0, 0]);
  const isBrowserHistory = useRef(false);

  useEffect(() => {
    scrollTop.current[1] = scrollTop.current[0];
    scrollTop.current[0] = document.scrollingElement.scrollTop;
  }, [pathname]);

  useEffect(() => {
    const onPopState = (event) => {
      console.log(
        `location: ${document.location}, state: ${JSON.stringify(event.state)}`
      );
      isBrowserHistory.current = true;
      setTimeout(() => {
        isBrowserHistory.current = false;
      }, 2000);
    };
    //   function onHashChangeStart() {}

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  function onExitComplete() {
    setTimeout(() => {
      // scroll to hash > ID
      let targetElement;
      const hash = pathname.split("#")?.[1];
      if (hash) {
        targetElement = document.querySelector(`#${hash}`);
      }

      document.scrollingElement.scrollTo({
        top: isBrowserHistory.current
          ? scrollTop.current[1]
          : targetElement
          ? targetElement.offsetTop
          : 0,
        behavior: "instant",
      });
    }, 1);
  }

  return { onExitComplete };
}

const PageTransitions = ({ children }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        initial="initial"
        animate="enter"
        exit="exit"
        key={pathname}
        variants={TransitionSetting}
        // transition={{ duration: 0.5 }}
        // style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitions;

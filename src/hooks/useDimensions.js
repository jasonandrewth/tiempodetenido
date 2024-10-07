import { useState, useMemo } from "react";
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

const isClient = typeof window === "object";

const ResizeObserver = isClient
  ? window.ResizeObserver || ResizeObserverPolyfill
  : undefined;

function useDimensions(elementRef) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  function updateDimensions() {
    if (!elementRef.current) return;
    if (!isClient) return;

    const bounds = elementRef.current.getBoundingClientRect();

    setDimensions({
      width: bounds.width,
      height: bounds.height,
      left: bounds.left,
      top: bounds.top,
    });
  }

  const observer = useMemo(
    () =>
      !isClient
        ? null
        : new ResizeObserver((entries) => {
            if (entries[0]) {
              updateDimensions();
            }
          }),
    []
  );

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current || !observer) {
      return;
    }

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [observer, elementRef]);

  return { dimensions, updateDimensions };
}

export { useDimensions };

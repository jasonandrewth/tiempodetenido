/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { MediaQueries } from "@/styles/mixins/MediaQueries";
import { useDimensions } from "@/hooks/useDimensions";

import {
  useState,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  act,
} from "react";
import Image from "next/image";

import { motion, useAnimation } from "framer-motion";

// import normalizeWheel from "normalize-wheel";

import useFrameLoop from "@/hooks/useFrameLoop";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// import { InView } from "react-intersection-observer";
import { useGlobalData } from "@/context/Global";

const images = [
  "/testimgs/image1.jpg",
  "/testimgs/image2.jpg",
  "/testimgs/image3.jpg",
  "/testimgs/image4.jpg",
  "/testimgs/image5.jpg",
  "/testimgs/image6.jpg",
];
/*
 *  MARQUEE
 *
 */

const Marquee = ({ slides = [] }) => {
  const containerRef = useRef(null); // Reference to the flexbox container
  const indicatorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const controls = useAnimation(); // Controls for the play indicator animation
  const resumeTimeout = useRef(null);
  const pauseDelay = 100;

  const { updateCurrentTexture, currentTexture } = useGlobalData();

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth; // Total scrollable width of the container
      const itemWidth = containerRef.current.children[0]?.offsetWidth || 0;
      const containerDuration = images.length * 6; // Duration for the play indicator to move across (in seconds)
      startIndicatorAnimation(containerWidth, containerDuration, itemWidth);
    }
  }, [containerRef.current]);

  const startIndicatorAnimation = (containerWidth, duration, itemWidth) => {
    controls.start({
      x: [0, containerWidth], // Animate from left to right
      transition: {
        duration: duration,
        repeat: Infinity, // Loop forever
        ease: "linear", // Smooth linear animation
      },
    });
  };

  // Stop the loop animation
  const stopLoopAnimation = () => {
    controls.stop();
  };

  const clickHandler = useCallback((e, idx) => {
    return;
    if (containerRef.current) {
      const itemWidth = containerRef.current.children[0]?.offsetWidth || 0;
      const targetX = itemWidth * idx; // Calculate target position for the clicked div

      // Pause the loop
      // stopLoopAnimation();
      setPaused(true);

      // Animate the indicator to the target position
      controls.start({
        x: targetX,
        transition: { duration: 0.5, ease: "easeInOut" },
      });

      // Set a timeout to resume the loop
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = setTimeout(() => {
        setPaused(false);

        // if (containerRef.current) {
        //   const containerWidth = containerRef.current.scrollWidth; // Total scrollable width of the container
        //   const itemWidth = containerRef.current.children[0]?.offsetWidth || 0;
        //   const containerDuration = images.length * 6; // Duration for the play indicator to move across (in seconds)
        //   startIndicatorAnimation(containerWidth, containerDuration, itemWidth);
        // }
      }, pauseDelay);

      // setActiveIndex(idx); // Update the active index
    }
  }, []);

  useFrameLoop(() => {
    if (containerRef.current && indicatorRef.current) {
      const container = containerRef.current;
      const indicator = indicatorRef.current;

      // Get the current position of the indicator
      const transformMatrix = window.getComputedStyle(indicator).transform;
      if (transformMatrix !== "none") {
        const translateX = new DOMMatrix(transformMatrix).m41; // Get X translation

        // Determine the active index
        const itemWidth = container.children[0]?.offsetWidth || 0;
        const currentIndex = Math.floor(
          (translateX % container.scrollWidth) / itemWidth
        );

        if (currentIndex !== activeIndex) {
          updateCurrentTexture(currentIndex);
          setActiveIndex(currentIndex); // Update the active index
        }
      }
    }
  });

  // Initialize the loop animation on mount
  useEffect(() => {
    if (!paused) startIndicatorAnimation();
    return () => clearTimeout(resumeTimeout.current); // Cleanup timeout on unmount
  }, [paused]);

  return (
    <header css={styles.header}>
      <div css={styles.marqueeItem} ref={containerRef}>
        {images.map((url, idx) => (
          <MediaItem
            key={idx}
            idx={idx}
            totalWidth={820}
            slide={1}
            clickHandler={clickHandler}
            url={url}
            isActive={idx === currentTexture}
          />
        ))}
      </div>

      <motion.div
        animate={controls}
        ref={indicatorRef}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "2px", // Indicator width
          backgroundColor: "#FF0000",
        }}
      />
    </header>
  );
};

/*
 *  MEDIA ITEM
 *
 */

function MediaItem({ idx, totalWidth, clickHandler, url, slide, isActive }) {
  const isHeadliner = slide.fieldGroupName == "Slides_Slides_Slides_Text";

  const itemRef = useRef(null);
  const imageRef = useRef(null);

  const [loaded, setLoaded] = useState(false);

  const image = slide.image;

  const scroll = null;

  // debug image decoding for immediate display
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.setAttribute("decoding", "sync");
      imageRef.current.decoding = "sync";
    }

    return () => {};
  }, []);

  const onLoadHandler = (e) => {
    setLoaded((prev) => true);
  };

  const aspect = 16 / 9;

  return (
    <div
      ref={itemRef}
      css={styles.imageWrapper}
      data-active={isActive}
      style={{ aspectRatio: aspect }}
      onClick={(e) => {
        clickHandler(e, idx);
      }}
    >
      <Image
        src={url}
        width={820}
        height={960}
        css={styles.image}
        alt={"Alt"}
        onLoad={onLoadHandler}
        sizes="160px"
        // priority={true}
        // decoding="sync"
        ref={imageRef}
      />

      <div
        css={styles.placeholder}
        style={{
          backgroundColor: "#000000",
        }}
      />
    </div>
  );
}

const styles = {
  header: css`
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: var(--gap-s);
    z-index: 1000;

    width: fit-content;

    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    height: 4rem;
    overflow: hidden;
  `,

  marqueeItem: css`
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    height: 100%;
    background-color: var(--color--black);

    will-change: transform;
  `,

  imageWrapper: css`
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    flex-grow: 0;
    height: 100%;

    background-color: blue;

    opacity: 0.4;

    cursor: pointer;

    transition: opacity 0.25s linear;

    &[data-active="true"] {
      opacity: 1;
    }
  `,

  image: css`
    position: relative;
    z-index: 10;

    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  `,

  placeholder: css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;

    display: block;
    width: 100%;
    height: 100%;
  `,
};

export default Marquee;

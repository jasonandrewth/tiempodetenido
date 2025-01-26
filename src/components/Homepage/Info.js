/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { MediaQueries } from "@/styles/mixins/MediaQueries";

import { useState } from "react";

const Info = () => {
  const [visible, setVisible] = useState(false);

  const clickHandler = () => {
    setVisible((prev) => !prev);
  };

  return (
    <header css={styles.header} data-visible={visible}>
      <span css={styles.logo}>Tiempo Detenido</span>
      <span css={styles.info} onClick={clickHandler}>
        {visible ? "close" : "info"}
      </span>
      <div css={styles.body}>
        <p>
          These one-of-a-kind chairs are crafted from volcanic rock sourced from
          the rich and historic landscapes of Mexico. Each piece embodies the
          essence of Tiempo Detenido ("Frozen Time"), capturing the stillness
          and majesty of the valley's tranquility, shaped by the land's volcanic
          history.
        </p>
        <br></br>
        <p>
          The design is inspired by the endless cycles of eruptions and the
          echoes of memories left behind within the craters. The chairs serve as
          a tribute to the repeated eruptions and the calm that follows,
          reflecting the balance between destruction and renewal. With their
          rugged yet refined surfaces, these chairs symbolize nature's
          timelessness and resilience, carrying the weight of geological
          transformations within their forms.
        </p>
        <br></br>
        <p>
          The volcanic rock's textures and patterns—formed over millennia—make
          each chair a unique work of art, with natural elements that tell
          stories of the land's ancient and ongoing evolution. As you sit within
          the curves of Tiempo Detenido, you become part of a narrative of both
          serenity and strength, rooted deeply in the volcanic heart of Mexico.
        </p>
      </div>
    </header>
  );
};

const styles = {
  header: css`
    z-index: 1;
    max-width: 50vw;
    font-size: var(--type--scale---1);

    * {
      text-transform: uppercase;
      font-size: var(--type--scale---1);
      line-height: var(--type--lineheight--1);
    }

    p {
      opacity: 0;
      transition: opacity 0.25s linear;
    }

    &[data-visible="true"] {
      p {
        opacity: 1;
      }
    }
  `,

  logo: css`
    font-family: var(--font-slyther);
    font-size: 1rem;
    line-height: var(--type--lineheight--0);
  `,

  body: css`
    position: absolute;
    width: 50%;
    left: 50%;
    transform: translate(-50%, 0);
    padding-top: var(--gap-s);

    /* background-color: red; */

    @media ${MediaQueries.mobile} {
      padding-top: var(--gap-s);
      width: 100%;
    }
  `,
  info: css`
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 0 0 16px 16px;

    z-index: 9999;
  `,
};

export default Info;

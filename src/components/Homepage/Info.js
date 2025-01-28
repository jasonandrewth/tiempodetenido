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
        <br></br>
        <span>
          {/* <a href="mailto:contact@tiempo-detenido.com"> */}
          contact@tiempo-detenido.com
          {/* </a> */}
        </span>
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
      user-select: none;
      pointer-events: none;
      transition: opacity 0.25s linear;
    }

    &[data-visible="true"] {
      p {
        opacity: 1;
        user-select: auto;
      }
    }
  `,

  logo: css`
    font-family: var(--font-slyther);
    font-size: 1.1rem;
    line-height: var(--type--lineheight--0);
  `,

  body: css`
    position: absolute;
    width: 50%;
    left: 0;
    transform: translate(0, 0);
    padding-top: var(--gap-s);

    color: rgba(255, 255, 255, 0.6);

    /* background-color: red; */

    span {
      color: var(--color--white);
      font-weight: 900;
    }

    @media ${MediaQueries.mobile} {
      padding-top: var(--gap-s);
      width: 80%;
    }
  `,
  info: css`
    position: absolute;
    font-weight: 900;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 0 0 16px 16px;

    z-index: 9999;
  `,
};

export default Info;

import { MediaQueries } from "../mixins/MediaQueries";

//  for syntax highlghting
const css = String.raw;

const Type = css`
   :root {
      /** 
     * Scale
     */
      --type--scale---3: 0.53rem;
      --type--scale---2: 0.66rem;
      //p1
      --type--scale---1: 0.75rem; // 0.7777
      //p2
      --type--scale---0: 1rem; // 1
      //h5
      --type--scale--1: 1.38rem; // 1.388
      //h4
      --type--scale--2: 1.55rem; // 1.55
      //h3
      --type--scale--3: 2rem; // 3
      //h2
      --type--scale--4: 2.66rem; // 3.75
      //h1
      --type--scale--5: 3.75rem; // 4.72

      /*
     * Fluid Size
     */
      --fluid--min-vw: 1380;
      --type--base-size: 18;
      --type--size: 1;
      --type--max--size: 24;

      /**
     * Line Height
     */
      --type--lineheight---1: 0.75;
      --type--lineheight--0: 1;
      --type--lineheight--1: 1.15;
      --type--lineheight--2: 1.35;
      --type--lineheight--3: 1.5;

      /**
     * Weight
     */
      --type--weight--light: 300;
      --type--weight--regular: 400;
      --type--weight--bold: 700;

      /**
     * Letter Spacing
     */
      --type--spacing---3: -0.04em;
      --type--spacing---2: -0.02em;
      --type--spacing---1: -0.01em;

      --type--spacing--1: 0.015em;
      --type--spacing--2: 0.03em;
      --type--spacing--3: 0.06em;

      @media ${MediaQueries.mobile} {
         --type--base-size: 16;

         --type--scale---2: 0.5rem;
         //p1
         --type--scale---1: 0.75rem; // 0.7777
         //p2
         --type--scale---0: 1rem; // 1
         //h5
         --type--scale--1: 1.25rem; // 1.388
         //h4
         --type--scale--2: 1.75rem; // 1.55
         //h3
         --type--scale--3: 2rem; // 3
         //h2
         --type--scale--4: 2.85rem; // 3.75
         //h1
         --type--scale--5: 4.5rem; // 4.72
      }
   }

   *,
   *::before,
   *::after {
      font-size: min(
         calc(var(--type--max--size) * 1px),
         max(calc(var(--type--base-size) * 1px), calc(var(--type--base-size) / var(--fluid--min-vw) * 100vw))
      );
   }

   html {
      line-height: var(--type--lineheight--0);

      font-kerning: normal;
      text-size-adjust: 100%;

      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
   }
`;

export { Type };

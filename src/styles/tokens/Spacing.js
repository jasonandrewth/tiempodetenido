import { MediaQueries } from "../mixins/MediaQueries";
//  for syntax highlghting
const css = String.raw;

const Spacing = css`
  :root {
    --gap-xs: 0.66rem;
    --gap-s: 0.88rem;
    --gap-m: 1.66rem;
    --gap-l: 2.55rem;
    --gap-xl: 3.66rem;

    --rounded-s: 1rem;
    --rounded-m: 4rem;
    --rounded-l: 5rem;

    @media ${MediaQueries.mobile} {
      --gap-m: 1.5rem;
      --gap-l: 2.25rem;
      --gap-xl: 3.18rem;
    }
  }
`;

export { Spacing };

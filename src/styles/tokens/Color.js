//  for syntax highlghting
const css = String.raw;

const ColorValues = {
  black: "#111111",
  white: "#fcfcfc",
  grey: "#f5f5f5",
  pink: "#fe1295",
};

const Color = css`
  :root {
    --color--black: ${ColorValues.black};
    --color--white: ${ColorValues.white};
    --color--grey: ${ColorValues.grey};
    --color--pink: ${ColorValues.pink};
  }
`;

export { ColorValues, Color };

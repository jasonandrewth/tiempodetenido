const css = String.raw;

const Document = css`
  *,
  *::before,
  *::after {
    --rk-fonts-body: neue-haas-grotesk-display, serif;

    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    min-height: 100vh;
    min-height: 100svh;
    margin: 0;
    /* font-family: neue-haas-grotesk-display, sans-serif; */
    font-weight: 500;
    font-style: normal;
    /* 
      font-family: miller-banner-ex-condensed, sans-serif;
      font-weight: 300;
      font-style: normal; */
  }

  html {
    scroll-behavior: smooth;
    font-family: sans-serif;
  }

  body {
    color: var(--color--white);
    background-color: var(--color--black);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul,
  ul li {
    margin: 0;
    padding: 0;
    text-indent: 0;
    list-style: none;
  }

  button,
  input[type="submit"],
  input[type="reset"] {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    display: block;
  }
`;

export { Document };

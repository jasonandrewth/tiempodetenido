const css = String.raw;

const Actions = {
   none: css`
      pointer-events: none;
      touch-action: none;
   `,

   auto: css`
      pointer-events: auto;
      touch-action: auto;
   `,
};

const Select = {
   none: css`
      user-select: none;
   `,

   auto: css`
      user-select: auto;
   `,

   text: css`
      user-select: text;
   `,
};

const Scroll = {
   x: css`
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
   `,

   y: css`
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
   `,

   none: css`
      overflow: hiden;
   `,
};

export { Actions, Select, Scroll };

import { css } from "@emotion/react";

import { Type } from "./tokens/Type";
import { Color } from "./tokens/Color";
import { Spacing } from "./tokens/Spacing";

import { Document } from "./components/Document";

const Global = css`
  // tokens
  ${Color}
  ${Type}
  ${Spacing}

  // global components
  ${Document}
`;

export { Global };

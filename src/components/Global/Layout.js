/** @jsxImportSource @emotion/react */
import { Global } from "@emotion/react";
import { Global as GlobalStyles } from "@/styles/Global";
import { MediaQueries } from "@/styles/mixins/MediaQueries";
import { css } from "@emotion/react";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import PageTransitions from "./PageTransitions";

import { Meta } from "@/components/Global/Head/Meta";
import { Favicons } from "@/components/Global/Head/Favicons";

//Providers
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { GlobalContextProvider } from "@/context/Global";
//Components
import Marquee from "../SubNav/Marquee";

const slytherRegular = localFont({
  src: "../../fonts/Slyther/Slyther-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-slyther",
});
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

//THREE JS
const Scene = dynamic(() => import("@/components/Experience/Scene"), {
  ssr: false,
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const Layout = ({ children }) => {
  const ref = useRef(null);

  const lenis = useLenis(({ scroll }) => {
    // called every scroll
  });

  return (
    <>
      <Meta />
      <Favicons />
      <Global styles={GlobalStyles} />
      {/* <MatomoAnalytics /> */}
      <ReactLenis root>
        <GlobalContextProvider>
          <main
            className={`${slytherRegular.variable} ${roboto.className}`}
            ref={ref}
            css={styles.wrapper}
          >
            <Scene eventSource={ref} eventPrefix="client" />
            <PageTransitions>{children}</PageTransitions>
            <Marquee />
          </main>
        </GlobalContextProvider>
      </ReactLenis>
    </>
  );
};

const styles = {
  wrapper: css`
    position: relative;

    margin: 0;
    padding: var(--gap-s);

    width: 100%;
    height: 100%;
    min-height: 100vh;

    box-sizing: border-box;

    @media ${MediaQueries.mobile} {
    }
  `,
  main: css`
    /* flex-grow: 1;  */

    @media ${MediaQueries.mobile} {
    }
  `,
};

export default Layout;

/** @jsxImportSource @emotion/react */
import { Global } from "@emotion/react";
import { Global as GlobalStyles } from "@/styles/Global";

// import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import PageTransitions from "./PageTransitions";

import { Meta } from "@/components/Global/Head/Meta";
import { Favicons } from "@/components/Global/Head/Favicons";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const Layout = ({ children }) => {
  return (
    <>
      <Meta />
      <Favicons />
      <Global styles={GlobalStyles} />
      {/* <MatomoAnalytics /> */}
      <main className={roboto.className}>
        <PageTransitions>{children}</PageTransitions>
      </main>
    </>
  );
};

export default Layout;

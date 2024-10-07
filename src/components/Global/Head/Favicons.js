import Head from "next/head";

function Favicons() {
  return (
    <Head>
      {/* <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.jpg" /> */}
      {/* <link rel="icon" type="image/jpg" sizes="32x32" href="/favicons/favicon-32x32.jpg" /> */}
      {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" /> */}
      {/* <link rel="manifest" href="/favicons/site.webmanifest" /> */}
      {/* <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000" /> */}
      {/* <meta name="msapplication-TileColor" content="#000000" /> */}
      {/* <meta name="theme-color" content="#cccccc" /> */}
      <link rel="icon" type="image/svg+xml" href="/favicons/logo.svg" />
    </Head>
  );
}

export { Favicons };

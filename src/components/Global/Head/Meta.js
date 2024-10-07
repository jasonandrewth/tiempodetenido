import Head from "next/head";

function Meta(props) {
  const meta = {};

  const defaults = {
    site: meta?.title ?? "2024 starter jason",
    title: "",
    description: meta?.description ?? "pages router starter jason",
    image: `/favicons/preview.png`,
  };

  //   console.info("Meta", meta, defaults, props);

  const { site, title, description, image } = {
    ...defaults,
    ...props,
  };

  return (
    <Head>
      <title>{`${title && `${title} — `}${site}`}</title>

      {description && <meta name="description" content={description} />}

      <meta property="og:site_name" content={site} />
      {description && <meta property="og:description" content={description} />}
      {title && <meta property="og:title" content={title} />}
      {image && <meta name="image" property="og:image" content={image} />}
      <meta property="og:type" content="website" />

      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content="index, follow" />
    </Head>
  );
}

export { Meta };

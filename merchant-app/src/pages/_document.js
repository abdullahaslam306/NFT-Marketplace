import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@mui/styles";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=optional"
            rel="stylesheet"
          ></link>
          <link rel="icon" href="/favicon.ico" />
          <meta
            content="BLOCommerce-Streamline your NFT activities."
            name="description"
          />
        </Head>
        <body>
          {process.env.NEXT_PUBLIC_ENV_KEY === "prod" && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
              <iframe
                title="google tag manager"
                src="https://www.googletagmanager.com/ns.html?id=GTM-MP9FZ4P"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>`,
              }}
            />
          )}
          {process.env.NEXT_PUBLIC_ENV_KEY === "stg" && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
              <iframe
                title="google tag manager"
                src="https://www.googletagmanager.com/ns.html?id=GTM-NM3CXN3"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>`,
              }}
            />
          )}
          {process.env.NEXT_PUBLIC_ENV_KEY === "dev" && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
                  <iframe
                    title="google tag manager"
                    src="https://www.googletagmanager.com/ns.html?id=GTM-WRNBLSG"
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                  ></iframe>
                `,
              }}
            />
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${
    process.env.NEXT_PUBLIC_ENV_KEY === "dev"
      ? "UA-216060823-1"
      : process.env.NEXT_PUBLIC_ENV_KEY === "stg"
      ? "UA-216060823-2"
      : "UA-216060823-3"
  }');
`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};

export default MyDocument;

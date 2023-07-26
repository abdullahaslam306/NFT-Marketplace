import Head from "next/head";
import { Provider } from "react-redux";
import { useStore } from "../store";
import "../themes/styles.css";
import Amplify from "aws-amplify";
import { AmplifyConfig } from "../utils/constants";
// import Script from "next/script";
import { ConfigureAmazonCloudWatch } from "../utils/ConfigureAmazonCloudWatch";

export default function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);
  Amplify.configure(AmplifyConfig);
  let ENV_KEY = process.env.NEXT_PUBLIC_ENV_KEY;

  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {process.env.NEXT_PUBLIC_ENV_KEY === "dev" && (
          <script
            id="google-tag"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WRNBLSG');`,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_ENV_KEY === "stg" && (
          <script
            id="google-tag"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NM3CXN3');`,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_ENV_KEY === "prod" && (
          <script
            id="google-tag"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MP9FZ4P');`,
            }}
          />
        )}
        <script
          id="amazon-tag"
          dangerouslySetInnerHTML={{
            __html: ConfigureAmazonCloudWatch[ENV_KEY],
          }}
        />
      </Head>

      <Component {...pageProps} />
    </Provider>
  );
}

import { useEffect } from "react";

export default function SendCryptoTag({ walletAddress = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'send_cryptocurrency', walletAddress: '${walletAddress}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

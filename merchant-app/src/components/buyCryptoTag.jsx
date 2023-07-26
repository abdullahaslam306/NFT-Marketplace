import { useEffect } from "react";

export default function BuyCryptoTag({ walletAddress = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'buy_cryptocurrency', walletAddress: '${walletAddress}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

import { useEffect } from "react";

export default function ReceiveCryptoTag({ walletAddress = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'receive_cryptocurrency', walletAddress: '${walletAddress}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

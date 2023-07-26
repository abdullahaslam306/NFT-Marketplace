import { useEffect } from "react";

export default function AddWalletTag({ walletAddress = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'add_wallet_button',walletAddress: '${walletAddress}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

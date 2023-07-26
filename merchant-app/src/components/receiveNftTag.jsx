import { useEffect } from "react";

export default function MintNFTTag({ email = "", walletAddress }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'receive_nft',user_email: '${email}', walletAddress: '${walletAddress}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

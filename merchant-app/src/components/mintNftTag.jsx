import { useEffect } from "react";

export default function MintNFTTag({ email = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'mint_nft',user_email: '${email}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

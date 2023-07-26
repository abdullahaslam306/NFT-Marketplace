import { useEffect } from "react";

export default function SocialShareTag({ email = "", nftId = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'social_share',user_email: '${email}', nftID: '${nftId}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

import { useEffect } from "react";

export default function NFTPreviewTag({ id = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'nftPreview',nftID: '${id}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

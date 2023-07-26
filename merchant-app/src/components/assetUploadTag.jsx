import { useEffect } from "react";

export default function AssetUploadTag({ email = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'asset_upload', user_email: '${email}'})`;
    document.body.append(script);
  }, []);

  return <></>;
}

import { useEffect } from "react";

export default function ImportSmartContractTag({ email = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'import_smartcontract_button', user_email: '${email}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

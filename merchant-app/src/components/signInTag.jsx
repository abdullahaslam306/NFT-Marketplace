import { useEffect } from "react";

export default function SignInTag({ email = "" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'signin_button',user_email: '${email}'} )`;
    document.body.append(script);
  }, []);

  return <></>;
}

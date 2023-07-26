import { useEffect } from "react";

export default function SignupTag({ auth = null }) {
  useEffect(() => {
    let resp = auth.signUpResponse && auth.signUpResponse.data;
    resp = JSON.parse(resp);
    const script = document.createElement("script");
    script.innerHTML = `dataLayer.push({event: 'signup', category:'Signup',user_email: '${
      resp.email || ""
    }'})`;
    document.body.append(script);
  }, []);

  return <></>;
}

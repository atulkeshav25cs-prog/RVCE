"use client";
import { useSignIn, useSignUp } from "@clerk/nextjs";

export default function TestClerk() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const getMethods = (obj: any) => {
    if (!obj) return [];
    try {
      let props: string[] = [];
      let curr = obj;
      do {
        props = props.concat(Object.getOwnPropertyNames(curr));
      } while ((curr = Object.getPrototypeOf(curr)));
      return Array.from(new Set(props)).filter(p => typeof obj[p] === 'function');
    } catch(e) { return ['Error']; }
  };

  console.log("== SIGNIN.SSO TYPE ==", typeof signIn?.sso);
  console.log("== SIGNIN.SSO TOSTRING ==", typeof signIn?.sso === 'function' ? signIn.sso.toString() : 'not func');
  
  return <div>Check Terminal</div>;
}

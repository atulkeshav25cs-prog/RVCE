"use client";

import { useSignIn, useSignUp, useSession, useUser } from "@clerk/nextjs";

export default function AuthTest() {
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const { session } = useSession();
  const { user } = useUser();

  const handleSignIn = async () => {
    try {
      await signIn?.sso({
        strategy: "oauth_google",
        redirectUrl: "/auth-test",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp?.sso({
        strategy: "oauth_google",
        redirectUrl: "/auth-test",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", backgroundColor: "white", color: "black", minHeight: "100vh" }}>
      <h1>Isolated Auth Test</h1>
      
      <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <button 
          onClick={handleSignIn} 
          style={{ padding: "10px 20px", background: "#4285F4", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Google Sign In
        </button>
        <button 
          onClick={handleSignUp} 
          style={{ padding: "10px 20px", background: "#34A853", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Google Sign Up
        </button>
      </div>

      <div style={{ border: "2px solid #ccc", padding: 20, marginTop: 20, borderRadius: "5px" }}>
        <h2>Current Session Status</h2>
        <p><strong>Session ID:</strong> {session ? session.id : "No active session"}</p>
        <p><strong>User ID:</strong> {user ? user.id : "None"}</p>
        <p><strong>User Email:</strong> {user?.primaryEmailAddress?.emailAddress || "None"}</p>
      </div>
    </div>
  );
}

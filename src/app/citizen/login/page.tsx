"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CitizenLogin() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthResult, setOauthResult] = useState<any>(null);

  const handleOAuth = async () => {
    console.log("Google button clicked");
    console.log("Object.keys(signIn):", signIn ? Object.keys(signIn) : "undefined");
    console.log("typeof signIn.sso:", signIn ? typeof signIn.sso : "undefined");
    console.log("Starting OAuth");
    
    try {
      const result = await signIn?.sso({
        strategy: "oauth_google",
        redirectUrl: "/citizen/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });
      setOauthResult(result);
      console.log("OAuth result JSON:", JSON.stringify(result, null, 2));
      console.dir(result);
      if (result?.error) {
        console.error("OAuth Error:", result.error);
        console.error("OAuth Error JSON:", JSON.stringify(result.error, null, 2));
      }
    } catch (err: any) {
      console.error("OAuth error caught:", err);
      console.error("Message:", err.message);
      console.error("Errors array:", err.errors);
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || "An unexpected error occurred during Google authentication.");
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn?.create({
        identifier: emailAddress,
      });

      const emailFactor = result?.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailFactor && emailFactor.strategy === "email_code") {
        const res = await signIn?.emailCode.sendCode({
          emailAddress: emailAddress,
        });
        if (res?.error) {
          throw res.error;
        }
        setVerifying(true);
      } else {
        setError("Email verification is not supported for this account.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "Failed to send code. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn?.emailCode.verifyCode({ code });
      
      if (res?.error) {
        throw res.error;
      }

      if (signIn?.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
        router.push("/citizen/dashboard");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] py-32 px-6">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-3xl w-full max-w-md shadow-glass">
        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.15em] mb-4 rounded-sm">
            Civilian Portal
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
            Secure Access
          </h1>
          <p className="text-white/60 font-medium text-sm">
            Authenticate to manage your safety profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {oauthResult && (
          <div className="mb-6 p-4 bg-black/50 border border-emerald-500/50 rounded-lg text-left overflow-auto">
            <h3 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">OAuth Debug Result</h3>
            <pre className="text-emerald-300 text-[10px] whitespace-pre-wrap">{JSON.stringify(oauthResult, null, 2)}</pre>
          </div>
        )}

        {!verifying ? (
          <>
            <button 
              onClick={handleOAuth}
              className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold uppercase tracking-wider text-xs py-4 rounded-lg hover:bg-slate-200 transition-all mb-8"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Login with Google
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-white/10 flex-grow"></div>
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Or login via email</span>
              <div className="h-px bg-white/10 flex-grow"></div>
            </div>

            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
                  placeholder="john@example.com" 
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-white text-slate-900 font-bold uppercase tracking-[0.1em] text-xs py-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Access Code"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-white/80 text-xs font-bold uppercase tracking-wider mb-2 text-center">Security Code</label>
              <p className="text-white/50 text-xs text-center mb-6">Enter the 6-digit code sent to {emailAddress}</p>
              <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-white/40 transition-colors" 
                placeholder="------"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-slate-900 font-bold uppercase tracking-[0.1em] text-xs py-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

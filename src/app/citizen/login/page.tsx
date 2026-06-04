"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CitizenLogin() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [verifying, setVerifying] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");

  const handleOAuth = async () => {
    try {
      setLoading(true);
      await signIn?.sso({
        strategy: "oauth_google",
        redirectUrl: "/citizen/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "OAuth failed.");
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create signIn attempt
      const result = await signIn?.create({
        identifier: emailAddress,
      });

      // 2. Check if email verification is supported
      const emailFactor = result?.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailFactor && emailFactor.strategy === "email_code") {
        // 3. Request Email OTP (v7 method)
        const res = await signIn?.emailCode.sendCode({
          emailAddressId: emailFactor.emailAddressId
        });
        if (res?.error) throw res.error;

        setVerifying(true);
      } else {
        setError("Email verification is not supported for this account.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "Failed to initiate login.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 4. Verify the OTP (v7 method)
      const res = await signIn?.emailCode.verifyCode({ code });
      if (res?.error) throw res.error;

      if (signIn?.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
        router.push("/citizen/dashboard");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Civilian Portal</h2>
          <p className="mt-2 text-center text-sm text-slate-400">Secure Access</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {!verifying ? (
          <>
            <button
              onClick={handleOAuth}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Continue with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or login via email</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-300">Email Address</label>
                <input required type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Access Code"}
              </button>
            </form>
          </>
        ) : (
          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label className="block text-sm font-medium text-slate-300 text-center mb-4">Enter 6-digit Verification Code</label>
              <input
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-4 px-3 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="------"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

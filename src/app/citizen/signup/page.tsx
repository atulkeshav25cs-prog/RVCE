"use client";

import { useState } from "react";
import { useSignIn, useSignUp, useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CitizenSignup() {
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phone: "",
    tc1Name: "", tc1Email: "", tc1Phone: "",
    tc2Name: "", tc2Email: "", tc2Phone: "",
    tc3Name: "", tc3Email: "", tc3Phone: "",
  });

  const handleOAuth = async () => {
    try {
      setLoading(true);
      await signIn?.sso({
        strategy: "oauth_google",
        redirectUrl: "/citizen/onboarding",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "OAuth failed.");
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create the user
      await signUp?.create({
        emailAddress: formData.emailAddress,
      });

      // 2. Attach public metadata
      const trustedContacts = [];
      if (formData.tc1Name) trustedContacts.push({ name: formData.tc1Name, email: formData.tc1Email, phone: formData.tc1Phone });
      if (formData.tc2Name) trustedContacts.push({ name: formData.tc2Name, email: formData.tc2Email, phone: formData.tc2Phone });
      if (formData.tc3Name) trustedContacts.push({ name: formData.tc3Name, email: formData.tc3Email, phone: formData.tc3Phone });

      await signUp?.update({
        publicMetadata: {
          role: "citizen",
          fullName: formData.fullName,
          phone: formData.phone,
          trustedContacts
        }
      });

      // 3. Request Email OTP (v7 method)
      const res = await signUp?.verifications.sendEmailCode();
      if (res?.error) throw res.error;

      setVerifying(true);
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || err.message || "Failed to initiate signup.");
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
      const res = await signUp?.verifications.verifyEmailCode({ code });
      if (res?.error) throw res.error;

      if (signUp?.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.push("/citizen/onboarding");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Citizen Registration</h2>
          <p className="mt-2 text-center text-sm text-slate-400">Join the National Emergency Authority</p>
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
                <span className="px-2 bg-slate-800 text-slate-400">Or register via email</span>
              </div>
            </div>

            <div id="clerk-captcha"></div>

            <form className="space-y-6" onSubmit={handleSignupSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">Email Address</label>
                  <input required type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300">Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-lg font-medium text-white mb-4">Trusted Contacts</h3>
                
                <div className="space-y-4 mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact 1 (Required)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input required placeholder="Name" name="tc1Name" value={formData.tc1Name} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                    <input type="email" placeholder="Email" name="tc1Email" value={formData.tc1Email} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                    <input required placeholder="Phone" name="tc1Phone" value={formData.tc1Phone} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact 2 (Optional)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input placeholder="Name" name="tc2Name" value={formData.tc2Name} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                    <input type="email" placeholder="Email" name="tc2Email" value={formData.tc2Email} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                    <input placeholder="Phone" name="tc2Phone" value={formData.tc2Phone} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact 3 (Optional)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input placeholder="Name" name="tc3Name" value={formData.tc3Name} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                    <input type="email" placeholder="Email" name="tc3Email" value={formData.tc3Email} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                    <input placeholder="Phone" name="tc3Phone" value={formData.tc3Phone} onChange={handleInputChange} className="block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white sm:text-sm" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity & Register"}
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

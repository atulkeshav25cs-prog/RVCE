import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4 bg-white/95 backdrop-blur-md border border-slate-200/50 p-12 rounded-3xl shadow-glass text-center relative z-10">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-900 font-bold uppercase tracking-widest text-sm">Authenticating Secure Connection</p>
        <p className="text-slate-500 text-xs font-medium">Please wait while we verify your identity...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
